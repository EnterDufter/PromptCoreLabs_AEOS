# Tasks — Ordem 7: Marco M5 + Casca Visual `PCL GrowthOS™`

- [x] **T1:** Checkpoint Git da Ordem 6 (`commit` + `push` na branch `master`).
- [x] **T2:** Criar `services/pcl-codegraph/src/http_server.py` (`:20150`, `0 MB VRAM`) e `services/pcl-codegraph/Dockerfile` (non-root user `codegraph`).
- [x] **T3:** Atualizar `docker-compose.aeos.yml` adicionando `pcl-codegraph` (`:20150`, `mem_limit: 512m`) ao lado de `laya` (`:20140`, `mem_limit: 512m`) e `laya-gatekeeper` (`:20160`, `mem_limit: 512m`).
- [x] **T4:** Criar rotina de backup `scripts/ops/backup_cockpit_vault_r2.mjs` e endpoints `/api/aeos/ops/go-live-readiness`, `/api/aeos/ops/backup-snapshot`, `/api/aeos/growthos/store-state` e `/api/aeos/growthos/onboarding/advance` em `server/aeosBackendApp.ts`.
- [x] **T5:** Implementar a Casca Visual `PCL GrowthOS™` em `Header.tsx`, `LeftSidebar.tsx`, `SuperChatbubble.tsx`, `GrowthOsDualPlexPanel.tsx`, `DualPlexWorkspace.tsx` e `App.tsx`.
- [x] **T6:** Adicionar testes de integração em `tests/integration/backendApi.test.ts` e rodar a suíte completa (`test:unit`, `test:api`, `test:mcp`, `test:repo-gate`, `npm run build` com Exit Code 0).
