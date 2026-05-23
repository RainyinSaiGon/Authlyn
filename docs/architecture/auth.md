# Auth

This document tracks Authlyn authentication architecture and the implemented token infrastructure.

## RSA Key Infrastructure

### RsaKeyService

`RsaKeyService` (`shared.security.jwt`) loads RSA keys at startup using a priority-ordered list of `RsaKeyMaterialSource` strategies:

| Strategy | Condition |
|---|---|
| `InlinePemKeyMaterialSource` | value contains `-----BEGIN ` |
| `SpringResourceKeyMaterialSource` | `classpath:` or `file:` prefix |
| `FilesystemKeyMaterialSource` | value is a readable filesystem path |
| `FallbackResourceKeyMaterialSource` | any non-null value (last resort) |

If no private key is configured the service generates a 2048-bit ephemeral RSA pair. On startup it measures signing throughput on the loaded key and runs a CRT-vs-non-CRT comparison, logging:

```
RSA signing key loaded; CRT form: true; throughput: X ns/op; CRT speedup vs non-CRT: Y%
```

Public key derivation requires `RSAPrivateCrtKey` — the CRT parameters (p, q, dp, dq, qInv) are mandatory both for deriving the public key and for the JCA provider to apply CRT decomposition during signing.

### JwksController

Serves `GET /.well-known/jwks.json` with the public JWK only (kid, kty, use, alg, n, e).

### SecurityConfig

Builds the security filter chain with:

1. `LoginRateLimitFilter` — 10 attempts per 15 minutes per client IP (Bucket4j), registered before `UsernamePasswordAuthenticationFilter`
2. `oauth2ResourceServer.jwt` — validates RS256 JWTs via `NimbusJwtDecoder`
3. `oauth2Login` — conditionally active when `ClientRegistrationRepository` is present (i.e., when Google/GitHub OAuth2 client IDs are configured)

The `JwtDecoder` is built directly from the RSA public key (`NimbusJwtDecoder.withPublicKey`), bypassing Spring's auto-configured JWKS-fetching decoder, which would deadlock because the server itself serves the JWKS endpoint.

### AuthlynJwtProperties

`@ConfigurationProperties(prefix = "authlyn.jwt")` binding for: issuer, kid, jwks-path, access-token-minutes, refresh-token-days, password-reset-token-minutes, and key material paths/values.

---

## Implemented Identity Flows

### Sign-Up

```text
Client → POST /api/public/auth/signup
  → validate: email format, @StrongPassword (8-128 chars, upper+lower+digit+special)
  → normalize email to lowercase
  → check email uniqueness (409 if taken)
  → BCrypt-hash password
  → persist User
  → create Session + RefreshToken
  → issue access JWT with sid claim
  → 201 {userId, sessionId, accessToken, refreshToken, createdAt}
```

### Sign-In (Password)

```text
Client → POST /api/public/auth/login
  → rate-limit check: 10 attempts / 15 min / IP (429 if exceeded)
  → look up user by normalized email (401 if not found or deleted)
  → BCrypt verify password (401 on mismatch)
  → create Session + RefreshToken
  → issue access JWT with sid claim
  → 200 {userId, sessionId, accessToken, refreshToken, expiresAt}
```

### Token Refresh (Rotation with Reuse Detection)

```text
Client → POST /api/public/auth/refresh
  → SHA-256 hash presented token, look up in DB
  → if replaced_by_token_id != null → REUSE DETECTED:
      mark reuseDetected=true
      mirror session to Redis blacklist
      revoke all refresh tokens in session family
      revoke session record
      → 401 Refresh token reuse detected
  → check revoked_at (401 if revoked)
  → check expires_at + 5s grace window (401 if expired; grace absorbs clock-skew retries)
  → load session, check revoked_at
  → create successor RefreshToken
  → set old token's replaced_by_token_id = new token id (atomic in transaction)
  → update session.last_seen_at
  → issue new access JWT
  → 200 {accessToken, refreshToken, accessTokenExpiresAt}
```

### Two-Layer JWT Validation

Every authenticated request passes through two validators in a `DelegatingOAuth2TokenValidator`:

1. **Standard claims** — `JwtValidators.createDefaultWithIssuer` checks `iss`, `exp`, signature
2. **Session state** — `JwtSessionStateValidator` reads the `sid` claim and checks `authlyn:session:revoked:{sid}` in Redis

