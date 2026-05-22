package com.authlyn.modules.identity.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.shared.security.state.RedisSessionStateService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class LogoutServiceTest {

    private SessionJpaRepository sessionRepository;
    private RefreshTokenJpaRepository refreshTokenRepository;
    private RedisSessionStateService redisSessionStateService;
    private LogoutService service;

    @BeforeEach
    void setUp() {
        sessionRepository = mock(SessionJpaRepository.class);
        refreshTokenRepository = mock(RefreshTokenJpaRepository.class);
        redisSessionStateService = mock(RedisSessionStateService.class);
        service = new LogoutService(sessionRepository, refreshTokenRepository, redisSessionStateService);
    }

    @Test
    void testLogoutRejectsSessionOwnedByAnotherUser() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        SessionEntity session = session(sessionId, UUID.randomUUID());
        when(sessionRepository.findById(sessionId)).thenReturn(java.util.Optional.of(session));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.logout(userId, sessionId));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void testLogoutRevokesOwnedSessionInRedisAndDatabase() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        SessionEntity session = session(sessionId, userId);
        when(sessionRepository.findById(sessionId)).thenReturn(java.util.Optional.of(session));

        service.logout(userId, sessionId);

        verify(redisSessionStateService).revokeSession(eq(sessionId), eq(session.getExpiresAt()), eq("user_logout"));
        verify(sessionRepository).revoke(eq(sessionId), any(), eq("user_logout"));
        verify(refreshTokenRepository).revokeAllBySessionId(eq(sessionId), any(), eq("user_logout"));
    }

    @Test
    void testLogoutAllRevokesAllUserSessions() {
        UUID userId = UUID.randomUUID();
        SessionEntity sessionA = session(UUID.randomUUID(), userId);
        SessionEntity sessionB = session(UUID.randomUUID(), userId);
        when(sessionRepository.findByUserId(userId)).thenReturn(List.of(sessionA, sessionB));

        service.logoutAll(userId);

        verify(redisSessionStateService).revokeSession(eq(sessionA.getId()), eq(sessionA.getExpiresAt()), eq("user_logout_all"));
        verify(redisSessionStateService).revokeSession(eq(sessionB.getId()), eq(sessionB.getExpiresAt()), eq("user_logout_all"));
        verify(sessionRepository).revokeAllByUserId(eq(userId), any(), eq("user_logout_all"));
        verify(refreshTokenRepository).revokeAllByUserId(eq(userId), any(), eq("user_logout_all"));
    }

    private SessionEntity session(UUID sessionId, UUID userId) {
        SessionEntity session = new SessionEntity();
        session.setId(sessionId);
        session.setUserId(userId);
        session.setCreatedAt(Instant.now().minusSeconds(60));
        session.setLastSeenAt(Instant.now().minusSeconds(10));
        session.setExpiresAt(Instant.now().plusSeconds(3600));
        return session;
    }
}