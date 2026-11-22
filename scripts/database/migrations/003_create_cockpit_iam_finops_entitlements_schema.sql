-- ==============================================================================
-- PCL AEOS - SPEC-PCL-AEOS-COCKPIT-M0 / ADR-0014 & ADR-0017 Migration (SQL 003)
-- Schema: cockpit (Multi-Tenant, Entitlements GrowthOS, IAM, Sessões 2-Devices,
--                  FinOps Hard Lock, Audit Chain SHA-256 e Cofre AES-256-GCM)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE SCHEMA IF NOT EXISTS cockpit;

-- 1. Tabela Multi-Tenant de Organizações (cockpit.tenants)
CREATE TABLE IF NOT EXISTS cockpit.tenants (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'sovereign_core'
        CHECK (plan_tier IN ('trial_14d', 'sovereign_core', 'growth_os_pro', 'enterprise_appliance')),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'TRIAL', 'SUSPENDED', 'CANCELLED')),
    trial_starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
    isol_namespace VARCHAR(120) NOT NULL DEFAULT 'default',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela Multi-Tenant de Entitlements & Módulos de Crescimento (PCL GrowthOS™)
CREATE TABLE IF NOT EXISTS cockpit.entitlements (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    module_key VARCHAR(100) NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    access_state VARCHAR(40) NOT NULL DEFAULT 'locked_upsell'
        CHECK (access_state IN ('enabled', 'trial_14d', 'locked_upsell', 'expired', 'revoked')),
    trial_started_at TIMESTAMP WITH TIME ZONE,
    trial_expires_at TIMESTAMP WITH TIME ZONE,
    quota_limit_units INT NOT NULL DEFAULT 0,
    quota_used_units INT NOT NULL DEFAULT 0,
    plugin_manifest JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cockpit_tenant_module_entitlement UNIQUE (tenant_id, module_key)
);

