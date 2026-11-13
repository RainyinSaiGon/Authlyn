package com.authlyn.modules.chatbot.service.tools;

import java.util.UUID;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.service.LogoutService;

@Component
public class SessionManagementTools {

    private final LogoutService logoutService;
    private final SessionJpaRepository sessions;
    private final PendingRevocationStore revocationStore;

    public SessionManagementTools(LogoutService logoutService,
                                  SessionJpaRepository sessions,
                                  PendingRevocationStore revocationStore) {
        this.logoutService = logoutService;
        this.sessions = sessions;
        this.revocationStore = revocationStore;
    }

    @Tool(description = "List active (non-revoked) sessions for a user. Returns session IDs and timestamps only; never credentials or PII.")
    public String listUserSessions(
            @ToolParam(description = "The UUID of the user") String userId) {
        var userSessions = sessions.findByUserId(UUID.fromString(userId));
        long activeCount = userSessions.stream().filter(s -> s.getRevokedAt() == null).count();
        if (activeCount == 0) {
            return "No active sessions found for user " + userId;
        }
        var sb = new StringBuilder("Active sessions for user ").append(userId).append(":\n");
        for (var s : userSessions) {
            if (s.getRevokedAt() == null) {
                sb.append("- sessionId=").append(s.getId())
                        .append(", created=").append(s.getCreatedAt())
                        .append(", expires=").append(s.getExpiresAt())
                        .append("\n");
            }
        }
        return sb.toString();
    }

    @Tool(description = """
            Propose revoking a session. Returns a one-time confirmation code.
            You MUST show this code to the admin and ask them to confirm before calling confirmRevokeSession.
            The code expires in 5 minutes.
            """)
    public String proposeRevokeSession(
            @ToolParam(description = "The UUID of the session to revoke") String sessionId) {
        UUID id = UUID.fromString(sessionId);
        var session = sessions.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Session not found: " + sessionId));

        String code = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        revocationStore.register(code, id, session.getUserId());

        return String.format(
                "PROPOSAL: Revoke session %s (owned by user %s, created %s).\n" +
                "Confirmation code: %s\n" +
                "Reply with this code to confirm, or ignore to cancel.",
                sessionId, session.getUserId(), session.getCreatedAt(), code);
    }

    @Tool(description = """
            Execute a previously proposed session revocation.
            Requires the exact confirmation code returned by proposeRevokeSession.
            The code is single-use and expires after 5 minutes.
            """)
    public String confirmRevokeSession(
            @ToolParam(description = "The session UUID to revoke — must match the original proposal") String sessionId,
            @ToolParam(description = "The confirmation code from proposeRevokeSession") String confirmationCode) {
        UUID id = UUID.fromString(sessionId);
        var proposal = revocationStore.claim(confirmationCode.toUpperCase(), id);

        if (proposal == null) {
            return "Invalid or expired confirmation code. Please run proposeRevokeSession again.";
        }

        logoutService.logout(proposal.userId(), id);
        return "Session " + sessionId + " has been successfully revoked.";
    }
}
