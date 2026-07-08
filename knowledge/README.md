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
DIAGRAMA DE RELACIONAMENTO: ESTRUTURA DO KNOWLEDGE
==================================================

As três ramificações do conhecimento cooperam para dar suporte operacional aos agentes:

```mermaid
graph TD
    K[Módulo Knowledge] --> P[Playbooks]
    K --> PA[Patterns]
    K --> C[Catalog]
    
    P -->|Descrevem| P1[Como Fazer: Execução de Processos]
    PA -->|Descrevem| PA1[Como Formatar: Scaffolding de Documentos]
    C -->|Descrevem| C1[O Que Usar: Inventário Tecnológico]
    
    P1 & PA1 & C1 ──► |Injetados via Contexto/RAG| AG[Agentes especializados]
```

==================================================
GUIA QUICKSTART: CONSULTA E EVOLUÇÃO
==================================================

### Passo 1 — Consulta Rápida por Humanos
Para saber como conduzir uma operação (ex: criar projetos), consulte a subpasta correspondente:
```bash
# Para guias passo a passo de processos:
cat knowledge/playbooks/new-project-playbook.md

# Para convenções de formato e templates:
cat knowledge/patterns/adr-pattern.md
```

### Passo 2 — Registrar Novo Padrão (Pattern)
Quando uma estrutura documental repetir-se mais de duas vezes, registre-a como padrão:
1. Crie o arquivo `.md` em `knowledge/patterns/`.
2. Siga o formato padrão de delimitadores `===` para facilitar o parsing de IA.
3. Adicione a referência ao novo arquivo na seção "LISTA DE PADRÕES ATIVOS" do `knowledge/patterns/README.md`.

==================================================
FONTES DE VERDADE
==================================================

foundation/FOUNDATION.md

architecture/modules.md

architecture/principles.md

