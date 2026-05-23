package com.authlyn.modules.org.dto;

import java.time.Instant;
import java.util.UUID;

public record OrgMemberResponse(
        UUID id,
        UUID orgId,
        UUID userId,
        String status,
        Instant createdAt
) {}
