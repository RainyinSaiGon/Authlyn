# Authlyn Architecture

## Overview

Authlyn should be treated as a full-stack monorepo with a Spring Boot backend and a React frontend.

The repository currently contains a backend scaffold. This document defines the target structure we should build toward so the codebase stays understandable as the product grows.

## Architectural Goals

- Keep backend code domain-oriented instead of grouping everything by technical layer.
- Keep frontend code feature-oriented so UI, API calls, and view models evolve together.
- Separate cross-cutting concerns from product modules.
- Make local development simple: one backend, one frontend, one database, one Redis instance.
- Use explicit public API boundaries so the frontend does not couple to backend internals.

## Repository Layout

```text
./
|- ARCHITECTURE.md
|- README.md
|- docker-compose.yml
|- design/
|- frontend/
|  |- package.json
|  |- vite.config.ts
|  |- src/
|  |  |- app/
|  |  |- features/
|  |  |- shared/
|  |  `- styles/
|- src/
|  |- main/
|  |  |- java/com/authlyn/
|  |  |  |- modules/
|  |  |  |- shared/
|  |  |  `- AuthlynApplication.java
|  |  `- resources/
|  `- test/
|     `- java/com/authlyn/
|- docs/
|  `- architecture/
`- gradle/
```

## Backend Structure

Backend code lives under `src/main/java/com/authlyn`.

### Rules

- `modules/` contains product domains and business-facing APIs.
- `shared/` contains cross-cutting concerns reused by multiple modules.
- `config/` should stay under `shared/` unless the configuration is module-specific.
- DTOs, controllers, services, and repositories should live inside the module they belong to.

### Target Backend Shape

```text
com.authlyn
|- AuthlynApplication
|- modules
|  |- identity
|  |  |- api
|  |  |- application
|  |  |- domain
|  |  `- infrastructure
|  `- system
|     `- api
`- shared
   |- config
   `- security
      `- jwt
```

### Current Backend Mapping

- `shared.config`
  - Spring Security and runtime configuration.
- `shared.security.jwt`
  - JWT key loading, JWKS publishing, JWT encoder/decoder support.
- `modules.identity.api`
  - Request/response contracts for identity endpoints.
- `modules.system.api`
  - Public system metadata endpoints useful for health and frontend bootstrapping.

## Frontend Structure

Frontend code lives in `frontend/` and uses React with Vite, TypeScript, and Tailwind CSS v4.

### Frontend Rules

- `app/` contains app shell composition and root-level orchestration.
- `features/` contains user-facing slices with their own components and API access.
- `shared/` contains common utilities, typed API helpers, config readers, and reusable UI primitives.
- `styles/` contains the single `global.css` entry point: Tailwind v4 import, `@theme` design tokens, `@layer base` resets, and `@layer components` patterns for complex UI classes (`.glass`, `.btn`, `.pill`, etc.).

### Target Frontend Shape

```text
frontend/src
|- app
|  |- App.tsx
|  `- router.tsx
|- features
|  |- auth
|  |  `- screens/
|  |- marketing
|  |  `- screens/
|  |- account
|  |  `- screens/
|  |- admin
|  |  `- screens/
|  `- onboarding
|     `- screens/
|- components
|  |- ui
|  |  |- Button.tsx
|  |  |- InputField.tsx
|  |  |- Icon.tsx
|  |  |- Avatar.tsx
|  |  |- StatusPill.tsx
|  |  |- Toggle.tsx
|  |  |- Segmented.tsx
|  |  |- Tabs.tsx
|  |  `- Modal.tsx
|  `- layout
|     |- AuthShell.tsx
|     |- AccountShell.tsx
|     |- AdminShell.tsx
|     |- Sidebar.tsx
|     |- AppBar.tsx
|     |- BrowserChrome.tsx
|     |- NotFound.tsx
|     |- ServerError.tsx
|     `- Maintenance.tsx
|- shared
|  |- api
|  |- config
|  `- types
`- styles
   `- global.css
```

## Runtime Boundaries

### Backend

- Runs on `http://localhost:8080` by default.
- Owns authentication, token issuance, persistence, and public key exposure.
- Exposes public endpoints under `/.well-known/*`, `/actuator/*`, and selected `/api/public/*` routes.

### Frontend

- Runs on `http://localhost:5173` in development.
- Talks only to backend HTTP endpoints.
- Never reads database or secret material directly.

### Development Integration

- Vite proxies `/api`, `/actuator`, and `/.well-known` to the backend during local development.
- Spring Security must allow CORS for the frontend dev origin.
- The frontend should consume typed JSON contracts instead of embedding endpoint logic directly in components.

## Refactor Direction

The current codebase should evolve in this order:

1. Stabilize repository layout and naming.
2. Keep JWT/security code in `shared`.
3. Move auth-facing DTOs and endpoints into `modules.identity`.
4. Add system/public endpoints for frontend bootstrapping.
5. Add service, repository, and domain layers inside modules only when the feature needs them.

## Naming Conventions

- Prefer `modules.<domain>` for feature code.
- Prefer `shared.<capability>` for reusable infrastructure.
- Prefer singular module names when describing a product capability: `identity`, `system`, `audit`.
- Keep classes explicit: `PublicMetaController`, `SignupRequest`, `RsaKeyService`.

## Near-Term Milestones

- Build signup and login APIs in `modules.identity`.
- Add persistent user/session services and repositories.
- Add frontend routes for sign in, sign up, and account management.
- Add OpenAPI or contract documentation for frontend/backend integration.
- Split generated artifacts and handwritten code clearly as the system grows.
