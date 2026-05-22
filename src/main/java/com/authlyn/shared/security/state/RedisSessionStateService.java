package com.authlyn.shared.security.state;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisSessionStateService {

    private static final Duration DEFAULT_TTL = Duration.ofDays(30);
    private static final String SESSION_REVOCATION_PREFIX = "authlyn:session:revoked:";

    private final StringRedisTemplate redisTemplate;

    public RedisSessionStateService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void revokeSession(UUID sessionId, Instant expiresAt, String reason) {
        Duration ttl = ttlUntil(expiresAt);
        redisTemplate.opsForValue().set(sessionKey(sessionId), reason == null ? "revoked" : reason, ttl);
    }

    public boolean isSessionRevoked(UUID sessionId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(sessionKey(sessionId)));
    }

    private Duration ttlUntil(Instant expiresAt) {
        if (expiresAt == null) {
            return DEFAULT_TTL;
        }

        Duration ttl = Duration.between(Instant.now(), expiresAt);
        if (ttl.isZero() || ttl.isNegative()) {
            return DEFAULT_TTL;
        }
        return ttl;
    }

    private String sessionKey(UUID sessionId) {
        return SESSION_REVOCATION_PREFIX + sessionId;
    }
}