# Authlyn Architecture

## Overview

Authlyn should be developed as a full-stack monorepo with a Spring Boot backend and a React frontend.

The current repository state is intentionally reset to a lightweight backend scaffold so the system can be rebuilt feature-by-feature from the task documents.

## Architectural Goals

- Keep backend code domain-oriented instead of organizing everything by technical layer.
- Keep frontend code feature-oriented so UI, API calls, and state evolve together.
- Separate cross-cutting infrastructure from product modules.
- Make local development simple with one backend, one database, and one Redis instance.
- Keep public API contracts explicit so the frontend does not couple to backend internals.

## Repository Layout

```text
Authlyn/
|- ARCHITECTURE.md
|- Specs.md
|- docs/
|  |- architecture/
|  `- tasks/
|- src/
|  |- main/
|  |  |- java/com/authlyn/
|  |  |  |- modules/
|  |  |  |- shared/
|  |  |  `- AuthlynApplication.java
|  |  `- resources/
|  `- test/
|     `- java/com/authlyn/
|- frontend/              # to be rebuilt from tasks
|- docker-compose.yml
`- gradle/
```

## Backend Structure

Backend code should live under `src/main/java/com/authlyn`.

### Rules

- `modules/` contains product domains and business-facing APIs.
- `shared/` contains reusable cross-cutting infrastructure.
- Controllers, DTOs, services, repositories, and domain models should live inside their owning module.
- Configuration belongs in `shared` unless it is truly module-specific.

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
|  |- organization
|  |- platform
|  `- system
`- shared
   |- config
   |- security
   |- persistence
   `- messaging
```

## Frontend Structure

The frontend should live in `frontend/` and use React with a feature-oriented structure.

### Target Frontend Shape

```text
frontend/src
|- app
|- features
|- shared
`- styles
```

## Runtime Boundaries

### Backend

- Runs on `http://localhost:8080` by default.
- Owns authentication, token issuance, persistence, and public key exposure.
- Publishes public endpoints such as `/.well-known/*` and selected `/api/public/*` routes.

### Frontend

- Runs separately in development.
- Talks only to backend HTTP endpoints.
- Must not read database or secret material directly.

## Refactor Direction

Rebuild the system in this order:

1. Lock design contracts and shared infrastructure rules.
2. Implement the identity module end-to-end.
3. Add session, security, and recovery flows.
4. Add organizations, RBAC, and enterprise capabilities.
5. Rebuild the frontend on top of explicit backend contracts.

## Naming Conventions

- Prefer `modules.<domain>` for product code.
- Prefer `shared.<capability>` for reusable infrastructure.
- Use explicit class names such as `AuthController`, `RefreshTokenService`, and `PublicMetaController`.

## Build Strategy

- Rebuild from the task documents under `docs/tasks/`.
- Update architecture docs whenever interfaces, endpoints, database schema, or lifecycle rules change.
- Keep each implementation slice small enough to test end-to-end.
