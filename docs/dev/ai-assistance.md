# AI-Assisted Development

This document records which parts of Authlyn were built with AI tooling, which were hand-written, and how the estimated delivery speedup was calculated. It exists so the claim can be evaluated rather than taken on faith.

## Tools Used

- **Claude Code (Anthropic)** — primary tool. Used for scaffolding boilerplate, exploring Spring Boot 4 API changes, generating test stubs, and writing repetitive entity/DTO/repository triads.
- **GitHub Copilot** — secondary, used inline during editor sessions for completion of method bodies, import resolution, and Gradle dependency lookups.

---

## What Was AI-Assisted

### High AI involvement — scaffolding and boilerplate

| Area | What AI did | Human review |
|---|---|---|
| JPA entity + repository triads (14 entities: users, sessions, refresh tokens, orgs, members, roles, permissions, identities, etc.) | Generated field declarations, column mappings, getter/setter bodies | Verified column names against migration SQL, corrected nullability |
| DTO records with Jakarta validation annotations (SignupRequest, LoginRequest, OrgRequest, etc.) | Drafted record fields and constraint annotations | Adjusted constraints, added `@StrongPassword` custom annotation |
| Test stub structure (service unit tests, integration test `@BeforeEach` setup) | Generated mock wiring and `when(...)` boilerplate | Wrote all assertion logic and edge case test bodies |
| Spring Boot 4 migration patterns (OAuth2 resource server, NimbusJwtDecoder wiring) | Provided Spring Boot 4 API variants (Spring Boot 3 syntax differs) | Verified against Spring Security 6 docs |
| Flyway migration SQL for orgs/roles/permissions tables | Generated initial DDL from entity descriptions | Audited referential integrity, added missing indexes |

**Estimated AI contribution: ~60–70% of lines in these areas.** These are non-security-critical and highly repetitive.

### Moderate AI involvement — logic with human oversight

| Area | What AI did | Human decision |
|---|---|---|
| `RsaKeyService` strategy pattern | Suggested extracting `RsaKeyMaterialSource` interface; generated `InlinePemKeyMaterialSource` and `SpringResourceKeyMaterialSource` | Designed priority ordering; decided FallbackResource must be last |
| `LoginRateLimitFilter` (Bucket4j) | Generated filter skeleton with `OncePerRequestFilter` | Chose per-IP keying, 10/15-min window, `X-Forwarded-For` trust |
| `StrongPasswordValidator` | Generated regex pattern constants | Added null-pass-through contract; kept @NotBlank separate |
| `OAuth2LoginSuccessHandler` | Generated find-or-create user/identity skeleton | Designed session issuance to match LoginService contract; handled null email edge case |
| `OrgService` / `RoleService` | Generated CRUD scaffolding | Designed admin-gate check pattern; chose 409 over 403 for duplicate members |

**Estimated AI contribution: ~30–40% of logic in these areas.** Human decisions drove the contract design.

### Hand-written — security-critical or architecturally significant

These were not AI-generated. They involve invariants where a subtle mistake creates a real vulnerability.

| Component | Why hand-written |
|---|---|
| `RefreshService.rotate()` — reuse detection, family revocation, atomicity | Token replay is a security invariant. The `replaced_by_token_id` chain and family revocation logic required explicit design. |
| `JwtSessionStateValidator` — Redis blacklist check on every authenticated request | Two-layer validation (sig + revocation) wiring required understanding the Spring Security delegate chain. |
| `RsaKeyService.measureCrtSpeedup()` — non-CRT key reconstruction and throughput comparison | Required knowing that `RSAPrivateKeySpec` strips CRT params; understanding JCA provider dispatch. |
| `PasswordResetService.confirmReset()` — token one-time use, session revocation cascade | Multiple interacting invariants: used-at guard, revoked-at guard, expiry, then revoke all sessions. |
| `SecurityConfig` — conditional `oauth2Login()` wiring | Needed `Optional<ClientRegistrationRepository>` injection to avoid startup failure with no providers configured. |
| Refresh token grace period (5-second window) | Design decision with tradeoffs — required understanding the clock-skew/retry race pattern. |

---

## Time Estimate Methodology

The 40% figure is not a precise measurement. It is an order-of-magnitude estimate based on tracking time on individual task categories:

| Task type | Estimated manual time | Actual time with AI | Ratio |
|---|---|---|---|
| Entity + repository triads (14 pairs) | ~5 hours | ~1.5 hours | 3.3× |
| DTO + validation records (18 DTOs) | ~2 hours | ~45 minutes | 2.7× |
| Test stubs and @BeforeEach wiring | ~3 hours | ~1.5 hours | 2× |
| Spring Boot 4 API lookup and config wiring | ~4 hours | ~1 hour | 4× |
| **Total scaffolding** | **~14 hours** | **~5 hours** | **~2.8×** |
| Security-critical logic (above table) | ~8 hours | ~8 hours (no AI) | 1× |
| **Combined** | **~22 hours** | **~13 hours** | **~1.7×** |

A 1.7× speedup is ~40% elapsed time saved (1 − 1/1.7 ≈ 41%). The estimate is conservative — it excludes debugging time introduced by AI-generated code that needed correction.

---

## What the 40% Does Not Mean

- It does not mean the security logic was reviewed less carefully. The hand-written sections had no AI involvement precisely because the cost of a subtle bug is higher than the time saved.
- It does not mean the AI output was merged without review. All AI-generated boilerplate was read line-by-line and frequently corrected (wrong column names, missing nullability annotations, incorrect Spring Boot 4 API calls).
- It does not mean the architecture was AI-designed. Domain decisions (rotation contract, strategy pattern ordering, conditional OAuth2 wiring) were made by the developer and then scaffolded with AI assistance.
