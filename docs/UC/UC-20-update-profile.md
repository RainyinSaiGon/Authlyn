# [Use Case] Update Profile

## Actors

- Primary: End User

## Trigger

- User edits and saves fields on the Account > Profile page.

## Preconditions

- User is authenticated.

## Main Flow

1. System renders the profile form pre-populated with current values: display name, pronouns, timezone, language.
2. User modifies one or more fields and submits.
3. System validates the input (e.g. valid timezone ID, allowed pronouns format).
4. System persists the updated fields to the user profile record.
5. System returns the updated profile.

## Alternative Flows

- **Validation error (e.g. unrecognised timezone):** system highlights the offending field with an inline error.

## Postconditions

- Profile record updated.
- Audit log entry written (`user.profile_updated`).

## Related APIs/Tasks

- APIs: `GET /api/me`, `PATCH /api/me/profile`
- Tasks: [06-01](../tasks/06-01-profiles-and-self-service.md)
