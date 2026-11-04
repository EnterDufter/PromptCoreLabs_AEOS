---
title: "Especificação Funcional e Arquitetural do PCL Cockpit v3.8"
system_scope: "PCL Cockpit"
kernel_version: "v3.8.0"
type: "Architecture_Spec"
status: "Approved"
rag_tags: [pcl_cockpit, architecture, specifications, v3.8, thread_zero, squads, skills_manager, no_code_wizard, shadow_dom_extension, hitl_escalation, cfo_roi_calculator, sha256_audit, ebitda_shield]
created_at: "2026-11-03"
last_updated: "2026-11-03"
author: "PromptCore Labs Architecture & Cortex Intelligence"
normative_ref: "PCL-AEOS-NORM-01"
---

# 🖥️ Especificação Funcional & Arquitetural: PCL Cockpit v3.8

> **Definição Canônica:** O **PCL Cockpit** é o centro de comando agêntico soberano e a interface executiva e técnica do ecossistema PromptCoreLabs_AEOS, executado na porta local **`:3001`**. A versão **v3.8** consolida o saneamento ergonômico pleno, a extensão companheira no navegador via Shadow DOM isolado, a escalação hierárquica Human-in-the-Loop em 2 níveis, o despacho 1-clique de atas WhisperX e o Simulador Soberano de ROI Corporativo para o CFO.

> [!IMPORTANT]
> **👔 Visão Executiva & Valor de Negócio (Para C-Level, Diretores e Investidores):**  
> Concebido pela **PromptCore Labs**, o **PCL Cockpit v3.8** é a cabine de pilotagem que orquestra esquadrões de agentes autônomos sob o **PCL AEOS**. Em rigorosa **Avaliação Técnica Duplo-Cega Imparcial** (na qual especialistas julgaram a qualidade sem saber a marca da IA), conquistou a liderança global com **4.95 / 5.0** — superando Google Gemini (`4.45`), ChatGPT Enterprise (`4.30`) e Microsoft Copilot (`3.80`). Garante **Segredo Corporativo Blindado (Resíduo Zero de Dados / BYOS)**, **custo marginal de $0.00** em modo local, trava orçamentária rígida (*EBITDA Shield*) e autoridade decisória humana irrevogável.

> [!NOTE]
> **🛠️ Visão de Engenharia & Invariantes Físicos:** Aplicação React 19 + TypeScript + Vite (`:3001`) com *Liquid Glass Bento Grid* de 3 colunas retráteis, **Invariante de 0 MB de VRAM na CPU** para o coprocessador Laya System One (`ONNX INT8` via `CPUExecutionProvider`), **Extensão Manifest V3** com encapsulamento estrito por **Shadow DOM** em ERPs/CRMs legados, barramento de telemetria HTTP real (`/api/aeos/status`) e atesto criptográfico imutável **SHA-256** compatível com ISO/IEC 27001 e ISO/IEC 42001.

---

## 1. Topologia de Apresentação (3 Colunas Retráteis & Extensão Injetada)

```mermaid
flowchart LR
    subgraph C1["1. Left Sidebar (64px–260px)"]
        direction TB
        L1["<b>Projetos & Squads</b><br/>Acordeão por data e área"]
        L2["<b>Thread Zero</b><br/>Início limpo com Hero State"]
        L1 --> L2
    end

    subgraph C2["2. Central Workspace (Dual-Plex)"]
        direction TB
        M1["<b>Live Stepper (5 Fases)</b><br/>Telemetria síncrona em ms"]
        M2["<b>Inteligência de Reuniões</b><br/>Atas WhisperX & Despacho 1-Clique"]
        M3["<b>Cortex Canvas DAG</b><br/>Grafo acíclico dirigido interativo"]
        M1 --> M2 --> M3
    end

    subgraph C3["3. Right Sidebar & Drawer"]
        direction TB
        R1["<b>Monitor de Extensões Ativas</b><br/>Sessões injetadas & revogação"]
        R2["<b>Sovereign Drawer (380–850px)</b><br/>Docs, FinOps Ledger & Audit SHA-256"]
        R1 --> R2
    end

    subgraph EXT["4. PCL Companion Extension (Navegador)"]
        direction TB
        X1["<b>Shadow DOM Fechado</b><br/>Zero vazamento de CSS em Salesforce/SAP"]
        X2["<b>Inline Action Dock</b><br/>Polir, Auditar Laya e Traduzir in-situ"]
        X3["<b>Trivial Gate HitL (2 Níveis)</b><br/>Aprovação N1 ➔ N2 Diretoria ➔ TTL 120s"]
        X1 --> X2 --> X3
    end

    C1 ==> C2 ==> C3
    C2 -.-> EXT
```

---

## 2. As 13 Grandes Inovações Consolidadas na Versão v3.8

