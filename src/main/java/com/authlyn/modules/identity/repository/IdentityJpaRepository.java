package com.authlyn.modules.identity.repository;

import com.authlyn.modules.identity.domain.IdentityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface IdentityJpaRepository extends JpaRepository<IdentityEntity, UUID> {

    Optional<IdentityEntity> findByProviderAndProviderUserId(String provider, String providerUserId);
}
