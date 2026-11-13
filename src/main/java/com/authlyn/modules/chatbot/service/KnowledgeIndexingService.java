package com.authlyn.modules.chatbot.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

import jakarta.annotation.PostConstruct;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.authlyn.modules.chatbot.domain.KnowledgeManifestEntity;
import com.authlyn.modules.chatbot.repository.KnowledgeManifestJpaRepository;

/**
 * Indexes the knowledge base into pgvector at startup. Needs the V4 schema (PostgreSQL + pgvector),
 * so H2-backed tests switch it off with {@code authlyn.chatbot.index-on-startup=false}.
 */
@Service
@ConditionalOnProperty(name = "authlyn.chatbot.index-on-startup", havingValue = "true", matchIfMissing = true)
public class KnowledgeIndexingService implements ResourceLoaderAware {

    private record KnowledgeSource(String path, String name) {}

    private static final List<KnowledgeSource> SOURCES = List.of(
            new KnowledgeSource("classpath:knowledge/ARCHITECTURE.md", "ARCHITECTURE.md"),
            new KnowledgeSource("classpath:knowledge/SECURITY.md", "SECURITY.md")
    );

    private final VectorStore vectorStore;
    private final KnowledgeManifestJpaRepository manifest;
    private final JdbcTemplate jdbc;
    private ResourceLoader resourceLoader;

    public KnowledgeIndexingService(VectorStore vectorStore,
                                    KnowledgeManifestJpaRepository manifest,
                                    JdbcTemplate jdbc) {
        this.vectorStore = vectorStore;
        this.manifest = manifest;
        this.jdbc = jdbc;
    }

    @Override
    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    @Transactional
    void indexOnStartup() {
        var splitter = new TokenTextSplitter();

        for (var source : SOURCES) {
            Resource resource = resourceLoader.getResource(source.path());
            if (!resource.exists()) {
                continue;
            }

            String currentHash = sha256(resource);
            var existing = manifest.findById(source.name());

            if (existing.isPresent() && existing.get().getContentHash().equals(currentHash)) {
                continue;
            }

            // Delete stale embeddings for this source before re-indexing
            jdbc.update("DELETE FROM vector_store WHERE metadata->>'source' = ?", source.name());

            List<Document> docs = new ArrayList<>();
            for (Document raw : new TextReader(resource).get()) {
                var metadata = new java.util.HashMap<>(raw.getMetadata());
                metadata.put("source", source.name());
                docs.add(new Document(raw.getText(), metadata));
            }
            vectorStore.add(splitter.apply(docs));

            var entry = new KnowledgeManifestEntity();
            entry.setSourceName(source.name());
            entry.setContentHash(currentHash);
            entry.setIndexedAt(Instant.now());
            manifest.save(entry);
        }
    }

    private static String sha256(Resource resource) {
        try (InputStream in = resource.getInputStream()) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) != -1) {
                digest.update(buf, 0, n);
            }
            return HexFormat.of().formatHex(digest.digest());
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new IllegalStateException("Failed to hash knowledge resource: " + resource.getFilename(), e);
        }
    }
}
