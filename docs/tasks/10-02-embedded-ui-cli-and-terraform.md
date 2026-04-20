# [Task] Embedded UI, CLI, and Terraform

> **Implementation Rules**
> 1. Keep packaged UI components framework-agnostic where practical.
> 2. CLI workflows must be idempotent and scriptable.
> 3. Terraform resources must map cleanly to public API contracts.

## GitHub Issue
- Link: TBD

---

## Overview

Complete Phase 10 by shipping embedded auth UI components, CLI workflows, and Terraform integration.

---

## Scope

### Frontend and Packages

- [ ] Package embedded components (for example sign-in and profile widgets)
- [ ] Publish reusable auth UI package artifacts
- [ ] Add docs and demo usage examples

### Tooling

- [ ] Add CLI commands for tenant setup and auth operations
- [ ] Add Terraform provider or module baseline
- [ ] Add post-auth hook registration workflows

### Tests

- [ ] Embedded UI integration tests
- [ ] CLI smoke tests
- [ ] Terraform acceptance tests

---

## Completion Criteria

- [ ] Embedded UI package is consumable
- [ ] CLI workflows run reliably
- [ ] Terraform workflows provision expected resources

---

## Related Tasks

- Prerequisite: [10-01](./10-01-public-api-and-sdk-foundation.md)
- Follow-up: [12-02](./12-02-billing-events-custom-domains-and-tenant-isolation.md)