### 1. Inicialização Limpa (Thread Zero com Hero State & Identidade Visual Canônica)
- Ao abrir o Cockpit, a tela inicia em **Thread Zero** limpa, exibindo o *Executive Hero Empty State* encabeçado pelo **Logo Oficial da PromptCore Labs** (`PCL_Logo_Transparente.png` em 120px com efeito *Cyan Glow* `drop-shadow(0 0 16px rgba(56, 189, 248, 0.45))`) e a assinatura canônica **"Cognitive Engineering Platform"** abaixo do título "PCL Cockpit".
- O Hero State dispõe de quatro cartões de ação rápida (*Análise de Arquitetura Cortex*, *Auditoria FinOps & ROI*, *Inteligência de Reuniões WhisperX* e *Gestor de Squads*), permitindo que o usuário comece uma thread inédita sem poluição de conversas anteriores.

### 2. Higiene Constitucional & Purge de Nomes de Concorrentes
- Eliminação absoluta de marcas e nomenclaturas de produtos de terceiros (*Tactiq, Jumpad, Read.ai*) do código-fonte, traduções e documentação técnica. 
- Padronização rigorosa da **Tríade Institucional Canônica**: **PromptCore Labs** (Holding/Laboratório), **PCL AEOS** (Sistema Operacional/Kernel) e **PCL Cockpit** (Interface/Cabine `:3001`).

### 3. Telemetria Real em Runtime (Zero Mocks)
- Monitoramento contínuo via serviço [`daemonHealthService.ts`](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/services/telemetry/daemonHealthService.ts) realizando probes HTTP reais no endpoint `/api/aeos/status`:
  - **OmniRoute LLM Gateway** (`:20130`): Roteador resiliente multi-provedor.
  - **Ollama Host Generativo** (`:11434`): Inferência local soberana na GPU RTX 3050 (`qwen2.5-coder:7b`).
  - **Laya System One Coprocessor** (`:20140`): Invariante física de **0 MB de VRAM** em CPU INT8 (`CPUExecutionProvider`).
  - **PostgreSQL 17 Enclave** (`:5432`): Banco relacional e vetorial PGVector com trilha SHA-256.
  - **Paperclip Automation Engine** (`:3100`): Orquestrador de tarefas em segundo plano.

### 4. Internacionalização Tridimensional Perfeita (PT, EN, ES)
- Localização executiva completa em Português (Brasil), Inglês (EUA) e Espanhol (LATAM) com sincronização em tempo real via [`translations.ts`](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/i18n/translations.ts).

### 5. Biblioteca de Conexões & Servidores MCP Bipartida
- **Servidores MCP Soberanos Locais:** Conexões com engines locais via protocolo JSON-RPC nativo e checagem real de latência.
- **Conectores Corporativos Externos:** Conectores com credenciais criptografadas localmente em cofre AES-256-GCM sob custódia corporativa blindada (*BYOS*).

### 6. Orquestrador Dinâmico de Squads & Agentes
- Módulo [`AgentSquadOrgChart.tsx`](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/admin/AgentSquadOrgChart.tsx) com CRUD dinâmico completo de esquadrões e agentes, permitindo pausar, editar prompts de sistema, alternar modelos e definir níveis de autonomia da metodologia TLC-v3 (*Assistido, Supervisionado, Autônomo*).

### 7. Gestor de Skills Especializadas (Skills Manager)
- Módulo [`SkillsManager.tsx`](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/admin/SkillsManager.tsx) abrangendo cinco domínios de negócio (*Segurança & Governança*, *Arquitetura & Engenharia*, *Reuniões & Áudio*, *FinOps & Custos*, *Automação & Orquestração*), com editor markdown de contratos `SKILL.md` e parametrização de sandbox.

### 8. Criador de Agentes No-Code (Wizard em 4 Passos)
- Assistente intuitivo [`NoCodeAgentBuilder.tsx`](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/admin/NoCodeAgentBuilder.tsx) estruturado em quatro etapas: *1. Identidade & Missão*, *2. Cérebro & FinOps*, *3. Habilidades & Tools* e *4. Governança & Publicação*, com visualização ao vivo e publicação direta no Cockpit (`@AgentName`).

### 9. Livro-Razão FinOps Soberano & Trava Rígida Hard Lock
- Painel [`CostsTokenDashboard.tsx`](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/admin/CostsTokenDashboard.tsx) com indicador de Taxa de Soberania (88.4%), cálculo de dólares poupados (US$ 1.420,00 no mês corrente), trava física rígida (*Hard Lock*) que corta chamadas a APIs pagas no teto orçamentário e exportação de livro-razão em `.csv`.

### 10. Simulador de ROI Soberano CFO (EBITDA Shield v2)
- Calculadora executiva interativa para diretores financeiros com predefinições de `25`, `50`, `100`, `250`, `500` e `1.000` colaboradores:
  - Compara a sangria orçamentária de US$ 60/usuário/mês de nuvens externas contra o custo marginal de **R$ 0,00** da inferência local soberana.
  - Para **250 colaboradores**, projeta economia anual líquida de **US$ 180.000,00 / R$ 1.026.000,00** retida integralmente no caixa da empresa com payback imediato (Mês 1).
  - Emissão de parecer financeiro formal em formato `.json` com atesto criptográfico SHA-256.

