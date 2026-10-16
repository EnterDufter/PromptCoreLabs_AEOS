# Manual de Especificação dos 15 Agentes e Squads do PCL AEOS

==================================================
1. VISÃO GERAL DA SQUAD DE AGENTES
==================================================

O **PromptCoreLabs_AEOS** opera sob uma arquitetura de múltiplos agentes autônomos e especializados (**Multi-Agent System - MAS**). Cada agente possui um contrato operacional estrito, limites de autonomia delimitados, entradas/saídas padronizadas e uma atribuição clara na matriz de responsabilidade da plataforma.

A orquestração visual dos agentes é gerida pelo **PaperClip Dashboard** (porta `:3100`), e a inteligência de visualização de arquitetura é conduzida pela persona **Cortex** através do **PCL Cortex Visual Engine**.

---

## 2. MATRIZ DE RESPONSABILIDADE DOS 15 AGENTES

```mermaid
flowchart LR
    classDef s1 fill:#0f172a,stroke:#38bdf8,stroke-width:1.2px,color:#ffffff;
    classDef s2 fill:#1e3a8a,stroke:#60a5fa,stroke-width:1.2px,color:#ffffff;
    classDef s3 fill:#451a03,stroke:#fbbf24,stroke-width:1.2px,color:#ffffff;
    classDef s4 fill:#064e3b,stroke:#34d399,stroke-width:1.2px,color:#ffffff;

    subgraph Squad1 ["1. Estratégia & Governança"]
        direction TB
        A1["<b>Strategist_One</b><br/>Visão & OKRs"]:::s1
        A2["<b>Lead_TLC_Engineer</b><br/>Arquitetura Viva"]:::s1
        A3["<b>Auditor_Agent</b><br/>Compliance & Gates"]:::s1
        A1 --> A2 --> A3
    end

    subgraph Squad2 ["2. Engenharia TLC"]
        direction TB
        A4["<b>Planner_Agent</b><br/>Tasks & Backlog"]:::s2
        A5["<b>Builder_Agent</b><br/>Código & Diffs"]:::s2
        A6["<b>Reviewer_QA</b><br/>Testes & Cobertura"]:::s2
        A4 --> A5 --> A6
    end

    subgraph Squad3 ["3. SecOps & FinOps"]
        direction TB
        A7["<b>CISO_Security</b><br/>Zero Trust & Mesh"]:::s3
        A8["<b>BizOps_Controller</b><br/>Processos & Métricas"]:::s3
        A9["<b>Financial_Advisor</b><br/>FinOps & EBITDA"]:::s3
        A7 --> A8 --> A9
    end

    subgraph Squad4 ["4. Data & Growth"]
        direction TB
        A10["<b>RevOps_Architect</b><br/>GTM & Vendas"]:::s4
        A11["<b>Data_Insight</b><br/>RAG & Vetores"]:::s4
        A12["<b>Neuromarketing</b><br/>Branding & Canvas"]:::s4
        A13["<b>Compliance_Steward</b><br/>LegalOps & LGPD"]:::s4
        A14["<b>Skills_Manager</b><br/>People Ops & Skills"]:::s4
        A10 --> A11 --> A12 --> A13 --> A14
    end

    Squad1 ==>|"Diretrizes"| Squad2
    Squad2 ==>|"Segurança"| Squad3
    Squad3 ==>|"Escala"| Squad4
```

---

## 2.1. ESTRUTURA ORGANIZACIONAL NO PAPERCLIP (ORG CHART DA HOLDING)

