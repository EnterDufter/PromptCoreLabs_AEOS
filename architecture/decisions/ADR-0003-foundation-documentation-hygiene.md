| Campo | Valor |
|---|---|
| ID | ADR-0003 |
| Título | Foundation Documentation Hygiene v1.0 |
| Status | Accepted |
| Data | 2026-07-08 |
| Autor | Antigravity (Google DeepMind) — sessão colaborativa |
| Aprovador | Usuário (PromptCore Labs) |

---

==================================================
1. CONTEXTO
==================================================

Os documentos fundacionais do PromptCoreLabs_AEOS foram gerados inicialmente com o auxílio de Execution Providers e modelos LLM durante sessões de criação de conteúdo. Durante esse processo, metadados de prompt e instruções de geração foram inadvertidamente incorporados ao conteúdo dos arquivos como texto permanente.

Exemplos do problema identificado: cabeçalhos como "Você é um arquiteto de IA responsável por...", rodapés com "Gere o próximo documento seguindo este padrão..." e delimitadores de instrução embebidos em arquivos Markdown de governança.

==================================================
2. PROBLEMA
==================================================

A presença de textos residuais de prompt nos documentos da Foundation gerava riscos concretos:

• Execution Providers futuros poderiam interpretar as instruções de prompt residuais como regras normativas permanentes da plataforma, alterando seu comportamento de forma não intencional.

• A auditoria de conformidade se tornava imprecisa, pois o conteúdo normativo estava misturado com artefatos de geração.

• A credibilidade dos documentos enquanto Fonte Oficial de Verdade era comprometida.

==================================================
3. ALTERNATIVAS CONSIDERADAS
==================================================

Alternativa A — Manter os textos residuais e adicionar uma nota explicativa
• Prós: menor esforço imediato.
• Contras: não resolve o problema; riscos de má-interpretação por agentes persistem.

Alternativa B — Limpeza completa e definitiva de todos os arquivos fundacionais
• Prós: elimina o risco de má-interpretação; garante que a Foundation seja uma Fonte de Verdade limpa e auditável; não requer esforço incremental futuro.
• Contras: requer leitura e edição manual ou assistida de todos os arquivos fundacionais.

==================================================
4. DECISÃO
==================================================

Adotar a Alternativa B: executar limpeza completa e definitiva de todos os textos residuais de prompt em todos os documentos da Foundation, Governance e Architecture, estabelecendo a versão resultante como Foundation v1.0.

==================================================
5. JUSTIFICATIVA
==================================================

O princípio de **Rastreabilidade** e **Integridade de Conhecimento** da Foundation exige que qualquer documento que sirva como Fonte Oficial de Verdade seja limpo, não ambíguo e livre de artefatos de geração. A higiene documental é condição necessária para que agentes operem com confiança dentro dos limites do ecossistema.

==================================================
6. CONSEQUÊNCIAS
==================================================

Positivas:
• Foundation v1.0 é uma base limpa, confiável e sem ambiguidades interpretativas.
• O risco de comportamento não intencional de Execution Providers futuros é eliminado.
• A auditoria de compliance pode operar sobre documentos puros.

Negativas / Trade-offs:
• Exigiu revisão manual de 8+ arquivos. Risco de exclusão acidental de conteúdo (materializado: frase "Compliance não cria regras." foi removida acidentalmente e restaurada pelo usuário).

==================================================
7. PLANO DE REVERSÃO
==================================================

O histórico Git preserva a versão anterior de cada arquivo. Se algum conteúdo normativo importante for identificado como removido incorretamente, restaurar via `git checkout [hash] -- [arquivo]`.

==================================================
8. IMPACTO ARQUITETURAL
==================================================

Todos os arquivos fundacionais foram afetados:
• `foundation/FOUNDATION.md`
• `foundation/governance/standards.md`
• `foundation/governance/compliance.md`
• `governance/governance.md`
• `governance/decision-authority.md`
• `governance/roles.md`
• `governance/stage-gates.md`
• `governance/policies.md`

==================================================
9. DOCUMENTOS RELACIONADOS
==================================================

• foundation/FOUNDATION.md
• foundation/governance/compliance.md
• foundation/governance/standards.md
• architecture/principles.md
