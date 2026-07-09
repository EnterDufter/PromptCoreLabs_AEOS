==================================================
OBJETIVO
==================================================

Definir o propósito, a organização e as regras de implementação para as Definições de Agentes (Agent Definitions) do PromptCoreLabs_AEOS.

==================================================
O QUE É UMA DEFINIÇÃO DE AGENTE
==================================================

Cada arquivo contido neste diretório estabelece o contrato técnico e conceitual de operação de um agente especializado:

"Quais são os limites de atuação, metas, prompts do sistema e critérios de validação para este papel?"

As definições garantem que:
• Humanos entendam a capacidade teórica e prática do agente.
• O Runtime (via PaperClip ou outros orquestradores) configure corretamente os system prompts dos modelos de linguagem.
• A camada de auditoria possa verificar se o agente operou fora de seus limites.

==================================================
AGENTES DISPONÍVEIS (SQUAD DE ENGENHARIA CORE)
==================================================

• planner.md
  Responsável pela decomposição de especificações aprovadas em planos de tarefas organizados e checklists executáveis.

• builder.md
  Responsável pela escrita de código, criação de arquivos e refatoração de acordo com as especificações.

• reviewer-qa.md
  Responsável por testar, rodar testes unitários, verificar a integridade estrutural e auditar a qualidade técnica dos artefatos produzidos.

• auditor.md
  Responsável pela validação de compliance com a Foundation e as políticas da Governance.

==================================================
AGENTES LÍDERES DE DEPARTAMENTOS (PCL CORPORATIVO)
==================================================

• strategist-one.md
  Líder do Departamento de Estratégia. Foca em planejamento estratégico, OKRs e North Star Metric.

• revops-architect.md
  Líder do Departamento de RevOps & Growth. Foca em funil GTM, CRM e conversão.

• lead-tlc-engineer.md
  Líder do Departamento de Engenharia de Sistemas. Foca em arquitetura de softwares e TLC Spec-Driven.

• neuromarketing-strategist.md
  Líder do Departamento de Percepção & Branding. Foca em storytelling, Sexy Canvas e percepção de valor.

• ciso-security-agent.md
  Líder do Departamento de DevOps & Infra. Foca em uptime, segurança de infraestrutura e LGPD.

• bizops-controller.md
  Líder do Departamento de BizOps & Agile. Foca em eficiência de processos, sprints e integração de equipes.

• data-insight-agent.md
  Líder do Departamento de Data Science & AI. Foca em analytics, machine learning e inteligência estatística.

• compliance-steward.md
  Líder do Departamento de LegalOps & Compliance. Foca em contratos, riscos regulatórios e proteção de PI.

• skills-manager.md
  Líder do Departamento de People Ops. Foca em competências, onboarding e curadoria do capital intelectual.

• financial-advisor.md
  Líder do Departamento de Back Office (FinOps). Foca em orçamento, controladoria e DRE real-time.

==================================================
COMO ESCREVER UMA DEFINIÇÃO
==================================================

Toda definição de agente deve conter:
1. OBJETIVO: o foco do agente.
2. LIMITES DE AUTONOMIA: o que ele não pode fazer.
3. CONTEXTO DE ENTRADA: quais arquivos ele consome.
4. ARTEFATOS DE SAÍDA: o que ele gera.
5. PROMPT SISTEMA RECOMENDADO: a base de personalidade e comportamento para o modelo LLM.

==================================================
FONTES DE REFERÊNCIA
==================================================

agents/README.md

governance/roles.md

governance/decision-authority.md
