package com.authlyn.modules.identity.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.RefreshTokenEntity;
import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.dto.RefreshRequest;
import com.authlyn.modules.identity.repository.RefreshTokenJpaRepository;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;
import com.authlyn.shared.mail.MailService;
import com.authlyn.shared.security.TokenUtil;
import com.authlyn.shared.security.state.RedisSessionStateService;

import io.micrometer.core.instrument.MeterRegistry;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verifies that concurrent refresh token rotations on the same token produce
 * exactly one success. The PESSIMISTIC_WRITE lock on findByTokenHash serializes
 * concurrent reads so every losing thread sees replacedByTokenId != null.
 *
 * Baseline (without the lock): multiple threads see replacedByTokenId == null,
 * all enter the happy path, and the last writer wins on the DB row — issuing
 * duplicate access tokens for the same session.
 */
@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:authlyn-concurrency;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false"
})
class RefreshServiceConcurrencyTest {

    @Autowired private RefreshService refreshService;
    @Autowired private UserJpaRepository userRepository;
    @Autowired private SessionJpaRepository sessionRepository;
    @Autowired private RefreshTokenJpaRepository refreshTokenRepository;
    @Autowired private MeterRegistry meterRegistry;

    @MockitoBean private RedisSessionStateService redisSessionStateService;
    @MockitoBean private MailService mailService;

    private UUID userId;
    private UUID sessionId;
    private String rawToken;

    @BeforeEach
    void seedData() {
        Instant now = Instant.now();

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail("concurrency-test-" + UUID.randomUUID() + "@example.com");
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);
        userId = user.getId();

        SessionEntity session = new SessionEntity();
        session.setId(UUID.randomUUID());
        session.setUserId(userId);
        session.setCreatedAt(now);
        session.setLastSeenAt(now);
        sessionRepository.save(session);
        sessionId = session.getId();

        rawToken = TokenUtil.generateOpaqueToken();
        RefreshTokenEntity token = new RefreshTokenEntity();
        token.setId(UUID.randomUUID());
        token.setUserId(userId);
        token.setSessionId(sessionId);
        token.setTokenHash(TokenUtil.sha256Hex(rawToken));
        token.setIssuedAt(now);
        token.setExpiresAt(now.plus(Duration.ofDays(30)));
        refreshTokenRepository.save(token);
    }

    @AfterEach
    void cleanUp() {
        refreshTokenRepository.deleteAll();
        sessionRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testExactlyOneRotationSucceedsUnderConcurrentRequests() throws InterruptedException {
        int threads = 10;
        CountDownLatch ready  = new CountDownLatch(threads);
        CountDownLatch start  = new CountDownLatch(1);
        CountDownLatch finish = new CountDownLatch(threads);

        AtomicInteger successCount       = new AtomicInteger(0);
        AtomicInteger reuseOrRevokeCount = new AtomicInteger(0);
        List<Exception> unexpected       = Collections.synchronizedList(new ArrayList<>());

        ExecutorService pool = Executors.newFixedThreadPool(threads);
        for (int i = 0; i < threads; i++) {
            pool.submit(() -> {
                try {
                    ready.countDown();
                    start.await();
                    refreshService.rotate(new RefreshRequest(rawToken));
                    successCount.incrementAndGet();
                } catch (ResponseStatusException ex) {
                    if (ex.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                        reuseOrRevokeCount.incrementAndGet();
                    } else {
                        unexpected.add(ex);
                    }
                } catch (Exception e) {
                    unexpected.add(e);
                } finally {
                    finish.countDown();
                }
            });
        }

        ready.await();
        long startNs = System.nanoTime();
        start.countDown();
        boolean completed = finish.await(10, TimeUnit.SECONDS);
        long durationMs = (System.nanoTime() - startNs) / 1_000_000;
        pool.shutdown();

        double reuseTotal = meterRegistry.counter("authlyn.refresh.reuse_detected.total").count();
        double rotateMean = meterRegistry.get("authlyn.refresh.rotate.duration")
                .timer().mean(TimeUnit.MILLISECONDS);

        System.out.printf(
                "[METRIC] threads=%d  success=%d  reuse_or_revoke=%d  total_wall_ms=%d%n",
                threads, successCount.get(), reuseOrRevokeCount.get(), durationMs);
        System.out.printf(
                "[METRIC] micrometer: reuse_detected_total=%.0f  rotate_mean_ms=%.2f%n",
                reuseTotal, rotateMean);
        System.out.println(
                "[BASELINE] Without PESSIMISTIC_WRITE: multiple threads would see " +
                "replacedByTokenId==null simultaneously, issuing duplicate access tokens.");

        assertTrue(completed, "Threads did not finish within timeout");
        assertTrue(unexpected.isEmpty(), "Unexpected errors: " + unexpected);
        assertEquals(1, successCount.get(),
                "Expected exactly 1 rotation to succeed; lock must serialize concurrent reads");
        assertEquals(threads - 1, reuseOrRevokeCount.get(),
                "Remaining " + (threads - 1) + " threads must detect reuse or revocation");
    }
}
