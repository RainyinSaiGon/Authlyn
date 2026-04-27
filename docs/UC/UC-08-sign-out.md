# [Use Case] Sign Out

## Actors

- Primary: End User

## Trigger

- User clicks "Sign out" in the UI.

## Preconditions

- User has an active session with a valid refresh token.

## Main Flow

1. Client sends the current refresh token to the logout endpoint.
2. System adds the access token's JTI to the blocklist (Redis key, TTL = remaining token lifetime).
3. System revokes the refresh token.
4. System marks the session as terminated.
5. Client clears access token, refresh token, and any cached user data from storage.
6. User is redirected to `/auth/sign-in`.

## Alternative Flows

- **Token already expired or invalid:** system returns 204 (logout is idempotent).

## Postconditions

- Session terminated.
- Access token blocklisted; refresh token revoked.
- Audit log entry written (`auth.logout`).

## Related APIs/Tasks

- APIs: `POST /api/auth/logout`
- Tasks: [01-05](../tasks/01-05-refresh-logout-and-password-reset.md)
