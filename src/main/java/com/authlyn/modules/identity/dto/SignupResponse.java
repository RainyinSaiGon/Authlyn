package com.authlyn.modules.identity.dto;

import java.time.Instant;
import java.util.UUID;

public record SignupResponse(
        UUID userId,
        String accessToken,
        String refreshToken,
        Instant createdAt
) {}
