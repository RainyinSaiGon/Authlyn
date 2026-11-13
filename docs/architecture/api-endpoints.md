# API Endpoints

This document defines externally visible HTTP contracts for Authlyn.

It is the API-side counterpart of `docs/architecture/interfaces.md` and should be updated when request/response signatures, auth requirements, or endpoint semantics change.

## 0. Conventions

### 0.1 Base and Versioning

- Application API base path: `/api`
- Public unauthenticated application endpoints start with `/api/public/*`
- Protected user application endpoints use `/api/*`
- Explicit exceptions may exist outside `/api` for standards-based or operational endpoints documented here, such as `/.well-known/*` and `/actuator/*`.
- First contract generation is treated as `v1` behavior, even if path versioning is not yet enabled.

### 0.2 Authentication Modes

- `public`: no bearer token required
- `bearer-user`: valid user access token required
- `bearer-admin`: valid access token with the `SCOPE_admin` authority (no token carries it until Phase 2; see section 7.14)
- `client`: the caller authenticates as a registered OAuth client (Phase 2, section 7)

### 0.3 Error Envelope (Logical Contract)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "requestId": "trace-or-correlation-id",
    "details": {}
  }
}
```

### 0.4 Standard Status Behavior

- `200 OK`: successful query or action with response body
- `201 Created`: successful create action
- `204 No Content`: successful action with no body
- `400 Bad Request`: validation failure
- `401 Unauthorized`: missing/invalid auth
- `403 Forbidden`: insufficient scope/permission
- `404 Not Found`: target does not exist
- `409 Conflict`: duplicate or incompatible state
- `429 Too Many Requests`: rate limit exceeded

---

## 1. Public System Endpoints

### 1.1 JWKS

- **Method/Path:** `GET /.well-known/jwks.json`
- **Auth:** `public`
- **Purpose:** publish active public keys for JWT verification
- **Response:** JWKS JSON document
- **Mapped contract:** `JwksController`

### 1.2 Health and Operational Endpoints

- `GET /actuator/health` (`public`)
- `GET /actuator/info` (`public`)
- `GET /actuator/prometheus` (`public` or protected by env policy)

---

## 2. Identity Endpoints

### 2.1 Signup

- **Method/Path:** `POST /api/public/auth/signup`
- **Auth:** `public`
- **Mapped service:** `SignupService.signup`

#### Signup request

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "displayName": "Optional Name"
}
```

Password rules: 8–128 characters, must contain uppercase, lowercase, digit, and special character (`@StrongPassword`).

#### Signup success response (`201 Created`)

```json
{
  "userId": "uuid",
  "sessionId": "uuid",
  "accessToken": "jwt",
  "refreshToken": "opaque-token",
  "createdAt": "2026-04-21T00:00:00Z"
}
```

#### Signup expected errors

- `400` validation (including weak password)
- `409` email already exists

### 2.2 Login

- **Method/Path:** `POST /api/public/auth/login`
- **Auth:** `public`
- **Rate limit:** 10 attempts / 15 minutes / client IP; `429` on breach
- **Mapped service:** `LoginService.login`

#### Login request

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

#### Login success response (`200 OK`)

```json
{
  "userId": "uuid",
  "sessionId": "uuid",
  "accessToken": "jwt",
  "refreshToken": "opaque-token",
  "expiresAt": "2026-05-23T01:00:00Z"
}
```

#### Login expected errors

- `400` malformed payload
- `401` invalid credentials
- `429` rate limit exceeded

### 2.3 Refresh Token Rotation

- **Method/Path:** `POST /api/public/auth/refresh`
- **Auth:** `public` (refresh token in body)
- **Mapped service:** `RefreshService.rotate`
- A 5-second grace window is applied to the token's `expires_at` to absorb clock-skew retries.
- Presenting a previously rotated token triggers full session-family revocation (reuse detection).

#### Refresh request

```json
{
  "refreshToken": "opaque-token"
}
```

#### Refresh success response (`200 OK`)

```json
{
  "accessToken": "jwt",
  "refreshToken": "new-opaque-token",
  "accessTokenExpiresAt": "2026-05-23T01:00:00Z"
}
```

#### Refresh expected errors

- `401` invalid / revoked / expired / reused refresh token

### 2.4 Current User (`me`)

- **Method/Path:** `GET /api/me`
- **Auth:** `bearer-user`
- **Mapped service:** `CurrentUserService.getCurrentUser`

