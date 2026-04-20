# [Task] TOTP MFA and Recovery Codes

> **Implementation Rules**
> 1. Keep MFA enrollment and MFA challenge logic separate.
> 2. Recovery codes must be stored and compared securely.
> 3. Update lifecycle docs for MFA enrollment states.

## GitHub Issue
- Link: TBD

---

## Overview

Implement TOTP-based MFA enrollment, verification, and recovery code support.

---

## Scope

### Backend

- [ ] Add MFA factor persistence
- [ ] Add TOTP enrollment and verification endpoints
- [ ] Add recovery code generation and consumption

### Frontend

- [ ] Plan MFA setup and challenge contracts

### Tests

- [ ] TOTP enrollment tests
- [ ] TOTP verification tests
- [ ] Recovery code tests

---

## Completion Criteria

- [ ] Users can enroll in TOTP MFA
- [ ] Users can complete MFA challenges
- [ ] Recovery codes work safely

---

## Related Tasks

- Prerequisite: [01-05](./01-05-refresh-logout-and-password-reset.md)
- Follow-up: [03-02](./03-02-oauth-authorization-server.md), [08-01](./08-01-webauthn-and-passkeys.md)
