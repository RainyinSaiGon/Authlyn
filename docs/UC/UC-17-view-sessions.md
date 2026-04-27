# [Use Case] View Active Sessions

## Actors

- Primary: End User

## Trigger

- User navigates to Account > Sessions.

## Preconditions

- User is authenticated.

## Main Flow

1. System returns all active sessions for the authenticated user.
2. Each session row shows: device type icon, browser and OS, location, IP address, last refreshed timestamp, and rotation count.
3. The current session is visually highlighted.
4. Any session with an anomaly flag shows a warning badge.
5. User reviews the list.

## Alternative Flows

- **No other sessions:** list shows only the current session with no revoke actions for others.

## Postconditions

- No state change; read-only operation.

## Related APIs/Tasks

- APIs: `GET /api/auth/sessions`
- Tasks: [02-01](../tasks/02-01-session-metadata-and-last-seen-tracking.md)
