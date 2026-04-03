# Current Implemented Flows (Authlyn)

This document covers only flows that are implemented in the current codebase.

## Scope

Implemented today:

- Application startup with Spring Boot auto-configuration
- Security filter behavior (public vs protected endpoints)
- RSA key loading / generation and JWKS exposure
- JWT verification for protected requests (resource server mode)

Not yet implemented:

- Signup/login APIs
- Refresh-token rotation endpoint flow
- Logout/logout-all-devices endpoint flow
- MFA challenge/verification

## Flow 1: Application startup

```mermaid
sequenceDiagram
    autonumber
    participant P as Spring Boot
    participant C as App Config
    participant R as RsaKeyService
    participant S as SecurityConfig
    participant F as Flyway
    participant D as PostgreSQL

    P->>C: Load application.yml + env vars
    P->>F: Initialize Flyway
    F->>D: Validate/apply migrations
    D-->>F: Migration status

    P->>R: Create RsaKeyService bean
    R->>R: Load configured keys OR generate ephemeral keypair
    R-->>P: signingKey + publicJwk + publicKey

    P->>S: Build SecurityFilterChain/JwtEncoder/JwtDecoder
    S-->>P: Security runtime ready
```

## Flow 2: Public endpoint access

Public endpoints are permitted by `SecurityConfig`:

- `/actuator/health`
- `/actuator/info`
- `/actuator/prometheus`
- `${authlyn.jwt.jwks-path}` (default `/.well-known/jwks.json`)

```mermaid
sequenceDiagram
    autonumber
    participant U as Client
    participant SF as Security Filter Chain
    participant HC as Actuator Health/Info
    participant JC as JwksController
    participant RS as RsaKeyService

    U->>SF: GET /actuator/health (or /info, /prometheus)
    SF->>SF: Match permitAll paths
    SF-->>HC: Allow without JWT
    HC-->>U: 200 response

    U->>SF: GET /.well-known/jwks.json
    SF->>SF: Match configured jwks-path permitAll
    SF-->>JC: Allow without JWT
    JC->>RS: getPublicJwk()
    RS-->>JC: Public JWK
    JC-->>U: JWKS JSON
```

## Flow 3: Protected endpoint request (JWT verification)

Any path not explicitly permitted requires authentication.

```mermaid
sequenceDiagram
    autonumber
    participant U as Client
    participant SF as Security Filter Chain
    participant RS as OAuth2 Resource Server
    participant JD as JwtDecoder
    participant API as Protected Endpoint

    U->>SF: GET /protected with Bearer token
    SF->>RS: Route to JWT auth
    RS->>JD: Verify signature and claims
    alt Token valid
        JD-->>RS: Authenticated principal
        RS-->>API: Continue request
        API-->>U: 200 response
    else Token invalid/missing
        JD-->>RS: Verification failure
        RS-->>U: 401 Unauthorized
    end
```

## Notes

- JWT issuance endpoint flow is not implemented yet in controllers/services, but encoder wiring is already present.
- If RSA keys are not configured, generated keys are ephemeral and will change on restart.
- Detailed key-management and rotation guidance is in:
  - [`jwt-jwks-flow.md`](./jwt-jwks-flow.md)
