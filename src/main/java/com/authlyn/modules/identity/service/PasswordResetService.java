package com.authlyn.modules.identity.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.PasswordResetTokenEntity;
import java.util.Map;
import com.authlyn.modules.identity.domain.RefreshTokenEntity;
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

@Service
public class PasswordResetService {

    private static final String RESET_TEMPLATE = "password-reset";

    private final UserJpaRepository userRepository;
    private final PasswordResetTokenJpaRepository passwordResetTokenRepository;
    private final SessionJpaRepository sessionRepository;
    private final RefreshTokenJpaRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final RedisSessionStateService redisSessionStateService;
    private final AuthlynJwtProperties properties;

    public PasswordResetService(UserJpaRepository userRepository,
                                PasswordResetTokenJpaRepository passwordResetTokenRepository,
                                SessionJpaRepository sessionRepository,
                                RefreshTokenJpaRepository refreshTokenRepository,
                                PasswordEncoder passwordEncoder,
                                MailService mailService,
                                RedisSessionStateService redisSessionStateService,
                                AuthlynJwtProperties properties) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.sessionRepository = sessionRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
        this.redisSessionStateService = redisSessionStateService;
        this.properties = properties;
    }

    @Transactional
    public void requestReset(PasswordResetRequest request) {
        String normalizedEmail = request.email().toLowerCase(Locale.ROOT).strip();

        UserEntity user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null || user.getDeletedAt() != null || user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            return;
        }

        Instant now = Instant.now();
        passwordResetTokenRepository.revokeAllByUserId(user.getId(), now, "password_reset_reissued");

        String rawToken = TokenUtil.generateOpaqueToken();
        PasswordResetTokenEntity token = new PasswordResetTokenEntity();
        token.setId(UUID.randomUUID());
        token.setUserId(user.getId());
        token.setTokenHash(TokenUtil.sha256Hex(rawToken));
        token.setIssuedAt(now);
        token.setExpiresAt(now.plus(Duration.ofMinutes(properties.getPasswordResetTokenMinutes())));
        passwordResetTokenRepository.save(token);

        mailService.send(new MailMessage(
                user.getEmail(),
                "Reset your Authlyn password",
                RESET_TEMPLATE,
                Map.of(
                        "email", user.getEmail(),
                        "resetToken", rawToken,
                        "expiresAt", token.getExpiresAt().toString()
                )));
    }

    @Transactional
    public void confirmReset(PasswordResetConfirmRequest request) {
        String tokenHash = TokenUtil.sha256Hex(request.resetToken());

        PasswordResetTokenEntity token = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password reset token"));

        Instant now = Instant.now();

        if (token.getUsedAt() != null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Password reset token already used");
        }

        if (token.getRevokedAt() != null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Password reset token revoked");
        }

        if (token.getExpiresAt().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Password reset token expired");
        }

        UserEntity user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password reset token"));

        if (user.getDeletedAt() != null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password reset token");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setUpdatedAt(now);
        userRepository.save(user);

        token.setUsedAt(now);
        passwordResetTokenRepository.markUsed(token.getId(), now);
        passwordResetTokenRepository.revokeAllByUserId(user.getId(), now, "password_reset");

        List<SessionEntity> sessions = sessionRepository.findByUserId(user.getId());
        for (SessionEntity session : sessions) {
            redisSessionStateService.revokeSession(session.getId(), session.getExpiresAt(), "password_reset");
        }

        sessionRepository.revokeAllByUserId(user.getId(), now, "password_reset");
        refreshTokenRepository.revokeAllByUserId(user.getId(), now, "password_reset");
    }
}