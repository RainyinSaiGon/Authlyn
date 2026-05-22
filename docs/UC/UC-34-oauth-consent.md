# [Use Case] Authorize Third-Party Application (OAuth Consent)

## Actors

- Primary: End User
- Secondary: OAuth Client Application

## Trigger

- A third-party application redirects the user to the Authlyn authorization endpoint with its `client_id`, `redirect_uri`, `scope`, and `state` parameters.

## Preconditions

- The OAuth client is registered and active.
- The requested scopes are valid and supported.
- The redirect URI matches one of the registered URIs for the client.

## Main Flow

1. System validates the authorization request parameters (client ID, redirect URI, response type, scope).
2. If the user is not authenticated, they are redirected to sign-in and returned to this flow afterwards.
3. System presents the consent screen: application name, logo, and list of requested permissions.
4. User clicks "Allow".
5. System records the consent grant.
6. System generates a one-time authorization code (10-min TTL, tied to client, redirect URI, and PKCE challenge if provided).
7. System redirects to the client's redirect URI with the `code` and `state` parameters.

## Alternative Flows

- **User clicks "Deny":** system redirects with `error=access_denied`.
- **Invalid client or redirect URI:** system shows an error page and does **not** redirect (to prevent open-redirect attacks).
- **User previously consented with the same scopes:** system skips the consent screen and immediately issues the code.

## Postconditions

- Authorization code persisted.
- Consent record created or updated.

## Related APIs/Tasks

- APIs: `GET /api/oauth/authorize`
- Tasks: [03-02](../tasks/03-02-oauth-authorization-server.md)
