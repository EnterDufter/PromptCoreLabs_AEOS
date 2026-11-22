---
title: "Task Breakdown (Full SDD Gate G-03): Ordem 5 — Marco M3.1 + Fundação PCL GrowthOS™ (PROAA-20 & PROAA-21)"
spec_id: "SPEC-PCL-AEOS-ORDEM5-M31-GROWTHOS"
status: "Completed"
created_at: "2026-11-22"
---

# Checklist de Execução (Ordem 5)

- [x] **T0. Checkpoint Git da Ordem 4:** Commit (`ef7769e`) e push seguro na branch `master` de todos os artefatos do Marco M2 + `PROAA-17`.
- [x] **T1. Schema SQL 003 — Isolamento Multi-Tenant RLS (`003_create_cockpit_iam_finops_entitlements_schema.sql`):**
  - [x] Adicionar políticas PostgreSQL 17 Row-Level Security (`ENABLE ROW LEVEL SECURITY` + `CREATE POLICY rls_tenant_isolation_*`) baseadas em `current_setting('app.current_tenant_id', true)` em todas as tabelas multi-tenant do schema `cockpit`.
- [x] **T2. Backend Marco M3.1 + `PROAA-20` + `PROAA-21` (`server/aeosBackendApp.ts`):**
  - [x] Implementar catálogo e selagem AES-256-GCM + OAuth 2.1 PKCE da Onda M3.1 (`GET /api/aeos/mcp/connectors/m31`, `POST /api/aeos/mcp/connectors/m31/oauth-seal`).
  - [x] Implementar cliente MCP Streamable HTTP (`POST /api/aeos/mcp/streamable/call`) e aprovação Human-in-the-Loop obrigatória (`POST /api/aeos/mcp/hitl/confirm`) para ações externas dos conectores M3.1 (Google Workspace, Microsoft 365, ClickUp e GitHub).
  - [x] Implementar registro e validação de `plugin.manifest.json` (`PROAA-20`: `GET /api/aeos/growthos/manifests`, `POST /api/aeos/growthos/manifests/register`) conectando conectores M3.1, `pcl-laya` e `OmniRoute` ao grafo unificado do `tenant_id`.
  - [x] Implementar Hardening SaaS (`PROAA-21`): guarda de isolamento RLS cross-tenant (`POST /api/aeos/growthos/rls/verify`), cotas atômicas pre-flight com degradação graciosa para Laya CPU local em 100% do trial (`POST /api/aeos/growthos/quota/consume`) e bloqueio anti-SSRF para `Scrape URL` (`POST /api/aeos/growthos/scrape-url/validate`).
- [x] **T3. Integração Frontend Cockpit (`src/types/index.ts`, `IntegrationsLibrary.tsx`, `ActionPreviewCard.tsx`):**
  - [x] Adicionar tipos de M3.1, `PROAA-20` e `PROAA-21` em `src/types/index.ts`.
  - [x] Integrar selagem real no cofre AES-256-GCM (`/api/aeos/vault/seal`) ao salvar credenciais de conectores corporativos (incluindo Google Workspace, Microsoft 365, ClickUp e GitHub da Onda M3.1) em `IntegrationsLibrary.tsx`.
  - [x] Integrar confirmação HITL real (`/api/aeos/audit/chain`) no `ActionPreviewCard.tsx` preservando 100% do visual em `:3001`.
- [x] **T4. Testes de Integração, Unitários & Build (`Exit Code 0`):**
  - [x] Expandir `tests/integration/backendApi.test.ts` cobrindo: (1) M3.1 Streamable HTTP MCP + Gate HITL obrigatório (`202` -> confirmação -> `200`), (2) `PROAA-20` registro de `plugin.manifest.json` vinculado ao grafo do `tenant_id`, (3) `PROAA-21` bloqueio RLS cross-tenant (`403`) + cota atômica pre-flight degradando para Laya CPU (`0 MB VRAM`) ao atingir 100% no trial, e (4) `PROAA-21` bloqueio anti-SSRF (`403`) para `Scrape URL`.
  - [x] Validar `npm run test:unit`, `npm run test:api` e `npm run build` com **Exit Code 0**.
