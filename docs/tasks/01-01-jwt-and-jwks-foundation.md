# [Task] JWT and JWKS Foundation

> **Implementation Rules**
> 1. Restore JWT signing and verification as shared infrastructure.
> 2. Keep the key-loading implementation reusable and testable.
> 3. Update the JWT flow and endpoint docs after implementation.

## GitHub Issue
- Link: TBD

---

## Overview

Rebuild the shared JWT and JWKS foundation that was removed from the scaffold.

---

## Scope

### Backend

- [ ] Reintroduce JWT properties binding
- [ ] Reintroduce RSA key loading and fallback generation
- [ ] Reintroduce JWKS endpoint
- [ ] Rewire `SecurityConfig` for local signing and verification

### Tests

- [ ] JWT key service tests
- [ ] JWKS controller tests

---

## Completion Criteria

- [ ] The backend can sign and verify JWTs again
- [ ] `/.well-known/jwks.json` exists again
- [ ] JWT and JWKS tests pass

---

## Related Tasks

- Prerequisite: [00-03](./00-03-backend-rebuild-from-clean-scaffold.md)
- Follow-up: [01-02](./01-02-user-persistence-and-password-hashing.md)
