# Database

This document tracks the canonical PostgreSQL schema for Authlyn.

## Current Tables

From `V1__init_authlyn_schema.sql`:

- `users`
- `organizations`
- `org_members`
- `sessions`
- `refresh_tokens`
- `identities`
- `roles`
- `permissions`
- `role_permissions`
- `org_member_roles`
- `api_keys`
- `audit_logs`
- `consents`
- `invites`
- `scim_mappings`
- `webhooks`
- `webhook_deliveries`

## Next Additions

- Verification tokens
- MFA factors and recovery codes
- OAuth authorization codes / clients / consents
- WebAuthn credentials
- Billing and quota tables

## Status

Migration files remain the source of truth. This document should summarize table intent, indexes, lifecycle rules, and important constraints whenever migrations evolve.
