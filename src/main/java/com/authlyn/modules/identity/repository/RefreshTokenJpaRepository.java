package com.authlyn.modules.identity.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.authlyn.modules.identity.domain.RefreshTokenEntity;

import jakarta.persistence.LockModeType;

public interface RefreshTokenJpaRepository extends JpaRepository<RefreshTokenEntity, UUID> {

    /**
     * Row-locks the token (SELECT ... FOR UPDATE) for the caller's transaction. Without it, two
     * concurrent refreshes of one token both see it unrotated and both succeed, so reuse
     * detection never fires.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<RefreshTokenEntity> findByTokenHash(String tokenHash);

    List<RefreshTokenEntity> findBySessionId(UUID sessionId);

    @Modifying
    @Query("UPDATE RefreshTokenEntity t SET t.revokedAt = :revokedAt, t.revokeReason = :reason WHERE t.sessionId = :sessionId AND t.revokedAt IS NULL")
    void revokeAllBySessionId(@Param("sessionId") UUID sessionId, @Param("revokedAt") Instant revokedAt, @Param("reason") String reason);

    @Modifying
    @Query("UPDATE RefreshTokenEntity t SET t.revokedAt = :revokedAt, t.revokeReason = :reason WHERE t.userId = :userId AND t.revokedAt IS NULL")
    void revokeAllByUserId(@Param("userId") UUID userId, @Param("revokedAt") Instant revokedAt, @Param("reason") String reason);
}
