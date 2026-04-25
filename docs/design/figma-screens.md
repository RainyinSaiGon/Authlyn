# Design Screens

The Authlyn UI was designed using Claude Design and lives in the `Authlyn/` folder at the repository root. All design assets, tokens, fonts, and screen files are in that folder — there is no separate Figma file.

## Design Source Files

| File | Contents |
| --- | --- |
| `Authlyn/ds/colors_and_type.css` | Design tokens — brand colors, foreground/background scale, surface tokens, border, spacing, radius, shadow |
| `Authlyn/ds/fonts/` | Google Sans Code and Google Sans Code Proportional font files (Regular, Medium, SemiBold, Bold) |
| `Authlyn/primitives.jsx` | All primitive UI components — Button, Field, Icon, Avatar, StatusPill, Toggle, Segmented, Tabs, Modal |
| `Authlyn/screen.css` | Utility classes — `.glass`, `.row`, `.col`, `.pill`, `.mono`, `.tbl`, `.codeblock`, etc. |
| `Authlyn/screens-auth.jsx` | 8 end-user authentication screens |
| `Authlyn/screens-marketing.jsx` | 3 public marketing pages |
| `Authlyn/screens-account.jsx` | 5 end-user account management tabs |
| `Authlyn/screens-admin.jsx` | 10 admin console screens |
| `Authlyn/screens-dev.jsx` | Developer tools, onboarding wizard, edge states, and mobile variants |

## Screen Inventory

### Auth Screens (`screens-auth.jsx`) — Task [00-05](../tasks/00-05-auth-screens.md)

| Screen | Route |
| --- | --- |
| SignIn | `/auth/sign-in` |
| SignUp | `/auth/sign-up` |
| ForgotPassword | `/auth/forgot-password` |
| ResetPassword | `/auth/reset-password` |
| VerifyEmail | `/auth/verify-email` |
| MFAChallenge | `/auth/mfa` |
| PasskeyEnroll | `/auth/passkey-enroll` |
| SSORedirect | `/auth/sso` |

### Marketing Pages (`screens-marketing.jsx`) — Task [00-06](../tasks/00-06-marketing-and-account-screens.md)

| Screen | Route |
| --- | --- |
| Landing | `/` |
| Pricing | `/pricing` |
| Docs | `/docs` |

### Account Pages (`screens-account.jsx`) — Task [00-06](../tasks/00-06-marketing-and-account-screens.md)

| Screen | Route |
| --- | --- |
| Profile | `/account/profile` |
| Security | `/account/security` |
| Sessions | `/account/sessions` |
| ConnectedApps | `/account/apps` |
| ApiKeys | `/account/keys` |

### Admin Console (`screens-admin.jsx`) — Task [00-07](../tasks/00-07-admin-and-developer-screens.md)

| Screen | Route |
| --- | --- |
| Overview | `/admin` |
| Users | `/admin/users` |
| UserDetail | `/admin/users/:id` |
| InviteUser | Modal over `/admin/users` |
| Roles | `/admin/roles` |
| Organizations | `/admin/orgs` |
| Applications | `/admin/apps` |
| AdminSessions | `/admin/sessions` |
| AuditLog | `/admin/audit` |
| Settings | `/admin/settings` |

### Developer Tools, Edge States, Mobile (`screens-dev.jsx`) — Task [00-07](../tasks/00-07-admin-and-developer-screens.md)

| Screen | Route / Type |
| --- | --- |
| ApiKeys (developer) | `/admin/keys` |
| Webhooks | `/admin/webhooks` |
| Jwks | `/admin/jwks` |
| Logs | `/admin/logs` |
| Onboarding | `/onboarding` |
| NotFound | `*` catch-all |
| ServerError | Standalone |
| Maintenance | `/maintenance` |
| EmptyState | Reusable component |
| MobileSignIn | Mobile variant |
| MobileMFA | Mobile variant |
| MobilePasskey | Mobile variant |

## Migration Status

| Task | Status |
| --- | --- |
| [00-04](../tasks/00-04-frontend-design-system-foundation.md) Design System Foundation | Planned |
| [00-05](../tasks/00-05-auth-screens.md) Auth Screens | Planned |
| [00-06](../tasks/00-06-marketing-and-account-screens.md) Marketing and Account Screens | Planned |
| [00-07](../tasks/00-07-admin-and-developer-screens.md) Admin and Developer Screens | Planned |

## Design Token Summary

Key brand tokens from `Authlyn/ds/colors_and_type.css`:

- `--brand-accent: #f87d49` (orange)
- `--brand-mint: #6cd0b0` (teal)
- `--brand-danger: #f15d78` (red)
- Primary font: Google Sans Code Proportional (UI body)
- Monospace font: Google Sans Code
- Display accent: Instrument Serif (italic, loaded from CDN)
- Base theme: dark (dark backgrounds, light foreground)
