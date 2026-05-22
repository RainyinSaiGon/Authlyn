# [Task] Contact Change, Export, Deletion, and Custom Claims

> **Implementation Rules**
> 1. Contact changes must always require verification.
> 2. Export and deletion workflows must be auditable.
> 3. Custom claims must be explicit and documented.

## GitHub Issue
- Link: TBD

---

## Overview

Complete Phase 6 by implementing secure contact changes, account export and deletion, and custom claim support.

---

## Scope

### Backend

- [ ] Add email change workflow
- [ ] Add phone change workflow
- [ ] Add account export workflow
- [ ] Add account deletion workflow
- [ ] Add custom claim injection rules

### Tests

- [ ] Contact verification tests
- [ ] Export and deletion tests
- [ ] Custom claim token tests

---

## Completion Criteria

- [ ] Contact change works with verification
- [ ] Export and deletion flows work
- [ ] Custom claims work safely

---

## Related Use Cases

- [UC-21](../UC/UC-21-change-email.md) — user changes their email address with verification
- [UC-22](../UC/UC-22-change-phone.md) — user changes their phone number with verification
- [UC-26](../UC/UC-26-export-account-data.md) — user exports a copy of their account data
- [UC-27](../UC/UC-27-delete-account.md) — user permanently deletes their account

## Related Tasks

- Prerequisite: [06-01](./06-01-profiles-and-self-service.md)
- Follow-up: [07-01](./07-01-consent-and-privacy-controls.md), [10-01](./10-01-public-api-and-sdk-foundation.md)
