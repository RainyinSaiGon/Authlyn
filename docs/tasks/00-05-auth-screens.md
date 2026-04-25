# [Task] Auth Screens

> **Implementation Rules**
> 1. Each screen is a thin view component — no business logic, no API calls, no state beyond local form state.
> 2. Every screen must use only primitives and shells from `00-04`; do not introduce new one-off styled elements.
> 3. Wire routes but leave form submissions as no-ops (`e.preventDefault()`) until the backend identity tasks (01-xx) are ready to connect.

## GitHub Issue
- Link: TBD

---

## Overview

Port the 8 end-user authentication flow screens from `Authlyn/screens-auth.jsx` into the React frontend as real, routed TypeScript components. This is a pure UI task — fidelity to the design is the goal, not API integration.

---

## Scope

### Frontend

All screen components live under `frontend/src/features/auth/screens/`.

- [ ] `SignIn.tsx` — email field, password field, "Remember this device" checkbox, "Forgot password" link, primary sign-in button, OR divider, Passkey / Google / GitHub ghost buttons, "No account? Create one" link; mounts at `/auth/sign-in`
- [ ] `SignUp.tsx` — display name field, email field, password field with strength bar (5-segment), terms copy, primary "Create account" button, OR divider, "Sign up with a passkey" ghost button, "Already registered?" link; mounts at `/auth/sign-up`
- [ ] `ForgotPassword.tsx` — description copy, email field, "Send reset link" button, back link; mounts at `/auth/forgot-password`
- [ ] `ResetPassword.tsx` — "Token verified" success banner (token id + expiry), new password field with hint, confirm password field, "Update password" button; mounts at `/auth/reset-password`
- [ ] `VerifyEmail.tsx` — dashed email display card with mail icon and expiry note, explanation copy, "Resend" and "Change email" ghost buttons; mounts at `/auth/verify-email`
- [ ] `MFAChallenge.tsx` — description, 6-digit OTP input rendered as individual boxes (last box highlighted with focus ring), "Use a backup code" link, TOTP rotation countdown, "Verify" button; mounts at `/auth/mfa`
- [ ] `PasskeyEnroll.tsx` — radial glow icon block, 3-bullet feature list, "Continue" button, "Skip for now" link; mounts at `/auth/passkey-enroll`
- [ ] `SSORedirect.tsx` — org logo block with name and protocol label, progress bar, redirect URL in mono, "Not your organization?" escape link; mounts at `/auth/sso`

Each screen is wrapped in `AuthShell` with the correct `head` and `subhead` props.

### Tests
- [ ] Render test for each of the 8 screens — assert the primary heading text and the main action button are present in the DOM

---

## Completion Criteria

- [ ] All 8 routes under `/auth/*` render the correct screen without runtime errors
- [ ] Each screen matches the `Authlyn/screens-auth.jsx` layout at first glance — shell, card width, field order, button labels
- [ ] Form submissions call `e.preventDefault()` and do nothing else
- [ ] `npm run typecheck` and `npm run lint` pass clean

---

## Related Tasks

- Prerequisite: [00-04](./00-04-frontend-design-system-foundation.md)
- Backend integration: [01-03](./01-03-signup-endpoint.md), [01-04](./01-04-login-token-issuance-and-api-me.md), [01-05](./01-05-refresh-logout-and-password-reset.md)
- Follow-up: [00-06](./00-06-marketing-and-account-screens.md)
