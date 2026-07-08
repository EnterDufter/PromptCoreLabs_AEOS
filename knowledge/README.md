==================================================
OBJETIVO
==================================================

O módulo Knowledge do PromptCoreLabs_AEOS é responsável por gerenciar e estruturar o conhecimento explícito da plataforma, incluindo playbooks operacionais, padrões de engenharia e catálogos de ferramentas.

Knowledge representa o patrimônio intelectual permanente do ecossistema, existindo de maneira independente dos agentes que o utilizam.

==================================================
POSIÇÃO ARQUITETURAL
==================================================

O módulo Knowledge está situado no quarto nível do fluxo de conhecimento do AEOS:

Foundation
↓
Governance
↓
Bootstrap
↓
Knowledge

Ele alimenta a camada de Agents e Runtime com playbooks, padrões e catálogos necessários para a execução disciplinada das tarefas.

==================================================
ESTRUTURA DO MÓDULO
==================================================

knowledge/
├── README.md                        ← este documento
│
├── playbooks/
│   ├── README.md                    ← visão dos playbooks
│   ├── new-project-playbook.md      ← guia para iniciar novos projetos
│   └── debugging-playbook.md        ← guia de diagnóstico de problemas
│
├── patterns/
│   ├── README.md                    ← visão dos padrões
│   ├── tlc-spec-driven.md           ← padrão da metodologia TLC
│   └── adr-pattern.md               ← padrão para criação de ADRs
│
└── catalog/
    ├── README.md                    ← visão do catálogo
    └── tools-catalog.md             ← catálogo de ferramentas e stacks

==================================================
PRINCÍPIOS DE CONHECIMENTO
==================================================

Princípio 1 — Conhecimento é permanente

Códigos, prompts e agentes mudam, mas o conhecimento consolidado em padrões e playbooks é persistente e deve ser atualizado continuamente.

Princípio 2 — Independência de agente

O conhecimento é mantido em formato puramente declarativo e legível por humanos e máquinas, sem acoplamento com a lógica de execução de qualquer agente específico.

Princípio 3 — Atualização disciplinada

Qualquer alteração em padrões ou playbooks deve ser validada e aprovada pelo arquiteto responsável.

==================================================
FONTES DE VERDADE
==================================================

foundation/FOUNDATION.md

architecture/modules.md

architecture/principles.md
