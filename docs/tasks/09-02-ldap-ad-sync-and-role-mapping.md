# [Task] LDAP, AD Sync, and Role Mapping

> **Implementation Rules**
> 1. Keep sync jobs resumable and observable.
> 2. Make group-to-role mapping explicit and editable.
> 3. Prevent cross-tenant role assignment leakage.

## GitHub Issue
- Link: TBD

---

## Overview

Complete Phase 9 by adding LDAP and Active Directory connectors, scheduled directory sync, and role mapping.

---

## Scope

### Backend

- [ ] Add LDAP connector abstraction
- [ ] Add Active Directory connector abstraction
- [ ] Add scheduled sync job framework
- [ ] Add group-to-role mapping service

### Admin Surface

- [ ] Add connector settings and credentials management
- [ ] Add mapping management UI
- [ ] Add sync run status and error visibility

### Tests

- [ ] Directory sync workflow tests
- [ ] Mapping correctness tests
- [ ] Retry and failure handling tests

---

## Completion Criteria

- [ ] LDAP and AD sync workflows run correctly
- [ ] Group-to-role mapping applies as configured
- [ ] Sync errors are observable and recoverable

---

## Related Tasks

- Prerequisite: [09-01](./09-01-scim-provisioning.md)
- Follow-up: [12-01](./12-01-tenant-onboarding-and-quotas.md)
