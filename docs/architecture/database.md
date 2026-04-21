# Database

This document defines the canonical PostgreSQL schema contract for Authlyn and the intended ownership of each table.

Migration SQL files remain the implementation source of truth. This document describes intent, module boundaries, and invariants that implementation tasks must preserve.

## 0. Baseline and Conventions

- Current baseline migration: `src/main/resources/db/migration/V1__init_authlyn_schema.sql`
- Target database: PostgreSQL 18+
- Primary key strategy: `UUID` with `gen_random_uuid()`
- Timestamp strategy: `TIMESTAMPTZ` in UTC
- Soft-delete pattern (where used): `deleted_at`
- Security pattern for secrets/tokens: store hashes/fingerprints, never raw secret material

## 1. Current Tables and Intended Ownership

| Table | Owning module | Primary purpose | Primary writers |
| --- | --- | --- | --- |
| `users` | `modules.identity` | Core account profile and auth identity root | signup/profile/identity services |
| `sessions` | `modules.identity` | User login sessions and device context | login/refresh/logout services |
| `refresh_tokens` | `modules.identity` | One-time refresh rotation chain | login/refresh/logout services |
| `identities` | `modules.federation` (with identity integration) | External provider links (social/enterprise) | federation identity-link service |
| `organizations` | `modules.organization` | Tenant/org root entity | organization service |
| `org_members` | `modules.organization` | User membership in organizations | membership/invite acceptance flows |
| `roles` | `modules.organization` | Org-scoped role definitions | role service |
| `permissions` | `modules.organization` (shared catalog) | Permission key registry | role/permission bootstrapping/admin |
| `role_permissions` | `modules.organization` | Many-to-many role-permission mapping | role service |
| `org_member_roles` | `modules.organization` | Many-to-many member-role assignments | membership/role assignment service |
| `invites` | `modules.organization` | Invite lifecycle for org access | invite service |
| `scim_mappings` | `modules.organization` / `modules.federation` | SCIM external group-to-role mapping | SCIM sync services |
| `api_keys` | `modules.platform` | Programmatic access credentials | API key service |
| `audit_logs` | `modules.platform` (shared sink) | Security/audit event record | audit publisher + module event writers |
| `consents` | `modules.platform` / identity | User consent tracking | consent/privacy services |
| `webhooks` | `modules.platform` | Webhook endpoint configuration | webhook management service |
| `webhook_deliveries` | `modules.platform` | Delivery attempt records and retry state | webhook delivery worker |

## 2. Key Referential Constraints

From the baseline migration:

- `org_members.org_id -> organizations.id` (`ON DELETE CASCADE`)
- `org_members.user_id -> users.id` (`ON DELETE CASCADE`)
- `sessions.user_id -> users.id` (`ON DELETE CASCADE`)
- `sessions.org_id -> organizations.id` (`ON DELETE SET NULL`)
- `refresh_tokens.user_id -> users.id` (`ON DELETE CASCADE`)
- `refresh_tokens.session_id -> sessions.id` (`ON DELETE CASCADE`)
- `identities.user_id -> users.id` (`ON DELETE CASCADE`)
- `roles.org_id -> organizations.id` (`ON DELETE CASCADE`)
- `role_permissions.role_id -> roles.id` (`ON DELETE CASCADE`)
- `role_permissions.permission_id -> permissions.id` (`ON DELETE CASCADE`)
- `org_member_roles.org_member_id -> org_members.id` (`ON DELETE CASCADE`)
- `org_member_roles.role_id -> roles.id` (`ON DELETE CASCADE`)
- `api_keys.org_id -> organizations.id` (`ON DELETE CASCADE`)
- `api_keys.user_id -> users.id` (`ON DELETE SET NULL`)
- `audit_logs.org_id -> organizations.id` (`ON DELETE SET NULL`)
- `audit_logs.actor_user_id -> users.id` (`ON DELETE SET NULL`)
- `audit_logs.target_user_id -> users.id` (`ON DELETE SET NULL`)
- `consents.user_id -> users.id` (`ON DELETE CASCADE`)
- `consents.org_id -> organizations.id` (`ON DELETE CASCADE`)
- `invites.org_id -> organizations.id` (`ON DELETE CASCADE`)
- `invites.invited_by -> users.id` (`ON DELETE SET NULL`)
- `scim_mappings.org_id -> organizations.id` (`ON DELETE CASCADE`)
- `scim_mappings.role_id -> roles.id` (`ON DELETE CASCADE`)
- `webhooks.org_id -> organizations.id` (`ON DELETE CASCADE`)
- `webhook_deliveries.webhook_id -> webhooks.id` (`ON DELETE CASCADE`)

