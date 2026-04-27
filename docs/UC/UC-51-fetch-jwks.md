# [Use Case] Fetch JWKS

## Actors

- Primary: External Integration Service (SDK, resource server, or identity consumer)

## Trigger

- A client application or resource server fetches the public key set to verify JWTs locally without calling the introspection endpoint on every request.

## Preconditions

- The JWKS endpoint is publicly accessible (no authentication required).

## Main Flow

1. Client sends `GET /.well-known/jwks.json`.
2. System returns the current RSA public key(s) in JWK Set format, each identified by a `kid`.
3. Client caches the response per the `Cache-Control` header (e.g. 1 hour).
4. Client uses the matching `kid` from the JWT header to select the correct key for signature verification.

## Alternative Flows

- **Key rotation in progress:** system includes both the new active key and the previous key (within the trust window) so clients can verify tokens issued before the rotation.

## Postconditions

- No state change; read-only endpoint, publicly cached.

## Related APIs/Tasks

- APIs: `GET /.well-known/jwks.json`
- Tasks: [01-01](../tasks/01-01-jwt-and-jwks-foundation.md)
