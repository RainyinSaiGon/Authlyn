package com.authlyn.modules.chatbot.service.tools;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.repository.UserJpaRepository;

@Component
public class AdminMetricsTools {

    private final UserJpaRepository users;
    private final SessionJpaRepository sessions;

    public AdminMetricsTools(UserJpaRepository users, SessionJpaRepository sessions) {
        this.users = users;
        this.sessions = sessions;
    }

    @Tool(description = "Count users who signed up within the last N days.")
    public long countRecentSignups(
            @ToolParam(description = "Number of days to look back (1-90)") int days) {
        if (days < 1 || days > 90) {
            throw new IllegalArgumentException("days must be between 1 and 90");
        }
        return users.countByCreatedAtAfter(Instant.now().minus(days, ChronoUnit.DAYS));
    }

    @Tool(description = "Count active sessions (not revoked, not expired) right now.")
    public long countActiveSessions() {
        return sessions.countActive(Instant.now());
    }

    @Tool(description = "List recent sign-ups grouped by day for the last N days.")
    public List<DailySignupCount> recentSignupsByDay(
            @ToolParam(description = "Number of days, 1-30") int days) {
        if (days < 1 || days > 30) {
            throw new IllegalArgumentException("days must be between 1 and 30");
        }
        return users.countByDaySince(Instant.now().minus(days, ChronoUnit.DAYS))
                .stream()
                .map(row -> new DailySignupCount((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    public record DailySignupCount(String date, long count) {}
}
