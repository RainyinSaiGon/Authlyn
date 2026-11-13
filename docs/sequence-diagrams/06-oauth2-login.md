# OAuth2 Social Login — Sequence Diagrams

## Case 6a: New User (First-Time OAuth Login)

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant Sec as SpringSecurity OAuth2
    participant Handler as OAuth2LoginSuccessHandler
    participant DB as PostgreSQL
    participant JT as JwtTokenService

    C->>Sec: GET /oauth2/authorization/google
    Sec-->>C: 302 Redirect to Google consent page
    C->>Sec: GET /login/oauth2/code/google?code=authCode
    Sec->>Sec: Exchange auth code for Google access token
    Sec->>Sec: Fetch user info from Google (sub, email, name, ...)
    Note over Sec: Build OAuth2AuthenticationToken with attributes
    Sec->>Handler: onAuthenticationSuccess(request, response, auth)
    Note over Handler: provider = "google"
    Note over Handler: providerUserId = attributes["sub"]
    Note over Handler: providerEmail = attributes["email"] (lowercased)
    Handler->>DB: findByEmail(normalizedEmail)
    DB-->>Handler: empty (no existing account)
    Handler->>DB: INSERT users (id, email, emailVerified=true, createdAt, updatedAt)
    Note over Handler: New Authlyn account created — email pre-verified via OAuth
    Handler->>DB: findByProviderAndProviderUserId("google", providerUserId)
    DB-->>Handler: empty
    Handler->>DB: INSERT identities (userId, provider="google", providerUserId, providerEmail, profile="{}")
    Handler->>DB: INSERT sessions (userId, createdAt, lastSeenAt, expiresAt=now+30d)
    Note over Handler: SecureRandom 32 bytes → Base64url = rawRefreshToken
    Note over Handler: sha256Hex(rawRefreshToken) = tokenHash
    Handler->>DB: INSERT refresh_tokens (tokenHash, userId, sessionId, expiresAt=now+30d)
    Handler->>JT: issueAccessToken(userId, sessionId)
    Note over JT: JWT: sub=userId, sid=sessionId, exp=now+15min, RS256
    JT-->>Handler: accessToken
    Handler-->>C: 302 Redirect to /oauth/callback
    Note right of C: ?access_token=...&refresh_token=...&session_id=...
    Note over C: Frontend reads tokens from query params and stores them
```

## Case 6b: Existing User — Account Linking via Email Match

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant Sec as SpringSecurity OAuth2
    participant Handler as OAuth2LoginSuccessHandler
    participant DB as PostgreSQL
    participant JT as JwtTokenService

    Note over C: User previously registered with email/password
    Note over C: Now logs in via Google using the same email address
    C->>Sec: GET /login/oauth2/code/google?code=authCode
    Sec->>Sec: Exchange code, fetch Google user info
    Sec->>Handler: onAuthenticationSuccess(...)
    Note over Handler: providerEmail = same email as existing account (lowercased)
    Handler->>DB: findByEmail(normalizedEmail)
    DB-->>Handler: UserEntity (existing password-based account found)
    Note over Handler: No new user created — existing account reused
    Handler->>DB: findByProviderAndProviderUserId("google", providerUserId)
    DB-->>Handler: empty (first time this Google account is linked)
    Handler->>DB: INSERT identities (userId=existingUser.id, provider="google", providerUserId, providerEmail)
    Note over Handler: Google identity now permanently linked to existing account
    Handler->>DB: INSERT sessions (userId=existingUser.id, expiresAt=now+30d)
    Note over Handler: SecureRandom 32 bytes → Base64url = rawRefreshToken
    Note over Handler: sha256Hex(rawRefreshToken) = tokenHash
    Handler->>DB: INSERT refresh_tokens (tokenHash, userId=existingUser.id, sessionId)
    Handler->>JT: issueAccessToken(existingUser.id, sessionId)
    JT-->>Handler: accessToken
    Handler-->>C: 302 Redirect to /oauth/callback?access_token=...&refresh_token=...
    Note over C: Same account — accessible via password login OR Google OAuth going forward
```

## Case 6c: Returning OAuth User (Identity Already Linked)

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant Sec as SpringSecurity OAuth2
    participant Handler as OAuth2LoginSuccessHandler
    participant DB as PostgreSQL
    participant JT as JwtTokenService

    Note over C: User previously logged in via Google — identity row already exists
    C->>Sec: GET /login/oauth2/code/google?code=authCode
    Sec->>Sec: Exchange code, fetch Google user info
    Sec->>Handler: onAuthenticationSuccess(...)
    Handler->>DB: findByEmail(normalizedEmail)
    DB-->>Handler: UserEntity (existing)
    Note over Handler: No new user created
    Handler->>DB: findByProviderAndProviderUserId("google", providerUserId)
    DB-->>Handler: IdentityEntity (already exists)
    Note over Handler: No new identity created — idempotent
    Handler->>DB: INSERT sessions (userId, expiresAt=now+30d)
    Note over Handler: New session per login — allows multi-device tracking
    Handler->>DB: INSERT refresh_tokens (tokenHash, userId, sessionId)
    Handler->>JT: issueAccessToken(userId, sessionId)
    JT-->>Handler: accessToken
    Handler-->>C: 302 Redirect to /oauth/callback?access_token=...&refresh_token=...
```
