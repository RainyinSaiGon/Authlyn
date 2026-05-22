package com.authlyn.shared.security.jwt;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import com.authlyn.shared.security.state.RedisSessionStateService;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtSessionStateValidatorTest {

    @Test
    void acceptsJwtWithoutSessionClaim() {
        RedisSessionStateService sessionStateService = mock(RedisSessionStateService.class);
        JwtSessionStateValidator validator = new JwtSessionStateValidator(sessionStateService);

        OAuth2TokenValidatorResult result = validator.validate(jwt(Map.of("sub", UUID.randomUUID().toString())));

        assertTrue(result.getErrors().isEmpty());
    }

    @Test
    void rejectsJwtForRevokedSession() {
        RedisSessionStateService sessionStateService = mock(RedisSessionStateService.class);
        when(sessionStateService.isSessionRevoked(any())).thenReturn(true);
        JwtSessionStateValidator validator = new JwtSessionStateValidator(sessionStateService);

        OAuth2TokenValidatorResult result = validator.validate(jwt(Map.of(
                "sub", UUID.randomUUID().toString(),
                "sid", UUID.randomUUID().toString())));

        assertFalse(result.getErrors().isEmpty());
    }

    @Test
    void acceptsJwtForActiveSession() {
        RedisSessionStateService sessionStateService = mock(RedisSessionStateService.class);
        when(sessionStateService.isSessionRevoked(any())).thenReturn(false);
        JwtSessionStateValidator validator = new JwtSessionStateValidator(sessionStateService);

        OAuth2TokenValidatorResult result = validator.validate(jwt(Map.of(
                "sub", UUID.randomUUID().toString(),
                "sid", UUID.randomUUID().toString())));

        assertTrue(result.getErrors().isEmpty());
    }

    private Jwt jwt(Map<String, Object> claims) {
        Instant now = Instant.now();
        return new Jwt(
                UUID.randomUUID().toString(),
                now,
                now.plusSeconds(600),
                Map.of("alg", "RS256"),
                claims);
    }
}