| Campo | Valor |
|---|---|
| ID | ADR-0002 |
| Título | Bootstrap as Official First-Level Entry Point |
| Status | Accepted |
| Data | 2026-07-08 |
| Autor | Antigravity (Google DeepMind) — sessão colaborativa |
| Aprovador | Usuário (PromptCore Labs) |

---

==================================================
1. CONTEXTO
==================================================

O ecossistema AEOS possuía Foundation e Governance bem definidas, mas não havia um mecanismo formal e documentado de inicialização (bootstrapping) para novos Execution Providers, agentes, humanos colaboradores e projetos.

Cada nova sessão de trabalho dependia da memória contextual do Execution Provider ativo ou de um resumo manual fornecido pelo usuário, criando dependência de conhecimento implícito — o problema exato que o AEOS foi criado para eliminar.

==================================================
2. PROBLEMA
==================================================

Sem um módulo de bootstrap formal:

• Novos Execution Providers iniciavam sessões sem conhecer os limites de autoridade, os arquivos relevantes ou o estado atual do ecossistema.
• Não havia protocolo padronizado de handoff entre sessões, resultando em perda de contexto recorrente.
• A criação de novos projetos ocorria sem um checklist de validação ou protocolo de governança.

==================================================
3. ALTERNATIVAS CONSIDERADAS
==================================================

Alternativa A — Instruções embutidas no FOUNDATION.md
• Prós: centralização em um único documento.
• Contras: FOUNDATION.md é um documento constitucional, não operacional; misturar instruções de onboarding com princípios arquiteturais violaria o princípio de Alta Coesão.

Alternativa B — Módulo dedicado `bootstrap/` como primeiro nível operacional
• Prós: separação clara entre constituição (Foundation) e operação (Bootstrap); permite evolução independente do protocolo de onboarding; resolve o problema de handoff de forma sistêmica.
• Contras: adiciona um módulo ao repositório.

==================================================
4. DECISÃO
==================================================

Adotar a Alternativa B: criar o módulo `bootstrap/` como o ponto de entrada oficial de primeiro nível do ecossistema, posicionado entre Governance e Knowledge no fluxo arquitetural.

==================================================
5. JUSTIFICATIVA
==================================================

Esta decisão elimina diretamente a dependência de conhecimento implícito mencionada na visão do AEOS (`architecture/vision.md`). O Bootstrap formaliza o contrato de inicialização como um artefato versionável e auditável, não como conhecimento tácito de um operador humano ou sessão de agente.

==================================================
6. CONSEQUÊNCIAS
==================================================

Positivas:
• Qualquer Execution Provider pode ser inicializado corretamente apenas lendo os documentos do módulo.
• Handoffs entre sessões passam a ser formalizados com templates de mission-handoff e context-snapshot.
• A criação de novos projetos segue um protocolo governado e verificável.

Negativas / Trade-offs:
• Execution Providers precisam ser orientados a ler o Bootstrap antes de iniciar qualquer trabalho — isso requer disciplina operacional.

==================================================
7. PLANO DE REVERSÃO
==================================================

Se o módulo Bootstrap for fundido com outro módulo no futuro, um ADR posterior deve declarar ADR-0002 como Superseded e os arquivos migrados com README de redirecionamento.

==================================================
8. IMPACTO ARQUITETURAL
==================================================

• `architecture/architecture-map.md` — Bootstrap inserido na hierarquia.
• `architecture/modules.md` — Bootstrap definido como módulo oficial.
• `architecture/repository-structure.md` — diretório `bootstrap/` incluído.
• `bootstrap/` — módulo criado com 10 documentos.

==================================================
9. DOCUMENTOS RELACIONADOS
==================================================

• architecture/modules.md
• architecture/vision.md
• bootstrap/README.md
• bootstrap/onboarding/execution-provider.md
