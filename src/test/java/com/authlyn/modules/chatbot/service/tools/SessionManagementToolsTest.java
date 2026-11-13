package com.authlyn.modules.chatbot.service.tools;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.SessionEntity;
import com.authlyn.modules.identity.repository.SessionJpaRepository;
import com.authlyn.modules.identity.service.LogoutService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SessionManagementToolsTest {

    @Mock LogoutService logoutService;
    @Mock SessionJpaRepository sessions;

    @InjectMocks
    PendingRevocationStore revocationStore;

    @Test
    void testProposeDoesNotExecuteRevocation() {
        UUID sessionId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        SessionEntity session = sessionEntity(sessionId, userId);
        when(sessions.findById(sessionId)).thenReturn(Optional.of(session));

        var tools = new SessionManagementTools(logoutService, sessions, revocationStore);
        String result = tools.proposeRevokeSession(sessionId.toString());

        assertThat(result).contains("PROPOSAL");
        assertThat(result).contains(sessionId.toString());
        verify(logoutService, never()).logout(any(), any());
    }

    @Test
    void testConfirmRevokesSessionAfterValidProposal() {
        UUID sessionId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        SessionEntity session = sessionEntity(sessionId, userId);
        when(sessions.findById(sessionId)).thenReturn(Optional.of(session));

        var tools = new SessionManagementTools(logoutService, sessions, revocationStore);
        String proposal = tools.proposeRevokeSession(sessionId.toString());
        String code = extractCode(proposal);

        String result = tools.confirmRevokeSession(sessionId.toString(), code);

        assertThat(result).contains("successfully revoked");
        verify(logoutService).logout(userId, sessionId);
    }

    @Test
    void testConfirmFailsWithWrongCode() {
        UUID sessionId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        SessionEntity session = sessionEntity(sessionId, userId);
        when(sessions.findById(sessionId)).thenReturn(Optional.of(session));

        var tools = new SessionManagementTools(logoutService, sessions, revocationStore);
        tools.proposeRevokeSession(sessionId.toString());

        String result = tools.confirmRevokeSession(sessionId.toString(), "WRONGCOD");

        assertThat(result).contains("Invalid or expired");
        verify(logoutService, never()).logout(any(), any());
    }

    @Test
    void testConfirmCodeIsOneTime() {
        UUID sessionId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        SessionEntity session = sessionEntity(sessionId, userId);
        when(sessions.findById(sessionId)).thenReturn(Optional.of(session));

        var tools = new SessionManagementTools(logoutService, sessions, revocationStore);
        String proposal = tools.proposeRevokeSession(sessionId.toString());
        String code = extractCode(proposal);

        tools.confirmRevokeSession(sessionId.toString(), code);
        String secondAttempt = tools.confirmRevokeSession(sessionId.toString(), code);

        assertThat(secondAttempt).contains("Invalid or expired");
        verify(logoutService).logout(userId, sessionId); // called exactly once
    }

    @Test
    void testProposeNonexistentSessionThrows() {
        when(sessions.findById(any())).thenReturn(Optional.empty());
        var tools = new SessionManagementTools(logoutService, sessions, revocationStore);
        assertThatThrownBy(() -> tools.proposeRevokeSession(UUID.randomUUID().toString()))
                .isInstanceOf(ResponseStatusException.class);
    }

    private SessionEntity sessionEntity(UUID id, UUID userId) {
        var s = new SessionEntity();
        s.setId(id);
        s.setUserId(userId);
        s.setCreatedAt(Instant.now());
        return s;
    }

    private String extractCode(String proposal) {
        // Code is on a line like "Confirmation code: XXXXXXXX"
        for (String line : proposal.split("\n")) {
            if (line.contains("Confirmation code:")) {
                return line.split(":")[1].trim();
            }
        }
        throw new IllegalStateException("No code found in proposal: " + proposal);
    }
}
