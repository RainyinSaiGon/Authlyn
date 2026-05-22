# [Use Case] Sign In with Magic Link

## Actors

- Primary: End User
- Secondary: Email Service

## Trigger

- User requests a magic link on the sign-in screen by entering their email and clicking "Send magic link".

## Preconditions

- A user account exists for the given email address.

## Main Flow

1. User enters their email and requests a magic link.
2. System generates a one-time sign-in token (cryptographically random, 15-min TTL).
3. System sends the magic link to the email address.
4. System returns a generic confirmation message (no enumeration).
5. User opens their email and clicks the magic link.
6. System validates the token: checks signature, TTL, and that it has not been used.
7. System marks the token as consumed.
8. System creates a session record and issues access and refresh tokens.
9. User is redirected to the post-login destination.

## Alternative Flows

- **Link expired:** user is prompted to request a new magic link.
- **Email not registered:** system returns the same generic confirmation message.
- **Link already used:** system shows an "already used" message and offers a new request.

## Postconditions

- Session and tokens issued.
- Magic link token consumed.
- Audit log entry written (`auth.magic_link_login`).

## Related APIs/Tasks

- APIs: `POST /api/public/auth/magic-link`, `GET /api/public/auth/magic-link/:token`
- Tasks: [03-03](../tasks/03-03-social-login-magic-links-and-oidc.md)
