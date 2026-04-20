# [Task] Backend Rebuild from Clean Scaffold

> **Implementation Rules**
> 1. Treat the current backend scaffold as the only starting point.
> 2. Reintroduce infrastructure and identity logic deliberately, not all at once.
> 3. Keep each layer thin and testable.

## GitHub Issue
- Link: TBD

---

## Overview

Rebuild the backend from the reset Spring Boot scaffold, using the smaller Phase 1 and Phase 2 tasks that follow.

---

## Scope

### Starting State

- [ ] Confirm the scaffold includes only app entry point, security config, application config, migration, and context test
- [ ] Confirm JWT/JWKS implementation has been removed
- [ ] Confirm the database is empty and ready for migrations

### Planning

- [ ] Restore shared backend infrastructure in small slices
- [ ] Rebuild the identity module before session and security enhancements

---

## Completion Criteria

- [ ] The scaffold is confirmed as the practice baseline
- [ ] Follow-up tasks are ordered clearly for backend rebuilding

---

## Related Tasks

- Prerequisite: [00-01](./00-01-architecture-contracts-and-docs.md), [00-02](./00-02-local-dev-and-testing-baseline.md)
- Follow-up: [01-01](./01-01-jwt-and-jwks-foundation.md)
