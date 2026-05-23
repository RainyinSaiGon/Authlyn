# Security

This document captures security posture and implemented controls for Authlyn.

## Implemented Controls

### Authentication

| Control | Implementation | Notes |
| --- | --- | --- |
| Password hashing | BCrypt, cost factor 12 (configurable via `AUTHLYN_BCRYPT_STRENGTH`) | `PasswordConfig`, `BCryptPasswordEncoder` |
| Password complexity | 8–128 chars; requires uppercase, lowercase, digit, special character | `@StrongPassword` / `StrongPasswordValidator` |
| Credential timing safety | Email lookup + BCrypt verify always runs both steps | No early return that leaks user existence via timing |
| Login rate limiting | 10 attempts per 15 minutes per client IP; 429 on breach | `LoginRateLimitFilter`, Bucket4j 8.x |
| Refresh token storage | SHA-256 hashed before persistence; raw token only in HTTP response | `TokenUtil.sha256Hex` |
| Refresh token rotation | One-time use; successor issued in same transaction | `RefreshService` |
| Reuse detection | Presenting a rotated token triggers full session-family revocation + Redis blacklist | `RefreshService` — `replaced_by_token_id` chain |
| Session blacklist | Redis TTL-keyed markers; checked on every authenticated request | `RedisSessionStateService`, `JwtSessionStateValidator` |
| Access token validation | RS256 signature + issuer + exp + Redis session state (delegating validator) | `SecurityConfig.jwtDecoder` |
| OAuth2 social login | Provider identity linked via `IdentityEntity`; local session + JWT issued after OAuth2 success | `OAuth2LoginSuccessHandler` |

### Key Management

| Control | Implementation |
| --- | --- |
| Multi-strategy RSA key loading | `RsaKeyMaterialSource` strategy chain: inline PEM → Spring resource → filesystem → fallback |
| Public key derivation | Derived from CRT private key via `RSAPrivateCrtKey`; mismatch between configured public/private keys is rejected at startup |
| Ephemeral key fallback | 2048-bit RSA generated if no key is configured; changes on every restart (development only) |
| CRT signing performance | Measured at startup; JCA uses CRT decomposition when `RSAPrivateCrtKey` is exposed (typically 60–75% faster than raw modular exponentiation) |

### CORS and CSRF

- CSRF is disabled — correct for a stateless bearer-token API. There is no cookie session for an attacker to ride. Standard pattern for JWT-only APIs.
- CORS is configured via `CorsConfigurationSource` bean; allowed origins are controlled by `AUTHLYN_ALLOWED_ORIGINS` (default: `http://localhost:5173`).

---

## Threat Model Summary

### Session Hijacking

An attacker who intercepts a single refresh token cannot persist access:

1. Refresh token is SHA-256 hashed — stolen DB row is not directly usable.
2. Rotation means each token is one-time use — the next rotation by the legitimate client detects the reused token.
3. Reuse detection triggers full session-family revocation — the stolen token and its siblings are immediately blacklisted.
4. Redis blacklist enforces revocation on every subsequent request within the access token's TTL.
5. Short access token TTL (default 15 minutes) limits the blast radius even if session blacklist is bypassed.

**Layers of defence**: 5. An attacker needs to intercept the token AND use it before the legitimate client does AND do so without triggering the reuse detector. The `~95% session hijacking risk reduction` claim on the project CV is a threat-model estimate based on the combination of these five independent controls.

### Credential Stuffing

- Rate limited to 10 attempts / 15 minutes per IP.
- BCrypt with cost 12 adds ~200ms per attempt (hardware-dependent).
- Strong password policy rejects common password patterns at signup.

### Password Reset Abuse

- Reset tokens are one-time use; presenting a used or revoked token returns 401.
- Issuing a new reset request revokes any outstanding reset tokens for the same user.
- The endpoint returns 204 unconditionally — no signal about whether the email exists (prevents account enumeration).
- Successful reset revokes all active sessions and refresh tokens.

---

## Known Gaps (Production Readiness)

| Gap | Impact | Planned fix |
| --- | --- | --- |
| Signup not rate-limited | Account creation spam possible | Add `SignupRateLimitFilter` or extend `LoginRateLimitFilter` |
| Rate-limit state is in-process memory | Doesn't survive restart; doesn't share across instances | Switch Bucket4j to Redis-backed distributed rate limiter |
| No security headers (CSP, HSTS, X-Frame-Options) | Frontend XSS exposure | Add `SecurityHeadersFilter` or Helmet equivalent |
| Access token not blacklisted on logout | Up to 15-minute window after logout | Acceptable given short TTL + session state check; could add explicit access token JTI blacklist |
| Clock-skew grace period hardcoded at 5 seconds | Not configurable per environment | Expose as `authlyn.jwt.refresh-grace-seconds` property |
| `X-Forwarded-For` trusted unconditionally | IP spoofing if not behind a trusted proxy | Add `AUTHLYN_TRUSTED_PROXY_CIDRS` validation before trusting the header |

---

## Audit and Observability

- `audit_logs` table exists in schema with `actor_user_id`, `event_type`, `ip_address`, `details JSONB`. Service-layer write path is not yet implemented.
- Redis session-state keys follow the pattern `authlyn:session:revoked:{sessionId}` with TTL matching the session's `expires_at`.
- Actuator exposes `health`, `info`, and `prometheus` endpoints.
