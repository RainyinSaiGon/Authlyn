package com.authlyn.modules.org.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.authlyn.modules.org.dto.AssignRoleRequest;
import com.authlyn.modules.org.dto.CreateRoleRequest;
import com.authlyn.modules.org.dto.RoleResponse;
import com.authlyn.modules.org.service.RoleService;

import jakarta.validation.Valid;

@RestController
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/api/orgs/{orgId}/roles")
    public ResponseEntity<RoleResponse> createRole(
            @PathVariable UUID orgId,
            @Valid @RequestBody CreateRoleRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        UUID callerId = UUID.fromString(jwt.getSubject());
        RoleResponse response = roleService.createRole(orgId, request, callerId);
        return ResponseEntity.created(URI.create("/api/orgs/" + orgId + "/roles/" + response.id())).body(response);
    }

    @GetMapping("/api/orgs/{orgId}/roles")
    public ResponseEntity<List<RoleResponse>> listRoles(
            @PathVariable UUID orgId,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(roleService.listRoles(orgId));
    }

    @PostMapping("/api/orgs/{orgId}/members/{memberId}/roles")
    public ResponseEntity<Void> assignRole(
            @PathVariable UUID orgId,
            @PathVariable UUID memberId,
            @Valid @RequestBody AssignRoleRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        UUID callerId = UUID.fromString(jwt.getSubject());
        roleService.assignRole(orgId, memberId, request, callerId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/orgs/{orgId}/members/{memberId}/roles/{roleId}")
    public ResponseEntity<Void> revokeRole(
            @PathVariable UUID orgId,
            @PathVariable UUID memberId,
            @PathVariable UUID roleId,
            @AuthenticationPrincipal Jwt jwt) {
        UUID callerId = UUID.fromString(jwt.getSubject());
        roleService.revokeRole(orgId, memberId, roleId, callerId);
        return ResponseEntity.noContent().build();
    }
}
