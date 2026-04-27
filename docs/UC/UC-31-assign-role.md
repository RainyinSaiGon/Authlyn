# [Use Case] Assign Role to Organization Member

## Actors

- Primary: Organization Admin

## Trigger

- Admin selects a new role for a member in the organization member list.

## Preconditions

- Admin is authenticated with `org_admin` or `owner` role.
- The target user is a current member of the organization.

## Main Flow

1. Admin navigates to the member entry in the member list.
2. Admin selects a new role from the role picker.
3. System validates that the admin has the authority to grant that role (cannot grant higher than own role).
4. System updates the membership record with the new role.
5. The member's JWT will include the updated role claims on their next token refresh.

## Alternative Flows

- **Downgrading the last owner:** system rejects and requires the admin to promote another member to Owner first.
- **Role not found:** system returns 404.

## Postconditions

- Membership role updated.
- JWT role claims reflect the change on next refresh.
- Audit log entry written (`member.role_changed`).

## Related APIs/Tasks

- APIs: `PATCH /api/orgs/:orgId/members/:userId/role`
- Tasks: [04-02](../tasks/04-02-roles-permissions-and-organization-claims.md)
