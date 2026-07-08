==================================================
OBJETIVO
==================================================

Definir o protocolo oficial de inicialização de novos projetos dentro do PromptCoreLabs_AEOS.

Todo projeto desenvolvido sob a governança do AEOS deve seguir este protocolo antes de qualquer implementação.

==================================================
PRÉ-REQUISITOS
==================================================

Antes de iniciar um novo projeto, verifique:

• Você leu a Foundation? (foundation/FOUNDATION.md)
• Você leu os princípios arquiteturais? (architecture/principles.md)
• Você conhece a metodologia obrigatória? (TLC Spec-Driven v3)
• O ambiente técnico está configurado? (bootstrap/environment/checklist.md)
• Você possui autoridade para iniciar este projeto?

Se alguma resposta for negativa, resolva antes de prosseguir.

==================================================
CHECKLIST DE CRIAÇÃO DE PROJETO
==================================================

Etapa 1 — Validação Arquitetural

□ A ideia do projeto está alinhada com a visão do AEOS?
□ O projeto não viola os princípios fundacionais?
□ O projeto possui responsabilidade claramente definida?
□ O projeto não duplica responsabilidades de módulos existentes?

Etapa 2 — Decisão de Localização

□ O projeto pertence ao módulo projects/ do AEOS?
□ Ou o projeto é parte integrante de um módulo específico (ex: examples/, integrations/)?

Consulte architecture/repository-structure.md para tomar esta decisão.

Etapa 3 — Criação da Estrutura do Projeto

O projeto deve conter ao menos:

.specs/
└── projects/
    └── [nome-do-projeto]/
        ├── PROJECT.md     ← visão, stack e roadmap
        ├── STATE.md       ← estado atual, decisões e bloqueios
        ├── specify.md     ← especificação do projeto
        ├── design.md      ← arquitetura da solução
        └── tasks.md       ← backlog de tarefas

Etapa 4 — Registro do Projeto

□ O projeto está registrado em STATE.md com data de criação?
□ O projeto possui ao menos uma decisão arquitetural registrada como ADR?
□ O projeto foi comunicado ao responsável arquitetural?

Etapa 5 — Configuração de Governança do Projeto

□ Quem é o Product Owner do projeto?
□ Quem são os Execution Providers autorizados?
□ Qual é a metodologia aplicada? (padrão: TLC Spec-Driven v3)
□ Como serão registradas as decisões do projeto?

==================================================
NAMING CONVENTION
==================================================

O nome do projeto deve seguir o padrão:

[domínio]-[nome-descritivo]

Exemplos:

• promptcore-labs-foundation
• aeos-runtime-engine
• integration-github-pipeline
• agent-auditor-core

Nomes devem ser em kebab-case, em inglês, sem acrônimos obscuros.

==================================================
ESTRUTURA RECOMENDADA DE DIRETÓRIOS
==================================================

projects/
└── [nome-do-projeto]/
    ├── src/        ← código-fonte (se aplicável)
    ├── docs/       ← documentação do projeto
    ├── tests/      ← testes do projeto
    ├── scripts/    ← scripts auxiliares
    └── README.md   ← descrição do projeto

==================================================
METODOLOGIA OBRIGATÓRIA — TLC SPEC-DRIVEN V3
==================================================

Todo projeto segue o seguinte fluxo de desenvolvimento:

SPECIFY → DESIGN → TASKS → EXECUTE → VALIDATE

Especificações devem ser aprovadas antes do design.
Design deve ser aprovado antes do planejamento.
Tarefas devem ser aprovadas antes da implementação.

Regra operacional:

Não avançar de SPECIFY para DESIGN, TASKS ou EXECUTE sem aprovação explícita do usuário.

Documentação completa da metodologia:

.specs/methodology/tlc-spec-driven-v3/

==================================================
REGRAS DE ISOLAMENTO
==================================================

Projetos não alteram a arquitetura do AEOS.

Projetos utilizam o AEOS como infraestrutura.

Modificações em modules, principles, foundation ou governance requerem ADR aprovado, independentemente do projeto.

==================================================
FONTES DE REFERÊNCIA
==================================================

architecture/repository-structure.md

architecture/lifecycle.md

governance/governance.md

governance/stage-gates.md

.specs/methodology/tlc-spec-driven-v3/specify.md
