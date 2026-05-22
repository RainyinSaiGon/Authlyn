# [Use Case] Grant Consent

## Actors

- Primary: End User

## Trigger

- User is presented with a consent prompt during OAuth authorization (see UC-34) or on a dedicated privacy preferences screen.

## Preconditions

- User is authenticated.

## Main Flow

1. System presents the consent items with plain-language descriptions of each purpose (e.g. "Store your email address to send account notifications").
2. User reviews the items and clicks "Accept".
3. System records a consent grant record: user ID, purpose key, version, timestamp, and IP address.

## Alternative Flows

- **User partially accepts (granular consent):** system records only the accepted purposes; the application may have reduced functionality.
- **Consent already recorded for the same version:** system is a no-op (idempotent).

## Postconditions

- Consent record persisted with an immutable timestamp.
- Audit log entry written (`consent.granted`).

## Related APIs/Tasks

- APIs: `POST /api/me/consents`
- Tasks: [07-01](../tasks/07-01-consent-and-privacy-controls.md)
