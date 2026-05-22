package com.authlyn.modules.identity.controller;

import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.authlyn.modules.identity.dto.MeResponse;
import com.authlyn.modules.identity.service.CurrentUserService;

@RestController
public class MeController {

    private final CurrentUserService currentUserService;

    public MeController(CurrentUserService currentUserService) {
        this.currentUserService = currentUserService;
    }

    @GetMapping("/api/me")
    public MeResponse me(@AuthenticationPrincipal Jwt jwt) {
        return currentUserService.getCurrentUser(UUID.fromString(jwt.getSubject()));
    }
}
