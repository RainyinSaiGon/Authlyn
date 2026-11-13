package com.authlyn.shared.ratelimit;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

/**
 * Counts login attempts per client in Redis, so the limit holds across every Authlyn instance
 * (an in-memory counter is per instance, so N replicas allow N times the limit).
 *
 * <p>Fixed window: the first attempt starts a {@link #WINDOW} TTL; further attempts in that
 * window increment the same key. If Redis is unreachable the attempt is allowed and a warning
 * is logged, so a cache outage does not lock every user out of login.
 */
@Component
public class LoginAttemptLimiter {

    static final int MAX_ATTEMPTS = 10;
    static final Duration WINDOW = Duration.ofMinutes(15);
    private static final String KEY_PREFIX = "authlyn:ratelimit:login:";

    private static final Logger log = LoggerFactory.getLogger(LoginAttemptLimiter.class);

    private final StringRedisTemplate redisTemplate;

    public LoginAttemptLimiter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /** Records one attempt for the client and returns true when it is over the limit. */
    public boolean isBlocked(String clientKey) {
        String key = KEY_PREFIX + clientKey;
        try {
            Long attempts = redisTemplate.opsForValue().increment(key);
            if (attempts != null && attempts == 1L) {
                redisTemplate.expire(key, WINDOW);
            }
            return attempts != null && attempts > MAX_ATTEMPTS;
        } catch (RuntimeException ex) {
            log.warn("Login rate limit check failed open: {}", ex.getMessage());
            return false;
        }
    }
}
