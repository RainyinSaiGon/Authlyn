# [Use Case] Reset Password

## Actors

- Primary: End User

## Trigger

- User clicks the reset link from their email and submits the Reset Password form at `/auth/reset-password`.

## Preconditions

- A valid, unexpired reset token exists for the account.

## Main Flow

1. System validates the reset token from the URL query parameter.
2. System displays the token-verified banner (token ID + expiry) and the new-password form.
3. User enters and confirms the new password.
4. System verifies the passwords match and meet the minimum strength policy.
5. System hashes the new password and updates the user record.
6. System invalidates the reset token.
7. System revokes all existing refresh tokens and terminates all active sessions.
8. System adds all current access tokens to the blocklist.
9. System sends a "password changed" security notification to the account email.
10. User is redirected to `/auth/sign-in`.

## Alternative Flows

- **Token expired or already used:** system shows an error with a "Request a new link" action.
- **Passwords do not match:** client-side form validation rejects before submission.
- **New password too weak:** system returns validation errors.

## Postconditions

- Password updated.
- All sessions terminated.
- All refresh tokens revoked.
- Audit log entry written (`user.password_reset`).

## Related APIs/Tasks

- APIs: `POST /api/public/auth/password/reset`
- Tasks: [01-05](../tasks/01-05-refresh-logout-and-password-reset.md)
