==================================================
OBJETIVO
==================================================

Descrever a integração, os fluxos operacionais, o gerenciamento de squads de agentes e a disciplina PCL Cortex Micro-Loop na plataforma PaperClip dentro do PromptCoreLabs_AEOS.

==================================================
PAPERCLIP COMO ORQUESTRADOR
==================================================

O PaperClip atua como o motor de orquestração de squads de agentes da PromptCore Labs. Ele é implantado via Docker como serviço `pcl-paperclip` e se conecta ao banco relacional `pcl-db` para persistir dados de tarefas e sessões.

Principais Responsabilidades:
• Hospedar a interface de acompanhamento visual de tarefas.
• Gerenciar o ciclo de vida de squads de agentes.
• Encaminhar requisições de prompts de agentes para o OmniRoute Gateway.
• Executar a micro-disciplina PCL Cortex Micro-Loop nas tarefas atômicas dos squads.

==================================================
SQUADS E PAPÉIS NO PAPERCLIP
==================================================

Os agentes configurados no PaperClip cooperam em squads estruturados alinhados às especificações de papéis do AEOS:

• Strategist (Estratégia)
  Analisa os objetivos de negócios do usuário e propõe iniciativas gerais (`strategist-one.md`).

• Tech Lead / Planner (Liderança Técnica)
  Verifica se a iniciativa segue a governança do AEOS, alinha especificações e cria tarefas no specify.md/design.md (`planner.md`).

• Builder/Developer (Implementador)
  Escreve código fonte e realiza alterações cirúrgicas respeitando o limite de 3 retentativas (`builder.md`).

• Reviewer/QA (Validador & Auditor Adversário)
  Testa e avalia a qualidade do código entregue pelo Builder, inspecionando diffs contra fraude (*reward hacking*) e emitindo vereditos no validate.md (`reviewer-qa.md`).

==================================================
INTEGRAÇÃO COM O OMNIROUTE & PCL CORTEX MICRO-LOOP
==================================================

Todas as requisições de agentes no PaperClip utilizam o OmniRoute Gateway para abstração de modelos, aplicação do EBITDA Shield e roteamento por Tiers:

• Variável de ambiente configurada no container:
  OMNI_ROUTE_URL=http://omniroute:20130

• Mapeamento de Tiers por Papel e Etapa:
  - Strategist / Tech Lead (Fase Specify/Design): TIER-1 (Cloud High Logic - Claude 3.5 Sonnet / Gemini 3.1 Pro).
  - Builder (Fase Execute): TIER-2 (Cloud Fast Execution - Gemini 3 Flash / GPT-4o-mini).
  - Reviewer/QA & Micro-Loop Evidence/Trivial Gate: TIER-3 (Cloud Fast Fallback - Gemini 3 Flash / GPT-4o-mini).

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

knowledge/patterns/pcl-cortex-micro-loop.md

runtime/models/routing.md

docker-compose.yml
