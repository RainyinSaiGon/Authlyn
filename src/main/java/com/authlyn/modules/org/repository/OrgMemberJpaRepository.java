package com.authlyn.modules.org.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.authlyn.modules.org.domain.OrgMemberEntity;

public interface OrgMemberJpaRepository extends JpaRepository<OrgMemberEntity, UUID> {

    Optional<OrgMemberEntity> findByOrgIdAndUserId(UUID orgId, UUID userId);

    List<OrgMemberEntity> findByOrgId(UUID orgId);

    List<OrgMemberEntity> findByUserId(UUID userId);
}
