# [TASKS — G-03] Plano de Tarefas Executáveis da Ordem 2

- [x] **T-01 (Frente A):** Criar migração `scripts/database/migrations/003_create_cockpit_iam_finops_entitlements_schema.sql` e mapeá-la no `docker-compose.aeos.yml`.
- [x] **T-02 (Frente A):** Adicionar interfaces aditivas do Marco M0 em `projects/PromptCoreLabs_AEOS_Dashboard/src/types/index.ts`.
- [x] **T-03 (Frente A):** Criar `projects/PromptCoreLabs_AEOS_Dashboard/server/aeosBackendApp.ts` e `server/index.ts`, desacoplando o backend de `vite.config.ts` e adicionando as rotas reais da SQL 003 (`/api/aeos/entitlements`, `/api/aeos/finops/budget`, `/api/aeos/audit/chain`, `/api/aeos/vault/seal`).
- [x] **T-04 (Frente A):** Refatorar `projects/PromptCoreLabs_AEOS_Dashboard/vite.config.ts` para consumir `createAeosBackendMiddleware()` de `./server/aeosBackendApp` e estender `tests/integration/backendApi.test.ts` para validar as novas rotas do Marco M0.
- [x] **T-05 (Frente B):** Evoluir `services/pcl-laya/src/classifier.py` com `SemanticLRUCache`, `predict_batch` (com `length-bucketing`), `LayaLearner` (`771d` + Conformal Prediction), `AdaptiveBatchScheduler` e as 4 novas primitivas (`match_intent`, `deduplicate_memory`, `verify_policy`, `lightning_council`).
- [x] **T-06 (Frente B):** Evoluir `services/pcl-laya/src/main.py` (`POST /v1/systemone`) e `services/pcl-laya/src/mcp_server.py` (4 novas tools MCP).
- [x] **T-07 (Frente B):** Criar e executar `services/pcl-laya/scripts/train_and_validate_proaa14.py` para gerar os pesos `771d` do `laya.Learner` e validar `AC-01` a `AC-05`.
- [x] **T-08 (Validação G-04):** Executar `test:unit`, `test:api`, `npm run build` (Exit Code 0), atualizar subgrafos do `pcl-codegraph` e registrar `validate.md` + `walkthrough.md`.
