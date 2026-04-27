# [Use Case] Change Phone Number

## Actors

- Primary: End User
- Secondary: SMS Provider

## Trigger

- User submits a new phone number from Account > Profile.

## Preconditions

- User is authenticated.
- SMS service is configured and active.

## Main Flow

1. User enters the new phone number (E.164 format) and submits.
2. System validates the number and confirms it is not already registered.
3. System generates a 6-digit OTP and sends it via SMS to the new number.
4. User enters the OTP in the verification prompt.
5. System validates the OTP (checks value and TTL).
6. System updates the `phone` field and marks it verified.

## Alternative Flows

- **OTP expired:** user requests a resend; a new OTP is generated.
- **Phone number already registered:** system returns a conflict error.
- **SMS delivery failure:** system prompts user to retry or use a different number.

## Postconditions

- Phone number updated and marked verified.
- Audit log entry written (`user.phone_changed`).

## Related APIs/Tasks

- APIs: `POST /api/me/phone/change`, `POST /api/me/phone/verify`
- Tasks: [06-02](../tasks/06-02-contact-change-export-deletion-and-custom-claims.md)
