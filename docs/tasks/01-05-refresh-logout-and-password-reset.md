# [Task] Refresh, Logout, and Password Reset

> **Implementation Rules**
> 1. Refresh token lifecycle changes must also update `state-machine.md`.
> 2. Password reset tokens must be one-time use.
> 3. Mail delivery can be stubbed if the real implementation is not ready.

## GitHub Issue
- Link: TBD

---

## Overview

Implement the remaining Phase 1 auth flows after signup and login are working.

---

## Scope

### Backend

- [ ] Implement refresh token rotation
- [ ] Implement logout and logout-all
- [ ] Add password reset request and confirm flows
- [ ] Add refresh token reuse detection

### Tests

- [ ] Refresh rotation tests
- [ ] Logout tests
- [ ] Password reset tests

---

## Completion Criteria

- [ ] Refresh works with rotation
- [ ] Logout invalidates active auth state
- [ ] Password reset works end-to-end

---

## Related Tasks

- Prerequisite: [01-04](./01-04-login-token-issuance-and-api-me.md)
- Follow-up: [02-01](./02-01-session-metadata-and-last-seen.md), [02-03](./02-03-rate-limits-and-audit-logs.md)
