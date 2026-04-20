# State Machine

This document captures lifecycle transitions for Authlyn entities.

## Candidate State Machines

- Sessions: active, revoked, expired
- Refresh tokens: active, rotated, revoked, reused
- Invites: pending, accepted, expired, revoked
- Webhook deliveries: pending, retrying, delivered, failed, dead-lettered
- MFA enrollment: pending, active, disabled

## Status

Update this file whenever enums or lifecycle rules are introduced or changed.
