# [Use Case] Search and Filter Users

## Actors

- Primary: Platform Admin

## Trigger

- Admin navigates to Admin > Users.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow

1. System renders the user table: avatar + name + email, role pill, organization, MFA method, last active timestamp, and action menu.
2. Admin types a query in the search bar (searches name and email).
3. Admin optionally applies filter chips: Role, Status (active / suspended), MFA (enrolled / not enrolled).
4. System returns paginated results matching all active filters.
5. Admin pages through results or clicks a row to open the user detail (see UC-41).

## Alternative Flows

- **No results:** table shows an empty state with a "Clear filters" button.

## Postconditions

- No state change; read-only search.

## Related APIs/Tasks

- APIs: `GET /api/admin/users?q=&role=&status=&mfa=&page=`
- Tasks: [05-01](../tasks/05-01-api-keys-and-admin-auth.md)
