# [Task] OAuth Authorization Server

> **Implementation Rules**
> 1. Start with authorization code plus PKCE only.
> 2. Keep OAuth client, consent, and token logic explicit and documented.
> 3. Update endpoint docs before and after implementation.

## GitHub Issue
- Link: TBD

---

## Overview

Implement the core OAuth 2.0 authorization server flow required by the platform.

---

## Scope

### Backend

- [ ] Add OAuth client persistence
- [ ] Add authorization code and consent persistence
- [ ] Implement authorization endpoint
- [ ] Implement token endpoint with PKCE

### Tests

- [ ] Authorization endpoint tests
- [ ] Token endpoint tests
- [ ] PKCE validation tests

---

## Completion Criteria

- [ ] Authorization code flow works
- [ ] PKCE is enforced
- [ ] OAuth tests pass

---

## Related Use Cases

- [UC-25](../UC/UC-25-revoke-app-access.md) — user revokes an OAuth application's access to their account
- [UC-34](../UC/UC-34-oauth-consent.md) — user reviews and grants consent to a third-party application
- [UC-35](../UC/UC-35-exchange-code.md) — client exchanges an authorization code for tokens

## Related Tasks

- Prerequisite: [03-01](./03-01-totp-mfa-and-recovery-codes.md)
- Follow-up: [03-03](./03-03-social-login-magic-links-and-oidc.md)
