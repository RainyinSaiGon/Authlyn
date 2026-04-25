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

- [ ] `Overview.tsx` — 4 stat cards (Active Users, Organizations, Sign-ins 24h, MFA Coverage), sign-in trend SVG chart with time-range segmented control, recent events list; mounts at `/admin`
- [ ] `Users.tsx` — search bar with keyboard shortcut badge, 3 filter buttons (Role, Status, MFA), pagination count, user table (checkbox, avatar + name + email, role pill, org, MFA method, last active, action menu); mounts at `/admin/users`
- [ ] `UserDetail.tsx` — avatar + name + status pill + user ID mono, permission pills, Overview/Sessions/Roles/Apps/Events tab strip, 2-column detail grid (Identity fields, Latest JWT card with token preview and exp/chain row); mounts at `/admin/users/:id`
- [ ] `InviteUser.tsx` — renders `Users` in background, foreground `Modal` with email token-input field, org and default-role selectors, MFA and password-change toggles, "Send N invites" button
- [ ] `Roles.tsx` — 2-column layout: role list with member count and chevron, role detail panel (name, member count, permission group breakdown with pill tags, member avatar stack); mounts at `/admin/roles`
- [ ] `Organizations.tsx` — 3-column card grid (org initial, name, slug, tier pill, member count, team count, Manage + menu buttons); mounts at `/admin/orgs`
- [ ] `Applications.tsx` — table (app name + type, client ID, grant type, callback URL, status pill, action menu); mounts at `/admin/apps`
- [ ] `AdminSessions.tsx` — 4 stat pills (Live, MFA 24h, Anomalies, Avg Duration), session table (checkbox, user + anomaly badge, device, location, started, rotation count, revoke button); mounts at `/admin/sessions`
- [ ] `AuditLog.tsx` — event table (colored dot + event name mono, actor, target mono, IP, when); mounts at `/admin/audit`
- [ ] `Settings.tsx` — 2-column layout: settings sub-nav (General, Branding, Domains, SSO, SCIM, Webhooks, Billing), main panel showing Domains section (description, domain list with status pills) and SSO/SAML section (SAML/OIDC segmented, 4 read-only fields); mounts at `/admin/settings`

**Developer tools** — `frontend/src/features/admin/screens/`

- [ ] `ApiKeys.tsx` — 4 stat pills, API key table (label, prefix with mask, env pill, scopes, last used, request count, menu); mounts at `/admin/keys`
- [ ] `Webhooks.tsx` — 2-column layout: endpoint list (URL, health status pill, event count, success rate), delivery detail panel (event name, delivery metadata, JSON payload code block, resend/copy buttons); mounts at `/admin/webhooks`
- [ ] `Jwks.tsx` — 2-column key cards (active key: kid, algorithm, rotation progress bar; previous key: trust window countdown, public URL copy), JWKS JSON response preview panel; mounts at `/admin/jwks`
- [ ] `Logs.tsx` — live log viewer: streaming status banner, fixed-column log table (timestamp, level with color, event name, message); mounts at `/admin/audit` sub-route or `/admin/logs`

**Onboarding wizard** — `frontend/src/features/onboarding/`

- [ ] `Onboarding.tsx` — 5-step wizard (Tenant, Branding, First app, Integrate, Invite) shown as a centered glass card: step indicator strip, step 3 shown (app name, type, redirect URI, post-signout URL, generated client ID); mounts at `/onboarding`

**Edge and empty states** — `frontend/src/components/layout/`

- [ ] `NotFound.tsx` — large italic "404" in brand mint, heading, description, "Back home" + "Report" buttons, trace ID mono footer; registered as the `*` catch-all route
- [ ] `ServerError.tsx` — same shell, "500" display, SRE-paged copy, "Retry" + "Status page" buttons
- [ ] `Maintenance.tsx` — shield icon in orange glow circle, "MAINTENANCE WINDOW" eyebrow, heading, copy, stat chip row (started, ETA, region); standalone route `/maintenance`
- [ ] `EmptyState.tsx` — reusable component (`icon`, `heading`, `body`, `actions` props); first usage in `Webhooks.tsx` when endpoint list is empty

**Mobile variants** — `frontend/src/features/auth/screens/mobile/`

- [ ] `MobileSignIn.tsx` — `PhoneFrame` wrapper around a sign-in form (logo, email + password fields, primary button, Face ID ghost button, "Protected by Authlyn" footer)
- [ ] `MobileMFA.tsx` — `PhoneFrame` wrapper around 6-box OTP input, backup code link, countdown, verify button
- [ ] `MobilePasskey.tsx` — `PhoneFrame` wrapper with blurred background form and bottom-sheet glass panel (passkey icon, "Sign in to Pagoda?" prompt, email mono, Cancel + Continue buttons)

**Admin auth guard**
- [ ] `RequireAdmin.tsx` — reads JWT roles claim; redirects to `/` if `admin` role is absent

### Tests
- [ ] Render test for each admin screen — assert the page title text renders inside `AppBar`
- [ ] Render test for `NotFound`, `ServerError`, `Maintenance` — assert error code or heading is present
- [ ] `RequireAdmin` test — assert redirect to `/` when the token has no `admin` role

---

## Completion Criteria

- [ ] All routes under `/admin/*` render correctly when the JWT contains an `admin` role
- [ ] Navigating to any `/admin/*` route without the admin role redirects to `/`
- [ ] `/onboarding`, `/maintenance`, and the `*` catch-all each render their screen without errors
- [ ] The `EmptyState` component renders correctly when passed minimal props
- [ ] `npm run typecheck` and `npm run lint` pass clean

---

## Related Tasks

- Prerequisite: [00-04](./00-04-frontend-design-system-foundation.md), [00-05](./00-05-auth-screens.md)
- Backend integration: [05-01](./05-01-api-keys-and-admin-auth.md), [05-02](./05-02-webhooks-introspection-and-observability.md), [11-01](./11-01-security-analytics-and-dashboard.md)
