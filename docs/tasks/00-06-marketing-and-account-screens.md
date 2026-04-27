# [Task] Marketing and Account Screens

> **Implementation Rules**
> 1. Marketing screens are fully static — no API calls, no auth dependency; they can ship independently of backend tasks.
> 2. Account screens require an authenticated user context; gate each route with an auth guard that redirects to `/auth/sign-in` when no JWT is present.
> 3. All data shown in account screens is placeholder/mock until the relevant backend tasks (06-xx) are connected.

## GitHub Issue

- Link: TBD

---

## Overview

Port the 3 public marketing pages from `design/screens-marketing.jsx` and the 5 end-user account tabs from `design/screens-account.jsx` into the React frontend as routed TypeScript components.

---

## Scope

### Frontend

**Marketing pages** — `frontend/src/features/marketing/screens/`

- [ ] `Landing.tsx` — topnav (logo, links, CTA button), hero section (eyebrow, large headline, lead paragraph, CTA buttons, trusted-by bar), 3-column feature grid (Sign in, RBAC, Sessions), JWKS highlight section with code block, footer; mounts at `/`
- [ ] `Pricing.tsx` — topnav, hero (heading, lead, monthly/yearly segmented toggle), 3-column tier cards (Build · Free, Team · per-MAU, Scale · custom) each with feature list and CTA; mounts at `/pricing`
- [ ] `Docs.tsx` — topnav with search button, 3-column layout: left sidebar nav (4 groups: Get started, Auth, Orgs & RBAC, API reference), main content area showing the Quickstart page (3 code blocks), right table-of-contents sidebar with a tip card; mounts at `/docs`

**Account pages** — `frontend/src/features/account/screens/`

All account screens are wrapped in `AccountShell` with the correct `active` prop. Mock all displayed data with the same placeholder values from the design files.

- [ ] `Profile.tsx` — page header with avatar and user ID, avatar upload + display name / pronouns / email / phone / timezone / language fields in a 2-column grid, linked identities list (Google, GitHub, Slack) with link/unlink actions; mounts at `/account/profile`
- [ ] `Security.tsx` — 4 credential cards in a 2-column grid (Password, Two-step, Passkeys, Backup codes) each with status pill and action button, recent security events table (event, device/browser, when, IP); mounts at `/account/security`
- [ ] `Sessions.tsx` — page header with count and "Sign out all others" danger button, session list (device icon, browser/OS, location, IP, last refreshed, revoke button), refresh-token chain detail card (chain ID, issued, next rotate, rotation count); mounts at `/account/sessions`
- [ ] `ConnectedApps.tsx` — heading, table of connected applications (app name with client ID sub-label, scopes, connected date, revoke button); mounts at `/account/apps`
- [ ] `ApiKeys.tsx` — heading with key count, API key table (label, prefix, scopes, last used, created, menu icon), one-time reveal card showing a full key with copy button and "Done"; mounts at `/account/keys`

**Auth guard**
- [ ] `RequireAuth.tsx` — wrapper component that reads the JWT from storage (localStorage key `authlyn.token`); redirects to `/auth/sign-in` if absent; renders `children` otherwise

### Tests

- [ ] Render test for each of the 3 marketing screens — assert the primary heading and at least one landmark element render
- [ ] Render test for each of the 5 account screens behind a mocked auth context — assert the section heading renders
- [ ] `RequireAuth` test — assert redirect to `/auth/sign-in` when no token is present

---

## Completion Criteria

- [ ] `/`, `/pricing`, and `/docs` all render without errors and match the design layout
- [ ] `/account/profile`, `/account/security`, `/account/sessions`, `/account/apps`, and `/account/keys` render correctly when a token is present in `localStorage`
- [ ] Navigating to any `/account/*` route without a token redirects to `/auth/sign-in`
- [ ] `npm run typecheck` and `npm run lint` pass clean

---

## Related Tasks

- Prerequisite: [00-04](./00-04-frontend-design-system-foundation.md)
- Backend integration: [06-01](./06-01-profiles-and-self-service.md), [06-02](./06-02-contact-change-export-deletion-and-custom-claims.md)
- Follow-up: [00-07](./00-07-admin-and-developer-screens.md)
