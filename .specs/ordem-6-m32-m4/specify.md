---
title: "Specification (Full SDD Gate G-01): Ordem 6 — Marco M3.2 (Conectores Comerciais/Engenharia) + Marco M4 (Voz Real, @Sistemas, Agentes Persistentes, Reuniões e Executor DAG)"
spec_id: "SPEC-PCL-AEOS-ORDEM6-M32-M4"
system_scope: "PCL Cockpit (:3001) + server/aeosBackendApp.ts + PostgreSQL 17 RLS + Cofre AES-256-GCM + Streamable HTTP / REST Oficial"
kernel_version: "v3.6.0"
status: "Approved"
created_at: "2026-11-22"
author: "Cortex Architecture Persona & PromptCore Labs"
normative_ref: "PCL-AEOS-NORM-01"
---

# 1. Contexto & Objetivo Executivo (Ordem 6 — Rota Full SDD Nível 4–5)

A **Ordem 6** da sequência harmonizada do **PCL AEOS / PCL Cockpit v3.6** materializa duas frentes integradas de conectividade corporativa e execução viva:

1. **Marco M3.2 — Conectores Comerciais & Engenharia Oficiais (`HubSpot`, `Atlassian Jira/Confluence`, `RD Station API v2` e `LinkedIn`):**
   - **HubSpot Official MCP (`hubspot`):** Transporte Streamable HTTP com OAuth 2.1 PKCE (`S256`) e cofre AES-256-GCM para CRM, Deals, Contacts e funil Bowtie.
   - **Atlassian Jira & Confluence Official MCP (`atlassian-jira-confluence`):** Transporte Streamable HTTP com OAuth 2.1 PKCE (`S256`) para Issues, Sprints e páginas de arquitetura Confluence.
   - **RD Station Marketing API v2 (`rd-station`):** Adaptador REST oficial (`https://api.rd.services/platform/...`) com OAuth 2.0/2.1 e webhooks de conversão inbound.
   - **LinkedIn Official API (`linkedin`):** Estritamente **OpenID Connect + API REST v2 oficial** (`https://api.linkedin.com/v2/...`, `compliancePolicy: 'STRICT_OIDC_REST_ZERO_COOKIE_SCRAPING'`), proibindo e rejeitando qualquer tentativa de autenticação por cookie de sessão (`li_at`) ou scraping não autorizado (`HTTP 403 LINKEDIN_COOKIE_SCRAPING_FORBIDDEN`).
   - **Acoplamento ao `plugin.manifest.json` (`PROAA-20`) e ao Gate Human-in-the-Loop (HITL):** Todos os 4 conectores da Onda M3.2 são acoplados aos manifestos do `PCL GrowthOS™` e exigem aprovação HITL (`HTTP 202 HITL_REQUIRED` -> confirmação humana -> `HTTP 200 APPROVED_EXECUTED`) para mutações externas (`create_hubspot_deal`, `update_hubspot_stage`, `create_jira_issue`, `publish_confluence_page`, `trigger_rd_conversion`, `publish_linkedin_post`).

