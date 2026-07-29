=========================================================
OBJETIVO
=========================================================

Definir o modelo oficial de Stage Gates do AEOS.

Os Stage Gates representam pontos formais de controle entre etapas de qualquer workflow executado dentro da plataforma.

Eles garantem governança, rastreabilidade, qualidade e previsibilidade.

Um workflow nunca avança livremente.

Toda transição relevante deve atravessar um Gate.

=========================================================
PRINCÍPIOS
=========================================================

Todo Gate possui:

• objetivo

• critérios de entrada

• critérios de saída

• autoridade responsável

• evidências obrigatórias

• artefatos envolvidos

• possíveis decisões

• ações em caso de reprovação

Nenhum Gate pode ser aprovado automaticamente por um modelo LLM.

Toda aprovação deve possuir rastreabilidade.

=========================================================
CONCEITO
=========================================================

Explicar claramente que:

Workflow

é

uma sequência de atividades.

Stage Gate

é

um ponto formal de decisão entre atividades.

O Gate não executa trabalho.

O Gate valida se o trabalho está apto para prosseguir.

=========================================================
MODELO PADRÃO
=========================================================

Definir o fluxo genérico do AEOS.

Idea

↓

Discovery

↓

Specification

↓

Design

↓

Planning

↓

Execution

↓

Validation

↓

Release

↓

Operation

↓

Continuous Improvement

Entre cada etapa existe um Stage Gate.

=========================================================
ESTRUTURA PADRÃO DE UM GATE
=========================================================

Cada Gate deve conter:

Nome

Objetivo

Entradas obrigatórias

Artefatos esperados

Critérios de aceite

Autoridade responsável

Papéis envolvidos

Possíveis resultados

Ações pós-decisão

=========================================================
RESULTADOS POSSÍVEIS
=========================================================

Todo Gate pode resultar em:

Approved

Approved with Conditions

Rejected

Return to Previous Stage

Escalate

Blocked

Deferred

Cada estado deve ser explicado.

=========================================================
RASTREABILIDADE
=========================================================

Todo Gate deve registrar:

ID

Data

Workflow

Projeto

Execution Cell

Responsável

Reviewer

Resultado

Justificativa

Artefatos

Observações

=========================================================
RELAÇÃO COM EXECUTION CELL
=========================================================

Explicar que:

A Execution Cell conduz o workflow.

Ela prepara evidências.

Ela coordena os agentes.

Ela apresenta os artefatos.

Mas ela nunca aprova um Gate.

A decisão pertence à autoridade definida em:

decision-authority.md

=========================================================
RELAÇÃO COM TLC
=========================================================

Explicar explicitamente que:

A metodologia TLC Spec-Driven v3 é uma especialização deste modelo.

Exemplo:

SPECIFY

↓

Gate

↓

DESIGN

↓

Gate

↓

TASKS

↓

Gate

↓

EXECUTE

↓

Gate

↓

VALIDATE

Ou seja,

o TLC implementa os Stage Gates do AEOS.

O AEOS não depende do TLC.

O TLC passa a ser uma metodologia suportada pelo AEOS.

=========================================================
RELAÇÃO COM PCL CORTEX MICRO-LOOP
=========================================================

Explicar explicitamente que:

O PCL Cortex Micro-Loop (knowledge/patterns/pcl-cortex-micro-loop.md) rege a micro-disciplina operacional dos agentes internamente à etapa de EXECUTE.

Ele introduz:
- Trivial Gate Bypass (triagem de baixo overhead para tarefas triviais de 1 arquivo e <10 linhas).
- Bounded Retries (máximo de 3 retentativas de correção em testes antes de declarar bloqueio).
- Auditoria Adversária pelo agente QA (inspeção por observação direta e prevenção de reward hacking).

O Micro-Loop opera **dentro** da fase de execução. Ele prepara as evidências necessárias para apresentar ao Stage Gate formal do AEOS, mas **não substitui a autoridade humana de aprovação dos Stage Gates**.

=========================================================
OUTROS WORKFLOWS
=========================================================

Explicar que outros workflows poderão existir.

Exemplos:

Product Discovery

Incident Response

Architecture Review

Migration

Research

Security Review

Release Management

Knowledge Curation

Todos deverão utilizar os mesmos Stage Gates.

=========================================================
MCP
=========================================================

Explicar que futuramente os MCPs poderão atuar como mecanismos técnicos de verificação.

Porém:

MCP não representa autoridade.

MCP não aprova decisões.

MCP apenas verifica critérios objetivos.

=========================================================
RELAÇÃO COM OUTROS DOCUMENTOS
=========================================================

Este documento complementa:

operating-model.md

decision-authority.md

roles.md

policies.md

runtime/

agents/

knowledge/