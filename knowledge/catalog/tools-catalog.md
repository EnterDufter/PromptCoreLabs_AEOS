==================================================
OBJETIVO
==================================================

Prover o catálogo e inventário oficial de ferramentas, tecnologias, infraestruturas e servidores MCP autorizados no PromptCoreLabs_AEOS.

Tanto humanos quanto agentes devem consultar este catálogo antes de propor ou introduzir novas dependências tecnológicas no ecossistema.

==================================================
1. INFRAESTRUTURA DE VIRTUALIZAÇÃO E REDE
==================================================

Docker Desktop / WSL2
• Função: hospedar e isolar containers de serviços locais.
• Status: obrigatório.
• Persistência: volumes mapeados em disco local.

Tailscale
• Função: criar túnel VPN ponto-a-ponto seguro para acesso remoto e soberania de rede.
• Status: obrigatório.

PostgreSQL v17
• Função: banco de dados relacional principal.
• Status: disponível (containerizado com persistência local).

==================================================
2. ABSTRAÇÃO E GATEWAY DE IA (OMNIROUTE)
==================================================

OmniRoute (v3.5)
• Função: AI Gateway centralizado com EBITDA Shield para roteamento de tokens.
• Status: obrigatório para chamadas de IA.
• Configuração: container local conectado aos provedores.

Hierarquia de Tiers de Modelos no Gateway:
• TIER-1 (High Logic): Gemini 3.1 Pro / Claude 3.6 Sonnet (cloud).
• TIER-2 (Fast Execution): Gemini 3 Flash (cloud).
• TIER-3 (Local/Zero Cost): Qwen3-Coder-30B (LM Studio) / Gemma 3 4B (Ollama).

==================================================
3. MODELOS LOCAIS (INTERCAMBIÁVEIS)
==================================================

LM Studio
• Modelo principal: Qwen3-Coder-30B.
• Hardware alvo: GPU local (RTX 3050).
• Finalidade: coding denso e sem custo de chamadas externas.

Ollama
• Modelo principal: Gemma 3 4B.
• Finalidade: auditoria local de logs, CLI e tarefas rápidas de processamento local.

==================================================
4. ORQUESTRAÇÃO DE SQUADS (PAPERCLIP)
==================================================

PaperClip Dashboard
• Função: interface visual e motor de orquestração para squads de agentes e automações.
• Status: ativo.
• Persistência: volume local ./PaperClip-Companies.

==================================================
5. CONTEXTO E AUDITORIA (MCP SERVERS)
==================================================

NotebookLM MCP Server
• Função: ponte de integração entre o ambiente de desenvolvimento local (Execution Providers) e a base de conhecimento de auditoria do NotebookLM.
• Status: disponível.

==================================================
FONTES DE REFERÊNCIA
==================================================

PCL_INFRA_STACK_v2.md

bootstrap/environment/setup.md
