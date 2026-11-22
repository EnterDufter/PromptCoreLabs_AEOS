---
title: "Specification (Full SDD Gate G-01): Ordem 4 — Marco M2 (IA Conectada, FinOps Hard Lock & Auditoria Imutável) + PROAA-17 (Token Tax Saved)"
spec_id: "SPEC-PCL-AEOS-ORDEM4-M2-PROAA17"
system_scope: "PCL Cockpit (:3001) + server/aeosBackendApp.ts + PostgreSQL 17 PGVector + pcl-laya (:20140) + laya-gatekeeper (:20160)"
kernel_version: "v3.6.0"
status: "Approved"
created_at: "2026-11-22"
author: "Cortex Architecture Persona & PromptCore Labs"
normative_ref: "PCL-AEOS-NORM-01"
---

# 1. Contexto & Objetivo Executivo (Ordem 4 — Rota Full SDD Nível 4–5)

A **Ordem 4** da sequência harmonizada do **PCL AEOS / PCL Cockpit v3.6** materializa o **Marco M2** e a especificação **`PROAA-17` (`PCL_REFLEX_FINOPS_PRICING_PROAA17.md`)**, conectando a inteligência em tempo real de ponta a ponta sem regras estáticas mockadas:

1. **Laya Neural no Chat (`pcl-laya` v2.0 + `laya-gatekeeper`):**
   - Conecta `layaCoprocessorService.ts` e o pipeline de chat do Cockpit diretamente ao backend real (`POST /api/aeos/laya/classify` em `server/aeosBackendApp.ts`), que consulta `pcl-laya` v2.0 (`:20140/v1/systemone` ou motor Python `classifier.py` via subprocesso/daemon com `0 MB VRAM`) e `laya-gatekeeper` (`:20160/v1/aegis/inspect` e `/v1/reflex/check-step`), substituindo regras estáticas de JS por inferência neural NLI/Intent (`laya_match_intent`) e inspeção Aegis/Reflex real, contabilizando cada decisão local no acumulador **`Token Tax Saved` (`PROAA-17`)**.

2. **Busca Web Real + Memória Vetorial Permanente (PGVector + `laya_deduplicate_memory`):**
   - **Busca Web Real (`/api/aeos/search`):** Executa consulta web real (DuckDuckGo HTML/Lite + arXiv API + Wikipedia/CrossRef Open API com fallback determinístico de acervo técnico quando o ambiente estiver desconectado/sandboxed), retornando fontes reais que alimentam a pílula retrátil `Fontes Consultadas (n) v` (`ADR-0007`).
   - **Memória Vetorial Permanente de `#documentos` (`POST /api/aeos/memory/documents/ingest` e `POST /api/aeos/memory/documents/query`):**
     - Ao anexar ou ingerir documentos (`studyIngestionService.ts`), os chunks são vetorizados (embedding determinístico `384d` / `768d` normalizado L2 em CPU `0 MB VRAM`) e persistidos permanentemente no PostgreSQL 17 + PGVector (`cockpit.document_vectors` na Migração SQL 004 / evolução da SQL 003) + espelho permanente em disco (`data/cockpit-vault/pgvector_documents_m2.json`), garantindo que **jamais desapareçam ao pressionar F5**.
     - **Memória Auto-Limpante via `laya_deduplicate_memory`:** Antes de persistir novos chunks, aciona a primitiva `deduplicate_memory` do `pcl-laya` v2.0 (`ACTION_DISCARD`, `ACTION_UPDATE`, `ACTION_KEEP_BOTH`, `ACTION_ADD`), descartando duplicatas semânticas e atualizando fatos obsoletos automaticamente.

