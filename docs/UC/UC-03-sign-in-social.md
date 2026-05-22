# [Use Case] Sign In with Social Provider

## Actors

- Primary: End User
- Secondary: OAuth Provider (Google / GitHub)

## Trigger

- User clicks a social sign-in button ("Continue with Google" or "Continue with GitHub") on the sign-in or sign-up screen.

## Preconditions

- The selected OAuth provider is configured in the platform settings.

## Main Flow

1. User clicks the social provider button.
2. System builds an authorization URL (including `state` and PKCE `code_challenge`) and redirects the user to the provider.
3. User authenticates with the provider and grants consent.
4. Provider redirects back to the callback endpoint with an authorization code.
5. System validates the `state` parameter to prevent CSRF.
6. System exchanges the code for provider access and ID tokens.
7. System resolves the user: matches by provider email to an existing account, or creates a new account and identity record.
8. System creates a session and issues access and refresh tokens.
9. User is redirected to the post-login destination.

## Alternative Flows

- **Email already registered with password:** system links the new social identity to the existing account rather than creating a duplicate.
- **Provider returns an error:** system shows an error message and redirects to sign-in.
- **User denies consent at the provider:** system redirects to sign-in with an `error=access_denied` notice.

## Postconditions

- Identity record created and linked to the user account.
- Session and tokens issued.
- Audit log entry written (`auth.social_login`).

## Related APIs/Tasks

- APIs: `GET /api/public/auth/oauth/:provider/authorize`, `GET /api/public/auth/oauth/:provider/callback`
- Tasks: [03-03](../tasks/03-03-social-login-magic-links-and-oidc.md)
