# Testing Strategy

This document outlines the testing approach for the Authlyn project. For detailed test structure, naming conventions, and setup, see [Testing Baseline](./testing-baseline.md).

## Test Pyramid

Tests are organized by type and execution speed:

```text
        /\
       /  \  E2E Tests (10%)
      /    \ Critical journeys
     /------\
    /        \  Integration Tests (20%)
   /          \ DB/Redis/API boundaries
  /------------\
 /              \ Unit Tests (70%)
/________________\ Fast, isolated logic
```

## Test Types

### Unit Tests

**Purpose**: Validate individual components in isolation (no external dependencies).

**When to use**:

- Domain models and value objects
- Business logic (password hashing, token validation)
- Utility functions
- Error handling

**Technology**: JUnit 5, Mockito, AssertJ

**Speed**: < 100ms per test

### Integration Tests

**Purpose**: Validate component interactions at boundaries (database, cache, HTTP, adapters).

**When to use**:

- Repository persistence contracts
- Service-to-database integration
- HTTP endpoint contracts
- External adapter behavior (Redis, email)
- Multi-component workflows

**Technology**: Spring Boot Test, Testcontainers, H2 (in-memory), or containerized PostgreSQL/Redis

**Speed**: 100ms–5s per test (depends on container startup)

### End-to-End Tests

**Purpose**: Validate complete user journeys through multiple layers.

**When to use**:

- Critical workflows (signup → login → access protected resource)
- Multi-step security operations (session lifecycle, token refresh, anomaly detection)
- Cross-module interactions

**Technology**: Playwright, Cypress, REST client (future phase)

**Speed**: 5s–30s per test (includes UI rendering, network round-trips)

## Coverage Priorities

**Phase 00-02 baseline coverage**:

| Module | Priority | Target | Notes |
| --- | --- | --- | --- |
| Identity (auth/sessions) | **Tier 1** | >85% | Foundational; cover happy/failure paths |
| Organization (members/roles) | **Tier 2** | >75% | Security-critical; isolation guards |
| Federation (OAuth/social) | **Tier 3** | >60% | Complex; priority in phase 03-02 |
| Platform (API keys/webhooks) | **Tier 3** | >50% | Admin feature; less critical initially |
| Shared (utils/errors) | **Tier 2** | >80% | Cross-cutting; used by all modules |

**Overall project target**: >70% line coverage (enforced in CI).

## Test Environment Matrix

| Environment | Database | Redis | Usage |
| --- | --- | --- | --- |
| Local dev | H2 (in-memory) or PostgreSQL | Docker | Fast iteration |
| CI/CD | H2 (in-memory) or Testcontainers | Testcontainers | Automated runs |
| Staging | PostgreSQL (cloud) | Managed | Pre-release validation |
| Production | PostgreSQL (cloud) | Managed | Live traffic |

## Flakiness and Debugging

**Known issues** (phase 00-02):

- Testcontainers startup can be slow on first run
- Database state isolation may require explicit cleanup between test classes
- Redis mock/in-memory stubs may not capture all real-world behavior

**Triage process** (to be enhanced):

1. Re-run test locally to confirm failure
2. Check test for timing assumptions or state leaks
3. Add explicit cleanup (`@BeforeEach`, `@AfterEach`)
4. Consider using Testcontainers for more realistic state

## Future Enhancements

- [ ] Add frontend test strategy (Vitest/Jest for unit, Playwright for E2E)
- [ ] Define flakiness tracking and retry policy
- [ ] Add performance benchmarks for critical paths
- [ ] Set up test result dashboards
- [ ] Add mutation testing for quality validation
- [ ] Define contract testing between frontend/backend

## References

- [Testing Baseline](../dev/testing-baseline.md) – Test structure, naming, setup
- [Local Development](./local-development.md) – How to run tests locally
- [Architecture](../architecture/README.md) – Module contracts and boundaries
