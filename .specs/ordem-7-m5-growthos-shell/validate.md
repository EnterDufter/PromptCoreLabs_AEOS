# Matriz de Validação — Ordem 7 (Marco M5 + Casca `PCL GrowthOS™`)

| Requisito | Componente / Endpoint | Critério de Aceite | Status |
|---|---|---|---|
| `pcl-codegraph` HTTP `:20150` + Docker | `services/pcl-codegraph/src/http_server.py`, `Dockerfile`, `docker-compose.aeos.yml` | `0 MB VRAM`, usuário non-root, `mem_limit: 512m`, `/health` e `/v1/codegraph/*` ativos | PASS |
| Caddy HTTPS + Backup R2/B2 | `infra/caddy/Caddyfile`, `scripts/ops/backup_cockpit_vault_r2.mjs`, `/api/aeos/ops/go-live-readiness` | Manifesto SHA-256 do Vault e validação de readiness M5 | PASS |
| Pílula Trial 14d + `Token Tax Saved` no Topo | `src/components/layout/Header.tsx` | `"14d Trial • Todos os Módulos"` -> `"Núcleo Laya + X Módulos"` + resumo clicável `Token Tax Saved` | PASS |
| 4 Divisões da Growth Store + `BlockSchema` | `LeftSidebar.tsx`, `GrowthOsDualPlexPanel.tsx` | *Estúdio & Mídia*, *Atração & Tráfego*, *Conversão & Receita*, *Comando & Blindagem* (`CLS = 0`, **"Laya™ Inside"**, Verde/Âmbar/Vermelho) | PASS |
| Chips Multimodais (`+`/`/`) | `src/components/composer/SuperChatbubble.tsx` | *Progressive Disclosure* na barra inferior | PASS |
| `Dual-Plex (Split)` + Onboarding D0–D14 | `DualPlexWorkspace.tsx`, `GrowthOsDualPlexPanel.tsx` | Canvas de Preview + Micro-ROI + Ranking de ROI no Dia 14 | PASS |
| Build & Verificação Completa | `npm run build`, `test:unit`, `test:api`, `test:mcp`, `test:repo-gate` | Exit Code 0 em todas as suítes | PASS |