```mermaid
flowchart TD
    classDef ceo fill:#0c2340,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef tlc fill:#1e3a8a,stroke:#60a5fa,stroke-width:1.2px,color:#ffffff;
    classDef mkt fill:#064e3b,stroke:#34d399,stroke-width:1.2px,color:#ffffff;
    classDef biz fill:#3b0764,stroke:#c084fc,stroke-width:1.2px,color:#ffffff;
    classDef sec fill:#451a03,stroke:#fbbf24,stroke-width:1.2px,color:#ffffff;

    CEO["👑 <b>CEO PromptCore Labs</b><br/>ai-pricing • create-rfc • tlc-spec-driven"]:::ceo

    subgraph F1 ["Frente 1: Software & DevSecOps"]
        direction TB
        TLC["<b>Lead_TLC_Engineer</b><br/>Head Software"]:::tlc
        CISO["<b>CISO_Security_Agent</b><br/>DevSecOps"]:::sec
        Agile["<b>bot-agile-master</b><br/>Agile QA"]:::tlc
        TLC --> CISO --> Agile
    end

    subgraph F2 ["Frente 2: Marketing & Growth"]
        direction TB
        RevOps["<b>RevOps_Architect</b><br/>Head Growth"]:::mkt
        Neuro["<b>Neuromarketing</b><br/>CMO Lead"]:::mkt
        Data["<b>Data_Insight</b><br/>Data Science"]:::mkt
        RevOps --> Neuro --> Data
    end

    subgraph F3 ["Frente 3: Consultoria & FinOps"]
        direction TB
        Strat["<b>Strategist_One</b><br/>Head Consulting"]:::biz
        Fin["<b>Financial_Advisor</b><br/>CFO Lead"]:::biz
        Legal["<b>Compliance_Steward</b><br/>LegalOps"]:::biz
        Strat --> Fin --> Legal
    end

    CEO ==> F1
    CEO ==> F2
    CEO ==> F3
```


---

## 2.2. MATRIZ DE DISTRIBUIÇÃO DE SKILLS (PAPERCLIP + TLC SKILLS)

| Agente / Papel | Liderança / Atuação nas Verticais | Skills Originais (Paperclip) | Novas TLC Skills Adicionadas |
|---|---|---|---|
| **CEO** | Orquestração Geral PCL, Venture Studio | `brainstorm-okrs`, `north-star-metric`, `product-vision`, `outcome-roadmap`, `summarize-meeting` | `ai-pricing`, `create-rfc`, `tlc-spec-driven` |
| **Strategist_One** | Head de AI Consulting, GovTech & Estratégia | `brainstorm-okrs`, `north-star-metric`, `product-vision`, `outcome-roadmap`, `swot-analysis`, `lean-canvas`, `competitor-analysis`, `business-model`, `competitive-battlecard` | `ai-pricing`, `create-rfc` |
| **RevOps_Architect** | Head de RevOps, CRM, Automação & Vendas B2B | `ideal-customer-profile`, `gtm-strategy`, `gtm-motions`, `cohort-analysis`, `growth-loops`, `user-segmentation`, `customer-journey-map` | `ai-sdr`, `ai-cold-outreach` |
| **Neuromarketing_Strategist** | Head de Marketing Digital, Branding & Mídia | `marketing-ideas`, `positioning-ideas`, `product-name`, `value-prop-statements`, `customer-journey-map`, `user-personas` | `ai-seo`, `ai-ugc-ads` |
| **Data_Insight_Agent** | Lead de Data & Analytics, BI e Customer Success | `ab-test-analysis`, `metrics-dashboard`, `cohort-analysis`, `growth-loops`, `user-segmentation`, `product-vision` | `ai-seo`, `best-practices` |
| **Lead_TLC_Engineer** | Head de Software Studio & Prototipagem | `user-stories`, `create-prd`, `sprint-plan`, `test-scenarios`, `prioritize-features`, `outcome-roadmap` | `tlc-spec-driven`, `create-adr`, `best-practices`, `perf-astro` |
| **BizOps_Controller** | Lead de Operações, Qualidade e Processos | `sprint-plan`, `prioritization-frameworks`, `prioritize-features`, `release-notes`, `summarize-meeting`, `retro` | `tlc-spec-driven`, `best-practices` |
| **CISO_Security_Agent** | Head de DevSecOps, CyberSecurity & Cloud | `pre-mortem`, `privacy-policy`, `test-scenarios` | `aws-advisor`, `best-practices` |
| **Financial_Advisor** | Head de Financeiro, FinOps, Pricing & E-Commerce | `pricing-strategy`, `monetization-strategy`, `market-sizing`, `summarize-interview`, `draft-nda` | `ai-pricing` |
| **Compliance_Steward** | Lead de Jurídico, LGPD & Compliance | `draft-nda`, `privacy-policy` | `create-adr` |
| **Skills_Manager** | Lead de RH, People Ops & AI Academy | `review-resume`, `interview-script`, `summarize-interview`, `grammar-check` | `agent-skills-cli` |

