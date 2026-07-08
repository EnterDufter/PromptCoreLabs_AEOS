==================================================
OBJETIVO
==================================================

Definir o propósito e a arquitetura lógicas da camada de Contexto Persistente (Context) no módulo Memory do PromptCoreLabs_AEOS.

Esta camada gerencia o histórico de execução de agentes e transições de Execution Cells, garantindo continuidade entre sessões de trabalho.

==================================================
O QUE É CONTEXTO PERSISTENTE
==================================================

Diferente do RAG (que busca conhecimento consolidado e estático), a camada de Contexto armazena a **história viva** da execução operacional da plataforma.

A persistência de contexto responde a perguntas como:

• "O que o agente Builder fez nas últimas 5 execuções antes da sessão atual?"
• "Qual foi o log de saída exato e o resultado da validação do último Stage Gate?"
• "Como a sessão atual se conecta com o plano de tarefas aprovado?"

==================================================
ARQUIVOS DE CONTEXTO
==================================================

• execution-history.md
  Padrão, estrutura de logs e modelo de persistência para o histórico de transição de sessões de Execution Cells e squads de agentes.

==================================================
DIRETRIZES DE CONTINUIDADE
==================================================

• Registro Imediato: logs de erros críticos de agentes e resultados de execução de scripts de validação devem ser salvos na memória local imediatamente após a ocorrência.

• Independência de Sessão: a reinstalação ou troca do Execution Provider não limpa o histórico de contexto do projeto. A retomada de trabalho lê obrigatoriamente a trilha do histórico para restaurar o estado mental do agente.

==================================================
FONTES DE REFERÊNCIA
==================================================

memory/README.md

bootstrap/project/project-handoff.md

architecture/lifecycle.md
