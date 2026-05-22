# [Use Case] Trust a Device

## Actors

- Primary: End User

## Trigger

- User checks "Remember this device" during sign-in, or toggles trust from the session detail in Account > Sessions.

## Preconditions

- User is authenticated.
- Device fingerprint has been captured from the sign-in request.

## Main Flow

1. User enables the trust flag (either during sign-in or retrospectively).
2. System associates a trust record with the device fingerprint, scoped to the user account.
3. On subsequent sign-ins from the same device, the system skips the MFA challenge for the trust duration.
4. The session entry in Account > Sessions shows the device as trusted.

## Alternative Flows

- **Device fingerprint indeterminate (VPN or unusual browser):** system does not apply trust and continues requiring MFA.

## Postconditions

- Trust record persisted with expiry.
- MFA step may be skipped on future sign-ins from this device within the trust window.

## Related APIs/Tasks

- APIs: `POST /api/auth/sessions/:sessionId/trust`
- Tasks: [02-02](../tasks/02-02-trusted-devices-and-session-management.md)
