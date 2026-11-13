# [Task] OAuth Authorization Server

> **Implementation Rules**
> 1. Use Spring Authorization Server; do not hand-roll protocol code.
> 2. PKCE `S256` is required for every client. No implicit or password grant.
> 3. The contract comes first: [oidc-authorization-server.md](../architecture/oidc-authorization-server.md), [api-endpoints.md §7](../architecture/api-endpoints.md), [interfaces.md §3.4](../architecture/interfaces.md), [database.md §7.1](../architecture/database.md). Update them if the implementation has to differ.

## GitHub Issue
- Link: TBD

---

## Overview

Turn Authlyn into an OAuth 2.1 / OpenID Connect provider for customer-facing applications and service-to-service calls, and put `aud` and `scope` in every access token (review finding #5). This is **Phase 2** of the platform roadmap, so it runs before the remaining Phase 2/3 tasks in the original numbering.

Scope decisions (2026-11-14): customer identity plus service-to-service; portfolio built to production standards; Docker Compose runtime. See the design doc §2.

---

## Scope

### Contract (done in the contract PR)

- [x] Design doc, endpoint contract, service ports and planned tables

### Backend

- [ ] Add Spring Authorization Server; map its JWK set to `/.well-known/jwks.json`
- [ ] Migration `V5`: client, authorization and consent tables, `oauth_client_metadata`, `users.platform_role`
- [ ] Client registry (`OAuthClientService`) and admin endpoints `/api/admin/oauth/clients`
- [ ] Browser session cookie `AUTHLYN_AS` and `POST/DELETE /api/public/auth/browser-session`; social login resumes OAuth flows
- [ ] Authorization code + PKCE, refresh rotation with reuse detection, client credentials
- [ ] Consent: remembered per user and client, first-party skip, `GET /api/public/oauth/consent-details`, `/api/me/oauth/authorizations`
- [ ] Token customizer: `aud`, `scope`, `client_id`, `sid`, `org_id`, `amr` on every access token, first-party logins included
- [ ] ID token, `/userinfo`, `/connect/logout`, `/oauth2/revoke` (with `jti` deny list), `/oauth2/introspect`
- [ ] Resource server: require `aud` ∋ `authlyn-api`; `/api/admin/**` needs `SCOPE_admin`; org endpoints need `orgs:read` / `orgs:write`
- [ ] Platform role: `PlatformRoleService`, `AUTHLYN_BOOTSTRAP_ADMIN_EMAILS`, `PUT /api/admin/users/{id}/platform-role`
- [ ] Multiple signing keys with one active `kid`

### Frontend

- [ ] `/oauth/consent` page
- [ ] Sign-in screen handles `?flow=oauth` (browser-session sign-in, then return to `/oauth2/authorize`)
- [ ] Vite proxy for `/oauth2`, `/userinfo`, `/connect`
- [ ] `RequireAdmin` checks `scope` contains `admin` instead of a `roles` claim

### Tests

- [ ] Authorization code + PKCE happy path, missing PKCE, `plain` rejected, wrong verifier
- [ ] Code reuse revokes issued tokens; refresh reuse revokes the authorization
- [ ] Unregistered `redirect_uri` shows an error page and never redirects
- [ ] `admin` scope: granted to platform admins on first-party clients only
- [ ] Session revocation (logout, logout-all, password reset) revokes OAuth authorizations
- [ ] Tokens without `authlyn-api` in `aud` are rejected

---

## Completion Criteria

- [ ] All flows in the design doc §4 marked "Yes" work against a sample client
- [ ] OpenID conformance suite, Basic OP plan, passes for the code flow
- [ ] `/api/admin/chatbot/ask` works with an admin token and returns `403` without one
- [ ] Architecture docs match the implementation

---

## Related Use Cases

- [UC-25](../UC/UC-25-revoke-app-access.md) — user revokes an OAuth application's access to their account
- [UC-34](../UC/UC-34-oauth-consent.md) — user reviews and grants consent to a third-party application
- [UC-35](../UC/UC-35-exchange-code.md) — client exchanges an authorization code for tokens
- [UC-50](../UC/UC-50-introspect-token.md) — resource server introspects a token
- [UC-51](../UC/UC-51-fetch-jwks.md) — verifier fetches JWKS

## Related Tasks

- Prerequisite: Phase 1 tasks 01-01 to 01-05 (done). Task 03-01 (TOTP MFA) is **no longer** a prerequisite; MFA adds `acr` later.
- Follow-up: [03-03](./03-03-social-login-magic-links-and-oidc.md), then token exchange and the policy service (Phase 3, task files to be written)
