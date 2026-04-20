# [Task] Roles, Permissions, and Organization Claims

> **Implementation Rules**
> 1. Authorization logic must live in services, not controllers.
> 2. Role and permission names must be stable and documented.
> 3. JWT organization claims must match the authorization model.

## GitHub Issue
- Link: TBD

---

## Overview

Implement RBAC and organization-aware token claims.

---

## Scope

### Backend

- [ ] Add role and permission management services
- [ ] Add role assignment APIs
- [ ] Add permission evaluation service
- [ ] Inject organization and permission claims into JWTs

### Tests

- [ ] Permission evaluation tests
- [ ] JWT claim tests
- [ ] Role assignment tests

---

## Completion Criteria

- [ ] RBAC evaluation works
- [ ] Organization claims appear in tokens
- [ ] RBAC tests pass

---

## Related Tasks

- Prerequisite: [04-01](./04-01-organizations-and-memberships.md)
- Follow-up: [04-03](./04-03-invites-enterprise-sso-and-jit.md), [05-01](./05-01-api-keys-and-admin-auth.md)
