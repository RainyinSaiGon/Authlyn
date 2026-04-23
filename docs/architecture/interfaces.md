# Interfaces

This document is the canonical contract source for service ports, repository ports, provider adapters, and frontend client interfaces.

The contracts here are intentionally framework-agnostic and represent the expected boundaries between modules. They are written as pseudo-signatures and must be mapped to concrete Java/TypeScript code during implementation.

## 0. Global Contract Conventions

### 0.1 Naming and Layering

- Service ports: `*Service`
- Repository ports: `*Repository`
- External adapters: `*Client` or `*Provider`
- DTO/transport contracts: `*Request`, `*Response`
- Command/query objects: `*Command`, `*Query`

### 0.2 Core Primitive Types

```text
type UserId = UUID
type SessionId = UUID
type OrganizationId = UUID
type RefreshTokenId = UUID
type Instant = UTC timestamp
type EmailAddress = normalized lowercase email
type IpAddress = string
type UserAgent = string
```

### 0.3 Error Model (Domain-Level)

```text
ConflictError                # example: email already exists
ValidationError              # malformed or missing required input
AuthenticationError          # invalid credentials/token
AuthorizationError           # missing permission/scope
NotFoundError                # entity not found
RateLimitExceededError       # per-key limit exceeded
SecurityPolicyViolationError # anomaly, risk, or trust policy failure
```

### 0.4 Transaction and Idempotency Rules

- Mutating service methods own transaction boundaries.
- Repository methods are side-effect free except explicit writes.
- Public write APIs that may be retried should accept idempotency keys.
- Refresh-token rotation must be atomic.

### 0.5 Contract Change Policy

- Any signature change must update this file and `docs/architecture/api-endpoints.md` when externally visible.
- Backward compatibility is required for public API contracts unless a breaking change is explicitly approved.
- Contract additions should include task references in section status notes.

---

## 1. Shared Contracts

### 1.1 JWT Signing, Verification, and JWKS

```Java
interface JwtTokenService {
  String issueAccessToken(AccessTokenClaims claims, Duration ttl)
  DecodedAccessToken verifyAccessToken(String bearerToken)
}

interface JwksService {
  Map<String, Object> getPublicJwks()
  String currentKeyId()
}

record AccessTokenClaims(
  UserId userId,
  String subject,
  String issuer,
  Set<String> scopes,
  @Nullable OrganizationId organizationId,
  Map<String, Object> customClaims
)

record DecodedAccessToken(
  String tokenId,
  UserId userId,
  String subject,
  String issuer,
  Instant issuedAt,
  Instant expiresAt,
  Set<String> scopes,
  @Nullable OrganizationId organizationId,
  Map<String, Object> customClaims
)
```

### 1.2 Password and Secure Token Utilities

```Java
interface PasswordHasher {
  String hash(String rawPassword)
  boolean matches(String rawPassword, String storedHash)
  boolean needsRehash(String storedHash)
}

interface SecureTokenGenerator {
  String generateOpaqueToken(int bytes)
  String generateNumericCode(int digits)
  String sha256Fingerprint(String value)
}
```

### 1.3 Time and Identity Utilities

```Java
interface TimeProvider {
  Instant now()
}

interface IdGenerator {
  UUID newUuid()
}
```

### 1.4 Mail Delivery

```Java
interface MailService {
  void send(MailMessage message)
}

record MailMessage(
  EmailAddress to,
  String subject,
  String templateName,
  Map<String, Object> variables
)
```

### 1.5 Redis-Based Shared Stores

```Java
interface RateLimitStore {
  RateLimitState incrementAndGet(String key, Duration window, long limit)
  void reset(String key)
}

record RateLimitState(long count, Instant windowStart, long limit, boolean exceeded)

interface SessionCacheStore {
  void put(String key, String value, Duration ttl)
  Optional<String> get(String key)
  void delete(String key)
}
```

### 1.6 Audit Event Port

```Java
interface AuditEventPublisher {
  void publish(AuditEvent event)
}

record AuditEvent(
  String eventType,
  String actorType,
  String actorId,
  @Nullable OrganizationId organizationId,
  Map<String, Object> metadata,
  Instant occurredAt
)
```

---

## 2. Identity Module Contracts

### 2.1 Service Contracts

```java
interface SignupService {
  SignupResult signup(SignupCommand command)
}

interface LoginService {
  LoginResult login(LoginCommand command)
}

interface CurrentUserService {
  CurrentUserView getCurrentUser(CurrentUserQuery query)
}

interface RefreshService {
  RefreshResult rotate(RefreshCommand command)
}

interface LogoutService {
  void logout(LogoutCommand command)
  void logoutAll(LogoutAllCommand command)
}

interface PasswordResetService {
  void requestReset(PasswordResetRequestCommand command)
  void confirmReset(PasswordResetConfirmCommand command)
}
```

