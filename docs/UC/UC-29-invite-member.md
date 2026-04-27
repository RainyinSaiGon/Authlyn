# [Use Case] Invite User to Organization

## Actors

- Primary: Organization Admin
- Secondary: Email Service

## Trigger

- Admin clicks "Invite user" in the Admin > Users screen (InviteUser modal) or in the organization members page.

## Preconditions

- Admin is authenticated with an `org_admin` or `owner` role within the target organization.
- The invitee's email is not already an active member.

## Main Flow

1. Admin enters one or more email addresses in the invite form.
2. Admin selects the default role for the invitees.
3. Admin optionally enables MFA requirement and forced password change on first login.
4. System generates a signed invitation token per email address.
5. System persists the invite records with a 7-day TTL.
6. System sends invitation emails containing the acceptance link.
7. System shows a confirmation with the count of invites sent.

## Alternative Flows

- **Invitee already a member:** system skips that address and continues with the others.
- **Email service failure:** system queues the email for retry and reports the pending state.

## Postconditions

- Invitation records created.
- Invitation emails delivered.
- Audit log entry written (`invite.sent`).

## Related APIs/Tasks

- APIs: `POST /api/orgs/:orgId/invites`, `POST /api/admin/invites`
- Tasks: [04-03](../tasks/04-03-invites-enterprise-sso-and-jit-provisioning.md)
