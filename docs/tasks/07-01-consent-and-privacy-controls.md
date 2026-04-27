# [Task] Consent and Privacy Controls

> **Implementation Rules**
> 1. Treat consent history as immutable records.
> 2. Keep user-facing privacy controls simple and explicit.
> 3. Ensure every consent change is auditable.

## GitHub Issue
- Link: TBD

---

## Overview

Start Phase 7 by implementing consent capture, withdrawal, and privacy preference management.

---

## Scope

### Backend

- [ ] Add consent grant and withdrawal APIs
- [ ] Add immutable consent history writes
- [ ] Add privacy preference service and validation

### Frontend

- [ ] Add consent management UI
- [ ] Add user privacy settings UI

### Tests

- [ ] Consent history immutability tests
- [ ] Consent lifecycle API tests
- [ ] Privacy settings tests

---

## Completion Criteria

- [ ] Consent can be granted and withdrawn safely
- [ ] Consent history is immutable and queryable
- [ ] Privacy settings are manageable by users

---

## Related Use Cases

- [UC-37](../UC/UC-37-grant-consent.md) — user grants consent to a data processing activity
- [UC-38](../UC/UC-38-withdraw-consent.md) — user withdraws a previously granted consent

## Related Tasks

- Prerequisite: [06-02](./06-02-contact-change-export-deletion-and-custom-claims.md)
- Follow-up: [07-02](./07-02-residency-redaction-retention-and-governance.md)
