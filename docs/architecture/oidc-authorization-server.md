# OIDC Authorization Server (Phase 2)

Status: **contract, not implemented**. This page fixes the design for Phase 2 before any code is written. The HTTP surface is in [api-endpoints.md §7](./api-endpoints.md#7-oauth-21--openid-connect-authorization-server-phase-2), service ports in [interfaces.md §3.4](./interfaces.md), and planned tables in [database.md §7](./database.md).

## 1. Goal

Today Authlyn is a login service for its own frontend. Phase 2 turns it into an OAuth 2.1 / OpenID Connect provider so that:

- other applications can sign users in through Authlyn (authorization code + PKCE);
- backend services can get tokens for themselves (client credentials);
- every access token says which API it is for (`aud`) and what it allows (`scope`), so a token leaked from one service is not accepted by another (review finding #5).

## 2. Scope decisions (2026-11-14)

These answer the open questions in the platform review and bound everything below.

| Question | Decision | Consequence |
| --- | --- | --- |
| Customer identity or workforce SSO? | **Customer identity, plus service-to-service** | Consent screens, third-party clients and `client_credentials` are in scope. SCIM, LDAP and enterprise SSO stay in later phases. |
| Portfolio or real users? | **Portfolio, built to production standards** | Follow OAuth 2.1 and the OpenID conformance suite. FAPI 2.0 and data-residency work are out of scope. |
| Runtime | **Docker Compose** | No service mesh. Service identity uses client credentials, not mTLS certificates, until a later phase. |

## 3. Build approach

- Use **Spring Authorization Server** (the `spring-boot-starter-oauth2-authorization-server` that ships with Spring Boot 4) inside the existing Authlyn deployable. Do not hand-roll protocol code.
- Keep Authlyn's own users, sessions, password hashing, social login and refresh-reuse detection. Spring Authorization Server provides the protocol endpoints; Authlyn plugs in through its extension points (`RegisteredClientRepository`, `OAuth2AuthorizationService`, `OAuth2AuthorizationConsentService`, `OAuth2TokenCustomizer`, and a custom authentication provider backed by `users`).
- Use the default endpoint paths of Spring Authorization Server (`/oauth2/*`, `/userinfo`, `/connect/logout`), except the JWK set, which stays at `/.well-known/jwks.json`.
- The existing first-party endpoints under `/api/public/auth/*` stay as they are in Phase 2. Moving the Authlyn frontend onto the code flow behind a backend-for-frontend is a later step.

## 4. Supported flows

| Flow | Phase 2 | Notes |
| --- | --- | --- |
| Authorization code + PKCE | Yes | PKCE `S256` is required for **every** client, public or confidential. `plain` is rejected. |
| Refresh token | Yes | Rotated on every use; reuse revokes the whole authorization (same rule as first-party refresh). Issued only when `offline_access` is granted. |
| Client credentials | Yes | Confidential clients only. Never carries a user (`sub` = client id). |
| Token revocation (RFC 7009) | Yes | |
| Token introspection (RFC 7662) | Yes | For resource servers that cannot validate JWTs offline. |
| OIDC discovery, UserInfo, RP-initiated logout | Yes | |
| Implicit, password grant | **Never** | Removed in OAuth 2.1. |
| Token exchange (RFC 8693), PAR, device code | No | Phase 3. |
| Dynamic client registration | No | Clients are created by platform admins through `/api/admin/oauth/clients`. |

## 5. Browser session at the authorization server

`/oauth2/authorize` runs in the user's browser and needs to know who is signed in, so the authorization server keeps its own session cookie, separate from the bearer tokens the SPA uses.

1. A client sends the browser to `GET /oauth2/authorize`. With no session, Authlyn saves the request and redirects to the frontend at `/auth/sign-in?flow=oauth`.
2. The sign-in screen calls `POST /api/public/auth/browser-session` with email and password, or uses social login. Either way Authlyn creates a normal `sessions` row and sets the `AUTHLYN_AS` cookie (`HttpOnly`, `Secure`, `SameSite=Lax`, path `/`) holding a reference to that session.
3. The frontend sends the browser back to `/oauth2/authorize`, which now sees the session and continues to consent.

Rules:

- The sign-in UI and the authorization server must be served from **one origin** in production (one reverse proxy in front of both). In development the Vite server proxies `/oauth2`, `/userinfo`, `/connect` and `/.well-known` to the backend, so the cookie is set and read on the same host.
- The cookie session **is** an Authlyn session: revoking that session (logout, logout-all, admin revoke, password reset) ends it and invalidates everything issued from it.
- Social login that started from an OAuth flow sets the cookie and resumes the saved authorization request instead of redirecting to `/oauth/callback`.

## 6. Consent

- Spring Authorization Server redirects to the frontend consent page `/oauth/consent` with `client_id`, `scope` and `state`. The page reads display data from `GET /api/public/oauth/consent-details` and submits the user's choice back to `POST /oauth2/authorize`.
- Consent is remembered per user and client. A later request for the same or fewer scopes skips the screen; a request for new scopes shows only the new ones.
- Clients marked `firstParty` skip consent entirely. Only platform admins can set that flag.
- Users can list and withdraw consent (UC-25). Withdrawing revokes the client's refresh tokens for that user.

## 7. Token model

### 7.1 Access token (JWT, RS256)

Applies to **every** access token Authlyn issues, including the first-party `/api/public/auth/*` endpoints.

| Claim | Value |
| --- | --- |
| `iss` | `authlyn.jwt.issuer` |
| `sub` | user id; client id for `client_credentials` |
| `aud` | array of resource ids the token is for; always contains `authlyn-api` when the token can call Authlyn's own API |
| `scope` | space-separated granted scopes |
| `client_id` | the OAuth client; `authlyn-web` for first-party logins |
| `sid` | Authlyn session id (absent for `client_credentials`) |
| `org_id` | only when the request asked for an organization and the user is a member |
| `amr` | how the user signed in: `["pwd"]` or `["fed"]` (social) |
| `iat`, `exp`, `jti` | as today; lifetime stays `authlyn.jwt.access-token-minutes` (15) |

`acr` is left out until MFA exists (Phase 3 task 03-01), so it never claims an assurance level Authlyn cannot back.

### 7.2 ID token

Issued when `openid` is granted. `aud` = client id; includes `nonce` (when sent), `auth_time`, `sid`, `amr`, and `email` / `email_verified` / `name` / `picture` only for the scopes that allow them.

### 7.3 Other tokens

| Token | Format | Lifetime |
| --- | --- | --- |
| Authorization code | opaque, single use, bound to client + redirect URI + PKCE challenge | 5 minutes |
| Refresh token | opaque, stored hashed, rotated | 30 days (`authlyn.jwt.refresh-token-days`), never past the parent session |

## 8. Scopes

| Scope | Grants | Who can get it |
| --- | --- | --- |
| `openid` | ID token and `/userinfo` | any client |
| `profile` | `name`, `picture`, `locale`, `zoneinfo` | any client |
| `email` | `email`, `email_verified` | any client |
| `offline_access` | a refresh token | clients allowed `refresh_token` |
| `orgs:read` | read the user's organizations, members and roles | any client |
| `orgs:write` | create organizations, manage members and roles where the user is an org admin | any client |
| `admin` | platform administration (`/api/admin/**`, including the chatbot) | first-party clients only, and only for users with `platform_role = admin` |

A client can only request scopes in its registered `allowedScopes`. Requested scopes the user is not entitled to are dropped silently from the grant (the token's `scope` shows what was granted), except `admin`, which fails the request with `invalid_scope` so a misconfigured admin client is visible.

### 8.1 Platform admins

Today nothing in the schema marks a platform admin; the only "admin" is an org-member status (review finding #10). Phase 2 adds `users.platform_role` (`user` | `admin`, default `user`). The first admins come from `AUTHLYN_BOOTSTRAP_ADMIN_EMAILS`: at startup, verified users with a listed email are promoted. After that, only an existing platform admin can change it.

## 9. Resource-server rules (how APIs check tokens)

- Authlyn's own API accepts a token only if `aud` contains `authlyn-api`, then maps `scope` to `SCOPE_*` authorities as Spring does by default.
- `/api/admin/**` requires `SCOPE_admin`. Org endpoints require `SCOPE_orgs:read` / `SCOPE_orgs:write` in addition to the membership checks they already do.
- The `sid` revocation check (Redis) stays for every token that has a `sid`. Access tokens revoked one by one through `/oauth2/revoke` are also checked, by `jti`, against a Redis deny list kept until the token's `exp`.
- Other services validate offline against `/.well-known/jwks.json` and must check `iss`, `aud`, `exp` and the scopes they need.

**Migration:** tokens issued before the deploy have no `aud` and will be rejected. They expire within 15 minutes and clients refresh into new tokens, so no data migration is needed, but the release notes must say so.

## 10. Signing keys

- `authlyn.jwt` gains a list of keys, each with a `kid`. Exactly one is marked active for signing; all are published in JWKS.
- Rotation follows the existing runbook in [jwt-jwks-flow.md](./jwt-jwks-flow.md#key-rotation-runbook): add the new key as inactive, publish, switch active, remove the old key after the longest token lifetime plus cache buffer.
- Keys stay in configuration or files. A database-backed key store is not needed at this scale.

## 11. Errors

OAuth and OIDC endpoints return the standard RFC 6749 error shape, not Authlyn's error envelope:

```json
{ "error": "invalid_grant", "error_description": "Authorization code has expired" }
```

When `redirect_uri` or `client_id` is invalid, `/oauth2/authorize` shows an error page and **never** redirects, so it cannot be used as an open redirect.

## 12. Done when

- Authorization code + PKCE, refresh, client credentials, revocation, introspection, discovery, UserInfo and logout work against a sample client.
- The OpenID conformance suite's Basic OP plan passes for the authorization code flow.
- `/api/admin/chatbot/ask` and the admin console work with an admin token, and fail with a non-admin one.
- Every access token carries `aud` and `scope`, and Authlyn rejects tokens without `authlyn-api` in `aud`.
