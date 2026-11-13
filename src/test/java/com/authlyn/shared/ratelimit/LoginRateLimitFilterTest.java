package com.authlyn.shared.ratelimit;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Verifies the Redis-backed login rate limit end to end through the filter:
 * the 10-attempt limit is enforced per client IP, other clients are unaffected,
 * and rejected attempts are counted in {@code authlyn.ratelimit.blocked}.
 *
 * <p>Redis is replaced by an in-memory map of per-key counters. Memory growth is not a concern
 * any more: the counters live in Redis and expire after the 15-minute window.
 */
class LoginRateLimitFilterTest {

    private SimpleMeterRegistry registry;
    private LoginRateLimitFilter filter;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        Map<String, AtomicLong> counters = new ConcurrentHashMap<>();
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        ValueOperations<String, String> ops = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(ops);
        when(ops.increment(anyString()))
                .thenAnswer(inv -> counters.computeIfAbsent(inv.getArgument(0), k -> new AtomicLong()).incrementAndGet());

        registry = new SimpleMeterRegistry();
        filter = new LoginRateLimitFilter(new ClientIpResolver(""), new LoginAttemptLimiter(redis), registry);
    }

    @Test
    void testRateLimitIsEnforcedPerIpWhileOtherIpsKeepWorking() throws Exception {
        for (int i = 0; i < 5_000; i++) {
            filter.doFilter(loginRequest(toIp(i)), new MockHttpServletResponse(), new MockFilterChain());
        }

        String targetIp = "99.99.99.99";
        AtomicInteger allowed = new AtomicInteger();
        AtomicInteger blocked = new AtomicInteger();
        for (int i = 0; i < 15; i++) {
            MockHttpServletResponse res = new MockHttpServletResponse();
            filter.doFilter(loginRequest(targetIp), res, new MockFilterChain());
            if (res.getStatus() == HttpStatus.TOO_MANY_REQUESTS.value()) {
                blocked.incrementAndGet();
            } else {
                allowed.incrementAndGet();
            }
        }

        assertEquals(10, allowed.get(), "First 10 requests must be allowed");
        assertEquals(5, blocked.get(), "Requests 11-15 must be blocked with 429");
        assertEquals(5.0, registry.get("authlyn.ratelimit.blocked").counter().count());
    }

    @Test
    void testNonLoginPathsAreNeverRateLimited() throws Exception {
        for (int i = 0; i < 20; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/public/auth/signup");
            req.setServletPath("/api/public/auth/signup");
            req.setRemoteAddr("99.99.99.99");
            MockFilterChain chain = new MockFilterChain();
            filter.doFilter(req, new MockHttpServletResponse(), chain);
            assertNotNull(chain.getRequest(), "request must reach the next filter");
        }
        assertEquals(0.0, registry.get("authlyn.ratelimit.blocked").counter().count());
    }

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
