# [Use Case] Sign Up

## Actors

- Primary: End User
- Secondary: Email Service

## Trigger

- User navigates to `/auth/sign-up` and submits the registration form.

## Preconditions

- No account exists for the provided email address.

## Main Flow

1. User provides display name, email address, and password.
2. System validates inputs (email format, password meets minimum strength).
3. System creates a new user record with a BCrypt-hashed password.
4. System generates a signed email-verification token and sends the verification email.
5. System creates a session record with device fingerprint, IP, and user-agent.
6. System issues an access token (15-min TTL) and a refresh token (30-day TTL).
7. User is redirected to the email verification screen (`/auth/verify-email`).

## Alternative Flows

- **Email already registered:** system returns 409; user is prompted to sign in or reset their password.
- **Weak password:** system rejects and returns per-rule strength feedback before form submission.
- **Social sign-up:** user clicks a provider button and the flow continues at UC-03.

## Postconditions

- User account created with `email_verified = false`.
- Verification email delivered.
- Session and refresh token persisted.
- Audit log entry written (`user.created`).

## Related APIs/Tasks

- APIs: `POST /api/public/auth/signup`
- Tasks: [01-03](../tasks/01-03-signup-endpoint.md)
