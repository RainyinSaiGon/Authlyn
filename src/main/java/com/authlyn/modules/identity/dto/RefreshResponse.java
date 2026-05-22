package com.authlyn.modules.identity.dto;

import java.time.Instant;

public record RefreshResponse(
        String accessToken,
        String refreshToken,
        Instant accessTokenExpiresAt
) {}
