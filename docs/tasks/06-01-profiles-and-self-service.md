# [Task] Profiles and Self-Service

> **Implementation Rules**
> 1. Keep profile updates and security-sensitive actions separate.
> 2. Public and private metadata must remain clearly separated.
> 3. The self-service API contract should be stable before frontend implementation.

## GitHub Issue
- Link: TBD

---

## Overview

Implement the basic self-service profile and settings experience.

---

## Scope

### Backend

- [ ] Add profile read endpoint
- [ ] Add profile update endpoint
- [ ] Add public and private metadata handling

### Frontend

- [ ] Define profile screen contract
- [ ] Define self-service settings contract

### Tests

- [ ] Profile update tests
- [ ] Metadata serialization tests

---

## Completion Criteria

- [ ] Users can view and edit profile data
- [ ] Metadata handling is correct
- [ ] Profile tests pass

---

## Related Use Cases

- [UC-20](../UC/UC-20-update-profile.md) — user updates their display name and profile fields

## Related Tasks

- Prerequisite: [01-04](./01-04-login-token-issuance-and-api-me.md)
- Follow-up: [06-02](./06-02-contact-change-export-deletion-and-custom-claims.md)
