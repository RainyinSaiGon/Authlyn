# [Use Case] Sign In via SSO

## Actors

- Primary: End User
- Secondary: Enterprise Identity Provider (SAML IdP or OIDC provider)

## Trigger

- User navigates to `/auth/sso` with an organization identifier, or is redirected there from the sign-in screen.

## Preconditions

- The organization has an active SSO configuration.
- The identity provider is reachable.

## Main Flow — SAML

1. System generates a signed SAML AuthnRequest and redirects the user to the IdP's SSO URL.
2. User authenticates at the IdP (corporate credentials, existing IdP session, or MFA at the IdP).
3. IdP posts a SAML Response (assertion) to the Authlyn ACS endpoint.
4. System validates: signature, issuer, audience, timestamp, and conditions.
5. System extracts the user attributes (NameID, email, name, groups).
6. System resolves the user by mapping the NameID: finds an existing account or JIT-provisions a new one.
7. System assigns org membership and roles from attribute mappings.
8. System creates a session and issues access and refresh tokens.
9. User is redirected to the post-login destination.

## Main Flow — OIDC

1. System redirects to the OIDC authorization endpoint with PKCE.
2. User authenticates at the IdP.
3. IdP returns an authorization code.
4. System exchanges the code for tokens and validates the ID token.
5. System resolves or JIT-provisions the user.
6. Steps 7–9 as above.

## Alternative Flows

- **Invalid SAML signature or expired assertion:** system rejects and logs a security event.
- **JIT provisioning disabled:** system rejects sign-in attempts from unrecognised users.
- **IdP unreachable:** system shows an error with a "Try again" action.

## Postconditions

- Session and tokens issued.
- User JIT-provisioned if new (membership and roles set).
- Audit log entry written (`auth.sso_login`).

## Related APIs/Tasks

- APIs: `GET /api/public/auth/sso/:orgSlug`, `POST /api/public/auth/sso/acs`, `GET /api/public/auth/sso/:orgSlug/oidc/callback`
- Tasks: [04-03](../tasks/04-03-invites-enterprise-sso-and-jit-provisioning.md)
