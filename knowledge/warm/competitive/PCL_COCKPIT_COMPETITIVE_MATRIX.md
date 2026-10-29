---
title: "Matriz Canônica de Inteligência Competitiva: PCL Cockpit vs. Jumpad.ai, ChatGPT, Gemini e Claude"
system_scope: "PCL AEOS Kernel / PCL Cockpit"
kernel_version: "v3.5.0"
type: "Competitive_Analysis"
status: "Approved"
rag_tags: [competitive_analysis, benchmark, pcl_cockpit, jumpad_ai, read_ai, chatgpt, gemini, claude, finops, sovereignty]
created_at: "2026-10-29"
last_updated: "2026-10-29"
author: "PromptCore Labs Architecture"
normative_ref: "PCL-AEOS-NORM-01"
---

# ⚔️ Matriz Canônica de Inteligência Competitiva: PCL Cockpit vs. Mercado

> **Declaração de Posicionamento:** O **PCL Cockpit** é o centro de comando e substrato cognitivo unificado do **PromptCoreLabs_AEOS**. Diferente de soluções puramente comerciais em nuvem (Jumpad.ai) ou assistentes autorregressivos genéricos (ChatGPT, Gemini, Claude), o PCL Cockpit opera sob o princípio da **Soberania Absoluta de Dados (On-Premise / BYOS)**, eliminação do desperdício de tokens via **Sistema 1 em CPU (Laya INT8)** e governança estrita auditável com **Stage Gates TLC v3** assinados em SHA-256.

---

## 1. Resumo Executivo das Forças Competitivas

```mermaid
graph TD
    classDef pcl fill:#0c2340,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef market fill:#1e293b,stroke:#64748b,stroke-width:1.2px,color:#ffffff;

    PCL["<b>PCL Cockpit (PCL AEOS)</b><br/>• Soberania Local ($0.00)<br/>• Laya System 1 (0 MB VRAM)<br/>• Stage Gates TLC v3 • SHA-256"]:::pcl

    JUMP["<b>Jumpad.ai</b><br/>• UX No-Code Corporativa<br/>• @mentions & Action Cards<br/>• Dependência Cloud SaaS"]:::market

    BIG["<b>Big Players (OpenAI, Google, Anthropic)</b><br/>• Fronteira de Raciocínio (LLM)<br/>• Dependência Monolítica / Lock-in<br/>• Custo Recorrente por Assento/Token"]:::market

    PCL -.->|"Insumos de UX/UI"| JUMP
    PCL -.->|"Desacoplamento & Orquestração"| BIG
```

---

## 2. Comparativo Tridimensional Aprofundado

### Dimensão 1: Experiência do Operador (UX/UI & Interatividade Tátil)

