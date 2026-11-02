# Manual de Especificação dos 15 Agentes, Personas Cognitivas & Squads — PCL AEOS v3.6

> [!IMPORTANT]
> **👔 Visão Executiva & Valor de Negócio:** Em vez de depender de um único "assistente generalista" propenso a erros, o **PCL AEOS v3.6** organiza uma força de trabalho digital com **15 agentes especializados em 4 Squads** (Estratégia, Engenharia, SecOps/FinOps e Data/Growth) mais **2 Personas Cognitivas transversais (`/cortex` e `/laya`)**, sempre subordinadas à autoridade humana nos Stage Gates.

> [!NOTE]
> **🛠️ Visão de Engenharia & Invariantes:** Sistema Multi-Agente (*MAS*) regido por **`AGENTS.md` (`PCL-AEOS-NORM-01`)**, coordenado operacionalmente pelo **Paperclip (`:3100`)** e pilotado executivamente pelo **PCL Cockpit v3.6 (`:3001`)**, com *tool-call gating* em CPU (`0 MB VRAM`) e rastreabilidade criptográfica **SHA-256**.

---

## 1. Personas Cognitivas Transversais na v3.6 (`/cortex` & `/laya`)

Além das squads departamentais, dois motores atuam em tempo real na interface do **PCL Cockpit (`:3001`)** e no **Antigravity IDE**:
* **🧠 Persona `/cortex` (Orquestrador de Arquitetura & Guardião Visual):** Governa os Stage Gates TLC v3, renderiza o **Cortex Canvas (DAG interativo)** no Cockpit e audita todos os diagramas HTML/Mermaid sob o padrão Cortex v7 (anti-clipping e contraste WCAG AAA). *Autoridade RACI: Propositor técnico; jamais aprova deploy ou gastos sem aval humano.*
* **⚡ Persona `/laya` (Coprocessador de Sistema 1 em CPU):** Sensor consultivo não-autorregressivo (`ONNX INT8`, **`0 MB VRAM`**, `~20ms–35ms`) responsável pelo **Intention Gating v3.6** (`general_chat | internal_rag | web_search`), *Answerability Gate* (`>= 0.40`) e detecção NLI de contradições (`93,3%` recall).

---

## 2. Matriz Panorâmica de Responsabilidade dos 15 Agentes (Cortex v7)

```mermaid
flowchart LR
    classDef s1 fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef s2 fill:#0c2340,stroke:#60a5fa,stroke-width:1.5px,color:#ffffff;
    classDef s3 fill:#451a03,stroke:#fbbf24,stroke-width:1.5px,color:#ffffff;
    classDef s4 fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;

    subgraph Squad1 ["1. Estratégia & Governança"]
        direction TB
        A1["<b>Strategist_One</b><br/>Visão, OKRs & Battlecards"]:::s1
        A2["<b>Lead_TLC_Engineer</b><br/>Arquitetura & Padrões SDD"]:::s1
        A3["<b>Auditor_Agent + Cortex</b><br/>Compliance Gates & Living Arch"]:::s1
        A1 --> A2 --> A3
    end

    subgraph Squad2 ["2. Engenharia TLC (Core Loop)"]
        direction TB
        A4["<b>Planner_Agent</b><br/>Decomposição tasks.md"]:::s2
        A5["<b>Builder_Agent</b><br/>Código Cirúrgico & Diffs"]:::s2
        A6["<b>Reviewer_QA</b><br/>Testes Adversários Zero Mocks"]:::s2
        A4 --> A5 --> A6
    end

    subgraph Squad3 ["3. SecOps & FinOps"]
        direction TB
        A7["<b>CISO_Security</b><br/>Zero Trust, Vault & PII Guard"]:::s3
        A8["<b>BizOps_Controller</b><br/>Cadência, SLAs & Métricas"]:::s3
        A9["<b>Financial_Advisor</b><br/>EBITDA Shield & FinOps $0.00"]:::s3
        A7 --> A8 --> A9
    end

    subgraph Squad4 ["4. Data, Legal & Growth"]
        direction TB
        A10["<b>RevOps_Architect</b><br/>GTM, ICP & Funil B2B"]:::s4
        A11["<b>Data_Insight</b><br/>PGVector RAG & Benchmarks"]:::s4
        A12["<b>Neuromarketing</b><br/>UX Liquid Glass & Posicionamento"]:::s4
        A13["<b>Compliance & Skills_Mgr</b><br/>LGPD, ISO 42001 & Curadoria Skills"]:::s4
        A10 --> A11 --> A12 --> A13
    end

    Squad1 ==>|"Diretrizes"| Squad2 ==>|"Blindagem"| Squad3 ==>|"Escala"| Squad4
```

---

## 2.1. Estrutura Organizacional da Holding no Paperclip (`flowchart LR` Cortex v7)

