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

## Related Tasks

- Prerequisite: [03-01](./03-01-totp-mfa-and-recovery-codes.md)
- Follow-up: [03-03](./03-03-social-login-magic-links-and-oidc.md)