-- 3. Tabela de Usuários Corporativos (cockpit.users)
CREATE TABLE IF NOT EXISTS cockpit.users (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(60) NOT NULL DEFAULT 'operator'
        CHECK (role IN ('sovereign_admin', 'tech_lead', 'executive', 'operator', 'auditor')),
    department VARCHAR(120) DEFAULT 'Executive & Architecture',
    max_concurrent_devices INT NOT NULL DEFAULT 2,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'INVITED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Credenciais & Identidades OAuth2/OIDC (cockpit.user_credentials)
CREATE TABLE IF NOT EXISTS cockpit.user_credentials (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES cockpit.users(id) ON DELETE CASCADE,
    auth_provider VARCHAR(50) NOT NULL
        CHECK (auth_provider IN ('local_password', 'google', 'microsoft', 'github', 'linkedin')),
    provider_subject_id VARCHAR(255),
    password_hash TEXT,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cockpit_user_provider UNIQUE (user_id, auth_provider)
);

-- 5. Tabela de Sessões Ativas & Trava Física de 2 Dispositivos (cockpit.sessions)
CREATE TABLE IF NOT EXISTS cockpit.sessions (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES cockpit.users(id) ON DELETE CASCADE,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    token_sha256 VARCHAR(64) UNIQUE NOT NULL,
    device_fingerprint VARCHAR(128) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(64),
    user_agent TEXT,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason VARCHAR(255),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de Orçamentos FinOps & Trava Física Hard Lock (cockpit.finops_budgets)
CREATE TABLE IF NOT EXISTS cockpit.finops_budgets (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    department_or_squad VARCHAR(120) NOT NULL,
    monthly_cap_usd NUMERIC(12, 4) NOT NULL DEFAULT 50.0000,
    current_spend_usd NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    monthly_cap_tokens BIGINT NOT NULL DEFAULT 50000000,
    current_spend_tokens BIGINT NOT NULL DEFAULT 0,
    hard_lock_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    hard_lock_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    fallback_local_model VARCHAR(120) NOT NULL DEFAULT 'qwen2.5-coder:7b-instruct-q4_K_M',
    period_month VARCHAR(7) NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP, 'YYYY-MM'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cockpit_finops_tenant_dept_month UNIQUE (tenant_id, department_or_squad, period_month)
);

-- 7. Tabela de Trilha de Auditoria Imutável Encadeada SHA-256 (cockpit.audit_chain_sha256)
CREATE TABLE IF NOT EXISTS cockpit.audit_chain_sha256 (
    seq_id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    actor_user_id VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    resource_target VARCHAR(255) NOT NULL,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_hash_sha256 VARCHAR(64) NOT NULL,
    record_hash_sha256 VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabela do Cofre Criptográfico de Conectores Externos (AES-256-GCM)
CREATE TABLE IF NOT EXISTS cockpit.connector_vault_aes256 (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    owner_user_id VARCHAR(100) REFERENCES cockpit.users(id) ON DELETE SET NULL,
    connector_key VARCHAR(100) NOT NULL,
    cipher_algorithm VARCHAR(30) NOT NULL DEFAULT 'AES-256-GCM',
    iv_hex VARCHAR(64) NOT NULL,
    auth_tag_hex VARCHAR(64) NOT NULL,
    ciphertext_hex TEXT NOT NULL,
    key_fingerprint_sha256 VARCHAR(64) NOT NULL,
    scopes TEXT[] DEFAULT '{}',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
    expires_at TIMESTAMP WITH TIME ZONE,
    rotated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cockpit_vault_tenant_connector UNIQUE (tenant_id, connector_key)
);

-- 9. Índices de Alta Performance para Multi-Tenancy, IAM, FinOps e Auditoria
CREATE INDEX IF NOT EXISTS idx_cockpit_entitlements_tenant ON cockpit.entitlements(tenant_id, access_state);
CREATE INDEX IF NOT EXISTS idx_cockpit_users_tenant_email ON cockpit.users(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_cockpit_sessions_user_active ON cockpit.sessions(user_id, is_revoked, expires_at);
CREATE INDEX IF NOT EXISTS idx_cockpit_finops_tenant_month ON cockpit.finops_budgets(tenant_id, period_month);
CREATE INDEX IF NOT EXISTS idx_cockpit_audit_chain_tenant_seq ON cockpit.audit_chain_sha256(tenant_id, seq_id DESC);
CREATE INDEX IF NOT EXISTS idx_cockpit_vault_tenant_key ON cockpit.connector_vault_aes256(tenant_id, connector_key);

-- 9B. Marco M2 — Memória Vetorial Permanente de #documentos (PGVector 384d + Memória Auto-Limpante Laya)
CREATE TABLE IF NOT EXISTS cockpit.document_vectors (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    study_id VARCHAR(100) NOT NULL,
    filename VARCHAR(300) NOT NULL,
    mime_type VARCHAR(100) NOT NULL DEFAULT 'text/markdown',
    chunk_index INT NOT NULL DEFAULT 0,
    page_number INT NOT NULL DEFAULT 1,
    content_text TEXT NOT NULL,
    content_sha256 VARCHAR(64) NOT NULL,
    embedding vector(384),
    embedding_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    dedup_action VARCHAR(30) NOT NULL DEFAULT 'ACTION_ADD'
        CHECK (dedup_action IN ('ACTION_ADD', 'ACTION_UPDATE', 'ACTION_KEEP_BOTH', 'ACTION_DISCARD')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cockpit_doc_vectors_tenant_study ON cockpit.document_vectors(tenant_id, study_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_doc_vectors_sha ON cockpit.document_vectors(content_sha256);

-- 9C. PROAA-17 — Contador Auditável 'Token Tax Saved' (PCL Reflex FinOps Pricing)
CREATE TABLE IF NOT EXISTS cockpit.finops_token_tax_ledger (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    decisions_resolved_local BIGINT NOT NULL DEFAULT 0,
    estimated_tokens_saved BIGINT NOT NULL DEFAULT 0,
    baseline_tariff_per_1m_usd NUMERIC(10, 4) NOT NULL DEFAULT 3.5000,
    baseline_llm_latency_ms INT NOT NULL DEFAULT 1450,
    monetary_savings_usd NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    time_saved_ms BIGINT NOT NULL DEFAULT 0,
    last_decision_receipt_sha256 VARCHAR(64) NOT NULL DEFAULT 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cockpit_token_tax_tenant UNIQUE (tenant_id)
);

-- 9D. PROAA-21 — Hardening SaaS Multi-Tenant (Row-Level Security RLS por tenant_id)
ALTER TABLE cockpit.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.finops_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.audit_chain_sha256 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.connector_vault_aes256 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.document_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.finops_token_tax_ledger ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'entitlements' AND policyname = 'rls_tenant_isolation_entitlements') THEN
        CREATE POLICY rls_tenant_isolation_entitlements ON cockpit.entitlements
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'users' AND policyname = 'rls_tenant_isolation_users') THEN
        CREATE POLICY rls_tenant_isolation_users ON cockpit.users
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'sessions' AND policyname = 'rls_tenant_isolation_sessions') THEN
        CREATE POLICY rls_tenant_isolation_sessions ON cockpit.sessions
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'finops_budgets' AND policyname = 'rls_tenant_isolation_finops_budgets') THEN
        CREATE POLICY rls_tenant_isolation_finops_budgets ON cockpit.finops_budgets
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'audit_chain_sha256' AND policyname = 'rls_tenant_isolation_audit_chain') THEN
        CREATE POLICY rls_tenant_isolation_audit_chain ON cockpit.audit_chain_sha256
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'connector_vault_aes256' AND policyname = 'rls_tenant_isolation_connector_vault') THEN
        CREATE POLICY rls_tenant_isolation_connector_vault ON cockpit.connector_vault_aes256
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'document_vectors' AND policyname = 'rls_tenant_isolation_document_vectors') THEN
        CREATE POLICY rls_tenant_isolation_document_vectors ON cockpit.document_vectors
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'finops_token_tax_ledger' AND policyname = 'rls_tenant_isolation_token_tax') THEN
        CREATE POLICY rls_tenant_isolation_token_tax ON cockpit.finops_token_tax_ledger
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
END
$$;

