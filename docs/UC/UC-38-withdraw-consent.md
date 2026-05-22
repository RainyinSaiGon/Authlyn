# [Use Case] Withdraw Consent

## Actors

- Primary: End User

## Trigger

- User revokes a previously granted consent from Account > Privacy Preferences.

## Preconditions

- User is authenticated.
- At least one active consent grant exists.

## Main Flow

1. System lists the active consent grants with purpose descriptions and grant dates.
2. User selects a consent to withdraw.
3. System records the withdrawal in the immutable consent history (a new record with `action=withdrawn` is appended; original grant record is not modified).
4. System triggers downstream cleanup if applicable (e.g. revokes tokens scoped to the withdrawn purpose).

## Alternative Flows

- **Mandatory consent (e.g. terms of service):** system marks the item as non-revocable and displays an explanation.

## Postconditions

- Withdrawal recorded in the consent audit trail.
- Associated token scopes may be reduced.
- Audit log entry written (`consent.withdrawn`).

## Related APIs/Tasks

- APIs: `DELETE /api/me/consents/:consentId`
- Tasks: [07-01](../tasks/07-01-consent-and-privacy-controls.md)
