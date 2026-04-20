# [Task] SCIM Provisioning

> **Implementation Rules**
> 1. Keep SCIM behavior standards-compliant before optimizing internals.
> 2. Ensure provisioning operations are idempotent.
> 3. Preserve strict organization isolation for every SCIM action.

## GitHub Issue
- Link: TBD

---

## Overview

Start Phase 9 by implementing SCIM provisioning endpoints and synchronization foundations.

---

## Scope

### Backend

- [ ] Add SCIM user provisioning endpoints
- [ ] Add SCIM group provisioning endpoints
- [ ] Add external-to-internal identity mapping persistence
- [ ] Add idempotency and retry handling for SCIM writes

### Admin Surface

- [ ] Add SCIM configuration settings
- [ ] Add SCIM sync status visibility

### Tests

- [ ] SCIM contract tests
- [ ] Idempotency and retry tests
- [ ] Mapping integrity tests

---

## Completion Criteria

- [ ] SCIM user and group provisioning works
- [ ] Mapping data remains consistent
- [ ] SCIM contract tests pass

---

## Related Tasks

- Prerequisite: [04-03](./04-03-invites-enterprise-sso-and-jit.md)
- Follow-up: [09-02](./09-02-ldap-ad-sync-and-role-mapping.md)
