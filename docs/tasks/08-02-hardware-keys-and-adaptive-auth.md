# [Task] Hardware Keys and Adaptive Authentication

> **Implementation Rules**
> 1. Treat adaptive authentication decisions as policy-driven.
> 2. Keep hardware key support compatible with existing MFA flows.
> 3. Require explainable risk scoring inputs.

## GitHub Issue
- Link: TBD

---

## Overview

Complete Phase 8 by adding hardware security key support and adaptive, risk-based step-up authentication.

---

## Scope

### Backend

- [ ] Add hardware key enrollment and lifecycle support
- [ ] Add adaptive risk policy evaluation engine
- [ ] Add step-up authentication triggers for risky events

### Frontend

- [ ] Add hardware key management UI
- [ ] Add adaptive step-up challenge UX

### Tests

- [ ] Hardware key flow tests
- [ ] Adaptive risk policy tests
- [ ] Step-up decision tests

---

## Completion Criteria

- [ ] Hardware security keys work for supported flows
- [ ] Risk policies trigger step-up checks correctly
- [ ] Adaptive auth tests pass

---

## Related Tasks

- Prerequisite: [08-01](./08-01-webauthn-and-passkeys.md), [02-04](./02-04-anomaly-detection-and-security-notifications.md)
- Follow-up: [11-02](./11-02-bot-protection-breach-detection-and-alerting.md)