### 2.2 Identity Commands and Results

```java
record SignupCommand(EmailAddress email, String password, @Nullable String displayName, IpAddress ip, UserAgent userAgent)
record SignupResult(UserId userId, String accessToken, String refreshToken, Instant createdAt)

record LoginCommand(EmailAddress email, String password, IpAddress ip, UserAgent userAgent)
record LoginResult(UserId userId, SessionId sessionId, String accessToken, String refreshToken, Instant expiresAt)

record CurrentUserQuery(UserId userId)
record CurrentUserView(UserId userId, EmailAddress email, boolean emailVerified, @Nullable String displayName, Instant createdAt)

record RefreshCommand(String refreshToken, IpAddress ip, UserAgent userAgent)
record RefreshResult(String accessToken, String refreshToken, Instant accessTokenExpiresAt)

record LogoutCommand(UserId userId, SessionId sessionId)
record LogoutAllCommand(UserId userId)

record PasswordResetRequestCommand(EmailAddress email)
record PasswordResetConfirmCommand(String resetToken, String newPassword)
```

### 2.3 Repository Contracts

```java
interface UserRepository {
  Optional<UserEntity> findById(UserId userId)
  Optional<UserEntity> findByEmail(EmailAddress email)
  boolean existsByEmail(EmailAddress email)
  UserEntity save(UserEntity user)
  void updatePassword(UserId userId, String passwordHash, Instant updatedAt)
}

interface SessionRepository {
  SessionEntity create(SessionEntity session)
  Optional<SessionEntity> findById(SessionId sessionId)
  List<SessionEntity> findActiveByUserId(UserId userId)
  void updateLastSeen(SessionId sessionId, Instant lastSeenAt)
  void revoke(SessionId sessionId, Instant revokedAt, String reason)
  void revokeAllByUser(UserId userId, Instant revokedAt, String reason)
}

interface RefreshTokenRepository {
  RefreshTokenEntity create(RefreshTokenEntity token)
  Optional<RefreshTokenEntity> findByTokenHash(String tokenHash)
  void markUsed(RefreshTokenId tokenId, Instant usedAt)
  void revokeBySession(SessionId sessionId, Instant revokedAt, String reason)
  void revokeByUser(UserId userId, Instant revokedAt, String reason)
}
```

### 2.4 Identity Domain Invariants

- Email is unique and normalized.
- Password is never persisted in raw form.
- Refresh token is one-time use; rotation creates a new token and invalidates the previous one.
- Session revocation blocks refresh rotation for that session.

### 2.5 Controller-to-Service Mapping (Initial)

```text
POST /api/public/auth/signup   -> SignupService.signup
POST /api/public/auth/login    -> LoginService.login
GET  /api/me                   -> CurrentUserService.getCurrentUser
POST /api/public/auth/refresh  -> RefreshService.rotate
POST /api/auth/logout          -> LogoutService.logout
POST /api/auth/logout-all      -> LogoutService.logoutAll
POST /api/public/auth/password-reset/request -> PasswordResetService.requestReset
POST /api/public/auth/password-reset/confirm -> PasswordResetService.confirmReset
```

---

## 3. Federation Module Contracts

### 3.1 OAuth/OIDC Provider Adapters

```Java
interface OAuthProviderClient {
  AuthorizationRedirectUrl buildAuthorizationUrl(ProviderAuthorizationRequest request)
  ProviderTokenResponse exchangeCode(ProviderCodeExchangeRequest request)
  ProviderUserProfile fetchUserProfile(ProviderUserProfileRequest request)
}

record ProviderAuthorizationRequest(String provider, String state, String codeChallenge, String redirectUri, Set<String> scopes)
record ProviderCodeExchangeRequest(String provider, String code, String codeVerifier, String redirectUri)
record ProviderTokenResponse(String accessToken, @Nullable String idToken, @Nullable String refreshToken, Instant expiresAt)
record ProviderUserProfile(String providerSubject, @Nullable EmailAddress email, @Nullable String displayName, Map<String, Object> attributes)
```

### 3.2 OIDC and SAML Metadata

```Java
interface OidcMetadataService {
  OidcDiscoveryDocument getDiscoveryDocument()
  JwksDocument getJwksDocument()
  OidcUserInfo getUserInfo(UserId userId, Set<String> scopes)
}

interface SamlMetadataService {
  String getServiceProviderMetadataXml()
}
```

### 3.3 Federation Identity Linking

```Java
interface IdentityLinkService {
  LinkedIdentity linkIdentity(UserId userId, ExternalIdentity externalIdentity)
  Optional<LinkedIdentity> findByProviderAndSubject(String provider, String providerSubject)
  List<LinkedIdentity> listByUser(UserId userId)
  void unlinkIdentity(UserId userId, String provider, String providerSubject)
}
```

