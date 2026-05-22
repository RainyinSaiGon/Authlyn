# [Use Case] Refresh Access Token

## Actors

- Primary: End User (acting through a client application)

## Trigger

- Client detects that the access token has expired (or is about to expire) and requests a new one.

## Preconditions

- A valid, non-revoked refresh token is present in the client's secure storage.
- The associated session is still active.

## Main Flow

1. Client sends the refresh token to the token endpoint.
2. System validates the token: verifies the HMAC signature, checks expiry, and checks the blocklist.
3. System looks up the session associated with the token and confirms it is active.
4. System issues a new access token (15-min TTL).
5. System rotates the refresh token: issues a new one and adds the old one to the used-token store.
6. System updates the session's `last_seen` timestamp.
7. Client stores the new access and refresh tokens.

## Alternative Flows

- **Refresh token reuse detected** (previously rotated token presented): system treats this as a token theft signal. All tokens in the session family are revoked, the session is terminated, and 401 is returned.
- **Refresh token expired:** system returns 401; client redirects the user to sign-in.
- **Session revoked by admin:** system returns 401; client redirects to sign-in.

## Postconditions

- New access token issued.
- Old refresh token invalidated; new refresh token issued.
- Session `last_seen` updated.

## Related APIs/Tasks

- APIs: `POST /api/public/auth/refresh`
- Tasks: [01-05](../tasks/01-05-refresh-logout-and-password-reset.md)
