# [Use Case] Change Email Address

## Actors

- Primary: End User
- Secondary: Email Service

## Trigger

- User submits a new email address from the email field in Account > Profile.

## Preconditions

- User is authenticated.
- The new email address is not already associated with another account.

## Main Flow

1. User enters the desired new email address and submits.
2. System validates the new address format and confirms it is not in use.
3. System sets the account state to "email change pending".
4. System sends a verification email to the **new** address containing a signed, time-limited token.
5. User clicks the verification link in the new email.
6. System validates the token and updates the `email` field on the account.
7. System marks the new email as verified.
8. System sends a "your email was changed" security notification to the **old** address.

## Alternative Flows

- **New email already registered:** system returns a conflict error; no email is sent.
- **Verification link expires:** user can request a resend from the email-change pending screen.

## Postconditions

- Email updated and verified.
- Old email notified.
- Audit log entry written (`user.email_changed`).

## Related APIs/Tasks

- APIs: `POST /api/me/email/change`, `POST /api/public/auth/verify-email`
- Tasks: [06-02](../tasks/06-02-contact-change-export-deletion-and-custom-claims.md)