#### Me success response (`200 OK`)

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "emailVerified": false,
  "displayName": "Optional Name",
  "createdAt": "2026-04-21T00:00:00Z"
}
```

#### Me expected errors

- `401` missing/invalid/revoked bearer token

### 2.5 Logout (Current Session)

- **Method/Path:** `POST /api/auth/logout`
- **Auth:** `bearer-user`
- **Mapped service:** `LogoutService.logout`
- If the request body omits `sessionId`, the server uses the current access token's `sid` claim.

#### Logout request

```json
{
  "sessionId": "uuid"
}
```

#### Logout success response

- `204 No Content`

### 2.6 Logout All Sessions

- **Method/Path:** `POST /api/auth/logout-all`
- **Auth:** `bearer-user`
- **Mapped service:** `LogoutService.logoutAll`

#### Logout-all success response

- `204 No Content`

### 2.7 Password Reset Request

- **Method/Path:** `POST /api/public/auth/password-reset/request`
- **Auth:** `public`
- **Mapped service:** `PasswordResetService.requestReset`

#### Password-reset-request body

```json
{
  "email": "user@example.com"
}
```

#### Password-reset-request success

- `204 No Content` (constant shape — no account enumeration)
- The email must link to the frontend at `/auth/reset-password?token=<resetToken>`. The page removes the token from the address bar as soon as it loads. (Mail delivery is still stubbed; `NoopMailService` only logs.)

### 2.8 Password Reset Confirm

- **Method/Path:** `POST /api/public/auth/password-reset/confirm`
- **Auth:** `public`
- **Mapped service:** `PasswordResetService.confirmReset`

#### Password-reset-confirm request

```json
{
  "resetToken": "opaque-token",
  "newPassword": "NewStrongPassword456!"
}
```

`newPassword` must satisfy the same `@StrongPassword` rules as signup.

#### Password-reset-confirm success

- `204 No Content`
- Successful reset invalidates all active sessions and refresh tokens for the user.

#### Password-reset-confirm expected errors

- `400` invalid payload or weak password
- `401` invalid / expired / already-used token

---

## 3. OAuth2 Social Login

OAuth2 login is active only when at least one provider (`google` or `github`) is configured via environment variables.

### 3.1 Initiate OAuth2 Login

- **Method/Path:** `GET /oauth2/authorization/{provider}`
- **Auth:** `public`
- **Values for `{provider}`:** `google`, `github`
- **Behavior:** Spring Security redirects to the provider's authorization endpoint.

### 3.2 OAuth2 Callback (Internal)

- **Method/Path:** `GET /login/oauth2/code/{provider}`
- **Auth:** `public` (handled internally by Spring Security)
- **Mapped handler:** `OAuth2LoginSuccessHandler.onAuthenticationSuccess`
- On success: resolves the local user, creates a session, stores a one-time login code in Redis (60 s, SHA-256 keyed), then redirects to:

```text
${authlyn.web.oauth2-redirect-uri}?code=<one-time-code>
```

- Tokens are never placed in the URL. The frontend exchanges the code with `POST /api/public/auth/oauth/exchange`.
- Account resolution: a known `(provider, providerUserId)` signs in as its linked user. Otherwise the provider email is used only when the provider sends `email_verified=true`, and links to an existing account only if that account's email is verified too. Any other email match is refused with `?error=account_link_required`. GitHub sends no `email_verified`, so its email is treated as unverified.
- Other error redirects: `?error=account_disabled` (linked user deleted).

Default redirect URI: `http://localhost:5173/oauth/callback`

### 3.3 Exchange One-Time Login Code

- **Method/Path:** `POST /api/public/auth/oauth/exchange`
- **Auth:** `public` (one-time code in body)
- **Mapped service:** `OAuthLoginCodeService.exchange`
- Request: `{ "code": "..." }`. Response (`200 OK`): same shape as the login response (`userId`, `sessionId`, `accessToken`, `refreshToken`, `expiresAt`).
- Errors: `401` unknown, expired or already used code, or the session was revoked.

---

## 4. Organization Endpoints

All org endpoints require `bearer-user` authentication.

### 4.1 Create Organization

- **Method/Path:** `POST /api/orgs`
- **Auth:** `bearer-user`
- **Mapped service:** `OrgService.createOrg`

#### Create org request

```json
{
  "slug": "my-org",
  "name": "My Organization"
}
```

