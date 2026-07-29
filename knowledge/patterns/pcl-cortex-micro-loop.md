# PCL Cortex Micro-Loop & Disciplina de Execução

==================================================
METADADOS
==================================================

| Campo | Valor |
|--------|-------|
| Documento | knowledge/patterns/pcl-cortex-micro-loop.md |
| Tipo | Padrão Arquitetural de Micro-Execução |
| Núcleo | PCL Cortex |
| Status | Aprovado |
| Versão | 1.0 |
| Camada | Knowledge / Operational Patterns |

---

==================================================
1. OBJETIVO
==================================================

Estabelecer o padrão de raciocínio, execução operacional e verificação do **PCL Cortex** no nível do micro-loop dos agentes de IA.

O PCL Cortex Micro-Loop governa a disciplina atômica de cada tarefa dentro de um Execution Provider ou Squad do AEOS. Ele opera **internamente** nas tarefas de execução sem alterar a macro-governança constitucional do repositório (`FOUNDATION.md`, especificações formais em `specify.md` e a autoridade humana nos Stage Gates).

---

==================================================
2. O CICLO OPERACIONAL DO PCL CORTEX (6 ETAPAS)
==================================================

Todo agente do PCL Cortex deve seguir a seguinte sequência lógica para executar qualquer tarefa:

```text
[0. Classify & Fit Gate]
       │
       ├─ Trivial? (<10 linhas, 1 arquivo, sem mudança estrutural) ──► [Trivial Bypass (Executar + Checar + 2 Frases)]
       └─ Complexo ou Ambíguo? ────────────────────────────────────► [Exige specify.md + Plan-First]
       │
[1. Define Done] (Nomear a verificação observável antes de alterar código)
       │
[2. Bounded Evidence] (Coleta de fontes primárias com teto de buscas e RAG)
       │
[3. Surgical Act] (Edição cirúrgica atômica do código/arquivo)
       │
[4. Bounded Retries] (Máximo de 3 retentativas de correção antes de abortar)
       │
[5. Observed Verification & Adversarial Audit] (Inspecionar diffs reais e atestar funcionamento)
```

---

==================================================
3. REGRAS DETALHADAS DAS ETAPAS
==================================================

### Etapa 0 — Classificação & Fit Gate (Triagem de Complexidade)
- **Trivial Bypass**: Se a solicitação alterar apenas 1 arquivo, tiver menos de 10 linhas de modificação, não criar novas dependências ou comportamentos arquiteturais e não exigir pesquisas profundas, o agente pode agir diretamente. Deve executar a checagem óbvia e relatar o resultado em no máximo duas frases.
- **Plan-First (Macro Governança)**: Se o escopo for ambíguo, alterar arquitetura ou envolver múltiplos arquivos/módulos, o agente DEVE seguir o fluxo TLC Spec-Driven v3 (`specify.md` -> `design.md` -> `tasks.md`) e aguardar aprovação explícita.

### Etapa 1 — Define Done (Definição de Conclusão)
- Antes de modificar qualquer linha de código ou arquivo, o agente DEVE declarar explicitamente qual comando ou verificação observável comprovará o sucesso (ex: teste unitário específico, verificação de linter, chamada HTTP de status).

### Etapa 2 — Bounded Evidence (Coleta Delimitada de Evidências)
- Coletar informações de fontes primárias do repositório ou via RAG (`memory/rag`).
- **Teto de Buscas**: No máximo 2 pesquisas consecutivas sem resultados novos. Se a evidência não for encontrada em 2 tentativas, o agente deve interromper a busca e declarar incerteza.

### Etapa 3 — Surgical Act (Edição Cirúrgica Atômica)
- Toda alteração em arquivo deve ser o **menor diff correto possível**.
- Não refatorar código alheio à tarefa. Não alterar formatação de blocos não relacionados.

### Etapa 4 — Bounded Retries (Teto de Retentativas)
- Em caso de erro de compilação ou falha em testes unitários, o agente Builder pode realizar no máximo **3 ciclos de correção**.
- Se o teste falhar no 3º ciclo, o agente DEVE interromper a execução, reverter ou isolar a alteração e reportar os logs exatos ao usuário, solicitando intervenção. É proibido entrar em loops infinitos.

### Etapa 5 — Observed Verification & Adversarial Audit (Verificação Observável)
- O agente QA (`reviewer-qa.md`) deve atuar de forma adversária:
  - Re-executar os testes afirmados.
  - Inspecionar se asserções foram enfraquecidas ou desativadas (*reward hacking*).
  - Validar diffs reais contra os critérios de aceite do `specify.md`.
  - Emitir relatório formal no `validate.md` com veredicto (`VERIFIED`, `CAVEATS`, ou `REFUTED`).

---

==================================================
4. ROTEAMENTO DE MODELOS & EBITDA SHIELD
==================================================

As chamadas de micro-loop do PCL Cortex devem obrigatoriamente respeitar a hierarquia do OmniRoute Gateway:

1. **TIER-1 (High Logic - Cloud)**: Claude 3.5 Sonnet / Gemini 3.1 Pro. Usado exclusivamente para análise de arquitetura, `specify.md` e decisões estruturais.
2. **TIER-2 (Fast Execution - Cloud)**: Gemini 3 Flash / GPT-4o-mini. Usado para escrita de código pelo Builder e tarefas rápidas.
3. **TIER-3 (Local Zero Cost / Cloud Fast Fallback)**: Gemini 3 Flash / GPT-4o-mini ou modelos locais (Qwen/Gemma). Usado para coleta de evidências de micro-loop, formatação de logs e checagens adversárias do QA sem inflacionar custos de raciocínio profundo.

---

==================================================
5. FONTES DE REFERÊNCIA
==================================================

- foundation/FOUNDATION.md
- architecture/principles.md
- governance/stage-gates.md
- .specs/methodology/tlc-spec-driven-v3/specify.md
- runtime/models/routing.md
