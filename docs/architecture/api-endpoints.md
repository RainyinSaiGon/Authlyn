# API Endpoints

This document tracks externally visible HTTP endpoints for Authlyn.

## Public Endpoints

- `GET /.well-known/jwks.json`
- `GET /actuator/health`
- `GET /actuator/info`
- `GET /actuator/prometheus`
- `GET /api/public/meta`

## Planned Identity Endpoints

- Signup, login, refresh, logout, logout-all
- Password reset and email verification
- MFA challenge and verification
- OAuth/OIDC authorization and token endpoints

## Planned Organization Endpoints

- Organizations, memberships, invites
- Roles, permissions, assignments

## Planned Platform Endpoints

- API keys
- Webhooks
- Admin APIs
- Audit/event inspection

## Status

This file should be updated task-by-task as real controllers and request/response payloads are introduced.