---

## 4. Organization Module Contracts

### 4.1 Organization and Membership Services

```Java
interface OrganizationService {
  OrganizationView create(CreateOrganizationCommand command)
  Optional<OrganizationView> getById(OrganizationId organizationId)
  List<OrganizationView> listByUser(UserId userId)
  OrganizationView update(UpdateOrganizationCommand command)
}

interface MembershipService {
  MembershipView addMember(AddMemberCommand command)
  void removeMember(RemoveMemberCommand command)
  List<MembershipView> listMembers(OrganizationId organizationId)
}
```

### 4.2 Role and Permission Services

```Java
interface RoleService {
  RoleView createRole(CreateRoleCommand command)
  RoleView updateRole(UpdateRoleCommand command)
  void deleteRole(DeleteRoleCommand command)
  List<RoleView> listRoles(OrganizationId organizationId)
}

interface PermissionService {
  Set<String> resolvePermissions(UserId userId, OrganizationId organizationId)
  boolean hasPermission(UserId userId, OrganizationId organizationId, String permission)
}
```

### 4.3 Repository Contracts

```Java 
interface OrganizationRepository {
  OrganizationEntity save(OrganizationEntity entity)
  Optional<OrganizationEntity> findById(OrganizationId organizationId)
  List<OrganizationEntity> findByMemberUserId(UserId userId)
}

interface MembershipRepository {
  MembershipEntity save(MembershipEntity entity)
  Optional<MembershipEntity> findByOrgAndUser(OrganizationId organizationId, UserId userId)
  List<MembershipEntity> listByOrg(OrganizationId organizationId)
  void delete(OrganizationId organizationId, UserId userId)
}
```

---

## 5. Platform Module Contracts

### 5.1 API Key Management

```java
interface ApiKeyService {
  CreatedApiKey create(CreateApiKeyCommand command)
  void revoke(RevokeApiKeyCommand command)
  ApiKeyView rotate(RotateApiKeyCommand command)
  List<ApiKeyView> listByOrganization(OrganizationId organizationId)
}

record CreatedApiKey(ApiKeyView key, String rawSecret)  // rawSecret returned only once
```

### 5.2 Webhooks

```java
interface WebhookService {
  WebhookView create(CreateWebhookCommand command)
  void delete(DeleteWebhookCommand command)
  List<WebhookView> list(OrganizationId organizationId)
  void dispatch(WebhookEvent event)
}

interface WebhookDeliveryService {
  DeliveryResult deliver(WebhookEndpoint endpoint, WebhookEvent event)
  void retryPending()
}
```

### 5.3 Audit and Admin APIs

```java
interface AuditLogQueryService {
  Page<AuditEventView> search(AuditQuery query)
}

interface AdminAuthService {
  AdminSession authenticate(AdminLoginCommand command)
  void revokeSession(String adminSessionId)
}
```

---

## 6. Frontend Client Contracts

### 6.1 Auth Client

```typescript
interface AuthApiClient {
  signup(request: SignupRequest): Promise<SignupResponse>
  login(request: LoginRequest): Promise<LoginResponse>
  refresh(request: RefreshRequest): Promise<RefreshResponse>
  logout(request: LogoutRequest): Promise<void>
  logoutAll(): Promise<void>
  me(): Promise<CurrentUserResponse>
}
```

### 6.2 Session Bootstrap

```typescript
interface SystemApiClient {
  getPublicMeta(): Promise<PublicMetaResponse>
}

interface PublicMetaResponse {
  appName: string
  status: string
  jwksPath: string
  architectureDoc: string
}
```

### 6.3 Self-Service Portal Contracts

```typescript
interface ProfileApiClient {
  getProfile(): Promise<ProfileResponse>
  updateProfile(request: UpdateProfileRequest): Promise<ProfileResponse>
  requestEmailChange(request: RequestEmailChangeRequest): Promise<void>
  requestPhoneChange(request: RequestPhoneChangeRequest): Promise<void>
}
```

---

## 7. Maturity Matrix and Ownership

| Section | Owner | Maturity | Source Task |
| --- | --- | --- | --- |
| Shared contracts | Backend platform | Baseline defined | 00-01 |
| Identity contracts | Identity module | Baseline defined | 00-01 / 01-01+ |
| Federation contracts | Identity + enterprise | Planned baseline | 00-01 |
| Organization contracts | Organization module | Planned baseline | 00-01 |
| Platform contracts | Platform module | Planned baseline | 00-01 |
| Frontend client contracts | Frontend + backend | Baseline defined | 00-01 |

## 8. Status

This file is the baseline detailed contract set for task `00-01`. Each implementation task must refine these pseudo-signatures into concrete code contracts without violating section-level invariants.
