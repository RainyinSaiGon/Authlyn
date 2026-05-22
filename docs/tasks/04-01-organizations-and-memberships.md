# [Task] Organizations and Memberships

> **Implementation Rules**
> 1. Keep organization data separate from user identity data.
> 2. Enforce tenant isolation in repository and service design.
> 3. Document all new organization APIs.

## GitHub Issue
- Link: TBD

---

## Overview

Implement organization creation and membership management.

---

## Scope

### Backend

- [ ] Add organization entity and repository
- [ ] Add membership entity and repository
- [ ] Add organization CRUD endpoints
- [ ] Add membership list and management endpoints

### Tests

- [ ] Organization persistence tests
- [ ] Membership service tests
- [ ] Organization controller tests

---

## Completion Criteria

- [ ] Organizations can be created and queried
- [ ] Memberships can be managed
- [ ] Isolation tests pass

---

## Related Use Cases

- [UC-28](../UC/UC-28-create-organization.md) — user creates a new organization
- [UC-29](../UC/UC-29-invite-member.md) — organization admin invites a user to join the organization
- [UC-30](../UC/UC-30-accept-invitation.md) — invited user accepts an organization membership invitation

## Related Tasks

- Prerequisite: [03-03](./03-03-social-login-magic-links-and-oidc.md)
- Follow-up: [04-02](./04-02-roles-permissions-and-org-claims.md), [04-03](./04-03-invites-enterprise-sso-and-jit.md)