-- 9E. Marco M4 — Persistência Real de Agentes & Skills No-Code, Reuniões (WhisperX) e Executor DAG SHA-256
CREATE TABLE IF NOT EXISTS cockpit.custom_agents (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    squad_id VARCHAR(100) NOT NULL DEFAULT 'sq-estrategia-gov',
    name VARCHAR(255) NOT NULL,
    role TEXT NOT NULL,
    model VARCHAR(120) NOT NULL DEFAULT 'Ollama qwen2.5-coder:7b-instruct-q4_K_M',
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    autonomy_level VARCHAR(60) NOT NULL DEFAULT 'Assistido (TLC v3)',
    is_local_sovereign BOOLEAN NOT NULL DEFAULT TRUE,
    system_prompt TEXT,
    assigned_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    monthly_budget_cap_usd NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    sha256_attestation VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cockpit.custom_skills (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    skill_key VARCHAR(120) NOT NULL,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL DEFAULT 'Arquitetura & Engenharia',
    description TEXT NOT NULL,
    source_path TEXT,
    execution_provider VARCHAR(60) NOT NULL DEFAULT 'CPU INT8',
    trigger_command VARCHAR(100) NOT NULL,
    input_schema_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_schema_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    markdown_content TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sha256_attestation VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cockpit.meetings_intelligence (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    folder VARCHAR(60) NOT NULL DEFAULT 'C-Level',
    title VARCHAR(300) NOT NULL,
    platform VARCHAR(100) NOT NULL DEFAULT 'PCL VoxCanvas Enclave',
    meet_code VARCHAR(100) NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 600,
    author VARCHAR(200) NOT NULL DEFAULT 'Eduardo Machado',
    summary TEXT NOT NULL,
    decisions JSONB NOT NULL DEFAULT '[]'::jsonb,
    action_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    segments JSONB NOT NULL DEFAULT '[]'::jsonb,
    audio_sha256 VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cockpit.dag_workflow_runs (
    run_id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'tnt_promptcore_default' REFERENCES cockpit.tenants(id) ON DELETE CASCADE,
    flow_id VARCHAR(100) NOT NULL,
    flow_name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT 'v1.0 PROD',
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    total_nodes INT NOT NULL DEFAULT 0,
    executed_nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_duration_ms INT NOT NULL DEFAULT 0,
    merkle_root_sha256 VARCHAR(64) NOT NULL,
    audit_event_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE cockpit.custom_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.custom_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.meetings_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit.dag_workflow_runs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'custom_agents' AND policyname = 'rls_tenant_isolation_custom_agents') THEN
        CREATE POLICY rls_tenant_isolation_custom_agents ON cockpit.custom_agents
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'custom_skills' AND policyname = 'rls_tenant_isolation_custom_skills') THEN
        CREATE POLICY rls_tenant_isolation_custom_skills ON cockpit.custom_skills
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'meetings_intelligence' AND policyname = 'rls_tenant_isolation_meetings') THEN
        CREATE POLICY rls_tenant_isolation_meetings ON cockpit.meetings_intelligence
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'cockpit' AND tablename = 'dag_workflow_runs' AND policyname = 'rls_tenant_isolation_dag_runs') THEN
        CREATE POLICY rls_tenant_isolation_dag_runs ON cockpit.dag_workflow_runs
            USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'));
    END IF;
