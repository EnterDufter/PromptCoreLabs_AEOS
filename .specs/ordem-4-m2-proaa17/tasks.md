---
title: "Task Breakdown (Full SDD Gate G-03): Ordem 4 — Marco M2 + PROAA-17 (Token Tax Saved)"
spec_id: "SPEC-PCL-AEOS-ORDEM4-M2-PROAA17"
status: "Completed"
created_at: "2026-11-22"
---

# Checklist de Execução (Ordem 4)

- [x] **T0. Checkpoint Git da Ordem 3:** Commit (`f191460`) e push seguro na branch `master` de todos os artefatos do Marco M1 + `services/laya-gatekeeper/`.
- [x] **T1. Schema SQL & Backend Marco M2 + `PROAA-17` (`003_create_cockpit_iam_finops_entitlements_schema.sql` + `server/aeosBackendApp.ts`):**
  - [x] Adicionar tabelas `cockpit.document_vectors` (PGVector `384d` + metadados de deduplicação) e `cockpit.finops_token_tax_ledger` (`PROAA-17`) na Migração SQL 003.
  - [x] Implementar `POST /api/aeos/laya/classify` em `server/aeosBackendApp.ts` conectando o chat ao `pcl-laya` v2.0 (`:20140`) e ao `laya-gatekeeper` (`:20160`), contabilizando cada decisão local no ledger `PROAA-17`.
  - [x] Implementar `POST /api/aeos/memory/documents/ingest`, `GET /api/aeos/memory/documents` e `POST /api/aeos/memory/documents/query` com **Memória Auto-Limpante (`laya_deduplicate_memory`)** e persistência permanente (PostgreSQL 17 PGVector + Vault Disk Mirror que sobrevive ao F5).
  - [x] Evoluir `POST /api/aeos/search` para busca web real (Wikipedia/arXiv/DuckDuckGo com fallback determinístico resiliente) e retorno de fontes para a pílula retrátil.
  - [x] Implementar `GET /api/aeos/finops/token-tax` e `POST /api/aeos/finops/token-tax` com a fórmula exata de `PCL_REFLEX_FINOPS_PRICING_PROAA17.md` e integração com o Hard Lock (`POST /api/aeos/infer` -> fallback automático Ollama `:11434` `$0.00`).
- [x] **T2. Integração Frontend Cockpit (`layaCoprocessorService.ts`, `studyIngestionService.ts`, `budgetControlService.ts`, `isoAuditService.ts`, `CostsTokenDashboard.tsx`, `AuditComplianceBoard.tsx`):**
  - [x] Conectar `layaCoprocessorService.ts` ao endpoint `/api/aeos/laya/classify` (Laya Neural + Gatekeeper Aegis).
  - [x] Conectar `studyIngestionService.ts` à memória vetorial permanente (`/api/aeos/memory/documents/*`) com hidratação automática pós-F5 e deduplicação `laya_deduplicate_memory`.
  - [x] Conectar `budgetControlService.ts` e `CostsTokenDashboard.tsx` ao Hard Lock real (`/api/aeos/finops/budget`) e ao contador auditável **`Token Tax Saved` (`PROAA-17`)** (`/api/aeos/finops/token-tax`).
  - [x] Conectar `isoAuditService.ts` e a Aba 7 (`AuditComplianceBoard.tsx`) à trilha criptográfica encadeada real (`/api/aeos/audit/chain`).
- [x] **T3. Testes de Integração, Unitários & Build (`Exit Code 0`):**
  - [x] Expandir `tests/integration/backendApi.test.ts` validando: (1) `/api/aeos/laya/classify` + incremento do `Token Tax Saved`, (2) `/api/aeos/memory/documents/ingest` com deduplicação `laya_deduplicate_memory` (`ACTION_DISCARD`/`ACTION_UPDATE`/`ACTION_ADD`) e busca vetorial permanente pós-reload, (3) Fórmula `PROAA-17` e Hard Lock FinOps, e (4) Verificação matemática da cadeia SHA-256.
  - [x] Validar `npm run test:unit`, `npm run test:api` e `npm run build` com **Exit Code 0**.
