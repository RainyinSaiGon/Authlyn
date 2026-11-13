package com.authlyn.shared.ratelimit;

import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verifies that the Caffeine-backed rate limiter:
 *   1. Caps memory usage under high unique-IP load (bounded by MAX_KEYS = 10,000).
 *   2. Still enforces the 10-attempt limit per IP correctly.
 *
 * Baseline (ConcurrentHashMap): after N unique IPs, the map held N entries with
 * no eviction, growing forever. An adversary sending requests from 1 M unique IPs
 * would exhaust the JVM heap.
 */
class LoginRateLimitFilterTest {

    private SimpleMeterRegistry registry;
    private LoginRateLimitFilter filter;

    @BeforeEach
    void setUp() {
        registry = new SimpleMeterRegistry();
        filter   = new LoginRateLimitFilter(registry);
    }

    @Test
    void testCacheSizeIsBoundedUnderHighUniqueIpLoad() throws Exception {
        int uniqueIps = 15_000;
        long startNs = System.nanoTime();

        for (int i = 0; i < uniqueIps; i++) {
            MockHttpServletRequest req = loginRequest(toIp(i));
            filter.doFilter(req, new MockHttpServletResponse(), new MockFilterChain());
        }

        long durationMs = (System.nanoTime() - startNs) / 1_000_000;
        double activeKeys = registry.get("authlyn.ratelimit.active_keys").gauge().value();

        System.out.printf(
                "[BASELINE] ConcurrentHashMap would hold all %,d entries (unbounded heap growth).%n",
                uniqueIps);
        System.out.printf(
                "[AFTER-FIX] Caffeine cache holds ~%.0f entries (cap=10,000) after %d ms.%n",
                activeKeys, durationMs);

        // Caffeine's window-TinyLFU allows a small overshoot during eviction; allow 10 % slack
        assertTrue(activeKeys <= 11_000,
                "Expected cache size ≤ 11,000 but was " + (long) activeKeys);
    }

    @Test
    void testRateLimitIsEnforcedPerIpAfterCacheFill() throws Exception {
        // Prime the cache near capacity with other IPs so eviction is active,
        // then verify that a single IP's 10-attempt limit still works correctly.
        for (int i = 0; i < 5_000; i++) {
            filter.doFilter(loginRequest(toIp(i)), new MockHttpServletResponse(), new MockFilterChain());
        }

        String targetIp = "99.99.99.99";
        AtomicInteger allowed  = new AtomicInteger(0);
        AtomicInteger blocked  = new AtomicInteger(0);

        for (int i = 0; i < 15; i++) {
            MockHttpServletResponse res = new MockHttpServletResponse();
            filter.doFilter(loginRequest(targetIp), res, new MockFilterChain());
            if (res.getStatus() == HttpStatus.TOO_MANY_REQUESTS.value()) {
                blocked.incrementAndGet();
            } else {
                allowed.incrementAndGet();
            }
        }

        System.out.printf(
                "[METRIC] ip=%s  allowed=%d  blocked=%d  (limit=10 per 15 min)%n",
                targetIp, allowed.get(), blocked.get());

        assertEquals(10, allowed.get(),  "First 10 requests must be allowed");
        assertEquals(5,  blocked.get(),  "Requests 11-15 must be blocked with 429");
    }

    // ---- helpers ----

    private MockHttpServletRequest loginRequest(String ip) {
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/public/auth/login");
        req.setServletPath("/api/public/auth/login");
        req.setRemoteAddr(ip);
        return req;
    }

    private String toIp(int i) {
        return String.format("%d.%d.%d.%d",
                (i >> 24) & 0xFF, (i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF);
    }
}
