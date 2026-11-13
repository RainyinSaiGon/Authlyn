package com.authlyn.modules.chatbot.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.authlyn.modules.chatbot.domain.ChatbotConversationEntity;

public interface ChatbotConversationJpaRepository extends JpaRepository<ChatbotConversationEntity, UUID> {
}