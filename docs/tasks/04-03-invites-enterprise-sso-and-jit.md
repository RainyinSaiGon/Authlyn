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

## Related Use Cases

- [UC-29](../UC/UC-29-invite-member.md) — organization admin invites a user to join the organization
- [UC-30](../UC/UC-30-accept-invitation.md) — invited user accepts an organization membership invitation
- [UC-32](../UC/UC-32-configure-sso.md) — admin configures enterprise SSO for an organization
- [UC-33](../UC/UC-33-sso-sign-in.md) — user signs in via enterprise SSO
- [UC-42](../UC/UC-42-invite-user-admin.md) — platform admin invites a new user to the platform

## Related Tasks

- Prerequisite: [04-02](./04-02-roles-permissions-and-org-claims.md)
- Follow-up: [09-01](./09-01-scim-provisioning.md)
