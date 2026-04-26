# [Task] Admin Console and Developer Screens

> **Implementation Rules**
> 1. Every admin route must be gated behind an admin role check — read the `roles` claim from the JWT and redirect to `/` if the `admin` role is absent.
> 2. All table data, chart data, and log entries are placeholder/mock values; do not fetch from the backend until the relevant backend tasks (05-xx, 11-xx) are connected.
> 3. Edge-state screens (404, 500, maintenance) must be standalone — they must render without any shell or auth dependency.

## GitHub Issue
- Link: TBD

---

## Overview

Port the 10 admin console screens from `Authlyn/screens-admin.jsx`, the 4 developer tool screens and onboarding wizard from `Authlyn/screens-dev.jsx`, 4 edge-state and empty-state screens, and 3 mobile viewport variants into the React frontend as routed TypeScript components.

---

## Scope

### Frontend

**Admin console** — `frontend/src/features/admin/screens/`

All admin screens are wrapped in `AdminShell` with the correct `active`, `crumbs`, `title`, and `actions` props.

- [x] `Overview.tsx` — 4 stat cards (Active Users, Organizations, Sign-ins 24h, MFA Coverage), sign-in trend SVG chart with time-range segmented control, recent events list; mounts at `/admin`
- [x] `Users.tsx` — search bar with keyboard shortcut badge, 3 filter buttons (Role, Status, MFA), pagination count, user table (checkbox, avatar + name + email, role pill, org, MFA method, last active, action menu); mounts at `/admin/users`
- [x] `UserDetail.tsx` — avatar + name + status pill + user ID mono, permission pills, Overview/Sessions/Roles/Apps/Events tab strip, 2-column detail grid (Identity fields, Latest JWT card with token preview and exp/chain row); mounts at `/admin/users/:id`
- [x] `InviteUser.tsx` — renders `Users` in background, foreground `Modal` with email token-input field, org and default-role selectors, MFA and password-change toggles, "Send N invites" button
- [x] `Roles.tsx` — 2-column layout: role list with member count and chevron, role detail panel (name, member count, permission group breakdown with pill tags, member avatar stack); mounts at `/admin/roles`
- [x] `Organizations.tsx` — 3-column card grid (org initial, name, slug, tier pill, member count, team count, Manage + menu buttons); mounts at `/admin/orgs`
- [x] `Applications.tsx` — table (app name + type, client ID, grant type, callback URL, status pill, action menu); mounts at `/admin/apps`
- [x] `AdminSessions.tsx` — 4 stat pills (Live, MFA 24h, Anomalies, Avg Duration), session table (checkbox, user + anomaly badge, device, location, started, rotation count, revoke button); mounts at `/admin/sessions`
- [x] `AuditLog.tsx` — event table (colored dot + event name mono, actor, target mono, IP, when); mounts at `/admin/audit`
- [x] `Settings.tsx` — 2-column layout: settings sub-nav (General, Branding, Domains, SSO, SCIM, Webhooks, Billing), main panel showing Domains section (description, domain list with status pills) and SSO/SAML section (SAML/OIDC segmented, 4 read-only fields); mounts at `/admin/settings`

**Developer tools** — `frontend/src/features/admin/screens/`

- [x] `ApiKeys.tsx` — 4 stat pills, API key table (label, prefix with mask, env pill, scopes, last used, request count, menu); mounts at `/admin/keys`
- [x] `Webhooks.tsx` — 2-column layout: endpoint list (URL, health status pill, event count, success rate), delivery detail panel (event name, delivery metadata, JSON payload code block, resend/copy buttons); mounts at `/admin/webhooks`
- [x] `Jwks.tsx` — 2-column key cards (active key: kid, algorithm, rotation progress bar; previous key: trust window countdown, public URL copy), JWKS JSON response preview panel; mounts at `/admin/jwks`
- [x] `Logs.tsx` — live log viewer: streaming status banner, fixed-column log table (timestamp, level with color, event name, message); mounts at `/admin/logs`

**Onboarding wizard** — `frontend/src/features/onboarding/`

- [x] `Onboarding.tsx` — 5-step wizard (Tenant, Branding, First app, Integrate, Invite) shown as a centered glass card: step 3 shown (app name, type, redirect URI, post-signout URL, generated client ID); mounts at `/onboarding`

**Edge and empty states** — `frontend/src/components/layout/`

- [x] `NotFound.tsx` — large "404", heading, description, "Go home" button; registered as the `*` catch-all route
- [x] `ServerError.tsx` — "500" display, SRE-paged copy, "Refresh page" + "Go back" buttons
- [x] `Maintenance.tsx` — shield icon, "Under maintenance" heading, copy, ETA stat chip; standalone route `/maintenance`
- [x] `EmptyState.tsx` — reusable component (`icon`, `title`, `body`, `action` props); lives in `frontend/src/components/ui/`

**Mobile variants** — `frontend/src/features/mobile/`

- [x] `MobileSignIn.tsx` — `PhoneFrame` wrapper around a sign-in form (logo, email + password fields, primary button, passkey ghost button)
- [x] `MobileMFA.tsx` — `PhoneFrame` wrapper around 6-box OTP input, backup code link, verify button
- [x] `MobilePasskey.tsx` — `PhoneFrame` wrapper with passkey enroll prompt, feature list, create/skip buttons

**Admin auth guard**

- [x] `RequireAdmin.tsx` — reads JWT roles claim; redirects to `/` if `admin` role is absent; all `/admin/*` routes wrapped

### Tests
- [x] Render test for each admin screen — assert the page title text renders inside `AppBar`
- [x] Render test for `NotFound`, `ServerError`, `Maintenance` — assert error code or heading is present
- [x] `RequireAdmin` test — assert redirect to `/` when the token has no `admin` role

---

## Completion Criteria

- [x] All routes under `/admin/*` render correctly when the JWT contains an `admin` role
- [x] Navigating to any `/admin/*` route without the admin role redirects to `/`
- [x] `/onboarding`, `/maintenance`, and the `*` catch-all each render their screen without errors
- [x] The `EmptyState` component renders correctly when passed minimal props
- [x] `npm run typecheck` and `npm run lint` pass clean

---

## Related Tasks

- Prerequisite: [00-04](./00-04-frontend-design-system-foundation.md), [00-05](./00-05-auth-screens.md)
- Backend integration: [05-01](./05-01-api-keys-and-admin-auth.md), [05-02](./05-02-webhooks-introspection-and-observability.md), [11-01](./11-01-security-analytics-and-dashboard.md)
