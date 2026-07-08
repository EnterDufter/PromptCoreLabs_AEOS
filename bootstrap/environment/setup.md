==================================================
OBJETIVO
==================================================

Definir o processo de configuração do ambiente técnico necessário para operar o PromptCoreLabs_AEOS.

Este documento garante que qualquer pessoa ou Execution Provider possa configurar um ambiente funcional de forma consistente e verificável.

==================================================
PRÉ-REQUISITOS OBRIGATÓRIOS
==================================================

As seguintes ferramentas devem estar instaladas e configuradas:

Git

Ferramenta de versionamento.

• Versão mínima: 2.40+
• Configuração obrigatória: usuário e e-mail definidos
• Repositório conectado ao repositório privado do AEOS

Docker Desktop

Plataforma de containerização.

• Versão mínima: 4.x+
• WSL2 habilitado (ambientes Windows)
• Volumes persistentes configurados para PaperClip e OmniRoute

Tailscale

Rede privada ponto-a-ponto.

• Conectado à rede privada da PromptCore Labs
• Soberania de acesso remoto garantida

==================================================
HARNESS DE IA — COMPONENTES
==================================================

O Harness de IA da PromptCore Labs é composto por:

OmniRoute (AI Gateway)

• Função: roteamento inteligente de modelos de IA
• Hierarquia de modelos:

  TIER-1 (High Logic): Gemini Pro / Claude Sonnet
  TIER-2 (Fast Execution): Gemini Flash
  TIER-3 (Local/Zero Cost): Qwen3-Coder / Gemma

• Configuração: bootstrap do container Docker com volume persistente
• Endpoint: configurado para acesso por todos os Execution Providers

PaperClip (Agent Orchestration)

• Função: dashboard de agentes e squads
• Configuração: container Docker com volume ./PaperClip-Companies mapeado
• Integração: conectado ao OmniRoute

LM Studio (Local — Heavy Coding)

• Modelo: Qwen3-Coder-30B
• Hardware: RTX 3050
• Uso: coding denso sem custo de tokens

Ollama (Local — Audit/Logs)

• Modelo: Gemma 3 4B
• Uso: auditoria, logs, tarefas de CLI

NotebookLM (Audit & Context)

• Função: cérebro de auditoria e conhecimento
• Integração: NotebookLM MCP Server

==================================================
CONFIGURAÇÃO DO GIT
==================================================

Verificar configuração global:

git config --global user.name
git config --global user.email

Verificar conexão com o repositório:

git remote -v

Verificar status do repositório:

git status

Boas práticas:

• Nunca commitar credenciais, chaves ou segredos.
• Manter branches organizados conforme convenção do projeto.
• Commits devem ser descritivos e rastreáveis.

==================================================
CONFIGURAÇÃO DO DOCKER
==================================================

Verificar que o Docker está em execução:

docker info

Verificar containers ativos:

docker ps

Iniciar o PaperClip:

docker compose up -d

A inicialização deve incluir o volume ./PaperClip-Companies mapeado para garantir soberania de dados.

==================================================
CONFIGURAÇÃO DE EXECUTION PROVIDERS
==================================================

Execution Providers devem ser configurados para:

• Ter acesso de leitura e escrita ao repositório.
• Estar conectados ao Harness de IA via OmniRoute quando aplicável.
• Operar dentro dos limites definidos em bootstrap/onboarding/execution-provider.md.

==================================================
POLÍTICAS DE SEGURANÇA
==================================================

• Todos os repositórios devem ser privados.
• Dados sensíveis devem ser processados localmente sempre que possível.
• Credenciais jamais devem ser armazenadas em documentação ou código versionado.
• Dados do PaperClip-Companies jamais devem ser expostos a modelos Cloud sem anonimização prévia.

==================================================
VERIFICAÇÃO FINAL
==================================================

Após configurar o ambiente, execute o checklist de verificação:

bootstrap/environment/checklist.md

Somente após aprovação no checklist o ambiente está apto para execução de trabalho.

==================================================
FONTES DE REFERÊNCIA
==================================================

PCL_INFRA_STACK_v2.md

.specs/projects/promptcore-labs-foundation/PROJECT.md

.specs/projects/promptcore-labs-foundation/STATE.md
