package com.authlyn.modules.org.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.authlyn.modules.org.domain.OrgMemberRoleEntity;
import com.authlyn.modules.org.domain.OrgMemberRoleId;

public interface OrgMemberRoleJpaRepository extends JpaRepository<OrgMemberRoleEntity, OrgMemberRoleId> {

    List<OrgMemberRoleEntity> findByIdOrgMemberId(UUID orgMemberId);

    @Modifying
    void deleteByIdOrgMemberIdAndIdRoleId(UUID orgMemberId, UUID roleId);
}
