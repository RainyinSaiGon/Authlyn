# Design Docs Index

This folder tracks UX and design references for Authlyn.

## Documents

- [Design Screens](./figma-screens.md) — full inventory of the 38 Claude Design screens and their migration task mapping
- [Vendor UI Requirements](./vendor-ui-requirements.md)

## Design Source Location

All design work lives in the `Authlyn/` folder at the repository root. This folder was produced by Claude Design and is the source of truth for tokens, fonts, primitive components, and screen layouts.

Key files:

- `Authlyn/ds/colors_and_type.css` — design tokens
- `Authlyn/primitives.jsx` — all primitive components
- `Authlyn/screen.css` — utility classes
- `Authlyn/screens-*.jsx` — screen designs

## Migration Tasks

The design is being ported to the React frontend in four tasks:

| Task | Scope |
| --- | --- |
| [00-04](../tasks/00-04-frontend-design-system-foundation.md) | Tokens, fonts, primitive components, layout shells, router |
| [00-05](../tasks/00-05-auth-screens.md) | 8 auth flow screens |
| [00-06](../tasks/00-06-marketing-and-account-screens.md) | 3 marketing pages + 5 account tabs |
| [00-07](../tasks/00-07-admin-and-developer-screens.md) | 10 admin screens + developer tools + edge states + mobile variants |

## Notes

- Keep this section practical and implementation-focused.
- Store only high-value design decisions and references.
- Update [Design Screens](./figma-screens.md) migration status as tasks complete.
