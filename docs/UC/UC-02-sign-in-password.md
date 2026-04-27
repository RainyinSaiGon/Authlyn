# [Use Case] Sign In with Password

## Actors

- Primary: End User

## Trigger

- User submits the sign-in form at `/auth/sign-in`.

## Preconditions

- Account exists for the provided email.
- Email address is verified.

## Main Flow

1. User provides email and password.
2. System looks up the user by email.
3. System verifies the password against the stored BCrypt hash.
4. If MFA is enrolled, system initiates an MFA challenge (see UC-11).
5. System creates a session record capturing device fingerprint, IP address, and user-agent.
6. System issues an access token (15-min TTL) and a refresh token (30-day TTL).
7. User is redirected to the post-login destination.

## Alternative Flows

- **Wrong password:** system returns 401; failed-attempt counter is incremented.
- **Rate limit exceeded:** system returns 429 after N failed attempts within the rolling window.
- **Account not found:** system returns 401 without revealing whether the email exists (prevents enumeration).
- **Email not verified:** system returns 403 and prompts the user to verify their email.
- **MFA enrolled:** flow continues at UC-11 before tokens are issued.

## Postconditions

- Session record persisted (Redis + DB).
- Refresh token persisted.
- Audit log entry written (`auth.login`).

## Related APIs/Tasks

- APIs: `POST /api/public/auth/login`
- Tasks: [01-04](../tasks/01-04-login-token-issuance-and-api-me.md), [02-01](../tasks/02-01-session-metadata-and-last-seen-tracking.md)
