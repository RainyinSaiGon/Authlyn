# [Use Case] Remove MFA Factor

## Actors

- Primary: End User

## Trigger

- User clicks "Remove" on the Two-step authentication card in Account > Security.

## Preconditions

- User is authenticated.
- An active TOTP factor exists on the account.

## Main Flow

1. User clicks "Remove" on the Two-step authentication card.
2. System requires the user to enter a current TOTP code to confirm the removal.
3. User enters the TOTP code.
4. System validates the code.
5. System disables the TOTP factor and deletes the stored secret.
6. System invalidates all recovery codes associated with the factor.
7. System sends a "MFA disabled" security notification to the account email.

## Alternative Flows

- **Incorrect TOTP code:** system rejects the removal request and asks to try again.
- **Platform MFA policy enforced:** if the org or platform requires MFA, system rejects removal with an explanation.

## Postconditions

- TOTP factor removed.
- Recovery codes invalidated.
- Security notification sent.
- Audit log entry written (`mfa.totp_removed`).

## Related APIs/Tasks

- APIs: `DELETE /api/auth/mfa/totp`
- Tasks: [03-01](../tasks/03-01-totp-mfa-and-recovery-codes.md)
