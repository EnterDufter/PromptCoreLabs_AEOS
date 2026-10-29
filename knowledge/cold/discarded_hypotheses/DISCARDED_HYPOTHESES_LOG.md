---
title: "Registro Canônico de Hipóteses e Decisões Técnicas Descartadas (Cold Storage)"
system_scope: "PCL AEOS Kernel / PCL Cockpit"
kernel_version: "v3.5.0"
type: "Cold_Log"
status: "Rejected"
rag_tags: [cold_storage, discarded_hypotheses, architecture, anti_patterns, lessons_learned, decisions]
created_at: "2026-10-29"
last_updated: "2026-10-29"
author: "PromptCore Labs Architecture"
normative_ref: "PCL-AEOS-NORM-01"
---

# 🧊 Registro Canônico de Hipóteses Descartadas & Anti-Patterns (Cold Storage)

> **Objetivo Normativo:** Preservar a memória histórica das decisões de engenharia, registrando explicitamente as abordagens que foram avaliadas, testadas e formalmente **rejeitadas**. Este documento atua como uma salvaguarda contra regressões, impedindo que futuras iterações ou novos agentes de IA reintroduzam erros, complexidades ou custos já superados.

---

## 1. Descarte de Grafos de Conhecimento via Stack JVM Dedicada (Neo4j / Graphiti Cloud)

* **Hipótese Original:** Implantar uma instância do Neo4j ou adotar um SaaS de grafos gerenciado (Graphiti Cloud / Zep) para armazenar relacionamentos semânticos entre artefatos e entidades corporativas.
* **Motivo da Rejeição:**
  1. *Consumo Massivo de Memória:* A JVM do Neo4j aloca entre 4 GB e 8 GB de memória RAM estática, o que, somado à carga de inferência local e aos contêineres Docker, gerava risco iminente de esgotamento de memória no host.
  2. *Violação do Invariante $0.00 & Soberania:* O uso de SaaS em nuvem violava os Princípios 1 e 9 do PCL AEOS (Soberania Tecnológica e Custo Zero), criando faturas recorrentes em dólar e dependência de tráfego externo.
* **Solução Aprovada (ADR-0005):** Adoção do **PCL Temporal Graph-RAG soberano no PostgreSQL 17 + PGVector**, confinado ao schema isolado `memory.*` no contêiner `pcl-db` já existente. Zero processo adicional, zero overhead de JVM e preservação estrita do custo $0.00/mês.

---

## 2. Descarte de Componente de Gaveta Genérico / SaaS (Bitrix24 Slide-Over)

* **Hipótese Original:** Manter um componente rotulado como `BitrixSlideOver.tsx` emulando uma interface genérica inspirada no Bitrix24 para visualização de artefatos.
* **Motivo da Rejeição:**
  1. *Poluição de Identidade e Acoplamento:* O PCL Cockpit possui design system próprio (*Liquid Glass Bento Grid System*). O nome e a estrutura de terceiros geravam ambiguidade de governança e sugeriam dependência de um CRM externo.
  2. *Limitação Funcional:* A gaveta anterior possuía largura estática fixa (sem redimensionamento) e não integrava as trilhas de auditoria criptográfica exigidas pela norma ISO 27001 / ISO 42001.
* **Solução Aprovada (Sprint 3 do Cockpit):** Criação do **`PCLArtifactDrawer.tsx`**, um drawer soberano retrátil com redimensionamento fluido tátil por mouse drag (380px a 850px persistido no `localStorage`), com abas dedicadas para *Visualização de Documento*, *Trilha de Auditoria SHA-256*, *Telemetria de Tokens/Custos* e *Sanitização PII Guard LGPD*.

---

## 3. Descarte de Respostas Mockadas / Pré-Fabricadas (Hardcoded Mocks)

* **Hipótese Original:** Utilizar funções estáticas de contingência (como `generateRichResponse` em `omniRouteService.ts`) que retornavam textos fixos com tabelas pré-formatadas (ex: dados de salários de TI em São Paulo) quando os gateways upstream atrasavam.
* **Motivo da Rejeição:**
  1. *Contaminação Semântica Crítica:* Na tentativa de enriquecer perguntas gerais, o template continha a frase `"(faixas salariais, níveis de senioridade CLT vs PJ...)"`. Ao menor atraso de rede, o filtro de palavras-chave casava `salar` e respondia com a tabela de remuneração paulistana para perguntas que não tinham relação alguma com o tema (como a pergunta sobre a taxonomia dos 5 tipos de RAG).
  2. *Quebra da Confiança do Usuário:* A experiência tornava-se duvidosa e inaceitável para tomadores de decisão corporativos.
