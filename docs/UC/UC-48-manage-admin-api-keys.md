# [Use Case] Create and Manage API Keys (Admin / Developer)

## Actors

- Primary: Platform Admin / Developer

## Trigger

- Admin navigates to Admin > API Keys.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow — Create

1. Admin clicks "Create key".
2. Admin provides a label, selects an environment tag (production / test), and selects scopes.
3. System generates a cryptographically random key with a recognisable prefix (e.g. `ak_prod_…`).
4. System hashes the key and stores the hash; the plaintext is never stored.
5. System returns the plaintext key in a one-time reveal card with a copy button.

## Main Flow — Rotate

1. Admin selects an existing key and clicks "Rotate".
2. System generates a new key and immediately invalidates the old one.
3. New plaintext key is shown once.

## Main Flow — Revoke

1. Admin selects a key and clicks "Revoke".
2. System deletes the key hash; the key is immediately invalid.

## Alternative Flows

- **Key count quota reached:** system rejects creation and shows the plan limit.

## Postconditions

- Key created, rotated, or revoked.
- Audit log entry written (`api_key.created`, `api_key.rotated`, or `api_key.revoked`).

## Related APIs/Tasks

- APIs: `GET /api/admin/keys`, `POST /api/admin/keys`, `PATCH /api/admin/keys/:keyId/rotate`, `DELETE /api/admin/keys/:keyId`
- Tasks: [05-01](../tasks/05-01-api-keys-and-admin-auth.md)
