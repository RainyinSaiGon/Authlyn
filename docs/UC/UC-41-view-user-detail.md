# [Use Case] View User Detail

## Actors

- Primary: Platform Admin

## Trigger

- Admin clicks a user row in Admin > Users.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow

1. System renders the user detail screen: avatar, display name, status pill, user ID (monospace), and permission pills.
2. Admin views the tabbed sections:
   - **Overview:** identity fields (email, phone, created, last login) and the latest JWT preview with expiry and chain metadata.
   - **Sessions:** list of active sessions with device, location, and revoke buttons.
   - **Roles:** current role assignments across organizations.
   - **Apps:** OAuth grants held by this user.
   - **Events:** audit log scoped to this user.
3. Admin can revoke individual sessions from the Sessions tab (see UC-43).

## Alternative Flows

- **User not found:** system shows a 404 empty state.

## Postconditions

- No state change on view; session revocation triggers UC-43.

## Related APIs/Tasks

- APIs: `GET /api/admin/users/:userId`
- Tasks: [05-01](../tasks/05-01-api-keys-and-admin-auth.md)
