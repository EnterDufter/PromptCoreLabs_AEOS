==================================================
OBJETIVO
==================================================

Definir o propósito e as diretrizes de uso do Harness Engineering (Infraestrutura Local de Execução) no módulo Runtime do PromptCoreLabs_AEOS.

O Harness é o conjunto de infraestrutura, contêineres e redes locais que permite rodar agentes e portar conhecimento com soberania de dados.

==================================================
O QUE É O HARNESS
==================================================

O Harness é a materialização física do ambiente de runtime. Ele reúne:

• Docker Desktop para virtualização e portabilidade de squads.
• Tailscale para VPN ponto-a-ponto, assegurando conexões remotas seguras.
• PostgreSQL v17 para a base de dados relacional operacional.
• Volumes persistentes mapeados localmente para proteção de propriedade intelectual.

==================================================
PRINCÍPIOS DO HARNESS
==================================================

1. Soberania de Contexto
   Dados de empresas e projetos sensíveis devem ser mantidos localmente (harness local) sempre que possível, recorrendo à cloud apenas quando aprovado por compliance.

2. Reprodutibilidade
   Qualquer desenvolvedor ou máquina de equipe deve conseguir subir exatamente a mesma infraestrutura local usando os scripts do Harness.

3. Redundância de Conexão
   O Harness suporta conexões híbridas e redundantes com provedores cloud e modelos executados localmente (fallback automático).

==================================================
DOCUMENTOS DISPONÍVEIS
==================================================

• overview.md
  Mapeamento de contêineres, portas, volumes e topologia de rede local.

• docker-compose.md
  Lista de comandos operacionais, inicialização de serviços e gerenciamento do ciclo de vida dos contêineres.

==================================================
FONTES DE REFERÊNCIA
==================================================

runtime/README.md

PCL_INFRA_STACK_v2.md