---

## 2.3. MATRIZ DE FUNCIONAMENTO DOS COMANDOS SLASH & GOVERNANÇA (ANTIGRAVITY IDE)

```mermaid
flowchart LR
    classDef gate fill:#0f172a,stroke:#38bdf8,stroke-width:1.2px,color:#ffffff;
    classDef cmd fill:#1e3a8a,stroke:#60a5fa,stroke-width:1.2px,color:#ffffff;
    classDef app fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;
    classDef sub fill:#3b0764,stroke:#c084fc,stroke-width:1.2px,color:#ffffff;

    subgraph G1 ["Gate 1: Inception"]
        direction TB
        C_Grill["<b>/grill-me</b><br/>Entrevista & Design"]:::cmd
        C_Boost["<b>/boost</b><br/>Refatoração Arch"]:::cmd
    end

    subgraph G2 ["Gate 2: Aprovação"]
        direction TB
        C_Plan["<b>Human-in-the-Loop</b><br/>Assinatura do Plano"]:::app
    end

    subgraph G3 ["Gates 3-5: Construção"]
        direction TB
        C_Goal["<b>/goal</b><br/>Execução Autônoma"]:::app
        C_Subs["<b>Subagentes</b><br/>Testes & Infra"]:::sub
    end

    subgraph G6 ["Gate 6: Auditoria"]
        direction TB
        C_Walk["<b>Walkthrough</b><br/>Validação QA"]:::cmd
        C_Learn["<b>/learn</b><br/>Gravação nos KIs"]:::sub
    end

    G1 ==>|"Specs Aprovadas"| G2
    G2 ==>|"Autorização Soberana"| G3
    G3 ==>|"Código Validado"| G6
```

---

## 3. ESPECIFICAÇÃO DETALHADA DOS 15 AGENTES

### 🛠️ Squad Core de Engenharia (Spec-Driven Loop)

#### 1. **Planner Agent** (`planner.md`)
- **Propósito**: Decomposição de especificações aprovadas (`specify.md` e `design.md`) em planos de tarefas atômicos e ordenados em `tasks.md`.
- **Limites de Autonomia**: Não escreve código de produção; não modifica o arquivo `specify.md` sem autorização.
- **Entradas**: `specify.md`, `design.md`, `FOUNDATION.md`.
- **Saídas**: `tasks.md`, checklist de validação por tarefas.

#### 2. **Builder Agent** (`builder.md`)
- **Propósito**: Escrita cirúrgica de código-fonte, criação de arquivos e refatoração respeitando estritamente o backlog do `tasks.md`.
- **Limites de Autonomia**: Não altera dependências globais sem consultar o Planner; não remove testes sem autorização do QA.
- **Entradas**: `tasks.md`, arquivos existentes no workspace.
- **Saídas**: Código modificado, novos arquivos, diffs em markdown.

#### 3. **Reviewer QA** (`reviewer-qa.md`)
- **Propósito**: Testes adversários, execução de testes unitários/integrados, auditoria de cobertura de código e verificação de regressão.
- **Limites de Autonomia**: Não aprova código com testes falhando; não aceita mocks genéricos para mascarar erros.
- **Entradas**: Código gerado pelo Builder, suíte de testes.
- **Saídas**: `validate.md`, relatórios de erros, aprovação do gate de testes.

