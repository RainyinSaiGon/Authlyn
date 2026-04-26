# Design Docs Index

This folder tracks UX and design references for Authlyn.

## Documents

- [Design Screens](./figma-screens.md) — full inventory of the 38 Claude Design screens and their migration task mapping
- [Vendor UI Requirements](./vendor-ui-requirements.md)

## Design Source Location

All design work lives in the `Authlyn/` folder at the repository root. This folder was produced by Claude Design and is the source of truth for tokens, fonts, primitive components, and screen layouts.

Key source files:

- `Authlyn/ds/colors_and_type.css` — design tokens (source reference)
- `Authlyn/primitives.jsx` — all primitive components (source reference)
- `Authlyn/screen.css` — utility classes (source reference; patterns ported to `frontend/src/styles/global.css` `@layer components`)
- `Authlyn/screens-*.jsx` — screen designs

## Migration Tasks

| Task | Scope | Status |
| --- | --- | --- |
| [00-04](../tasks/00-04-frontend-design-system-foundation.md) | Tokens, fonts, primitive components, layout shells, router | Done |
| [00-05](../tasks/00-05-auth-screens.md) | 8 auth flow screens | Done |
| [00-06](../tasks/00-06-marketing-and-account-screens.md) | 3 marketing pages + 5 account tabs | Done |
| [00-07](../tasks/00-07-admin-and-developer-screens.md) | 10 admin screens + developer tools + edge states + mobile variants | Planned |

## Notes

- Keep this section practical and implementation-focused.
- Store only high-value design decisions and references.
- Update [Design Screens](./figma-screens.md) migration status as tasks complete.