```mermaid
flowchart LR
    classDef ceo fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef tlc fill:#0c2340,stroke:#60a5fa,stroke-width:1.5px,color:#ffffff;
    classDef mkt fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;
    classDef biz fill:#2e1065,stroke:#c084fc,stroke-width:1.5px,color:#ffffff;
    classDef sec fill:#451a03,stroke:#fbbf24,stroke-width:1.5px,color:#ffffff;

    subgraph Comando ["Pilotagem Soberana"]
        direction TB
        CEO["<b>👑 CEO PromptCore Labs</b><br/>Autoridade Humana + Cockpit :3001"]:::ceo
    end

    subgraph F1 ["Frente 1: Software & DevSecOps"]
        direction TB
        TLC["<b>Lead_TLC_Engineer</b><br/>Head Software & Specs"]:::tlc
        CISO["<b>CISO_Security_Agent</b><br/>DevSecOps & Zero Secret Leak"]:::sec
        Agile["<b>Planner / Builder / QA</b><br/>Esteira Determinística TLC v3"]:::tlc
        TLC --> CISO --> Agile
    end

    subgraph F2 ["Frente 2: Data, Produto & Growth"]
        direction TB
        RevOps["<b>RevOps_Architect</b><br/>Head Growth & GTM"]:::mkt
        Neuro["<b>Neuromarketing</b><br/>Design & Percepção Executiva"]:::mkt
        Data["<b>Data_Insight</b><br/>RAG, Telemetria & Analytics"]:::mkt
        RevOps --> Neuro --> Data
    end

    subgraph F3 ["Frente 3: Estratégia, Legal & FinOps"]
        direction TB
        Strat["<b>Strategist_One</b><br/>Head AI Consulting"]:::biz
        Fin["<b>Financial_Advisor</b><br/>CFO Lead & EBITDA Shield"]:::biz
        Legal["<b>Compliance & Skills_Mgr</b><br/>LGPD, ADRs & AI Academy"]:::biz
        Strat --> Fin --> Legal
    end

    Comando ==> F1 ==> F2 ==> F3
```

---

## 2.2. Matriz de Distribuição de Skills (Paperclip + TLC Skills)

| Agente / Papel | Liderança / Atuação nas Verticais | Skills Originais (Paperclip) | TLC Skills Soberanas |
| :--- | :--- | :--- | :--- |
| **CEO** | Orquestração Geral PCL, Venture Studio | `brainstorm-okrs`, `north-star-metric`, `product-vision`, `outcome-roadmap`, `summarize-meeting` | `ai-pricing`, `create-rfc`, `tlc-spec-driven` |
| **Strategist_One** | Head de AI Consulting, GovTech & Estratégia | `brainstorm-okrs`, `north-star-metric`, `product-vision`, `outcome-roadmap`, `swot-analysis`, `lean-canvas`, `competitor-analysis`, `business-model`, `competitive-battlecard` | `ai-pricing`, `create-rfc` |
| **RevOps_Architect** | Head de RevOps, CRM, Automação & Vendas B2B | `ideal-customer-profile`, `gtm-strategy`, `gtm-motions`, `cohort-analysis`, `growth-loops`, `user-segmentation`, `customer-journey-map` | `ai-sdr`, `ai-cold-outreach` |
| **Neuromarketing_Strategist** | Head de Marketing Digital, Branding & Mídia | `marketing-ideas`, `positioning-ideas`, `product-name`, `value-prop-statements`, `customer-journey-map`, `user-personas` | `ai-seo`, `ai-ugc-ads` |
| **Data_Insight_Agent** | Lead de Data & Analytics, BI e RAG | `ab-test-analysis`, `metrics-dashboard`, `cohort-analysis`, `growth-loops`, `user-segmentation`, `product-vision` | `ai-seo`, `best-practices` |
| **Lead_TLC_Engineer** | Head de Software Studio & Prototipagem | `user-stories`, `create-prd`, `sprint-plan`, `test-scenarios`, `prioritize-features`, `outcome-roadmap` | `tlc-spec-driven`, `create-adr`, `best-practices`, `perf-astro` |
| **BizOps_Controller** | Lead de Operações, Qualidade e Processos | `sprint-plan`, `prioritization-frameworks`, `prioritize-features`, `release-notes`, `summarize-meeting`, `retro` | `tlc-spec-driven`, `best-practices` |
| **CISO_Security_Agent** | Head de DevSecOps, CyberSecurity & Cloud | `pre-mortem`, `privacy-policy`, `test-scenarios` | `aws-advisor`, `best-practices` |
| **Financial_Advisor** | Head de Financeiro, FinOps & Pricing | `pricing-strategy`, `monetization-strategy`, `market-sizing`, `summarize-interview`, `draft-nda` | `ai-pricing` |
| **Compliance_Steward** | Lead de Jurídico, LGPD & Compliance | `draft-nda`, `privacy-policy` | `create-adr` |
| **Skills_Manager** | Lead de RH, People Ops & AI Academy | `review-resume`, `interview-script`, `summarize-interview`, `grammar-check` | `agent-skills-cli` |

