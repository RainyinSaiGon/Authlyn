# [Use Case] Accept Organization Invitation

## Actors

- Primary: End User (invited person)

## Trigger

- User clicks the invitation link received via email.

## Preconditions

- The invitation token is valid and has not expired.

## Main Flow

1. System validates the invitation token (signature and TTL).
2. If the user does not have an account, they are directed to sign up; the invitation context is preserved.
3. If the user already has an account, they sign in (if not already authenticated).
4. System creates a membership record linking the user to the organization with the assigned role.
5. System marks the invitation as accepted.
6. User is redirected to the organization or admin dashboard.

## Alternative Flows

- **Invitation expired:** system shows an error and advises the user to ask for a new invite.
- **User already a member:** system redirects to the organization dashboard without re-adding.
- **Sign-up during acceptance:** system completes sign-up then picks up the invite acceptance step automatically.

## Postconditions

- User added as a member of the organization.
- Role assigned.
- Invitation marked as accepted.
- Audit log entry written (`invite.accepted`).

## Related APIs/Tasks

- APIs: `POST /api/public/invites/:token/accept`
- Tasks: [04-03](../tasks/04-03-invites-enterprise-sso-and-jit-provisioning.md)
