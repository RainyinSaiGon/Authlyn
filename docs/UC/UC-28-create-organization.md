# [Use Case] Create Organization

## Actors

- Primary: End User (becomes the Organization Owner)

## Trigger

- User creates a new organization from the Tenant setup step in the onboarding wizard or from an admin create action.

## Preconditions

- User is authenticated.
- Tenant-level organization creation is permitted by the platform policy.

## Main Flow

1. User provides an organization name and optionally a slug.
2. System validates that the slug is unique and meets the format rules.
3. System creates the organization record.
4. System assigns the creator as the Organization Owner with full permissions.
5. System redirects the user to the organization dashboard.

## Alternative Flows

- **Slug conflict:** system suggests an auto-generated alternative slug.
- **Organization quota reached:** system rejects and shows the plan limit.

## Postconditions

- Organization record created.
- Creator assigned as Owner.
- Audit log entry written (`org.created`).

## Related APIs/Tasks

- APIs: `POST /api/orgs`
- Tasks: [04-01](../tasks/04-01-organizations-and-memberships.md)
