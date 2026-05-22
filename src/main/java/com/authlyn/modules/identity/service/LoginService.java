package com.authlyn.modules.identity.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.RefreshTokenEntity;
import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.dto.LoginRequest;
import com.authlyn.modules.identity.dto.LoginResponse;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.security.TokenUtil;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import com.authlyn.shared.security.jwt.JwtTokenService;

@Service
public class LoginService {

    private final UserJpaRepository userRepository;
    private final SessionJpaRepository sessionRepository;
    private final RefreshTokenJpaRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final AuthlynJwtProperties properties;

    public LoginService(UserJpaRepository userRepository,
                        SessionJpaRepository sessionRepository,
                        RefreshTokenJpaRepository refreshTokenRepository,
                        PasswordEncoder passwordEncoder,
                        JwtTokenService jwtTokenService,
                        AuthlynJwtProperties properties) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
        this.properties = properties;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = request.email().toLowerCase(Locale.ROOT).strip();

        UserEntity user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (user.getDeletedAt() != null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        Instant now = Instant.now();

        SessionEntity session = new SessionEntity();
        session.setId(UUID.randomUUID());
        session.setUserId(user.getId());
        session.setCreatedAt(now);
        session.setLastSeenAt(now);
        session.setExpiresAt(now.plus(Duration.ofDays(properties.getRefreshTokenDays())));
        sessionRepository.save(session);

        String rawToken = TokenUtil.generateOpaqueToken();
        RefreshTokenEntity refreshToken = new RefreshTokenEntity();
        refreshToken.setId(UUID.randomUUID());
        refreshToken.setUserId(user.getId());
        refreshToken.setSessionId(session.getId());
        refreshToken.setTokenHash(TokenUtil.sha256Hex(rawToken));
        refreshToken.setIssuedAt(now);
        refreshToken.setExpiresAt(now.plus(Duration.ofDays(properties.getRefreshTokenDays())));
        refreshTokenRepository.save(refreshToken);

        String accessToken = jwtTokenService.issueAccessToken(user.getId(), session.getId());
        Instant expiresAt = session.getExpiresAt();

        return new LoginResponse(user.getId(), session.getId(), accessToken, rawToken, expiresAt);
    }
}
