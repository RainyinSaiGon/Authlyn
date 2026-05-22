# [Use Case] Manage Roles and Permissions

## Actors

- Primary: Platform Admin

## Trigger

- Admin navigates to Admin > Roles.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow — Create Role

1. Admin clicks "Create role".
2. Admin enters the role name and selects permission groups from the available list.
3. System persists the new role.
4. The role appears in the list with a member count of zero.

## Main Flow — Edit Role

1. Admin selects a role from the left-panel list.
2. System shows the detail panel: name, member count, permission group breakdown with pill tags, and member avatar stack.
3. Admin adds or removes permission groups and saves.
4. System updates affected users' JWT claims on their next token refresh.

## Main Flow — Delete Role

1. Admin selects a role and clicks delete.
2. System warns that all members will lose this role.
3. Admin confirms.
4. System removes the role and all membership assignments.

## Alternative Flows

- **Attempting to delete a system-reserved role (e.g. `admin`, `owner`):** system rejects with an explanation.

## Postconditions

- Role created, updated, or deleted.
- Member role assignments updated if role deleted.
- Audit log entry written (`role.created`, `role.updated`, or `role.deleted`).

## Related APIs/Tasks

- APIs: `GET /api/admin/roles`, `POST /api/admin/roles`, `PATCH /api/admin/roles/:roleId`, `DELETE /api/admin/roles/:roleId`
- Tasks: [04-02](../tasks/04-02-roles-permissions-and-organization-claims.md)
