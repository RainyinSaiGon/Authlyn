# [Use Case] Configure Enterprise SSO

## Actors

- Primary: Organization Admin

## Trigger

- Admin navigates to Admin > Settings > SSO and adds or edits an SSO configuration.

## Preconditions

- Admin has org-level SSO configuration permission.
- IdP metadata or OIDC discovery URL is available.

## Main Flow — SAML 2.0

1. Admin selects SAML 2.0 as the protocol.
2. Admin enters the IdP metadata URL or uploads the XML metadata file.
3. System parses and stores the IdP entity ID, SSO URL, and signing certificate.
4. System returns the SP metadata (entity ID, ACS URL, SP certificate) for the admin to register in the IdP.
5. Admin saves the configuration.
6. System performs a connectivity test (optional).

## Main Flow — OIDC

1. Admin selects OIDC as the protocol.
2. Admin enters the issuer URL, client ID, and client secret.
3. System performs OIDC discovery (fetches `/.well-known/openid-configuration`) and stores the endpoint metadata.
4. Admin saves.

## Alternative Flows

- **Invalid SAML metadata:** system parses and reports the specific XML error.
- **OIDC discovery endpoint unreachable:** system reports the connectivity error and asks the admin to retry.

## Postconditions

- SSO configuration stored and active.
- Audit log entry written (`org.sso_configured`).

## Related APIs/Tasks

- APIs: `POST /api/orgs/:orgId/sso`, `PATCH /api/orgs/:orgId/sso`
- Tasks: [04-03](../tasks/04-03-invites-enterprise-sso-and-jit-provisioning.md)