Slug must match `[a-z0-9-]{2,80}`.

#### Create org response (`201 Created`)

```json
{
  "id": "uuid",
  "slug": "my-org",
  "name": "My Organization",
  "createdAt": "2026-05-23T00:00:00Z"
}
```

The creating user is automatically added as an `admin` member.

### 4.2 List User's Organizations

- **Method/Path:** `GET /api/orgs`
- **Auth:** `bearer-user`
- **Response:** `200 OK` — array of `OrgResponse`

### 4.3 Get Organization

- **Method/Path:** `GET /api/orgs/{orgId}`
- **Auth:** `bearer-user`
- **Response:** `200 OK` — `OrgResponse`
- **Errors:** `404` if not found or deleted

### 4.4 Add Member

- **Method/Path:** `POST /api/orgs/{orgId}/members`
- **Auth:** `bearer-user` (requesting user must be admin member)

#### Add member request

```json
{
  "userId": "uuid"
}
```

#### Add member response (`201 Created`)

```json
{
  "id": "uuid",
  "orgId": "uuid",
  "userId": "uuid",
  "status": "active",
  "createdAt": "2026-05-23T00:00:00Z"
}
```

#### Errors

- `403` requesting user is not an admin member
- `409` user is already a member

### 4.5 List Members

- **Method/Path:** `GET /api/orgs/{orgId}/members`
- **Auth:** `bearer-user`
- **Response:** `200 OK` — array of `OrgMemberResponse`

---

## 5. Role Endpoints

### 5.1 Create Role

- **Method/Path:** `POST /api/orgs/{orgId}/roles`
- **Auth:** `bearer-user` (admin member)

#### Create role request

```json
{
  "key": "billing-admin",
  "name": "Billing Administrator",
  "description": "Optional description"
}
```

#### Create role response (`201 Created`)

```json
{
  "id": "uuid",
  "orgId": "uuid",
  "key": "billing-admin",
  "name": "Billing Administrator",
  "description": "Optional description",
  "systemRole": false,
  "createdAt": "2026-05-23T00:00:00Z"
}
```

### 5.2 List Roles

- **Method/Path:** `GET /api/orgs/{orgId}/roles`
- **Auth:** `bearer-user`
- **Response:** `200 OK` — array of `RoleResponse`

### 5.3 Assign Role to Member

- **Method/Path:** `POST /api/orgs/{orgId}/members/{memberId}/roles`
- **Auth:** `bearer-user` (admin member)

#### Assign role request

```json
{
  "roleId": "uuid"
}
```

- `204 No Content` on success (idempotent — re-assigning an existing role is a no-op)

### 5.4 Revoke Role from Member

- **Method/Path:** `DELETE /api/orgs/{orgId}/members/{memberId}/roles/{roleId}`
- **Auth:** `bearer-user` (admin member)
- **Response:** `204 No Content`

---

## 6. Admin Chatbot Endpoints

The admin assistant answers questions from the indexed architecture docs and can call a small set of admin tools. It needs `OPENAI_API_KEY` and a Postgres database with the `pgvector` extension (migration `V4__chatbot_schema.sql`).

### 6.1 Ask the Assistant (Streaming)

- **Method/Path:** `POST /api/admin/chatbot/ask`
- **Auth:** `bearer-admin`, enforced as `@PreAuthorize("hasAuthority('SCOPE_admin')")`
- **Produces:** `text/event-stream`
- **Mapped controller/service:** `ChatbotController.ask` → `ChatbotService.stream`

#### Ask request

```json
{
  "conversationId": "4f8b7c0e-0000-0000-0000-000000000000",
  "message": "How many users signed up in the last 7 days?"
}
```

- `conversationId` (UUID, required): chosen by the client. The first message with a new id creates the conversation row.
- `message` (string, required, not blank).

#### Ask success response (`200 OK`)

- A Server-Sent Events stream. Each event's `data` is the next chunk of the assistant's answer as plain text; the stream ends when the answer is complete.
- The last 10 messages of the conversation are kept as model context. Each answer is capped at 500 output tokens.
- If the model provider fails mid-stream, the stream ends with one fallback chunk saying the assistant is unavailable, instead of an error status.

#### Ask expected errors

- `400` missing `conversationId` or blank `message`
- `401` missing or invalid bearer token
- `403` token lacks the `SCOPE_admin` authority

#### Tools available to the assistant

