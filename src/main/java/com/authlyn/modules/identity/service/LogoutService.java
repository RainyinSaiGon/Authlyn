package com.authlyn.modules.identity.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.shared.security.state.RedisSessionStateService;

@Service
public class LogoutService {

    private final SessionJpaRepository sessionRepository;
    private final RefreshTokenJpaRepository refreshTokenRepository;
    private final RedisSessionStateService redisSessionStateService;

    public LogoutService(SessionJpaRepository sessionRepository,
                         RefreshTokenJpaRepository refreshTokenRepository,
                         RedisSessionStateService redisSessionStateService) {
        this.sessionRepository = sessionRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.redisSessionStateService = redisSessionStateService;
    }

    @Transactional
    public void logout(UUID userId, UUID sessionId) {
        Instant now = Instant.now();
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

        if (!userId.equals(session.getUserId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found");
        }

        redisSessionStateService.revokeSession(sessionId, session.getExpiresAt(), "user_logout");
        sessionRepository.revoke(sessionId, now, "user_logout");
        refreshTokenRepository.revokeAllBySessionId(sessionId, now, "user_logout");
    }

    @Transactional
    public void logoutAll(UUID userId) {
        Instant now = Instant.now();
        List<SessionEntity> sessions = sessionRepository.findByUserId(userId);

        for (SessionEntity session : sessions) {
            redisSessionStateService.revokeSession(session.getId(), session.getExpiresAt(), "user_logout_all");
        }

        sessionRepository.revokeAllByUserId(userId, now, "user_logout_all");
        refreshTokenRepository.revokeAllByUserId(userId, now, "user_logout_all");
    }
}
