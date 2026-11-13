# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Authlyn is a full-stack Identity and Access Management (IAM) platform. The backend is a Spring Boot 4 application (Java 25) and the frontend is a React 19 + Vite + TypeScript app. The project is being built in phases. Phase 01 (core auth: JWT/JWKS, signup, login, refresh, logout/session revocation, password reset, social login, Redis-backed rate limiting) and its security hardening are done; organizations/roles and an admin AI chatbot are also in. Next is Phase 02: turning Authlyn into an OAuth 2.1/OIDC authorization server (Spring Authorization Server) with `aud`/`scope` claims in tokens.

## Commands

### Backend (run from project root)
```bash
./gradlew bootRun                                         # Start backend on :8080
./gradlew test                                            # Run all tests
./gradlew test --tests RsaKeyServiceTest                  # Run one test class
./gradlew test --tests RsaKeyServiceTest.testMethodName   # Run one test method
./gradlew test --tests com.authlyn.modules.identity.service.SignupServiceTest --tests com.authlyn.modules.identity.service.LoginServiceTest --tests com.authlyn.modules.identity.service.RefreshServiceTest --tests com.authlyn.modules.identity.service.LogoutServiceTest
./gradlew test --tests com.authlyn.modules.identity.service.PasswordResetServiceTest
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
npm run test           # Vitest (jsdom, @testing-library/react, MSW fake backend in src/test/msw)
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

Redis is now part of the auth runtime: revoked sessions are mirrored into Redis, and protected JWTs are checked against that session-state cache. Password-reset delivery is stubbed through a mail service abstraction.

## Architecture

### Request Flow
Frontend (`:5173`) → Vite proxy → Backend (`:8080`) → PostgreSQL + Redis

The Vite dev server proxies `/api`, `/actuator`, and `/.well-known` to the backend. Spring Security validates JWT tokens using keys from `/.well-known/jwks.json` and checks Redis-backed session revocation via the access token `sid` claim.

### Backend Package Layout (`src/main/java/com/authlyn/`)
- `modules/<domain>/` — product features: `modules.identity` (auth flows), `modules.org` (organizations, members, roles), `modules.chatbot` (admin AI assistant). Each module owns its controllers, services, and DTOs.
- `shared/<capability>/` — reusable infrastructure (e.g., `shared.config.SecurityConfig`, `shared.security.jwt.*`).

New features belong in `modules.<domain>`. Cross-cutting concerns (security, config) go in `shared`.

### Key Backend Wiring
- **`SecurityConfig`** — CORS, OAuth2 resource server, JWT encoder/decoder beans, public endpoint whitelist
- **`JwtSessionStateValidator`** — rejects access tokens whose session id has been revoked in Redis
- **`RedisSessionStateService`** — stores session revocation markers in Redis
- **`JwtTokenService`** — issues access tokens with session (`sid`) claims
- **`PasswordResetService`** — issues one-time password reset tokens, stubs mail delivery, and revokes active sessions on confirmation
- **`RsaKeyService`** — loads RSA keys from inline PEM, file path, or classpath; fails startup if none is configured, unless `AUTHLYN_JWT_ALLOW_EPHEMERAL_KEY=true` (local dev/tests) allows a random per-process key
- **`JwksController`** — serves `/.well-known/jwks.json` from the public key derived by `RsaKeyService`
- **`SignupService` / `LoginService` / `RefreshService` / `LogoutService`** — implement the current auth flow, including refresh rotation, reuse detection, and logout/logout-all revocation
- **`OAuth2LoginSuccessHandler` / `OAuthLoginCodeService`** — social login (Google/GitHub). The backend redirects to the frontend's `/oauth/callback?code=…` with a 60-second one-time code, which the frontend exchanges at `POST /api/public/auth/oauth/exchange`; tokens never go in URLs
- **`LoginRateLimitFilter`** — per-IP login limit kept in Redis; `X-Forwarded-For` is trusted only from `AUTHLYN_TRUSTED_PROXY_CIDRS`
- **`ChatbotService`** (Spring AI 2.0, OpenAI, pgvector) — admin assistant at `POST /api/admin/chatbot/ask` (SSE), gated by `SCOPE_admin`. Needs `OPENAI_API_KEY` and pgvector; H2 tests set `authlyn.chatbot.index-on-startup=false`, and chatbot tests are plain Mockito tests
- **`AuthlynJwtProperties`** — binds `application.yml` JWT config (issuer, TTLs, key paths)
- Flyway manages schema; JPA is set to `ddl-auto: validate` (never auto-generates tables). Migrations in `src/main/resources/db/migration/` (`V{n}__description.sql`)
- Actuator exposes only `health`, `info`, and `prometheus` (readiness/liveness probes enabled for container orchestration)

### Frontend Feature Layout (`frontend/src/`)
- `app/` — router setup (`createBrowserRouter`), app shell
- `features/<name>/` — self-contained feature slices: each has its own `api/`, `components/`, and screen files. Current features: `auth`, `account`, `admin`, `marketing`, `errors`, `onboarding`, `mobile`, `overview`.
- `components/ui/` — shared UI primitives (Button, InputField, Modal, etc.) styled with Tailwind
- `components/layout/` — layout shells (AuthShell, AccountShell, AdminShell, Sidebar)
- `components/auth/` — `RequireAuth` and `RequireAdmin` route-guard wrappers
- `shared/api/http.ts` — the one fetch wrapper (`request<T>`, plus `HttpError` with `status` and `NetworkError`). UI code branches on status codes, never on error bodies
- `features/auth/` — the auth core: `api/authApi.ts` (public endpoints), `api/accountApi.ts` (bearer endpoints, `signOut`), `authorizedRequest.ts` (bearer + single-flight silent refresh, cross-tab Web Lock so a refresh token is never replayed), `session.ts` (localStorage session store, `useSession()` via `useSyncExternalStore`), `schemas.ts` (zod; `PASSWORD_RULES` mirrors the backend `StrongPasswordValidator`)
- Forms use react-hook-form + zod through `components/form/FormTextField`; form-level errors use `FormAlert` (`role="alert"`)
- Sign in, sign up, forgot/reset password, the OAuth callback and the Profile header talk to the backend; the other screens are still static mockups. Tokens live in `localStorage` until the planned BFF moves them into HttpOnly cookies
- `shared/config/env.ts` — normalizes `VITE_API_BASE_URL` (trailing-slash handling)
- `shared/types/` — TypeScript contracts shared across features
- Path alias `@` resolves to `./src` (e.g., `@/features/auth`)

## Conventions

### Backend
- **Test naming**: `{ClassName}Test` for unit tests, `{ClassName}IntegrationTest` for Spring/DB/HTTP tests
- **Test method naming**: `test{Scenario}{ExpectedOutcome}` (e.g., `testGeneratesAnEphemeralKeyWhenNothingIsConfigured`)
- Unit tests use H2 in-memory DB; prefer self-contained H2-backed integration tests when possible, and use Testcontainers only when the external dependency is the thing under test
- Password-reset tests use the stubbed mail service and the H2-backed integration path; no external SMTP server is required
- Test packages mirror production packages exactly
- Class names are explicit and long: `PublicMetaController`, `SignupRequest`, `RsaKeyService`

Note: the current auth integration test is H2-backed and does not require Docker.

### Frontend
- All HTTP calls go through `shared/api/http.ts` (`request<T>`), or `authorizedRequest` for bearer calls — no inline `fetch` in components
- Tests hit the MSW fake backend (`src/test/msw/handlers.ts`, overridden per test with `server.use`); unhandled requests fail the test
- Feature API modules live at `features/<name>/api/`
- TypeScript strict mode is enforced; no `any` unless justified
- `npm run typecheck` checks `tsconfig.app.json` and `tsconfig.node.json` explicitly (plain `tsc --noEmit` on the root config checks nothing)

### Frontend Accessibility (WCAG 2.2 AA)
- `src/app/routes.a11y.test.tsx` renders **every route** and fails on any axe-core WCAG A/AA violation. Add new routes to its `PAGES` list
- jsdom can't judge colour contrast, and axe in a browser can't either, because every page sits on a gradient. Keep text on the `fg-*` tokens: `fg-3` is the faintest allowed (>= 4.5:1). Use `--color-danger-text` for red text, and `--color-danger` only for dots and borders
- Components enforce names through their types: an icon-only `Button` needs `aria-label`; `Toggle`, `Tabs`, `Segmented` and `SelectList` need a `label`
- Use the shared patterns, not hand-rolled ones: `Modal` (focus trap, Escape, focus restore), `Tabs` (arrow keys), `SelectList` (list/detail with `aria-current`). Never put `onClick` on a `div` or `span`
- Pages with navigation render `SkipLink` and give `<main>` the `MAIN_CONTENT_ID`; nav links set `aria-current="page"`
- `eslint-plugin-jsx-a11y` is not used: it doesn't support ESLint 10 yet

### Docs-First Contract
HTTP endpoints are documented in `docs/architecture/api-endpoints.md` before implementation. Update the contract doc first, then write code to match.

### Architecture Docs
`docs/architecture/` contains 13 living design documents (auth, security, JWT/JWKS flow, database, state machine, logging, deployment, CI/CD, etc.). Read relevant docs before implementing a new feature or changing a cross-cutting concern. `docs/dev/contract-governance.md` covers the contract-first workflow in detail.

### Code Review Guidelines
`.github/instructions/instructions.md` contains code review expectations (senior-engineer tone, SOLID/DRY focus). PRs use the template at `.github/PULL_REQUEST_TEMPLATE.md`.
