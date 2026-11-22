---
title: "Specification (Full SDD Gate G-01): Ordem 5 — Marco M3.1 (Conectores MCP Oficiais) + Fundação PCL GrowthOS™ (PROAA-20 & PROAA-21)"
spec_id: "SPEC-PCL-AEOS-ORDEM5-M31-GROWTHOS"
system_scope: "PCL Cockpit (:3001) + server/aeosBackendApp.ts + PostgreSQL 17 RLS + Cofre AES-256-GCM + Streamable HTTP MCP Client"
kernel_version: "v3.6.0"
status: "Approved"
created_at: "2026-11-22"
author: "Cortex Architecture Persona & PromptCore Labs"
normative_ref: "PCL-AEOS-NORM-01"
---

# 1. Contexto & Objetivo Executivo (Ordem 5 — Rota Full SDD Nível 4–5)

A **Ordem 5** da sequência harmonizada do **PCL AEOS / PCL Cockpit v3.6** une o **Marco M3.1 (Conectores MCP Oficiais)** à fundação técnica e de segurança SaaS do **`PCL GrowthOS™` (`PROAA-20` + `PROAA-21`)**:

1. **Marco M3.1 — Conectores MCP Oficiais (`Google Workspace`, `Microsoft 365`, `ClickUp`, `GitHub`):**
   - **Cofre Criptografado AES-256-GCM + OAuth 2.1 PKCE:** Armazena e recupera tokens OAuth 2.1 PKCE e credenciais dos 4 conectores oficiais da Onda M3.1 (`google-workspace`, `microsoft-365`, `clickup`, `github`) em `cockpit.connector_vault_aes256` (`iv_hex`, `auth_tag_hex`, `ciphertext_hex`, `key_fingerprint_sha256`), nunca expondo segredos em texto claro na UI.
   - **Cliente MCP Streamable HTTP (`POST /api/aeos/mcp/streamable/call` e `GET /api/aeos/mcp/connectors/m31`):**
     - Suporta transporte **Streamable HTTP** (`application/json` e `text/event-stream` JSON-RPC 2.0) com injeção automática do token descriptografado em memória a partir do cofre AES-256-GCM e cabeçalho de isolamento `X-PCL-Tenant-Id`.
   - **Human-in-the-Loop (HITL) Obrigatório para Ações Externas de Escrita/Mutação:**
     - Qualquer chamada de ferramenta MCP externa da Onda M3.1 com efeito colateral de escrita (`send_email`, `create_calendar_event`, `create_clickup_task`, `create_github_issue`, `create_pull_request`, `push_files`, `send_teams_message`) **jamais** é executada silenciosamente: o backend exige um `hitlApprovalToken` assinado ou retorna `HTTP 202 Accepted` com `{ requiresHitlApproval: true, hitlProposalId, previewCard }` para confirmação explícita do operador humano no `ActionPreviewCard.tsx`, registrando a proposta e a confirmação na trilha encadeada `cockpit.audit_chain_sha256`.

2. **Contrato de Módulos de Crescimento — `PCL GrowthOS™` (`PROAA-20`):**
   - **Schema & Registro `plugin.manifest.json` (`GET /api/aeos/growthos/manifests`, `POST /api/aeos/growthos/manifests/register`, `POST /api/aeos/growthos/graph/link`):**
     - Valida e registra o contrato canônico `plugin.manifest.json` dos módulos do `PCL GrowthOS™` (`pcl-growth-os`, `pcl-maquina-receita`, `pcl-bowtie-revops`, `pcl-pulse-iq`), conectando declarativamente:
       - `requiredConnectors` (M3.1: `google-workspace`, `microsoft-365`, `clickup`, `github`, `hubspot`)
       - `systemOnePrimitives` (`pcl-laya` v2.0: `laya_match_intent`, `laya_deduplicate_memory`, `laya_verify_policy`, `laya_lightning_council`)
       - `inferenceGateway` (`OmniRoute` `:20130` + fallback `Ollama` `:11434`)
       - `unifiedTenantGraphNamespace` (vinculado ao grafo unificado do `tenant_id` no PostgreSQL 17 / PGVector).

