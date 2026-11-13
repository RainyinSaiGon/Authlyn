package com.authlyn.modules.identity.service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.RefreshTokenEntity;
import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.dto.LoginResponse;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.security.TokenUtil;
import com.authlyn.shared.security.jwt.JwtTokenService;

/**
 * One-time login codes for the social-login redirect.
 *
 * <p>After an OAuth2 provider login, the browser is redirected back to the frontend with only a
 * short-lived, single-use code in the URL. The frontend posts that code to
 * {@code /api/public/auth/oauth/exchange} to receive tokens in a response body. Tokens therefore
 * never appear in URLs, browser history, proxy logs or {@code Referer} headers.
 *
 * <p>Redis holds only {@code userId:sessionId} under the SHA-256 of the code; the refresh token is
 * minted at exchange time, so no token material is stored outside the database.
 */
@Service
public class OAuthLoginCodeService {

    static final Duration CODE_TTL = Duration.ofSeconds(60);
    private static final String KEY_PREFIX = "authlyn:oauth:login-code:";

    private final StringRedisTemplate redisTemplate;
    private final SessionJpaRepository sessionRepository;
    private final RefreshTokenJpaRepository refreshTokenRepository;
    private final UserJpaRepository userRepository;
    private final JwtTokenService jwtTokenService;

    public OAuthLoginCodeService(StringRedisTemplate redisTemplate,
                                 SessionJpaRepository sessionRepository,
                                 RefreshTokenJpaRepository refreshTokenRepository,
                                 UserJpaRepository userRepository,
                                 JwtTokenService jwtTokenService) {
        this.redisTemplate = redisTemplate;
        this.sessionRepository = sessionRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtTokenService = jwtTokenService;
    }

    public String issueCode(UUID userId, UUID sessionId) {
        String code = TokenUtil.generateOpaqueToken();
        redisTemplate.opsForValue().set(key(code), userId + ":" + sessionId, CODE_TTL);
        return code;
    }

    @Transactional
    public LoginResponse exchange(String code) {
        // GETDEL makes the code single-use even under concurrent exchange attempts.
        String value = redisTemplate.opsForValue().getAndDelete(key(code));
        if (value == null) {
            throw invalidCode();
        }

        String[] parts = value.split(":", 2);
        if (parts.length != 2) {
            throw invalidCode();
        }
        UUID userId = UUID.fromString(parts[0]);
        UUID sessionId = UUID.fromString(parts[1]);

        Instant now = Instant.now();
        SessionEntity session = sessionRepository.findById(sessionId)
                .filter(s -> userId.equals(s.getUserId()))
                .filter(s -> s.getRevokedAt() == null)
                .filter(s -> s.getExpiresAt() != null && s.getExpiresAt().isAfter(now))
                .orElseThrow(OAuthLoginCodeService::invalidCode);

        UserEntity user = userRepository.findById(userId)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(OAuthLoginCodeService::invalidCode);

        String rawRefreshToken = TokenUtil.generateOpaqueToken();
        RefreshTokenEntity refreshToken = new RefreshTokenEntity();
        refreshToken.setId(UUID.randomUUID());
        refreshToken.setUserId(user.getId());
        refreshToken.setSessionId(session.getId());
        refreshToken.setTokenHash(TokenUtil.sha256Hex(rawRefreshToken));
        refreshToken.setIssuedAt(now);
        refreshToken.setExpiresAt(session.getExpiresAt());
        refreshTokenRepository.save(refreshToken);

        String accessToken = jwtTokenService.issueAccessToken(user.getId(), session.getId());
        return new LoginResponse(user.getId(), session.getId(), accessToken, rawRefreshToken, session.getExpiresAt());
    }

    private static String key(String code) {
        return KEY_PREFIX + TokenUtil.sha256Hex(code);
    }

    private static ResponseStatusException invalidCode() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired login code");
    }
}
