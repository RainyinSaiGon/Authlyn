package com.authlyn.shared.security.oauth2;

import com.authlyn.modules.identity.domain.IdentityEntity;
import com.authlyn.modules.identity.domain.RefreshTokenEntity;
import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.repository.IdentityJpaRepository;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.security.TokenUtil;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import com.authlyn.shared.security.jwt.JwtTokenService;
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
import java.util.Map;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserJpaRepository userJpaRepository;
    private final IdentityJpaRepository identityJpaRepository;
    private final SessionJpaRepository sessionJpaRepository;
    private final RefreshTokenJpaRepository refreshTokenJpaRepository;
    private final JwtTokenService jwtTokenService;
    private final AuthlynJwtProperties jwtProperties;
    private final String redirectUri;

    public OAuth2LoginSuccessHandler(
            UserJpaRepository userJpaRepository,
            IdentityJpaRepository identityJpaRepository,
            SessionJpaRepository sessionJpaRepository,
            RefreshTokenJpaRepository refreshTokenJpaRepository,
            JwtTokenService jwtTokenService,
            AuthlynJwtProperties jwtProperties,
            @Value("${authlyn.web.oauth2-redirect-uri:http://localhost:5173/oauth/callback}") String redirectUri) {
        this.userJpaRepository = userJpaRepository;
        this.identityJpaRepository = identityJpaRepository;
        this.sessionJpaRepository = sessionJpaRepository;
        this.refreshTokenJpaRepository = refreshTokenJpaRepository;
        this.jwtTokenService = jwtTokenService;
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

        UserEntity user = findOrCreateUser(providerEmail);
        findOrCreateIdentity(provider, providerUserId, providerEmail, user.getId());

        Instant now = Instant.now();
        Instant sessionExpiry = now.plusSeconds(jwtProperties.getRefreshTokenDays() * 86400L);

        SessionEntity session = new SessionEntity();
        session.setId(UUID.randomUUID());
        session.setUserId(user.getId());
        session.setCreatedAt(now);
        session.setLastSeenAt(now);
        session.setExpiresAt(sessionExpiry);
        sessionJpaRepository.save(session);

        String rawRefreshToken = TokenUtil.generateOpaqueToken();

        RefreshTokenEntity refreshToken = new RefreshTokenEntity();
        refreshToken.setId(UUID.randomUUID());
        refreshToken.setUserId(user.getId());
        refreshToken.setSessionId(session.getId());
        refreshToken.setTokenHash(TokenUtil.sha256Hex(rawRefreshToken));
        refreshToken.setIssuedAt(now);
        refreshToken.setExpiresAt(sessionExpiry);
        refreshTokenJpaRepository.save(refreshToken);

        String accessToken = jwtTokenService.issueAccessToken(user.getId(), session.getId());

        String callbackUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("access_token", accessToken)
                .queryParam("refresh_token", rawRefreshToken)
                .queryParam("session_id", session.getId().toString())
                .toUriString();

        response.sendRedirect(callbackUrl);
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
        return email != null ? email.toString() : null;
    }

    private UserEntity findOrCreateUser(String email) {
        if (email != null) {
            String normalizedEmail = email.toLowerCase();
            return userJpaRepository.findByEmail(normalizedEmail)
                    .orElseGet(() -> createUser(normalizedEmail));
        }
        return createUser(null);
    }

    private UserEntity createUser(String email) {
        Instant now = Instant.now();
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(email != null ? email : "");
        user.setEmailVerified(true);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return userJpaRepository.save(user);
    }

    private void findOrCreateIdentity(String provider, String providerUserId, String providerEmail, UUID userId) {
        identityJpaRepository.findByProviderAndProviderUserId(provider, providerUserId)
                .orElseGet(() -> {
                    IdentityEntity identity = new IdentityEntity();
                    identity.setId(UUID.randomUUID());
                    identity.setUserId(userId);
                    identity.setProvider(provider);
                    identity.setProviderUserId(providerUserId);
                    identity.setProviderEmail(providerEmail);
                    identity.setProfile("{}");
                    identity.setCreatedAt(Instant.now());
                    return identityJpaRepository.save(identity);
                });
    }
}
