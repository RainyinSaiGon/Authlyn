# [Use Case] Complete MFA Challenge

## Actors

- Primary: End User

## Trigger

- System presents the MFA challenge screen during sign-in after the password step succeeds.

## Preconditions

- User passed the password verification step.
- User has an active MFA factor enrolled.

## Main Flow

1. System redirects the user to `/auth/mfa` and presents the MFA challenge screen.
2. User opens their authenticator app and reads the current 6-digit code.
3. User enters the code into the 6-box OTP input.
4. System validates the code against the stored TOTP secret (allows ±1 time-step drift).
5. System marks the MFA step as satisfied.
6. System creates a session record and issues access and refresh tokens.
7. User is redirected to the post-login destination.

## Alternative Flows

- **Invalid code:** system rejects and increments the attempt counter; user may retry.
- **Too many failed attempts:** system locks the sign-in attempt for a cool-down period and returns to sign-in.
- **User selects "Use a backup code":** flow continues at UC-12.

## Postconditions

- MFA step satisfied.
- Session and tokens issued.
- Audit log entry written (`auth.mfa_verified`).

## Related APIs/Tasks

- APIs: `POST /api/public/auth/mfa/challenge`
- Tasks: [03-01](../tasks/03-01-totp-mfa-and-recovery-codes.md)