| Funcionalidade / Padrão | PCL Cockpit (PCL AEOS) | Jumpad.ai (Benchmark) | ChatGPT / Gemini / Claude |
| :--- | :--- | :--- | :--- |
| **Arquitetura Visual** | **Liquid Glass Bento Grid:** Layout de 3 colunas retráteis, refração dinâmica por cursor, glassmorphism e micro-elevação tátil (1° a 1.5°). | Layout 2 colunas com cards brancos minimalistas estilo Notion/Linear. | Chat linear de 1 coluna com histórico lateral básico. |
| **Workspace Dual-Plex** | **Sim:** Alternância e tela dividida (*Split Dual-Plex*) entre Chat Stream e **Cortex Canvas (DAG em tempo real)**. | Não; navegação por abas separadas de menu. | Apenas visualização de Canvas de texto/código (OpenAI/Claude Artifacts). |
| **Menções a Sistemas (@) e Docs (#)** | **Sim:** `@BigQuery`, `@SAP`, `@Sheets`, `@HubSpot`, `@Salesforce`, `@Jira`, `@Gmail`, `@Agenda` e `#Docs` com logos vetoriais oficiais. | **Sim:** Menção `@` para SaaS mapeados (BigQuery, SAP, Sheets, Salesforce, HubSpot). | `@` restrito a GPTs internos (OpenAI) ou extensões proprietárias (Gemini Workspace). |
| **Ações Operacionais Inline** | **Sim:** Cards de ação editáveis (ex: minutas de e-mail, criação de reuniões, disparo de workflows) sem sair do chat. | **Sim:** Cards de faturas e agendamento de reuniões diretamente no fluxo. | Não; responde apenas texto ou chamadas de função invisíveis ao usuário. |
| **Medidor de Contexto LLM** | **TokenAquaOrb 3D:** Esfera vítrea Aqua OS X com morfismo tátil para pílula e glow temporal oscilante (5s/2s). | Barra de progresso linear simples de tokens. | Invisível ou aviso genérico de contexto excedido. |
| **Drawer de Artefatos** | **PCL Sovereign Drawer:** Gaveta lateral retrátil e redimensionável por mouse drag (380px–850px) com 4 abas (*Doc*, *SHA-256*, *Custos*, *PII*). | Modal/slide-over lateral com largura estática. | Janela lateral dividida (Artifacts / Canvas) sem trilha de auditoria. |

---

### Dimensão 2: FinOps, Roteamento e Eficiência de Hardware

| Critério de Engenharia | PCL Cockpit (PCL AEOS) | Jumpad.ai | ChatGPT / Gemini / Claude |
| :--- | :--- | :--- | :--- |
| **Custo Marginal Operacional** | **$0.00 / mês (Modo Soberano Local):** Operação completa em CPU host e GPU local sem fatura externa. | Assinatura corporativa de SaaS + repasse de custo de API com margem. | US\$ 20 a US\$ 30 por usuário/mês + consumo de API enterprise. |
| **Uso de GPU VRAM na Triagem** | **0 MB de VRAM:** Coprocessador Laya System One opera 100% em CPU host (INT8 via ONNX Runtime). | N/A (Execução remota em cloud). | N/A (Execução em nuvem do provedor). |
| **Preservação de GPU para LLMs** | **Garantida:** A GPU dedicada (ex: RTX 3050) fica 100% livre para inferência offline (`qwen2.5-coder:7b`). | N/A. | N/A. |
| **Tempo de Decisão em Triagem** | **~20ms a 35ms:** Single forward pass determinístico sem geração token a token. | 1.000ms a 3.000ms (chamadas de LLM em nuvem). | 800ms a 2.500ms (LLM generativo padrão). |
| **Resiliência Multi-Provedor** | **OmniRoute Gateway (:20130):** Fast-Path Gemini 3.5 Flash-Lite (~3.4s) com failover determinístico sub-segundo para Ollama local. | Orquestração multi-modelo em nuvem própria. | Lock-in total no ecossistema de cada fornecedor proprietário. |
| **Detecção de Portas Offline** | **Fail-Fast TCP em 300ms:** Elimina esperas de 25s–60s caso contêineres estejam parados. | Não aplicável (arquitetura centralizada SaaS). | Tratamento de erro 504 Gateway Timeout padrão HTTP. |

---

### Dimensão 3: Governança, Soberania e Compliance (Enterprise Ready)

| Requisito Regulatório | PCL Cockpit (PCL AEOS) | Jumpad.ai | Big Players (OpenAI, Google, Anthropic) |
| :--- | :--- | :--- | :--- |
| **Hierarquia de Aprovação** | **Stage Gates TLC v3:** O agente jamais se autoaprova; autoridade soberana irrevogável exclusiva do humano. | Aprovações configuráveis em fluxos no-code. | Agentes autônomos tomam decisões diretas sem barreira de gates formais. |
| **Trilha de Auditoria Criptográfica** | **Hashes SHA-256 Imutáveis:** Cada mensagem, plano e artefato é atestado no PostgreSQL 17. | Logs de auditoria estruturados por usuário e agente. | Histórico de chat recuperável, sem prova de integridade matemática imutável. |
| **Custódia de Documentos (Storage)** | **Zero-Bin Custody (Headless BYOS):** Nenhum arquivo confidencial é custodiado no servidor; sincronização direta no tenant corporativo (Google Workspace / M365). | Armazenamento na infraestrutura de cloud do Jumpad (AWS/GCP). | Arquivos enviados ficam armazenados nos servidores do provedor da LLM. |
| **Proteção de Privacidade (DLP)** | **PII Guard LGPD Ativo:** Sanitização em tempo real no cliente antes de qualquer transmissão externa. | Políticas de conformidade e mascaramento empresarial. | Termos empresariais de não treinamento de dados, sem sanitização inline no cliente. |
| **Controle de Sessão Estrito** | **Strict 2 Devices Guard:** Bloqueio automático de concorrência com alerta de segurança para mitigar credenciais compartilhadas. | Autenticação SSO / SAML corporativa padrão. | Sessões simultâneas livres ou controle por assento corporativo. |

---

## 3. Matriz Síntese de Diferenciação Estratégica

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MAPA DE VANTAGEM COMPETITIVA                                 │
├───────────────────────────────┬───────────────────────────────┬──────────────────────────────┤
│ ONDE APRENDEMOS COM O MERCADO │ ONDE O PCL COCKPIT SUPERA     │ O QUE JAMAIS ADOTAREMOS      │
├───────────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ • Menções @apps do Jumpad     │ • Soberania On-Premise ($0.00)│ • Mocks ou textos estáticos  │
│ • Rápido feedback visual      │ • 0 MB VRAM com Laya em CPU   │ • Dependência de SaaS pago   │
│ • Cards de ação integrados    │ • Stage Gates TLC v3 imutáveis│ • Decisões de IA sem gate    │
│ • Resumos automáticos Meet/Zoom│ • Trilha criptográfica SHA-256│ • Custódia de dados do cliente│
└───────────────────────────────┴───────────────────────────────┴──────────────────────────────┘
```
