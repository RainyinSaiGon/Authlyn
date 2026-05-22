# [Use Case] Configure Platform Settings

## Actors

- Primary: Platform Admin

## Trigger

- Admin navigates to Admin > Settings.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow

1. System renders the settings layout: sub-nav on the left (General, Branding, Domains, SSO, SCIM, Webhooks, Billing) and the selected section's form on the right.
2. Admin selects a section and modifies settings (e.g. adds a custom domain, uploads a logo, enables SCIM).
3. System validates the input (e.g. DNS verification for domains, logo file-size limits).
4. Admin saves; system persists the changes.

## Alternative Flows

- **Domain verification required:** system instructs the admin to add a TXT record to DNS and waits for confirmation.
- **Validation error:** system highlights the offending field with an inline error.

## Postconditions

- Platform settings updated.
- Audit log entry written (`settings.updated`).

## Related APIs/Tasks

- APIs: `GET /api/admin/settings`, `PATCH /api/admin/settings`
- Tasks: [05-01](../tasks/05-01-api-keys-and-admin-auth.md)
