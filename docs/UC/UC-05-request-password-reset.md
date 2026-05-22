# [Use Case] Request Password Reset

## Actors

- Primary: End User
- Secondary: Email Service

## Trigger

- User submits the Forgot Password form at `/auth/forgot-password`.

## Preconditions

- None required from the system's perspective (the response is the same whether or not the email is registered, to prevent enumeration).

## Main Flow

1. User enters their email address and submits.
2. System looks up the account by email.
3. If an account exists, system generates a signed, time-limited reset token (HMAC, 1-hour TTL).
4. System persists the token hash against the account.
5. System sends a password-reset link to the email.
6. System returns a generic success message regardless of whether the email was found.

## Alternative Flows

- **Email not registered:** system returns the same generic success message (no enumeration).
- **Rate limit:** system silently drops repeat requests from the same IP within a cool-down window.

## Postconditions

- Reset token stored and associated with the user account (if the email was found).
- Reset email delivered.

## Related APIs/Tasks

- APIs: `POST /api/public/auth/password/forgot`
- Tasks: [01-05](../tasks/01-05-refresh-logout-and-password-reset.md)
