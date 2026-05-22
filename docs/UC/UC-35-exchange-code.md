# [Use Case] Exchange Authorization Code

## Actors

- Primary: External Integration Service (OAuth Client backend)

## Trigger

- Client backend receives an authorization code from the redirect and calls the token endpoint.

## Preconditions

- A valid authorization code was issued (see UC-34) within the last 10 minutes.
- Client authenticates with its `client_id` and `client_secret` (confidential clients) or provides the PKCE `code_verifier` (public clients).

## Main Flow

1. Client sends `POST /api/oauth/token` with `grant_type=authorization_code`, the code, redirect URI, and client credentials.
2. System validates the client credentials.
3. System looks up the authorization code and verifies it has not been used and has not expired.
4. System validates the redirect URI matches the one used in the authorization request.
5. System validates the PKCE `code_verifier` against the stored `code_challenge` (if applicable).
6. System marks the authorization code as consumed.
7. System issues an access token scoped to the approved permissions and a refresh token.

## Alternative Flows

- **Code already used:** system returns `error=invalid_grant` and revokes all tokens issued with this code (token-reuse attack mitigation).
- **PKCE verification fails:** system returns `error=invalid_grant`.
- **Client credentials invalid:** system returns 401.

## Postconditions

- Access token and refresh token issued.
- Authorization code invalidated.

## Related APIs/Tasks

- APIs: `POST /api/oauth/token`
- Tasks: [03-02](../tasks/03-02-oauth-authorization-server.md)
