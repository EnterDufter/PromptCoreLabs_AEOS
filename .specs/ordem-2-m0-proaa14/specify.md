# [SPECIFY — G-00 / G-01] Ordem 2: Marco M0 (`server/` + SQL 003 Multi-Tenant Entitlements) & Core `pcl-laya` (`PROAA-14`)

> **Trilha**: Rota Full SDD (Complexidade Nível 4–5 — Banco de Dados `pcl-db`, Microsserviços e Contratos Públicos)  
> **Data**: 2026-11-22  
> **Autor**: PCL AEOS / Cortex Engine  
> **Normas**: `PCL-AEOS-NORM-01`, `AGENTS.md`, `ADR-0014`, `ADR-0017`, `SPEC-PCL-AEOS-CLASSIFIER-01`, `PROAA-14`  

---

## 1. Visão Geral & Objetivos
A **Ordem 2** materializa simultaneamente duas frentes estruturais do ecossistema PCL AEOS:
1. **Frente A — Marco M0 do PCL Cockpit (`server/` + Migração SQL 003):**
   - Desacoplar as rotas `/api/aeos/*` do `vite.config.ts` para um módulo e servidor Node.js dedicado em `projects/PromptCoreLabs_AEOS_Dashboard/server/`, mantendo ponte transparente na porta `:3001` com **zero alteração visual**.
   - Criar e validar a **Migração SQL 003** no PostgreSQL 17 (`cockpit.*`), contemplando: `tenants`, `entitlements` (`Trial 14d`, `locked_upsell`, `plugin.manifest.json` para o `PCL GrowthOS™`), `users`, `user_credentials`, `sessions` (trava de 2 dispositivos), `finops_budgets` (Hard Lock), `audit_chain_sha256` (trilha criptográfica encadeada) e `connector_vault_aes256` (cofre `AES-256-GCM`).
2. **Frente B — Evolução Core `pcl-laya` v2.0 (`PROAA-14`):**
   - Implementar `ONNXNLIEngine.predict_batch(pairs)` com `length-bucketing` (`<=32`, `<=64`, `<=128` tokens) e softmax vetorizado em NumPy (`0 MB VRAM`).
   - Implementar `AdaptiveBatchScheduler` (janela `3–5 ms`, `max_batch=16`) e `SemanticLRUCache` (`< 1 ms`).
   - Expor `POST /v1/systemone` e as 4 novas primitivas MCP (`laya_match_intent`, `laya_deduplicate_memory`, `laya_verify_policy`, `laya_lightning_council`).
   - Implementar o contrato `laya.Learner` (`771d` features congeladas + Conformal Prediction) validado sem regressão contra `reconciliation_dataset.json` (`30 dev / 30 holdout`).

---

## 2. Invariantes Inegociáveis
- **Hardware:** `0 MB VRAM` alocados na GPU para `pcl-laya` e `pcl-codegraph` (`CPUExecutionProvider`).
- **Política Zero Mocks:** Todos os cálculos de NLI, cache, criptografia `AES-256-GCM`, trilha `SHA-256` e persistência SQL/Vault são reais.
- **Imutabilidade Criptográfica:** O arquivo `models/nli-minilm/model.onnx` preserva intacto o hash SHA-256 `44391a5241a62e0083c1a8899a71e69a092b95aea5ba89e14062925468eceac7`.
- **Qualidade de Build:** `npm run build`, `npm run test:unit` e `npm run test:api` no Cockpit devem encerrar com **Exit Code 0**.
