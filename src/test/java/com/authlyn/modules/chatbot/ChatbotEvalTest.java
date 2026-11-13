package com.authlyn.modules.chatbot;

import java.lang.reflect.Method;
import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.ai.tool.annotation.Tool;

import com.authlyn.modules.chatbot.prompt.ChatbotPrompts;
import com.authlyn.modules.chatbot.service.tools.AdminMetricsTools;
import com.authlyn.modules.chatbot.service.tools.SessionManagementTools;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Behavioral eval suite — asserts on structural properties that must hold
 * regardless of model updates or prompt edits.
 *
 * Run on every deploy. Assertions are stable across model versions.
 */
class ChatbotEvalTest {

    // ── System prompt rules ───────────────────────────────────────────────────

    @Test
    void testSystemPromptRefusesCredentialDisclosure() {
        assertThat(ChatbotPrompts.SYSTEM_PROMPT)
                .contains("Never disclose user")
                .contains("passwords")
                .contains("password hashes")
                .contains("refresh-token values");
    }

    @Test
    void testSystemPromptRequiresToolsForDataQueries() {
        assertThat(ChatbotPrompts.SYSTEM_PROMPT)
                .contains("use the provided tools")
                .contains("Do not fabricate numbers or IDs");
    }

    @Test
    void testSystemPromptRequiresKnowledgeBaseGrounding() {
        assertThat(ChatbotPrompts.SYSTEM_PROMPT)
                .contains("only from the knowledge base context")
                .contains("I don't have that information in the knowledge base");
    }

    @Test
    void testSystemPromptRequiresDestructiveConfirmation() {
        assertThat(ChatbotPrompts.SYSTEM_PROMPT)
                .contains("confirm intent before calling the action tool")
                .contains("Echo the target ID back");
    }

    // ── Tool registration — every @Tool method is present ────────────────────

    @Test
    void testAdminMetricsToolsRegistersExpectedTools() {
        var toolNames = toolNamesOf(AdminMetricsTools.class);
        assertThat(toolNames).contains("countRecentSignups", "countActiveSessions", "recentSignupsByDay");
    }

    @Test
    void testSessionManagementToolsRegistersExpectedTools() {
        var toolNames = toolNamesOf(SessionManagementTools.class);
        assertThat(toolNames).contains("proposeRevokeSession", "confirmRevokeSession", "listUserSessions");
        // The bare revokeSession must NOT exist — only the two-phase pair
        assertThat(toolNames).doesNotContain("revokeSession");
    }

    // ── Data minimization — tools must not expose sensitive fields ────────────

    @Test
    void testListUserSessionsDescriptionExcludesTokenData() {
        String desc = toolDescription(SessionManagementTools.class, "listUserSessions");
        assertThat(desc.toLowerCase())
                .doesNotContain("token")
                .doesNotContain("password")
                .doesNotContain("hash");
        assertThat(desc).contains("session IDs");
    }

    @Test
    void testProposeRevokeSessionDescriptionMentionsConfirmationRequirement() {
        String desc = toolDescription(SessionManagementTools.class, "proposeRevokeSession");
        assertThat(desc).contains("confirmation code");
    }

    // ── Two-phase revocation invariant ───────────────────────────────────────

    @Test
    void testConfirmRevokeSessionRequiresBothParameters() throws NoSuchMethodException {
        Method confirm = SessionManagementTools.class
                .getDeclaredMethod("confirmRevokeSession", String.class, String.class);
        assertThat(confirm.getParameterCount()).isEqualTo(2);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static java.util.List<String> toolNamesOf(Class<?> clazz) {
        return Arrays.stream(clazz.getDeclaredMethods())
                .filter(m -> m.isAnnotationPresent(Tool.class))
                .map(Method::getName)
                .toList();
    }

    private static String toolDescription(Class<?> clazz, String methodName) {
        return Arrays.stream(clazz.getDeclaredMethods())
                .filter(m -> m.getName().equals(methodName) && m.isAnnotationPresent(Tool.class))
                .map(m -> m.getAnnotation(Tool.class).description())
                .findFirst()
                .orElseThrow(() -> new AssertionError("No @Tool method named " + methodName + " on " + clazz));
    }
}