A token that is cryptographically valid but whose session was revoked (logout, password reset, reuse detection) is rejected at layer 2. Revocation takes effect within milliseconds of the triggering action.

### Logout (Current Session)

```text
Client → POST /api/auth/logout
  → resolve sessionId from body or JWT sid claim
  → mirror session to Redis blacklist
  → revoke session record in DB
  → revoke refresh tokens for that session in DB
  → 204
```

### Logout All Sessions

```text
Client → POST /api/auth/logout-all
  → load all sessions for user
  → mirror each session to Redis blacklist
  → revoke all session records in DB
  → revoke all refresh tokens for user in DB
  → 204
```

### Password Reset

```text
Client → POST /api/public/auth/password-reset/request
  → normalize email
  → if user exists: revoke prior reset tokens, generate opaque token, SHA-256 hash + persist
  → send reset email via mail service (stubbed in dev)
  → 204 (constant shape — no account enumeration)

Client → POST /api/public/auth/password-reset/confirm
  → validate: @StrongPassword on newPassword
  → look up token by SHA-256 hash (401 if not found)
  → guard: used_at null, revoked_at null, expires_at > now (401 otherwise)
  → BCrypt-hash new password, update user
  → mark token used_at = now; revoke sibling tokens
  → revoke all sessions + refresh tokens for user
  → mirror all sessions to Redis blacklist
  → 204
```

### OAuth2 Social Login

```text
Client → GET /oauth2/authorization/{provider}  (Google or GitHub)
  → Spring Security redirects to provider
  → Provider authenticates user, redirects back

Provider → GET /login/oauth2/code/{provider}
  → OAuth2LoginSuccessHandler.onAuthenticationSuccess:
      extract provider, providerUserId (sub or id), email from OAuth2User attributes
      find-or-create UserEntity by email (emailVerified=true for OAuth2 users)
      find-or-create IdentityEntity (provider, providerUserId) → links to User
      create Session + RefreshToken
      issue access JWT with sid claim
  → redirect to ${authlyn.web.oauth2-redirect-uri}?access_token=...&refresh_token=...&session_id=...
```

`oauth2Login()` is only wired into the filter chain when at least one `ClientRegistrationRepository` entry is present. Without OAuth2 provider environment variables the entire code path is inactive; no startup failure occurs.

---

## Security Layering

| Layer | Control | Implementation |
|---|---|---|
| Transport | TLS enforced by deployment; local dev uses HTTP | — |
| Rate limiting | 10 login attempts / 15 min / IP | `LoginRateLimitFilter` (Bucket4j) |
| Password storage | BCrypt, configurable cost (default 12) | `PasswordConfig` |
| Password policy | 8–128 chars, upper + lower + digit + special | `@StrongPassword` / `StrongPasswordValidator` |
| Token storage | SHA-256 hashed refresh tokens; raw token only in transit | `TokenUtil.sha256Hex` |
| Token rotation | One-time use; successor issued atomically | `RefreshService` |
| Reuse detection | Second presentation triggers full session-family revocation | `RefreshService` |
| Session blacklist | Redis TTL-keyed revocation markers | `RedisSessionStateService` |
| JWT validation | Sig + issuer + exp + Redis session state per request | `JwtSessionStateValidator` |
| Provider linking | OAuth2 identities linked to local users; `IdentityEntity` tracks provider + providerUserId | `OAuth2LoginSuccessHandler` |

---

## Trust Boundaries

- The backend is the only token issuer; clients must never forge tokens.
- The JWKS endpoint is public — resource servers and clients use it to validate token signatures.
- Refresh tokens are opaque handles stored server-side; they carry no embedded user data.
- Private key material must not be logged or exposed in error responses.
- The frontend sends `Authorization: Bearer <token>` headers; it never has access to the private key.
- OAuth2 access tokens from external providers are never stored; only the provider user ID and email are persisted in `IdentityEntity`.

## Open Decisions

- Token claims baseline for admin endpoints (dedicated `admin` role claim vs. checked in service)
- Step-up authentication triggers for sensitive account changes
- Signup rate limiting (login rate limit is implemented; signup is not yet rate-limited)
- Grace-window configurability via `application.yml` (currently hardcoded 5 seconds)

## See Also

- [JWT/JWKS Flow Diagrams](./jwt-jwks-flow.md)
- [Currently Implemented Flows](./current-implemented-flows.md)
- [API Endpoints](./api-endpoints.md)
- [Security Controls](./security.md)
