package com.authlyn.modules.identity.dto;

import com.authlyn.shared.validation.StrongPassword;
import jakarta.validation.constraints.NotBlank;

public record PasswordResetConfirmRequest(
        @NotBlank String resetToken,
        @NotBlank @StrongPassword String newPassword
) {}
