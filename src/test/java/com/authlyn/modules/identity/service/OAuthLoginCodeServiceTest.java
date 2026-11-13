package com.authlyn.modules.identity.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.dto.LoginResponse;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.security.TokenUtil;
import com.authlyn.shared.security.jwt.JwtTokenService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OAuthLoginCodeServiceTest {

    private ValueOperations<String, String> valueOps;
    private SessionJpaRepository sessionRepository;
    private RefreshTokenJpaRepository refreshTokenRepository;
    private UserJpaRepository userRepository;
    private JwtTokenService jwtTokenService;
    private OAuthLoginCodeService service;

    private final UUID userId = UUID.randomUUID();
    private final UUID sessionId = UUID.randomUUID();

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        valueOps = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(valueOps);
        sessionRepository = mock(SessionJpaRepository.class);
        refreshTokenRepository = mock(RefreshTokenJpaRepository.class);
        userRepository = mock(UserJpaRepository.class);
        jwtTokenService = mock(JwtTokenService.class);
        service = new OAuthLoginCodeService(redis, sessionRepository, refreshTokenRepository, userRepository, jwtTokenService);

        UserEntity user = new UserEntity();
        user.setId(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(jwtTokenService.issueAccessToken(userId, sessionId)).thenReturn("access-token");
    }

    @Test
    void testIssuedCodeIsStoredHashedWithAShortTtl() {
        String code = service.issueCode(userId, sessionId);

        ArgumentCaptor<String> key = ArgumentCaptor.forClass(String.class);
        verify(valueOps).set(key.capture(), eq(userId + ":" + sessionId), eq(OAuthLoginCodeService.CODE_TTL));
        assertTrue(key.getValue().endsWith(TokenUtil.sha256Hex(code)));
        assertFalse(key.getValue().contains(code));
    }

    @Test
    void testValidCodeIsExchangedForTokensOnce() {
        when(valueOps.getAndDelete(anyString())).thenReturn(userId + ":" + sessionId).thenReturn(null);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(activeSession()));

        LoginResponse response = service.exchange("code");

        assertEquals("access-token", response.accessToken());
        assertNotNull(response.refreshToken());
        assertEquals(sessionId, response.sessionId());
        verify(refreshTokenRepository).save(any());

        ResponseStatusException second = assertThrows(ResponseStatusException.class, () -> service.exchange("code"));
        assertEquals(HttpStatus.UNAUTHORIZED, second.getStatusCode());
    }

    @Test
    void testCodeForARevokedSessionIsRejected() {
        SessionEntity session = activeSession();
        session.setRevokedAt(Instant.now());
        when(valueOps.getAndDelete(anyString())).thenReturn(userId + ":" + sessionId);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(ResponseStatusException.class, () -> service.exchange("code"));
        verify(refreshTokenRepository, never()).save(any());
    }

    private SessionEntity activeSession() {
        SessionEntity session = new SessionEntity();
        session.setId(sessionId);
        session.setUserId(userId);
        session.setExpiresAt(Instant.now().plusSeconds(3600));
        return session;
    }
}
