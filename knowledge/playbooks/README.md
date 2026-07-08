==================================================
OBJETIVO
==================================================

Definir o propósito e as diretrizes para a criação e uso de Playbooks no ecossistema PromptCoreLabs_AEOS.

Playbooks representam guias procedimentais detalhados (passo a passo) para a execução de tarefas complexas e recorrentes no ambiente.

==================================================
O QUE É UM PLAYBOOK
==================================================

Diferente de um Standard (que define a regra) ou de um Protocolo (que define o contrato de entrada/saída), o Playbook descreve a execução operacional:

"Como eu faço para realizar a tarefa X de forma bem-sucedida e livre de erros?"

Os Playbooks destinam-se a:

• Guiar novos desenvolvedores e engenheiros humanos na execução de tarefas do ecossistema.
• Orientar agentes de IA em fluxos operacionais sequenciais.
• Minimizar variações na qualidade da entrega técnica.

==================================================
DIRETÓRIO DE PLAYBOOKS
==================================================

Os playbooks ativos estão organizados neste diretório:

• new-project-playbook.md
  Guia passo a passo para inicialização, estruturação e registro de novos projetos sob governança AEOS.

• debugging-playbook.md
  Guia de resolução e rastreamento de problemas técnicos no Harness (Docker, Tailscale, redes).

==================================================
COMO ESCREVER UM PLAYBOOK
==================================================

Todo novo playbook deve seguir a seguinte estrutura de seções divididas por delimitadores de linha (`===`):

1. OBJETIVO: propósito do playbook e a quem se destina.
2. PRÉ-REQUISITOS: o que deve estar instalado/configurado antes de iniciar.
3. FLUXO OPERACIONAL (PASSO A PASSO): a sequência clara de passos de execução.
4. RESOLUÇÃO DE PROBLEMAS COMUNS: como agir em casos de falha.
5. REFERÊNCIAS: documentos relacionados.

==================================================
FONTES DE REFERÊNCIA
==================================================

knowledge/README.md

foundation/governance/standards.md
