---
title: "Task Breakdown (Full SDD Gate G-03): Ordem 6 — Marco M3.2 + Marco M4"
spec_id: "SPEC-PCL-AEOS-ORDEM6-M32-M4"
status: "Completed"
created_at: "2026-11-22"
---

# Checklist de Execução (Ordem 6)

- [x] **T0. Checkpoint Git da Ordem 5:** Commit (`7189343`) e push seguro na branch `master` de todos os artefatos da Ordem 5 (M3.1 + `PROAA-20` + `PROAA-21`).
- [x] **T1. Schema SQL 003 — Tabelas do Marco M4 com RLS (`003_create_cockpit_iam_finops_entitlements_schema.sql`):**
  - [x] Adicionar `cockpit.custom_agents`, `cockpit.custom_skills`, `cockpit.meetings_intelligence` e `cockpit.dag_workflow_runs` com `ENABLE ROW LEVEL SECURITY` e políticas `rls_tenant_isolation_*`.
- [x] **T2. Backend Marco M3.2 + Marco M4 (`server/aeosBackendApp.ts`):**
  - [x] Implementar catálogo e selagem M3.2 (`GET /api/aeos/mcp/connectors/m32`, `POST /api/aeos/mcp/connectors/m32/oauth-seal`) cobrindo **HubSpot**, **Atlassian Jira/Confluence**, **RD Station API v2** e **LinkedIn** (com bloqueio `HTTP 403 LINKEDIN_COOKIE_SCRAPING_FORBIDDEN` contra cookies `li_at` / scraping), acoplados ao `plugin.manifest.json` e ao Gate HITL em `/api/aeos/mcp/streamable/call`.
  - [x] Implementar transcrição neural de voz no backend (`POST /api/aeos/audio/transcribe` — base do `PCL VoxCanvas™`).
  - [x] Implementar persistência real de Agentes e Skills No-Code (`GET/POST /api/aeos/agents/custom` e `GET/POST /api/aeos/skills/custom`).
  - [x] Implementar pipeline real de Reuniões (`POST /api/aeos/meetings/ingest`, `GET /api/aeos/meetings`, `POST /api/aeos/meetings/dispatch-action` -> ClickUp/Jira via HITL).
  - [x] Implementar Executor de Fluxos DAG (`POST /api/aeos/flows/dag/execute` e `GET /api/aeos/flows/dag/runs`) com trilha auditável SHA-256.
- [x] **T3. Integração Frontend Cockpit (`whisperService.ts`, `IntegrationsLibrary.tsx`, `squadService.ts`, `skillsService.ts`, `MeetingsIntelligenceView.tsx`, `FlowsAutomationCanvas.tsx`, `ActionPreviewCard.tsx`):**
  - [x] Conectar `WhisperService` ao endpoint `/api/aeos/audio/transcribe` com captura real MediaRecorder (e fallback determinístico seguro).
  - [x] Conectar `ActionPreviewCard.tsx` ao despacho MCP `/api/aeos/mcp/streamable/call` (`hitlConfirmed: true`) para ações `@Sistemas`.
  - [x] Conectar `squadService.ts` e `skillsService.ts` à persistência real `/api/aeos/agents/custom` e `/api/aeos/skills/custom`.
  - [x] Conectar `MeetingsIntelligenceView.tsx` e `FlowsAutomationCanvas.tsx` aos endpoints reais de reuniões (com envio ClickUp/Jira via HITL) e execução DAG SHA-256.
- [x] **T4. Testes de Integração, Unitários & Build (`Exit Code 0`):**
  - [x] Expandir `tests/integration/backendApi.test.ts` validando todos os endpoints de M3.2 e M4 (`18/18` API tests PASS).
  - [x] Validar `npm run test:unit`, `npm run test:api` e `npm run build` com **Exit Code 0**.
