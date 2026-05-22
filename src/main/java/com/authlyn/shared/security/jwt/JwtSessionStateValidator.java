package com.authlyn.shared.security.jwt;

import java.util.UUID;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.StringUtils;

import com.authlyn.shared.security.state.RedisSessionStateService;

public class JwtSessionStateValidator implements OAuth2TokenValidator<Jwt> {

    private final RedisSessionStateService sessionStateService;

    public JwtSessionStateValidator(RedisSessionStateService sessionStateService) {
        this.sessionStateService = sessionStateService;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        String sessionIdValue = resolveSessionId(jwt);
        if (!StringUtils.hasText(sessionIdValue)) {
            return OAuth2TokenValidatorResult.success();
        }

        try {
            UUID sessionId = UUID.fromString(sessionIdValue);
            if (sessionStateService.isSessionRevoked(sessionId)) {
                return OAuth2TokenValidatorResult.failure(new OAuth2Error(
                        "invalid_token",
                        "Session revoked",
                        null));
            }
            return OAuth2TokenValidatorResult.success();
        } catch (IllegalArgumentException ex) {
            return OAuth2TokenValidatorResult.failure(new OAuth2Error(
                    "invalid_token",
                    "Invalid session identifier",
                    null));
        } catch (RuntimeException ex) {
            return OAuth2TokenValidatorResult.failure(new OAuth2Error(
                    "invalid_token",
                    "Unable to validate session state",
                    null));
        }
    }

    private String resolveSessionId(Jwt jwt) {
        String[] claimNames = {"sid", "session_id", "sessionId"};
        for (String claimName : claimNames) {
            String claimValue = jwt.getClaimAsString(claimName);
            if (StringUtils.hasText(claimValue)) {
                return claimValue;
            }
        }
        return null;
    }
}