# [Task] Local Development and Testing Baseline

> **Implementation Rules**
>
> 1. Keep the local workflow simple and reproducible.
> 2. Any new testing conventions must be reflected in documentation.
> 3. Do not add feature logic in this task beyond what is needed for the baseline.

## GitHub Issue

- [Issue #3](https://github.com/RainyinSaiGon/Authlyn/issues/3)

---

## Overview

Set the local development and testing expectations before feature work begins.

---

## Scope

### Backend

- [x] Document how to run the app against PostgreSQL and Redis
- [x] Standardize backend test naming and package structure
- [x] Define when to use unit tests, integration tests, and Testcontainers

### Frontend

- [x] Define the future frontend test strategy
- [x] Define how API mocking should work for React features later

### Repo Tooling

- [x] Confirm ignore rules for generated files
- [x] Confirm what counts as source of truth for contracts

---

## Completion Criteria

- [x] The local development workflow is documented
- [x] Test expectations are documented for backend and frontend
- [x] The repo is ready for incremental feature work

---

## Related Tasks

- Prerequisite: [00-01](./00-01-architecture-contracts-and-docs.md)
- Follow-up: [00-03](./00-03-backend-rebuild-from-clean-scaffold.md)