3. **FinOps Hard Lock Real + Contador `Token Tax Saved` (`PROAA-17`):**
   - Materializa a fórmula auditável da especificação `PCL_REFLEX_FINOPS_PRICING_PROAA17.md` no banco (`cockpit.finops_budgets` + `cockpit.finops_token_tax_ledger`) e no backend (`GET /api/aeos/finops/budget`, `POST /api/aeos/finops/budget`, `POST /api/aeos/finops/record-decision`):
     - `Decisões_Resolvidas_Local = count(decisoes onde confidence >= limiar OU bloqueio Camada 1/2)`
     - `Tokens_Poupados_Estimados = sum(tokens_entrada_equivalentes + tokens_saida_evitados_por_tipo)`
     - `Economia_Monetaria (USD/BRL) = (Tokens_Poupados_Estimados / 1_000_000) * Tarifa_LLM_Baseline_Configurada`
     - `Tempo_Poupado (ms) = sum(Latencia_LLM_Baseline_ms - Latencia_Real_Laya_ms)`
   - **Fallback Automático para Ollama `:11434` (`$0.00`):** Quando `hardLockEnabled = true` e `currentSpendUsd >= monthlyCapUsd` (ou `currentSpendTokens >= monthlyCapTokens`), bloqueia chamadas pagas de nuvem e roteia automaticamente para o motor local Ollama (`qwen2.5-coder:7b-instruct-q4_K_M` a `$0.00`), sincronizando `budgetControlService.ts` e `CostsTokenDashboard.tsx` com o backend real.

4. **Auditoria Encadeada SHA-256 (Aba 7 — `AuditComplianceBoard.tsx` + `isoAuditService.ts`):**
   - Conecta `ISOAuditService` e a Aba 7 (`AuditComplianceBoard.tsx`) diretamente a `GET /api/aeos/audit/chain` e `POST /api/aeos/audit/chain`, exibindo os blocos reais encadeados por `prev_hash_sha256` -> `record_hash_sha256` e executando verificação matemática real da integridade de toda a cadeia SHA-256 no botão *"Verificar Integridade da Cadeia"*.

---

# 2. Critérios de Aceite (Acceptance Criteria)

- **AC-M2-01 (Laya Neural & Gatekeeper no Chat):** `POST /api/aeos/laya/classify` executa triagem via `pcl-laya` v2.0 + `laya-gatekeeper` (`0 MB VRAM`), retornando `intent`, `confidenceScore`, `aegisVerdict`, `needsWebSearch`, `needsCanonicalRAG` e `sha256Attestation`, integrado ao `layaCoprocessorService.ts`.
- **AC-M2-02 (Memória Vetorial Permanente PGVector + Auto-Limpeza `laya_deduplicate_memory`):** Documentos ingeridos via `/api/aeos/memory/documents/ingest` passam por deduplicação (`ACTION_DISCARD` / `ACTION_UPDATE` / `ACTION_ADD`), persistem vetores `384d` no banco/vault (sobrevivendo a F5/reload) e respondem a `/api/aeos/memory/documents/query` por similaridade de cosseno.
- **AC-M2-03 (FinOps Hard Lock + Fórmula `Token Tax Saved` `PROAA-17`):** O endpoint `/api/aeos/finops/token-tax` e `/api/aeos/finops/budget` calculam e persistem `decisionsResolvedLocal`, `estimatedTokensSaved`, `monetarySavingsUsd`, `monetarySavingsBrl` e `timeSavedMs` exatamente segundo a fórmula `PROAA-17`, com acionamento real do Hard Lock.
- **AC-M2-04 (Auditoria Encadeada SHA-256 na Aba 7):** `ISOAuditService.verifyChainIntegrity()` e `logAction()` operam sobre a cadeia criptográfica real `/api/aeos/audit/chain`, detectando matematicamente a integridade de todos os elos (`chainIntegrityValid: true`).
- **AC-BUILD-01 (Exit Code 0 & Zero Regressão Visual):** `npm run test:unit`, `npm run test:api` e `npm run build` passam com **Exit Code 0** e 100% de fidelidade visual em `:3001`.
