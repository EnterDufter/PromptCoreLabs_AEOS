# [DESIGN — G-02] Arquitetura Técnica: Marco M0 (`server/` + SQL 003) & `pcl-laya` (`PROAA-14`)

> **Trilha**: Rota Full SDD (Stage Gate G-02)  
> **Data**: 2026-11-22  

---

## 1. Frente A — Topologia `server/` e Schema `cockpit.*` (SQL 003)

1. **`server/aeosBackendApp.ts`**:
   - Exporta `createAeosBackendMiddleware()` (compatível com Node `http.IncomingMessage` / `http.ServerResponse` e Connect/Vite).
   - Gerencia pool PostgreSQL 17 (`pg.Pool`), execução automática idempotente das migrações `002` e `003`, cofre `AES-256-GCM`, trilha `SHA-256` encadeada, orçamentos FinOps e avaliação de `entitlements` (`PCL GrowthOS™`).
2. **`server/index.ts`**:
   - Servidor HTTP Node.js autônomo para execução standalone/produção, servindo `/api/aeos/*` + assets estáticos de `dist/`.
3. **`vite.config.ts`**:
   - Atua como ponte enxuta que monta `createAeosBackendMiddleware()` de `./server/aeosBackendApp`, preservando 100% da porta `:3001` e dos testes de integração em `tests/integration/backendApi.test.ts`.

---

## 2. Frente B — Motor `pcl-laya` v2.0 (`PROAA-14`)

1. **`SemanticLRUCache`**:
   - `OrderedDict` + `threading.RLock`, `max_entries=20000`, `ttl_sec=3600`.
   - Chave SHA-256: `f"{mode}|{model_sha256}|{learner_ver}|{threshold}|{premise}\x00{hypothesis}"`.
2. **`ONNXNLIEngine.predict_batch`**:
   - Tokenização em lote com `encode_batch`, agrupamento por 3 faixas de comprimento (`<=32`, `<=64`, `<=128`), inferência ONNX em CPU por bucket, softmax vetorizado e restauração da ordem original.
3. **`LayaLearner` (`771d` + Conformal Prediction)**:
   - Vetor `771d` = `concat(frozen_embedding_768d[768], onnx_nli_logits[3])`.
   - Pesos lineares `head_weights.npz` (`W[3, 771]`, `b[3]`) + `manifest.json` (`q_hat` calibrado no split `dev` de 30 amostras com `alpha=0.10`).
4. **`AdaptiveBatchScheduler` & `POST /v1/systemone`**:
   - Fila assíncrona com janela de coalescência de `4 ms` e `max_batch=16`.
   - Primitivas MCP e REST: `laya_match_intent`, `laya_deduplicate_memory`, `laya_verify_policy`, `laya_lightning_council` (com Circuit Breaker Semântico `skip_llm` quando `extractive_qa_entailment >= 0.92`).
