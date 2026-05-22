# [Task] User Persistence and Password Hashing

> **Implementation Rules**
> 1. Keep user persistence inside the identity module.
> 2. Password hashing must use BCrypt and remain configurable.
> 3. Align repository contracts with the schema before coding.

## GitHub Issue
- Link: TBD

---

## Overview

Add the persistence layer required for user creation and credential verification.

---

## Scope

### Database

- [ ] Reconfirm `users` constraints and indexes
- [ ] Confirm case-insensitive email lookup strategy

### Backend

- [ ] Add user entity and repository
- [ ] Add password hashing service
- [ ] Add identity module service contracts for signup and login

### Tests

- [ ] Repository tests for user lookup and persistence
- [ ] Service tests for password hashing behavior

---

## Completion Criteria

- [ ] Users can be persisted and loaded by email
- [ ] Password hashing and verification are implemented
- [ ] Persistence and hashing tests pass

---

## Related Use Cases

- [UC-01](../UC/UC-01-sign-up.md) — user registers a new account with email and password
- [UC-02](../UC/UC-02-sign-in-password.md) — user signs in with email and password
- [UC-06](../UC/UC-06-reset-password.md) — user resets their password using a reset token

## Related Tasks

- Prerequisite: [01-01](./01-01-jwt-and-jwks-foundation.md)
- Follow-up: [01-03](./01-03-signup-endpoint.md), [01-04](./01-04-login-token-issuance-and-api-me.md)
