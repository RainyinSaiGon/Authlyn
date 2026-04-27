# [Use Case] Revoke a Session

## Actors

- Primary: End User

## Trigger

- User clicks "Revoke" on a specific session row in Account > Sessions.

## Preconditions

- User is authenticated.
- The target session is active and belongs to the user.

## Main Flow

1. User clicks "Revoke" on the session row.
2. System terminates the session and revokes the associated refresh token.
3. System adds the session's access token JTI to the blocklist.
4. The revoked session disappears from the list.

## Alternative Flows

- **Revoking the current session:** system treats this as a full sign-out and redirects to `/auth/sign-in` (see UC-08).

## Postconditions

- Session terminated.
- Refresh token revoked; access token blocklisted.
- Audit log entry written (`session.revoked`).

## Related APIs/Tasks

- APIs: `DELETE /api/auth/sessions/:sessionId`
- Tasks: [02-02](../tasks/02-02-trusted-devices-and-session-management.md)
