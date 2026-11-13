package com.authlyn.modules.org.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.org.domain.OrgMemberEntity;
import com.authlyn.modules.org.domain.OrganizationEntity;
import com.authlyn.modules.org.domain.RoleEntity;
import com.authlyn.modules.org.repository.OrgMemberJpaRepository;
import com.authlyn.modules.org.repository.OrgMemberRoleJpaRepository;
import com.authlyn.modules.org.repository.OrganizationJpaRepository;
import com.authlyn.modules.org.repository.RoleJpaRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** Org and role endpoints must only act inside the caller's own organization. */
class OrgAccessControlTest {

    private OrganizationJpaRepository orgRepo;
    private OrgMemberJpaRepository memberRepo;
    private RoleJpaRepository roleRepo;
    private OrgMemberRoleJpaRepository memberRoleRepo;
    private OrgService orgService;
    private RoleService roleService;

    private final UUID orgA = UUID.randomUUID();
    private final UUID orgB = UUID.randomUUID();
    private final UUID adminOfA = UUID.randomUUID();
    private final UUID outsider = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        orgRepo = mock(OrganizationJpaRepository.class);
        memberRepo = mock(OrgMemberJpaRepository.class);
        roleRepo = mock(RoleJpaRepository.class);
        memberRoleRepo = mock(OrgMemberRoleJpaRepository.class);
        orgService = new OrgService(orgRepo, memberRepo);
        roleService = new RoleService(roleRepo, memberRepo, memberRoleRepo);

        when(orgRepo.findById(orgA)).thenReturn(Optional.of(org(orgA)));
        when(memberRepo.findByOrgIdAndUserId(orgA, adminOfA)).thenReturn(Optional.of(member(orgA, adminOfA, "admin")));
        when(memberRepo.findByOrgIdAndUserId(orgA, outsider)).thenReturn(Optional.empty());
        when(memberRepo.findByOrgId(orgA)).thenReturn(List.of(member(orgA, adminOfA, "admin")));
    }

    @Test
    void testNonMemberCannotReadOrganization() {
        assertNotFound(() -> orgService.getOrg(orgA, outsider));
    }

    @Test
    void testNonMemberCannotListMembers() {
        assertNotFound(() -> orgService.listMembers(orgA, outsider));
    }

    @Test
    void testNonMemberCannotListRoles() {
        assertNotFound(() -> roleService.listRoles(orgA, outsider));
        verify(roleRepo, never()).findByOrgId(any());
    }

    @Test
    void testMemberCanReadOrganizationAndMembers() {
        assertEquals(orgA, orgService.getOrg(orgA, adminOfA).id());
        assertEquals(1, orgService.listMembers(orgA, adminOfA).size());
    }

    @Test
    void testAdminCannotRevokeRoleFromMemberOfAnotherOrganization() {
        OrgMemberEntity memberOfB = member(orgB, UUID.randomUUID(), "active");
        RoleEntity roleOfB = role(orgB);
        when(memberRepo.findById(memberOfB.getId())).thenReturn(Optional.of(memberOfB));
        when(roleRepo.findById(roleOfB.getId())).thenReturn(Optional.of(roleOfB));

        assertNotFound(() -> roleService.revokeRole(orgA, memberOfB.getId(), roleOfB.getId(), adminOfA));
        verify(memberRoleRepo, never()).deleteByIdOrgMemberIdAndIdRoleId(any(), any());
    }

    @Test
    void testAdminCannotRevokeAnotherOrganizationsRoleFromOwnMember() {
        OrgMemberEntity memberOfA = member(orgA, UUID.randomUUID(), "active");
        RoleEntity roleOfB = role(orgB);
        when(memberRepo.findById(memberOfA.getId())).thenReturn(Optional.of(memberOfA));
        when(roleRepo.findById(roleOfB.getId())).thenReturn(Optional.of(roleOfB));

        assertNotFound(() -> roleService.revokeRole(orgA, memberOfA.getId(), roleOfB.getId(), adminOfA));
        verify(memberRoleRepo, never()).deleteByIdOrgMemberIdAndIdRoleId(any(), any());
    }

    @Test
    void testAdminCanRevokeRoleInsideOwnOrganization() {
        OrgMemberEntity memberOfA = member(orgA, UUID.randomUUID(), "active");
        RoleEntity roleOfA = role(orgA);
        when(memberRepo.findById(memberOfA.getId())).thenReturn(Optional.of(memberOfA));
        when(roleRepo.findById(roleOfA.getId())).thenReturn(Optional.of(roleOfA));

        roleService.revokeRole(orgA, memberOfA.getId(), roleOfA.getId(), adminOfA);

        verify(memberRoleRepo).deleteByIdOrgMemberIdAndIdRoleId(memberOfA.getId(), roleOfA.getId());
    }

    private static void assertNotFound(Runnable call) {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, call::run);
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    private static OrganizationEntity org(UUID id) {
        OrganizationEntity org = new OrganizationEntity();
        org.setId(id);
        org.setSlug("org-" + id);
        org.setName("Org");
        org.setCreatedAt(Instant.now());
        return org;
    }

    private static OrgMemberEntity member(UUID orgId, UUID userId, String status) {
        OrgMemberEntity member = new OrgMemberEntity();
        member.setId(UUID.randomUUID());
        member.setOrgId(orgId);
        member.setUserId(userId);
        member.setStatus(status);
        member.setCreatedAt(Instant.now());
        return member;
    }

    private static RoleEntity role(UUID orgId) {
        RoleEntity role = new RoleEntity();
        role.setId(UUID.randomUUID());
        role.setOrgId(orgId);
        role.setKey("editor");
        role.setName("Editor");
        role.setCreatedAt(Instant.now());
        return role;
    }
}
