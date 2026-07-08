==================================================
OBJETIVO
==================================================

Estabelecer as convenções oficiais de uso do Git e do GitHub no ecossistema PromptCoreLabs_AEOS.

A padronização do histórico de commits e da estrutura de branches garante rastreabilidade, integração com o ciclo de RAG e facilidade de auditoria.

==================================================
1. NOMENCLATURA DE BRANCHES
==================================================

Branches devem seguir o formato:

[tipo]/[escopo]-[descricao-curta]

Tipos permitidos:
• feat/       → nova funcionalidade ou módulo
• fix/        → correção de bug ou erro documental
• docs/       → criação ou atualização de documentação
• refactor/   → refatoração sem mudança de comportamento
• chore/      → tarefas de manutenção (dependências, limpeza)
• adr/        → criação de um novo ADR

Exemplos:
• docs/phase-2-bootstrap-module
• feat/agents-definitions
• adr/0001-memory-segregation

==================================================
2. MENSAGENS DE COMMIT
==================================================

Mensagens de commit devem seguir o padrão Conventional Commits:

[tipo]([escopo opcional]): [descrição curta em imperativo]

Exemplos:
• docs(bootstrap): add execution-provider onboarding
• feat(agents): create builder and planner definitions
• fix(foundation): restore compliance phrase
• adr: create ADR-0001 for memory module segregation

Regras:
• Limite de 72 caracteres na linha de título.
• Corpo do commit opcional em inglês ou português, separado por linha em branco.
• Use o imperativo na descrição: "add", "create", "fix", "remove" — não "added" ou "criando".

==================================================
3. PROTOCOLO DE PULL REQUESTS
==================================================

• Toda mudança em módulos fundacionais (foundation/, architecture/, governance/) deve obrigatoriamente passar por Pull Request revisado por um arquiteto humano antes do merge na branch master.

• Mudanças em módulos operacionais (bootstrap/, knowledge/, runtime/, templates/) podem ser merged diretamente pelo operador autorizado.

• O título do PR deve refletir o escopo de mudança no mesmo formato de commits.

==================================================
4. VERSIONAMENTO DE ARTEFATOS
==================================================

• Todo módulo deve ter sua versão registrada no respectivo README.md (ex: v1.0, v1.1, v2.0).

• A versão MAJOR é incrementada quando a arquitetura ou o contrato público de um módulo muda de forma incompatível.

• A versão MINOR é incrementada ao adicionar novos documentos sem quebrar contratos existentes.

• A versão PATCH é incrementada para correções de conteúdo menores.

==================================================
FONTES DE REFERÊNCIA
==================================================

architecture/adr-process.md

memory/rag/indexing-rules.md
