package com.authlyn.modules.chatbot.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "knowledge_index_manifest")
public class KnowledgeManifestEntity {

    @Id
    @Column(name = "source_name")
    private String sourceName;

    @Column(name = "content_hash", nullable = false)
    private String contentHash;

    @Column(name = "indexed_at", nullable = false)
    private Instant indexedAt;

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getContentHash() { return contentHash; }
    public void setContentHash(String contentHash) { this.contentHash = contentHash; }

    public Instant getIndexedAt() { return indexedAt; }
    public void setIndexedAt(Instant indexedAt) { this.indexedAt = indexedAt; }
}
