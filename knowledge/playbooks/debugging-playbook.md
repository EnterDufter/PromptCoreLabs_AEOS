==================================================
OBJETIVO
==================================================

Prover diretrizes operacionais de diagnóstico e resolução de falhas comuns na infraestrutura local do ecossistema PromptCoreLabs_AEOS (The Harness).

Destina-se a humanos e agentes para resolução rápida de problemas de infraestrutura e redes.

==================================================
PRÉ-REQUISITOS
==================================================

• Acesso à CLI do sistema operacional host (PowerShell ou terminal WSL/Bash).
• Permissões de administrador de rede e contêineres Docker.

==================================================
FLUXO DE DIAGNÓSTICO E RESOLUÇÃO
==================================================

Cenário A — Contêineres do PaperClip ou OmniRoute Não Iniciam

1. Verifique o status geral do serviço Docker:
   docker info

2. Liste todos os contêineres (ativos e parados):
   docker ps -a

3. Verifique se o Docker Daemon está com conflitos de porta (geralmente porta 3100 para o PaperClip ou portas de API de IA gateway):
   netstat -ano | findstr :3100

4. Se a porta estiver em uso por outro processo local, mate o processo correspondente ou edite o arquivo docker-compose.yml para remapear a porta externa.

5. Consulte os logs do contêiner que falhou:
   docker logs [container_id_ou_nome]

Cenário B — Falha na Conexão dos Modelos Locais (Ollama / LM Studio)

Se o OmniRoute ou o Execution Provider não conseguir se comunicar com as APIs locais (localhost):

1. Verifique se o Ollama está respondendo:
   curl http://localhost:11434/api/tags

2. Verifique se o LM Studio está respondendo na porta padrão 1234:
   curl http://localhost:1234/v1/models

3. Se estiver usando contêineres Docker e tentando acessar os serviços locais do host:
   • Garanta que o host de conexão configurado seja:
     http://host.docker.internal:[porta]
   • No Windows/WSL2, verifique se a flag extra-hosts do Docker Compose está definida para mapear host.docker.internal para host-gateway.

Cenário C — Problemas de Conexão Tailscale (Rede Privada)

Se outros membros da equipe ou agentes remotos não conseguirem acessar os contêineres expostos:

1. Verifique se o Tailscale está ativo:
   tailscale status

2. Verifique o IP atribuído à máquina local na rede privada:
   tailscale ip -4

3. Certifique-se de que os serviços externos apontem para o IP do Tailscale e não para localhost.

==================================================
RESOLUÇÃO DE PROBLEMAS COMUNS
==================================================

Docker sem espaço em disco:
Se os logs mostrarem falhas de gravação de arquivos ou banco de dados PostgreSQL bloqueado, limpe caches não utilizados:
docker system prune -af --volumes

Queda de desempenho de processamento local:
Caso Qwen ou Gemma demorem a responder via LM Studio/Ollama, verifique a alocação de GPU (CUDA no Windows):
nvidia-smi

==================================================
REFERÊNCIAS
==================================================

PCL_INFRA_STACK_v2.md

bootstrap/environment/setup.md
