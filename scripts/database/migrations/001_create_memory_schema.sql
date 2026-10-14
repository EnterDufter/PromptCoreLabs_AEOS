-- ==============================================================================
-- PCL AEOS - SPEC-PCL-AEOS-MEMORY-03 / ADR-0005 Migration
-- Schema: memory (Namespace isolado da Memória Cognitiva e Temporal Graph-RAG)
-- ==============================================================================

-- 1. Habilitação preventiva de extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Criação do namespace isolado (Blindagem do schema public do Paperclip)
CREATE SCHEMA IF NOT EXISTS memory;

-- 3. Entidades do Grafo de Conhecimento
CREATE TABLE IF NOT EXISTS memory.entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL, -- 'module', 'principle', 'adr', 'model', 'agent', 'component'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_memory_entity UNIQUE (name, entity_type)
);

-- 4. Afirmações e Relações com Temporalidade (Claims)
CREATE TABLE IF NOT EXISTS memory.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES memory.entities(id) ON DELETE CASCADE,
    predicate VARCHAR(150) NOT NULL, -- 'implements', 'depends_on', 'conflicts_with', 'prescribes'
    object_id UUID REFERENCES memory.entities(id) ON DELETE SET NULL,
    value_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'TRUSTED' CHECK (status IN ('TRUSTED', 'STALE', 'CONFLICT', 'DEPRECATED', 'SUPERSEDED', 'CONTESTED')),
    authority_tier INT DEFAULT 50, -- 100: ADR/Princípios, 80: Specs, 60: Código, 40: Rascunhos
    superseded_by UUID REFERENCES memory.claims(id) ON DELETE SET NULL,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP WITH TIME ZONE,
    source_model VARCHAR(100) NOT NULL, -- 'claude-3-5-sonnet', 'gpt-4o', 'gemini-1-5-pro', 'manual'
    confidence_score REAL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Recibos Determinísticos de Evidência (Evidence Grounding)
CREATE TABLE IF NOT EXISTS memory.evidence_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES memory.claims(id) ON DELETE CASCADE,
    source_file VARCHAR(500) NOT NULL,
    file_sha256 VARCHAR(64) NOT NULL,
    git_commit_hash VARCHAR(40),
    section_anchor VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Chunks Vetoriais Padronizados em 768D (Ollama nomic-embed-text)
CREATE TABLE IF NOT EXISTS memory.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_file VARCHAR(500) NOT NULL,
    section_title VARCHAR(255),
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    file_sha256 VARCHAR(64) NOT NULL,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Índices de Alta Performance
CREATE INDEX IF NOT EXISTS idx_memory_claims_subject ON memory.claims(subject_id);
CREATE INDEX IF NOT EXISTS idx_memory_claims_status ON memory.claims(status);
CREATE INDEX IF NOT EXISTS idx_memory_receipts_file ON memory.evidence_receipts(source_file);
CREATE INDEX IF NOT EXISTS idx_memory_chunks_embedding_hnsw 
ON memory.document_chunks USING hnsw (embedding vector_cosine_ops);
