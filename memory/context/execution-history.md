==================================================
OBJETIVO
==================================================

Definir o padrão de formato e armazenamento para o histórico de execução de agentes (Execution History) e rastreamento de Execution Cells no PromptCoreLabs_AEOS.

==================================================
1. ARQUITETURA DE ARMAZENAMENTO DE HISTÓRICO
==================================================

O histórico de execução é persistido em duas camadas de granularidade:

Camada 1 — Relacional (Auditável/Logs Gerais):
• Salvo no banco relacional `pcl-db` (PostgreSQL) na tabela `agent_execution_logs`.
• Foco: telemetria de tokens, tempos de execução, estados de sucesso/erro e IDs de sessões.

Camada 2 — Arquivos Locais (Contexto do Repositório):
• Salvo em arquivos estruturados JSON ou Markdown na pasta de contexto do projeto.
• Foco: entradas, saídas, resumos de handoff e planos parciais que orientam o próximo prompt do agente.

==================================================
2. ESTRUTURA DO LOG OPERACIONAL (JSON)
==================================================

Cada execução de agente ou Execution Cell deve registrar o seguinte payload mínimo na base de histórico:

```json
{
  "execution_id": "UUID-v4-unico",
  "session_id": "UUID-de-sessao-comum",
  "timestamp": "ISO-8601",
  "project_id": "slug-do-projeto",
  "agent_role": "Planner | Builder | QA | Auditor",
  "execution_cell": {
    "cell_id": "ID-da-celula-executada",
    "commands": ["comando1", "comando2"]
  },
  "metrics": {
    "duration_ms": 12500,
    "tokens_in": 4500,
    "tokens_out": 850,
    "provider_cost": 0.0125
  },
  "status": "SUCCESS | FAILED | BLOCKED",
  "output_summary": "resumo textual curto do que foi gerado",
  "error_trace": "detalhamento do erro ou exceção (nulo se sucesso)"
}
```

==================================================
3. CONSOLIDAÇÃO DE HISTÓRICO EM MARKDOWN
==================================================

Ao término de marcos importantes de execução (milestones ou gates de projeto), o orquestrador do PaperClip ou o Execution Provider deve consolidar o histórico resumido diretamente no arquivo de estado do projeto:

.specs/projects/[nome-do-projeto]/STATE.md

Isso garante que o histórico de alto nível e decisões-chave fiquem integrados ao código fonte e versionados no Git, enquanto os logs granulares de chamadas permanecem na base relacional do Harness.

==================================================
FONTES DE REFERÊNCIA
==================================================

bootstrap/project/project-handoff.md

runtime/harness/overview.md

governance/stage-gates.md
