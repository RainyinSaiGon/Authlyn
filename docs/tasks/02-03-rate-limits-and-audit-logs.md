# [Task] Rate Limits and Audit Logs

> **Implementation Rules**
> 1. Use Redis for rate-limiting state.
> 2. Security events must have stable names.
> 3. Audit logging should be append-only.

## GitHub Issue
- Link: TBD

---

## Overview

Apply rate limits to sensitive auth flows and start recording security events in audit logs.

---

## Scope

### Backend

- [ ] Add Redis-backed rate limiting to auth endpoints
- [ ] Add audit log write hooks for auth events
- [ ] Add internal or external read access for audit records

### Tests

- [ ] Rate-limit tests
- [ ] Audit-log persistence tests

---

## Completion Criteria

- [ ] Major auth endpoints are rate limited
- [ ] Auth security events are written to `audit_logs`
- [ ] Rate-limit and audit tests pass

---

## Related Use Cases

- [UC-46](../UC/UC-46-view-audit-log.md) — admin views the platform-wide audit log of security events

## Related Tasks

- Prerequisite: [01-05](./01-05-refresh-logout-and-password-reset.md)
- Follow-up: [02-04](./02-04-anomaly-detection-and-security-notifications.md), [05-02](./05-02-webhooks-introspection-and-observability.md)
