# Password Reset — Sequence Diagrams

## Case 5a: Request — Email Found (User With Password)

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant PRS as PasswordResetService
    participant DB as PostgreSQL
    participant Mail as MailService

    C->>AC: POST /api/public/auth/password-reset/request
    Note right of C: {email}
    AC->>PRS: requestReset(request)
    Note over PRS: normalize email — lowercase + strip
    PRS->>DB: findByEmail(normalizedEmail)
    DB-->>PRS: UserEntity (deletedAt=null, passwordHash != blank)
    Note over PRS: Revoke any outstanding reset tokens first
    PRS->>DB: UPDATE password_reset_tokens SET revokedAt=now, revokeReason="password_reset_reissued" WHERE userId=? AND revokedAt IS NULL
    Note over PRS: SecureRandom 32 bytes → Base64url = rawToken
    Note over PRS: SHA-256(rawToken) = tokenHash
    PRS->>DB: INSERT password_reset_tokens (tokenHash, userId, issuedAt, expiresAt=now+60min)
    PRS->>Mail: send(to=user.email, subject, template="password-reset", {email, resetToken, expiresAt})
    Note over Mail: NoopMailService — logs only, no real SMTP sent
    Mail-->>PRS: void
    PRS-->>AC: void (always same response — no enumeration)
    AC-->>C: 204 No Content
```

## Case 5b: Request — Email Not Found (Silent Anti-Enumeration)

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant PRS as PasswordResetService
    participant DB as PostgreSQL

    C->>AC: POST /api/public/auth/password-reset/request
    Note right of C: {email: unknown@example.com}
    AC->>PRS: requestReset(request)
    PRS->>DB: findByEmail(normalizedEmail)
    DB-->>PRS: null (no user found)
    Note over PRS: Return silently — no token, no mail, no error
    Note over PRS: Identical response to the found case (prevents user enumeration)
    PRS-->>AC: void
    AC-->>C: 204 No Content
```

## Case 5c: Request — OAuth-Only User (No Password Hash)

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant PRS as PasswordResetService
    participant DB as PostgreSQL

    C->>AC: POST /api/public/auth/password-reset/request
    Note right of C: {email: oauth-only@example.com}
    AC->>PRS: requestReset(request)
    PRS->>DB: findByEmail(normalizedEmail)
    DB-->>PRS: UserEntity (passwordHash is null or blank)
    Note over PRS: No password to reset — OAuth-only account
    Note over PRS: Return silently — same as not-found case
    PRS-->>AC: void
    AC-->>C: 204 No Content
```

## Case 5d: Confirm — Happy Path

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant PRS as PasswordResetService
    participant PE as PasswordEncoder
    participant DB as PostgreSQL
    participant Redis as Redis

    C->>AC: POST /api/public/auth/password-reset/confirm
    Note right of C: {resetToken: rawToken, newPassword}
    AC->>PRS: confirmReset(request)
    Note over PRS: sha256Hex(resetToken) → tokenHash
    PRS->>DB: findByTokenHash(tokenHash)
    DB-->>PRS: PasswordResetTokenEntity
    Note over PRS: usedAt == null → not yet consumed ✓
    Note over PRS: revokedAt == null → not revoked ✓
    Note over PRS: expiresAt > now → not expired (60 min TTL) ✓
    PRS->>DB: findById(token.userId)
    DB-->>PRS: UserEntity (deletedAt == null ✓)
    PRS->>PE: encode(newPassword)
    Note over PE: BCrypt cost-12
    PE-->>PRS: newPasswordHash
    PRS->>DB: UPDATE users SET passwordHash=newHash, updatedAt=now
    PRS->>DB: UPDATE password_reset_tokens SET usedAt=now WHERE id=?
    PRS->>DB: UPDATE password_reset_tokens SET revokedAt=now WHERE userId=? AND revokedAt IS NULL
    Note over PRS: Revoke all active sessions — force re-login on all devices
    PRS->>DB: findByUserId(userId) → List of SessionEntity
    loop For each active session
        PRS->>Redis: SET authlyn:session:revoked:{sessionId} "password_reset" EX ttl
    end
    Note over Redis: All existing JWTs invalidated immediately via blocklist
    PRS->>DB: UPDATE sessions SET revokedAt=now, revokeReason="password_reset" WHERE userId=?
    PRS->>DB: UPDATE refresh_tokens SET revokedAt=now, revokeReason="password_reset" WHERE userId=?
    PRS-->>AC: void
    AC-->>C: 204 No Content
```

## Case 5e: Confirm — Token Already Used

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant PRS as PasswordResetService
    participant DB as PostgreSQL

    C->>AC: POST /api/public/auth/password-reset/confirm
    Note right of C: {resetToken: alreadyUsedToken, newPassword}
    AC->>PRS: confirmReset(request)
    Note over PRS: sha256Hex(resetToken) → tokenHash
    PRS->>DB: findByTokenHash(tokenHash)
    DB-->>PRS: PasswordResetTokenEntity (usedAt != null)
    Note over PRS: Token was already consumed — one-time use enforced
    PRS-->>AC: throw ResponseStatusException(401 UNAUTHORIZED)
    AC-->>C: 401 Unauthorized {"error": "Password reset token already used"}
```

## Case 5f: Confirm — Token Expired

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant PRS as PasswordResetService
    participant DB as PostgreSQL

    C->>AC: POST /api/public/auth/password-reset/confirm
    Note right of C: {resetToken, newPassword}
    AC->>PRS: confirmReset(request)
    PRS->>DB: findByTokenHash(tokenHash)
    DB-->>PRS: PasswordResetTokenEntity (usedAt=null, revokedAt=null, expiresAt < now)
    Note over PRS: Token past its 60-minute TTL
    PRS-->>AC: throw ResponseStatusException(401 UNAUTHORIZED)
    AC-->>C: 401 Unauthorized {"error": "Password reset token expired"}
```

## Case 5g: Confirm — Token Revoked (New Request Was Made)

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant PRS as PasswordResetService
    participant DB as PostgreSQL

    Note over C: User requested a new reset token — old one was revoked
    C->>AC: POST /api/public/auth/password-reset/confirm
    Note right of C: {resetToken: oldToken, newPassword}
    AC->>PRS: confirmReset(request)
    PRS->>DB: findByTokenHash(tokenHash)
    DB-->>PRS: PasswordResetTokenEntity (usedAt=null, revokedAt != null, revokeReason="password_reset_reissued")
    Note over PRS: Superseded by a newer reset request
    PRS-->>AC: throw ResponseStatusException(401 UNAUTHORIZED)
    AC-->>C: 401 Unauthorized {"error": "Password reset token revoked"}
```
