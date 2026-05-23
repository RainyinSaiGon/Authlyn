package com.authlyn.modules.org.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record AssignRoleRequest(
        @NotNull UUID roleId
) {}
