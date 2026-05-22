# [Task] Trusted Devices and Session Management

> **Implementation Rules**
> 1. Session management APIs must operate only on the authenticated user's sessions.
> 2. Trusted device rules should stay understandable.
> 3. Avoid mixing trust decisions with anomaly decisions in the same service.

## GitHub Issue
- Link: TBD

---

## Overview

Build user-facing session management and trusted device controls.

---

## Scope

### Backend

- [ ] Add active sessions list endpoint
- [ ] Add revoke-specific-session endpoint
- [ ] Add trust-device endpoint

### Frontend

- [ ] Plan a future session management UI contract

### Tests

- [ ] Session listing tests
- [ ] Session revoke tests
- [ ] Trusted device tests

---

## Completion Criteria

- [ ] Users can list their sessions
- [ ] Users can revoke a session
- [ ] Trusted device state can be changed

---

## Related Use Cases

- [UC-17](../UC/UC-17-view-sessions.md) — user views their list of active sessions
- [UC-18](../UC/UC-18-revoke-session.md) — user revokes a specific active session
- [UC-19](../UC/UC-19-trust-device.md) — user marks a device as trusted

## Related Tasks

- Prerequisite: [02-01](./02-01-session-metadata-and-last-seen.md)
- Follow-up: [02-04](./02-04-anomaly-detection-and-security-notifications.md)
