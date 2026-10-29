---
title: "Especificação Funcional e Arquitetural do PCL Cockpit v3.5"
system_scope: "PCL Cockpit"
kernel_version: "v3.5.0"
type: "Architecture_Spec"
status: "Approved"
rag_tags: [pcl_cockpit, architecture, specifications, fast_path, liquid_glass, dual_plex, cortex_canvas]
created_at: "2026-10-29"
last_updated: "2026-10-29"
author: "PromptCore Labs Architecture"
normative_ref: "PCL-AEOS-NORM-01"
---

# 🖥️ Especificação Funcional & Arquitetural: PCL Cockpit v3.5

> **Definição Canônica:** O **PCL Cockpit** é a interface primária de pilotagem agêntica e orquestração cognitiva do PromptCoreLabs_AEOS, executada na porta local **`:3001`**. Prover governança em tempo real sobre modelos híbridos, observabilidade de grafos DAG e conformidade com normas ISO 27001 e ISO 42001.

---

## 1. Topologia de Apresentação (3 Colunas Retráteis)

1. **Left Utility Sidebar (64px a 260px):**
   - Acordeão de Projetos (`Next Gen Sports`, `Arch Living`, `Defesa B2B`) com conversas aninhadas e contador de agentes ativos.
   - Organização temporal de conversas (*Hoje*, *Ontem*, *Últimos 7/15/30 dias*).
   - Suporte a multi-abas de conversa (até 5 abas abertas simultâneas com persistência de estado).
   - Colapso fluido para 64px com tooltips táteis SVG baseados nos Google Material Symbols.
2. **Central Workspace (Dual-Plex):**
   - Modo `chat`: Stream de mensagens com Live Execution Stepper (5 etapas) e MarkdownRenderer enriquecido.
   - Modo `canvas`: Grafo acíclico dirigido (DAG) interativo em tempo real via Canvas API com zoom, pan e nó ativo pulsante.
   - Modo `dual`: Divisor interativo com drag de mouse para visualização simultânea de Chat e Cortex Canvas.
3. **Right Sidebar (Status & Telemetria em Tempo Real):**
   - Painel retrátil com status dos 4 serviços centrais (Ollama Local, PostgreSQL Audit Trail, Cortex Visualizer e Vertex/Gemini Hub).
   - Telemetria de agentes em atividade com timers em tempo real.
   - Indicador de conformidade dos Stage Gates TLC v3.
   - Aba flutuante lateral quando recolhida (`[<< Painel de Status]`).

---

## 2. Componentes Centrais de Interação

### 2.1. Super-Chatbubble Composer
- **TokenAquaOrb 3D:** Esfera vítrea Aqua OS X renderizada com gradientes radiais, especularidade física e keyframes de glow temporal (5s e 2s), morfando para pílula no hover para exibir o consumo numérico de tokens.
- **Console de Orquestração Cognitiva PCL:** Seletor com 4 perfis operacionais:
  1. *Síntese Executiva:* Fast-path Cloud via Gemini 3.5 Flash-Lite (~3.4s).
  2. *Raciocínio Profundo & Código:* Modelos de raciocínio avançado (Claude 3.5 Sonnet / GPT-4o).
  3. *Soberano Local $0.00:* Enclave 100% on-premise com Laya em CPU e Ollama em GPU RTX.
  4. *Roteamento Autônomo OmniRoute:* Seleção dinâmica por sensibilidade PII e restrição orçamentária.
- **Sistema de Menções Táteis:**
  - `@`: Catálogo de conectores corporativos com logotipos vetoriais oficiais (BigQuery, SAP, Sheets, HubSpot, Salesforce, Pipedrive, RD Station, Jira, Gmail, Calendar).
  - `#`: Documentos e bases normativas do PCL AEOS.
- **PII Guard LGPD Inline:** Sanitização instantânea no cliente com badge visual alertando campos mascarados.

### 2.2. Cortex Canvas Interativo & Inspector de 3 Abas
- Ao selecionar qualquer nó do grafo DAG no Canvas, o Inspector lateral se abre oferecendo 3 visões:
  1. *Aba Telemetria & Logs:* Latência do nó em milissegundos, consumo de hardware (0 MB VRAM) e status de execução.
  2. *Aba Inspeção de Payload:* JSON de entrada e saída com visualização de código formatado e botão de cópia.
  3. *Aba Governança & Ações:* Trilha SHA-256 e acionamento de Stage Gates TLC v3.

### 2.3. PCL Artifact Drawer (Soberano)
- Substitui drawers genéricos de mercado.
- Largura ajustável por arrasto de mouse entre 380px e 850px.
- 4 abas contextuais: *Documento*, *Audit Trail SHA-256*, *Custos & Tokens* e *LGPD/PII*.

---

## 3. Substrato de Inferência & Middlewares Node.js (`vite.config.ts`)

| Rota / Endpoint | Função de Engenharia | Latência Típica |
| :--- | :--- | :--- |
| **`POST /api/aeos/infer`** | Gateway unificado com Fast-Path para Google Gemini 3.5 Flash-Lite via chave criptografada AES-256-GCM do OmniRoute em memória, parser SSE nativo para `:20130` e failover imediato para Ollama local (`:11434`, `qwen2.5-coder:7b`). | **~3.4s a 6.4s** (Cloud) / **~800ms** (Local) |
| **`POST /api/aeos/search`** | Busca web paralela em Wikipedia API, ArXiv e bases científicas no Node.js sem restrições de CORS. | **~250ms a 400ms** |
| **`GET /api/aeos/status`** | Socket Probes TCP sub-segundo em 250ms checando portas 20130, 11434, 20140 e 5432. | **< 30ms** |

---

## 4. Invariantes de Conformidade
- **Zero Mocks:** Toda resposta exibida decorre de inferência real; funções estáticas de contingência são estritamente proibidas.
- **Isolamento de Hardware:** O microserviço Laya opera com 0 MB de VRAM na GPU local.
- **Segurança de Sessão:** Strict 2 Devices Guard ativo, impedindo a concorrência não autorizada de estações.
