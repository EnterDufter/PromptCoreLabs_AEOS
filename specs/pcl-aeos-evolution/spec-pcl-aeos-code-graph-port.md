# SPEC-PCL-AEOS-CODEGRAPH-04: Estudo Arquitetural e Porta Hexagonal de Grafo de Código (Graphify & AST Code Graph Port)

**Versão:** `1.0-Study-Directive`  
**Status:** Proposed for Study & PoC Validation (Gate G-00 Dual-Track Triage)  
**Origem da Demanda:** Recomendação Técnica Especializada (Marcelo Moraes — Tech Lead) & Diretriz do Operador Soberano (Eduardo Machado)  
**Escopo:** Antigravity Harness, `services/pcl-codegraph` (`:20150` / MCP `stdio`), `pcl-laya` (`:20140`), PCL Cockpit (`:3001`), OmniRoute (`:20130`)  
**Padrão Arquitetural:** Hexagonal Architecture (*Ports & Adapters*) — Solução Agnóstica Desacoplada  
**Normas de Governança:** `PCL-AEOS-NORM-01`, `AGENTS.md`, `HIP-001` (Cold Storage), `ADR-0005`, `ADR-0015` e `ADR-0017`  

> [!IMPORTANT]
> **📌 Instrução Canônica de Estudo no Harness PCL AEOS:**  
> Avaliar, prototipar e homologar a aplicação de um motor de **Grafo Estrutural de Código baseado em AST (Tree-sitter)** — tendo o **Graphify (`graphifyy[mcp]`, Apache-2.0)** como adaptador candidato primário — para reduzir em **70% a 80% o consumo de tokens** dos agentes de IA durante tarefas de leitura, navegação, refatoração e análise de impacto (*blast radius*) de código-fonte no monorepo e nas instâncias do PCL Cockpit.

---

## 1. Motivação Executiva e Diagnóstico de Engenharia

Em repositórios de médio e grande porte (como o monorepo `PromptCore_Labs`), cerca de **70% a 80% do orçamento de tokens** de uma sessão de engenharia assistida por IA não é gasto escrevendo código ou raciocinando sobre regras de negócio, mas sim na **orientação por força bruta** (`grep`, `list_dir` e leitura sequencial de dezenas de arquivos brutos para mapear importações e dependências).

O uso de um motor de indexação determinística via **Abstract Syntax Tree (AST / Tree-sitter)** converte o código-fonte em um grafo navegável (`graph.json`) em **CPU local (`0 Tokens` de LLM na indexação de código e `0 MB de VRAM`)**, permitindo que os agentes consultem apenas o subgrafo exato de símbolos, chamadas e raio de impacto antes de abrir qualquer arquivo.

---

## 2. Decisões Arquiteturais Mandatórias do Estudo

1. **Solução Agnóstica via Porta Hexagonal (Zero Fork Intrínsico):**
   - É vedado acoplar o código do Graphify diretamente ao núcleo do Kernel PCL AEOS ou manter um fork profundo das gramáticas AST.
   - O PCL AEOS define o contrato abstrato **`PCL Code Graph Port`**. O Graphify entra como o **`GraphifyAdapter` (Adaptador Padrão v1)** com versão fixada (*pinned version*). Isso permite substituí-lo no futuro por alternativas como `code-review-graph`, `graphlore`, `SCIP (Sourcegraph)` ou `Tree-sitter nativo` sem impacto nos agentes ou no Cockpit.
2. **Invariante de Custo `$0.00` e `0 MB VRAM`:**
   - Utilizar exclusivamente o motor Open-Source local (**Apache-2.0**), operando a Passada 1 (Tree-sitter AST) 100% em CPU.
   - Fica formalmente descartada a contratação do *Graphify Cloud* (SaaS pago em dólar), em conformidade com o `HIP-001` (Cold Storage) e a Seção 2 do `AGENTS.md`.