| Tool | Effect |
| --- | --- |
| `countRecentSignups(days)` | Count sign-ups in the last 1-90 days |
| `countActiveSessions()` | Count sessions that are neither revoked nor expired |
| `recentSignupsByDay(days)` | Sign-ups per day for the last 1-30 days |
| `listUserSessions(userId)` | Active session ids and timestamps for one user; no credentials or PII |
| `proposeRevokeSession(sessionId)` | Returns a one-time 8-character confirmation code, valid 5 minutes |
| `confirmRevokeSession(sessionId, code)` | Revokes the session only if the code matches the proposal for that session |

Revocation is two-step on purpose: the assistant must show the code to the admin, and the admin must send it back before anything is revoked. Tools never take an `orgId`; they are platform-scoped.

> **Known gap:** access tokens issued by `JwtTokenService` do not yet carry a `scope` claim, so no token currently has `SCOPE_admin` and this endpoint returns `403` for every caller. Admin scopes arrive with token audience and scopes in Phase 2 (section 7.14).

---

## 7. OAuth 2.1 / OpenID Connect Authorization Server (Phase 2)

> **Status: contract only, not implemented.** Design, scope decisions and the token model are in [oidc-authorization-server.md](./oidc-authorization-server.md). Endpoints use the Spring Authorization Server default paths.

**Conventions for this section**

- OAuth endpoints (`/oauth2/*`, `/userinfo`, `/connect/*`) follow the RFCs, not section 0: form-encoded requests where the RFC says so, and errors in the RFC 6749 shape `{ "error": "...", "error_description": "..." }`.
- Client authentication modes: `client_secret_basic` (confidential clients) and `none` (public clients, PKCE only).
- Auth modes add `client`: the caller authenticates as a registered OAuth client.

### 7.1 OpenID Provider Discovery

- **Method/Path:** `GET /.well-known/openid-configuration` (also served at `/.well-known/oauth-authorization-server`, RFC 8414)
- **Auth:** `public`
- **Response (`200 OK`)** includes at least:

```json
{
  "issuer": "http://localhost:8080",
  "authorization_endpoint": "http://localhost:8080/oauth2/authorize",
  "token_endpoint": "http://localhost:8080/oauth2/token",
  "jwks_uri": "http://localhost:8080/.well-known/jwks.json",
  "userinfo_endpoint": "http://localhost:8080/userinfo",
  "revocation_endpoint": "http://localhost:8080/oauth2/revoke",
  "introspection_endpoint": "http://localhost:8080/oauth2/introspect",
  "end_session_endpoint": "http://localhost:8080/connect/logout",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token", "client_credentials"],
  "code_challenge_methods_supported": ["S256"],
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "none"],
  "scopes_supported": ["openid", "profile", "email", "offline_access", "orgs:read", "orgs:write", "admin"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"]
}
```

### 7.2 JWKS (changed)

- **Method/Path:** `GET /.well-known/jwks.json` (section 1.1; unchanged path)
- **Change:** may return **more than one** key during rotation. Verifiers must select by `kid`.

### 7.3 Authorization Endpoint

- **Method/Path:** `GET /oauth2/authorize`
- **Auth:** browser session cookie `AUTHLYN_AS` (see 7.10); without it the request is saved and the browser is sent to `/auth/sign-in?flow=oauth`
- **Query parameters:**

| Parameter | Required | Notes |
| --- | --- | --- |
| `response_type` | yes | must be `code` |
| `client_id` | yes | registered, enabled client |
| `redirect_uri` | yes | exact string match with a registered URI |
| `scope` | yes | space-separated; subset of the client's `allowedScopes` |
| `state` | yes | opaque, returned unchanged |
| `code_challenge` | yes | PKCE, required for every client |
| `code_challenge_method` | yes | must be `S256` |
| `nonce` | when `openid` | copied into the ID token |
| `organization` | no | org id; the user must be a member, then `org_id` is put in the token |
| `prompt` | no | `none` or `login` or `consent` |

- **Success:** `302` to `redirect_uri?code=<code>&state=<state>` (code valid 5 minutes, single use).
- **Consent needed:** `302` to the frontend `/oauth/consent?client_id=...&scope=...&state=...` (see 7.11).
- **Errors redirected to the client:** `access_denied` (user declined), `invalid_scope`, `invalid_request` (missing PKCE, bad `organization`), `login_required` / `consent_required` (with `prompt=none`).
- **Errors shown on an Authlyn error page, never redirected:** unknown `client_id`, disabled client, `redirect_uri` not registered.
- **Consent form submission:** `POST /oauth2/authorize` (form-encoded `client_id`, `state`, and one `scope` field per approved scope), sent by the consent page.

