package com.authlyn.modules.identity.dto;

import java.time.Instant;
import java.util.UUID;

public record LoginResponse(
        UUID userId,
        UUID sessionId,
        String accessToken,
        String refreshToken,
        Instant expiresAt
) {}
