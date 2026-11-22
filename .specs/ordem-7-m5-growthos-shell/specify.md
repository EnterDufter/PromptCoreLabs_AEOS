# Especificação SDD — Ordem 7: Marco M5 (Containers & Go-Live Ready) + Casca Visual `PCL GrowthOS™` (`PROAA-18/19/22/23`)

## 1. Visão Executiva & Valor de Negócio
Esta especificação fecha a sequência harmonizada de 7 Ordens do ecossistema **PCL AEOS / PCL Cockpit (`:3001`)**, unindo a prontidão de infraestrutura para produção (**Marco M5 — Containers, HTTPS Caddy, Backup R2/B2 e Suíte `verify:all`**) à **Casca Visual `PCL GrowthOS™` (`PROAA-18`, `PROAA-19`, `PROAA-22` e `PROAA-23`)** na cabine `:3001` sob a regra estrita **Zero AI Slop / Zero Frankenstein**.

## 2. Escopo Normativo (Frentes A e B)

### Frente A — Marco M5 (Containers & Go-Live Ready)
1. **Empacotamento Containerizado do `pcl-codegraph` (HTTP `:20150`):**
   - Servidor FastAPI `services/pcl-codegraph/src/http_server.py` expondo `/health`, `/ready` e endpoints `/v1/codegraph/*` em modo determinístico `--no-llm` (`0 MB VRAM`, `CPUExecutionProvider`).
   - `services/pcl-codegraph/Dockerfile` com usuário non-root (`codegraph`, `UID 10001`) e healthcheck nativo.
   - Inclusão no `docker-compose.aeos.yml` ao lado de `laya` (`:20140`) e `laya-gatekeeper` (`:20160`), todos com `mem_limit: 512m` e `0 MB VRAM`.
2. **Validação Caddy HTTPS & Rotina de Backup R2/B2:**
   - Script operacional `scripts/ops/backup_cockpit_vault_r2.mjs` gerando manifesto SHA-256 verificável do cofre `data/cockpit-vault/` e recibo DRP (`last_r2_b2_backup_receipt.json`) compatível com Cloudflare R2 / Backblaze B2.
   - Endpoints `GET /api/aeos/ops/go-live-readiness` e `POST /api/aeos/ops/backup-snapshot` validando containers CPU, TLS Caddyfile e recibo de backup.
3. **Suíte Completa de Verificação (`verify:all`):**
   - Execução integrada de `test:unit`, `test:api`, `test:mcp`, `test:repo-gate` e `npm run build` com **Exit Code 0**.

### Frente B — Casca Visual `PCL GrowthOS™` no Cockpit `:3001`
1. **Topo Direito (`Header.tsx`):**
   - Pílula interativa do Trial de 14 dias: alterna e reflete a transição `"14d Trial • Todos os Módulos"` -> `"Núcleo Laya + X Módulos"`.
   - Resumo clicável `Token Tax Saved` no cabeçalho superior abrindo o demonstrativo FinOps / GrowthOS.
2. **Sidebar/Rail (`LeftSidebar.tsx`):**
   - Acesso direto às **4 Divisões da Growth Store**:
     1. *Estúdio & Mídia* (`Brand DNA`, `PCL VoxCanvas™`, `Landing Pages High-Ticket`)
     2. *Atração & Tráfego* (`SEO Programático & GEO`, `Viral Trend Radar`, `PCL PulseIQ™`)
     3. *Conversão & Receita* (`Bowtie RevOps`, `Lead X-Ray`, `PCL Morph™ CRO`)
     4. *Comando & Blindagem* (`PCL Aegis™`, `Cortex Reflex™`, `Token Tax Saved`)
3. **Barra Inferior (`+` / `/` em `SuperChatbubble.tsx`):**
   - *Chips* contextuais multimodais sob *Progressive Disclosure* para acionar as 4 Divisões da Growth Store sem poluir o composer.
4. **`Dual-Plex (Split)` (`GrowthOsDualPlexPanel.tsx` em `DualPlexWorkspace.tsx`):**
   - Grade modular `BlockSchema` com dimensões reservadas (`CLS = 0`).
   - Selo **"Laya™ Inside"** (`0 MB VRAM • CPU INT8`) e semáforo *Confidence Surfacing* (Verde `>= 85%`, Âmbar `60%–84%`, Vermelho `< 60%`).
   - Canvas de Preview + Micro-ROI do módulo selecionado + fluxo ***Onboarding Telepático D0–D14*** com **Ranking Executivo de ROI no Dia 14**.
