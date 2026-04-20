# Layers

Authlyn uses a domain-oriented backend and feature-oriented frontend.

## Backend Layers

- `modules.<domain>.api`
  - Controllers and request/response DTOs
- `modules.<domain>.application`
  - Business workflows and orchestration
- `modules.<domain>.domain`
  - Core domain models and rules
- `modules.<domain>.infrastructure`
  - Persistence, external providers, and adapters
- `shared.*`
  - Cross-cutting infrastructure reused across domains

## Frontend Layers

- `app`
  - App shell, providers, route composition
- `features`
  - Feature slices with page/component/API logic together
- `shared`
  - Reusable API helpers, config, types, UI primitives
- `styles`
  - Global tokens and layout foundations

## Rule

Controllers should stay thin, application services should own workflows, and infrastructure code should not leak directly into presentation layers.
