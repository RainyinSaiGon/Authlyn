package com.authlyn.modules.system.api;

public record PublicMetaResponse(
        String applicationName,
        String status,
        String jwksPath,
        String architectureDocument
) {
}
