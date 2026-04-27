# [Task] WebAuthn and Passkeys

> **Implementation Rules**
> 1. Keep WebAuthn ceremonies standards-compliant.
> 2. Persist credential metadata needed for replay protection.
> 3. Keep registration and authentication flows independently testable.

## GitHub Issue
- Link: TBD

---

## Overview

Start Phase 8 with WebAuthn registration and authentication foundations for passkeys.

---

## Scope

### Backend

- [ ] Add WebAuthn registration challenge endpoint
- [ ] Add WebAuthn registration verification endpoint
- [ ] Add WebAuthn authentication challenge and verification endpoints
- [ ] Persist credential IDs, counters, and transport metadata

### Frontend

- [ ] Add passkey enrollment flow
- [ ] Add passkey sign-in flow

### Tests

- [ ] WebAuthn ceremony tests
- [ ] Counter replay protection tests
- [ ] Credential lifecycle tests

---

## Completion Criteria

- [ ] Passkeys can be enrolled and used for sign-in
- [ ] Credential counters are validated correctly
- [ ] WebAuthn tests pass

---

## Related Use Cases

- [UC-14](../UC/UC-14-enroll-passkey.md) — user enrolls a passkey on their account
- [UC-15](../UC/UC-15-sign-in-passkey.md) — user signs in using a registered passkey
- [UC-16](../UC/UC-16-remove-passkey.md) — user removes a registered passkey from their account

## Related Tasks

- Prerequisite: [03-01](./03-01-totp-mfa-and-recovery-codes.md), [02-02](./02-02-trusted-devices-and-session-management.md)
- Follow-up: [08-02](./08-02-hardware-keys-and-adaptive-auth.md)
