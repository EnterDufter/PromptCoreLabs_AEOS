==================================================
OBJETIVO
==================================================

Definir o papel e as diretrizes da integração de rede privada Tailscale no ecossistema PromptCoreLabs_AEOS.

==================================================
PAPEL DO TAILSCALE NO AEOS
==================================================

O Tailscale cria uma rede privada ponto-a-ponto (mesh VPN) baseada em WireGuard que:

• Permite acesso remoto seguro aos serviços do Harness local (PaperClip, OmniRoute) sem a necessidade de expor portas publicamente na internet.

• Possibilita que membros autorizados da equipe acessem os dashboards de agentes e o gateway de IA de qualquer localização geográfica.

• Garante soberania de dados: todo o tráfego de IA e contexto sensível permanece na rede privada do Tailscale, nunca passando por servidores públicos de terceiros.

==================================================
DOCUMENTOS DISPONÍVEIS
==================================================

• tailscale.md (este documento)
  Guia operacional de configuração e uso da integração Tailscale no AEOS.

==================================================
FONTES DE REFERÊNCIA
==================================================

integrations/README.md

runtime/harness/overview.md

bootstrap/environment/setup.md
