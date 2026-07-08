==================================================
OBJETIVO
==================================================

Verificar se o ambiente técnico e operacional está apto para execução de trabalho dentro do PromptCoreLabs_AEOS.

Este checklist deve ser executado antes do início de qualquer sessão de trabalho.

==================================================
LEGENDA
==================================================

[ ] Item não verificado
[x] Item verificado e aprovado
[-] Item não aplicável neste contexto

==================================================
BLOCO 1 — REPOSITÓRIO
==================================================

[ ] Git instalado e configurado (usuário e e-mail)
[ ] Repositório clonado e atualizado (git pull)
[ ] Branch correto para o trabalho em questão
[ ] Nenhum conflito pendente de resolução
[ ] Credenciais NÃO expostas no repositório

==================================================
BLOCO 2 — FOUNDATION
==================================================

[ ] Lido: foundation/FOUNDATION.md
[ ] Lido: architecture/principles.md
[ ] Lido: architecture/modules.md
[ ] Lido: architecture/repository-structure.md

==================================================
BLOCO 3 — ESTADO ATUAL
==================================================

[ ] Lido: bootstrap/handoff/mission-handoff.md (se existir)
[ ] Lido: bootstrap/handoff/context-snapshot.md (se existir)
[ ] Estado atual do projeto em andamento compreendido
[ ] Tarefas pendentes identificadas

==================================================
BLOCO 4 — HARNESS DE IA
==================================================

[ ] Docker Desktop em execução
[ ] OmniRoute respondendo (se aplicável)
[ ] PaperClip em execução com volumes mapeados (se aplicável)
[ ] Tailscale conectado (se acesso remoto necessário)

==================================================
BLOCO 5 — MODELOS LOCAIS
==================================================

[ ] LM Studio ativo com Qwen3-Coder-30B (se necessário para coding denso)
[ ] Ollama ativo com Gemma 3 4B (se necessário para auditoria/logs)

==================================================
BLOCO 6 — EXECUTION PROVIDER
==================================================

[ ] Lido: bootstrap/onboarding/execution-provider.md
[ ] Limites de autoridade compreendidos
[ ] Protocolo de início de sessão seguido
[ ] Protocolo de encerramento de sessão conhecido

==================================================
BLOCO 7 — SEGURANÇA
==================================================

[ ] Repositório privado
[ ] Nenhuma credencial em arquivos versionados
[ ] Dados do PaperClip-Companies protegidos

==================================================
RESULTADO DO CHECKLIST
==================================================

AMBIENTE APROVADO PARA EXECUÇÃO

Todos os itens obrigatórios do Bloco 1, 2 e 3 estão marcados como verificados.

Os demais blocos foram verificados conforme aplicabilidade do contexto.

O trabalho pode ser iniciado.

---

AMBIENTE NÃO APROVADO

Um ou mais itens obrigatórios não foram verificados.

Resolva os pendentes antes de iniciar qualquer trabalho.

==================================================
ITENS OBRIGATÓRIOS
==================================================

Os seguintes itens são sempre obrigatórios, independente do contexto:

• Bloco 1 — Repositório: todos os itens
• Bloco 2 — Foundation: todos os itens
• Bloco 6 — Execution Provider: os dois primeiros itens

Demais itens são obrigatórios conforme o contexto da sessão.

==================================================
FONTES DE REFERÊNCIA
==================================================

bootstrap/environment/setup.md

bootstrap/onboarding/execution-provider.md

foundation/FOUNDATION.md
