package com.authlyn.modules.identity.dto;

import com.authlyn.shared.validation.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank @Email String email,
        @NotBlank @StrongPassword String password,
        @Size(max = 120) String displayName
) {}
