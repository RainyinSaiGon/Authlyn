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
import com.authlyn.modules.identity.dto.SignupRequest;
import com.authlyn.modules.identity.dto.SignupResponse;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.security.TokenUtil;
import com.authlyn.shared.security.jwt.AuthlynJwtProperties;
import com.authlyn.shared.security.jwt.JwtTokenService;

@Service
public class SignupService {

    private final UserJpaRepository userRepository;
    private final SessionJpaRepository sessionRepository;
    private final RefreshTokenJpaRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final AuthlynJwtProperties properties;

    public SignupService(UserJpaRepository userRepository,
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
    public SignupResponse signup(SignupRequest request) {
        String normalizedEmail = request.email().toLowerCase(Locale.ROOT).strip();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        Instant now = Instant.now();

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setDisplayName(request.displayName());
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);

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

        return new SignupResponse(user.getId(), accessToken, rawToken, now);
    }
}
