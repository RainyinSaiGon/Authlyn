# Interfaces

This document is the contract source for service, repository, controller, and client-facing interface signatures.

## 1. Shared Contracts

- JWT signing and verification interfaces
- Password hashing and token generation abstractions
- Email delivery abstraction
- Redis/session abstraction

## 2. Identity Module

- Signup, login, refresh, logout, reset-password service interfaces
- User, session, refresh-token repository interfaces

## 3. Federation Module

- OAuth client adapters
- OIDC and SAML metadata/provider abstractions

## 4. Organization Module

- Organization, membership, role, permission service interfaces

## 5. Platform Module

- API key, webhook, audit-log, admin API interfaces

## 6. Frontend Client Contracts

- Auth client methods
- Session bootstrap payloads
- Self-service portal API contracts

## Status

This file is intentionally a scaffold. Each implementation task must add or refine the relevant signatures before code is merged.
