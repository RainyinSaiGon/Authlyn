CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS vector_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536)
);

CREATE INDEX IF NOT EXISTS vector_store_embedding_idx
    ON vector_store USING hnsw (embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
    role VARCHAR(16) NOT NULL CHECK (role IN ('user', 'assistant', 'tool', 'system')),
    content TEXT,
    tool_calls JSONB,
    prompt_tokens INT,
    completion_tokens INT,
    model VARCHAR(64),
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conv
    ON chatbot_messages(conversation_id, created_at);

-- Tracks content hashes of indexed knowledge docs to enable idempotent re-indexing
CREATE TABLE IF NOT EXISTS knowledge_index_manifest (
    source_name VARCHAR(255) PRIMARY KEY,
    content_hash VARCHAR(64) NOT NULL,
    indexed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
