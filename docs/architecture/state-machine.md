# State Machine

This document defines lifecycle states and transitions for entities that require strict state handling.

For task `00-01`, sessions and refresh tokens are specified in detail as implementation contracts.

## 0. Shared Rules

- Transitions must be explicit and auditable.
- Invalid transitions should fail with a domain error and produce an audit event.
- Time-based transitions (for expiry) may be materialized lazily (on access) or by background jobs.

---

## 1. Session Lifecycle (Detailed Baseline)

## 1.1 States

- `ACTIVE`: session is valid and can issue refresh rotations.
- `REVOKED`: session was explicitly terminated (logout/admin/security action).
- `EXPIRED`: session reached TTL.

## 1.2 Trigger Events

- `LOGIN_SUCCESS`
- `LOGOUT_CURRENT`
- `LOGOUT_ALL`
- `ADMIN_REVOKE`
- `SECURITY_REVOKE`
- `SESSION_TTL_ELAPSED`

## 1.3 Transition Table

| Current State | Event | Next State | Notes |
| --- | --- | --- | --- |
| (none) | `LOGIN_SUCCESS` | `ACTIVE` | create new session |
| `ACTIVE` | `LOGOUT_CURRENT` | `REVOKED` | user-requested revoke |
| `ACTIVE` | `LOGOUT_ALL` | `REVOKED` | applied to all active sessions for user |
| `ACTIVE` | `ADMIN_REVOKE` | `REVOKED` | admin initiated |
| `ACTIVE` | `SECURITY_REVOKE` | `REVOKED` | anomaly/risk response |
| `ACTIVE` | `SESSION_TTL_ELAPSED` | `EXPIRED` | time-based transition |
| `REVOKED` | any revoke event | `REVOKED` | idempotent no-op |
| `EXPIRED` | any event except cleanup | `EXPIRED` | terminal for auth usage |

## 1.4 Guards and Invariants

- Only `ACTIVE` sessions may participate in refresh rotation.
- `REVOKED` and `EXPIRED` sessions cannot be restored.
- Session revocation must cascade to active refresh tokens in that session.
- Protected access tokens should carry the session id claim, and session revocation should be mirrored into the Redis session-state cache so bearer-token checks fail immediately.
- `last_seen_at` can only move forward (monotonic update).

## 1.5 Persistence Expectations

- Persist state as enum/string and include `revoked_at`, `expires_at`, `revoke_reason` when relevant.
- Record actor context for revoke operations (self/admin/system).

---

## 2. Refresh Token Lifecycle (Detailed Baseline)

## 2.1 States

- `ACTIVE`: token can be used once for rotation.
- `ROTATED`: token was successfully consumed; successor token issued.
- `REVOKED`: token was explicitly invalidated before use.
- `REUSED`: previously rotated token was presented again (security signal).
- `EXPIRED`: token reached TTL.

## 2.2 Trigger Events

- `ISSUED`
- `REFRESH_SUCCESS`
- `LOGOUT_REVOKE`
- `SESSION_REVOKE`
- `TOKEN_TTL_ELAPSED`
- `REUSE_DETECTED`

## 2.3 Transition Table

| Current State | Event | Next State | Notes |
| --- | --- | --- | --- |
| (none) | `ISSUED` | `ACTIVE` | created during login/signup/rotation |
| `ACTIVE` | `REFRESH_SUCCESS` | `ROTATED` | successor refresh token created atomically |
| `ACTIVE` | `LOGOUT_REVOKE` | `REVOKED` | user/admin/session revoke |
| `ACTIVE` | `SESSION_REVOKE` | `REVOKED` | inherited from session state transition |
| `ACTIVE` | `TOKEN_TTL_ELAPSED` | `EXPIRED` | time-based |
| `ROTATED` | `REUSE_DETECTED` | `REUSED` | high-signal compromise indicator |
| `REVOKED` | any revoke event | `REVOKED` | idempotent no-op |
| `EXPIRED` | any auth event | `EXPIRED` | terminal for auth usage |

## 2.4 Guards and Security Invariants

