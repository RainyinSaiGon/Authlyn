# [Use Case] View Admin Dashboard

## Actors

- Primary: Platform Admin

## Trigger

- Admin navigates to `/admin`.

## Preconditions

- Admin is authenticated and the JWT contains the `admin` role.

## Main Flow

1. System displays four stat cards: Active Users, Organizations, Sign-ins (24h), MFA Coverage percentage.
2. System renders a sign-in trend chart (SVG) with a time-range segmented control (7d / 30d / 90d).
3. System displays a recent platform events list (last 20 events with actor, event type, and timestamp).
4. Admin selects a different time range; the chart updates.

## Alternative Flows

- **No data available:** stat cards show zero values; chart renders an empty state message.
- **Insufficient role:** admin without the `admin` role is redirected to `/` by the `RequireAdmin` guard.

## Postconditions

- No state change; read-only operation.

## Related APIs/Tasks

- APIs: `GET /api/admin/stats`, `GET /api/admin/events/recent`
- Tasks: [00-07](../tasks/00-07-admin-and-developer-screens.md), [11-01](../tasks/11-01-security-analytics-and-dashboard.md)
