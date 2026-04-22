# Docs Index

This folder contains living documentation for Authlyn.

## Quick Start for New Developers

1. **Set up locally**: [Local Development Setup](./runbooks/local-development.md)
   - Install: Java 25, Node.js 20+, Docker
   - Run: `docker compose up -d`, `./gradlew bootRun`, `cd frontend && npm run dev`

2. **Understand the code**: [Architecture Overview](./architecture/README.md) and [Module Structure](../ARCHITECTURE.md)

3. **Learn testing**: [Testing Baseline](./tests/testing-baseline.md) and [Test Strategy](./tests/strategy.md)

4. **Development rules**: [Contract Governance](./dev/contract-governance.md) (code must match contracts)

5. **Find a task**: [Phase Roadmap](./tasks/README.md)

---

## Documentation by Role

| I want to... | Start here |
| --- | --- |
| **Set up my environment** | [Local Development Setup](./runbooks/local-development.md) |
| **Understand the architecture** | [Architecture Overview](./architecture/index.md) + [ARCHITECTURE.md](../ARCHITECTURE.md) |
| **Write or run tests** | [Testing Baseline](./tests/testing-baseline.md) |
| **Find a task to work on** | [Phase Roadmap](./tasks/README.md) |
| **Understand what code must match** | [Contract Governance](./dev/contract-governance.md) |
| **Check API contracts** | [API Endpoints](./architecture/api-endpoints.md) |
| **Understand entity lifecycles** | [State Machines](./architecture/state-machine.md) |
| **Debug an issue** | [Troubleshooting](./runbooks/local-development.md#common-issues) |

## Full Documentation Map

- **[Developer Guides](./dev/README.md)** – Development rules and contract governance
- **[Architecture](./architecture/index.md)** – System design, interfaces, database, state machines
- **[Tasks](./tasks/README.md)** – Implementation roadmap organized by phase
- **[Tests](./tests/index.md)** – Test strategy, structure, naming, templates
- **[Runbooks](./runbooks/index.md)** – Setup, release, incident procedures
- **[Features](./features/index.md)** – Feature design documents
- **[Design](./design/index.md)** – Design decisions and ADRs
- **[Status](./status/pre_release_checklist.md)** – Release checklist
- **[User Manual](./user-manual/index.md)** – End-user guides
- **[Workflows](./workflows/index.md)** – Team processes
- **[Use Cases](./UC/index.md)** – User stories

---

## Documentation Principles

- **Keep docs lightweight** – Add details as implementation stabilizes
- **Link instead of duplicate** – Reference source files and tasks, don't repeat them
- **Contracts first** – Architecture docs are source of truth; code must match
- **Update as you code** – When contracts change, update docs first, then code
