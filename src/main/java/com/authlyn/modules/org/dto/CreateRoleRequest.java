package com.authlyn.modules.org.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRoleRequest(
        @NotBlank @Size(max = 80) String key,
        @NotBlank @Size(max = 120) String name,
        @Size(max = 500) String description
) {}
