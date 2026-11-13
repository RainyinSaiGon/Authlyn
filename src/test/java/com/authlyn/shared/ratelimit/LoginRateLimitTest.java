package com.authlyn.shared.ratelimit;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.jupiter.api.Test;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class LoginRateLimitTest {

    @Test
    void testForwardedHeaderIsIgnoredWithoutTrustedProxies() {
        ClientIpResolver resolver = new ClientIpResolver("");

        assertEquals("203.0.113.9", resolver.resolve(request("203.0.113.9", "1.2.3.4")));
    }

    @Test
    void testForwardedHeaderIsIgnoredWhenPeerIsNotATrustedProxy() {
        ClientIpResolver resolver = new ClientIpResolver("10.0.0.0/8");

        assertEquals("203.0.113.9", resolver.resolve(request("203.0.113.9", "1.2.3.4")));
    }

    @Test
    void testBehindTrustedProxyTheRightmostUntrustedHopIsTheClient() {
        ClientIpResolver resolver = new ClientIpResolver("10.0.0.0/8, 192.168.0.0/16");

        // The client spoofed "1.2.3.4"; the edge proxy appended the real address 198.51.100.7,
        // then an internal proxy 192.168.1.5 forwarded it to Authlyn's peer 10.0.0.2.
        String client = resolver.resolve(request("10.0.0.2", "1.2.3.4, 198.51.100.7, 192.168.1.5"));

        assertEquals("198.51.100.7", client);
    }

    @Test
    void testUnparseableHopIsNeverTrusted() {
        ClientIpResolver resolver = new ClientIpResolver("10.0.0.0/8");

        assertEquals("not-an-ip", resolver.resolve(request("10.0.0.2", "not-an-ip")));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testBlocksAfterTheLimitAndStartsTheWindowOnFirstAttempt() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        ValueOperations<String, String> ops = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(ops);
        AtomicLong counter = new AtomicLong();
        when(ops.increment(anyString())).thenAnswer(inv -> counter.incrementAndGet());
        LoginAttemptLimiter limiter = new LoginAttemptLimiter(redis);

        for (int i = 0; i < LoginAttemptLimiter.MAX_ATTEMPTS; i++) {
            assertFalse(limiter.isBlocked("198.51.100.7"));
        }
        assertTrue(limiter.isBlocked("198.51.100.7"));

        verify(redis, times(1)).expire(eq("authlyn:ratelimit:login:198.51.100.7"), eq(Duration.ofMinutes(15)));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testRedisOutageFailsOpen() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        ValueOperations<String, String> ops = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(ops);
        when(ops.increment(anyString())).thenThrow(new RedisConnectionFailureException("down"));

        assertFalse(new LoginAttemptLimiter(redis).isBlocked("198.51.100.7"));
    }

    private static MockHttpServletRequest request(String peer, String forwardedFor) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr(peer);
        request.addHeader("X-Forwarded-For", forwardedFor);
        return request;
    }
}
