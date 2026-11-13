package com.authlyn.shared.security.oauth2;

import com.authlyn.modules.identity.domain.IdentityEntity;
import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.repository.IdentityJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.modules.identity.service.OAuthLoginCodeService;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Completes a social (OAuth2/OIDC) login.
 *
 * <p>Account resolution rules, in order:
 * <ol>
 *   <li>A known (provider, provider user id) identity signs in as the user it is linked to.</li>
 *   <li>Otherwise, a provider email is used only if the provider marks it verified
 *       ({@code email_verified=true}). It links to an existing account only when that account's
 *       email is verified too; any other match is refused, because silently linking on email lets
 *       anyone who registers the victim's address at a provider take over the account.</li>
 *   <li>Otherwise a new account is created. An unverified provider email is not copied onto it,
 *       so it cannot squat an address the real owner may sign up with later.</li>
 * </ol>
 *
 * <p>The browser is redirected back with a one-time {@code code} (see {@link OAuthLoginCodeService}),
 * never with tokens in the URL.
 */
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    static final String ERROR_ACCOUNT_LINK_REQUIRED = "account_link_required";
    static final String ERROR_ACCOUNT_DISABLED = "account_disabled";

    private final UserJpaRepository userJpaRepository;
    private final IdentityJpaRepository identityJpaRepository;
    private final SessionJpaRepository sessionJpaRepository;
    private final OAuthLoginCodeService loginCodeService;
    private final AuthlynJwtProperties jwtProperties;
    private final String redirectUri;

    public OAuth2LoginSuccessHandler(
            UserJpaRepository userJpaRepository,
            IdentityJpaRepository identityJpaRepository,
            SessionJpaRepository sessionJpaRepository,
            OAuthLoginCodeService loginCodeService,
            AuthlynJwtProperties jwtProperties,
            @Value("${authlyn.web.oauth2-redirect-uri:http://localhost:5173/oauth/callback}") String redirectUri) {
        this.userJpaRepository = userJpaRepository;
        this.identityJpaRepository = identityJpaRepository;
        this.sessionJpaRepository = sessionJpaRepository;
        this.loginCodeService = loginCodeService;
        this.jwtProperties = jwtProperties;
        this.redirectUri = redirectUri;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();

        String provider = oauthToken.getAuthorizedClientRegistrationId();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String providerUserId = resolveProviderUserId(attributes);
        String providerEmail = resolveEmail(attributes);
        boolean providerEmailVerified = providerEmail != null && isEmailVerified(attributes);

        Optional<IdentityEntity> existingIdentity =
                identityJpaRepository.findByProviderAndProviderUserId(provider, providerUserId);

        UserEntity user;
        if (existingIdentity.isPresent()) {
            user = userJpaRepository.findById(existingIdentity.get().getUserId()).orElse(null);
            if (user == null || user.getDeletedAt() != null) {
                redirectWithError(response, ERROR_ACCOUNT_DISABLED);
                return;
            }
        } else {
            Optional<UserEntity> linked = resolveUserForNewIdentity(providerEmail, providerEmailVerified);
            if (linked.isEmpty()) {
                redirectWithError(response, ERROR_ACCOUNT_LINK_REQUIRED);
                return;
            }
            user = linked.get();
            createIdentity(provider, providerUserId, providerEmail, user.getId());
        }

        Instant now = Instant.now();
        SessionEntity session = new SessionEntity();
        session.setId(UUID.randomUUID());
        session.setUserId(user.getId());
        session.setCreatedAt(now);
        session.setLastSeenAt(now);
        session.setExpiresAt(now.plusSeconds(jwtProperties.getRefreshTokenDays() * 86400L));
        sessionJpaRepository.save(session);

        String code = loginCodeService.issueCode(user.getId(), session.getId());
        String callbackUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("code", code)
                .toUriString();
        response.sendRedirect(callbackUrl);
    }

    /**
     * Returns the account a brand-new provider identity should attach to, or empty when the
     * login must be refused because it would silently link onto an account it cannot prove it owns.
     */
    private Optional<UserEntity> resolveUserForNewIdentity(String providerEmail, boolean providerEmailVerified) {
        if (!providerEmailVerified) {
            if (providerEmail != null
                    && userJpaRepository.findByEmail(providerEmail.toLowerCase(Locale.ROOT)).isPresent()) {
                // Unverified email that matches an existing account: never link, never duplicate.
                return Optional.empty();
            }
            return Optional.of(createUser(null, false));
        }

        String normalizedEmail = providerEmail.toLowerCase(Locale.ROOT);
        Optional<UserEntity> existing = userJpaRepository.findByEmail(normalizedEmail);
        if (existing.isEmpty()) {
            return Optional.of(createUser(normalizedEmail, true));
        }

        UserEntity account = existing.get();
        if (account.getDeletedAt() != null || !account.isEmailVerified()) {
            // The local account never proved ownership of this address; linking would hand it to
            // whoever controls the provider account. The owner must sign in and link explicitly.
            return Optional.empty();
        }
        return Optional.of(account);
    }

    private void redirectWithError(HttpServletResponse response, String error) throws IOException {
        response.sendRedirect(UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("error", error)
                .toUriString());
    }

    private String resolveProviderUserId(Map<String, Object> attributes) {
        if (attributes.containsKey("sub")) {
            return attributes.get("sub").toString();
        }
        if (attributes.containsKey("id")) {
            return attributes.get("id").toString();
        }
        throw new IllegalStateException("Cannot resolve provider user ID: neither 'sub' nor 'id' attribute present");
    }

    private String resolveEmail(Map<String, Object> attributes) {
        Object email = attributes.get("email");
        if (email == null || email.toString().isBlank()) {
            return null;
        }
        return email.toString().strip();
    }

    /**
     * OIDC providers (Google, Microsoft) send {@code email_verified}. Providers that do not
     * (for example GitHub's {@code /user} endpoint) are treated as unverified.
     */
    static boolean isEmailVerified(Map<String, Object> attributes) {
        Object verified = attributes.get("email_verified");
        if (verified instanceof Boolean b) {
            return b;
        }
        if (verified instanceof String s) {
            return Boolean.parseBoolean(s);
        }
        return false;
    }

    private UserEntity createUser(String email, boolean emailVerified) {
        Instant now = Instant.now();
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(email != null ? email : "");
        user.setEmailVerified(email != null && emailVerified);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return userJpaRepository.save(user);
    }

    private void createIdentity(String provider, String providerUserId, String providerEmail, UUID userId) {
        IdentityEntity identity = new IdentityEntity();
        identity.setId(UUID.randomUUID());
        identity.setUserId(userId);
        identity.setProvider(provider);
        identity.setProviderUserId(providerUserId);
        identity.setProviderEmail(providerEmail);
        identity.setProfile("{}");
        identity.setCreatedAt(Instant.now());
        identityJpaRepository.save(identity);
    }
}
