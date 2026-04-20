# [Task] Local Development and Testing Baseline

> **Implementation Rules**
> 1. Keep the local workflow simple and reproducible.
> 2. Any new testing conventions must be reflected in documentation.
> 3. Do not add feature logic in this task beyond what is needed for the baseline.

## GitHub Issue
- Link: TBD

---

## Overview

Set the local development and testing expectations before feature work begins.

---

## Scope

### Backend

- [ ] Document how to run the app against PostgreSQL and Redis
- [ ] Standardize backend test naming and package structure
- [ ] Define when to use unit tests, integration tests, and Testcontainers

### Frontend

- [ ] Define the future frontend test strategy
- [ ] Define how API mocking should work for React features later

### Repo Tooling

- [ ] Confirm ignore rules for generated files
- [ ] Confirm what counts as source of truth for contracts

---

## Completion Criteria

- [ ] The local development workflow is documented
- [ ] Test expectations are documented for backend and frontend
- [ ] The repo is ready for incremental feature work

---

## Related Tasks

- Prerequisite: [00-01](./00-01-architecture-contracts-and-docs.md)
- Follow-up: [00-03](./00-03-backend-rebuild-from-clean-scaffold.md)
