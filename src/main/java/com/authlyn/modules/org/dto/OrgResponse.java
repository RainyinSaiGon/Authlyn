package com.authlyn.modules.org.dto;

import java.time.Instant;
import java.util.UUID;

public record OrgResponse(
        UUID id,
        String slug,
        String name,
        Instant createdAt
) {}
