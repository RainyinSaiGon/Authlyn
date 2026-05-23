package com.authlyn.modules.identity.service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.PasswordResetTokenEntity;
import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.dto.PasswordResetConfirmRequest;
import com.authlyn.modules.identity.dto.PasswordResetRequest;
import com.authlyn.modules.identity.repository.PasswordResetTokenJpaRepository;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.mail.MailMessage;
import com.authlyn.shared.mail.MailService;
import com.authlyn.shared.security.TokenUtil;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import com.authlyn.shared.security.state.RedisSessionStateService;


import static org.junit.jupiter.api.Assertions.assertEquals;
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

class PasswordResetServiceTest {

    private UserJpaRepository userRepository;
    private PasswordResetTokenJpaRepository passwordResetTokenRepository;
    private SessionJpaRepository sessionRepository;
    private RefreshTokenJpaRepository refreshTokenRepository;
    private MailService mailService;
    private RedisSessionStateService redisSessionStateService;
    private PasswordResetService service;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserJpaRepository.class);
        passwordResetTokenRepository = mock(PasswordResetTokenJpaRepository.class);
        sessionRepository = mock(SessionJpaRepository.class);
        refreshTokenRepository = mock(RefreshTokenJpaRepository.class);
        mailService = mock(MailService.class);
        redisSessionStateService = mock(RedisSessionStateService.class);

        when(passwordResetTokenRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(sessionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(refreshTokenRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        service = new PasswordResetService(
                userRepository,
                passwordResetTokenRepository,
                sessionRepository,
                refreshTokenRepository,
                new BCryptPasswordEncoder(4),
                mailService,
                redisSessionStateService,
                new AuthlynJwtProperties());
    }

    @Test
    void testRequestResetCreatesTokenAndSendsMail() {
        UserEntity user = user("User@Example.com", "password-hash");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        service.requestReset(new PasswordResetRequest("User@Example.com"));

        ArgumentCaptor<PasswordResetTokenEntity> tokenCaptor = ArgumentCaptor.forClass(PasswordResetTokenEntity.class);
        ArgumentCaptor<MailMessage> mailCaptor = ArgumentCaptor.forClass(MailMessage.class);

        verify(passwordResetTokenRepository).save(tokenCaptor.capture());
        verify(passwordResetTokenRepository).revokeAllByUserId(eq(user.getId()), any(), eq("password_reset_reissued"));
        verify(mailService).send(mailCaptor.capture());

        String resetToken = (String) mailCaptor.getValue().variables().get("resetToken");
        assertNotNull(resetToken);
        assertEquals(TokenUtil.sha256Hex(resetToken), tokenCaptor.getValue().getTokenHash());
        assertEquals(user.getEmail(), mailCaptor.getValue().to());
    }

    @Test
    void testRequestResetIgnoresUnknownEmail() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        service.requestReset(new PasswordResetRequest("unknown@example.com"));

        verify(mailService, never()).send(any());
    }

    @Test
    void testConfirmResetUpdatesPasswordAndRevokesSessions() {
        String rawToken = TokenUtil.generateOpaqueToken();
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        PasswordResetTokenEntity resetToken = resetToken(rawToken, userId);
        UserEntity user = user("user@example.com", "old-hash");
        user.setId(userId);

        SessionEntity session = activeSession(sessionId, userId);

        when(passwordResetTokenRepository.findByTokenHash(TokenUtil.sha256Hex(rawToken))).thenReturn(Optional.of(resetToken));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(sessionRepository.findByUserId(userId)).thenReturn(List.of(session));

        service.confirmReset(new PasswordResetConfirmRequest(rawToken, "NewPassword123!"));

        assertTrue(new BCryptPasswordEncoder(4).matches("NewPassword123!", user.getPasswordHash()));
        assertNotNull(resetToken.getUsedAt());
        verify(passwordResetTokenRepository).markUsed(eq(resetToken.getId()), any());
        verify(passwordResetTokenRepository).revokeAllByUserId(eq(userId), any(), eq("password_reset"));
        verify(redisSessionStateService).revokeSession(eq(sessionId), eq(session.getExpiresAt()), eq("password_reset"));
        verify(sessionRepository).revokeAllByUserId(eq(userId), any(), eq("password_reset"));
        verify(refreshTokenRepository).revokeAllByUserId(eq(userId), any(), eq("password_reset"));
    }

    @Test
    void testConfirmResetRejectsUsedToken() {
        String rawToken = TokenUtil.generateOpaqueToken();

        PasswordResetTokenEntity resetToken = resetToken(rawToken, UUID.randomUUID());
        resetToken.setUsedAt(Instant.now().minusSeconds(60));

        when(passwordResetTokenRepository.findByTokenHash(TokenUtil.sha256Hex(rawToken))).thenReturn(Optional.of(resetToken));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.confirmReset(new PasswordResetConfirmRequest(rawToken, "NewPassword123!")));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    private UserEntity user(String email, String passwordHash) {
        Instant now = Instant.now();
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(email.toLowerCase(Locale.ROOT));
        user.setPasswordHash(passwordHash);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return user;
    }

    private PasswordResetTokenEntity resetToken(String rawToken, UUID userId) {
        Instant now = Instant.now();
        PasswordResetTokenEntity token = new PasswordResetTokenEntity();
        token.setId(UUID.randomUUID());
        token.setUserId(userId);
        token.setTokenHash(TokenUtil.sha256Hex(rawToken));
        token.setIssuedAt(now);
        token.setExpiresAt(now.plusSeconds(3600));
        return token;
    }

    private SessionEntity activeSession(UUID sessionId, UUID userId) {
        Instant now = Instant.now();
        SessionEntity session = new SessionEntity();
        session.setId(sessionId);
        session.setUserId(userId);
        session.setCreatedAt(now.minusSeconds(60));
        session.setLastSeenAt(now);
        session.setExpiresAt(now.plusSeconds(3600));
        return session;
    }
}