3. **Arquitetura Dual-Channel MCP & REST (Padrão Irmão do `pcl-laya`):**
   - **Canal 1 (`stdio` MCP Local):** Para consumo imediato pelo Antigravity IDE, Claude Code e Cursor durante a engenharia no monorepo.
   - **Canal 2 (Microsserviço HTTP/Docker `pcl-codegraph` na porta `:20150`):** Para consumo pelo PCL Cockpit (`:3001`), OmniRoute (`:20130`) e PaperClip (`:3100`) em deployments de VPS Dedicada (Onda 2 do `ADR-0017`) e Multi-Tenant com isolamento estrito por `tenant_id` (Onda 3 do `ADR-0017`).
4. **Sinergia com o Coprocessador Laya System One (`:20140`):**
   - O **Laya Intention Gating** (~20ms em CPU) atua como filtro prévio: perguntas conceituais (`general_chat`) ou tarefas em um único arquivo já aberto ignoram o grafo; tarefas multi-arquivo, refatorações e análises de arquitetura acionam o `PCL Code Graph Port`.

---

## 3. Contrato da Interface Abstrata (`PCL Code Graph Port`)

Qualquer adaptador de grafo de código plugado ao harness do PCL AEOS deve implementar as 5 primitivas canônicas:

1. **`codegraph_index(target_path, incremental=True) -> { status, nodes_count, edges_count, commit_sha, graph_sha256 }`**
   - Executa o parser AST determinístico (Tree-sitter) respeitando o manifesto `.graphifyignore` (excluindo `node_modules`, `.venv`, `dist`, `.git`).
2. **`codegraph_query(query, max_hops=2, token_budget=1500) -> { subgraph_nodes[], relationships[], file_anchors[] }`**
   - Recupera o subgrafo mínimo necessário para responder como um fluxo ou módulo opera no código.
3. **`codegraph_impact_radius(symbol_or_file, depth=2) -> { callers[], dependents[], risk_score, affected_tests[] }`**
   - Calcula o raio de explosão (*blast radius*) antes de uma edição ou refatoração para evitar quebras de build (`Exit Code 0`).
4. **`codegraph_god_nodes(scope, top_k=10) -> { hubs[] }`**
   - Lista os componentes de maior centralidade e acoplamento arquitetural do módulo analisado.
5. **`codegraph_check_freshness() -> { is_stale: boolean, dirty_files[], last_indexed_commit }`**
   - Integra-se ao *Deterministic Staleness Verifier* (`SPEC-PCL-AEOS-MEMORY-03`) para alertar caso o código tenha sofrido alterações desde a última indexação AST.

---

## 4. Roteiro do Estudo e Prova de Conceito (PoC em 4 Etapas)

- [ ] **Etapa 1 (Sandbox Local & `.graphifyignore`):** Configurar `.graphifyignore` na raiz do monorepo e rodar a indexação AST isolada sobre `projects/PromptCoreLabs_AEOS_Dashboard/src` e `services/pcl-laya/src`, medindo tempo de indexação, tamanho do `graph.json` e uso de RAM.
- [ ] **Etapa 2 (Benchmark Comparativo de Tokens A/B):** Executar 5 consultas complexas de arquitetura multi-arquivo no Antigravity IDE **sem Graphify** vs. **com Graphify MCP (`stdio`)**, registrando a taxa real de economia de tokens (meta: $\ge 65\%$) e latência de resposta.
- [ ] **Etapa 3 (Adaptador Hexagonal `services/pcl-codegraph`):** Encapsular o adaptador em Python/FastMCP seguindo o padrão do `pcl-laya` (`mcp_server.py` + `main.py` na porta `:20150` + `Dockerfile` non-root `CPUExecutionProvider`).
- [ ] **Etapa 4 (Acoplamento ao Laya Intention Gate & Git Hook):** Configurar atualização incremental pós-commit e regra de roteamento no Laya para acionar o grafo apenas em demandas de código multi-arquivo.

---

## 5. Documento Visual de Referência Executiva

O estudo completo com análise de custos, prós e contras, topologia Docker/Multi-Tenant e metáforas visuais animadas (padrão *Sandeco Mira Animator*) encontra-se materializado em:
- [`docs/estudo_arquitetural_graphify_harness_pcl_aeos.html`](../../docs/estudo_arquitetural_graphify_harness_pcl_aeos.html)
