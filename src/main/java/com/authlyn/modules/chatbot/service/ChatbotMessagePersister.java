package com.authlyn.modules.chatbot.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.authlyn.modules.chatbot.domain.ChatbotConversationEntity;
import com.authlyn.modules.chatbot.domain.ChatbotMessageEntity;
import com.authlyn.modules.chatbot.repository.ChatbotConversationJpaRepository;
import com.authlyn.modules.chatbot.repository.ChatbotMessageJpaRepository;

@Component
public class ChatbotMessagePersister {

    private final ChatbotConversationJpaRepository conversations;
    private final ChatbotMessageJpaRepository messages;

    public ChatbotMessagePersister(ChatbotConversationJpaRepository conversations,
                                   ChatbotMessageJpaRepository messages) {
        this.conversations = conversations;
        this.messages = messages;
    }

    @Transactional
    public void saveUserMessage(UUID conversationId, UUID userId, String content) {
        ensureConversationExists(conversationId, userId);
        save(conversationId, "user", content, 0, 0, true);
    }

    @Transactional
    public void saveAssistantMessage(UUID conversationId, String content,
                                     int promptTokens, int completionTokens, boolean completed) {
        var msg = new ChatbotMessageEntity();
        msg.setId(UUID.randomUUID());
        msg.setConversationId(conversationId);
        msg.setRole("assistant");
        msg.setContent(content);
        msg.setPromptTokens(promptTokens > 0 ? promptTokens : null);
        msg.setCompletionTokens(completionTokens > 0 ? completionTokens : null);
        msg.setCompleted(completed);
        msg.setCreatedAt(Instant.now());
        messages.save(msg);
    }

    private void ensureConversationExists(UUID conversationId, UUID userId) {
        if (!conversations.existsById(conversationId)) {
            var conv = new ChatbotConversationEntity();
            conv.setId(conversationId);
            conv.setUserId(userId);
            conv.setCreatedAt(Instant.now());
            conv.setUpdatedAt(Instant.now());
            conversations.save(conv);
        }
    }

    private void save(UUID conversationId, String role, String content,
                      int promptTokens, int completionTokens, boolean completed) {
        var msg = new ChatbotMessageEntity();
        msg.setId(UUID.randomUUID());
        msg.setConversationId(conversationId);
        msg.setRole(role);
        msg.setContent(content);
        msg.setPromptTokens(promptTokens > 0 ? promptTokens : null);
        msg.setCompletionTokens(completionTokens > 0 ? completionTokens : null);
        msg.setCompleted(completed);
        msg.setCreatedAt(Instant.now());
        messages.save(msg);
    }
}
