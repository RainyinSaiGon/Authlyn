package com.authlyn.modules.chatbot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.authlyn.modules.chatbot.domain.KnowledgeManifestEntity;

public interface KnowledgeManifestJpaRepository extends JpaRepository<KnowledgeManifestEntity, String> {
}
