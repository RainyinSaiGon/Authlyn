# [Task] Architecture Contracts and Docs Baseline

## Implementation Rules

1. Before implementation, update the relevant sections in [interfaces.md](../architecture/interfaces.md).
2. If a dependency is not implemented yet, create a stub and add `# TODO: Implemented in task XX-YY`.
3. After implementation, update any affected architecture document.

## GitHub Issue

- Link: https://github.com/RainyinSaiGon/Authlyn/issues/1

---

## Overview

Establish the architecture document set that later tasks will rely on.

---

## Scope

### Documentation

- [x] Expand shared and identity sections in `interfaces.md`
- [x] Define the first identity endpoints in `api-endpoints.md`
- [x] Document the current tables and intended ownership in `database.md`
- [x] Define session and refresh-token lifecycles in `state-machine.md`

### Project Conventions

- [x] Define how backend modules should be added
- [x] Define how frontend feature slices should be added later
- [x] Define when architecture docs must be updated

---

## Completion Criteria

- [x] The architecture docs are usable as implementation contracts
- [x] Identity and shared contracts are documented
- [x] Database and state-machine docs cover the current scaffold

---

## Related Tasks

- Prerequisite: None
- Follow-up: [00-02](./00-02-local-dev-and-testing-baseline.md), [00-03](./00-03-backend-rebuild-from-clean-scaffold.md)
