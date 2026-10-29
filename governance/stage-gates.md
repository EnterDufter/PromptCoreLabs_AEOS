> [!IMPORTANT]
> **Status Normativo:** Documento de diretrizes subordinado à [Matriz de Precedência Normativa](normative-hierarchy.md) (`PCL-AEOS-NORM-01`).
> Para a numeração oficial de Stage Gates unificados (G-00 a G-04) e critérios formais de autoridade humana soberana, a fonte canônica prevalente é a Seção 5 de `normative-hierarchy.md`.

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

Conceito Operacional:

Workflow é uma sequência de atividades e entregas técnicas.

Stage Gate é um ponto formal de controle e decisão de passagem entre etapas.

O Gate não executa trabalho de implementação; ele avalia a conformidade e autoriza ou bloqueia o avanço.

=========================================================
MODELO PADRÃO
=========================================================

Fluxo de Trabalho Canônico do AEOS:

Idea → Discovery → Specification → Design → Planning → Execution → Validation → Release → Operation → Continuous Improvement

Entre cada transição de etapa existe um Stage Gate obrigatório.

=========================================================
ESTRUTURA PADRÃO DE UM GATE
=========================================================

Cada Gate contém:
- Nome e Identificador Único
- Objetivo Estratégico
- Entradas e Pré-requisitos
- Artefatos e Entregáveis Verificáveis
- Critérios de Aceite Objetivos
- Autoridade Decisora Humana Soberana
- Ações Mandatórias Pós-Decisão

=========================================================
RESULTADOS POSSÍVEIS
=========================================================

Todo Gate produz uma das seguintes decisões formais:
- **Approved**: Critérios atendidos integralmente; transição liberada.
- **Approved with Conditions**: Critérios críticos atendidos; pendências menores com prazo e owner.
- **Rejected**: Critérios violados; trabalho reprovado.
- **Return to Previous Stage**: Trabalho incompleto; retorna à etapa anterior para saneamento.
- **Escalate**: Conflito de escopo ou autoridade; requer deliberação do Patrocinador.
- **Blocked**: Impedimento externo ou dependência não resolvida.
- **Deferred**: Decisão postergada para momento ou marco futuro.

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