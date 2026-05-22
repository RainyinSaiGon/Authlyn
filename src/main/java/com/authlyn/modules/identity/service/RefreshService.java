package com.authlyn.modules.identity.service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.RefreshTokenEntity;
import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.dto.RefreshRequest;
import com.authlyn.modules.identity.dto.RefreshResponse;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.shared.security.TokenUtil;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import com.authlyn.shared.security.jwt.JwtTokenService;
import com.authlyn.shared.security.state.RedisSessionStateService;

@Service
public class RefreshService {

    private final RefreshTokenJpaRepository refreshTokenRepository;
    private final SessionJpaRepository sessionRepository;
    private final JwtTokenService jwtTokenService;
    private final AuthlynJwtProperties properties;
    private final RedisSessionStateService redisSessionStateService;

    public RefreshService(RefreshTokenJpaRepository refreshTokenRepository,
                          SessionJpaRepository sessionRepository,
                          JwtTokenService jwtTokenService,
                          AuthlynJwtProperties properties,
                          RedisSessionStateService redisSessionStateService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.sessionRepository = sessionRepository;
        this.jwtTokenService = jwtTokenService;
        this.properties = properties;
        this.redisSessionStateService = redisSessionStateService;
    }

    @Transactional
    public RefreshResponse rotate(RefreshRequest request) {
        String tokenHash = TokenUtil.sha256Hex(request.refreshToken());

        RefreshTokenEntity token = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        Instant now = Instant.now();

        // Reuse detection: token was already rotated — this is a stolen-token signal.
        // Revoke the entire session family to contain the breach.
        if (token.getReplacedByTokenId() != null) {
            token.setReuseDetected(true);
            refreshTokenRepository.save(token);
            redisSessionStateService.revokeSession(token.getSessionId(), token.getExpiresAt(), "reuse_detected");
            refreshTokenRepository.revokeAllBySessionId(token.getSessionId(), now, "reuse_detected");
            sessionRepository.revoke(token.getSessionId(), now, "reuse_detected");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token reuse detected");
        }

        if (token.getRevokedAt() != null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token revoked");
        }

        if (token.getExpiresAt().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        SessionEntity session = sessionRepository.findById(token.getSessionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session not found"));

        if (session.getRevokedAt() != null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session revoked");
        }

        // Issue successor token atomically with marking the old one consumed.
        String newRawToken = TokenUtil.generateOpaqueToken();
        RefreshTokenEntity newToken = new RefreshTokenEntity();
        newToken.setId(UUID.randomUUID());
        newToken.setUserId(token.getUserId());
        newToken.setSessionId(token.getSessionId());
        newToken.setTokenHash(TokenUtil.sha256Hex(newRawToken));
        newToken.setIssuedAt(now);
        newToken.setExpiresAt(now.plus(Duration.ofDays(properties.getRefreshTokenDays())));
        refreshTokenRepository.save(newToken);

        token.setReplacedByTokenId(newToken.getId());
        refreshTokenRepository.save(token);

        session.setLastSeenAt(now);
        sessionRepository.save(session);

        String accessToken = jwtTokenService.issueAccessToken(token.getUserId(), token.getSessionId());
        Instant accessTokenExpiresAt = now.plus(Duration.ofMinutes(properties.getAccessTokenMinutes()));

        return new RefreshResponse(accessToken, newRawToken, accessTokenExpiresAt);
    }
}
