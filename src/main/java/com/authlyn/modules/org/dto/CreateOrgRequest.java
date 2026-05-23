package com.authlyn.modules.org.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateOrgRequest(
        @NotBlank @Pattern(regexp = "[a-z0-9-]{2,80}") String slug,
        @NotBlank @Size(max = 140) String name
) {}
