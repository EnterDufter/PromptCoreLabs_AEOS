==================================================
OBJETIVO
==================================================

Inicializar Execution Providers para que operem dentro do PromptCoreLabs_AEOS de acordo com as regras estabelecidas pela Foundation e pela Governance.

Este documento deve ser lido integralmente antes de qualquer ação dentro do repositório.

==================================================
O QUE É UM EXECUTION PROVIDER
==================================================

Execution Providers são ferramentas, IDEs, agentes de codificação ou modelos LLM utilizados para materializar artefatos aprovados dentro do ecossistema PromptCoreLabs_AEOS.

Exemplos de Execution Providers:

• Antigravity
• Cursor
• Claude Code
• Amazon Q
• Codex
• OpenHands
• Goose
• Aider
• Gemini CLI
• Continue.dev
• Cline
• Windsurf

Execution Providers não possuem autoridade arquitetural.

Eles executam.

A arquitetura pertence ao AEOS.

==================================================
REGRAS OBRIGATÓRIAS
==================================================

Regra 1 — Ler antes de agir

Nenhuma ação deve ser iniciada sem que este documento e os documentos da Foundation tenham sido lidos.

Regra 2 — Não reinterpretar a arquitetura

O Execution Provider não deve propor mudanças arquiteturais por iniciativa própria.

Mudanças arquiteturais exigem aprovação humana e registro formal como ADR.

Regra 3 — Não substituir decisões anteriores

Decisões anteriores estão documentadas e são válidas.

Elas somente podem ser revogadas por meio de um novo ADR aprovado pelo usuário.

Regra 4 — Não reconstruir o que já existe

Se um módulo, documento ou decisão já existir, o Execution Provider deve dar continuidade a partir do que foi produzido.

Reconstrução não autorizada é um erro grave.

Regra 5 — Preservar rastreabilidade

Todo artefato criado ou modificado deve preservar rastreabilidade.

Alterações devem ser versionadas e registradas.

Regra 6 — Solicitar aprovação antes de mudanças significativas

Mudanças que alterem a estrutura do repositório, a governance ou os princípios arquiteturais requerem aprovação explícita do usuário.

Regra 7 — Realizar handoff antes de encerrar

Ao concluir uma sessão ou missão, o Execution Provider deve produzir um handoff completo utilizando o template em:

bootstrap/handoff/mission-handoff.md

==================================================
LIMITES DE AUTORIDADE
==================================================

O Execution Provider PODE:

• criar novos artefatos dentro de módulos já aprovados;
• modificar documentos conforme aprovação do usuário;
• propor planos de implementação para aprovação;
• criar estrutura física de diretórios aprovada na arquitetura;
• registrar perguntas, bloqueios e decisões pendentes;
• realizar limpezas e melhorias de higiene documental.

O Execution Provider NÃO PODE:

• alterar princípios fundacionais sem aprovação e ADR;
• remover documentos permanentes sem autorização;
• criar módulos arquiteturais não previstos na Foundation;
• tomar decisões de autoridade arquitetural de forma autônoma;
• ignorar documentação existente e recomeçar do zero;
• persistir segredos, credenciais ou dados sensíveis em documentação.

==================================================
PROTOCOLO DE INÍCIO DE SESSÃO
==================================================

Ao iniciar uma sessão dentro do PromptCoreLabs_AEOS, o Execution Provider deve seguir este protocolo:

Etapa 1 — Leitura da Foundation

Ler obrigatoriamente:

• foundation/FOUNDATION.md
• architecture/modules.md
• architecture/principles.md

Etapa 2 — Leitura do Estado Atual

Ler os documentos de estado disponíveis:

• bootstrap/handoff/context-snapshot.md (se existir)
• bootstrap/handoff/mission-handoff.md (se existir)

Etapa 3 — Leitura do Módulo Relevante

Ler os documentos do módulo onde o trabalho será realizado.

Etapa 4 — Confirmação de Entendimento

Antes de iniciar qualquer ação, o Execution Provider deve confirmar ao usuário:

• que compreendeu o estado atual do projeto;
• quais são as próximas ações propostas;
• quais são as dúvidas pendentes.

==================================================
PROTOCOLO DE ENCERRAMENTO DE SESSÃO
==================================================

Ao encerrar uma sessão, o Execution Provider deve:

1. Listar todos os artefatos criados ou modificados.
2. Listar todas as tarefas concluídas.
3. Listar todas as tarefas pendentes.
4. Registrar decisões tomadas durante a sessão.
5. Registrar bloqueios e riscos identificados.
6. Atualizar o handoff de missão em bootstrap/handoff/mission-handoff.md.
7. Atualizar o snapshot de estado em bootstrap/handoff/context-snapshot.md.

==================================================
HIERARQUIA DE AUTORIDADE
==================================================

Quem define a arquitetura:

Foundation → Architecture → Governance → Bootstrap

Quem executa:

Runtime → Execution Providers → Agentes

O Execution Provider está na camada de execução.

Jamais na camada de definição.

==================================================
FONTES OBRIGATÓRIAS DE LEITURA
==================================================

foundation/FOUNDATION.md

architecture/modules.md

architecture/principles.md

architecture/repository-structure.md

governance/governance.md

governance/decision-authority.md

governance/compliance.md

bootstrap/handoff/mission-handoff.md

bootstrap/handoff/context-snapshot.md