3. **Hardening SaaS Multi-Tenant (`PROAA-21`):**
   - **Isolamento por `tenant_id` (PostgreSQL Row-Level Security — RLS):**
     - Evolui a Migração SQL 003 (`003_create_cockpit_iam_finops_entitlements_schema.sql`) habilitando `ENABLE ROW LEVEL SECURITY` e políticas `tenant_isolation_policy` (`USING (tenant_id = COALESCE(NULLIF(current_setting('app.current_tenant_id', true), ''), 'tnt_promptcore_default'))`) nas tabelas multi-tenant (`cockpit.entitlements`, `cockpit.users`, `cockpit.sessions`, `cockpit.finops_budgets`, `cockpit.audit_chain_sha256`, `cockpit.connector_vault_aes256`, `cockpit.document_vectors`, `cockpit.finops_token_tax_ledger`), além de bloqueio estrito cross-tenant na camada de aplicação (`HTTP 403 CROSS_TENANT_ACCESS_DENIED`).
   - **Cotas Atômicas Pre-Flight com Degradação Graciosa para Laya CPU Local (100% Trial Quota):**
     - Endpoint `POST /api/aeos/growthos/quota/consume` (e verificação pre-flight nas chamadas de módulos): incrementa atomicamente `quota_used_units` até `quota_limit_units`. Quando o tenant em `trial_14d` atinge **100% da cota (`quotaUsedUnits >= quotaLimitUnits`)**, o sistema **não quebra nem perde dados**: bloqueia chamadas caras de LLM externo e **degrada graciosamente para o motor local `pcl-laya` CPU (`0 MB VRAM`, `$0.00`)**, retornando `degradedToLocalLayaCpu: true`, `executionEngine: 'pcl-laya-cpu-int8'` e `upsellCta`.
   - **Bloqueio Anti-SSRF para Ferramentas de `Scrape URL` (`POST /api/aeos/growthos/scrape-url/validate`):**
     - Validador rigoroso de URLs antes de qualquer scraping de leads/sites no `PCL GrowthOS™`: bloqueia esquemas não-HTTP (`file://`, `gopher://`, `ftp://`, `dict://`), IPs de loopback (`127.0.0.0/8`, `localhost`, `::1`, `0.0.0.0`), cloud metadata (`169.254.169.254`, `metadata.google.internal`, `100.100.100.200`), redes privadas RFC 1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) e credenciais embutidas em URL, retornando `HTTP 403 SSRF_TARGET_BLOCKED` e gravando `SECURITY_SSRF_SCRAPE_BLOCKED` na trilha SHA-256.

---

# 2. Critérios de Aceite (Acceptance Criteria)

- **AC-M31-01 (Cofre AES-256-GCM + OAuth 2.1 PKCE M3.1):** Os 4 conectores oficiais (`google-workspace`, `microsoft-365`, `clickup`, `github`) selam tokens via AES-256-GCM e expõem catálogo MCP Streamable HTTP sem vazamento de segredos.
- **AC-M31-02 (Streamable HTTP MCP + Human-in-the-Loop Obrigatório):** Ações de leitura executam via Streamable HTTP; ações externas de escrita/mutação exigem aprovação HITL (`HTTP 202 requiresHitlApproval: true` antes da aprovação e `HTTP 200 executed: true` após confirmação humana com hash SHA-256).
- **AC-PROAA20-01 (Contrato `plugin.manifest.json` & Grafo Unificado do `tenant_id`):** Validação e registro de manifestos `PCL GrowthOS™` conectando conectores M3.1, `pcl-laya` e `OmniRoute` ao namespace do `tenant_id`.
- **AC-PROAA21-01 (Isolamento RLS por `tenant_id`):** Políticas RLS no PostgreSQL 17 e guarda multi-tenant bloqueiam acesso cruzado entre tenants distintos (`HTTP 403 CROSS_TENANT_ACCESS_DENIED`).
- **AC-PROAA21-02 (Cota Atômica Pre-Flight + Degradação Laya CPU em 100% Trial):** Ao atingir 100% da cota do trial, a requisição degrada automaticamente para `pcl-laya-cpu-int8` (`0 MB VRAM`, `$0.00`) com `degradedToLocalLayaCpu: true`.
- **AC-PROAA21-03 (Bloqueio Anti-SSRF para `Scrape URL`):** `169.254.169.254`, `127.0.0.1`, `localhost`, `10.x.x.x`, `192.168.x.x` e `file://` são sumariamente bloqueados com `HTTP 403 SSRF_TARGET_BLOCKED`, permitindo apenas domínios públicos HTTPS legítimos.
- **AC-BUILD-01 (Exit Code 0):** `npm run test:unit`, `npm run test:api` e `npm run build` passam com **Exit Code 0**.
