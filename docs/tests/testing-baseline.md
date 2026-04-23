# Testing Baseline

This document defines test structure, naming conventions, and when to use each test type for the Authlyn project.

See also [Test Strategy](./strategy.md) for coverage priorities and execution matrix.

## Test Strategy Overview

Authlyn uses a three-tier testing pyramid:

1. **Unit Tests** (70%) – Fast, isolated, single responsibility
2. **Integration Tests** (20%) – Component boundaries, database, Redis, external adapters
3. **End-to-End Tests** (10%) – Critical user journeys, contract validation

## Backend Test Structure

### Package and Naming Conventions

Test classes mirror the production package structure and follow Java/JUnit conventions:

```text
src/
├── main/java/com/authlyn/
│   ├── config/
│   ├── security/
│   ├── modules/
│   │   ├── identity/
│   │   │   ├── domain/
│   │   │   │   ├── model/User.java
│   │   │   │   └── service/AuthService.java
│   │   │   └── adapter/http/AuthController.java
│   │   └── ...
│   └── shared/
└── test/java/com/authlyn/
    ├── config/
    ├── security/
    ├── modules/
    │   ├── identity/
    │   │   ├── domain/
    │   │   │   ├── model/UserTest.java
    │   │   │   └── service/AuthServiceTest.java
    │   │   └── adapter/http/AuthControllerIntegrationTest.java
    │   └── ...
    └── shared/
```

### Naming Rules

- **Unit test class**: `{ClassName}Test.java`
  - Example: `User.java` → `UserTest.java`
  - Plain JUnit 5 test class; use `@DisplayName("User")` only when a clearer test label helps readability

- **Integration test class**: `{ClassName}IntegrationTest.java`
  - Example: `AuthController.java` → `AuthControllerIntegrationTest.java`
  - Use `@SpringBootTest` when the test loads the Spring context or exercises infrastructure boundaries

- **Test method naming**: `test{Scenario}{ExpectedOutcome}`
  - Example: `testLoginWithValidCredentialsReturnsToken()`
  - Example: `testSignupWithDuplicateEmailThrowsConflictError()`

### When to Use Each Type

#### Unit Tests

**Use for**:

- Domain models, value objects, logic
- Services with no external dependencies
- Utilities and helpers
- Validation logic
- Error handling paths

**Example**:

```java
@DisplayName("User Password Hashing")
class UserTest {
    
    @Test
    @DisplayName("should hash password using bcrypt")
    void testPasswordHashingUsesBcrypt() {
        // Arrange
        var user = new User("user@example.com", "rawPassword");
        
        // Act
        var hashed = user.hashPassword("rawPassword");
        
        // Assert
        assertThat(hashed).isNotEqualTo("rawPassword");
        assertThat(hashed).startsWith("$2a$"); // bcrypt prefix
    }
}
```

**Tools**: JUnit 5, AssertJ, Mockito

#### Integration Tests (via Testcontainers)

**Use for**:

- Database persistence (queries, transactions)
- Redis session/cache operations
- Repository contracts
- Service-to-repository boundaries
- HTTP endpoint contracts
- External API adapters

**Example**:

```java
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:authlyn;MODE=PostgreSQL",
    "spring.flyway.enabled=false"
})
@DisplayName("AuthService Database Integration")
class AuthServiceIntegrationTest {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    @DisplayName("should persist user and return created entity")
    void testSignupPersistsUser() {
        // Arrange
        var command = new SignupCommand("user@example.com", "password123");
        
        // Act
        var result = authService.signup(command);
        
        // Assert
        assertThat(result).isNotNull();
        var saved = userRepository.findByEmail("user@example.com");
        assertThat(saved).isPresent();
    }
}
```

**Tools**: Spring Boot Test, Testcontainers, H2 (in-memory), or containerized PostgreSQL

#### End-to-End Tests (Future)

**Use for**:

- Full user journeys (signup → login → access protected resource)
- Multi-step scenarios that validate contract boundaries
- Critical security paths (session lifecycle, token refresh)

**Will be added in phase 02-03 (Session Management).**

### Testcontainers Setup

Testcontainers automatically provision containerized dependencies for integration tests.

**Current baseline** (H2 in-memory):

```java
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:authlyn;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.flyway.enabled=false"
})
class MyIntegrationTest {
    // Tests run against H2 (fast)
}
```

