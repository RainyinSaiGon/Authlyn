package com.authlyn.modules.org.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.org.domain.OrgMemberEntity;
import com.authlyn.modules.org.domain.OrganizationEntity;
import com.authlyn.modules.org.dto.AddMemberRequest;
import com.authlyn.modules.org.dto.CreateOrgRequest;
import com.authlyn.modules.org.dto.OrgMemberResponse;
import com.authlyn.modules.org.dto.OrgResponse;
import com.authlyn.modules.org.repository.OrgMemberJpaRepository;
import com.authlyn.modules.org.repository.OrganizationJpaRepository;

@Service
@Transactional
public class OrgService {

    private final OrganizationJpaRepository orgRepo;
    private final OrgMemberJpaRepository memberRepo;

    public OrgService(OrganizationJpaRepository orgRepo, OrgMemberJpaRepository memberRepo) {
        this.orgRepo = orgRepo;
        this.memberRepo = memberRepo;
    }

    public OrgResponse createOrg(CreateOrgRequest request, UUID creatorUserId) {
        if (orgRepo.findBySlug(request.slug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already taken");
        }

        Instant now = Instant.now();

        OrganizationEntity org = new OrganizationEntity();
        org.setId(UUID.randomUUID());
        org.setSlug(request.slug());
        org.setName(request.name());
        org.setCreatedAt(now);
        org.setUpdatedAt(now);
        orgRepo.save(org);

        OrgMemberEntity creator = new OrgMemberEntity();
        creator.setId(UUID.randomUUID());
        creator.setOrgId(org.getId());
        creator.setUserId(creatorUserId);
        creator.setStatus("admin");
        creator.setCreatedAt(now);
        memberRepo.save(creator);

        return toOrgResponse(org);
    }

    public OrgResponse getOrg(UUID orgId) {
        OrganizationEntity org = orgRepo.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));
        if (org.getDeletedAt() != null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found");
        }
        return toOrgResponse(org);
    }

    public List<OrgResponse> listUserOrgs(UUID userId) {
        List<UUID> orgIds = memberRepo.findByUserId(userId).stream()
                .map(OrgMemberEntity::getOrgId)
                .toList();
        if (orgIds.isEmpty()) {
            return List.of();
        }
        return orgRepo.findAllByIdIn(orgIds).stream()
                .filter(org -> org.getDeletedAt() == null)
                .map(this::toOrgResponse)
                .toList();
    }

    public OrgMemberResponse addMember(UUID orgId, AddMemberRequest request, UUID requestingUserId) {
        OrganizationEntity org = orgRepo.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));
        if (org.getDeletedAt() != null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found");
        }

        memberRepo.findByOrgIdAndUserId(orgId, requestingUserId)
                .filter(m -> "admin".equals(m.getStatus()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Not an admin of this organization"));

        if (memberRepo.findByOrgIdAndUserId(orgId, request.userId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already a member of this organization");
        }

        OrgMemberEntity member = new OrgMemberEntity();
        member.setId(UUID.randomUUID());
        member.setOrgId(orgId);
        member.setUserId(request.userId());
        member.setStatus("active");
        member.setCreatedAt(Instant.now());
        memberRepo.save(member);

        return toMemberResponse(member);
    }

    public List<OrgMemberResponse> listMembers(UUID orgId) {
        return memberRepo.findByOrgId(orgId).stream()
                .map(this::toMemberResponse)
                .toList();
    }

    private OrgResponse toOrgResponse(OrganizationEntity org) {
        return new OrgResponse(org.getId(), org.getSlug(), org.getName(), org.getCreatedAt());
    }

    private OrgMemberResponse toMemberResponse(OrgMemberEntity member) {
        return new OrgMemberResponse(member.getId(), member.getOrgId(), member.getUserId(), member.getStatus(), member.getCreatedAt());
    }
}
