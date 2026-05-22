# [Use Case] Provision User via SCIM

## Actors

- Primary: External Integration Service (SCIM Client / Enterprise IdP)

## Trigger

- Enterprise IdP calls the SCIM Users endpoint as part of automated directory provisioning.

## Preconditions

- SCIM 2.0 provisioning is enabled for the organization.
- The SCIM client holds a valid bearer token with the `scim` scope.

## Main Flow — Create (POST)

1. SCIM client sends `POST /scim/v2/Users` with attributes: `userName`, `emails`, `name`, `groups`.
2. System validates the payload against the SCIM User schema.
3. System creates a user account and sets `active = true`.
4. System assigns the user to the organization and maps any group memberships to roles.
5. System returns the created resource with a SCIM `id` and `meta.location`.

## Main Flow — Update (PATCH)

1. SCIM client sends `PATCH /scim/v2/Users/:id` with patch operations.
2. System applies the `add`, `replace`, or `remove` operations to the stored attributes.

## Main Flow — Deprovision (PATCH or DELETE)

1. SCIM client sends `PATCH` with `{ "active": false }` or `DELETE /scim/v2/Users/:id`.
2. System revokes all active sessions and refresh tokens for the user.
3. System marks the user as inactive (soft-delete; data is retained).

## Alternative Flows

- **Duplicate `externalId`:** system returns the existing resource (idempotent create).
- **Invalid payload:** system returns 400 with SCIM error detail.
- **User not found for update/delete:** system returns 404.

## Postconditions

- User provisioned, updated, or deprovisioned.
- Audit log entry written (`scim.user_provisioned`, `scim.user_updated`, or `scim.user_deprovisioned`).

## Related APIs/Tasks

- APIs: `POST /scim/v2/Users`, `PATCH /scim/v2/Users/:id`, `DELETE /scim/v2/Users/:id`
- Tasks: [09-01](../tasks/09-01-scim-provisioning.md)
