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

- [x] Add login request and response contracts
- [x] Verify user credentials against hashed passwords
- [x] Issue access token and create refresh token record
- [x] Implement `GET /api/me`

### Tests

- [x] Login service tests
- [x] Login controller tests
- [x] `/api/me` controller tests

---

## Completion Criteria

- [x] Login returns access and refresh tokens
- [x] `/api/me` returns the authenticated user
- [x] Login and `/api/me` tests pass

---

## Related Use Cases

- [UC-02](../UC/UC-02-sign-in-password.md) — user signs in with email and password
- [UC-07](../UC/UC-07-refresh-access-token.md) — client silently refreshes an expired access token
- [UC-17](../UC/UC-17-view-sessions.md) — user views their list of active sessions

## Related Tasks

- Prerequisite: [01-03](./01-03-signup-endpoint.md)
- Follow-up: [01-05](./01-05-refresh-logout-and-password-reset.md), [02-01](./02-01-session-metadata-and-last-seen.md)
