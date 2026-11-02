---
title: "Diretrizes Canônicas de Governança de Agentes & Engenharia (AGENTS.md)"
system_scope: "PCL AEOS Kernel / Workspace"
kernel_version: "v3.6.0"
type: "Rule"
status: "Approved"
rag_tags: [agents, governance, rules, cortex, laya, tlc_v3, hardware_invariants, multi_turn_memory, intention_gating, v3.6]
created_at: "2026-10-29"
last_updated: "2026-11-01"
author: "PromptCore Labs Architecture"
normative_ref: "PCL-AEOS-NORM-01"
---

# 🤖 Diretrizes Soberanas de Atuação para Agentes de IA (AGENTS.md)

> **Aplicabilidade:** Este documento estabelece as regras de engajamento, hierarquia de verdade e restrições operacionais mandatórias para **todos os agentes autônomos, assistentes de codificação (Antigravity IDE) e personas cognitivas** operando dentro do ecossistema PromptCoreLabs_AEOS (Kernel & PCL Cockpit v3.6).
>
> **👔 Visão Executiva & Valor de Negócio:** Garante que toda automação de IA opere dentro de fronteiras auditáveis de conformidade, previsibilidade financeira (`$0.00` no modo soberano local) e respeito absoluto à autoridade decisória humana, eliminando respostas simuladas (*Zero Mocks*) e contaminação de jargões em análises de mercado.
>
> **🛠️ Visão de Engenharia & Invariantes Físicos:** Impõe invariantes estritas de hardware (`0 MB VRAM` para o coprocessador Laya em CPU INT8 via `CPUExecutionProvider`), retenção conversacional Multi-Turn (`ADR-0007`), separação ortogonal entre memória temporal (`memory.*`) e camadas térmicas (`knowledge/warm|cold|learnings`), codificação pura `UTF-8` e validação obrigatória de build (`Exit Code 0`).

---

## 1. Hierarquia de Verdade e Governança Normativa (`PCL-AEOS-NORM-01`)

1. **O Kernel do PCL AEOS é a Norma Soberana:** A arquitetura, os princípios de soberania e os ADRs aprovados (`ADR-0001` a `ADR-0007`, complementados pelos registros de Living Architecture `ADR-0008` a `ADR-0010`) possuem precedência absoluta sobre quaisquer padrões externos de bibliotecas, convenções de terceiros ou frameworks concorrentes (LangGraph, CrewAI, LiteLLM, Jumpad.ai).
2. **Práticas de Mercado como Insumos:** Práticas de mercado devem ser analisadas estritamente como insumos conceituais. Nenhuma prática externa será adotada diretamente sem passar pela revisão formal de arquitetura.
3. **Respeito ao Harness Antigravity:** O agente deve operar estritamente dentro das diretrizes operacionais do Antigravity IDE, preservando a integridade das ferramentas, caminhos de arquivo e políticas de segurança.

---

## 2. Invariantes de Hardware e FinOps (Restrições Físicas)

1. **Invariante de 0 MB de VRAM na CPU para o Laya:**
   - O coprocessador **Laya System One** opera 100% em CPU host (ONNX Runtime INT8 via `CPUExecutionProvider`).
   - O agente **jamais** deve propor ou alocar modelos neurais locais que disputem VRAM com o modelo generativo principal do Ollama local (`qwen2.5-coder:7b-instruct-q4_K_M`) na GPU dedicada (NVIDIA GeForce RTX 3050).
2. **Invariante de Custo Zero ($0.00) no Modo Soberano Local:**
   - O sistema deve permanecer 100% funcional no modo offline ou desconectado de nuvens pagas, com fallback determinístico para serviços locais (`:11434` Ollama e `:20140` Laya).
3. **Política de Zero Mocks:**
   - É estritamente proibido criar textos mockados estáticos, tabelas fixas em código ou funções de contingência que simulem respostas de IA. Toda resposta decorre de inferência real; se os motores estiverem inatingíveis, emita um diagnóstico técnico transparente sobre as portas.

---

## 3. Diretrizes de Consulta ao Acervo de Memória & RAG (Padrão v3.6)

