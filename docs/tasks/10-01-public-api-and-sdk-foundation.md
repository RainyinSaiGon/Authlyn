# [Task] Public API and SDK Foundation

> **Implementation Rules**
> 1. Stabilize API contracts before broad SDK support.
> 2. Keep API versioning explicit from day one.
> 3. Prefer generated clients when possible to reduce drift.

## GitHub Issue
- Link: TBD

---

## Overview

Start Phase 10 by formalizing public API contracts and establishing official SDK foundations.

---

## Scope

### Platform APIs

- [ ] Define stable public API surface for tenant admin workflows
- [ ] Define API versioning and deprecation strategy
- [ ] Publish OpenAPI and contract docs for SDK generation

### SDKs

- [ ] Add primary official SDK baseline
- [ ] Add auth and token management helpers
- [ ] Add SDK contract test harness

### Tests

- [ ] API contract compatibility tests
- [ ] SDK integration tests

---

## Completion Criteria

- [ ] Public API contracts are stable and documented
- [ ] At least one official SDK is usable
- [ ] Contract and SDK tests pass

---

## Related Tasks

- Prerequisite: [06-02](./06-02-contact-change-export-deletion-and-custom-claims.md)
- Follow-up: [10-02](./10-02-embedded-ui-cli-and-terraform.md)
