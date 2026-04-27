# [Use Case] Export Account Data

## Actors

- Primary: End User

## Trigger

- User requests a data export from Account > Profile.

## Preconditions

- User is authenticated.
- No export job is already in progress for this account.

## Main Flow

1. User clicks "Request data export".
2. System enqueues an async export job.
3. Job collects all user data: profile fields, linked identities, active sessions, audit events, consent records, API keys (labels only, not key values).
4. System packages the data as a structured JSON archive.
5. System generates a time-limited, signed download link.
6. System sends the download link to the user's verified email.
7. User clicks the link within the TTL to download the archive.

## Alternative Flows

- **Export already in progress:** system rejects the duplicate request and indicates the first export is still pending.

## Postconditions

- Export archive delivered to the user's email.
- Audit log entry written (`user.data_exported`).

## Related APIs/Tasks

- APIs: `POST /api/me/export`
- Tasks: [06-02](../tasks/06-02-contact-change-export-deletion-and-custom-claims.md)
