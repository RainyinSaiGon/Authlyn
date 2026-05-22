# [Use Case] Sign Out All Sessions

## Actors

- Primary: End User

## Trigger

- User clicks "Sign out all other devices" in Account > Sessions.

## Preconditions

- User is authenticated.
- At least one other active session exists.

## Main Flow

1. User clicks the "Sign out all others" danger button and confirms.
2. System revokes all refresh tokens belonging to the user except the current one.
3. System terminates all sessions for the user except the current one.
4. System adds all non-current access tokens to the blocklist.
5. System sends a "all sessions revoked" security notification.
6. The sessions list refreshes to show only the current session.

## Alternative Flows

- **No other sessions:** button is disabled or a no-op.

## Postconditions

- All non-current sessions terminated.
- All non-current refresh tokens revoked.
- Security notification sent.
- Audit log entry written (`auth.logout_all`).

## Related APIs/Tasks

- APIs: `POST /api/auth/logout/all`
- Tasks: [01-05](../tasks/01-05-refresh-logout-and-password-reset.md), [02-01](../tasks/02-01-session-metadata-and-last-seen-tracking.md)