## 3. Uniqueness and Identity Guarantees

- `users`: unique case-insensitive email (`uq_users_email_ci` on `lower(email)`)
- `organizations`: unique `slug`
- `org_members`: unique membership pair (`org_id`, `user_id`)
- `refresh_tokens`: unique `token_hash`
- `identities`: unique provider identity (`provider`, `provider_user_id`)
- `roles`: unique org role key (`org_id`, `key`)
- `permissions`: unique `key`
- `role_permissions`: composite PK (`role_id`, `permission_id`)
- `org_member_roles`: composite PK (`org_member_id`, `role_id`)
- `api_keys`: unique `key_hash`
- `invites`: unique `token_hash`
- `scim_mappings`: unique mapping (`org_id`, `external_group_id`)

## 4. Index Coverage and Intended Query Paths

### 4.1 Identity-critical indexes

- `idx_sessions_user_id`, `idx_sessions_org_id`, `idx_sessions_last_seen_at`
- `idx_refresh_tokens_user_id`, `idx_refresh_tokens_session_id`, `idx_refresh_tokens_expires_at`
- `uq_users_email_ci`

Expected hot reads:

- user lookup by normalized email
- active sessions by user
- refresh validation by token hash and expiry

### 4.2 Organization and policy indexes

- `idx_org_members_user_id`
- `idx_roles_org_id`
- `idx_invites_org_id`
- `idx_invites_email_ci`

Expected hot reads:

- organizations/memberships by user
- role catalog by org
- invite lookup by email and org

### 4.3 Platform indexes

- `idx_api_keys_org_id`
- `idx_audit_logs_org_id`, `idx_audit_logs_event_type`, `idx_audit_logs_created_at`
- `idx_webhook_deliveries_webhook_id`, `idx_webhook_deliveries_status`

Expected hot reads:

- API key listing by org
- audit filtering by org/event/time range
- webhook retry queue by status

## 5. Lifecycle and State Alignment

### 5.1 Sessions and refresh tokens

- Session lifecycle details are defined in `docs/architecture/state-machine.md`.
- Refresh token lifecycle and reuse detection rules are defined in `docs/architecture/state-machine.md`.
- `refresh_tokens.replaced_by_token_id`, `revoked_at`, and `reuse_detected` support rotation chain and abuse detection.

### 5.2 Revocation and expiration semantics

- Revocation fields (`revoked_at`, optional reason) indicate explicit invalidation.
- Expiry fields (`expires_at`) indicate time-based invalidation.
- Access decisions should treat revoked or expired rows as non-active.

### 5.3 Soft delete usage

- `users` and `organizations` include `deleted_at` for soft-delete workflows.
- Related data cleanup is currently driven by FK delete behavior and future policy tasks.

## 6. Security and Privacy Notes

- `password_hash`, `token_hash`, `key_hash`, and `secret_hash` are hashed artifacts; raw values must not be persisted.
- `metadata_private` in `users` is sensitive domain data and should not be returned by public API contracts.
- `audit_logs.details` should avoid storing raw secrets or credentials.

## 7. Next Additions (Planned)

- Verification tokens (email/phone verification flow hardening)
- MFA factors and recovery codes
- OAuth authorization codes, clients, and consent enhancements
- WebAuthn credential registries
- Billing, quotas, and usage tracking tables

Each addition must define ownership, constraints, and indexes in this document when migrations are introduced.

## 8. Status

The database baseline now documents current tables, intended ownership, key constraints, and lifecycle expectations for task `00-01`.
