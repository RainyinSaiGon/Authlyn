# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Authlyn is a full-stack Identity and Access Management (IAM) platform. The backend is a Spring Boot 4 application (Java 25) and the frontend is a React 19 + Vite + TypeScript app. The project is being built in phases; current work is Phase 01 (core auth: JWT/JWKS foundation, signup, login).

## Commands

### Backend (run from project root)
```bash
./gradlew bootRun                                         # Start backend on :8080
./gradlew test                                            # Run all tests
./gradlew test --tests RsaKeyServiceTest                  # Run one test class
./gradlew test --tests RsaKeyServiceTest.testMethodName   # Run one test method
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

### Infrastructure
```bash
docker compose up -d    # Start Redis (required) and optional PostgreSQL
docker compose down -v  # Stop and wipe volumes
```

## Local Development Setup

1. Copy `.env.example` → `.env` and fill in DB credentials (Neon PostgreSQL is the team baseline)
2. `docker compose up -d`
3. `./gradlew bootRun`
4. `cd frontend && npm install && npm run dev`

Key env vars: `AUTHLYN_DB_URL`, `AUTHLYN_DB_USERNAME`, `AUTHLYN_DB_PASSWORD`, `AUTHLYN_REDIS_HOST/PORT/PASSWORD`. See `.env.example` for the full list.

## Architecture

### Request Flow
Frontend (`:5173`) → Vite proxy → Backend (`:8080`) → PostgreSQL + Redis

The Vite dev server proxies `/api`, `/actuator`, and `/.well-known` to the backend. Spring Security validates JWT tokens using keys from `/.well-known/jwks.json`.

### Backend Package Layout (`src/main/java/com/authlyn/`)
- `modules/<domain>/` — product features (e.g., `modules.identity`, `modules.system`). Each module owns its controllers, services, and DTOs.
- `shared/<capability>/` — reusable infrastructure (e.g., `shared.config.SecurityConfig`, `shared.security.jwt.*`).

New features belong in `modules.<domain>`. Cross-cutting concerns (security, config) go in `shared`.

### Key Backend Wiring
- **`SecurityConfig`** — CORS, OAuth2 resource server, JWT encoder/decoder beans, public endpoint whitelist
- **`RsaKeyService`** — loads RSA keys from inline PEM, file path, or classpath; generates ephemeral key if none configured
- **`JwksController`** — serves `/.well-known/jwks.json` from the public key derived by `RsaKeyService`
- **`AuthlynJwtProperties`** — binds `application.yml` JWT config (issuer, TTLs, key paths)
- Flyway migrations live in `src/main/resources/db/migration/` (versioned `V{n}__description.sql`)

### Frontend Feature Layout (`frontend/src/`)
- `app/` — router setup (`createBrowserRouter`), app shell
- `features/<name>/` — self-contained feature slices: each has its own `api/`, `components/`, and screen files
- `components/ui/` — shared UI primitives (Button, InputField, Modal, etc.) styled with Tailwind
- `components/layout/` — layout shells (AuthShell, AccountShell, AdminShell, Sidebar)
- `shared/api/` — typed fetch wrapper (`getJson<T>`) — never do raw fetch in components
- `shared/types/` — TypeScript contracts shared across features

## Conventions

### Backend
- **Test naming**: `{ClassName}Test` for unit tests, `{ClassName}IntegrationTest` for Spring/DB/HTTP tests
- **Test method naming**: `test{Scenario}{ExpectedOutcome}` (e.g., `testGeneratesAnEphemeralKeyWhenNothingIsConfigured`)
- Unit tests use H2 in-memory DB; integration tests use `@SpringBootTest` with Testcontainers
- Test packages mirror production packages exactly
- Class names are explicit and long: `PublicMetaController`, `SignupRequest`, `RsaKeyService`

### Frontend
- All HTTP calls go through `shared/api/http.ts` (`getJson<T>`) — no inline `fetch` in components
- Feature API modules live at `features/<name>/api/`
- TypeScript strict mode is enforced; no `any` unless justified

### Docs-First Contract
HTTP endpoints are documented in `docs/architecture/api-endpoints.md` before implementation. Update the contract doc first, then write code to match.
