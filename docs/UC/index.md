# Use Cases Index

This folder tracks system-level use cases for Authlyn. Each file documents one actor goal following the [template](./TEMPLATE.md).

## Candidate Actors

- End User
- Organization Admin
- Platform Admin
- External Integration Service

---

## Authentication

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-01](./UC-01-sign-up.md) | Sign Up | End User |
| [UC-02](./UC-02-sign-in-password.md) | Sign In with Password | End User |
| [UC-03](./UC-03-sign-in-social.md) | Sign In with Social Provider | End User |
| [UC-04](./UC-04-verify-email.md) | Verify Email Address | End User |
| [UC-05](./UC-05-request-password-reset.md) | Request Password Reset | End User |
| [UC-06](./UC-06-reset-password.md) | Reset Password | End User |
| [UC-07](./UC-07-refresh-access-token.md) | Refresh Access Token | End User |
| [UC-08](./UC-08-sign-out.md) | Sign Out | End User |
| [UC-09](./UC-09-sign-out-all.md) | Sign Out All Sessions | End User |
| [UC-36](./UC-36-magic-link-sign-in.md) | Sign In with Magic Link | End User |

## MFA

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-10](./UC-10-enroll-totp.md) | Enroll TOTP MFA | End User |
| [UC-11](./UC-11-mfa-challenge.md) | Complete MFA Challenge | End User |
| [UC-12](./UC-12-use-recovery-code.md) | Use Recovery Code | End User |
| [UC-13](./UC-13-remove-mfa.md) | Remove MFA Factor | End User |

## Passkeys / WebAuthn

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-14](./UC-14-enroll-passkey.md) | Enroll Passkey | End User |
| [UC-15](./UC-15-sign-in-passkey.md) | Sign In with Passkey | End User |
| [UC-16](./UC-16-remove-passkey.md) | Remove Passkey | End User |

## Session Management

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-17](./UC-17-view-sessions.md) | View Active Sessions | End User |
| [UC-18](./UC-18-revoke-session.md) | Revoke a Session | End User |
| [UC-19](./UC-19-trust-device.md) | Trust a Device | End User |

## Profile and Self-Service

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-20](./UC-20-update-profile.md) | Update Profile | End User |
| [UC-21](./UC-21-change-email.md) | Change Email Address | End User |
| [UC-22](./UC-22-change-phone.md) | Change Phone Number | End User |
| [UC-23](./UC-23-link-identity.md) | Link / Unlink Identity Provider | End User |
| [UC-24](./UC-24-manage-personal-api-keys.md) | Manage Personal API Keys | End User |
| [UC-25](./UC-25-revoke-app-access.md) | Revoke Application Access | End User |
| [UC-26](./UC-26-export-account-data.md) | Export Account Data | End User |
| [UC-27](./UC-27-delete-account.md) | Delete Account | End User |

## Organizations and Multi-Tenancy

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-28](./UC-28-create-organization.md) | Create Organization | End User |
| [UC-29](./UC-29-invite-member.md) | Invite User to Organization | Organization Admin |
| [UC-30](./UC-30-accept-invitation.md) | Accept Organization Invitation | End User |
| [UC-31](./UC-31-assign-role.md) | Assign Role to Organization Member | Organization Admin |
| [UC-32](./UC-32-configure-sso.md) | Configure Enterprise SSO | Organization Admin |
| [UC-33](./UC-33-sso-sign-in.md) | Sign In via SSO | End User |

## OAuth 2.0 and OIDC

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-34](./UC-34-oauth-consent.md) | Authorize Third-Party Application | End User |
| [UC-35](./UC-35-exchange-code.md) | Exchange Authorization Code | External Integration Service |

## Consent and Privacy

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-37](./UC-37-grant-consent.md) | Grant Consent | End User |
| [UC-38](./UC-38-withdraw-consent.md) | Withdraw Consent | End User |

## Platform Admin Console

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-39](./UC-39-admin-dashboard.md) | View Admin Dashboard | Platform Admin |
| [UC-40](./UC-40-search-users.md) | Search and Filter Users | Platform Admin |
| [UC-41](./UC-41-view-user-detail.md) | View User Detail | Platform Admin |
| [UC-42](./UC-42-invite-user-admin.md) | Invite User (Admin) | Platform Admin |
| [UC-43](./UC-43-revoke-session-admin.md) | Revoke User Session (Admin) | Platform Admin |
| [UC-44](./UC-44-manage-roles.md) | Manage Roles and Permissions | Platform Admin |
| [UC-45](./UC-45-manage-applications.md) | Manage Applications | Platform Admin |
| [UC-46](./UC-46-view-audit-log.md) | View Platform Audit Log | Platform Admin |
| [UC-47](./UC-47-configure-platform-settings.md) | Configure Platform Settings | Platform Admin |

## Developer Tools

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-48](./UC-48-manage-admin-api-keys.md) | Create and Manage API Keys | Platform Admin |
| [UC-49](./UC-49-manage-webhooks.md) | Register and Manage Webhook Endpoints | Platform Admin |
| [UC-50](./UC-50-introspect-token.md) | Introspect Token | External Integration Service |
| [UC-51](./UC-51-fetch-jwks.md) | Fetch JWKS | External Integration Service |
| [UC-52](./UC-52-live-log-stream.md) | View Live Log Stream | Platform Admin |

## Onboarding and Provisioning

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-53](./UC-53-tenant-onboarding.md) | Complete Tenant Onboarding | Platform Admin |
| [UC-54](./UC-54-scim-provision-user.md) | Provision User via SCIM | External Integration Service |

## Security and Anomaly Detection

| ID | Use Case | Primary Actor |
| --- | --- | --- |
| [UC-55](./UC-55-anomaly-detection.md) | Detect and Alert on Anomalous Sign-In | System |
