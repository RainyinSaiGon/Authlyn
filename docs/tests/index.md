# Testing Documentation

This folder contains test strategy, conventions, and planning templates.

## Essential Reading

1. **[Testing Baseline](./testing-baseline.md)** – Test structure, naming conventions, when to use each test type
   - Package structure and naming rules
   - Unit vs integration vs E2E tests
   - Testcontainers setup
   - Frontend test strategy

2. **[Test Strategy](./strategy.md)** – Coverage priorities and execution matrix
   - Test pyramid and types
   - Coverage targets by module
   - Environment setup (local/CI/staging/production)
   - Flakiness triage

3. **[Test Plan Template](./test-plan-template.md)** – Use for phase-specific test plans

## Key Principles

- Keep test docs aligned with task phases
- Prefer small, focused plans over one giant plan
- Tests must validate contract compliance (see [Contract Governance](../dev/contract-governance.md))
