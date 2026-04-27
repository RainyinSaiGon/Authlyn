# [Use Case] Enroll Passkey

## Actors

- Primary: End User
- Secondary: WebAuthn Authenticator (device platform or hardware security key)

## Trigger

- User clicks "Create a passkey" on the Passkeys card in Account > Security, or is prompted by the post-sign-up enroll screen at `/auth/passkey-enroll`.

## Preconditions

- User is authenticated.
- The user's device and browser support the WebAuthn API.

## Main Flow

1. System generates a WebAuthn registration challenge (`PublicKeyCredentialCreationOptions`) and returns it to the client.
2. Browser invokes the platform authenticator (Face ID, Touch ID, Windows Hello, or hardware key).
3. User completes the biometric verification or PIN step.
4. Browser returns the attestation response (`AuthenticatorAttestationResponse`).
5. System verifies the attestation: validates the origin, challenge, and attestation statement.
6. System persists the credential record: credential ID, public key (COSE), AAGUID, sign counter, and friendly name.
7. System confirms enrollment success to the user.

## Alternative Flows

- **User cancels the platform authenticator prompt:** enrollment is aborted; no credential is stored.
- **Credential ID already registered:** system rejects the duplicate and instructs the user to remove the existing one first.
- **Attestation verification fails:** system rejects the credential and logs the failure.

## Postconditions

- WebAuthn credential persisted on the account.
- Audit log entry written (`passkey.enrolled`).

## Related APIs/Tasks

- APIs: `POST /api/auth/webauthn/register/challenge`, `POST /api/auth/webauthn/register/verify`
- Tasks: [08-01](../tasks/08-01-webauthn-and-passkeys.md)
