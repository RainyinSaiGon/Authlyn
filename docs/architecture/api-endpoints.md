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
- `bearer-admin`: valid admin token required (planned)

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
- On success: finds or creates local `UserEntity` and `IdentityEntity`, creates a session and refresh token, then redirects to:

```text
${authlyn.web.oauth2-redirect-uri}?access_token=...&refresh_token=...&session_id=...
```

Default redirect URI: `http://localhost:5173/oauth/callback`

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

## 6. Planned Endpoint Families

### 6.1 Platform

- API key lifecycle
- Webhook endpoint lifecycle and delivery inspection
- Audit query and admin-only operations

### 6.2 Advanced IAM

- TOTP MFA enrollment and challenge
- Passkey (WebAuthn) registration and authentication
- Session management UI (view + revoke individual sessions)
- OIDC discovery and token introspection
- SAML metadata and assertion consumer

---

## 7. Traceability

- Endpoint signatures in section 2 map to identity service contracts in `docs/architecture/interfaces.md`.
- If one changes, both files must be updated in the same task or pull request.
- Architecture doc governance rules: `docs/dev/contract-governance.md`.
