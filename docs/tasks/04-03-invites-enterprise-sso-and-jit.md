# [Task] Invites, Enterprise SSO, and JIT Provisioning

> **Implementation Rules**
> 1. Keep invite lifecycle rules explicit and documented.
> 2. Federation entry points must not bypass tenant rules.
> 3. JIT provisioning should build on membership logic, not replace it.

## GitHub Issue
- Link: TBD

---

## Overview

Implement organization invites, enterprise SSO entry points, and just-in-time provisioning.

---

## Scope

### Backend

- [ ] Add invite issue and accept workflows
- [ ] Add enterprise federation entry points
- [ ] Add JIT provisioning for organization membership

### Tests

- [ ] Invite lifecycle tests
- [ ] Federation entry tests
- [ ] JIT provisioning tests

---

## Completion Criteria

- [ ] Invites work
- [ ] Enterprise SSO entry points exist
- [ ] JIT provisioning works

---

## Related Tasks

- Prerequisite: [04-02](./04-02-roles-permissions-and-org-claims.md)
- Follow-up: [09-01](./09-01-scim-provisioning.md)
