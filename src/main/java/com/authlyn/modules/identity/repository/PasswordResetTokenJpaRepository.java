package com.authlyn.modules.identity.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.authlyn.modules.identity.domain.PasswordResetTokenEntity;

public interface PasswordResetTokenJpaRepository extends JpaRepository<PasswordResetTokenEntity, UUID> {

    Optional<PasswordResetTokenEntity> findByTokenHash(String tokenHash);

    List<PasswordResetTokenEntity> findByUserId(UUID userId);

    @Modifying
    @Query("UPDATE PasswordResetTokenEntity t SET t.usedAt = :usedAt WHERE t.id = :tokenId AND t.usedAt IS NULL AND t.revokedAt IS NULL")
    void markUsed(@Param("tokenId") UUID tokenId, @Param("usedAt") Instant usedAt);

    @Modifying
    @Query("UPDATE PasswordResetTokenEntity t SET t.revokedAt = :revokedAt, t.revokeReason = :reason WHERE t.userId = :userId AND t.usedAt IS NULL AND t.revokedAt IS NULL")
    void revokeAllByUserId(@Param("userId") UUID userId, @Param("revokedAt") Instant revokedAt, @Param("reason") String reason);
}