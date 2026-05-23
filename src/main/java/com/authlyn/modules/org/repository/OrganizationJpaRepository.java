package com.authlyn.modules.org.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.authlyn.modules.org.domain.OrganizationEntity;

public interface OrganizationJpaRepository extends JpaRepository<OrganizationEntity, UUID> {

    Optional<OrganizationEntity> findBySlug(String slug);

    List<OrganizationEntity> findAllByIdIn(Collection<UUID> ids);
}
