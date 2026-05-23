package com.authlyn.modules.org.dto;

import java.time.Instant;
import java.util.UUID;

public record RoleResponse(
        UUID id,
        UUID orgId,
        String key,
        String name,
        String description,
        boolean systemRole,
        Instant createdAt
) {}
