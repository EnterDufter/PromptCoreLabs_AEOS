==================================================
OBJETIVO
==================================================

Prover um guia operacional passo a passo para a inicialização e configuração física e lógica de novos projetos sob a governança do PromptCoreLabs_AEOS.

Este documento complementa as regras contratuais contidas em:

bootstrap/project/new-project.md

==================================================
PRÉ-REQUISITOS
==================================================

• Acesso de escrita ao repositório git do ecossistema.
• Workspace devidamente configurado e validado conforme bootstrap/environment/checklist.md.
• Identificador de taxonomia do projeto definido (ex: NGS, PCL, etc.).

==================================================
FLUXO OPERACIONAL PASSO A PASSO
==================================================

Passo 1 — Definição e Criação Física da Pasta do Projeto

Crie a pasta física dentro do diretório apropriado do repositório. Projetos autónomos vivem no root ou na pasta dedicada de projetos do respectivo módulo:

mkdir c:\PromptCore_Labs\projects\[nome-do-projeto]

Passo 2 — Inicialização da Documentação TLC Spec-Driven v3

Crie a pasta de especificações do projeto sob `.specs/projects/`:

mkdir c:\PromptCore_Labs\.specs\projects\[nome-do-projeto]

Crie os arquivos constituintes iniciais com os seguintes conteúdos mínimos:

1. PROJECT.md
   • Defina Vision, Taxonomia, Metodologia e Roadmap.

2. STATE.md
   • Registre status atual (ex: SPECS_UNDER_REVIEW), decisões e blockers iniciais.

3. specify.md
   • Inicie o arquivo de especificação detalhada de requisitos conforme o padrão TLC.

Passo 3 — Registro e Alinhamento de Governança

Edite o arquivo master de snapshots (`bootstrap/handoff/context-snapshot.md`) ou o STATE global para listar o novo projeto na seção "ESTADO DOS PROJETOS ATIVOS", especificando:
• Nome do Projeto
• Localização física
• Status inicial
• Próximo passo imediato

Passo 4 — Criação do Primeiro ADR (Architecture Decision Record)

Caso o projeto necessite de decisões específicas sobre bancos de dados, infraestrutura ou integrações externas:
1. Crie o arquivo de ADR na pasta correspondente à arquitetura do projeto.
2. Registre a decisão no padrão estabelecido em patterns/adr-pattern.md.

Passo 5 — Validação pelo Stage Gate

Apresente a documentação inicial (especificações e requisitos do specify.md) para aprovação humana. O projeto não deve avançar para a fase de design ou implementação sem aprovação do gate correspondente em governance/stage-gates.md.

==================================================
RESOLUÇÃO DE PROBLEMAS COMUNS
==================================================

Divergência de Estrutura Física/Lógica:
Se o projeto precisar de uma estrutura diferente do padrão de pastas recomendado, isso deve ser discutido com o Arquiteto e formalizado num ADR antes da criação física da pasta do projeto.

Bloqueio no Stage Gate:
Se o gate de especificações for rejeitado pelo usuário, as correções devem ser feitas exclusivamente nos documentos sob `.specs/projects/[nome-do-projeto]/specify.md` antes de uma nova submissão.

==================================================
REFERÊNCIAS
==================================================

bootstrap/project/new-project.md

.specs/methodology/tlc-spec-driven-v3/specify.md

governance/stage-gates.md
