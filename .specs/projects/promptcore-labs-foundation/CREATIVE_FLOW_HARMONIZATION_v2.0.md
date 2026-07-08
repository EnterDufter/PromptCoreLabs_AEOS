# [PCL] - Creative Flow Harmonization v2.0 (New Stack)

Este documento harmoniza a metodologia original "Creative Flow" com a infraestrutura técnica estabelecida em Abril de 2026.

## 1. Fluxo de Ontogênese de Projetos (PCL-FLOW)

### FASE 0: Ideação & Discovery (NotebookLM)
- **Ação**: O Usuário e a IA exploram conceitos, modelos de negócio e premissas.
- **Saída**: Notas de Insight no NotebookLM.
- **Ferramenta**: NotebookLM (The Brain).

### FASE 1: Especificação (TLC Specify)
- **Ação**: Conversão dos insights em `spec.md` dentro da pasta `.specs/features/`.
- **Regra**: Cada requisito DEVE ter um ID (ex: NGS-01) e Critérios de Aceite claros.
- **Ferramenta**: Antigravity + .specs/ filesystem.

### FASE 2: Design & Tasking (TLC Design/Tasks)
- **Ação**: Definição da arquitetura em `design.md` e quebra atômica em `tasks.md`.
- **EBITDA Shield**: Definição de quais tarefas vão para modelos LOCAIS (LM Studio/Ollama) e quais ficam na NUVEM (Gemini/Claude) via OmniRoute.
- **Ferramenta**: OmniRoute (Cérebro de Roteamento).

### FASE 3: Execução Assistida (TLC Execute + PaperClip)
- **Ação**: Implementação via Plan -> Implement -> Verify -> Commit.
- **Isolamento**: Todo código é executado e testado dentro de containers Docker.
- **Ferramenta**: PaperClip (Harness de Agentes) + Docker Desktop.

### FASE 4: Auditoria de Fechamento (Sovereignty of Context)
- **Ação**: Sincronização dos resultados, logs e decisões de volta para o NotebookLM via MCP.
- **Ferramenta**: NotebookLM MCP Server.

## 2. Matriz de Atribuição de Modelos (Smart Routing)

| Complexidade | Modelo Sugerido | Provedor | Custo/Impacto |
| :--- | :--- | :--- | :--- |
| Alta (Arquitetura) | Gemini 3.1 Pro / Claude 3.6 | Cloud | High Tokens (EBITDA Impact) |
| Média (Coding/Refactor)| Qwen3-Coder-30B | Local (LM Studio) | ZERO (EBITDA Shield) |
| Baixa (Boilerplate/Log)| Gemma 3 4B | Local (Ollama) | ZERO (EBITDA Shield) |

---
**Status da Metodologia:** ATIVA E HARMONIZADA.
**Data:** 2026-04-18
