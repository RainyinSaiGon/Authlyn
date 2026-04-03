# Authlyn

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-25-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Gradle](https://img.shields.io/badge/Build-Gradle-02303A.svg)](https://gradle.org/)

Authlyn is an open-source Spring Boot IAM platform scaffold built with Gradle. It is designed to evolve into a production-ready identity and access management service with PostgreSQL, Redis, Flyway, RSA-signed JWTs, a public JWKS endpoint, OAuth2 Resource Server support, and actuator health endpoints.

[License](LICENSE) · [Contributing](CONTRIBUTING.md) · [Code of Conduct](.github/CODE_OF_CONDUCT.md) · [Security](SECURITY.md) · [Issues](https://github.com/RainyinSaiGon/Authlyn/issues)

## Project status

This repository currently contains the core application bootstrap, security baseline, database migration foundation, and local development infrastructure. It is still a scaffold, not a finished IAM platform.

## Tech stack

- Java `25`
- Spring Boot `4.0.5`
- Gradle wrapper (`./gradlew`)
- PostgreSQL for persistent storage
- Redis for local caching / session-related workflows
- Flyway for schema migrations
- Spring Security OAuth2 Resource Server

## What is already set up

- Spring Boot application entry point in `src/main/java/com/authlyn/AuthlynApplication.java`
- Security baseline in `src/main/java/com/authlyn/config/SecurityConfig.java`
- RSA key management and JWKS support in `src/main/java/com/authlyn/security/jwt/`
- Database migration folder under `src/main/resources/db/migration`
- Local Redis container via `docker-compose.yml`
- Environment template in `.env.example`

## Prerequisites

- Java `25`
- Docker Desktop or another Docker-compatible runtime
- A PostgreSQL database you can connect to during development

> Note: the current setup expects PostgreSQL access through Neon. Local Redis runs in Docker.

## JWT signing keys

Authlyn can start with an ephemeral RSA signing key if you do not provide one, which is useful for local development and tests. For stable tokens across restarts, provide your own key material through the environment.

Recommended setup:

- `AUTHLYN_JWT_PRIVATE_KEY_PATH` for a PEM-encoded PKCS#8 private key file
- `AUTHLYN_JWT_PUBLIC_KEY_PATH` for the matching PEM-encoded public key file, if you want to supply one explicitly
- or `AUTHLYN_JWT_PRIVATE_KEY` / `AUTHLYN_JWT_PUBLIC_KEY` for inline PEM content

The public JWKS is exposed at:

```text
http://localhost:8080/.well-known/jwks.json
```

## Local setup

1. Copy the environment template:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Fill in your database values in `.env`:
   - `AUTHLYN_DB_URL`
   - `AUTHLYN_DB_USERNAME`
   - `AUTHLYN_DB_PASSWORD`

3. Optionally configure RSA signing keys in `.env`:
   - `AUTHLYN_JWT_PRIVATE_KEY_PATH`
   - `AUTHLYN_JWT_PUBLIC_KEY_PATH`
   - or `AUTHLYN_JWT_PRIVATE_KEY` / `AUTHLYN_JWT_PUBLIC_KEY`

4. Start Redis locally:

   ```powershell
   docker compose up -d
   ```

5. Run the app with Gradle:

   ```powershell
   .\gradlew.bat bootRun
   ```

6. Check the health endpoint:

   ```powershell
   Invoke-WebRequest http://localhost:8080/actuator/health | Select-Object -ExpandProperty Content
   ```

7. Check the JWKS endpoint:

   ```powershell
   Invoke-WebRequest http://localhost:8080/.well-known/jwks.json | Select-Object -ExpandProperty Content
   ```

## Environment variables

The main variables are documented in `.env.example`.

- `SERVER_PORT`
- `AUTHLYN_DB_URL`
- `AUTHLYN_DB_USERNAME`
- `AUTHLYN_DB_PASSWORD`
- `AUTHLYN_REDIS_HOST`
- `AUTHLYN_REDIS_PORT`
- `AUTHLYN_JWT_ISSUER`
- `AUTHLYN_JWT_JWKS_PATH`
- `AUTHLYN_JWT_KID`
- `AUTHLYN_JWT_PRIVATE_KEY_PATH`
- `AUTHLYN_JWT_PUBLIC_KEY_PATH`
- `AUTHLYN_JWT_PRIVATE_KEY`
- `AUTHLYN_JWT_PUBLIC_KEY`
- `AUTHLYN_ACCESS_TOKEN_MINUTES`
- `AUTHLYN_REFRESH_TOKEN_DAYS`
- `AUTHLYN_BCRYPT_STRENGTH`

## Repository structure

- `src/main/java` - application source code
- `src/main/resources` - configuration and Flyway migrations
- `docker-compose.yml` - local Redis container
- `.env.example` - sample local environment variables
- `build.gradle` - Gradle build definition
- `.github/` - issue templates, pull request template, and code of conduct

## API notes

- `GET /.well-known/jwks.json` publishes the public signing key set.
- `GET /actuator/health` remains public for local checks.
- JWTs issued by Authlyn should use `AUTHLYN_JWT_ISSUER` as the `iss` claim.

## Contributing

Contributions are welcome. If you plan to submit changes, please:

1. Fork the repository
2. Create a feature branch
3. Keep changes focused
4. Run the Gradle test suite before opening a pull request
5. Read [`.github/CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md) before participating

## Roadmap

- Add RSA key management and JWKS endpoint
- Implement signup, login, logout, and refresh token rotation
- Add Redis-backed session and rate-limiting support
- Add immutable audit logging
- Add MFA and OIDC provider metadata endpoints

## License

This repository is licensed under the MIT License. See [`LICENSE`](LICENSE) for the full text.
