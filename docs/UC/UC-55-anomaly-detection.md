# [Use Case] Detect and Alert on Anomalous Sign-In

## Actors

- Primary: System (automated detection)
- Secondary: Platform Admin, End User

## Trigger

- System evaluates a sign-in event and detects an anomalous signal.

## Preconditions

- Anomaly detection is enabled in the platform settings.
- The user has a sufficient sign-in history to establish a baseline.

## Main Flow

1. A sign-in event completes (password, passkey, or SSO).
2. System evaluates the event against anomaly signals: new country, impossible travel (location change faster than physically possible), sign-in from a known-malicious IP, or use of a breached password.
3. System flags the event as anomalous and writes an anomaly audit record.
4. System sends a security notification to the user ("New sign-in from Berlin, Germany. Was this you?").
5. If the risk score exceeds a step-up threshold, system challenges the user with an additional MFA factor (even if MFA was not otherwise required).
6. The session in Admin > Sessions shows an anomaly warning badge.
7. If an alerting rule is configured (Slack channel, PagerDuty integration), system emits an alert.

## Alternative Flows

- **False positive — user confirms the sign-in:** system records the confirmation, updates the location baseline, and clears the anomaly flag.
- **User does not respond to the security notification:** system logs the event but does not automatically block access (configurable policy).
- **High-risk event (impossible travel or breached password):** system may be configured to require re-authentication or suspend the session pending manual admin review.

## Postconditions

- Anomaly event recorded in the audit log.
- Security notification sent to the user.
- Admin alerted if alert thresholds are configured.
- Session anomaly flag visible in the admin sessions view.

## Related APIs/Tasks

- APIs: `POST /api/internal/anomaly/evaluate`
- Tasks: [02-04](../tasks/02-04-anomaly-detection-and-security-notifications.md), [11-02](../tasks/11-02-bot-protection-breach-detection-and-alerting.md)
