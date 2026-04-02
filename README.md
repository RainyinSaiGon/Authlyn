# Authlyn (AuthEngine scaffold)

Production-grade IAM platform scaffold based on your `Specs.md`.

## What is initialized

- Spring Boot `4.0.5` + Java `25` project with Gradle (`build.gradle`) build definition
- Redis local infrastructure via Docker Compose (`docker-compose.yml`)
ye- Neon PostgreSQL as the required development database
- Flyway baseline schema for core IAM entities
- Security baseline with OAuth2 Resource Server wiring
- Environment template in `.env.example`

## Included baseline tables

`users`, `sessions`, `refresh_tokens`, `identities`, `organizations`, `org_members`, `roles`, `permissions`, `role_permissions`, `org_member_roles`, `api_keys`, `audit_logs`, `consents`, `invites`, `scim_mappings`, `webhooks`, `webhook_deliveries`

## Quick start

1. Copy `.env.example` to `.env`
2. Fill in required Neon credentials in `.env` (`AUTHLYN_DB_URL`, `AUTHLYN_DB_USERNAME`, `AUTHLYN_DB_PASSWORD`)
3. Start local Redis:
   - `docker compose up -d`
4. Build and run the Spring Boot app with Gradle (`.\\gradlew.bat bootRun`)
5. Confirm health endpoint is up at `/actuator/health`

## Next suggested implementation steps

1. Add RSA key management + JWKS endpoint
2. Implement signup/login/logout + refresh rotation/reuse detection
3. Add session service + Redis-backed rate limiting
4. Add immutable audit event pipeline
5. Add MFA and OIDC provider metadata endpoints

## Notes

- This is an initialization scaffold, not full Phase 1-12 implementation.
- `.env` stays local and is gitignored; commit only `.env.example`.
