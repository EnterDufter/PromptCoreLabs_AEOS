# GOVERNANCE — Operating Model

## Metadados

| Campo | Valor |
|--------|-------|
| Documento | governance/operating-model.md |
| Tipo | Documento Fundacional de Governança |
| Status | Aprovado pelo Usuário |
| Versão | 2.0 |
| Camada | Governance |
| Autoridade | Fonte Oficial de Verdade |

---

# Objetivo

Este documento define o modelo operacional oficial do PromptCoreLabs_AEOS.

Seu propósito é estabelecer como iniciativas evoluem desde sua concepção até sua operação contínua através da colaboração coordenada entre pessoas, agentes, modelos de IA e ferramentas.

O Operating Model define **como o AEOS trabalha**.

Metodologias definem **como cada iniciativa é conduzida**.

---

# Missão Operacional

Permitir que qualquer iniciativa seja desenvolvida de forma estruturada, rastreável, auditável e evolutiva, utilizando Inteligência Artificial como aceleradora da engenharia, nunca como substituta da responsabilidade arquitetural.

---

## 📐 Padrão Oficial de Legibilidade e Impressão de Diagramas (Standard)

Todo artefato visual e diagramação no ecossistema PCL-AEOS deve obrigatoriamente seguir este padrão inviolável:

1. **Quebra de Linha em Rótulos (`<br/>`)**: Rótulos e descrições de nós no Mermaid devem utilizar quebras de linha explícitas (`<br/>`) e formatação em itálico/subtítulos para expandir a altura das caixas e garantir que as fontes sejam renderizadas em tamanho amplo e legível sem extrapolar margens.
2. **Orientação por Domínio**:
   - Organogramas, árvores hierárquicas e matrizes de agentes devem utilizar estritamente **orientação vertical (`graph TD`)**.
   - Pipelines lineares de precedência e etapas de ciclo de vida devem utilizar **orientação horizontal (`graph LR`)**.
3. **Normalização de Escala de Impressão (`@media print`)**: As regras de exportação/impressão em PDF não podem clamping arbitrários de altura (`max-height`). O layout visual deve expandir a 100% da largura útil da fol# Princípios Operacionais

Toda operação deverá obedecer rigorosamente à seguinte precedência:

```mermaid
graph LR
    classDef step fill:#131b2e,stroke:#38bdf8,stroke-width:1.5px,color:#f8fafc;
    
    A["1. Architecture"]:::step --> B["2. Governance"]:::step --> C["3. Knowledge"]:::step --> D["4. Memory"]:::step --> E["5. Execution"]:::step --> F["6. Validation"]:::step --> G["7. Learning"]:::step
```

Nenhuma automação poderá inverter esta ordem.

---

# Modelo Operacional

O AEOS opera sobre sete capacidades permanentes:

```mermaid
graph LR
    classDef cap fill:#0f172a,stroke:#34d399,stroke-width:1.5px,color:#f8fafc;

    C1["1. Architecture"]:::cap --> C2["2. Governance"]:::cap --> C3["3. Knowledge"]:::cap --> C4["4. Memory"]:::cap --> C5["5. Agents"]:::cap --> C6["6. Runtime"]:::cap --> C7["7. Projects & Verticals"]:::cap
```

Cada camada fornece capacidades para a camada seguinte.

Nenhuma camada inferior redefine responsabilidades das superiores.

