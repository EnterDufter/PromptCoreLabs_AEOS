---
title: "Especificação Funcional e Arquitetural do PCL Cockpit v3.5 (Substituída pela v3.6)"
system_scope: "PCL Cockpit"
kernel_version: "v3.5.0"
type: "Architecture_Spec"
status: "Superseded"
superseded_by: "PCL_COCKPIT_SPEC_V3.6.md"
rag_tags: [pcl_cockpit, legacy_v3.5, superseded, liquid_glass, dual_plex]
created_at: "2026-10-29"
last_updated: "2026-11-01"
author: "PromptCore Labs Architecture"
normative_ref: "PCL-AEOS-NORM-01"
---

# 🖥️ Especificação Funcional & Arquitetural: PCL Cockpit v3.5 *(Histórico — Substituída pela v3.6)*

> [!WARNING]
> **Documento Histórico Substituído (`Status: Superseded`):** Esta especificação refere-se ao marco arquitetural `v3.5` e foi formalmente superada pela **[`PCL_COCKPIT_SPEC_V3.6.md`](./PCL_COCKPIT_SPEC_V3.6.md)** e pelo **[`ADR-0007.md`](../architecture/ADR-0007.md)**, que introduziram Memória Multi-Turn com *Sliding Window*, *Intention Gating* determinístico em CPU via Laya e Desacoplamento Retrátil de Fontes. Consulte sempre a especificação **v3.6** como fonte primária vigente.

---

## 1. Topologia de Apresentação Consolidada na v3.5 (3 Colunas Retráteis)

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

## 2. Componentes Centrais de Interação Introduzidos na v3.5

### 2.1. Super-Chatbubble Composer
- **TokenAquaOrb 3D:** Esfera vítrea Aqua OS X renderizada com gradientes radiais, especularidade física e keyframes de glow temporal (5s e 2s), morfando para pílula no hover para exibir o consumo numérico de tokens.
- **Console de Orquestração Cognitiva PCL:** Seletor com 4 perfis operacionais:
  1. *Síntese Executiva:* Fast-Path Cloud via Gemini 3.5 Flash-Lite (~3.4s).
  2. *Raciocínio Profundo & Código:* Modelos de raciocínio avançado (Claude 3.5 Sonnet / GPT-4o).
  3. *Soberano Local $0.00:* Enclave 100% on-premise com Laya em CPU e Ollama em GPU RTX.
  4. *Roteamento Autônomo OmniRoute:* Seleção dinâmica por sensibilidade PII e restrição orçamentária.
- **Sistema de Menções Táteis:** `@` para conectores corporativos (BigQuery, SAP, Sheets, HubSpot, Salesforce, Pipedrive, RD Station, Jira, Gmail, Calendar) e `#` para documentos normativos do PCL AEOS.
- **PII Guard LGPD Inline:** Sanitização instantânea no cliente com badge visual alertando campos mascarados.

### 2.2. Cortex Canvas Interativo & Inspector de 3 Abas
- Ao selecionar qualquer nó do grafo DAG no Canvas, o Inspector lateral exibe: *Aba Telemetria & Logs*, *Aba Inspeção de Payload* e *Aba Governança & Ações*.

### 2.3. PCL Artifact Drawer (Soberano)
- Largura ajustável por arrasto de mouse entre 380px e 850px com 4 abas contextuais: *Documento*, *Audit Trail SHA-256*, *Custos & Tokens* e *LGPD/PII*.

---

## 3. Substrato de Inferência & Middlewares Node.js (`vite.config.ts`)

| Rota / Endpoint | Função de Engenharia | Latência Típica |
| :--- | :--- | :--- |
| **`POST /api/aeos/infer`** | Gateway unificado com Fast-Path para Google Gemini 3.5 Flash-Lite via chave criptografada AES-256-GCM do OmniRoute em memória, parser SSE nativo (`open-sse`) para `:20130` e failover imediato para Ollama local (`:11434`, `qwen2.5-coder:7b`). *(Evoluído para Multi-Turn completo na v3.6).* | **~3.4s a 6.4s** (Cloud) / **~800ms** (Local) |
| **`POST /api/aeos/search`** | Busca web paralela em Wikipedia API, ArXiv e bases científicas no Node.js sem restrições de CORS. *(Submetida a Intention Gating Laya na v3.6).* | **~250ms a 400ms** |
| **`GET /api/aeos/status`** | Socket Probes TCP sub-segundo em 250ms checando portas 20130, 11434, 20140 e 5432. | **< 30ms** |
