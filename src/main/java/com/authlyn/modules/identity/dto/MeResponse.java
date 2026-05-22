package com.authlyn.modules.identity.dto;

import java.time.Instant;
import java.util.UUID;

public record MeResponse(
        UUID userId,
        String email,
        boolean emailVerified,
        String displayName,
        Instant createdAt
) {}