---

## 2.3. Comandos Slash & Governança no Antigravity IDE

```mermaid
flowchart LR
    classDef cmd fill:#0c2340,stroke:#60a5fa,stroke-width:1.5px,color:#ffffff;
    classDef app fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;
    classDef sub fill:#2e1065,stroke:#c084fc,stroke-width:1.5px,color:#ffffff;

    subgraph G1 ["Gate 1: Inception & Planejamento"]
        direction TB
        C_Grill["<b>/plan & /grill-me</b><br/>Especificação & Design Dual"]:::cmd
        C_Boost["<b>/boost & /cortex</b><br/>Revisão Profunda & Diagramas"]:::cmd
        C_Grill --> C_Boost
    end

    subgraph G2 ["Gate 2: Autoridade Humana"]
        direction TB
        C_Plan["<b>Human-in-the-Loop</b><br/>Aprovação Soberana do Plano"]:::app
    end

    subgraph G3 ["Gates 3–4: Construção & QA"]
        direction TB
        C_Goal["<b>/goal</b><br/>Execução Completa até Exit Code 0"]:::app
        C_Subs["<b>Subagentes & Gates</b><br/>Verificação UTF-8, Build & Schema"]:::sub
        C_Goal --> C_Subs
    end

    subgraph G5 ["Gate 5: Homologação & Memória"]
        direction TB
        C_Learn["<b>/learn + Warm/Cold RAG</b><br/>Persistência Institucional"]:::sub
    end

    G1 ==>|"Specs Prontas"| G2 ==>|"Proceed"| G3 ==>|"Auditado"| G5
```

---

## 3. Especificação Detalhada dos 15 Agentes

### 🛠️ Squad Core de Engenharia (*Spec-Driven Loop*)
1. **Planner Agent (`planner.md`):** Decompõe `specify.md` e `design.md` em tarefas atômicas ordenadas (`tasks.md`). *Não escreve código de produção.*
2. **Builder Agent (`builder.md`):** Executa escrita cirúrgica de código e refatorações estritamente vinculadas ao `tasks.md`, validando `npm run build` (`Exit Code 0`).
3. **Reviewer QA (`reviewer-qa.md`):** Executa testes adversários, auditoria de integridade UTF-8 e bloqueia qualquer mock estático (`Zero Mocks`).
4. **Auditor Agent (`auditor.md`):** Verifica conformidade constitucional com `FOUNDATION.md` e `AGENTS.md`, detendo poder de veto antes do Signoff humano.

### 🏛️ Squad Executiva, Departamental & Cognitiva
5. **Strategist_One (`strategist-one.md`):** Visão corporativa, OKRs, matrizes competitivas e posicionamento estratégico.
6. **Lead TLC Engineer (`lead-tlc-engineer.md`):** Guardião técnico da metodologia TLC v3, ADRs e integridade do monorepo.
7. **CISO Security Agent (`ciso-security-agent.md`):** Zero Trust, cofre `AES-256-GCM`, **PII Guard LGPD** e varredura *Zero Secret Leak*.
8. **BizOps Controller (`bizops-controller.md`):** Fluxo operacional, SLAs de entrega e eliminação de gargalos entre squads.
9. **RevOps Architect (`revops-architect.md`):** Arquitetura de aquisição B2B, ICP e métricas de retenção.
10. **Financial Advisor (`financial-advisor.md`):** Governança do *EBITDA Shield*, auditoria de tokens e preservação do invariante `$0.00` local.
11. **Neuromarketing Strategist (`neuromarketing-strategist.md`):** Ergonomia cognitiva, *Liquid Glass Bento Grid* e clareza executiva.
12. **Data Insight Agent (`data-insight-agent.md`):** Otimização de embeddings `768D`, PGVector `HNSW` e protocolos de benchmark empírico.
13. **Compliance Steward (`compliance-steward.md`):** Alinhamento LGPD, ISO/IEC 27001, ISO/IEC 42001 e custódia *Zero-Bin*.
14. **Skills Manager (`skills-manager.md`):** Curadoria de skills (`SKILL.md`), plugins e evolução de `knowledge/learnings/`.
15. **Persona Cortex (`cortex/SKILL.md`):** Síntese visual interativa (`archify.mjs`), governança Mermaid Cortex v7 e manutenção da Arquitetura Viva.

---

## 4. Integração com os Diagramas Interativos

* 🔵 **[agents-squad-map.html](../../diagrams/interactive/agents-squad-map.html)** — Mapa interativo de orquestração dos 15 agentes e squads.
* 🟢 **[seq-tlc-execution.html](../../diagrams/interactive/seq-tlc-execution.html)** — Sequência formal entre Planner, Builder, Reviewer QA e Auditor.
* ⚡ **[seq-cockpit-v36-cognitive-pipeline.html](../../diagrams/interactive/seq-cockpit-v36-cognitive-pipeline.html)** — Atuação conjunta de `/laya` e `/cortex` no pipeline v3.6.
