# [Use Case] View Live Log Stream

## Actors

- Primary: Platform Admin / Developer

## Trigger

- Admin navigates to Admin > Logs.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow

1. System opens a Server-Sent Events (SSE) stream on connection.
2. Log entries appear in the fixed-column table in real time: timestamp (ISO 8601), log level (colour-coded dot), event name, and message.
3. Admin can pause the stream to inspect a specific entry.
4. Admin can filter by log level (debug / info / warn / error).
5. Admin resumes the stream; missed entries are buffered and replayed.

## Alternative Flows

- **SSE stream disconnects (network error):** client automatically reconnects using the `Last-Event-ID` header to resume from the last received event.

## Postconditions

- No state change; read-only streaming operation.

## Related APIs/Tasks

- APIs: `GET /api/admin/logs/stream` (SSE)
- Tasks: [05-02](../tasks/05-02-webhooks-introspection-and-observability.md)
