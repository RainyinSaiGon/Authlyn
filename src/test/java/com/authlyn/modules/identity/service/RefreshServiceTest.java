package com.authlyn.modules.identity.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RefreshServiceTest {

    private RefreshTokenJpaRepository refreshTokenRepository;
    private SessionJpaRepository sessionRepository;
    private JwtTokenService jwtTokenService;
    private RedisSessionStateService redisSessionStateService;
    private RefreshService service;

    @BeforeEach
    void setUp() {
        refreshTokenRepository = mock(RefreshTokenJpaRepository.class);
        sessionRepository = mock(SessionJpaRepository.class);
        jwtTokenService = mock(JwtTokenService.class);
        redisSessionStateService = mock(RedisSessionStateService.class);
        service = new RefreshService(refreshTokenRepository, sessionRepository, jwtTokenService,
            new AuthlynJwtProperties(), redisSessionStateService);
    }

    @Test
    void testRotatesActiveTokenAndReturnsNewTokens() {
        String rawToken = TokenUtil.generateOpaqueToken();
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        RefreshTokenEntity token = activeToken(rawToken, userId, sessionId);
        SessionEntity session = activeSession(sessionId, userId);

        when(refreshTokenRepository.findByTokenHash(TokenUtil.sha256Hex(rawToken))).thenReturn(Optional.of(token));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(refreshTokenRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(sessionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(jwtTokenService.issueAccessToken(userId, sessionId)).thenReturn("new-access-token");

        RefreshResponse response = service.rotate(new RefreshRequest(rawToken));

        assertEquals("new-access-token", response.accessToken());
        assertNotNull(response.refreshToken());
        assertNotEquals(rawToken, response.refreshToken());
        assertNotNull(response.accessTokenExpiresAt());
        assertNotNull(token.getReplacedByTokenId());
    }

    @Test
    void testDetectsReuseOfRotatedTokenAndRevokesEntireSession() {
        String rawToken = TokenUtil.generateOpaqueToken();
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        RefreshTokenEntity alreadyRotated = activeToken(rawToken, userId, sessionId);
        alreadyRotated.setReplacedByTokenId(UUID.randomUUID()); // already consumed

        when(refreshTokenRepository.findByTokenHash(TokenUtil.sha256Hex(rawToken))).thenReturn(Optional.of(alreadyRotated));
        when(refreshTokenRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.rotate(new RefreshRequest(rawToken)));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        assertTrue(alreadyRotated.isReuseDetected());
        verify(redisSessionStateService).revokeSession(eq(sessionId), any(), eq("reuse_detected"));
        verify(refreshTokenRepository).revokeAllBySessionId(eq(sessionId), any(), eq("reuse_detected"));
        verify(sessionRepository).revoke(eq(sessionId), any(), eq("reuse_detected"));
    }

    @Test
    void testRejectsExpiredToken() {
        String rawToken = TokenUtil.generateOpaqueToken();

        RefreshTokenEntity expired = new RefreshTokenEntity();
        expired.setId(UUID.randomUUID());
        expired.setTokenHash(TokenUtil.sha256Hex(rawToken));
        expired.setExpiresAt(Instant.now().minus(Duration.ofMinutes(1)));

        when(refreshTokenRepository.findByTokenHash(TokenUtil.sha256Hex(rawToken))).thenReturn(Optional.of(expired));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.rotate(new RefreshRequest(rawToken)));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        verify(sessionRepository, never()).findById(any());
    }

    @Test
    void testRejectsRevokedToken() {
        String rawToken = TokenUtil.generateOpaqueToken();

        RefreshTokenEntity revoked = activeToken(rawToken, UUID.randomUUID(), UUID.randomUUID());
        revoked.setRevokedAt(Instant.now().minus(Duration.ofMinutes(5)));

        when(refreshTokenRepository.findByTokenHash(TokenUtil.sha256Hex(rawToken))).thenReturn(Optional.of(revoked));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.rotate(new RefreshRequest(rawToken)));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void testRejectsTokenFromRevokedSession() {
        String rawToken = TokenUtil.generateOpaqueToken();
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        RefreshTokenEntity token = activeToken(rawToken, userId, sessionId);
        SessionEntity revokedSession = activeSession(sessionId, userId);
        revokedSession.setRevokedAt(Instant.now().minus(Duration.ofMinutes(1)));

        when(refreshTokenRepository.findByTokenHash(TokenUtil.sha256Hex(rawToken))).thenReturn(Optional.of(token));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(revokedSession));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.rotate(new RefreshRequest(rawToken)));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void testRejectsUnknownToken() {
        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.rotate(new RefreshRequest("unknown-token")));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    private RefreshTokenEntity activeToken(String rawToken, UUID userId, UUID sessionId) {
        RefreshTokenEntity token = new RefreshTokenEntity();
        token.setId(UUID.randomUUID());
        token.setUserId(userId);
        token.setSessionId(sessionId);
        token.setTokenHash(TokenUtil.sha256Hex(rawToken));
        token.setIssuedAt(Instant.now().minus(Duration.ofMinutes(5)));
        token.setExpiresAt(Instant.now().plus(Duration.ofDays(30)));
        return token;
    }

    private SessionEntity activeSession(UUID sessionId, UUID userId) {
        SessionEntity session = new SessionEntity();
        session.setId(sessionId);
        session.setUserId(userId);
        session.setCreatedAt(Instant.now().minus(Duration.ofMinutes(5)));
        session.setLastSeenAt(Instant.now().minus(Duration.ofMinutes(1)));
        return session;
    }
}
