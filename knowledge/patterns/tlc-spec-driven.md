==================================================
OBJETIVO
==================================================

Definir o padrão de estrutura e formato (Pattern) para a documentação e execução da metodologia TLC Spec-Driven v3 dentro do PromptCoreLabs_AEOS.

Este padrão orienta humanos e agentes na criação e evolução de especificações técnicas para qualquer projeto ou aplicação no ecossistema.

==================================================
ANATOMIA DO FLUXO TLC
==================================================

O fluxo TLC é composto por cinco etapas obrigatórias e sequenciais:

1. SPECIFY (Especificação)
   • Artefato: specify.md
   • Foco: o que o sistema deve fazer (requisitos, regras de negócio, escopo).

2. DESIGN (Arquitetura e Design)
   • Artefato: design.md
   • Foco: como o sistema fará (arquitetura de software, componentes, fluxos de dados).

3. TASKS (Planejamento)
   • Artefato: tasks.md
   • Foco: planejamento detalhado (backlog de tarefas atômicas).

4. EXECUTE (Implementação)
   • Artefato: execute.md (ou logs de execução)
   • Foco: codificação e materialização dos artefatos.

5. VALIDATE (Validação e QA)
   • Artefato: validate.md
   • Foco: testes, conformidade e auditoria de aceitação.

==================================================
PADRÃO DO ARTEFATO: specify.md
==================================================

Todo arquivo specify.md deve conter os metadados iniciais e as seções a seguir:

Metadados Iniciais:
• Tipo: Especificação de Aplicativo / Módulo
• Escopo: [nome do app/módulo]
• Status: [Specify / Design / Tasks / Approved]
• Data: [data de modificação]

Seções Obrigatórias:

1. Controle de Escopo
   • 1.1 Objetivo: o que o aplicativo resolve.
   • 1.2 Dentro do Escopo: limites funcionais incluídos.
   • 1.3 Fora do Escopo: o que explicitamente não será feito.

2. Requisitos Funcionais (FR)
   • Apresentados em tabela com as colunas: ID, Requisito, Critérios de Aceite.
   • Nomenclatura do ID: [PREFIXO]-FR-[NÚMERO] (ex: APP-FR-001).

3. Requisitos Não Funcionais (NFR)
   • Apresentados em tabela com as colunas: ID, Requisito, Critérios de Aceite.
   • Nomenclatura do ID: [PREFIXO]-NFR-[NÚMERO] (ex: APP-NFR-001).

4. Arquitetura de Dados / Conceitual
   • Modelagem de dados inicial, fluxos lógicos e integrações de alto nível.

5. Requisitos de Segurança e Compliance
   • Requisitos de proteção de dados, privacidade e limites de IA.

==================================================
PADRÃO DO ARTEFATO: design.md
==================================================

O arquivo design.md traduz as especificações aprovadas em arquitetura técnica:

Seções Obrigatórias:

1. Arquitetura de Software
   • Camadas, padrões de projeto e decisões de design.

2. Decomposição de Componentes
   • Módulos, classes, APIs e componentes do sistema.

3. Fluxo de Dados e Sequência
   • Diagramas ou descrições textuais das interações.

4. Mapeamento de Especificações (Traceability Matrix)
   • Tabela que mapeia os IDs de requisitos funcionais (FR) para os respectivos componentes e designs da solução.

==================================================
PADRÃO DO ARTEFATO: tasks.md
==================================================

O arquivo tasks.md decompõe o design em itens executáveis e atômicos:

Seções Obrigatórias:

1. Resumo do Backlog
   • Status de tarefas concluídas, em progresso e pendentes.

2. Lista de Tarefas Atômicas
   • Cada tarefa deve ter a sintaxe:
     - `[ ]` [ID-REQUISITO] [NOME-TAREFA]: descrição detalhada da entrega técnica.
   • Exemplo:
     - `[ ]` [APP-FR-001] Criar tabela de usuários no banco de dados.

==================================================
REGRA OPERACIONAL CRÍTICA
==================================================

A transição de fases (Specify → Design → Tasks → Execute) requer aprovação expressa do usuário humano.

Agentes e Execution Providers estão proibidos de iniciar etapas de implementação sem que o respectivo gate de Tasks esteja devidamente aprovado e assinado no STATE.md ou pelo usuário no chat.

==================================================
FONTES DE REFERÊNCIA
==================================================

.specs/methodology/tlc-spec-driven-v3/specify.md

governance/stage-gates.md

governance/decision-authority.md
