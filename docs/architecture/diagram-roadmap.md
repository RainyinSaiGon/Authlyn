# Sequence Diagram & Docs Roadmap

This file lists high-value flows that should get sequence diagrams and companion docs.

## Why these are next

These flows are either security-critical, failure-prone, or involve multiple systems (DB/Redis/email/webhooks), where sequence diagrams reduce onboarding and incident time.

## Already documented (implemented now)

- JWT signing + JWKS publish/verify flow
- JWT key rotation runbook and sequence flow
- Current runtime flows (startup, public endpoints, protected endpoint auth)

See:

- [`jwt-jwks-flow.md`](./jwt-jwks-flow.md)
- [`current-implemented-flows.md`](./current-implemented-flows.md)

## Priority 1 (do next)

1. **Signup + email verification flow**
   - API request validation
   - user create transaction
   - verification token generation
   - email send + callback verification

2. **Login + token issuance flow**
   - credential verification
   - session creation
   - access + refresh token issuance
   - Redis/session updates

3. **Refresh token rotation flow**
   - refresh token validation
   - one-time token rotation
   - reuse-detection behavior
   - revoke session on misuse

4. **Logout / logout-all-devices flow**
   - single-session revoke path
   - global revoke path
   - Redis/DB invalidation model

## Priority 2

- **Rate limiting flow (Redis token bucket)**
- **Password reset flow (request + consume token)**
- **Actuator/public endpoint exposure model**
- **Flyway startup migration flow**

## Priority 3 (from roadmap/Specs)

- **Organization invite acceptance flow**
- **RBAC permission evaluation flow**
- **Webhook delivery + retry/backoff flow**
- **Audit log write path and retention flow**
- **MFA challenge/verify flow**
- **OIDC metadata + JWKS discovery flow**

## Suggested doc template

For consistency, each flow doc should include:

- Purpose and boundary
- Actors/services
- Preconditions
- Sequence diagram (happy path + failure path)
- Data written (DB/Redis/events)
- Security notes
- Observability notes (logs/metrics/alerts)
- Rollback/recovery notes
