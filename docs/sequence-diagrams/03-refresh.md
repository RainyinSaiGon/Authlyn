# Refresh Token — Sequence Diagrams

## Case 3a: Happy Path (Token Rotation)

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant RS as RefreshService
    participant JT as JwtTokenService
    participant DB as PostgreSQL

    C->>AC: POST /api/public/auth/refresh
    Note right of C: {refreshToken: rawToken}
    AC->>RS: rotate(request)
    Note over RS: sha256Hex(rawToken) → tokenHash
    Note over RS: PESSIMISTIC_WRITE → SELECT...FOR UPDATE on refresh_tokens row
    RS->>DB: findByTokenHash(tokenHash) [row-level lock acquired]
    DB-->>RS: RefreshTokenEntity
    Note over RS: replacedByTokenId == null → not yet rotated ✓
    Note over RS: revokedAt == null → not directly revoked ✓
    Note over RS: expiresAt + 5s > now → not expired (5s grace window) ✓
    RS->>DB: findById(sessionId)
    DB-->>RS: SessionEntity (revokedAt == null → active ✓)
    Note over RS: SecureRandom 32 bytes → Base64url = newRawToken
    Note over RS: sha256Hex(newRawToken) = newTokenHash
    RS->>DB: INSERT refresh_tokens (newTokenHash, userId, sessionId, expiresAt=now+30d)
    Note over RS: Link chain — marks old token as consumed
    RS->>DB: UPDATE refresh_tokens SET replacedByTokenId=newTokenId WHERE id=oldId
    RS->>DB: UPDATE sessions SET lastSeenAt=now
    Note over DB: COMMIT → row lock released
    RS->>JT: issueAccessToken(userId, sessionId)
    Note over JT: New JWT: sub=userId, sid=sessionId, exp=now+15min, RS256
    JT-->>RS: newAccessToken
    RS-->>AC: RefreshResponse {accessToken, refreshToken, expiresAt}
    AC-->>C: 200 OK {accessToken, refreshToken, expiresAt}
```

## Case 3b: Reuse Detection — Stolen or Replayed Token

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant RS as RefreshService
    participant DB as PostgreSQL
    participant Redis as Redis

    Note over C: Attacker replays an already-rotated refresh token
    C->>AC: POST /api/public/auth/refresh
    Note right of C: {refreshToken: staleRawToken}
    AC->>RS: rotate(request)
    Note over RS: sha256Hex(staleRawToken) → tokenHash
    RS->>DB: findByTokenHash(tokenHash) [PESSIMISTIC_WRITE lock]
    DB-->>RS: RefreshTokenEntity (replacedByTokenId != null)
    Note over RS: replacedByTokenId != null → token already rotated
    Note over RS: REUSE DETECTED — full family revocation triggered
    RS->>DB: UPDATE refresh_tokens SET reuseDetected=true WHERE id=?
    RS->>Redis: SET authlyn:session:revoked:{sessionId} "reuse_detected" EX ttl
    Note over Redis: TTL = session.expiresAt — blocklists all JWTs for this session immediately
    RS->>DB: UPDATE refresh_tokens SET revokedAt=now, revokeReason="reuse_detected" WHERE sessionId=?
    RS->>DB: UPDATE sessions SET revokedAt=now, revokeReason="reuse_detected" WHERE id=?
    Note over RS: All tokens for this session are now dead — forces re-login
    RS-->>AC: throw ResponseStatusException(401 UNAUTHORIZED)
    AC-->>C: 401 Unauthorized {"error": "Refresh token reuse detected"}
```

## Case 3c: Concurrent Race — Pessimistic Lock Serializes Threads

```mermaid
sequenceDiagram
    participant T1 as Thread 1
    participant T2 as Thread 2
    participant DB as PostgreSQL

    Note over T1,T2: Both threads fire simultaneously with the same rawToken (CountDownLatch in test)

    T1->>DB: findByTokenHash(tokenHash) [SELECT...FOR UPDATE — acquires row lock]
    Note over DB: T1 holds lock — T2 blocks here

    T2->>DB: findByTokenHash(tokenHash) [SELECT...FOR UPDATE — BLOCKED by T1]

    Note over T1: replacedByTokenId == null → enters happy path
    T1->>DB: INSERT new RefreshToken
    T1->>DB: UPDATE old token SET replacedByTokenId = newToken.id
    T1->>DB: COMMIT (row lock released)
    DB-->>T1: 200 OK — rotation succeeded

    Note over DB: T2 unblocked — reads updated row
    DB-->>T2: RefreshTokenEntity (replacedByTokenId = newToken.id now)
    Note over T2: replacedByTokenId != null → REUSE DETECTED
    T2->>DB: UPDATE reuseDetected=true, revoke session family
    DB-->>T2: 401 Unauthorized — reuse detected

    Note over T1,T2: Result: exactly 1 success, N-1 rejections
    Note over T1,T2: Verified by RefreshServiceConcurrencyTest with 10 threads
```

## Case 3d: Token Already Directly Revoked

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant RS as RefreshService
    participant DB as PostgreSQL

    Note over C: Token was revoked by logout — not by rotation
    C->>AC: POST /api/public/auth/refresh
    Note right of C: {refreshToken: revokedRawToken}
    AC->>RS: rotate(request)
    RS->>DB: findByTokenHash(tokenHash) [PESSIMISTIC_WRITE]
    DB-->>RS: RefreshTokenEntity (replacedByTokenId=null, revokedAt != null)
    Note over RS: replacedByTokenId == null → not a reuse event
    Note over RS: revokedAt != null → directly revoked (e.g., by logout)
    RS-->>AC: throw ResponseStatusException(401 UNAUTHORIZED)
    AC-->>C: 401 Unauthorized {"error": "Refresh token revoked"}
```

## Case 3e: Token Expired

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant RS as RefreshService
    participant DB as PostgreSQL

    C->>AC: POST /api/public/auth/refresh
    Note right of C: {refreshToken: expiredRawToken}
    AC->>RS: rotate(request)
    RS->>DB: findByTokenHash(tokenHash) [PESSIMISTIC_WRITE]
    DB-->>RS: RefreshTokenEntity (replacedByTokenId=null, revokedAt=null)
    Note over RS: replacedByTokenId == null → ok
    Note over RS: revokedAt == null → ok
    Note over RS: expiresAt + 5s < now → EXPIRED
    Note over RS: 5-second grace window absorbs client clock skew
    RS-->>AC: throw ResponseStatusException(401 UNAUTHORIZED)
    AC-->>C: 401 Unauthorized {"error": "Refresh token expired"}
```

## Case 3f: Session Not Found or Revoked After Token Validation

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant RS as RefreshService
    participant DB as PostgreSQL

    C->>AC: POST /api/public/auth/refresh
    AC->>RS: rotate(request)
    RS->>DB: findByTokenHash(tokenHash) [PESSIMISTIC_WRITE]
    DB-->>RS: RefreshTokenEntity (valid — not rotated, not revoked, not expired)
    RS->>DB: findById(sessionId)
    DB-->>RS: SessionEntity (revokedAt != null)
    Note over RS: Session independently revoked (e.g., logout-all)
    RS-->>AC: throw ResponseStatusException(401 UNAUTHORIZED)
    AC-->>C: 401 Unauthorized {"error": "Session revoked"}
```
