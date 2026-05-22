package com.authlyn.modules.identity.service;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.dto.LoginRequest;
import com.authlyn.modules.identity.dto.LoginResponse;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import com.authlyn.shared.security.jwt.JwtTokenService;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LoginServiceTest {

    private UserJpaRepository userRepository;
    private SessionJpaRepository sessionRepository;
    private RefreshTokenJpaRepository refreshTokenRepository;
    private JwtTokenService jwtTokenService;
    private BCryptPasswordEncoder passwordEncoder;
    private LoginService service;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserJpaRepository.class);
        sessionRepository = mock(SessionJpaRepository.class);
        refreshTokenRepository = mock(RefreshTokenJpaRepository.class);
        jwtTokenService = mock(JwtTokenService.class);
        passwordEncoder = new BCryptPasswordEncoder(4);

        when(sessionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(refreshTokenRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        service = new LoginService(userRepository, sessionRepository, refreshTokenRepository,
                passwordEncoder, jwtTokenService, new AuthlynJwtProperties());
    }

    @Test
    void testLoginWithValidCredentialsReturnsTokens() {
        UserEntity user = savedUser("alice@example.com", passwordEncoder.encode("correct-password"));

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(jwtTokenService.issueAccessToken(eq(user.getId()), any(UUID.class))).thenReturn("access-token");

        LoginResponse response = service.login(new LoginRequest("alice@example.com", "correct-password"));

        assertEquals(user.getId(), response.userId());
        assertNotNull(response.sessionId());
        assertEquals("access-token", response.accessToken());
        assertNotNull(response.refreshToken());
    }

    @Test
    void testLoginRejectsWrongPassword() {
        UserEntity user = savedUser("alice@example.com", passwordEncoder.encode("correct-password"));
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.login(new LoginRequest("alice@example.com", "wrong-password")));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void testLoginRejectsUnknownEmail() {
        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.login(new LoginRequest("nobody@example.com", "any-password")));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void testLoginRejectsSoftDeletedUser() {
        UserEntity deleted = savedUser("deleted@example.com", passwordEncoder.encode("password"));
        deleted.setDeletedAt(Instant.now().minusSeconds(3600));
        when(userRepository.findByEmail("deleted@example.com")).thenReturn(Optional.of(deleted));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.login(new LoginRequest("deleted@example.com", "password")));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    private UserEntity savedUser(String email, String passwordHash) {
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        return user;
    }
}
