# [Use Case] Delete Account

## Actors

- Primary: End User

## Trigger

- User initiates account deletion from Account > Profile.

## Preconditions

- User is authenticated.
- User is not the sole owner of any active organization.

## Main Flow

1. System displays a confirmation dialog explaining what will be deleted and the 30-day grace period.
2. User re-enters their password (or confirms with a TOTP code) to authorise the deletion.
3. System marks the account for deletion with a scheduled deletion date.
4. System immediately revokes all sessions and refresh tokens.
5. System sends a "your account is scheduled for deletion" email with a cancellation link.
6. After the 30-day grace period, system anonymises or purges all personal data per the retention policy.

## Alternative Flows

- **User is the sole org owner:** system rejects and requires the user to transfer ownership or delete the org first.
- **User cancels within the grace period:** user clicks the cancellation link in the email; account is restored to normal status.

## Postconditions

- Account scheduled for deletion.
- All sessions and tokens revoked immediately.
- Cancellation email sent.
- Audit log entry written (`user.deletion_scheduled`).

## Related APIs/Tasks

- APIs: `DELETE /api/me`
- Tasks: [06-02](../tasks/06-02-contact-change-export-deletion-and-custom-claims.md)
