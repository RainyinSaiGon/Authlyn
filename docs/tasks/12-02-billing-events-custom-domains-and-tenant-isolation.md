# [Task] Billing Events, Custom Domains, and Tenant Isolation

> **Implementation Rules**
> 1. Billing event streams must remain auditable and replayable.
> 2. Custom domains must preserve auth and issuer alignment.
> 3. Tenant isolation guarantees must remain enforceable at every layer.

## GitHub Issue
- Link: TBD

---

## Overview

Complete Phase 12 by adding billing event pipelines, custom domain support, and hardened tenant isolation controls.

---

## Scope

### Backend and Infrastructure

- [ ] Add usage-based billing event emitter
- [ ] Add custom domain provisioning and validation workflows
- [ ] Harden tenant isolation behavior and safeguards
- [ ] Add row-level or equivalent isolation checks where required

### Frontend

- [ ] Add billing events and usage visibility UI
- [ ] Add custom domain setup and validation UI

### Tests

- [ ] Billing event contract tests
- [ ] Custom domain routing and certificate tests
- [ ] Tenant isolation hardening tests

---

## Completion Criteria

- [ ] Billing events are emitted and traceable
- [ ] Custom domains work for supported tenant flows
- [ ] Tenant isolation controls are validated by tests

---

## Related Tasks

- Prerequisite: [12-01](./12-01-tenant-onboarding-and-quotas.md), [07-02](./07-02-residency-redaction-retention-and-governance.md), [09-02](./09-02-ldap-ad-sync-and-role-mapping.md)
- Follow-up: None
