# [LEAN-SPEC] Ordem 1 — Checkpoint Git (Gate 2) & PoC Local do Graphify (`SPEC-PCL-AEOS-CODEGRAPH-04`)

> **Trilha**: Rota Lean (`tlc-spec-lean`) — Gate G-00 Triage (Complexidade Nível 3)  
> **Data**: 2026-11-22  
> **Autor/Agente**: PCL AEOS / Cortex Engine  
> **Referência Normativa**: `PCL-AEOS-NORM-01`, `AGENTS.md`, `SPEC-PCL-AEOS-CODEGRAPH-04`  

---

## 1. Objetivo & Contexto
Executar a **Ordem 1** da sequência harmonizada do PCL AEOS / Cockpit:
1. Consolidar o **Checkpoint Git seguro do Gate 2** (Docker, Caddy, Laya INT8, Vite Config e Governança Dual-Track) na branch `master`, isolando projetos paralelos não relacionados (`maquina-de-receita-pcl` e `esteira-diaria-conteudo`) no `.gitignore`.
2. Implantar a **Prova de Conceito (PoC) Local do Graphify** sob a **Opção C** do `SPEC-PCL-AEOS-CODEGRAPH-04` (Porta Hexagonal Agnóstica `PCL Code Graph Port` + Adaptador determinístico `--no-llm` em CPU com `0 MB VRAM` e custo `$0.00`), gerando os 4 subgrafos modulares (`cockpit-graph.json`, `laya-graph.json`, `omniroute-graph.json`, `paperclip-graph.json`) e o painel visual interativo `graph.html`.

---

## 2. Escopo Delimitado
- [x] **O que SERÁ feito:**
  - Isolamento no `.gitignore` e commit/push cirúrgico do pacote Gate 2 + specs do Graphify na branch `master`.
  - Criação do manifesto `.graphifyignore` na raiz do monorepo.
  - Criação do serviço/adaptador hexagonal `services/pcl-codegraph/` (`engine.py`, `mcp_server.py`, `requirements.txt`, `scripts/build_pilot_graphs.py`) e registro como MCP `stdio` no Antigravity IDE (`.agents/mcp_config.json` e `mcp.config.json`).
  - Geração dos 4 subgrafos JSON em `data/codegraphs/` e do visualizador interativo `data/codegraphs/graph.html` (espelhado em `docs/graphify_pilot_dashboard.html`).
  - Extração auditada de métricas: total de nós/arestas por subgrafo, Top 5 God Nodes por módulo e cálculo real de economia de tokens.
- [x] **O que NÃO SERÁ feito (Fronteiras explícitas de não-escopo da Ordem 1):**
  - **NÃO** iniciar alterações de desacoplamento do `server/` (Marco M0) nem migração SQL 003 neste ciclo.
  - **NÃO** alterar o motor neural do `pcl-laya` (`PROAA-14`) antes da conclusão e validação integral desta Ordem 1.

---

## 3. Arquivos Afetados
- `[MODIFY]` `.gitignore`
- `[NEW]` `.specs/lean-spec-ordem-1-codegraph-poc.md`
- `[NEW]` `.graphifyignore`
- `[NEW]` `services/pcl-codegraph/requirements.txt`
- `[NEW]` `services/pcl-codegraph/src/engine.py`
- `[NEW]` `services/pcl-codegraph/src/mcp_server.py`
- `[NEW]` `services/pcl-codegraph/scripts/build_pilot_graphs.py`
- `[MODIFY]` `.agents/mcp_config.json`
- `[MODIFY]` `mcp.config.json`
- `[NEW]` `docs/graphify_pilot_dashboard.html`

---

## 4. Critérios de Aceite (Checklist)
- [x] Checkpoint Git do Gate 2 comitado e enviado (`git push origin master`) sem vazamento de `node_modules` ou projetos paralelos (`commit ca1d718`).
- [x] 4 subgrafos (`cockpit-graph.json`, `laya-graph.json`, `omniroute-graph.json`, `paperclip-graph.json`) gerados deterministicamente em CPU (`0 Tokens`, `0 MB VRAM`, `13.810 nós` e `31.067 arestas` em `2.383 arquivos`).
- [x] Mapa visual `graph.html` / `docs/graphify_pilot_dashboard.html` gerado em UTF-8 puro com Top 5 God Nodes e métricas de economia de tokens (`-79.5%` global).
- [x] Servidor MCP `pcl-codegraph` testado e respondendo às 5 primitivas do `PCL Code Graph Port` (`overall_status: TRUSTED`).
- [x] Build do PCL Cockpit (`npm run build`) validado com **Exit Code 0** (`3519 modules transformed`).

---

## 5. Plano de Verificação Rápida
- `git status -s` e `git log -n 2 --oneline`
- `python services/pcl-codegraph/scripts/build_pilot_graphs.py`
- Teste funcional das 5 tools MCP do `pcl-codegraph`
- `npm --prefix projects/PromptCoreLabs_AEOS_Dashboard run build`
