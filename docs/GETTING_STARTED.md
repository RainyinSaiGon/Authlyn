# Getting Started

This is the quickest path to contributing to Authlyn.

## 1. Set Up Your Local Environment (5-10 min)

Follow [Local Development Setup](./runbooks/local-development.md):

- Install Java 25, Node.js 20+, Docker
- Clone the repo and copy `.env.example` to `.env`
- Start Redis: `docker compose up -d`
- Run backend: `./gradlew bootRun`
- Run frontend: `cd frontend && npm run dev`

**Verify**: Open [http://localhost:5173](http://localhost:5173) → should see app homepage

## 2. Understand the Code Structure (10-15 min)

- **[Architecture Overview](./architecture/README.md)** – Module structure and contracts
- **[Module Breakdown](../ARCHITECTURE.md)** – Backend layers and naming conventions
- **[Database Schema](./architecture/database.md)** – Table ownership and constraints

**Key principle**: Code must match contracts defined in `/docs/architecture/`. If something doesn't match, update the contract first.

## 3. Learn Testing Conventions (10 min)

- **[Testing Baseline](./tests/testing-baseline.md)** – Test structure, naming, when to use each type
- **[Test Strategy](./tests/strategy.md)** – Coverage targets and execution matrix

**Quick reference**:

- Unit tests: Single component, no external deps (Tier 1 priority: identity)
- Integration tests: Database/Redis/HTTP endpoints (use Testcontainers)
- E2E tests: Full user journeys (future phases)

## 4. Understand Development Conventions (5 min)

- **[Contract Governance](./dev/contract-governance.md)** – What's source of truth, how to change contracts
- **[API Endpoints](./architecture/api-endpoints.md)** – HTTP contract and request/response formats
- **[State Machines](./architecture/state-machine.md)** – Entity lifecycle states and transitions

**Key principle**: Code changes must update contracts first, then tests validate compliance.

## 5. Pick a Task and Contribute (Ongoing)

1. Find a task in [Phase Roadmap](./tasks/README.md)
2. Create a feature branch: `git checkout -b feature/issue-{N}-{description}`
3. Make your changes
4. Write/update tests
5. Update architecture docs as needed
6. Create a pull request

**References while coding**:
- Task checklist (in `/docs/tasks/`)
- Architecture contracts (in `/docs/architecture/`)
- Testing conventions (in `/docs/tests/`)
- Common issues? Check [Local Development Troubleshooting](./runbooks/local-development.md#common-issues)

## Directory Quick Reference

| What | Where |
| --- | --- |
| Local setup, troubleshooting | `docs/runbooks/local-development.md` |
| Test structure & naming | `docs/tests/testing-baseline.md` |
| Coverage targets | `docs/tests/strategy.md` |
| API contract (HTTP) | `docs/architecture/api-endpoints.md` |
| Service interfaces | `docs/architecture/interfaces.md` |
| Entity lifecycles | `docs/architecture/state-machine.md` |
| Database schema | `docs/architecture/database.md` |
| Module structure | `ARCHITECTURE.md` |
| Task checklist | `docs/tasks/` |
| Development rules | `docs/dev/contract-governance.md` |

## Common Next Steps

**First-time contributor?**
- Start with task [00-02 Local Development Baseline](./tasks/00-02-local-dev-and-testing-baseline.md) if not completed
- Then read [00-03 Backend Rebuild](./tasks/00-03-backend-rebuild-from-clean-scaffold.md)

**Adding a new feature?**
1. Check [Phase Roadmap](./tasks/README.md) for task description
2. Update architecture docs (interfaces, API endpoints, database, state machines)
3. Implement code to match contracts
4. Write tests to validate contracts
5. Create PR and reference the task

**Debugging an issue?**
1. Check [Troubleshooting](./runbooks/local-development.md#common-issues)
2. Review error stack trace against [Architecture](./architecture/README.md)
3. Check test patterns in `src/test/java/com/authlyn/`

## Questions?

- See [Contract Governance Q&A](./dev/contract-governance.md#questions-and-edge-cases)
- Check task descriptions in `docs/tasks/` for phase-specific details
- Review architecture docs for module responsibilities
