==================================================
OBJETIVO
==================================================

Definir o protocolo oficial de handoff de projetos dentro do PromptCoreLabs_AEOS.

Handoff de projeto ocorre quando:

• uma sessão de trabalho é encerrada e será retomada posteriormente;
• um Execution Provider é substituído por outro;
• um agente transfere o controle para outro agente;
• o trabalho em um módulo é pausado e retomado em contexto diferente.

==================================================
PRINCÍPIO FUNDAMENTAL
==================================================

O contexto não pode depender da memória do Execution Provider.

Todo estado relevante do projeto deve existir no repositório, não na sessão.

Se o projeto não pode ser retomado apenas pela leitura dos documentos do repositório, o handoff está incompleto.

==================================================
CRITÉRIOS DE HANDOFF COMPLETO
==================================================

Um handoff está completo quando qualquer Execution Provider, ao ler os documentos registrados, consiga:

□ entender o propósito do projeto;
□ entender o estado atual;
□ saber o que já foi feito;
□ saber o que está pendente;
□ saber quais decisões foram tomadas;
□ identificar bloqueios e riscos ativos;
□ saber qual é o próximo passo concreto.

==================================================
PROTOCOLO DE HANDOFF — QUEM ENTREGA
==================================================

Ao encerrar trabalho em um projeto, o Execution Provider deve:

Passo 1 — Registrar artefatos

Listar todos os arquivos criados ou modificados na sessão com seus respectivos caminhos completos.

Passo 2 — Atualizar o STATE.md

Atualizar o arquivo STATE.md do projeto com:

• status atual;
• tarefas concluídas nesta sessão;
• tarefas pendentes;
• decisões tomadas;
• bloqueios e riscos identificados;
• referência ao handoff de missão.

Passo 3 — Preencher o Mission Handoff

Preencher o template em:

bootstrap/handoff/mission-handoff.md

Passo 4 — Confirmar rastreabilidade

Verificar se todos os artefatos produzidos possuem:

• localização documentada;
• propósito registrado;
• estado (completo, parcial, bloqueado).

Passo 5 — Comunicar o próximo passo

O último registro do handoff deve conter a instrução clara de qual é o próximo passo esperado para quem retomar o trabalho.

==================================================
PROTOCOLO DE RETOMADA — QUEM RECEBE
==================================================

Ao retomar trabalho em um projeto, o Execution Provider deve:

Passo 1 — Ler o Bootstrap de Execution Provider

bootstrap/onboarding/execution-provider.md

Passo 2 — Ler o handoff recebido

bootstrap/handoff/mission-handoff.md
bootstrap/handoff/context-snapshot.md

Passo 3 — Ler o STATE.md do projeto

.specs/projects/[nome-do-projeto]/STATE.md

Passo 4 — Verificar os artefatos referenciados

Inspecionar os arquivos referenciados no handoff para confirmar o estado atual.

Passo 5 — Confirmar o entendimento

Antes de iniciar qualquer ação, reportar ao usuário:

• o que foi entendido do estado atual;
• qual é a proposta de próximos passos;
• quais são as dúvidas ou ambiguidades identificadas.

==================================================
REGRAS DE HANDOFF
==================================================

Regra 1 — Handoff é obrigatório

Toda sessão que encerra com trabalho pendente deve produzir um handoff.

Regra 2 — Handoff em texto, não em memória

O handoff deve existir como documento no repositório.

Regra 3 — Handoff deve ser verificável

Qualquer um deve conseguir verificar que o handoff está completo apenas lendo os documentos.

Regra 4 — Handoff não substitui documentação

O handoff registra o estado de transição.

A documentação permanente deve estar nos documentos do módulo correspondente.

==================================================
FONTES DE REFERÊNCIA
==================================================

bootstrap/handoff/mission-handoff.md

bootstrap/handoff/context-snapshot.md

governance/decision-authority.md

architecture/lifecycle.md
