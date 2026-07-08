==================================================
OBJETIVO
==================================================

Definir os protocolos lógicos de comunicação, transições de estado de tarefas e contratos de intercâmbio de contexto entre squads de agentes de IA no PromptCoreLabs_AEOS.

==================================================
1. FLUXO DE TRANSIÇÃO DE TAREFA (CYCLE-FLOW)
==================================================

O fluxo de tarefas no ecossistema segue uma ordem de controle estrita orientada por papéis:

[ Novo Requisito ]
        │
        ▼
   [ Planner ] ──► (Cria task em tasks.md)
        │
        ▼
   [ Builder ] ──► (Implementa e cria testes)
        │
        ▼
     [ QA ]    ──► (Executa testes e valida critérios de aceite)
        │
        ▼
  [ Auditor ]  ──► (Valida compliance arquitetural)
        │
        ▼
[ Operador Humano ] ──► (Valida e assina Stage Gate final)

==================================================
2. PROTOCOLO DE MENSAGENS E PAYLOAD (JSON)
==================================================

Quando orquestrados de forma automatizada pelo PaperClip ou através de filas no Runtime, a passagem de controle entre agentes utiliza o seguinte formato de payload estruturado:

```json
{
  "message_id": "UUID-da-mensagem",
  "timestamp": "ISO-8601",
  "project_id": "slug-do-projeto",
  "sender": {
    "agent_role": "Builder",
    "agent_id": "UUID-builder-instancia"
  },
  "receiver": {
    "agent_role": "QA",
    "agent_id": "UUID-qa-instancia"
  },
  "context": {
    "task_id": "ID-requisito-associado",
    "modified_files": ["src/module.js", "tests/module.test.js"],
    "state_file_path": ".specs/projects/slug-do-projeto/STATE.md"
  },
  "payload": {
    "action": "REQUEST_VALIDATION",
    "notes": "Funcionalidade implementada e testes unitários criados."
  }
}
```

==================================================
3. CONTRATO DE REJEIÇÃO E REMEDIAÇÃO
==================================================

Se o agente QA ou Auditor rejeitar a entrega de um Builder:
1. O agente validador deve emitir uma mensagem com ação `REJECT_TASK`.
2. O payload deve conter a lista exata de falhas de asserção (ex: "Teste unitário X falhou" ou "Arquivo criado fora do repository-structure.md").
3. A tarefa no `tasks.md` volta para o estado pendente e o controle é devolvido ao Builder para remediação.

==================================================
FONTES DE REFERÊNCIA
==================================================

bootstrap/project/project-handoff.md

runtime/orchestration/paperclip.md

governance/stage-gates.md
