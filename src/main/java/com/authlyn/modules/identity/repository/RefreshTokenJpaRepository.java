package com.authlyn.modules.identity.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.authlyn.modules.identity.domain.RefreshTokenEntity;

public interface RefreshTokenJpaRepository extends JpaRepository<RefreshTokenEntity, UUID> {

    Optional<RefreshTokenEntity> findByTokenHash(String tokenHash);

    List<RefreshTokenEntity> findBySessionId(UUID sessionId);

    @Modifying
    @Query("UPDATE RefreshTokenEntity t SET t.revokedAt = :revokedAt, t.revokeReason = :reason WHERE t.sessionId = :sessionId AND t.revokedAt IS NULL")
    void revokeAllBySessionId(@Param("sessionId") UUID sessionId, @Param("revokedAt") Instant revokedAt, @Param("reason") String reason);

    @Modifying
    @Query("UPDATE RefreshTokenEntity t SET t.revokedAt = :revokedAt, t.revokeReason = :reason WHERE t.userId = :userId AND t.revokedAt IS NULL")
    void revokeAllByUserId(@Param("userId") UUID userId, @Param("revokedAt") Instant revokedAt, @Param("reason") String reason);
}
