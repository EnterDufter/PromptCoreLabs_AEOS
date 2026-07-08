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
