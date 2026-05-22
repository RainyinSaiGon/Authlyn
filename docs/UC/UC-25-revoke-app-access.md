# [Use Case] Revoke Application Access

## Actors

- Primary: End User

## Trigger

- User clicks "Revoke" on a connected application in Account > Connected Apps.

## Preconditions

- User is authenticated.
- The application has an active OAuth grant for this user.

## Main Flow

1. System lists all third-party applications that have an active OAuth grant, showing their name, client ID, granted scopes, and connected date.
2. User clicks "Revoke" on the target application.
3. System revokes all access tokens and refresh tokens issued to that application for this user.
4. System deletes or deactivates the consent grant record.
5. The app is removed from the connected list.

## Alternative Flows

- **Application has already been disconnected:** the entry is no longer shown.

## Postconditions

- OAuth grant revoked.
- All tokens for that app/user pair invalidated.
- Audit log entry written (`oauth.grant_revoked`).

## Related APIs/Tasks

- APIs: `DELETE /api/me/apps/:clientId`
- Tasks: [03-02](../tasks/03-02-oauth-authorization-server.md)
