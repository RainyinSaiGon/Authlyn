package com.authlyn.modules.identity.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.authlyn.modules.identity.domain.UserEntity;

public interface UserJpaRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByCreatedAtAfter(Instant since);

    @Query(value = """
            SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') AS date, COUNT(*) AS count
            FROM users
            WHERE created_at >= :since
            GROUP BY created_at::date
            ORDER BY created_at::date
            """, nativeQuery = true)
    List<Object[]> countByDaySince(@Param("since") Instant since);
}
