# [Task] API Keys and Admin Authentication

> **Implementation Rules**
> 1. Never store raw API key secrets after creation.
> 2. Keep admin authentication separate from end-user authentication.
> 3. Document scope and rotation behavior clearly.

## GitHub Issue
- Link: TBD

---

## Overview

Implement API key lifecycle and the authentication model for privileged admin APIs.

---

## Scope

### Backend

- [ ] Add API key persistence and hashing
- [ ] Add create, rotate, revoke, and list APIs
- [ ] Add privileged admin authentication model

### Tests

- [ ] API key hashing tests
- [ ] Rotation tests
- [ ] Admin auth tests

---

## Completion Criteria

- [ ] API keys can be created, rotated, and revoked
- [ ] Admin authentication model works
- [ ] API key tests pass

---

## Related Tasks

- Prerequisite: [04-02](./04-02-roles-permissions-and-org-claims.md)
- Follow-up: [05-02](./05-02-webhooks-introspection-and-observability.md)