#### 4. **Auditor Agent** (`auditor.md`)
- **Propósito**: Validação de compliance constitucional com a `Foundation` e selamento dos Stage Gates de governança.
- **Limites de Autonomia**: Não altera regras constitucionais; possui poder de veto no Stage Gate 5.
- **Entradas**: `validate.md`, `FOUNDATION.md`, logs de execução.
- **Saídas**: Assinatura final do gate e selamento em `STATE.md`.

---

### 🏛️ Squad Executiva & Departamental

#### 5. **Strategist_One** (`strategist-one.md`)
- **Liderança**: Departamento de Estratégia & Visão Corporativa.
- **Propósito**: Definição da North Star Metric, desdobramento de OKRs estratégicos e alinhamento do portfólio de produtos.

#### 6. **Lead TLC Engineer** (`lead-tlc-engineer.md`)
- **Liderança**: Departamento de Engenharia de Sistemas & Arquitetura.
- **Propósito**: Garantia da integridade arquitetural do PCL AEOS, padronização da metodologia TLC v3 e resolução de débitos técnicos.

#### 7. **CISO Security Agent** (`ciso-security-agent.md`)
- **Liderança**: Departamento de Segurança & Infraestrutura Zero Trust.
- **Propósito**: Sanitização de chaves de API, varredura adversária contra vazamento de segredos e imunização da rede mesh.

#### 8. **BizOps Controller** (`bizops-controller.md`)
- **Liderança**: Departamento de BizOps & Processos Ágeis.
- **Propósito**: Monitoramento do fluxo de entrega, cadência de sprints dos agentes e eliminação de gargalos no pipeline.

#### 9. **RevOps Architect** (`revops-architect.md`)
- **Liderança**: Departamento de Growth & Funil GTM.
- **Propósito**: Arquitetura do funil de conversão, integração de rotas de aquisição e métricas de retenção de usuários.

#### 10. **Financial Advisor** (`financial-advisor.md`)
- **Liderança**: Departamento de FinOps & Back Office.
- **Propósito**: Controle do EBITDA Shield, precificação de inferências de IA, contagem de tokens e DRE real-time.

#### 11. **Neuromarketing Strategist** (`neuromarketing-strategist.md`)
- **Liderança**: Departamento de Branding & Percepção de Valor.
- **Propósito**: Design de experiência visual, gatilhos de engajamento, Sexy Canvas e linguagem de alta percepção de valor.

#### 12. **Data Insight Agent** (`data-insight-agent.md`)
- **Liderança**: Departamento de Data Science & RAG.
- **Propósito**: Análise de embeddings vetoriais no PostgreSQL (`pcl-db`), otimização de busca vetorial e modelos preditivos.

#### 13. **Compliance Steward** (`compliance-steward.md`)
- **Liderança**: Departamento LegalOps & Compliance Regulatório.
- **Propósito**: Proteção de Propriedade Intelectual (PI), alinhamento com a LGPD e governança contratual.

#### 14. **Skills Manager** (`skills-manager.md`)
- **Liderança**: Departamento de People Ops & Gestão de Conhecimento.
- **Propósito**: Curadoria do repositório de skills dos agentes, onboarding de novos integrantes e handoff de sessão.

#### 15. **Persona Cortex** (Inteligência & Arquitetura Viva)
- **Liderança**: Núcleo de Visualização & PCL Cortex Visual Engine.
- **Propósito**: Ingestão de metadados do repositório, validação de limites de layout, compilação de diagramas interativos HTML e manutenção do Portal Mestre.

---

## 4. INTEGRAÇÃO COM OS DIAGRAMAS INTERATIVOS
Esta especificação detalhada conecta-se diretamente aos diagramas do Portal Mestre:
- 🔵 **[agents-squad-map.html](../../diagrams/interactive/agents-squad-map.html)**: Visualização da orquestração de papéis.
- 🟢 **[seq-tlc-execution.html](../../diagrams/interactive/seq-tlc-execution.html)**: Sequência de execução entre Planner, Builder, QA e Auditor.
