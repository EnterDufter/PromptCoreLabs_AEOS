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
3. **Normalização de Escala de Impressão (`@media print`)**: As regras de exportação/impressão em PDF não podem clamping arbitrários de altura (`max-height`). O layout visual deve expandir a 100% da largura útil da folha.

# Princípios Operacionais

Toda operação deverá obedecer rigorosamente à seguinte precedência:

```mermaid
flowchart LR
    classDef step fill:#0c2340,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    
    A["<b>1. Architecture</b><br/>Fundação & Specs"]:::step --> B["<b>2. Governance</b><br/>Regras & Políticas"]:::step --> C["<b>3. Knowledge</b><br/>Acervo & KIs"]:::step --> D["<b>4. Memory</b><br/>Fatos & Receipts"]:::step --> E["<b>5. Execution</b><br/>Células & TDD"]:::step --> F["<b>6. Validation</b><br/>QA & Stage Gates"]:::step --> G["<b>7. Learning</b><br/>Feedback & Melhoria"]:::step
```

Nenhuma automação poderá inverter esta ordem.

---

# Modelo Operacional

O AEOS opera sobre sete capacidades permanentes:

```mermaid
flowchart LR
    classDef cap fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;

    C1["<b>1. Architecture</b><br/>Specs & RFCs"]:::cap --> C2["<b>2. Governance</b><br/>Auditoria & Gates"]:::cap --> C3["<b>3. Knowledge</b><br/>Base & Manuais"]:::cap --> C4["<b>4. Memory</b><br/>Tripartida & PG"]:::cap --> C5["<b>5. Agents</b><br/>15 Agentes TLC"]:::cap --> C6["<b>6. Runtime</b><br/>Híbrido & Failover"]:::cap --> C7["<b>7. Verticals</b><br/>15 Frentes B2B"]:::cap
```

Cada camada fornece capacidades para a camada seguinte.

Nenhuma camada inferior redefine responsabilidades das superiores.

Conforme registrado no [ADR-005](../docs/adr/ADR-005-multi-vertical-ai-holding-monetization-model.md), a Camada 7 (`Projects & Verticals`) opera no modelo de **Holding Digital AI-Orchestrated (3 Camadas: Plataforma -> 15 Verticais B2B -> Produtos/SaaS)**, alavancando os clusters de agentes especializados para entregar serviços e produtos recorrentes com custo marginal zero.

## 🏛️ O Modelo em 3 Camadas da Holding Digital PCL

```mermaid
flowchart LR
    classDef platform fill:#0c2340,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef verticals fill:#064e3b,stroke:#34d399,stroke-width:1.2px,color:#ffffff;
    classDef products fill:#2e1065,stroke:#c084fc,stroke-width:1.5px,color:#ffffff;

    subgraph Layer1 ["Camada 1: Plataforma Core ($0)"]
        direction TB
        C1["🧠 <b>Cortex Engine & OmniRoute</b><br/>Orquestração :20130"]:::platform
        C2["⭐ <b>Laya System One :20140</b><br/>Classificador NLI em CPU"]:::platform
        C3["💾 <b>PGVector RAG & Paperclip</b><br/>Memória :5432 & Tasks :3100"]:::platform
        C1 --> C2 --> C3
    end

    subgraph Layer2 ["Camada 2: 15 Verticais de Negócio B2B"]
        direction TB
        V1["💻 <b>Engenharia & Dados</b><br/>Studio • AI Consulting • DevSecOps"]:::verticals
        V2["📈 <b>Marketing & Receita</b><br/>RevOps • Mídia/Podcasts • E-Commerce"]:::verticals
        V3["⚖️ <b>Governança & Pessoas</b><br/>AI Academy • Compliance • FinOps • CS"]:::verticals
        V1 --> V2 --> V3
    end

    subgraph Layer3 ["Camada 3: Monetização & Produtos"]
        direction TB
        P1["📦 <b>Proposta Fechada & Retainers</b><br/>Contratos Corporativos Mensais"]:::products
        P2["🚀 <b>Micro-SaaS White-Label</b><br/>Plataformas de IA Customizadas"]:::products
        P3["🔌 <b>APIs, Agentes & Academy</b><br/>Assinaturas & Serviços Especializados"]:::products
        P1 --> P2 --> P3
    end

    Layer1 ==>|"Infraestrutura Core"| Layer2
    Layer2 ==>|"Monetização & Escala"| Layer3
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

A execução operacional do PCL-AEOS é conduzida por uma Squad de **15 Agentes Especialistas**, cujas responsabilidades e habilidades são distribuídas em 4 camadas funcionais (para consulta detalhada, veja o [Manual dos Agentes](../projects/Living%20Architecture%20PCL%20AEOS/docs/agents-squads/README.md)):

1. **Squad Core de Engenharia (Spec-Driven Loop)**:
   - **Planner Agent**: Decomposição de especificações (`specify.md`) e planejamento de backlog (`tasks.md`).
   - **Builder Agent**: Escrita cirúrgica de código, refatoração e geração de diffs.
   - **Reviewer QA**: Testes adversários, execução de suítes de teste e validação de regressão.
   - **Auditor Agent**: Compliance constitucional, verificação de segredos e selamento dos Stage Gates.

2. **Squad de Estratégia & Arquitetura**:
   - **Strategist_One**: OKRs corporativos, visão do produto e métricas North Star.
   - **Lead TLC Engineer**: Manutenção da arquitetura viva, governança C4 e motor PCL Cortex Visual Engine.

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
flowchart LR
    classDef top fill:#3b0764,stroke:#c084fc,stroke-width:1.5px,color:#ffffff;
    classDef auth fill:#0f172a,stroke:#38bdf8,stroke-width:1.2px,color:#ffffff;

    U["👑 <b>Operador Humano</b><br/>Liderança Soberana"]:::top --> Arc["<b>1. Architecture</b><br/>Arquitetura Viva"]:::auth --> Gov["<b>2. Governance</b><br/>Políticas & Limites"]:::auth --> Spec["<b>3. Specifications</b><br/>RFCs & Contratos"]:::auth --> EC["<b>4. Execution Cell</b><br/>Célula Confinada"]:::auth --> RT["<b>5. Runtime</b><br/>Híbrido :20130"]:::auth --> Agt["<b>6. Agentes</b><br/>Squads TLC"]:::auth --> Mdl["<b>7. Modelos IA</b><br/>LLMs & SLMs"]:::auth
```

