# [Use Case] Complete Tenant Onboarding

## Actors

- Primary: Platform Admin (new tenant owner)

## Trigger

- Admin is redirected to `/onboarding` after first-time platform setup or initial sign-in.

## Preconditions

- Admin is authenticated.
- Onboarding has not been marked as completed.

## Main Flow

1. **Step 1 — Tenant:** Admin provides the tenant name and primary domain.
2. **Step 2 — Branding:** Admin uploads a logo and sets the primary brand colour.
3. **Step 3 — First App:** Admin provides the app name, selects the application type (Web / SPA / Native / M2M), enters the redirect URI and post-signout URL. System generates and displays the client ID.
4. **Step 4 — Integrate:** System displays SDK installation and initialisation code snippets for the selected app type.
5. **Step 5 — Invite:** Admin enters team member email addresses to invite.
6. Admin clicks "Finish setup".
7. System marks onboarding as complete.
8. Admin is redirected to `/admin`.

## Alternative Flows

- **Admin skips a step:** system allows skipping non-mandatory steps and uses sensible defaults.
- **Admin returns to a previous step:** wizard preserves previously entered values.

## Postconditions

- Tenant configured (name, domain, branding).
- First OAuth application registered with a generated client ID.
- Team invitations sent (if any emails were entered).
- Onboarding marked complete.

## Related APIs/Tasks

- APIs: `POST /api/admin/onboarding/complete`
- Tasks: [12-01](../tasks/12-01-tenant-onboarding-and-quotas.md)
