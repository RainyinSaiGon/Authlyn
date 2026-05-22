# [Use Case] Manage Personal API Keys

## Actors

- Primary: End User (Developer)

## Trigger

- User navigates to Account > API Keys.

## Preconditions

- User is authenticated.

## Main Flow — Create

1. User clicks "Create key", provides a label, and selects scopes.
2. System generates a cryptographically random key with a recognisable prefix.
3. System hashes the key and stores the hash; the plaintext is never stored.
4. System returns the plaintext key in a one-time reveal card.
5. User copies the key; it is not shown again.

## Main Flow — Revoke

1. User selects a key from the table and clicks the action menu > Revoke.
2. System deletes the key hash from the store.
3. The key is immediately invalid for any API call.

## Alternative Flows

- **Key count quota reached:** system rejects creation and displays the plan limit.

## Postconditions

- Key created (plaintext shown once) or revoked.
- Audit log entry written (`api_key.created` or `api_key.revoked`).

## Related APIs/Tasks

- APIs: `GET /api/me/api-keys`, `POST /api/me/api-keys`, `DELETE /api/me/api-keys/:keyId`
- Tasks: [05-01](../tasks/05-01-api-keys-and-admin-auth.md)