### 7.4 Token Endpoint

- **Method/Path:** `POST /oauth2/token`
- **Content type:** `application/x-www-form-urlencoded`
- **Auth:** `client` (`client_secret_basic`, or `client_id` in the body for public clients)

| `grant_type` | Required fields | Notes |
| --- | --- | --- |
| `authorization_code` | `code`, `redirect_uri`, `code_verifier` | Code is consumed. A reused code fails and revokes every token issued from it. |
| `refresh_token` | `refresh_token`, optional narrower `scope` | Rotates the refresh token. A reused refresh token revokes the whole authorization. |
| `client_credentials` | optional `scope` | Confidential clients only. No refresh or ID token. |

- **Success (`200 OK`):**

```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "openid profile orgs:read",
  "refresh_token": "opaque, only when offline_access was granted",
  "id_token": "eyJ..., only when openid was granted"
}
```

- **Errors (`400` unless noted):** `invalid_request`, `invalid_grant` (unknown, expired, reused or wrong-client code or refresh token; PKCE mismatch; `redirect_uri` mismatch), `unauthorized_client` (grant not allowed for this client), `invalid_scope`, `401 invalid_client` (bad client credentials).

### 7.5 Token Revocation (RFC 7009)

- **Method/Path:** `POST /oauth2/revoke`
- **Auth:** `client`
- **Body (form):** `token`, optional `token_type_hint` (`access_token` | `refresh_token`)
- **Response:** `200 OK` with an empty body, also when the token was unknown or already revoked. Revoking a refresh token revokes its authorization; revoking an access token adds its `jti` to the Redis deny list until it expires.

### 7.6 Token Introspection (RFC 7662)

- **Method/Path:** `POST /oauth2/introspect`
- **Auth:** `client` (confidential clients only)
- **Body (form):** `token`, optional `token_type_hint`
- **Response (`200 OK`):** `{ "active": true, "sub": "...", "client_id": "...", "scope": "...", "aud": [...], "exp": 0, "iat": 0, "sid": "...", "org_id": "..." }`, or `{ "active": false }` for unknown, expired or revoked tokens and for tokens whose session was revoked.

### 7.7 UserInfo

- **Method/Path:** `GET /userinfo` (also `POST`)
- **Auth:** bearer access token with `openid` scope
- **Response (`200 OK`):** `sub` always; `email`, `email_verified` with `email`; `name`, `picture`, `locale`, `zoneinfo` with `profile`.
- **Errors:** `401 invalid_token`, `403 insufficient_scope`.

### 7.8 RP-Initiated Logout

- **Method/Path:** `GET /connect/logout` (also `POST`)
- **Auth:** `public`, identified by `id_token_hint`
- **Parameters:** `id_token_hint` (required), `post_logout_redirect_uri` (must be registered for the client), `state`
- **Behavior:** revokes the Authlyn session in the hint's `sid` (same effect as section 2.5), clears `AUTHLYN_AS`, then redirects to `post_logout_redirect_uri?state=...` or shows a signed-out page.

### 7.9 Consent Details (for the consent screen)

- **Method/Path:** `GET /api/public/oauth/consent-details?client_id=...&scope=...`
- **Auth:** `public` (needs the `AUTHLYN_AS` cookie to report previously granted scopes)
- **Response (`200 OK`):**

```json
{
  "client": { "clientId": "acme-web", "name": "Acme", "logoUri": "https://...", "homepageUri": "https://..." },
  "requestedScopes": [{ "scope": "orgs:read", "description": "See your organizations, members and roles" }],
  "previouslyGrantedScopes": ["openid", "profile"]
}
```

- **Errors:** `404` unknown or disabled client.

### 7.10 Browser Session Sign-In (for OAuth flows)

- **Method/Path:** `POST /api/public/auth/browser-session`
- **Auth:** `public`, same rate limit as login (section 2.2)
- **Request:** `{ "email": "...", "password": "..." }`
- **Success:** `204 No Content` and `Set-Cookie: AUTHLYN_AS=...; HttpOnly; Secure; SameSite=Lax; Path=/`. Creates a normal session; no tokens are returned in the body.
- **Errors:** same as login (`401` with no hint whether the email exists, `429`).
- **Sign out:** `DELETE /api/public/auth/browser-session` revokes that session and clears the cookie (`204`).

