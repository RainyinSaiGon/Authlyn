# Auth

This document tracks Authlyn authentication architecture and the implemented token infrastructure.

## Implemented (01-01)

### JWT + JWKS Infrastructure

- **`RsaKeyService`** (`shared.security.jwt`) — loads RSA keys from config (inline PEM, classpath/file path) or generates an ephemeral 2048-bit RSA pair at startup. Derives public key from CRT private key when only the private key is given. Validates that the public and private keys match before registering them.
- **`JwksController`** (`shared.security.jwt`) — serves `GET /.well-known/jwks.json` with the public JWK only (kid, kty, use, alg, n, e).
- **`SecurityConfig`** (`shared.config`) — configures the resource server (`oauth2ResourceServer.jwt`), registers `JwtEncoder` (NimbusJwtEncoder) and `JwtDecoder` (NimbusJwtDecoder.withPublicKey), and permits the JWKS path without authentication.
- **`AuthlynJwtProperties`** (`shared.security.jwt`) — `@ConfigurationProperties(prefix = "authlyn.jwt")` binding for issuer, kid, jwks-path, access-token-minutes, refresh-token-days, and key material.

### Key Resolution Order

1. Inline PEM via `authlyn.jwt.private-key` / `authlyn.jwt.public-key`
2. File or classpath path via `authlyn.jwt.private-key-path` / `authlyn.jwt.public-key-path`
3. Ephemeral 2048-bit RSA pair (development default; key changes on every restart)

### JwtDecoder Note

The `JwtDecoder` bean is built directly from the RSA public key (`NimbusJwtDecoder.withPublicKey`). This overrides Spring's auto-configured decoder that would fetch JWKS over HTTP — which would deadlock on startup because the server itself serves the JWKS endpoint.

---

## Planned Flows

The following are defined in the phased task plan and will be implemented in tasks 01-02 through 01-05.

### Sign-Up

```text
Client → POST /api/auth/signup
  → validate email uniqueness
  → hash password (bcrypt)
  → persist User (id, email, password_hash, created_at)
  → issue access token + refresh token
  → 201 {accessToken, refreshToken, user}
```

### Sign-In (Password)

```text
Client → POST /api/auth/login
  → look up user by email
  → verify bcrypt hash
  → create session record (device, IP, user-agent)
  → issue access token + refresh token
  → 200 {accessToken, refreshToken}
```

### Token Refresh

```text
Client → POST /api/auth/refresh
  → validate refresh token (DB lookup, expiry, revocation check)
  → issue new access token
  → optionally rotate refresh token (sliding window)
  → 200 {accessToken}
```

### Logout

```text
Client → POST /api/auth/logout
  → revoke refresh token in DB
  → 204
```

### Password Reset

```text
Client → POST /api/auth/forgot-password
  → generate reset token, persist expiry
  → send reset email
  → 204

Client → POST /api/auth/reset-password?token=<token>
  → validate token (expiry, single-use)
  → update hashed password
  → revoke all refresh tokens for that user
  → 200
```

---

## Open Decisions

- Token claims baseline per endpoint group (e.g., whether admin endpoints require a dedicated `admin` role claim)
- Session invalidation strategy across devices (revoke one vs. revoke all)
- Step-up authentication triggers (e.g., re-login required for sensitive account changes)
- Access token TTL vs. refresh rotation policy (absolute expiry vs. sliding window)

## Trust Boundaries

- The backend is the only token issuer; clients must never forge tokens.
- The JWKS endpoint is public (no auth required) — resource servers and clients use it to validate token signatures.
- Refresh tokens are opaque handles stored server-side; they carry no embedded user data.
- Private key material must not be logged or exposed in error responses.
- The frontend reads access tokens from memory (or localStorage) and sends them as `Authorization: Bearer <token>` headers; it never has access to the private key.

## See Also

- [JWT/JWKS Flow Diagrams](./jwt-jwks-flow.md)
- [Currently Implemented Flows](./current-implemented-flows.md)
- [Interfaces and Contracts](./interfaces.md)
- [API Endpoints](./api-endpoints.md)