Conforme registrado no [ADR-005](file:///c:/PromptCore_Labs/docs/adr/ADR-005-multi-vertical-ai-holding-monetization-model.md), a Camada 7 (`Projects & Verticals`) opera no modelo de **Holding Digital AI-Orchestrated (3 Camadas: Plataforma -> 15 Verticais B2B -> Produtos/SaaS)**, alavancando os clusters de agentes especializados para entregar serviços e produtos recorrentes com custo marginal zero.

## 🏛️ O Modelo em 3 Camadas da Holding Digital PCL

```mermaid
graph TD
    classDef platform fill:#131b2e,stroke:#38bdf8,stroke-width:1.5px,color:#f8fafc;
    classDef verticals fill:#0f172a,stroke:#34d399,stroke-width:1.5px,color:#f8fafc;
    classDef products fill:#1e1b4b,stroke:#c084fc,stroke-width:1.5px,color:#f8fafc;

    subgraph Layer1["Camada 1: Plataforma Core PCL-AEOS ($0 Custo Marginal)"]
        direction LR
        Cortex["🧠 Cortex Engine"]:::platform
        OmniRoute["⚡ OmniRoute :20130"]:::platform
        Paperclip["🤖 Paperclip :3100"]:::platform
        RAG["💾 PGVector RAG"]:::platform
        TLCSkills["🛠️ TLC Agent Skills"]:::platform
    end

    subgraph Layer2["Camada 2: 15 Verticais de Negócio B2B (Profit Centers)"]
        subgraph GroupTech["Tech & Data"]
            V1["1. Software Studio"]:::verticals
            V5["5. Data & Analytics"]:::verticals
            V13["13. DevSecOps Studio"]:::verticals
            V12["12. Venture Studio"]:::verticals
            V15["15. GovTech & RFP"]:::verticals
            V1 --> V5 --> V13 --> V12 --> V15
        end
        subgraph GroupBiz["Growth & Sales"]
            V2["2. Marketing & Growth"]:::verticals
            V3["3. RevOps & CRM"]:::verticals
            V4["4. AI Consulting"]:::verticals
            V11["11. Mídia & Podcasts"]:::verticals
            V14["14. E-Commerce Pricing"]:::verticals
            V2 --> V3 --> V4 --> V11 --> V14
        end
        subgraph GroupOps["Ops, FinOps & Gov"]
            V6["6. AI Academy"]:::verticals
            V7["7. Jurídico & Compliance"]:::verticals
            V8["8. RH & People Ops"]:::verticals
            V9["9. FinOps & Pricing"]:::verticals
            V10["10. Customer Success"]:::verticals
            V6 --> V7 --> V8 --> V9 --> V10
        end
    end

    subgraph Layer3["Camada 3: Modelos de Monetização & Produtos"]
        direction LR
        P1["📦 Proposta Fechada"]:::products
        P2["🔄 Retainers Mensais"]:::products
        P3["🚀 Micro-SaaS White-Label"]:::products
        P4["🔌 APIs & Agentes"]:::products
        P5["🎓 Assinaturas Academy"]:::products
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
```

---

# Unidade Operacional

A menor unidade operacional do PromptCoreLabs_AEOS é denominada **Execution Cell**.

Uma Execution Cell representa um ambiente operacional completo e governado, responsável por executar uma iniciativa, módulo ou etapa do ciclo de vida da plataforma.

Ela encapsula:

- responsabilidade humana;
- agentes especializados;
- modelos de IA;
- contexto compartilhado;
- metodologia ativa;
- artefatos;
- memória operacional;
- observabilidade.

Toda execução do AEOS deverá ocorrer dentro de uma Execution Cell.

A especificação completa das Execution Cells pertence à camada Runtime.

---

# Papéis Operacionais

O modelo operacional reconhece cinco categorias de participantes.

## Sponsor

Define objetivos.

Prioridades.

Critérios de sucesso.

Aprova resultados.

---

## Architect

Mantém:

- Vision
- Principles
- Modules
- ADRs
- Decision Framework

Possui autoridade arquitetural.

---

## Builder

Constrói soluções aprovadas.

Nunca altera arquitetura.

---

## Reviewer

Audita qualidade.

Conformidade.

Segurança.

Rastreabilidade.

---

## Operator

Mantém operação contínua.

Observabilidade.

Aprendizado.

Retroalimentação do sistema.

---

# Colaboração Operacional

Humanos, agentes e modelos nunca trabalham isoladamente.

Eles colaboram através de Execution Cells.

A Execution Cell fornece:

- isolamento de contexto;
- governança;
- memória compartilhada;
- metodologia ativa;
- rastreabilidade;
- continuidade operacional.

Isso elimina dependência da memória individual de um agente ou modelo.

---

# Papéis da Inteligência Artificial

Os modelos de IA assumem papéis especializados.

Exemplos:

- Planner
- Architect Assistant
- Builder Assistant
- Reviewer Assistant
- QA Assistant
- Documentation Assistant
- RAG Assistant
- Orchestrator

Esses papéis podem variar conforme a metodologia utilizada.

Nenhum agente possui autoridade arquitetural.

---

## Mapeamento de Agentes, Sub-Agentes e Distribuição de Skills

A execução operacional do PCL-AEOS é conduzida por uma Squad de **15 Agentes Especialistas**, cujas responsabilidades e habilidades são distribuídas em 4 camadas funcionais (para consulta detalhada, veja o [Manual dos Agentes](file:///c:/PromptCore_Labs/projects/Living%20Architecture%20PCL%20AEOS/docs/agents-squads/README.md)):

1. **Squad Core de Engenharia (Spec-Driven Loop)**:
   - **Planner Agent**: Decomposição de especificações (`specify.md`) e planejamento de backlog (`tasks.md`).
   - **Builder Agent**: Escrita cirúrgica de código, refatoração e geração de diffs.
   - **Reviewer QA**: Testes adversários, execução de suítes de teste e validação de regressão.
   - **Auditor Agent**: Compliance constitucional, verificação de segredos e selamento dos Stage Gates.

2. **Squad de Estratégia & Arquitetura**:
   - **Strategist_One**: OKRs corporativos, visão do produto e métricas North Star.
   - **Lead TLC Engineer**: Manutenção da arquitetura viva, governança C4 e motor Cortex Archify.

3. **Squad SecOps, FinOps & Infraestrutura**:
   - **CISO Security Agent**: Segurança Zero Trust, sanitização de chaves e imunização Mesh Tailscale.
   - **BizOps Controller**: Monitoramento da cadência de sprints e gargalos de fluxo no Paperclip.
   - **Financial Advisor**: Auditoria de FinOps e controle de custos de inferência (EBITDA Shield no OmniRoute).

4. **Squad Data, Growth, LegalOps & People**:
   - **RevOps Architect**: Funil de aquisição GTM, conversão de Micro-SaaS e retenção B2B.
   - **Data Insight Agent**: RAG relacional, indexação de vetores (PGVector) e pipelines de ML.
   - **Neuromarketing Strategist**: Branding, copywriting de auto-conversão e identidade visual.
   - **Compliance Steward**: Jurídico, normas de privacidade (LGPD/GDPR) e governança contratual.
   - **Skills Manager**: Gestão da matriz de competências dos agentes, skills e onboarding.


---

# Responsabilidades

## Humanos

- definir objetivos;
- aprovar arquitetura;
- aprovar governança;
- aprovar entregas;
- aceitar riscos.

---

## Agentes

- executar tarefas;
- produzir documentação;
- gerar código;
- revisar artefatos;
- sugerir melhorias;
- detectar inconsistências.

---

## Runtime

- criar Execution Cells;
- coordenar workflows;
- distribuir tarefas;
- executar pipelines;
- registrar eventos;
- controlar fallback;
- preservar contexto.

---

# Modelo de Autoridade

Toda decisão segue obrigatoriamente a hierarquia horizontal de autoridade soberana abaixo:

```mermaid
graph LR
    classDef top fill:#3b0764,stroke:#c084fc,stroke-width:2px,color:#fff;
    classDef auth fill:#1e1b4b,stroke:#818cf8,stroke-width:1.5px,color:#f8fafc;

    U["👑 Operador Humano"]:::top --> Arc["1. Architecture"]:::auth --> Gov["2. Governance"]:::auth --> Spec["3. Specifications"]:::auth --> EC["4. Execution Cell"]:::auth --> RT["5. Runtime"]:::auth --> Agt["6. Agentes"]:::auth --> Mdl["7. Modelos de IA"]:::auth
```

Nenhuma camada inferior poderá ultrapassar a autoridade de uma camada superior.

---

# Fluxo Operacional

Toda iniciativa percorre o seguinte fluxo vertical em 3 fases:

```mermaid
graph TD
    classDef phase1 fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#fff;
    classDef phase2 fill:#1e1b4b,stroke:#c084fc,stroke-width:1.5px,color:#fff;
    classDef phase3 fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#fff;

    subgraph P1["Fase 1: Concepção & Governança"]
        direction TD
        O["1. Opportunity (Oportunidade)"]:::phase1
        AC["2. Arch Check (Arquitetura)"]:::phase1
        GC["3. Gov Check (Governança)"]:::phase1
        ECC["4. Cell Creation (Execution Cell)"]:::phase1
        MS["5. Method Selection (Metodologia)"]:::phase1
        O --> AC --> GC --> ECC --> MS
    end

    subgraph P2["Fase 2: Especificação & Execução"]
        direction TD
        SP["6. Specification (specify.md)"]:::phase2
        DS["7. Design (design.md)"]:::phase2
        PL["8. Planning (tasks.md)"]:::phase2
        EX["9. Execution (Builder Agent)"]:::phase2
        VA["10. Validation (Reviewer QA)"]:::phase2
        SP --> DS --> PL --> EX --> VA
    end

    subgraph P3["Fase 3: Implantação & Aprendizado"]
        direction TD
        DP["11. Deployment (Deploy & Signoff)"]:::phase3
        OP["12. Operation (Operação Contínua)"]:::phase3
        LE["13. Learning (Retroalimentação)"]:::phase3
        KU["14. Knowledge (Update Conhecimento)"]:::phase3
        MU["15. Memory (Persistência no RAG)"]:::phase3
        DP --> OP --> LE --> KU --> MU
    end

    P1 --> P2 --> P3
```

Cada transição exige critérios explícitos.

---

# Seleção de Metodologia

O AEOS suporta múltiplas metodologias.

Exemplos:

- TLC Spec-Driven v3
- Shape Up
- Architecture Kata
- Event Storming
- futuras metodologias

A metodologia é um componente operacional.

Nunca um fundamento arquitetural.

---

# Modelo de Conhecimento

Durante toda a operação coexistem dois fluxos.

## Conhecimento Explícito

Documentação.

Templates.

Playbooks.

Guias.

Padrões.

---

## Conhecimento Computacional

Embeddings.

RAG.

Memória contextual.

Histórico operacional.

Índices.

Ambos devem permanecer sincronizados.

---

# Modelo de Execução

O Runtime coordena.

As Execution Cells executam.

Os agentes colaboram.

Os modelos raciocinam.

As integrações conectam.

Os projetos recebem valor.

---

# Modelo de Aprendizado

Ao término de cada iniciativa deverão ser avaliados:

- novos ADRs;
- novos padrões;
- novos templates;
- novos playbooks;
- melhorias metodológicas;
- evolução da arquitetura.

Todo aprendizado retorna para:

- Knowledge;
- Memory;
- Governance;
- Architecture.

---

# Estratégia Multi-Modelo

O AEOS é completamente agnóstico quanto aos modelos de IA.

Modelos cloud, locais ou híbridos poderão coexistir.

A substituição de um modelo nunca deverá exigir alterações arquiteturais.

---

# Estratégia de Fallback

Quando um modelo não puder atender uma solicitação:

1. preservar o contexto da Execution Cell;
2. registrar o evento;
3. selecionar modelo alternativo;
4. manter rastreabilidade;
5. continuar a execução.

O fallback nunca poderá modificar arquitetura, escopo ou aprovações.

---

# Observabilidade

Toda operação deverá gerar evidências.

Exemplos:

- logs;
- eventos;
- decisões;
- aprovações;
- métricas;
- auditorias.

Nenhuma informação crítica deverá depender exclusivamente da memória de um agente ou modelo.

---

# Estado Operacional

Este documento estabelece o modelo operacional oficial do PromptCoreLabs_AEOS.

Toda metodologia, Runtime, agente, integração, projeto ou ferramenta deverá operar dentro de uma Execution Cell e em conformidade com os princípios definidos neste documento.
