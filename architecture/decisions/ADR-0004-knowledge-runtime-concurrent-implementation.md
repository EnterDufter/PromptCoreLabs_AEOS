| Campo | Valor |
|---|---|
| ID | ADR-0004 |
| Título | Knowledge and Runtime Concurrent Implementation in Phase 3 |
| Status | Accepted |
| Data | 2026-07-08 |
| Autor | Antigravity (Google DeepMind) — sessão colaborativa |
| Aprovador | Usuário (PromptCore Labs) |

---

==================================================
1. CONTEXTO
==================================================

O mapa arquitetural do AEOS posiciona o módulo `runtime/` abaixo da camada de `agents/` no fluxo descendente. Uma leitura estrita desta hierarquia sugeriria que o runtime deveria ser documentado após a definição completa dos agentes.

No entanto, o `runtime/` do PromptCoreLabs_AEOS já existia como infraestrutura física e operacional em funcionamento (Docker, PaperClip, OmniRoute) antes mesmo da documentação arquitetural ser concluída.

==================================================
2. PROBLEMA
==================================================

Documentar o `runtime/` somente após `agents/` (seguindo a sequência hierárquica estrita) criaria um gap operacional: a infraestrutura física já em execução ficaria sem documentação por mais duas fases de implementação, aumentando o risco de inconsistência entre o que está rodando e o que está documentado.

==================================================
3. ALTERNATIVAS CONSIDERADAS
==================================================

Alternativa A — Sequência estrita por hierarquia arquitetural
• Documentar: Knowledge → Memory → Agents → Runtime → Integrations
• Prós: respeita a ordem lógica do mapa arquitetural.
• Contras: deixa o Harness (Docker, OmniRoute, PaperClip) sem documentação por mais duas fases; infra em execução sem registro formal é um risco de governança.

Alternativa B — Implementação concorrente de Knowledge + Runtime na Fase 3
• Documentar: Knowledge + Runtime em paralelo na Fase 3; Memory + Agents na Fase 4.
• Prós: elimina o gap entre infra real e documentação; agrupa de forma pragmática módulos de natureza diferente (conhecimento estático + execução física).
• Contras: quebra levemente a sequência hierárquica do mapa arquitetural.

==================================================
4. DECISÃO
==================================================

Adotar a Alternativa B: implementar o `knowledge/` e o `runtime/` de forma concorrente na Fase 3, priorizando a eliminação do gap documental da infraestrutura física em operação.

==================================================
5. JUSTIFICATIVA
==================================================

O AEOS é uma plataforma de engenharia orientada por conhecimento. Um Harness em operação sem documentação é, por definição, conhecimento implícito — exatamente o que o AEOS foi projetado para eliminar. A prioridade de documentar o que já existe supera a rigidez da sequência hierárquica.

==================================================
6. CONSEQUÊNCIAS
==================================================

Positivas:
• O Harness Engineering (Docker, OmniRoute, PaperClip) passou a ter documentação formal e auditável desde a Fase 3.
• A sequência de fases resultante (Knowledge+Runtime → Memory+Agents → Templates+Integrations) provou-se coerente e eficiente.

Negativas / Trade-offs:
• A sequência de fases do projeto não seguiu rigidamente a hierarquia do mapa arquitetural, o que pode gerar confusão em auditorias futuras sem a leitura deste ADR.

==================================================
7. PLANO DE REVERSÃO
==================================================

Esta decisão diz respeito apenas à ordem de documentação das fases, não à estrutura arquitetural. Não requer plano de reversão estrutural.

==================================================
8. IMPACTO ARQUITETURAL
==================================================

• `knowledge/` — criado na Fase 3.
• `runtime/` — criado na Fase 3 (concorrente).
• `architecture/decisions/` — este ADR documenta a justificativa.

==================================================
9. DOCUMENTOS RELACIONADOS
==================================================

• architecture/architecture-map.md
• knowledge/README.md
• runtime/README.md
