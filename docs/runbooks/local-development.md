# Local Development Setup

This guide describes how to set up the Authlyn development environment locally.

## Prerequisites

- **Java 25** – Download from [oracle.com](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 20+** and **npm** – Download from [nodejs.org](https://nodejs.org/)
- **Docker Desktop** or equivalent – For Redis and optional PostgreSQL
- **PostgreSQL 18+** – Either via Docker Compose or Neon (cloud)
- **Git**

## Technology Stack

- **Backend**: Spring Boot 4.0.5, Gradle, PostgreSQL, Redis, JWT/JWKS, Flyway migrations
- **Frontend**: React, Vite, TypeScript
- **Infrastructure**: Docker Compose (local), Flyway (schema management)

## Database Setup

### Option 1: Local PostgreSQL (Docker)

Add to `docker-compose.yml` (optional, if you don't use cloud):

```yaml
postgres:
  image: postgres:18-alpine
  container_name: authlyn-postgres
  environment:
    POSTGRES_DB: authlyn
    POSTGRES_USER: authlyn
    POSTGRES_PASSWORD: authlyn_dev_password
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U authlyn"]
    interval: 10s
    timeout: 3s
    retries: 5

volumes:
  postgres_data:
```

Then:

```bash
docker compose up -d postgres
```

**Connection string**:

```text
jdbc:postgresql://localhost:5432/authlyn
User: authlyn
Password: authlyn_dev_password
```

### Option 2: Cloud PostgreSQL (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a project and database
3. Copy the connection string (it will have the format `postgresql://user:password@host/database`)

**Advantage**: No local infrastructure needed; connection pooling included.

## Redis Setup

Redis is used for session and token state. Start it via Docker Compose:

```bash
docker compose up -d redis
```

This starts Redis on `localhost:6379` (default).

## Environment Configuration

### 1. Create `.env` file

Copy the example and fill in your database credentials:

```bash
cp .env.example .env
```

### 2. `.env` Template

```env
# Database
AUTHLYN_DB_URL=jdbc:postgresql://localhost:5432/authlyn
AUTHLYN_DB_USERNAME=authlyn
AUTHLYN_DB_PASSWORD=authlyn_dev_password

# Redis
AUTHLYN_REDIS_HOST=localhost
AUTHLYN_REDIS_PORT=6379
AUTHLYN_REDIS_PASSWORD=

# JWT/Security
AUTHLYN_JWT_ISSUER=http://localhost:8080
AUTHLYN_ACCESS_TOKEN_MINUTES=15
AUTHLYN_REFRESH_TOKEN_DAYS=30
AUTHLYN_BCRYPT_STRENGTH=12

# Frontend
AUTHLYN_ALLOWED_ORIGINS=http://localhost:5173

# Mail (MailHog for local dev)
AUTHLYN_MAIL_HOST=localhost
AUTHLYN_MAIL_PORT=1025
AUTHLYN_MAIL_SMTP_AUTH=false
AUTHLYN_MAIL_STARTTLS=false
```

**Note**: Never commit `.env` to version control. `.gitignore` already excludes it.

## Running the Backend

### 1. Start Infrastructure

```powershell
# Start Redis (and optionally PostgreSQL if using Docker)
docker compose up -d
```

### 2. Run Spring Boot Application

```powershell
# Windows
.\gradlew.bat bootRun

# macOS/Linux
./gradlew bootRun
```

The backend runs on `http://localhost:8080` by default.

### 3. Verify Backend is Running

```bash
curl http://localhost:8080/actuator/health
```

Expected response:

```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "redis": { "status": "UP" }
  }
}
```

## Running the Frontend

### 1. Install Dependencies

```powershell
cd frontend
npm install
```

### 2. Start Development Server

```powershell
npm run dev
```

Frontend runs on `http://localhost:5173` (Vite default).

### 3. Build for Production

```powershell
npm run build
npm run preview
```

## Running Tests

### Backend Unit Tests

```bash
# Run all tests
./gradlew test

# Run a specific test class
./gradlew test --tests AuthServiceTest

# Run a specific test method
./gradlew test --tests AuthServiceTest.testLoginSuccess
```

### Backend Integration Tests (with Testcontainers)

Tests marked with `@Integration` or using Testcontainers will automatically spin up containerized dependencies (PostgreSQL, Redis) and clean them up after.

For details on test structure and naming conventions, see [Testing Baseline](./testing-baseline.md).

### Frontend Unit Tests (Future)

Frontend testing strategy is documented in [Testing Baseline](./testing-baseline.md). Test runners and configuration will be added during phase 01-02.

## Debugging

### Backend Debugging

Enable debug mode:

```powershell
# macOS/Linux
JAVA_DEBUG_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005" ./gradlew bootRun

# Windows PowerShell
$env:JAVA_DEBUG_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
.\gradlew.bat bootRun
```

Then attach your IDE debugger to `localhost:5005`.

### Viewing Logs

Backend logs are sent to `stdout` by default. To enable file logging, add to `application.yml`:

```yaml
logging:
  level:
    com.authlyn: DEBUG
  file:
    name: logs/authlyn.log
```

### Inspecting Database

Connect with any PostgreSQL client:

```bash
psql postgresql://authlyn:authlyn_dev_password@localhost:5432/authlyn
```

View pending Flyway migrations:

```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 10;
```

### Inspecting Redis

```bash
redis-cli
> ping
PONG
> keys *
> get <key>
```

Or use a UI tool like [RedisInsight](https://redis.com/redisinsight/).

## Common Issues

### PostgreSQL Connection Refused

**Symptom**: `org.postgresql.util.PSQLException: Connection to localhost:5432 refused`

**Solution**:

1. Check if PostgreSQL is running: `docker ps | grep postgres`
2. Check connection string in `.env`
3. Verify credentials are correct

### Redis Connection Refused

**Symptom**: `io.lettuce.core.RedisConnectionException: Unable to connect`

**Solution**:

1. Check if Redis is running: `docker ps | grep redis`
2. Check `AUTHLYN_REDIS_HOST` and `AUTHLYN_REDIS_PORT` in `.env`
3. Restart Redis: `docker compose restart redis`

### Flyway Migration Failure

**Symptom**: `org.flywaydb.core.api.FlywayException: Validate failed`

**Solution**:

1. Check pending migrations: `docker compose logs postgres` (or check PostgreSQL logs)
2. Review migration scripts in `src/main/resources/db/migration/`
3. If schema is corrupted, drop and recreate the database (backup first!):

   ```sql
   DROP DATABASE authlyn;
   CREATE DATABASE authlyn;
   ```

   Then restart the application to re-run migrations.

### Tests Fail with "Cannot find Docker Daemon"

**Symptom**: Testcontainers integration tests fail with Docker socket error

**Solution**:

1. Ensure Docker Desktop is running
2. Ensure Docker socket is accessible: `docker ps`
3. For WSL2 (Windows): Docker Desktop must be configured to support WSL2 integration

## IDE Setup

### IntelliJ IDEA

1. **Import Project**: `File` → `Open` → Select `build.gradle`
2. **Configure JDK**: `File` → `Project Structure` → `Project` → Set JDK 25
3. **Run Configuration**:
   - Click `Run` → `Edit Configurations`
   - Select `bootRun` or create a Gradle run config
   - Add VM options: `-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005` (for debugging)

### VS Code

1. **Install extensions**:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - REST Client
2. **Open folder**: `code .`
3. **Run backend**: Terminal → Run Task → `gradle: bootRun`

## Cleanup

### Stop All Services

```bash
docker compose down
```

### Full Reset (Database/Redis)

```bash
docker compose down -v  # -v removes volumes
docker compose up -d
```

### Clean Gradle Cache

```bash
./gradlew clean
```

## Next Steps

- Review [Testing Baseline](./testing-baseline.md) to understand test structure and conventions
- Review [Architecture](../architecture/README.md) to understand module contracts
- Check [Repository Layout](../README.md) for documentation organization
