-- ==============================================================================
-- PCL AEOS - SPEC-PCL-AEOS-COCKPIT-01 / ADR-0014 Migration
-- Schema: cockpit (Namespace isolado de Projetos, Conversas, Artefatos e Vault)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Criação do namespace isolado cockpit
CREATE SCHEMA IF NOT EXISTS cockpit;

-- 2. Tabela de Projetos do Cockpit
CREATE TABLE IF NOT EXISTS cockpit.projects (
    id VARCHAR(100) PRIMARY KEY,
    workspace_id VARCHAR(100) NOT NULL DEFAULT 'default',
    owner_user_id VARCHAR(100) NOT NULL DEFAULT 'usr_01h8x9p',
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Conversas
CREATE TABLE IF NOT EXISTS cockpit.conversations (
    id VARCHAR(100) PRIMARY KEY,
    project_id VARCHAR(100) REFERENCES cockpit.projects(id) ON DELETE SET NULL,
    workspace_id VARCHAR(100) NOT NULL DEFAULT 'default',
    owner_user_id VARCHAR(100) NOT NULL DEFAULT 'usr_01h8x9p',
    title VARCHAR(300) NOT NULL,
    date_group VARCHAR(50) DEFAULT 'Hoje',
    is_pinned BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Mensagens
CREATE TABLE IF NOT EXISTS cockpit.messages (
    id VARCHAR(100) PRIMARY KEY,
    conversation_id VARCHAR(100) NOT NULL REFERENCES cockpit.conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'agent', 'system')),
    text TEXT NOT NULL,
    model VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Artefatos Soberanos (Acervo Unificado da Biblioteca)
CREATE TABLE IF NOT EXISTS cockpit.artifacts (
    id VARCHAR(100) PRIMARY KEY,
    project_id VARCHAR(100) REFERENCES cockpit.projects(id) ON DELETE SET NULL,
    conversation_id VARCHAR(100) REFERENCES cockpit.conversations(id) ON DELETE SET NULL,
    message_id VARCHAR(100) REFERENCES cockpit.messages(id) ON DELETE SET NULL,
    workspace_id VARCHAR(100) NOT NULL DEFAULT 'default',
    owner_user_id VARCHAR(100) NOT NULL DEFAULT 'usr_01h8x9p',
    title VARCHAR(300) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'diagram', 'infographic', 'app', 'slide', 'sheet', 'document', 'audio', 'video', 'meeting_capture'
    format_ext VARCHAR(20) NOT NULL DEFAULT '.md', -- '.svg', '.html', '.pptx', '.xlsx', '.wav', '.mp4', '.pdf', '.md'
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    vault_blob_sha256 VARCHAR(64),
    content_text TEXT,
    preview_svg TEXT,
    size_bytes BIGINT DEFAULT 0,
    r2_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de Estudos e Arquivos Anexados (RAG Local)
CREATE TABLE IF NOT EXISTS cockpit.study_sources (
    id VARCHAR(100) PRIMARY KEY,
    project_id VARCHAR(100) REFERENCES cockpit.projects(id) ON DELETE SET NULL,
    conversation_id VARCHAR(100) REFERENCES cockpit.conversations(id) ON DELETE SET NULL,
    workspace_id VARCHAR(100) NOT NULL DEFAULT 'default',
    owner_user_id VARCHAR(100) NOT NULL DEFAULT 'usr_01h8x9p',
    filename VARCHAR(300) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    page_count INT DEFAULT 1,
    size_bytes BIGINT DEFAULT 0,
    vault_blob_sha256 VARCHAR(64) NOT NULL,
    extracted_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Índices de Alta Performance para a Biblioteca e Buscas
CREATE INDEX IF NOT EXISTS idx_cockpit_artifacts_type ON cockpit.artifacts(type);
CREATE INDEX IF NOT EXISTS idx_cockpit_artifacts_fav ON cockpit.artifacts(is_favorite);
CREATE INDEX IF NOT EXISTS idx_cockpit_artifacts_proj ON cockpit.artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_artifacts_conv ON cockpit.artifacts(conversation_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_artifacts_owner ON cockpit.artifacts(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_artifacts_sha ON cockpit.artifacts(vault_blob_sha256);
CREATE INDEX IF NOT EXISTS idx_cockpit_convs_proj ON cockpit.conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_msgs_conv ON cockpit.messages(conversation_id);

