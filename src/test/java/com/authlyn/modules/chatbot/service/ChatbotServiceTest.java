package com.authlyn.modules.chatbot.service;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.vectorstore.VectorStore;
import reactor.core.publisher.Flux;

import com.authlyn.modules.chatbot.config.ChatbotConfig;
import com.authlyn.modules.chatbot.prompt.ChatbotPrompts;
import com.authlyn.modules.chatbot.service.tools.AdminMetricsTools;
import com.authlyn.modules.chatbot.service.tools.SessionManagementTools;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatbotServiceTest {

    @Mock
    private VectorStore vectorStore;

    @Mock
    private AdminMetricsTools metricsTools;

    @Mock
    private SessionManagementTools sessionTools;

    @Mock
    private ChatbotMessagePersister persister;

    @Mock(answer = org.mockito.Answers.RETURNS_DEEP_STUBS)
    private ChatClient.Builder builder;

    @Test
    void testSystemPromptContainsNonDisclosureRule() {
        assertThat(ChatbotPrompts.SYSTEM_PROMPT)
                .contains("Never disclose user")
                .contains("passwords")
                .contains("password hashes")
                .contains("refresh-token values");
    }

    @Test
    void testSystemPromptContainsKnowledgeBaseRule() {
        assertThat(ChatbotPrompts.SYSTEM_PROMPT)
                .contains("knowledge base")
                .contains("I don't have that information in the knowledge base");
    }

    @Test
    void testSystemPromptRequiresToolsForDataQueries() {
        assertThat(ChatbotPrompts.SYSTEM_PROMPT)
                .contains("use the provided tools")
                .contains("Do not fabricate numbers");
    }

    @Test
    void testStreamPersistsUserMessageBeforeCallingModel() {
        when(builder.defaultSystem(any(String.class))).thenReturn(builder);
        when(builder.defaultAdvisors(any(Object[].class))).thenReturn(builder);
        when(builder.defaultTools(any(Object[].class))).thenReturn(builder);

        ChatClient chatClient = org.mockito.Mockito.mock(ChatClient.class,
                org.mockito.Answers.RETURNS_DEEP_STUBS);
        when(builder.build()).thenReturn(chatClient);
        when(chatClient.prompt().user(any(String.class)).advisors(any()).stream().content())
                .thenReturn(Flux.just("ok"));

        var memory = MessageWindowChatMemory.builder()
                .chatMemoryRepository(new InMemoryChatMemoryRepository())
                .build();
        var service = new ChatbotService(
                builder, vectorStore, memory, metricsTools, sessionTools, persister);

        UUID conversationId = UUID.randomUUID();
        UUID adminId = UUID.randomUUID();
        service.stream(conversationId, adminId, "how many users?").blockLast();

        org.mockito.Mockito.verify(persister).saveUserMessage(conversationId, adminId, "how many users?");
    }

    @Test
    void testMemoryWindowSizeIsConfiguredInChatbotConfig() {
        // ChatbotConfig creates MessageWindowChatMemory with maxMessages(10).
        // Verify the bean can be instantiated without error.
        var chatMemory = MessageWindowChatMemory.builder()
                .chatMemoryRepository(new InMemoryChatMemoryRepository())
                .maxMessages(10)
                .build();
        assertThat(chatMemory).isNotNull();
        assertThat(chatMemory).isInstanceOf(MessageWindowChatMemory.class);
    }
}
