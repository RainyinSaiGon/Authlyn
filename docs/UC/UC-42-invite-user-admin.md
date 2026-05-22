# [Use Case] Invite User (Admin)

## Actors

- Primary: Platform Admin
- Secondary: Email Service

## Trigger

- Admin clicks "Invite user" in Admin > Users, opening the InviteUser modal.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow

1. Admin enters one or more email addresses in the token-input field.
2. Admin selects a target organization and a default role.
3. Admin optionally enables MFA requirement and forced password change on first login.
4. Admin clicks "Send N invites".
5. System generates a signed invitation token per address (see UC-29 for the acceptance flow).
6. System sends invitation emails.
7. Modal closes; the user table shows the new pending invitations.

## Alternative Flows

- **Address already a member:** system skips that address and processes the rest.

## Postconditions

- Invitation records created.
- Invitation emails sent.
- Audit log entry written (`invite.sent`).

## Related APIs/Tasks

- APIs: `POST /api/admin/invites`
- Tasks: [04-03](../tasks/04-03-invites-enterprise-sso-and-jit-provisioning.md)
