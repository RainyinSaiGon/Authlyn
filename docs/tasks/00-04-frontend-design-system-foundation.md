# [Task] Frontend Design System Foundation

> **Implementation Rules**
> 1. Port the design system from `Authlyn/` faithfully — do not invent new tokens, components, or layout patterns that are not already in the design files.
> 2. Every primitive component must be typed with TypeScript; no `any`, no inline-style objects passed as raw `style` props without a typed interface.
> 3. Complete this task before any screen-level work begins — every screen depends on the shells and primitives delivered here.

## GitHub Issue
- Link: TBD

---

## Overview

Wire the production React frontend (`frontend/`) up to the Authlyn design system defined in `Authlyn/`. This means replacing the placeholder font stack and CSS tokens, porting all primitive UI components and layout shells to TypeScript, installing a router, and establishing a route skeleton that every subsequent screen task can fill in.

The design source of truth is `Authlyn/ds/colors_and_type.css` for tokens, `Authlyn/primitives.jsx` for components, and `Authlyn/screen.css` for utility classes and layout patterns.

---

## Scope

### Frontend

**Dependencies**
- [ ] Add `react-router-dom` to `frontend/package.json`

**Fonts and tokens**
- [ ] Copy all font files from `Authlyn/ds/fonts/` into `frontend/public/fonts/`
  - Google Sans Code: Regular, Medium, SemiBold, Bold (monospaced)
  - Google Sans Code Proportional: Light, Regular, Medium, SemiBold, Bold (UI body)
- [ ] Replace `frontend/src/styles/global.css`:
  - Remove the Google Fonts CDN import for Space Grotesk
  - Add `@font-face` declarations for Google Sans Code and Google Sans Code Proportional from `/fonts/`
  - Keep the Instrument Serif CDN import (display italic accent)
  - Merge all CSS custom properties from `Authlyn/ds/colors_and_type.css` — brand colors (`--brand-accent`, `--brand-mint`, `--brand-danger`, etc.), foreground/background scale, surface tokens, border, warning, spacing, radius, and shadow variables
  - Update `:root` `font-family` to `"Google Sans Code Proportional"` and `font-family` for mono contexts to `"Google Sans Code"`
- [ ] Add `frontend/src/styles/utilities.css` with the utility classes from `Authlyn/screen.css`: `.glass` variants, `.row`, `.col`, `.eye`, `.cap`, `.mono`, `.muted`, `.dim`, `.emph`, `.pill` tones, `.tbl`, `.codeblock`, `.progress`, `.divider`, `.kbd`

**Primitive components** — `frontend/src/components/ui/`
- [ ] `Button.tsx` — from `Btn` in primitives; props: `variant` (`primary` | `ghost` | `link` | `danger`), `size` (`default` | `sm` | `xs`), `icon`, `iconRight`, `style`, `onClick`, `children`
- [ ] `InputField.tsx` — from `Field`; props: `label`, `value`, `type`, `hint`, `error`, `mono`, `suffix`
- [ ] `Icon.tsx` — inline SVG icon map covering all 40+ named icons from primitives (`home`, `users`, `shield`, `key`, `building`, `settings`, `code`, `webhook`, `logs`, `check`, `search`, `filter`, `bell`, `mail`, `lock`, `eye`, `copy`, `download`, `refresh`, `trash`, `edit`, `link`, `globe`, `passkey`, `google`, `github`, `activity`, `app`, `dots`, `chevR`, `chevL`, `x`, `plus`, `arrowR`, `user`, `folder`, `calendar`, and remaining icons)
- [ ] `Avatar.tsx` — initials avatar with six deterministic gradient tones
- [ ] `StatusPill.tsx` — replaces the existing scaffold `StatusPill`; tones: `ok`, `warn`, `err`; used inline without a label wrapper
- [ ] `Toggle.tsx` — on/off switch
- [ ] `Segmented.tsx` — segmented control with `options` array and `value`
- [ ] `Tabs.tsx` — horizontal tab strip with `options` array and `value`
- [ ] `Modal.tsx` — centered glass card overlay with `title`, `subtitle`, `width`, `actions`, `children`

**Layout shells** — `frontend/src/components/layout/`
- [ ] `AuthShell.tsx` — centered column layout (logo → glass card → footer note); used by all 8 auth-flow screens; props: `head`, `subhead`, `width`, `children`
- [ ] `AccountShell.tsx` — topnav + 220 px sidebar + main content; sidebar nav items: Profile, Security, Sessions, Connected apps, API keys, Notifications; props: `active`, `children`
- [ ] `AdminShell.tsx` — app-layout shell with `Sidebar` and `AppBar`; props: `active`, `crumbs`, `title`, `actions`, `children`
- [ ] `Sidebar.tsx` — collapsible nav with section groups and footer user block; driven by a typed nav config array
- [ ] `AppBar.tsx` — page header with breadcrumbs, title, and right-aligned actions slot
- [ ] `BrowserChrome.tsx` — browser window frame with tab bar and URL bar; used by marketing screens; props: `url`, `tabs`, `children`

**Router**
- [ ] Create `frontend/src/app/router.tsx` using `createBrowserRouter`; define top-level routes with placeholder `<div>` outlets:
  - `/` → marketing landing
  - `/pricing` → marketing pricing
  - `/docs` → marketing docs
  - `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`, `/auth/mfa`, `/auth/passkey-enroll`, `/auth/sso`
  - `/account/profile`, `/account/security`, `/account/sessions`, `/account/apps`, `/account/keys`
  - `/admin`, `/admin/users`, `/admin/users/:id`, `/admin/roles`, `/admin/orgs`, `/admin/apps`, `/admin/sessions`, `/admin/audit`, `/admin/settings`, `/admin/keys`, `/admin/webhooks`, `/admin/jwks`
  - `*` → 404 error page
- [ ] Replace `frontend/src/app/App.tsx` — remove the scaffold API health-check page; render `<RouterProvider router={router} />` only

### Tests
- [ ] Smoke tests for `Button`, `InputField`, `Icon`, `Avatar` — render without errors for each variant and named icon
- [ ] Smoke tests for `AuthShell`, `AccountShell`, `AdminShell` — render with minimal required props
- [ ] Route existence: assert each top-level route resolves without a 404

---

## Completion Criteria

- [ ] `npm run dev` in `frontend/` loads the app using Google Sans Code Proportional with no CDN font request for Space Grotesk
- [ ] All 10 primitive components render in isolation without TypeScript errors
- [ ] All 6 layout shells render in isolation without TypeScript errors
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes clean
- [ ] Navigating to `/auth/sign-in`, `/account/profile`, and `/admin` each render a placeholder without a runtime error

---

## Related Tasks

- Prerequisite: [00-03](./00-03-backend-rebuild-from-clean-scaffold.md)
- Follow-up: [00-05](./00-05-auth-screens.md), [00-06](./00-06-marketing-and-account-screens.md), [00-07](./00-07-admin-and-developer-screens.md)