- Refresh tokens are one-time use.
- Rotation must be atomic: mark old token consumed and create successor in one transaction.
- `REUSE_DETECTED` should trigger a security response policy (at minimum revoke current session; optional global revoke).
- Stored token values must be hashed/fingerprinted; raw token must not be persisted.

## 2.5 Rotation Contract (Pseudo-Flow)

1. Receive presented refresh token.
2. Hash/fingerprint and lookup token record.
3. Validate state is `ACTIVE` and token/session not expired/revoked.
4. Transition old token to `ROTATED`.
5. Create successor token in `ACTIVE`.
6. Return new access + refresh tokens.
7. On second presentation of old token, mark as `REUSED` and trigger security response.

---

## 3. Additional State Machines (Planned)

## 3. Password Reset Token Lifecycle (Detailed Baseline)

## 3.1 States

- `ACTIVE`: reset token can be consumed once.
- `USED`: reset token was successfully consumed.
- `REVOKED`: reset token was invalidated before use or superseded by a newer request.
- `EXPIRED`: reset token reached TTL.

## 3.2 Trigger Events

- `ISSUED`
- `RESET_SUCCESS`
- `RESET_REISSUED`
- `TOKEN_TTL_ELAPSED`

## 3.3 Transition Table

| Current State | Event | Next State | Notes |
| --- | --- | --- | --- |
| (none) | `ISSUED` | `ACTIVE` | created during password reset request |
| `ACTIVE` | `RESET_SUCCESS` | `USED` | one-time consumption |
| `ACTIVE` | `RESET_REISSUED` | `REVOKED` | superseded by a newer reset request |
| `ACTIVE` | `TOKEN_TTL_ELAPSED` | `EXPIRED` | time-based |
| `USED` | any auth event | `USED` | terminal |
| `REVOKED` | any auth event | `REVOKED` | terminal |
| `EXPIRED` | any auth event | `EXPIRED` | terminal |

## 3.4 Guards and Security Invariants

- Password reset tokens are one-time use.
- Issuing a new password reset request should invalidate older active tokens for the same user.
- Successful password reset should revoke the user’s active sessions and refresh tokens.
- Stored reset tokens must be hashed/fingerprinted; raw token must only exist in the delivery channel.

---

## 4. Identity (OAuth2 Provider Link) Lifecycle

## 4.1 States

- `LINKED`: identity record exists; provider authentication can find the local user.
- `UNLINKED`: identity row deleted; provider login will create a new user or fail to find the previous one.

## 4.2 Trigger Events

- `OAUTH2_LOGIN_SUCCESS` — provider authenticated the user; find-or-create runs in `OAuth2LoginSuccessHandler`.
- `IDENTITY_UNLINKED` — user removes a social login connection (not yet implemented).

## 4.3 Transition Table

| Current State | Event | Next State | Notes |
| --- | --- | --- | --- |
| (none) | `OAUTH2_LOGIN_SUCCESS` | `LINKED` | `IdentityEntity` created with `(provider, providerUserId)` unique key |
| `LINKED` | `OAUTH2_LOGIN_SUCCESS` | `LINKED` | Idempotent — existing record returned, no change |
| `LINKED` | `IDENTITY_UNLINKED` | `UNLINKED` | Row deleted; planned feature |

## 4.4 Guards and Invariants

- `(provider, providerUserId)` must be unique — enforced by DB constraint.
- Provider email is stored for reference but not used as the primary lookup key (providers may change their user's email).
- OAuth2 identity row links to a local `UserEntity`; the user record's `email` is the canonical identity key.

---

## 5. Additional State Machines (Planned)

- Invites: `PENDING -> ACCEPTED | EXPIRED | REVOKED`
- Webhook deliveries: `PENDING -> RETRYING -> DELIVERED | FAILED -> DEAD_LETTERED`
- MFA enrollment: `PENDING -> ACTIVE -> DISABLED`

Detailed contracts for these are expected in their corresponding implementation tasks.

---

## 6. Status

- Sessions, refresh tokens, password reset tokens: fully implemented. State machines match code in `RefreshService`, `LogoutService`, `PasswordResetService`.
- OAuth2 identity: `LINKED` state implemented in `OAuth2LoginSuccessHandler`; `UNLINKED` transition is planned.
- Update this file whenever enums, transition guards, or security responses change.
