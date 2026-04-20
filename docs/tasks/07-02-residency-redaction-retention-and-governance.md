# [Task] Residency, Redaction, Retention, and Governance

> **Implementation Rules**
> 1. Make residency and retention policy behavior configuration-driven.
> 2. Redaction must be deterministic and testable.
> 3. Governance hooks should be transparent for audits.

## GitHub Issue
- Link: TBD

---

## Overview

Complete Phase 7 by adding data residency constraints, PII redaction, retention jobs, and governance controls.

---

## Scope

### Backend

- [ ] Add residency policy evaluation
- [ ] Add redaction utilities for logs and exports
- [ ] Add retention and archival job workflows
- [ ] Add compliance governance hooks

### Infrastructure

- [ ] Add retention policy configuration
- [ ] Add governance and audit configuration toggles

### Tests

- [ ] Residency policy tests
- [ ] Redaction behavior tests
- [ ] Retention and archival job tests

---

## Completion Criteria

- [ ] Residency checks enforce policy constraints
- [ ] PII redaction is applied consistently
- [ ] Retention and archival jobs run safely
- [ ] Governance hooks are auditable

---

## Related Tasks

- Prerequisite: [07-01](./07-01-consent-and-privacy-controls.md)
- Follow-up: [12-02](./12-02-billing-events-custom-domains-and-tenant-isolation.md)
