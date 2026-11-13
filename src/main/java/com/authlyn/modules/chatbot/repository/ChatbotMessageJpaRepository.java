package com.authlyn.modules.chatbot.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.authlyn.modules.chatbot.domain.ChatbotMessageEntity;

public interface ChatbotMessageJpaRepository extends JpaRepository<ChatbotMessageEntity, UUID> {

    List<ChatbotMessageEntity> findByConversationIdOrderByCreatedAtAsc(UUID conversationId);
}