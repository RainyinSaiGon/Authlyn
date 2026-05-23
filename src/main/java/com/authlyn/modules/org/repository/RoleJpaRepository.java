package com.authlyn.modules.org.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.authlyn.modules.org.domain.RoleEntity;

public interface RoleJpaRepository extends JpaRepository<RoleEntity, UUID> {

    List<RoleEntity> findByOrgId(UUID orgId);

    Optional<RoleEntity> findByOrgIdAndKey(UUID orgId, String key);
}
