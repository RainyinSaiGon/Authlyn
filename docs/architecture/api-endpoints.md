# API Endpoints

This document defines externally visible HTTP contracts for Authlyn.

It is the API-side counterpart of `docs/architecture/interfaces.md` and should be updated when request/response signatures, auth requirements, or endpoint semantics change.

## 0. Conventions

### 0.1 Base and Versioning

- Base path: `/api`
- Public unauthenticated paths start with `/api/public/*`
- Protected user paths use `/api/*`
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
- **Mapped contract:** `JwksService.getPublicJwks`

### 1.2 Health and Operational Endpoints

- `GET /actuator/health` (`public`)
- `GET /actuator/info` (`public`)
- `GET /actuator/prometheus` (`public` or protected by env policy)

### 1.3 Public Meta

- **Method/Path:** `GET /api/public/meta`
- **Auth:** `public`
- **Purpose:** frontend bootstrap metadata
- **Response Contract (logical):**

```json
{
  "appName": "Authlyn",
  "status": "ok",
  "jwksPath": "/.well-known/jwks.json",
  "architectureDoc": "/ARCHITECTURE.md"
}
```

---

## 2. Identity Endpoints (First Detailed Baseline)

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

#### Signup success response (`201 Created`)

```json
{
  "userId": "uuid",
  "accessToken": "jwt",
  "refreshToken": "opaque-token",
  "createdAt": "2026-04-21T00:00:00Z"
}
```

#### Signup expected errors

- `400` validation
- `409` email already exists
- `429` signup rate limit

### 2.2 Login

- **Method/Path:** `POST /api/public/auth/login`
- **Auth:** `public`
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
  "expiresAt": "2026-04-21T01:00:00Z"
}
```

#### Login expected errors

- `400` malformed payload
- `401` invalid credentials
- `429` brute-force/rate-limit threshold

### 2.3 Refresh Token Rotation

- **Method/Path:** `POST /api/public/auth/refresh`
- **Auth:** `public` (refresh token in body)
- **Mapped service:** `RefreshService.rotate`

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
  "accessTokenExpiresAt": "2026-04-21T01:00:00Z"
}
```

#### Refresh expected errors

- `401` invalid/revoked/expired/reused refresh token
- `409` rotation conflict (already consumed)
- `429` abuse controls

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

- `401` missing/invalid bearer token

### 2.5 Logout (Current Session)

- **Method/Path:** `POST /api/auth/logout`
- **Auth:** `bearer-user`
- **Mapped service:** `LogoutService.logout`

#### Logout request (logical)

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

- `204 No Content` (constant shape to avoid account enumeration)

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

#### Password-reset-confirm success

- `204 No Content`

#### Password-reset-confirm expected errors

- `400` invalid payload
- `401` invalid/expired token

---

## 3. Planned Endpoint Families (High-Level)

### 3.1 Federation

- OAuth/OIDC login initiation and callback handling
- OIDC discovery and token/introspection endpoints
- SAML metadata and assertion-consumer endpoints

### 3.2 Organization

- Organization CRUD
- Membership lifecycle
- Invites and role assignments

### 3.3 Platform

- API key lifecycle
- Webhook endpoint lifecycle and delivery inspection
- Audit query and admin-only operations

---

## 4. Traceability to Interface Contracts

- Endpoint signatures in section 2 map to identity service contracts in `docs/architecture/interfaces.md`.
- If one changes, both files must be updated in the same task or pull request.

## 5. Status

Identity endpoints now have a first detailed baseline contract for task `00-01`. Subsequent tasks should refine payloads and error codes as concrete controllers and DTOs are implemented.