Nenhuma camada inferior poderá ultrapassar a autoridade de uma camada superior.

---

# Fluxo Operacional

Toda iniciativa percorre o seguinte fluxo em 3 fases:

```mermaid
flowchart LR
    classDef phase1 fill:#0f172a,stroke:#38bdf8,stroke-width:1.2px,color:#ffffff;
    classDef phase2 fill:#2e1065,stroke:#c084fc,stroke-width:1.2px,color:#ffffff;
    classDef phase3 fill:#064e3b,stroke:#34d399,stroke-width:1.2px,color:#ffffff;

    subgraph Fase1 ["Fase 1: Concepção & Governança"]
        direction TB
        F1_1["<b>1. Opportunity</b><br/>Identificação & Demanda"]:::phase1
        F1_2["<b>2. Arch Check</b><br/>Alinhamento Arquitetural"]:::phase1
        F1_3["<b>3. Gov Check</b><br/>Auditoria de Governança"]:::phase1
        F1_4["<b>4. Cell Creation</b><br/>Instanciação da Célula"]:::phase1
        F1_5["<b>5. Method Selection</b><br/>Definição do Método"]:::phase1
        F1_1 --> F1_2 --> F1_3 --> F1_4 --> F1_5
    end

    subgraph Fase2 ["Fase 2: Especificação & Execução"]
        direction TB
        F2_1["<b>6. Specification</b><br/>RFC & Contratos de Spec"]:::phase2
        F2_2["<b>7. Design</b><br/>Arquitetura da Solução"]:::phase2
        F2_3["<b>8. Planning</b><br/>Backlog & Tasks Detalhadas"]:::phase2
        F2_4["<b>9. Execution</b><br/>Construção & TDD Confinado"]:::phase2
        F2_5["<b>10. Validation</b><br/>Bateria de Testes & QA"]:::phase2
        F2_1 --> F2_2 --> F2_3 --> F2_4 --> F2_5
    end

    subgraph Fase3 ["Fase 3: Implantação & Aprendizado"]
        direction TB
        F3_1["<b>11. Deployment</b><br/>Entrega & Homologação"]:::phase3
        F3_2["<b>12. Operation</b><br/>Operação Contínua 24/7"]:::phase3
        F3_3["<b>13. Learning</b><br/>Captura de Aprendizados"]:::phase3
        F3_4["<b>14. Knowledge</b><br/>Gravação no Acervo Digital"]:::phase3
        F3_5["<b>15. Memory</b><br/>Indexação em PGVector"]:::phase3
        F3_1 --> F3_2 --> F3_3 --> F3_4 --> F3_5
    end

    Fase1 ==>|"Aprovação do Gate"| Fase2
    Fase2 ==>|"Validação Concluída"| Fase3
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
