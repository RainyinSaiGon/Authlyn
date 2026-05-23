package com.authlyn.modules.org.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.authlyn.modules.org.dto.AddMemberRequest;
import com.authlyn.modules.org.dto.CreateOrgRequest;
import com.authlyn.modules.org.dto.OrgMemberResponse;
import com.authlyn.modules.org.dto.OrgResponse;
import com.authlyn.modules.org.service.OrgService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orgs")
public class OrgController {

    private final OrgService orgService;

    public OrgController(OrgService orgService) {
        this.orgService = orgService;
    }

    @PostMapping
    public ResponseEntity<OrgResponse> createOrg(
            @Valid @RequestBody CreateOrgRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        UUID callerId = UUID.fromString(jwt.getSubject());
        OrgResponse response = orgService.createOrg(request, callerId);
        return ResponseEntity.created(URI.create("/api/orgs/" + response.id())).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OrgResponse>> listUserOrgs(@AuthenticationPrincipal Jwt jwt) {
        UUID callerId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(orgService.listUserOrgs(callerId));
    }

    @GetMapping("/{orgId}")
    public ResponseEntity<OrgResponse> getOrg(
            @PathVariable UUID orgId,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(orgService.getOrg(orgId));
    }

    @PostMapping("/{orgId}/members")
    public ResponseEntity<OrgMemberResponse> addMember(
            @PathVariable UUID orgId,
            @Valid @RequestBody AddMemberRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        UUID callerId = UUID.fromString(jwt.getSubject());
        OrgMemberResponse response = orgService.addMember(orgId, request, callerId);
        return ResponseEntity.created(URI.create("/api/orgs/" + orgId + "/members/" + response.id())).body(response);
    }

    @GetMapping("/{orgId}/members")
    public ResponseEntity<List<OrgMemberResponse>> listMembers(
            @PathVariable UUID orgId,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(orgService.listMembers(orgId));
    }
}
