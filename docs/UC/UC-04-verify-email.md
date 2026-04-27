# [Use Case] Verify Email Address

## Actors

- Primary: End User
- Secondary: Email Service

## Trigger

- User clicks the verification link delivered to their email after sign-up or an email-change request.

## Preconditions

- User account exists.
- A valid, unexpired email-verification token is stored for the account.

## Main Flow

1. System extracts the verification token from the URL.
2. System validates the token signature and checks it has not expired.
3. System marks the user's email as verified (`email_verified = true`).
4. System invalidates the verification token so it cannot be reused.
5. User is redirected to the sign-in screen (or to the dashboard if already authenticated).

## Alternative Flows

- **Token expired:** system shows an error page with a "Resend verification email" button.
- **Token already used:** system shows a "Your email is already verified" message and redirects to sign-in.
- **Account not found:** system shows a generic error.

## Postconditions

- `email_verified = true` on the user record.
- Verification token invalidated.
- Audit log entry written (`user.email_verified`).

## Related APIs/Tasks

- APIs: `POST /api/public/auth/verify-email`
- Tasks: [01-03](../tasks/01-03-signup-endpoint.md), [06-02](../tasks/06-02-contact-change-export-deletion-and-custom-claims.md)
