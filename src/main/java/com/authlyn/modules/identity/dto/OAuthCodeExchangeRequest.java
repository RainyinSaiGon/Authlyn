package com.authlyn.modules.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record OAuthCodeExchangeRequest(@NotBlank String code) {}
