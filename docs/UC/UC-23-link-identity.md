# [Use Case] Link / Unlink Identity Provider

## Actors

- Primary: End User

## Trigger

- User clicks "Link" or "Unlink" on a social identity card (Google, GitHub, Slack) in Account > Profile > Linked Identities.

## Preconditions

- User is authenticated.

## Main Flow — Link

1. User clicks "Link" on an unconnected provider.
2. System initiates the OAuth authorization flow for that provider (as in UC-03).
3. Provider confirms the user's identity and returns the authorization code.
4. System verifies the code and resolves the provider's user ID and email.
5. System creates an identity record linking the provider to the account.
6. The provider card updates to show "Connected".

## Main Flow — Unlink

1. User clicks "Unlink" on a connected provider.
2. System verifies that at least one other sign-in method remains (another identity or a password).
3. System deletes the identity record.
4. The provider card reverts to "Link".

## Alternative Flows

- **Provider email conflicts with another account:** system rejects the link and explains the conflict.
- **Unlinking the last authentication method:** system rejects and explains that at least one method must remain.

## Postconditions

- Identity record created or deleted.
- Audit log entry written (`identity.linked` or `identity.unlinked`).

## Related APIs/Tasks

- APIs: `POST /api/auth/identities/link`, `DELETE /api/auth/identities/:identityId`
- Tasks: [03-03](../tasks/03-03-social-login-magic-links-and-oidc.md)