### 7.11 My Authorized Applications (UC-25)

- `GET /api/me/oauth/authorizations` — `bearer-user`. Lists clients the user has consented to: `[{ "clientId", "name", "logoUri", "scopes": [...], "grantedAt" }]`.
- `DELETE /api/me/oauth/authorizations/{clientId}` — `bearer-user`. Withdraws consent and revokes that client's tokens for the user. `204`; `404` if there is no consent.

### 7.12 OAuth Client Registry (admin)

All require `bearer-admin` (`SCOPE_admin`).

| Method/Path | Purpose | Success |
| --- | --- | --- |
| `POST /api/admin/oauth/clients` | Register a client | `201` with the client and, for confidential clients, the secret **once** |
| `GET /api/admin/oauth/clients` | List clients | `200` |
| `GET /api/admin/oauth/clients/{clientId}` | Read one client (never the secret) | `200` |
| `PATCH /api/admin/oauth/clients/{clientId}` | Change name, logo, redirect URIs, scopes, `enabled` | `200` |
| `POST /api/admin/oauth/clients/{clientId}/secret` | Rotate the secret; the old one stops working at once | `200` with the new secret once |
| `DELETE /api/admin/oauth/clients/{clientId}` | Delete; revokes all its tokens and consents | `204` |

Create request:

```json
{
  "clientId": "acme-web",
  "name": "Acme",
  "type": "public",
  "redirectUris": ["https://acme.example/callback"],
  "postLogoutRedirectUris": ["https://acme.example/"],
  "grantTypes": ["authorization_code", "refresh_token"],
  "allowedScopes": ["openid", "profile", "email", "offline_access", "orgs:read"],
  "audiences": ["authlyn-api"],
  "firstParty": false,
  "logoUri": "https://acme.example/logo.png",
  "homepageUri": "https://acme.example"
}
```

Validation (`400`):
- `type` is `public` or `confidential`. Public clients cannot use `client_credentials`.
- Redirect URIs must be absolute, use `https` (or `http://localhost` / `http://127.0.0.1` for development), and contain no fragment or wildcard.
- `allowedScopes` may include `admin` only when `firstParty` is true.
- `409` when `clientId` is taken.

### 7.13 Platform Role (admin)

- `PUT /api/admin/users/{userId}/platform-role` — `bearer-admin`. Body `{ "platformRole": "admin" | "user" }`. `204`. An admin cannot demote themself, so the platform always keeps at least one admin (`409`).

### 7.14 Changes to Existing Endpoints

- **Every access token** (sections 2.2, 2.3, 3.3 included) gains `aud`, `scope`, `client_id` and `amr`. First-party logins get `client_id = authlyn-web`, `aud = ["authlyn-api"]`, and the scopes the user is entitled to (`orgs:read orgs:write`, plus `admin` for platform admins).
- **Every protected `/api/*` endpoint** rejects tokens whose `aud` lacks `authlyn-api` (`401`). `/api/admin/**` requires `SCOPE_admin`. Org endpoints (sections 4, 5) require `SCOPE_orgs:read` for reads and `SCOPE_orgs:write` for writes.
- **Section 3.2:** social login started from an OAuth flow sets `AUTHLYN_AS` and resumes `/oauth2/authorize` instead of redirecting to `/oauth/callback`.
- **Section 2.4 (`me`)** adds `platformRole` to the response.

---

## 8. Planned Endpoint Families

### 8.1 Platform

- API key lifecycle
- Webhook endpoint lifecycle and delivery inspection
- Audit query and admin-only operations

### 8.2 Advanced IAM

- TOTP MFA enrollment and challenge
- Passkey (WebAuthn) registration and authentication
- Session management UI (view + revoke individual sessions)
- Token exchange (RFC 8693) and pushed authorization requests (Phase 3)
- SAML metadata and assertion consumer

---

## 9. Traceability

- Endpoint signatures in section 2 map to identity service contracts in `docs/architecture/interfaces.md`.
- Section 7 maps to `docs/architecture/interfaces.md` §3.4 and to the design in `docs/architecture/oidc-authorization-server.md`.
- If one changes, both files must be updated in the same task or pull request.
- Architecture doc governance rules: `docs/dev/contract-governance.md`.
