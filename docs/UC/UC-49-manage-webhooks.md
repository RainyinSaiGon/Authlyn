# [Use Case] Register and Manage Webhook Endpoints

## Actors

- Primary: Platform Admin / Developer

## Trigger

- Admin navigates to Admin > Webhooks.

## Preconditions

- Admin is authenticated with the `admin` role.

## Main Flow — Register

1. Admin clicks "Add endpoint".
2. Admin provides the endpoint URL, selects subscribed event types, and optionally sets a custom signing secret.
3. System persists the endpoint configuration.
4. System sends a test ping to the URL (`webhook.test` event).
5. If the URL responds 2xx, the endpoint status shows "Healthy".

## Main Flow — View Delivery History

1. Admin selects an endpoint from the left-panel list.
2. System shows the delivery detail panel: event name, delivery timestamp, response status, response time, and the JSON payload in a code block.
3. Admin clicks "Resend" on a failed delivery.
4. System queues a redelivery attempt.

## Main Flow — Disable / Delete

1. Admin deactivates the endpoint (pauses deliveries) or deletes it.
2. System stops dispatching events to that URL.

## Alternative Flows

- **Test ping fails (non-2xx or timeout):** system marks the endpoint unhealthy and shows the HTTP status code.
- **Endpoint consistently unhealthy:** system pauses delivery after N consecutive failures and sends an admin alert.

## Postconditions

- Endpoint registered, updated, or removed.
- Audit log entry written (`webhook.created`, `webhook.delivery_resent`, etc.).

## Related APIs/Tasks

- APIs: `GET /api/admin/webhooks`, `POST /api/admin/webhooks`, `GET /api/admin/webhooks/:id/deliveries`, `POST /api/admin/webhooks/deliveries/:deliveryId/resend`
- Tasks: [05-02](../tasks/05-02-webhooks-introspection-and-observability.md)
