package com.authlyn.modules.identity.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.dto.LoginRequest;
import com.authlyn.modules.identity.dto.LoginResponse;
import com.authlyn.modules.identity.dto.PasswordResetConfirmRequest;
import com.authlyn.modules.identity.dto.PasswordResetRequest;
import com.authlyn.modules.identity.dto.RefreshRequest;
import com.authlyn.modules.identity.dto.RefreshResponse;
import com.authlyn.modules.identity.dto.SignupRequest;
import com.authlyn.modules.identity.dto.SignupResponse;
import com.authlyn.modules.identity.service.LoginService;
import com.authlyn.modules.identity.service.LogoutService;
import com.authlyn.modules.identity.service.PasswordResetService;
import com.authlyn.modules.identity.service.RefreshService;
import com.authlyn.modules.identity.service.SignupService;

import jakarta.validation.Valid;

@RestController
public class AuthController {

    private final SignupService signupService;
    private final LoginService loginService;
    private final RefreshService refreshService;
    private final LogoutService logoutService;
    private final PasswordResetService passwordResetService;

    public AuthController(SignupService signupService,
                          LoginService loginService,
                          RefreshService refreshService,
                          LogoutService logoutService,
                          PasswordResetService passwordResetService) {
        this.signupService = signupService;
        this.loginService = loginService;
        this.refreshService = refreshService;
        this.logoutService = logoutService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/api/public/auth/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public SignupResponse signup(@Valid @RequestBody SignupRequest request) {
        return signupService.signup(request);
    }

    @PostMapping("/api/public/auth/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return loginService.login(request);
    }

    @PostMapping("/api/public/auth/refresh")
    public RefreshResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return refreshService.rotate(request);
    }

    @PostMapping("/api/public/auth/password-reset/request")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        passwordResetService.requestReset(request);
    }

    @PostMapping("/api/public/auth/password-reset/confirm")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        passwordResetService.confirmReset(request);
    }

    @PostMapping("/api/auth/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@AuthenticationPrincipal Jwt jwt,
                       @RequestBody(required = false) LogoutBody body) {
        UUID userId = UUID.fromString(jwt.getSubject());
        UUID sessionId = body != null && body.sessionId() != null
                ? body.sessionId()
                : resolveCurrentSessionId(jwt);

        if (sessionId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Session id is required");
        }

        logoutService.logout(userId, sessionId);
    }

    @PostMapping("/api/auth/logout-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutAll(@AuthenticationPrincipal Jwt jwt) {
        logoutService.logoutAll(UUID.fromString(jwt.getSubject()));
    }

    private UUID resolveCurrentSessionId(Jwt jwt) {
        String sessionClaim = jwt.getClaimAsString("sid");
        if (sessionClaim == null || sessionClaim.isBlank()) {
            return null;
        }
        return UUID.fromString(sessionClaim);
    }

    public record LogoutBody(UUID sessionId) {}
}