* **Solução Aprovada:** Erradicação de 100% dos mocks estáticos. O PCL Cockpit agora opera exclusivamente com **inferência factual viva**: rota Fast-Path com Google Gemini 3.5 Flash-Lite (~3.4s) ancorada na credencial criptografada do cofre AES-256-GCM, com failover imediato para o Ollama local (`qwen2.5-coder:7b` a $0.00). Em caso de indisponibilidade total, o sistema emite um diagnóstico transparente e honesto de portas, jamais forjando respostas falsas.

---

## 4. Descarte de Timeouts Longos de Rede (25s a 60s) em Contêineres Offline

* **Hipótese Original:** Delegar a gestão de timeouts ao comportamento padrão do Node.js/Fetch (`AbortSignal.timeout(25000)` a `60000ms`) nas chamadas HTTP para os serviços locais (`:20130` OmniRoute, `:20140` Laya).
* **Motivo da Rejeição:**
  1. *Percepção de Congelamento:* Quando o Docker Desktop estava desligado pelo operador, a aplicação aguardava de 38 a 58 segundos até receber a falha de socket do sistema operacional, frustrando a expectativa de agilidade.
* **Solução Aprovada:** Implementação de **Socket Probes TCP Sub-Segundo (`checkTcpPort` em 250ms–300ms)** no middleware do `vite.config.ts`. Se a porta local estiver fechada, o sistema detecta em menos de um terço de segundo e chaveia imediatamente para a rota disponível, garantindo fluidez contínua.

---

## 5. Descarte de Parsing JSON Monolítico sobre Streams SSE (`open-sse`)

* **Hipótese Original:** Tratar o endpoint `/v1/chat/completions` do OmniRoute como uma API JSON padrão síncrona executando `await response.json()`.
* **Motivo da Rejeição:**
  1. *Falha Oculta de Sintaxe:* O motor de inferência do OmniRoute é baseado em `open-sse`, que sempre entrega eventos em formato Server-Sent Events (`data: {"object":"chat.completion.chunk"}`).
  2. O comando `response.json()` lançava invariavelmente `SyntaxError: Unexpected token 'd'` em todas as chamadas legítimas do Gemini, forçando quedas desnecessárias para fallbacks mais lentos.
* **Solução Aprovada:** Desenvolvimento da função de decodificação universal `parseOpenAiOrSseResponse`, capaz de processar nativamente streams SSE concatenando os deltas em tempo real e mantendo compatibilidade com retornos JSON estritos.

---

## 6. Descarte de Injeção Indiscriminada de Contexto Interno em Consultas Abertas

* **Hipótese Original:** Injetar o acervo canônico corporativo (ADRs e diretrizes internas do PCL AEOS) no prompt de sistema de toda e qualquer mensagem enviada ao chat.
* **Motivo da Rejeição:**
  1. *Comportamento Robótico e Engessado:* Quando o usuário fazia perguntas técnicas gerais de mercado (ex: *"Explique o que é RAG"* ou *"Compare o modelo Laya com o Jev sob a ótica da internet"*), o modelo gerava respostas rígidas começando com `"Como Cortex Enterprise Engine do PCL AEOS sob o ADR-0005..."`, frustrando o operador comum que desejava uma análise objetiva e fluida como a encontrada no Gemini ou ChatGPT.
* **Solução Aprovada:** Calibração do **Grounding Híbrido Federado (`intelligentGroundingService.ts`)**:
  - *Perguntas Gerais de Tecnologia/Mercado:* Resposta limpa, universal e natural (padrão Gemini 3.6 Flash), fundamentada em literatura pública (Convai Innovations, Apache 2.0, arXiv).
  - *Perguntas Corporativas Explícitas:* Injeção dos ADRs e normas canônicas apenas se o usuário mencionar explicitamente `PCL`, `AEOS`, `PromptCore`, `ADR` ou selecionar `#documentos`.
