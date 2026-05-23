package com.authlyn.modules.org.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.org.domain.OrgMemberRoleEntity;
import com.authlyn.modules.org.domain.OrgMemberRoleId;
import com.authlyn.modules.org.domain.RoleEntity;
import com.authlyn.modules.org.dto.AssignRoleRequest;
import com.authlyn.modules.org.dto.CreateRoleRequest;
import com.authlyn.modules.org.dto.RoleResponse;
import com.authlyn.modules.org.repository.OrgMemberJpaRepository;
import com.authlyn.modules.org.repository.OrgMemberRoleJpaRepository;
import com.authlyn.modules.org.repository.RoleJpaRepository;

@Service
@Transactional
public class RoleService {

    private final RoleJpaRepository roleRepo;
    private final OrgMemberJpaRepository memberRepo;
    private final OrgMemberRoleJpaRepository memberRoleRepo;

    public RoleService(RoleJpaRepository roleRepo, OrgMemberJpaRepository memberRepo, OrgMemberRoleJpaRepository memberRoleRepo) {
        this.roleRepo = roleRepo;
        this.memberRepo = memberRepo;
        this.memberRoleRepo = memberRoleRepo;
    }

    public RoleResponse createRole(UUID orgId, CreateRoleRequest request, UUID requestingUserId) {
        memberRepo.findByOrgIdAndUserId(orgId, requestingUserId)
                .filter(m -> "admin".equals(m.getStatus()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Not an admin of this organization"));

        if (roleRepo.findByOrgIdAndKey(orgId, request.key()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Role key already exists in this organization");
        }

        RoleEntity role = new RoleEntity();
        role.setId(UUID.randomUUID());
        role.setOrgId(orgId);
        role.setKey(request.key());
        role.setName(request.name());
        role.setDescription(request.description());
        role.setSystemRole(false);
        role.setCreatedAt(Instant.now());
        roleRepo.save(role);

        return toRoleResponse(role);
    }

    public List<RoleResponse> listRoles(UUID orgId) {
        return roleRepo.findByOrgId(orgId).stream()
                .map(this::toRoleResponse)
                .toList();
    }

    public void assignRole(UUID orgId, UUID memberId, AssignRoleRequest request, UUID requestingUserId) {
        memberRepo.findByOrgIdAndUserId(orgId, requestingUserId)
                .filter(m -> "admin".equals(m.getStatus()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Not an admin of this organization"));

        memberRepo.findById(memberId)
                .filter(m -> orgId.equals(m.getOrgId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found in this organization"));

        RoleEntity role = roleRepo.findById(request.roleId())
                .filter(r -> orgId.equals(r.getOrgId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found in this organization"));

        OrgMemberRoleId compositeId = new OrgMemberRoleId(memberId, role.getId());
        if (memberRoleRepo.existsById(compositeId)) {
            return;
        }

        OrgMemberRoleEntity assignment = new OrgMemberRoleEntity();
        assignment.setId(compositeId);
        assignment.setGrantedAt(Instant.now());
        memberRoleRepo.save(assignment);
    }

    public void revokeRole(UUID orgId, UUID memberId, UUID roleId, UUID requestingUserId) {
        memberRepo.findByOrgIdAndUserId(orgId, requestingUserId)
                .filter(m -> "admin".equals(m.getStatus()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Not an admin of this organization"));

        memberRoleRepo.deleteByIdOrgMemberIdAndIdRoleId(memberId, roleId);
    }

    private RoleResponse toRoleResponse(RoleEntity role) {
        return new RoleResponse(
                role.getId(),
                role.getOrgId(),
                role.getKey(),
                role.getName(),
                role.getDescription(),
                role.isSystemRole(),
                role.getCreatedAt()
        );
    }
}
