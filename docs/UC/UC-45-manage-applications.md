# [Use Case] Manage Applications (Admin)

## Actors

- Primary: Platform Admin

## Trigger

- Admin navigates to Admin > Apps.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow — Create Application

1. Admin clicks "Create app".
2. Admin provides: app name, type (web / native / M2M / SPA), grant types, and redirect URIs.
3. System generates a `client_id` (always) and a `client_secret` (for confidential clients).
4. System returns the `client_secret` in a one-time reveal — it is not stored in plaintext.

## Main Flow — Edit / Deactivate

1. Admin selects an application from the table.
2. Admin edits fields (name, redirect URIs, grant types, status).
3. System persists the changes.

## Main Flow — Rotate Client Secret

1. Admin selects an app and clicks "Rotate secret".
2. System generates a new secret, returns it once, and immediately invalidates the old one.

## Alternative Flows

- **Invalid redirect URI format:** system rejects with a validation error.

## Postconditions

- Application created, updated, or deactivated.
- Client secret shown once on creation or rotation.
- Audit log entry written (`app.created`, `app.updated`, or `app.secret_rotated`).

## Related APIs/Tasks

- APIs: `GET /api/admin/apps`, `POST /api/admin/apps`, `PATCH /api/admin/apps/:clientId`, `POST /api/admin/apps/:clientId/secret/rotate`
- Tasks: [05-01](../tasks/05-01-api-keys-and-admin-auth.md)
