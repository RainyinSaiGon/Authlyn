package com.authlyn.modules.chatbot.dto;

import java.time.Instant;
import java.util.UUID;

public record ChatbotMessageResponse(
        UUID id,
        UUID conversationId,
        String role,
        String content,
        Instant createdAt
) {}