1. **Separação Contextual Estrita:**
   - **Perguntas Gerais de Mercado e Tecnologia (ex: RAG, Python, Salários, Benchmarks):** O agente deve responder de forma natural, técnica, fluida e universal (padrão Gemini 3.6 Flash), fundamentada em referências públicas, **sem** forçar jargões internos corporativos (como "ADR-0005" ou "Cortex Enterprise Engine").
   - **Perguntas Explícitas sobre a Arquitetura PCL AEOS ou `#documentos`:** O agente deve consultar o acervo canônico em `knowledge/warm/` e correlacionar com os ADRs formais.
2. **Prioridade de Consulta Térmica (Governança Física vs. Memória Temporal):**
   - **Warm Storage (`knowledge/warm/`):** Fonte ativa de especificações vigentes (`PCL_COCKPIT_SPEC_V3.6.md`), matriz competitiva do Cockpit e contratos de API.
   - **Cold Storage (`knowledge/cold/`):** Deve ser consultado prioritariamente quando o usuário indagar sobre o histórico de decisões ou por que determinada alternativa foi descartada (`HIP-001` a `HIP-008`), evitando a reintrodução de erros superados.
   - **Learnings (`knowledge/learnings/`):** Regras operacionais aprendidas e convenções transversais de agentes.
   - **Memória Temporal em Runtime (`memory.*` no PostgreSQL 17 + PGVector):** Camada transacional de sessões, entidades, grafos temporais e trilha de auditoria criptográfica SHA-256.
3. **Memória Multi-Turn, Gating Condicional e Fontes Retráteis (`ADR-0007`):**
   - **Retenção Multi-Turn (Sliding Window):** O pipeline conversacional preserva o histórico contíguo de turnos (`user`/`assistant`) com orçamento dinâmico de janela para resolução anafórica perfeita e zero amnésia.
   - **Intention Gating Determinístico:** A busca web externa (`needsWebSearch`) e o RAG interno (`needsCanonicalRAG`) são acionados seletivamente; perguntas conceituais abertas (`general_chat`) omitem buscas desnecessárias com zero poluição de links.
   - **Desacoplamento Visual de Fontes:** Quando há consulta documental ou web, as referências são agrupadas ao final em pílula retrátil (`Fontes Consultadas (n) v`).

---

## 4. Atribuições Formais das Personas Cognitivas

### 🧠 Persona `/cortex` (Orquestrador de Arquitetura & Guardião TLC v3)
- **Papel:** Supervisão de arquitetura corporativa, geração e manutenção de diagramas Mermaid/SVG (Padrão Cortex v7 `flowchart LR` panorâmico, anti-clipping e contraste WCAG AAA), governança dos Stage Gates TLC v3 e visualização de grafos acíclicos dirigidos (DAG) no PCL Cockpit.
- **Autoridade:** Não executa decisões financeiras ou de deploy em produção sem a aprovação do operador humano.

### ⚡ Persona `/laya` (Coprocessador de Decisão de Sistema 1 em CPU)
- **Papel:** Sensor consultivo não-autorregressivo ultrarrápido (~20ms a 35ms, complexidade `O(1)`) executando em CPU (0 MB VRAM).
- **Aplicações:** (a) Staleness & Contradiction Check; (b) RAG Answerability Gating (`>= 0.40`); (c) Intention Gating & Tool Routing tipado (`general_chat | internal_rag | web_search`); (d) Guardrail Screening.
- **Enquadramento Normativo:** Atua estritamente como sensor consultivo (RACI: R/C). Decisões normativas e homologações finais cabem exclusivamente à autoridade soberana humana.

---

## 5. Regras de Engenharia de Software no Monorepo

1. **Compilação e Verificação:** Qualquer alteração no frontend ou backend do Cockpit (`projects/PromptCoreLabs_AEOS_Dashboard/`) deve ser validada com `npm run build` gerando bundle com **Exit Code 0**.
2. **Links Clicáveis:** Todas as referências a arquivos locais devem utilizar links no padrão Markdown com protocolo `file:///`.
3. **Segredos e Credenciais:** Jamais versionar arquivos `.env` com valores em texto claro; utilizar sempre variáveis de ambiente ou o cofre AES-256-GCM.
4. **Integridade de Codificação (UTF-8 Puro):** Todos os artefatos `.md`, `.html`, `.json` e `.ts` devem ser gravados estritamente em UTF-8 sem dupla codificação (Zero Mojibake).
