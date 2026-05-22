# [Use Case] Remove Passkey

## Actors

- Primary: End User

## Trigger

- User clicks the remove icon next to a passkey in Account > Security.

## Preconditions

- User is authenticated.
- The passkey to remove is registered on the account.
- At least one other authentication method remains active (password or another passkey).

## Main Flow

1. User clicks the remove icon next to the target passkey.
2. System presents a confirmation dialog showing the passkey's friendly name.
3. User confirms the removal.
4. System deletes the credential record from the database.

## Alternative Flows

- **Last authentication method:** system rejects the removal with an explanation that at least one sign-in method must remain.

## Postconditions

- WebAuthn credential record deleted.
- Audit log entry written (`passkey.removed`).

## Related APIs/Tasks

- APIs: `DELETE /api/auth/webauthn/credentials/:credentialId`
- Tasks: [08-01](../tasks/08-01-webauthn-and-passkeys.md)
