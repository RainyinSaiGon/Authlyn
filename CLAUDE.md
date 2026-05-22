# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Authlyn is a full-stack Identity and Access Management (IAM) platform. The backend is a Spring Boot 4 application (Java 25) and the frontend is a React 19 + Vite + TypeScript app. The project is being built in phases; current work is Phase 01 (core auth: JWT/JWKS foundation, signup, login, refresh, and logout/session revocation).

## Commands

### Backend (run from project root)
```bash
./gradlew bootRun                                         # Start backend on :8080
./gradlew test                                            # Run all tests
./gradlew test --tests RsaKeyServiceTest                  # Run one test class
./gradlew test --tests RsaKeyServiceTest.testMethodName   # Run one test method
./gradlew test --tests com.authlyn.modules.identity.service.SignupServiceTest --tests com.authlyn.modules.identity.service.LoginServiceTest --tests com.authlyn.modules.identity.service.RefreshServiceTest --tests com.authlyn.modules.identity.service.LogoutServiceTest
./gradlew test --tests com.authlyn.modules.identity.controller.AuthControllerIntegrationTest
./gradlew test jacocoTestReport                           # Generate coverage report
./gradlew clean
```

### Frontend (run from `frontend/`)
```bash
npm run dev        # Vite dev server on :5173
npm run build
npm run lint
npm run typecheck
```

### Frontend Tests (run from `frontend/`)
```bash
npm run test           # Vitest (jsdom environment, @testing-library/react)
npm run coverage       # Test coverage report
```

### Infrastructure
```bash
docker compose up -d    # Start Redis only (required for session revocation; PostgreSQL is Neon — external)
docker compose down -v  # Stop and wipe volumes
```

## Local Development Setup

1. Copy `.env.example` → `.env` and fill in DB credentials (Neon PostgreSQL is the team baseline)
2. `docker compose up -d`
3. `./gradlew bootRun`
4. `cd frontend && npm install && npm run dev`

Key env vars: `AUTHLYN_DB_URL`, `AUTHLYN_DB_USERNAME`, `AUTHLYN_DB_PASSWORD`, `AUTHLYN_REDIS_HOST/PORT/PASSWORD`. See `.env.example` for the full list.

Redis is now part of the auth runtime: revoked sessions are mirrored into Redis, and protected JWTs are checked against that session-state cache.

## Architecture

### Request Flow
Frontend (`:5173`) → Vite proxy → Backend (`:8080`) → PostgreSQL + Redis

The Vite dev server proxies `/api`, `/actuator`, and `/.well-known` to the backend. Spring Security validates JWT tokens using keys from `/.well-known/jwks.json` and checks Redis-backed session revocation via the access token `sid` claim.

### Backend Package Layout (`src/main/java/com/authlyn/`)
- `modules/<domain>/` — product features (e.g., `modules.identity`, `modules.system`). Each module owns its controllers, services, and DTOs.
- `shared/<capability>/` — reusable infrastructure (e.g., `shared.config.SecurityConfig`, `shared.security.jwt.*`).

New features belong in `modules.<domain>`. Cross-cutting concerns (security, config) go in `shared`.

### Key Backend Wiring
- **`SecurityConfig`** — CORS, OAuth2 resource server, JWT encoder/decoder beans, public endpoint whitelist
- **`JwtSessionStateValidator`** — rejects access tokens whose session id has been revoked in Redis
- **`RedisSessionStateService`** — stores session revocation markers in Redis
- **`JwtTokenService`** — issues access tokens with session (`sid`) claims
- **`RsaKeyService`** — loads RSA keys from inline PEM, file path, or classpath; generates ephemeral key if none configured
- **`JwksController`** — serves `/.well-known/jwks.json` from the public key derived by `RsaKeyService`
- **`SignupService` / `LoginService` / `RefreshService` / `LogoutService`** — implement the current auth flow, including refresh rotation, reuse detection, and logout/logout-all revocation
- **`AuthlynJwtProperties`** — binds `application.yml` JWT config (issuer, TTLs, key paths)
- Flyway manages schema; JPA is set to `ddl-auto: validate` (never auto-generates tables). Migrations in `src/main/resources/db/migration/` (`V{n}__description.sql`)
- Actuator exposes only `health`, `info`, and `prometheus` (readiness/liveness probes enabled for container orchestration)

### Frontend Feature Layout (`frontend/src/`)
- `app/` — router setup (`createBrowserRouter`), app shell
- `features/<name>/` — self-contained feature slices: each has its own `api/`, `components/`, and screen files. Current features: `auth`, `account`, `admin`, `marketing`, `errors`, `onboarding`, `mobile`, `overview`.
- `components/ui/` — shared UI primitives (Button, InputField, Modal, etc.) styled with Tailwind
- `components/layout/` — layout shells (AuthShell, AccountShell, AdminShell, Sidebar)
- `components/auth/` — `RequireAuth` and `RequireAdmin` route-guard wrappers
- `shared/api/` — typed fetch wrapper (`getJson<T>`) — never do raw fetch in components
- `shared/config/env.ts` — normalizes `VITE_API_BASE_URL` (trailing-slash handling)
- `shared/types/` — TypeScript contracts shared across features
- Path alias `@` resolves to `./src` (e.g., `@/features/auth`)

## Conventions

### Backend
- **Test naming**: `{ClassName}Test` for unit tests, `{ClassName}IntegrationTest` for Spring/DB/HTTP tests
- **Test method naming**: `test{Scenario}{ExpectedOutcome}` (e.g., `testGeneratesAnEphemeralKeyWhenNothingIsConfigured`)
- Unit tests use H2 in-memory DB; prefer self-contained H2-backed integration tests when possible, and use Testcontainers only when the external dependency is the thing under test
- Test packages mirror production packages exactly
- Class names are explicit and long: `PublicMetaController`, `SignupRequest`, `RsaKeyService`

Note: the current auth integration test is H2-backed and does not require Docker.

### Frontend
- All HTTP calls go through `shared/api/http.ts` (`getJson<T>`) — no inline `fetch` in components
- Feature API modules live at `features/<name>/api/`
- TypeScript strict mode is enforced; no `any` unless justified

### Docs-First Contract
HTTP endpoints are documented in `docs/architecture/api-endpoints.md` before implementation. Update the contract doc first, then write code to match.

### Architecture Docs
`docs/architecture/` contains 13 living design documents (auth, security, JWT/JWKS flow, database, state machine, logging, deployment, CI/CD, etc.). Read relevant docs before implementing a new feature or changing a cross-cutting concern. `docs/dev/contract-governance.md` covers the contract-first workflow in detail.

### Code Review Guidelines
`.github/instructions/instructions.md` contains code review expectations (senior-engineer tone, SOLID/DRY focus). PRs use the template at `.github/PULL_REQUEST_TEMPLATE.md`.
