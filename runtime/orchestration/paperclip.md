==================================================
OBJETIVO
==================================================

Descrever a integração, os fluxos operacionais e o gerenciamento de squads de agentes na plataforma PaperClip dentro do PromptCoreLabs_AEOS.

==================================================
PAPERCLIP COMO ORQUESTRADOR
==================================================

O PaperClip atua como o motor de orquestração de squads de agentes da PromptCore Labs. Ele é implantado via Docker como serviço `pcl-paperclip` e se conecta ao banco relacional `pcl-db` para persistir dados de tarefas e sessões.

Principais Responsabilidades:
• Hospedar a interface de acompanhamento visual de tarefas.
• Gerenciar o ciclo de vida de squads de agentes.
• Encaminhar requisições de prompts de agentes para o OmniRoute Gateway.

==================================================
SQUADS E PAPÉIS NO PAPERCLIP
==================================================

Os agentes configurados no PaperClip cooperam em squads estruturados:

• Strategist (Estratégia)
  Analisa os objetivos de negócios do usuário e propõe iniciativas gerais.

• Tech Lead (Liderança Técnica)
  Verifica se a iniciativa segue a governança do AEOS, alinha especificações e cria tarefas no specify.md/design.md.

• Builder/Developer (Implementador)
  Escreve códigos e cria arquivos conforme as especificações aprovadas.

• Reviewer/QA (Validador)
  Testa e avalia a qualidade do código entregue pelo Builder contra os critérios de aceitação.

==================================================
INTEGRAÇÃO COM O OMNIROUTE
==================================================

Todas as requisições de agentes no PaperClip utilizam o OmniRoute Gateway para abstração de modelos e aplicação do EBITDA Shield:

• Variável de ambiente configurada no container:
  OMNI_ROUTE_URL=http://omniroute:20130
• O PaperClip envia metadados de identificação do agente para que o OmniRoute aplique as regras de tiers adequadas (ex: forçar Builder a usar TIER-2 Flash).

==================================================
PERSISTÊNCIA E SOBERANIA DE DADOS
==================================================

O PaperClip é executado com mapeamento de volume físico:

./PaperClip-Companies:/app/companies

Isso garante que toda a estrutura de squads, histórico de sessões e dados sensíveis de clientes ou empresas permaneçam sob soberania física do desenvolvedor, nunca sendo salvos exclusivamente na nuvem ou dentro da memória efêmera do contêiner.

==================================================
FONTES DE REFERÊNCIA
==================================================

PCL_INFRA_STACK_v2.md

runtime/harness/overview.md

docker-compose.yml
