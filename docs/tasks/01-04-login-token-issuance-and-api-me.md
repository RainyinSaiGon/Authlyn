# [Task] Login, Token Issuance, and API Me

> **Implementation Rules**
> 1. Keep token issuance in a dedicated service, not the controller.
> 2. Make `/api/me` depend only on authenticated principal resolution.
> 3. Document request and response contracts before coding.

## GitHub Issue
- Link: TBD

---

## Overview

Implement login, access token issuance, refresh token creation, and `GET /api/me`.

---

## Scope

### Backend

- [ ] Add login request and response contracts
- [ ] Verify user credentials against hashed passwords
- [ ] Issue access token and create refresh token record
- [ ] Implement `GET /api/me`

### Tests

- [ ] Login service tests
- [ ] Login controller tests
- [ ] `/api/me` controller tests

---

## Completion Criteria

- [ ] Login returns access and refresh tokens
- [ ] `/api/me` returns the authenticated user
- [ ] Login and `/api/me` tests pass

---

## Related Tasks

- Prerequisite: [01-03](./01-03-signup-endpoint.md)
- Follow-up: [01-05](./01-05-refresh-logout-and-password-reset.md), [02-01](./02-01-session-metadata-and-last-seen.md)
