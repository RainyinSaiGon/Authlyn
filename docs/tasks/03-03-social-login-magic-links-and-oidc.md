# [Task] Social Login, Magic Links, and OIDC

> **Implementation Rules**
> 1. Use provider adapters for social login integrations.
> 2. Keep magic link and OIDC behavior explicit in endpoint docs.
> 3. Do not mix provider-specific logic into core controllers.

## GitHub Issue
- Link: TBD

---

## Overview

Add the rest of Phase 3: social login, magic links, and OIDC discovery and userinfo support.

---

## Scope

### Backend

- [ ] Add social login provider adapters and callback handling
- [ ] Add account linking through `identities`
- [ ] Add magic link request and consume flows
- [ ] Add OIDC discovery and `userinfo` endpoints

### Tests

- [ ] Social login callback tests
- [ ] Account linking tests
- [ ] Magic link tests
- [ ] OIDC contract tests

---

## Completion Criteria

- [ ] Social login works
- [ ] Magic links work
- [ ] OIDC discovery and `userinfo` work

---

## Related Use Cases

- [UC-03](../UC/UC-03-sign-in-social.md) — user signs in via a social identity provider
- [UC-23](../UC/UC-23-link-identity.md) — user links or unlinks a social identity provider from their account
- [UC-36](../UC/UC-36-magic-link-sign-in.md) — user signs in via a magic link sent to their email

## Related Tasks

- Prerequisite: [03-02](./03-02-oauth-authorization-server.md)
- Follow-up: [04-01](./04-01-organizations-and-memberships.md)