END
$$;

-- 10. Seed Inicial Idempotente (Tenant Soberano, Operador, Entitlements GrowthOS e Bloco Gênesis)
INSERT INTO cockpit.tenants (id, slug, name, plan_tier, status, isol_namespace)
VALUES ('tnt_promptcore_default', 'promptcore-labs', 'PromptCore Labs Holding & AEOS', 'sovereign_core', 'ACTIVE', 'promptcore_sovereign')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cockpit.users (id, tenant_id, email, full_name, role, department, max_concurrent_devices, status)
VALUES ('usr_01h8x9p', 'tnt_promptcore_default', 'eduardo@promptcorelabs.com', 'Eduardo Machado', 'sovereign_admin', 'Executive & Architecture', 2, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cockpit.finops_budgets (
    id, tenant_id, department_or_squad, monthly_cap_usd, current_spend_usd,
    monthly_cap_tokens, current_spend_tokens, hard_lock_enabled, hard_lock_triggered, period_month
)
VALUES (
    'fin_default_2026_11', 'tnt_promptcore_default', 'Global Holding Cap', 50.0000, 3.4200,
    50000000, 1420500, TRUE, FALSE, '2026-11'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cockpit.entitlements (
    id, tenant_id, module_key, module_name, access_state,
    trial_started_at, trial_expires_at, quota_limit_units, quota_used_units, plugin_manifest
)
VALUES
(
    'ent_pcl_core_cockpit',
    'tnt_promptcore_default',
    'pcl-core-cockpit',
    'PCL Cockpit Core & Sovereign Vault',
    'enabled',
    CURRENT_TIMESTAMP,
    NULL,
    1000000,
    1420,
    '{"id":"pcl-core-cockpit","version":"4.0.0","vendor":"PromptCore Labs","tier":"sovereign_core","capabilities":["chat_multiturn","laya_system_one","artifact_drawer","byos_vault"],"manifest_sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}'::jsonb
),
(
    'ent_pcl_codegraph_pro',
    'tnt_promptcore_default',
    'pcl-codegraph-pro',
    'PCL CodeGraph AST & Blast Radius Engine',
    'enabled',
    CURRENT_TIMESTAMP,
    NULL,
    50000,
    4,
    '{"id":"pcl-codegraph-pro","version":"1.0.0","vendor":"PromptCore Labs","tier":"sovereign_core","capabilities":["codegraph_index","codegraph_query","codegraph_impact_radius","codegraph_god_nodes"],"manifest_sha256":"8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"}'::jsonb
),
(
    'ent_pcl_growth_os',
    'tnt_promptcore_default',
    'pcl-growth-os',
    'PCL GrowthOS™ — Revenue & GTM Intelligence Suite',
    'trial_14d',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '14 days',
    500,
    12,
    '{"id":"pcl-growth-os","version":"1.2.0","vendor":"PromptCore Labs","tier":"growth_os_pro","trial_days":14,"upsell_cta":"Ativar Licenca PCL GrowthOS Pro","capabilities":["lead_enrichment","bowtie_revops","editorial_heartbeat"],"manifest_sha256":"4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"}'::jsonb
),
(
    'ent_pcl_maquina_receita',
    'tnt_promptcore_default',
    'pcl-maquina-receita',
    'PCL Máquina de Receita — Outbound & High-Ticket Sites',
    'locked_upsell',
    NULL,
    NULL,
    0,
    0,
    '{"id":"pcl-maquina-receita","version":"1.0.0","vendor":"PromptCore Labs","tier":"growth_os_pro","trial_days":14,"upsell_cta":"Desbloquear Trial de 14 Dias no PCL GrowthOS","capabilities":["brand_dna_generator","high_ticket_preview","outreach_cadence"],"manifest_sha256":"ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cockpit.audit_chain_sha256 (
    event_id, tenant_id, actor_user_id, event_type, resource_target,
    payload_json, prev_hash_sha256, record_hash_sha256
)
VALUES (
    'evt_genesis_sql003',
    'tnt_promptcore_default',
    'usr_01h8x9p',
    'SCHEMA_MIGRATION_003',
    'cockpit.audit_chain_sha256',
    '{"migration":"003_create_cockpit_iam_finops_entitlements_schema.sql","invariants":["0_MB_VRAM","AES_256_GCM","SHA_256_CHAIN"]}'::jsonb,
    '0000000000000000000000000000000000000000000000000000000000000000',
    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
)
ON CONFLICT (event_id) DO NOTHING;
