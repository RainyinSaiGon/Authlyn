# [Task] Session Metadata and Last-Seen Tracking

> **Implementation Rules**
> 1. Treat sessions as first-class entities.
> 2. Keep request metadata extraction explicit and explainable.
> 3. Update session lifecycle docs when behavior changes.

## GitHub Issue
- Link: TBD

---

## Overview

Add request-derived session metadata and last-seen tracking to the auth system.

---

## Scope

### Backend

- [ ] Add session persistence layer
- [ ] Capture device, IP, and user-agent metadata
- [ ] Update last-seen timestamp on authenticated requests

### Tests

- [ ] Session persistence tests
- [ ] Last-seen update tests

---

## Completion Criteria

- [ ] Session metadata is stored
- [ ] Last-seen timestamps update correctly
- [ ] Session tests pass

---

## Related Use Cases

- [UC-02](../UC/UC-02-sign-in-password.md) — user signs in with email and password
- [UC-17](../UC/UC-17-view-sessions.md) — user views their list of active sessions

## Related Tasks

- Prerequisite: [01-04](./01-04-login-token-issuance-and-api-me.md)
- Follow-up: [02-02](./02-02-trusted-devices-and-session-management.md)
