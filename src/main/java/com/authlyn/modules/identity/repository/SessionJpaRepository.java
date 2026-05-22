package com.authlyn.modules.identity.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.authlyn.modules.identity.domain.SessionEntity;

public interface SessionJpaRepository extends JpaRepository<SessionEntity, UUID> {

    List<SessionEntity> findByUserId(UUID userId);

    @Modifying
    @Query("UPDATE SessionEntity s SET s.revokedAt = :revokedAt, s.revokeReason = :reason WHERE s.id = :sessionId AND s.revokedAt IS NULL")
    void revoke(@Param("sessionId") UUID sessionId, @Param("revokedAt") Instant revokedAt, @Param("reason") String reason);

    @Modifying
    @Query("UPDATE SessionEntity s SET s.revokedAt = :revokedAt, s.revokeReason = :reason WHERE s.userId = :userId AND s.revokedAt IS NULL")
    void revokeAllByUserId(@Param("userId") UUID userId, @Param("revokedAt") Instant revokedAt, @Param("reason") String reason);
}
