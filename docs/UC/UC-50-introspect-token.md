# [Use Case] Introspect Token

## Actors

- Primary: External Integration Service (Resource Server)

## Trigger

- A resource server receives a bearer token in an incoming request and needs to validate it without verifying the JWT signature locally.

## Preconditions

- The token was issued by this Authlyn instance.
- The resource server has valid client credentials registered with Authlyn.

## Main Flow

1. Resource server sends `POST /api/oauth/introspect` with the token and its client credentials.
2. System authenticates the calling client.
3. System validates the token: verifies the RSA signature using the current JWKS, checks the expiry, and checks the token blocklist in Redis.
4. System returns the token metadata: `active`, `sub`, `exp`, `iat`, `scope`, `client_id`, `roles`.

## Alternative Flows

- **Token expired:** system returns `{ "active": false }`.
- **Token blocklisted (revoked):** system returns `{ "active": false }`.
- **Invalid client credentials:** system returns 401.
- **Malformed token:** system returns `{ "active": false }`.

## Postconditions

- No state change; read-only.

## Related APIs/Tasks

- APIs: `POST /api/oauth/introspect`
- Tasks: [05-02](../tasks/05-02-webhooks-introspection-and-observability.md)
