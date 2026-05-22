# [Task] Security Analytics and Dashboard

> **Implementation Rules**
> 1. Build analytics on top of existing audit and auth events.
> 2. Keep metrics definitions versioned and documented.
> 3. Prioritize actionable security visibility over vanity metrics.

## GitHub Issue
- Link: TBD

---

## Overview

Start Phase 11 by building security analytics pipelines and a dashboard for key authentication and threat signals.

---

## Scope

### Backend and Observability

- [ ] Add security event aggregation jobs
- [ ] Add analytics query endpoints
- [ ] Add telemetry export hooks for dashboard feeds

### Frontend

- [ ] Add security analytics dashboard UI
- [ ] Add timeline and trend visualizations for security signals

### Tests

- [ ] Analytics aggregation tests
- [ ] Dashboard data contract tests
- [ ] Telemetry export tests

---

## Completion Criteria

- [ ] Core security metrics are visible and accurate
- [ ] Dashboard views are usable for incident triage
- [ ] Analytics tests pass

---

## Related Use Cases

- [UC-39](../UC/UC-39-admin-dashboard.md) — admin views the platform overview dashboard with key security metrics
- [UC-55](../UC/UC-55-anomaly-detection.md) — the platform detects and alerts on anomalous sign-in patterns

## Related Tasks

- Prerequisite: [02-03](./02-03-rate-limits-and-audit-logs.md), [02-04](./02-04-anomaly-detection-and-security-notifications.md)
- Follow-up: [11-02](./11-02-bot-protection-breach-detection-and-alerting.md)
