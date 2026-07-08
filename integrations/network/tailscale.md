==================================================
OBJETIVO
==================================================

Prover o guia operacional de configuração, verificação e uso do Tailscale como rede privada do ecossistema PromptCoreLabs_AEOS.

==================================================
1. CONFIGURAÇÃO INICIAL
==================================================

Passo 1 — Instalar o Tailscale Client

Baixe e instale o cliente Tailscale na máquina host:
https://tailscale.com/download

Passo 2 — Autenticar na rede PromptCore Labs

Execute o login e siga as instruções para autenticar com a conta da organização:

tailscale up

Passo 3 — Verificar o status da conexão

Confirme que a máquina está conectada à rede privada e que o IP da rede Tailscale foi atribuído:

tailscale status
tailscale ip -4

==================================================
2. EXPOSIÇÃO CONTROLADA DE SERVIÇOS DO HARNESS
==================================================

Para que membros da equipe em máquinas remotas acessem os serviços locais do Harness:

Serviço PaperClip (Dashboard de Agentes):
http://[ip-tailscale-host]:3100

Serviço OmniRoute (Gateway de IA):
http://[ip-tailscale-host]:20130

PostgreSQL (acesso direto para diagnóstico):
[ip-tailscale-host]:5432

IMPORTANTE:
O IP do Tailscale deve ser atualizado no arquivo .env do PaperClip e do OmniRoute sempre que houver troca de máquina host.

==================================================
3. POLÍTICAS DE SEGURANÇA DE REDE
==================================================

• Apenas dispositivos autenticados na conta Tailscale da PromptCore Labs podem acessar os serviços expostos.

• A exposição de serviços não deve ser feita via IP público diretamente. Sempre use o IP da rede Tailscale.

• Revogue o acesso de dispositivos desconectados ou comprometidos pelo painel de administração do Tailscale (admin.tailscale.com).

• O banco de dados (PostgreSQL) nunca deve ser exposto via Tailscale em produção sem autenticação adicional (TLS obrigatório).

==================================================
4. VERIFICAÇÃO DE CONECTIVIDADE
==================================================

Para verificar se um serviço remoto está acessível via Tailscale:

ping [ip-tailscale-host]

Para testar a API do OmniRoute remotamente:

curl http://[ip-tailscale-host]:20130/health

==================================================
FONTES DE REFERÊNCIA
==================================================

runtime/harness/overview.md

bootstrap/environment/setup.md

foundation/governance/compliance.md
