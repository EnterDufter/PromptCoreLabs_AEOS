==================================================
OBJETIVO
==================================================

Definir o propósito e as diretrizes para a Colaboração e Integração entre múltiplos agentes de IA no ecossistema PromptCoreLabs_AEOS.

A colaboração disciplinada impede sobreposição de funções e garante que o trabalho transicione de forma segura entre a squad de agentes.

==================================================
PRINCÍPIOS DE COLABORAÇÃO
==================================================

1. Comunicação Baseada em Contratos
   Agentes não se comunicam de forma livre ou ad-hoc. A troca de controle operacional ocorre por meio de artefatos de entrada/saída bem definidos (ex: Planner entrega tasks.md; Builder consome e entrega src/; QA consome e entrega validate.md).

2. Separação de Interesses (Segregation of Duties)
   Os agentes mantêm papéis de verificação cruzada. O Builder não pode aprovar testes ou verificar compliance do próprio código; o QA e o Auditor agem de forma independente para atestar a qualidade técnica.

3. Logs de Rastreabilidade de Transição
   Toda transição de responsabilidade operacional entre agentes deve ser registrada no histórico do ecossistema.

==================================================
ARQUIVOS DISPONÍVEIS
==================================================

• communication-protocols.md
  Especificação técnica dos protocolos de mensagem, filas e contratos de transição de tarefas entre squads de IA.

==================================================
FONTES DE REFERÊNCIA
==================================================

agents/README.md

architecture/lifecycle.md

governance/roles.md
