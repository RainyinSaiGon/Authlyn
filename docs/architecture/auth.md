# Auth

This document tracks Authlyn authentication architecture at a high level.

## Scope

- Credential-based authentication
- Token issuance and validation
- Session and refresh lifecycle
- MFA and passkeys integration points

## Current Baseline

- JWT + JWKS foundation exists in task plan.
- Session and refresh flows are defined in phased tasks.

## Open Decisions

- Token claims baseline per endpoint group
- Session invalidation strategy across devices
- Step-up authentication triggers

## TODO

- Add sequence diagrams for signup/login/refresh/logout
- Add trust boundaries and threat assumptions
- Link concrete implementation classes once available
