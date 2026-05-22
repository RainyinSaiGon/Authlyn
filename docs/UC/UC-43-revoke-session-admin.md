# [Use Case] Revoke User Session (Admin)

## Actors

- Primary: Platform Admin

## Trigger

- Admin clicks "Revoke" on a session row in Admin > Sessions.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow

1. System renders the sessions table: user avatar + anomaly badge, device, location, started timestamp, rotation count, and revoke button.
2. Admin clicks "Revoke" on one or more sessions.
3. System terminates the selected sessions and revokes the associated refresh tokens.
4. System adds the sessions' access token JTIs to the blocklist.
5. The revoked sessions disappear from the table.

## Alternative Flows

- **Session already expired:** system ignores it gracefully.

## Postconditions

- Sessions terminated.
- Tokens revoked and blocklisted.
- Audit log entry written (`session.admin_revoked`).

## Related APIs/Tasks

- APIs: `DELETE /api/admin/sessions/:sessionId`
- Tasks: [02-01](../tasks/02-01-session-metadata-and-last-seen-tracking.md), [02-02](../tasks/02-02-trusted-devices-and-session-management.md)
