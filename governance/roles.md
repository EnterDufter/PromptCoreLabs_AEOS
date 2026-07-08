=========================================================
OBJETIVO
=========================================================

Definir o catálogo oficial de papéis (Roles) do AEOS.

Papéis representam responsabilidades permanentes dentro da plataforma.

Papéis NÃO representam pessoas.

Papéis NÃO representam ferramentas.

Papéis NÃO representam modelos LLM.

Um mesmo papel pode ser desempenhado por:

• uma pessoa
• um agente
• uma equipe
• uma Execution Cell
• uma combinação entre humanos e IA

O objetivo deste documento é separar definitivamente:

Responsabilidade

de

Tecnologia.

=========================================================
PRINCÍPIOS
=========================================================

Todo papel possui:

• missão

• responsabilidades

• limites

• entradas

• saídas

• autoridade (referenciada em decision-authority.md)

• artefatos produzidos

• artefatos consumidos

• critérios de sucesso

Papéis nunca devem possuir responsabilidades ambíguas.

Nenhum papel pode acumular autoridade incompatível.

Execução e aprovação devem permanecer separadas.

=========================================================
CATEGORIAS DE PAPÉIS
=========================================================

Organizar os papéis em grandes grupos.

1. Strategic Roles

Responsáveis pela direção do ecossistema.

Exemplos:

Sponsor

Chief Architect

Portfolio Owner

Governance Lead

---------------------------------------------------------

2. Engineering Roles

Responsáveis pela engenharia.

Exemplos:

Project Architect

Builder

Reviewer

QA

Security

Documentation

DevOps

---------------------------------------------------------

3. Runtime Roles

Responsáveis pela operação do Runtime.

Exemplos:

Execution Cell

Workflow Coordinator

Context Manager

Memory Manager

Model Router

Fallback Manager

Tool Orchestrator

---------------------------------------------------------

4. Knowledge Roles

Responsáveis pelo conhecimento.

Exemplos:

Knowledge Curator

RAG Manager

Ontology Manager

Context Librarian

Memory Steward

---------------------------------------------------------

5. AI Specialist Roles

Papéis especializados executados por agentes.

Exemplos:

Planner Agent

Builder Agent

Reviewer Agent

Security Agent

Testing Agent

Documentation Agent

Migration Agent

Refactoring Agent

Research Agent

Validation Agent

=========================================================
ESTRUTURA PADRÃO DE CADA PAPEL
=========================================================

Cada papel deve possuir uma estrutura uniforme contendo:

Nome

Missão

Objetivo

Responsabilidades

Entradas

Saídas

Autoridade

Restrições

Dependências

Artefatos utilizados

Artefatos produzidos

Indicadores de sucesso

=========================================================
SEPARAÇÃO ENTRE PAPEL E TECNOLOGIA
=========================================================

Explicar claramente que:

Builder

não significa

Codex.

Reviewer

não significa

Cursor.

Planner

não significa

Claude.

Execution Cell

não significa

Amazon Q.

Knowledge Manager

não significa

OpenAI.

Model Router

não significa

Ollama.

Papéis são permanentes.

Ferramentas são intercambiáveis.

=========================================================
RELAÇÃO COM EXECUTION CELL
=========================================================

Explicar que a Execution Cell não executa tudo sozinha.

Ela coordena papéis.

Ela distribui responsabilidades.

Ela organiza o fluxo.

Ela nunca substitui os papéis.

Ela apenas os orquestra.

=========================================================
MULTIROLE
=========================================================

Explicar que uma mesma pessoa poderá desempenhar vários papéis.

Por exemplo:

Eduardo

↓

Sponsor

↓

Chief Architect

↓

Project Architect

↓

Builder

↓

Reviewer

Em projetos pequenos.

Já em projetos maiores esses papéis poderão ser distribuídos entre pessoas, agentes e equipes.

=========================================================
MULTIAGENTE
=========================================================

Explicar que vários agentes podem exercer o mesmo papel.

Exemplo:

Cinco Builder Agents.

Dois Reviewer Agents.

Três Research Agents.

Todos continuam pertencendo ao mesmo Role.

=========================================================
MODEL AGNOSTIC
=========================================================

Registrar explicitamente:

O papel permanece.

O agente pode mudar.

O modelo pode mudar.

A IDE pode mudar.

O provider pode mudar.

A responsabilidade permanece.

=========================================================
RELAÇÃO COM OUTROS DOCUMENTOS
=========================================================

Este documento complementa:

architecture/principles.md

governance/operating-model.md

governance/decision-authority.md

governance/stage-gates.md

runtime/

agents/

knowledge/