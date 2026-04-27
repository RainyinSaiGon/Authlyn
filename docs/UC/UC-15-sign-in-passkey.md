# [Use Case] Sign In with Passkey

## Actors

- Primary: End User
- Secondary: WebAuthn Authenticator

## Trigger

- User clicks "Sign in with a passkey" on the sign-in screen at `/auth/sign-in`.

## Preconditions

- User has at least one registered passkey credential.
- The user's device and browser support WebAuthn.

## Main Flow

1. System issues a WebAuthn authentication challenge (`PublicKeyCredentialRequestOptions`).
2. Browser presents the passkey selector to the user and invokes the platform authenticator.
3. User completes biometric verification or PIN.
4. Browser returns the signed assertion (`AuthenticatorAssertionResponse`).
5. System looks up the credential by credential ID, verifies the signature against the stored public key, and validates the origin and challenge.
6. System verifies the sign counter is greater than the stored value (clone detection).
7. System updates the stored sign counter.
8. System creates a session record and issues access and refresh tokens.
9. User is redirected to the post-login destination.

## Alternative Flows

- **No passkey registered:** system falls back to the password sign-in flow.
- **Sign counter regression detected (possible clone):** system rejects the sign-in, logs a `security.passkey_clone_detected` anomaly event, and alerts the user.
- **Assertion verification fails:** system returns 401.

## Postconditions

- Session and tokens issued.
- Sign counter updated.
- Audit log entry written (`auth.passkey_login`).

## Related APIs/Tasks

- APIs: `POST /api/public/auth/webauthn/authenticate/challenge`, `POST /api/public/auth/webauthn/authenticate/verify`
- Tasks: [08-01](../tasks/08-01-webauthn-and-passkeys.md)
