package com.authlyn.modules.chatbot.service.tools;

import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class PendingRevocationStore {

    private static final long TTL_SECONDS = 300;

    private final Map<String, Proposal> pending = new ConcurrentHashMap<>();

    public void register(String confirmationCode, UUID sessionId, UUID userId) {
        evictExpired();
        pending.put(confirmationCode, new Proposal(sessionId, userId, Instant.now()));
    }

    public Proposal claim(String confirmationCode, UUID sessionId) {
        evictExpired();
        Proposal proposal = pending.get(confirmationCode);
        if (proposal == null || !proposal.sessionId().equals(sessionId)) {
            return null;
        }
        pending.remove(confirmationCode);
        return proposal;
    }

    private void evictExpired() {
        Instant cutoff = Instant.now().minusSeconds(TTL_SECONDS);
        Iterator<Map.Entry<String, Proposal>> it = pending.entrySet().iterator();
        while (it.hasNext()) {
            if (it.next().getValue().createdAt().isBefore(cutoff)) {
                it.remove();
            }
        }
    }

    public record Proposal(UUID sessionId, UUID userId, Instant createdAt) {}
}
