# Protected Endpoint — Sequence Diagrams

## Case 7a: Valid JWT — Success (GET /api/me)

```mermaid
sequenceDiagram
    participant C as Client
    participant Sec as SpringSecurity JwtDecoder
    participant Val as JwtSessionStateValidator
    participant Redis as Redis
    participant MC as MeController
    participant CUS as CurrentUserService
    participant DB as PostgreSQL

    C->>Sec: GET /api/me
    Note right of C: Authorization: Bearer accessToken
    Sec->>Sec: NimbusJwtDecoder.decode(accessToken)
    Note over Sec: 1. Verify RS256 signature with loaded public key
    Note over Sec: 2. Check iss == configured issuer
    Note over Sec: 3. Check exp > now (not expired)
    Sec->>Val: validate(jwt)
    Note over Val: Try claim names in order: "sid", "session_id", "sessionId"
    Val->>Redis: EXISTS authlyn:session:revoked:{sessionId}
    Redis-->>Val: false (session active)
    Val-->>Sec: OAuth2TokenValidatorResult.success()
    Note over Sec: SecurityContext populated with authenticated Jwt principal
    Sec->>MC: GET /api/me (jwt injected via @AuthenticationPrincipal)
    MC->>CUS: getCurrentUser(UUID.fromString(jwt.sub))
    CUS->>DB: findById(userId)
    DB-->>CUS: UserEntity
    CUS-->>MC: MeResponse {id, email, emailVerified, displayName, createdAt}
    MC-->>C: 200 OK {id, email, emailVerified, displayName, createdAt}
```

## Case 7b: Expired JWT

```mermaid
sequenceDiagram
    participant C as Client
    participant Sec as SpringSecurity JwtDecoder

    C->>Sec: GET /api/me
    Note right of C: Authorization: Bearer expiredToken
    Sec->>Sec: NimbusJwtDecoder.decode(expiredToken)
    Note over Sec: RS256 signature valid
    Note over Sec: exp < now → JWT expired
    Note over Sec: JwtValidators throws validation failure — JwtSessionStateValidator never called
    Sec-->>C: 401 Unauthorized
    Note right of C: WWW-Authenticate: Bearer error="invalid_token", error_description="..."
    Note over C: Client must call POST /api/public/auth/refresh to get new access token
```

## Case 7c: Revoked Session — Redis Blocklist Stops Valid JWT

```mermaid
sequenceDiagram
    participant C as Client
    participant Sec as SpringSecurity JwtDecoder
    participant Val as JwtSessionStateValidator
    participant Redis as Redis

    Note over C: JWT not yet expired (within 15-min TTL)
    Note over C: But session was revoked — e.g., user logged out on another device
    C->>Sec: GET /api/me
    Note right of C: Authorization: Bearer stillValidToken
    Sec->>Sec: NimbusJwtDecoder.decode(token)
    Note over Sec: RS256 signature valid ✓
    Note over Sec: exp > now — not expired ✓
    Note over Sec: issuer valid ✓
    Sec->>Val: validate(jwt)
    Note over Val: Extract sid claim from JWT
    Val->>Redis: EXISTS authlyn:session:revoked:{sessionId}
    Redis-->>Val: true (session blocklisted — e.g., by logout or reuse detection)
    Val-->>Sec: OAuth2TokenValidatorResult.failure("Session revoked")
    Sec-->>C: 401 Unauthorized
    Note right of C: Cryptographically valid JWT rejected by custom validator
    Note right of C: No refresh possible — refresh tokens for this session are also revoked
    Note over C: Client must redirect to login
```

## Case 7d: No sid Claim in JWT (Legacy or External Token)

```mermaid
sequenceDiagram
    participant C as Client
    participant Sec as SpringSecurity JwtDecoder
    participant Val as JwtSessionStateValidator
    participant MC as MeController

    C->>Sec: GET /api/me
    Note right of C: Authorization: Bearer tokenWithoutSid
    Sec->>Sec: NimbusJwtDecoder.decode(token)
    Note over Sec: Signature, issuer, expiry all valid
    Sec->>Val: validate(jwt)
    Note over Val: Check "sid", "session_id", "sessionId" — all blank/absent
    Note over Val: No session claim → skip Redis check (pass-through)
    Val-->>Sec: OAuth2TokenValidatorResult.success()
    Note over Sec: SecurityContext populated
    Sec->>MC: forward request
    MC-->>C: 200 OK (served normally — no revocation check possible)
```

## Case 7e: Missing Authorization Header

```mermaid
sequenceDiagram
    participant C as Client
    participant Sec as SpringSecurity

    C->>Sec: GET /api/me
    Note right of C: No Authorization header
    Note over Sec: /api/me is not in the public endpoint whitelist
    Note over Sec: No Bearer token found — authentication required
    Sec-->>C: 401 Unauthorized
    Note right of C: WWW-Authenticate: Bearer
```
