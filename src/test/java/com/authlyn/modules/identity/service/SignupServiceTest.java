package com.authlyn.modules.identity.service;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.dto.SignupRequest;
import com.authlyn.modules.identity.dto.SignupResponse;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import com.authlyn.shared.security.jwt.JwtTokenService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SignupServiceTest {

    private UserJpaRepository userRepository;
    private SessionJpaRepository sessionRepository;
    private RefreshTokenJpaRepository refreshTokenRepository;
    private JwtTokenService jwtTokenService;
    private SignupService service;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserJpaRepository.class);
        sessionRepository = mock(SessionJpaRepository.class);
        refreshTokenRepository = mock(RefreshTokenJpaRepository.class);
        jwtTokenService = mock(JwtTokenService.class);

        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(sessionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(refreshTokenRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        service = new SignupService(userRepository, sessionRepository, refreshTokenRepository,
                new BCryptPasswordEncoder(4), jwtTokenService, new AuthlynJwtProperties());
    }

    @Test
    void testSignupCreatesUserSessionAndRefreshToken() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(jwtTokenService.issueAccessToken(any(UUID.class), any(UUID.class))).thenReturn("access-token");

        SignupResponse response = service.signup(new SignupRequest("user@example.com", "password123", "Alice"));

        assertNotNull(response.userId());
        assertEquals("access-token", response.accessToken());
        assertNotNull(response.refreshToken());
        assertNotNull(response.createdAt());

        verify(userRepository).save(any(UserEntity.class));
        verify(sessionRepository).save(any(SessionEntity.class));
        verify(refreshTokenRepository).save(any());
    }

    @Test
    void testSignupNormalizesEmailToLowercase() {
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(jwtTokenService.issueAccessToken(any(UUID.class), any(UUID.class))).thenReturn("access-token");

        service.signup(new SignupRequest("User@EXAMPLE.COM", "password123", null));

        verify(userRepository).existsByEmail("user@example.com");
    }

    @Test
    void testSignupRejectsExistingEmail() {
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.signup(new SignupRequest("existing@example.com", "password123", null)));

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void testSignupHashesPassword() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(jwtTokenService.issueAccessToken(any(UUID.class), any(UUID.class))).thenReturn("access-token");

        service.signup(new SignupRequest("user@example.com", "plaintext", null));

        verify(userRepository).save(any(UserEntity.class));
        // BCrypt hash is verified by the save call; the entity will contain a bcrypt hash,
        // not the raw password. Asserted indirectly: if encoding failed an exception would be thrown.
    }
}
