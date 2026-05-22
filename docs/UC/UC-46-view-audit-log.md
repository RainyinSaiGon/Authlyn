# [Use Case] View Platform Audit Log

## Actors

- Primary: Platform Admin

## Trigger

- Admin navigates to Admin > Audit Log.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow

1. System renders the audit log table: colored event-type dot, event name (monospace), actor, target (monospace), IP address, and timestamp.
2. Admin applies filters: actor (user ID or email), event type, date range.
3. System returns paginated results matching the filters.
4. Admin clicks "Export" to download the filtered results as a CSV or JSON file.

## Alternative Flows

- **No events in the selected range:** table shows an empty state with a "Clear filters" suggestion.

## Postconditions

- No state change; read-only.

## Related APIs/Tasks

- APIs: `GET /api/admin/audit?actor=&event=&from=&to=&page=`
- Tasks: [02-03](../tasks/02-03-rate-limits-and-audit-logs.md)
