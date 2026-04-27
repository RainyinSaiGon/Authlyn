# [Use Case] Enroll TOTP MFA

## Actors

- Primary: End User

## Trigger

- User clicks "Set up" on the Two-step authentication card in Account > Security.

## Preconditions

- User is authenticated.
- No active TOTP factor exists on the account.

## Main Flow

1. System generates a TOTP secret (RFC 6238) and encodes a QR code in the response.
2. System presents the QR code and the raw secret (for manual entry).
3. User scans the QR code with an authenticator app (e.g. Google Authenticator, Authy).
4. User enters the 6-digit code shown in the app to confirm the secret is correct.
5. System verifies the code against the secret (allows ±1 time-step drift).
6. System stores the TOTP secret encrypted at rest and marks the factor as active.
7. System generates 8 one-time recovery codes and presents them in a one-time modal.
8. User saves the recovery codes.

## Alternative Flows

- **Invalid TOTP code during confirmation:** system rejects and asks the user to try again.
- **User closes the modal without saving codes:** system warns but allows proceeding; codes can be regenerated later.

## Postconditions

- TOTP factor active on the account.
- Recovery codes stored (hashed, one-time use).
- Audit log entry written (`mfa.totp_enrolled`).

## Related APIs/Tasks

- APIs: `POST /api/auth/mfa/totp/enroll`, `POST /api/auth/mfa/totp/confirm`
- Tasks: [03-01](../tasks/03-01-totp-mfa-and-recovery-codes.md)