### 11. Companion Extension Manifest V3 & Injeção em Legados
- Extensão de navegador em [`projects/pcl-cockpit-extension/`](file:///c:/PromptCore_Labs/projects/pcl-cockpit-extension/) com encapsulamento por **Shadow DOM**:
  - **Inline Action Dock:** Barra de atalhos in-situ sobre campos `<textarea>` no Salesforce, Jira e SAP com três ações de 1 clique: ✍️ *Polir Texto (Tom Executivo)*, 🛡️ *Auditar Riscos (Laya NLI em 18.5ms com 0 MB VRAM)* e 🌐 *Traduzir Corporativo*.
  - **Sincronização Reativa de Tema:** Adaptação instantânea entre modo escuro (*Dark Liquid Glass*) e claro (*Light Executive*) via broadcast `window.postMessage` e storage.

### 12. Escalação Hierárquica HitL em 2 Níveis & Ações de Reunião
- **Escalação em 2 Estágios:** Ação pendente no Trivial Gate aguarda 60s pelo aprovador primário (N1); ao expirar, transiciona para `ESCALATED_TIER_2`, disparando push prioritário via webhook assinado com `HMAC-SHA256` para a Diretoria; aos 120s, realiza descarte seguro (*Safe Abort*) com zero resíduo de dados.
- **Despacho 1-Clique de Atas do WhisperX:** Botões ao lado de cada deliberação em [`MeetingsIntelligenceView.tsx`](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/workspace/MeetingsIntelligenceView.tsx) para criação imediata de issues no Jira ou atualização de oportunidades no Salesforce sob aprovação humana prévia.
- **Monitor de Extensões Injetadas:** Visibilidade em tempo real das abas conectadas no painel lateral [`RightSidebarStatus.tsx`](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/layout/RightSidebarStatus.tsx) com botão de revogação remota instantânea.

### 13. Automação de Inicialização em 1-Clique & Atalho Executivo de Desktop
- **Script de Inicialização em 1-Clique (`Iniciar_PCL_Cockpit.bat`):** Automação pura ASCII compatível com Windows `cmd.exe` que inicializa o servidor Vite na porta `:3001` e abre instantaneamente o navegador padrão sem exigir digitação no terminal.
- **Script PowerShell Homólogo (`Iniciar_PCL_Cockpit.ps1`):** Versão nativa com controle de janelas e tratamento de encerramento seguro.
- **Gerador de Atalho de Área de Trabalho (`Criar_Atalho_Desktop.ps1`):** Script que provisiona o atalho `PCL Cockpit.lnk` na Área de Trabalho do usuário, incorporando o ícone canônico da holding (`assets/PCL_Logo.ico`) para acesso imediato com um único clique.

---

## 3. Matriz de Homologação TLC-v3 (Comprovação por Evidências)

| Fase TLC-v3 | Foco da Avaliação | Métrica Homologada | Arquivo de Evidência Auditável | Status |
|:---|:---|:---:|:---|:---:|
| **Fase 1** | Isolamento Shadow DOM & Extensão | **18.4ms** render latency | [`fase_2_ebitda_shield_and_failover_report.json`](file:///c:/PromptCore_Labs/assets/benchmark/test_evidence/fase_2_ebitda_shield_and_failover_report.json) | ✅ Aprovado |
| **Fase 2** | Trava Hard Lock & Failover Multi-LLM | **14.81ms** failover switch | [`fase_2_ebitda_shield_and_failover_report.json`](file:///c:/PromptCore_Labs/assets/benchmark/test_evidence/fase_2_ebitda_shield_and_failover_report.json) | ✅ Aprovado |
| **Fase 3** | Human-in-the-Loop & Webhooks | **13.04ms** aprovação SHA-256 | [`fase_3_hitl_experience_and_audit_report.json`](file:///c:/PromptCore_Labs/assets/benchmark/test_evidence/fase_3_hitl_experience_and_audit_report.json) | ✅ Aprovado |
| **Onda 5** | ROI CFO ($180k/ano) & Inline Dock | **12.61ms** dock mount / **8.2ms** polish | [`onda_5_quick_wins_report.json`](file:///c:/PromptCore_Labs/assets/benchmark/test_evidence/onda_5_quick_wins_report.json) | ✅ Aprovado |
| **Fase 6** | Escalação HitL N2 & Despacho WhisperX | **2.51ms** suite run time | [`onda_6_governance_and_meetings_report.json`](file:///c:/PromptCore_Labs/assets/benchmark/test_evidence/onda_6_governance_and_meetings_report.json) | ✅ Aprovado |

