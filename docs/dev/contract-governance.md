# Contract Governance

This document clarifies what counts as the "source of truth" for Authlyn's system contracts and how contracts evolve with the codebase.

## Sources of Truth

### Architecture Contracts (Primary Source)

The following files are the **canonical, authoritative definitions** of system contracts:

1. **`docs/architecture/interfaces.md`** – Service ports, repositories, adapters, DTOs
   - Defines what each module exports
   - Framework-agnostic pseudo-signatures
   - **Owned by**: Architecture team or cross-module leads
   - **Updated when**: Adding new service methods, changing signatures, modifying DTO fields
   - **Synchronization**: Implementation tasks MUST refine contracts here before coding

2. **`docs/architecture/api-endpoints.md`** – HTTP request/response contracts
   - Defines external API surface and semantics
   - Request/response examples, auth modes, error behavior
   - **Owned by**: Backend platform team
   - **Updated when**: Adding endpoints, changing request/response structure, modifying error codes
   - **Synchronization**: Controller implementation must match endpoint contracts

3. **`docs/architecture/database.md`** – PostgreSQL schema contracts
   - Table definitions, ownership by module, constraints, indexes
   - Flyway migration references
   - **Owned by**: Database architecture team
   - **Updated when**: Adding tables, modifying constraints or indexes, changing column definitions
   - **Synchronization**: New migrations MUST be documented here and match schema contract

4. **`docs/architecture/state-machine.md`** – Entity lifecycle state models
   - Entity states, transition events, guards, invariants
   - **Owned by**: Domain module owners
   - **Updated when**: Adding new states, events, or transition rules
   - **Synchronization**: Service methods MUST respect state machine contracts

5. **`ARCHITECTURE.md`** – Module structure, layering, naming conventions
   - Backend module organization (`modules.identity`, `modules.organization`, etc.)
   - Naming conventions, refactoring roadmap
   - **Owned by**: Architecture team
   - **Updated when**: Restructuring modules, modifying conventions
   - **Synchronization**: New modules MUST follow structure defined here

### Implementation (Secondary, Derived Source)

Code is the **instantiation** of contracts, not the source of truth:

- If code conflicts with architecture docs, **the docs are correct**
- Code changes MUST be accompanied by contract updates
- Code review MUST validate that implementation matches contract

**Example**: If an API response format is not documented in `api-endpoints.md`, that's a contract gap. Document it first (or argue for changing the response), then implement.

### Test Contracts (Tertiary, Validation Source)

Tests validate that code meets contract expectations:

- Tests are **not** a source of truth (they validate truth)
- Changes to test expectations MUST be justified by contract changes
- Failing tests indicate either a contract violation or a contract gap that needs documenting

**Example**: If a test assumes `User.email` is unique, but that constraint is not in `database.md`, add it to the contract before changing the test.

## Contract Change Process

### Adding a New Contract

1. **Propose** in architecture doc (e.g., new service method in `interfaces.md`)
2. **Justify** – why is this needed? What feature/task depends on it?
3. **Review** – get approval from affected module owners
4. **Implement** – write code to match contract
5. **Test** – verify contract is upheld
6. **Document** – add/update related docs (database.md, api-endpoints.md, state-machine.md as needed)

### Modifying an Existing Contract

1. **Identify impact** – what code/tests/systems depend on this contract?
2. **Propose change** – document why modification is necessary
3. **Update docs** – modify contract in architecture files
4. **Update code** – refactor implementation to match
5. **Update tests** – adjust expectations to new contract
6. **Migration** – plan any necessary data/schema migrations

### Removing a Contract

1. **Deprecation phase** – mark as deprecated, plan removal
2. **Notify** – communicate removal to dependent systems
3. **Migrate** – give consumers time to update code
4. **Remove** – delete contract and update docs

## Contract Evolution Across Phases

### Phase 00 (Baseline)

Contracts are **skeletal** – enough to define interfaces and basic flows, but not exhaustively detailed.

- All core interfaces defined
- HTTP endpoint signatures
- Database schema
- State machines for critical entities

### After Phase 12 (Maintenance)

Contracts are **stable but evolving**:

- Changes require higher scrutiny
- Backward compatibility is expected
- Performance and security implications are considered

## Synchronization: Docs ↔ Code

### During Development

**When you're coding**:

1. Check the architecture doc for the contract
2. If contract is missing or unclear, propose a change
3. Get agreement on the contract
4. Implement to match contract
5. If you find gaps while coding, **update the contract FIRST**, then update code

**When you're reviewing**:

1. Check that code matches contracts
2. If code doesn't match, request either code fix or contract update
3. Ensure tests validate contract compliance

### When .gitignore or Generated Files Change

The following are **generated/ignorable**, not part of contracts:

- Build outputs: `build/`, `dist/`, `target/`
- Dependencies: `node_modules/`, `.gradle/`
- IDE files: `.idea/`, `.vscode/`, `*.iml`
- Logs and artifacts: `logs/`, `*.log`
- Environment: `.env` (but `.env.example` is tracked)

**Source of truth for generated content**: Build scripts, dependency manifests (`build.gradle`, `package.json`)

### Confirming .gitignore Coverage

**Current baseline** (phase 00-02):

- Gradle build artifacts
- Spring Boot compiled classes
- IDE and OS files
- Node.js dependencies and build outputs
- Environment files (.env excluded, .env.example included)
- Runtime logs
- Agent/tool files (.agents/, .claude/)  

**Verified**: `git status` shows only source files (Java, TypeScript, YAML, Markdown, config templates)

## Questions and Edge Cases

### Q: What if the code is "right" but the contract is "wrong"?

**A**: Update the contract! Contracts can be wrong too. If you find a better approach:

1. Propose the contract change
2. Get agreement
3. Update code to match new contract
4. Document the change rationale

### Q: What if a feature needs to violate a contract?

**A**: That's a design problem. Either:

1. Update the contract to allow the new behavior, OR
2. Find an alternative approach that respects the contract

Contracts exist to prevent accidental breakage and enable safe refactoring.

### Q: How do we handle breaking changes?

**A**: Plan for them in the contract, with:

- Deprecation notices in the architecture doc
- Multiple versions or feature flags in code
- Migration guide in documentation
- Retirement date

### Q: Who approves contract changes?

**A**: Depends on scope:

- **Internal module contract**: Module owner
- **Cross-module interface**: Module owners + platform architect
- **Public API**: Platform team lead + security review

## References

- [Architecture Docs](../architecture/index.md)
- [Module Structure](../../ARCHITECTURE.md)
- [Phase Roadmap](../tasks/README.md)
