# [Task] Anomaly Detection and Security Notifications

> **Implementation Rules**
> 1. Start with deterministic anomaly rules.
> 2. Notifications should be driven by explicit security events.
> 3. Keep anomaly handling separate from basic rate limiting.

## GitHub Issue
- Link: TBD

---

## Overview

Detect suspicious sign-in behavior and notify users or operators when needed.

---

## Scope

### Backend

- [ ] Add suspicious IP and device detection rules
- [ ] Add security notification service integration
- [ ] Add audit hooks for anomaly outcomes

### Tests

- [ ] Anomaly rule tests
- [ ] Notification triggering tests

---

## Completion Criteria

- [ ] Suspicious access patterns can be detected
- [ ] Notifications are triggered for the configured cases
- [ ] Anomaly tests pass

---

## Related Tasks

- Prerequisite: [02-02](./02-02-trusted-devices-and-session-management.md), [02-03](./02-03-rate-limits-and-audit-logs.md)
- Follow-up: [11-01](./11-01-security-analytics-and-dashboard.md)
