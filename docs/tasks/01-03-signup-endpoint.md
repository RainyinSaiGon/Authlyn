# [Task] Signup Endpoint

> **Implementation Rules**
> 1. Keep the controller thin and push business logic into services.
> 2. Validate request payloads with explicit DTOs.
> 3. Update endpoint and interface docs together with implementation.

## GitHub Issue
- Link: TBD

---

## Overview

Implement `POST /api/public/auth/signup` as the first real identity API.

---

## Scope

### Backend

- [ ] Add signup request and response contracts
- [ ] Add signup service workflow
- [ ] Add signup controller endpoint
- [ ] Persist newly created users

### Tests

- [ ] Signup controller tests
- [ ] Signup service tests

---

## Completion Criteria

- [ ] A valid signup request creates a user
- [ ] Duplicate or invalid email cases are handled cleanly
- [ ] Signup tests pass

---

## Related Tasks

- Prerequisite: [01-02](./01-02-user-persistence-and-password-hashing.md)
- Follow-up: [01-04](./01-04-login-token-issuance-and-api-me.md)
