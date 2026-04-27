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

## Related Use Cases

- [UC-24](../UC/UC-24-manage-personal-api-keys.md) — user creates and manages personal API keys
- [UC-40](../UC/UC-40-search-users.md) — admin searches and filters the user list
- [UC-41](../UC/UC-41-view-user-detail.md) — admin views detailed information for a specific user
- [UC-45](../UC/UC-45-manage-applications.md) — admin registers and manages OAuth applications
- [UC-47](../UC/UC-47-configure-platform-settings.md) — admin configures global platform settings
- [UC-48](../UC/UC-48-manage-admin-api-keys.md) — admin creates and manages platform-level API keys

## Related Tasks

- Prerequisite: [04-02](./04-02-roles-permissions-and-org-claims.md)
- Follow-up: [05-02](./05-02-webhooks-introspection-and-observability.md)