2. **Marco M4 — Ações Vivas, Voz Real (`PCL VoxCanvas™`), Agentes Persistentes, Reuniões & Executor DAG:**
   - **Microfone Real com Transcrição Neural no Backend (`POST /api/aeos/audio/transcribe`):**
     - Evolui `WhisperService` e `VoiceRecorderButton.tsx` para captura de áudio real (MediaRecorder WebM/WAV/PCM com fallback resiliente em ambientes sem dispositivo físico) e envio ao endpoint `/api/aeos/audio/transcribe`, que processa a transcrição neural (base do `PCL VoxCanvas™`), sanitiza PII e contabiliza a economia local no ledger `PROAA-17` (`Token Tax Saved`).
   - **Ações `@Sistemas` no Chat com Despacho MCP pós-Confirmação no `ActionPreviewCard`:**
     - Menções a `@SAP`, `@Salesforce`, `@HubSpot`, `@Jira`, `@ClickUp`, `@RDStation`, `@LinkedIn`, `@Gmail` ou `@GoogleAgenda` geram proposta auditável no `ActionPreviewCard.tsx`; ao clicar em *"Confirmar e Enviar"*, despacha via `/api/aeos/mcp/streamable/call` (`hitlConfirmed: true`) e grava o recibo SHA-256.
   - **Persistência Real no Banco dos Agentes e Skills do Criador No-Code (`GET/POST /api/aeos/agents/custom` e `GET/POST /api/aeos/skills/custom`):**
     - Sincroniza `squadService.ts`, `skillsService.ts` e `NoCodeAgentBuilder.tsx` com as tabelas `cockpit.custom_agents` e `cockpit.custom_skills` (PostgreSQL 17 com RLS + espelho permanente em disco `data/cockpit-vault/custom_agents_skills_m4.json`), sobrevivendo a reload/F5 e registrando na trilha SHA-256.
   - **Reuniões Reais (`POST /api/aeos/meetings/ingest`, `GET /api/aeos/meetings`, `POST /api/aeos/meetings/dispatch-action`):**
     - Permite upload/ingestão real de áudio/vídeo ou transcrição em `MeetingsIntelligenceView.tsx` -> transcrição diarizada + síntese executiva + extração de Action Items -> envio de tarefas para **ClickUp / Jira / HubSpot / Salesforce** via Gate HITL com hash SHA-256 real.
   - **Executor de Fluxos DAG (`POST /api/aeos/flows/dag/execute` e `GET /api/aeos/flows/dag/runs`):**
     - Executa no backend a topologia DAG de `FlowsAutomationCanvas.tsx` nó a nó, validando cada passo contra o disjuntor Cortex Reflex (`PROAA-15`), persistindo o histórico em `cockpit.dag_workflow_runs` e gravando a raiz Merkle/SHA-256 em `cockpit.audit_chain_sha256`.

---

# 2. Critérios de Aceite (Acceptance Criteria)

- **AC-M32-01 (Catálogo M3.2 + Política Zero Cookie Scraping no LinkedIn):** `GET /api/aeos/mcp/connectors/m32` expõe `hubspot`, `atlassian-jira-confluence`, `rd-station` e `linkedin`; tentativa de selar cookie `li_at` ou scraping no LinkedIn é bloqueada com `HTTP 403 LINKEDIN_COOKIE_SCRAPING_FORBIDDEN`.
- **AC-M32-02 (Acoplamento `plugin.manifest.json` + Gate HITL M3.2):** Mutações externas em HubSpot, Jira, RD Station e LinkedIn exigem aprovação HITL (`202` -> `200`).
- **AC-M4-01 (Transcrição Neural Backend `PCL VoxCanvas™`):** `POST /api/aeos/audio/transcribe` processa payload de áudio/voz, retorna transcrição estruturada, atesto SHA-256 e incrementa `Token Tax Saved`.
- **AC-M4-02 (Persistência Real de Agentes e Skills No-Code):** `POST /api/aeos/agents/custom` e `POST /api/aeos/skills/custom` persistem no banco/vault e `GET` restaura integralmente após F5.
- **AC-M4-03 (Reuniões Reais -> Plano de Ação -> ClickUp/Jira via HITL):** `POST /api/aeos/meetings/ingest` gera transcrição, decisões e action items persistidos, e `POST /api/aeos/meetings/dispatch-action` despacha para ClickUp/Jira via HITL com hash SHA-256 real.
- **AC-M4-04 (Executor DAG com Trilha SHA-256):** `POST /api/aeos/flows/dag/execute` executa os nós do DAG em ordem topológica, retorna `merkleRootSha256` e grava o evento na cadeia `cockpit.audit_chain_sha256`.
- **AC-BUILD-01 (Exit Code 0):** `npm run test:unit`, `npm run test:api` e `npm run build` passam com **Exit Code 0**.
