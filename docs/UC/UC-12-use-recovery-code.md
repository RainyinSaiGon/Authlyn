# [Use Case] Use Recovery Code

## Actors

- Primary: End User

## Trigger

- User selects "Use a backup code" during the MFA challenge step.

## Preconditions

- User is at the MFA challenge step.
- At least one unused recovery code exists on the account.

## Main Flow

1. User selects "Use a backup code" on the MFA challenge screen.
2. System presents a recovery code input.
3. User enters one of their saved recovery codes.
4. System looks up the code hash and verifies it has not been used.
5. System marks the recovery code as consumed (one-time use).
6. System proceeds with session creation and issues access and refresh tokens.
7. User is redirected to the post-login destination.

## Alternative Flows

- **Invalid code:** system rejects and asks the user to try a different code.
- **Already-used code:** system rejects with a specific message.
- **Last remaining code consumed:** system sends a "generate new recovery codes" notification and prompts the user after sign-in.
- **No codes remaining:** system informs the user and directs them to account recovery.

## Postconditions

- Recovery code marked as consumed.
- Session and tokens issued.
- Audit log entry written (`auth.recovery_code_used`).

## Related APIs/Tasks

- APIs: `POST /api/public/auth/mfa/recovery`
- Tasks: [03-01](../tasks/03-01-totp-mfa-and-recovery-codes.md)