**Future PostgreSQL container** (when contract validation requires production schema):

```java
@SpringBootTest
@Testcontainers
class MyPostgresIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = 
        new PostgreSQLContainer<>("postgres:18-alpine")
            .withDatabaseName("authlyn_test")
            .withUsername("authlyn")
            .withPassword("test");
    
    @DynamicPropertySource
    static void registerPostgresProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    // Tests run against containerized PostgreSQL (slower but production-like)
}
```

## Test Coverage Priorities

**Phase 00-02 baseline**: Focus on fast unit tests and shallow integration tests.

1. **Tier 1 (Critical)**: Auth happy/failure paths, session lifecycle, token rotation
2. **Tier 2 (High)**: Authorization gates, organization isolation, API contracts
3. **Tier 3 (Medium)**: Edge cases, malformed input handling, error messages
4. **Tier 4 (Low)**: Admin operations, audit logs, non-critical features

**Coverage target**: Aim for >80% line coverage in security-critical paths (identity, organization).

## Frontend Test Strategy

Frontend testing is deferred to later phases but will follow these conventions:

### Planned Approach

- **Unit Tests**: Component props, hooks, utility functions (Vitest or Jest)
- **Integration Tests**: Component interactions, API client integration
- **E2E Tests**: Critical user flows (Playwright or Cypress)

### Test Structure (Future)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── LoginForm.test.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useAuth.test.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── api.test.ts
│   └── ...
└── e2e/
    ├── auth.spec.ts
    ├── organization.spec.ts
    └── ...
```

### API Mocking Strategy (Future)

When frontend tests need to simulate backend responses:

1. **Mock Service Worker (MSW)** – Intercept network requests at HTTP level
   - Define request handlers for each endpoint
   - Reuse handlers across component and E2E tests
   - Mock success and error scenarios

**Example** (future):

```typescript
// Mock handlers
export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    return HttpResponse.json({
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
    });
  }),
  
  http.post('/api/auth/login', async ({ request }) => {
    return HttpResponse.json(
      { error: { code: 'INVALID_CREDENTIALS' } },
      { status: 401 }
    );
  }),
];

// Use in tests
setupServer(...handlers);
```

1. **Component Prop-Based Mocks** – Pass mock props directly to components for unit testing
2. **Fixture Files** – Store common test data in `__fixtures__/` directories

### Frontend Test Naming

- **Component test**: `{ComponentName}.test.tsx` (e.g., `LoginForm.test.tsx`)
- **Hook test**: `{HookName}.test.ts` (e.g., `useAuth.test.ts`)
- **Utility test**: `{UtilityName}.test.ts` (e.g., `formatDate.test.ts`)
- **E2E test**: `{Feature}.spec.ts` (e.g., `auth.spec.ts`)

## Running Tests Locally

### Backend

```bash
# All tests
./gradlew test

# Integration tests by naming convention
./gradlew test --tests '*IntegrationTest'

# No dedicated "unit tests only" filter is currently configured.
# Run specific unit test classes with --tests, for example:
./gradlew test --tests AuthServiceTest

# Specific test class
./gradlew test --tests AuthServiceTest

# Specific test method
./gradlew test --tests AuthServiceTest.testLoginSuccess

# With coverage report
./gradlew test jacocoTestReport
```

### Frontend (Future)

```bash
cd frontend

# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Continuous Integration

**GitHub Actions** (future): Tests run on:

- Pull request creation/update
- Push to main branch
- Scheduled nightly runs

Test results gate PR merges (no failures allowed).

## Test Maintenance

1. **Keep tests independent**: No shared state between test methods
2. **Use meaningful assertions**: Avoid generic `assertTrue(condition)`
3. **Mock external dependencies**: No real API calls, emails, or network requests
4. **Clean up resources**: Use `@BeforeEach`/`@AfterEach` or test containers cleanup
5. **Update tests with features**: Tests are part of the contract and should change when contracts change
6. **Avoid test duplication**: Extract common setup into helpers or `@BeforeEach`

## Next Steps

- See [Local Development Setup](../runbooks/local-development.md) to run tests locally
- See [Architecture Docs](../architecture/index.md) to understand modules and contracts
- Phase 01-01 will add JWT/JWKS tests and expand identity module tests
