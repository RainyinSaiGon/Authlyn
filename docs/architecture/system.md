# System

This document is the high-level system view for Authlyn.

## Components

### Running (Local Development)

| Component | Default Location | Role |
| --- | --- | --- |
| Backend API | `http://localhost:8080` | Auth, token issuance, persistence, public key exposure |
| Frontend (dev) | `http://localhost:5173` | User-facing UI; proxies `/api`, `/actuator`, `/.well-known` to backend |
| PostgreSQL | Neon (cloud) or `localhost:5432` | Primary data store (users, sessions, organizations) |
| Redis | `localhost:6379` (Docker) | Rate-limit counters and future session cache |

### Planned (Future Phases)

| Component | Role |
| --- | --- |
| Email provider | Transactional email for verification, reset links, magic links |
| OAuth/social IdPs | Social login (Google, GitHub, etc.) via OIDC |
| SCIM target | Outbound user provisioning to enterprise directories |
| Billing/payment provider | Tenant subscription management |
| Monitoring stack | Metrics, alerting, distributed tracing |

## Runtime Trust Boundaries

```text
              ┌──────────────────────────────────────┐
              │  Browser / Mobile Client             │
              └──────────────┬───────────────────────┘
                             │ HTTPS
              ┌──────────────▼───────────────────────┐
              │  Frontend (React/Vite)               │
              │  localhost:5173 in dev               │
              └──────────────┬───────────────────────┘
                             │ HTTP (proxied in dev)
              ┌──────────────▼───────────────────────┐
              │  Backend (Spring Boot)               │
              │  localhost:8080                      │
              │  /api/*         (auth, identity)     │
              │  /actuator/*    (ops)                │
              │  /.well-known/* (JWKS)               │
              └──────────┬────────────────┬──────────┘
                         │                │
         ┌───────────────▼───┐   ┌────────▼────────┐
         │  PostgreSQL        │   │  Redis          │
         │  (Neon / local)   │   │  (Docker)       │
         └───────────────────┘   └─────────────────┘
```

## Network Assumptions

- Frontend and backend run on the same host in local development; the Vite proxy eliminates CORS issues during development.
- Spring Security is configured to allow CORS from the Vite dev origin (`AUTHLYN_ALLOWED_ORIGINS`).
- In production, the frontend is served from a static CDN and the backend is the sole token issuer.

## Non-Functional Requirements (Targets)

| Attribute | Target |
| --- | --- |
| API response time (p95) | < 200 ms for auth endpoints |
| Token validation | < 5 ms (local RSA verify, no network call) |
| Database pool size | 10 connections (configurable via `AUTHLYN_DB_POOL_SIZE`) |
| Availability | Best-effort in early phases; HA targets defined at Phase 12 |

## See Also

- [Layers](./layers.md) — backend package structure and frontend feature slices
- [API Endpoints](./api-endpoints.md) — full endpoint catalogue
- [Auth](./auth.md) — token and session architecture
- [Deployment Mode](./deployment-mode.md) — single-tenant vs. multi-tenant tradeoffs
