==================================================
INSTRUÇÃO DE USO
==================================================

Este é o template em branco para a etapa VALIDATE da metodologia TLC Spec-Driven v3.

Copie este arquivo para:
  .specs/projects/[nome-do-projeto]/validate.md

Pré-requisito obrigatório: a execução de todas as tarefas do tasks.md deve estar concluída antes de preencher este template.
Preencha todos os campos marcados com [PREENCHER].
Remova as instruções de uso desta seção antes de submeter para aprovação.

==================================================
METADADOS
==================================================

Tipo: Relatório de Validação e QA
Escopo: [PREENCHER — nome do recurso ou projeto]
Status: VALIDATE
Data: [PREENCHER — AAAA-MM-DD]
Versão: v0.1
Executor: [PREENCHER — nome do agente QA ou revisor humano]

==================================================
RESUMO EXECUTIVO
==================================================

Status Geral: [APROVADO / REPROVADO / APROVADO COM RESSALVAS]

[PREENCHER — breve descrição do resultado geral da validação. O que foi testado, o que passou e o que foi rejeitado.]

==================================================
CRITÉRIOS DE ACEITE — VERIFICAÇÃO POR REQUISITO
==================================================

| ID Requisito | Critério de Aceite | Status | Observação |
|---|---|---|---|
| [PREFIXO]-FR-001 | [PREENCHER — critério copiado do specify.md] | [ ] PASS / [ ] FAIL | [PREENCHER] |
| [PREFIXO]-FR-002 | [PREENCHER] | [ ] PASS / [ ] FAIL | [PREENCHER] |
| [PREFIXO]-NFR-001 | [PREENCHER] | [ ] PASS / [ ] FAIL | [PREENCHER] |
| [PREFIXO]-SEC-001 | [PREENCHER] | [ ] PASS / [ ] FAIL | [PREENCHER] |

==================================================
RESULTADOS DOS TESTES AUTOMATIZADOS
==================================================

[PREENCHER — copie ou descreva os resultados relevantes dos testes unitários, de integração e end-to-end executados.]

Suite de testes: [PREENCHER]
Cobertura: [PREENCHER]%
Testes passando: [PREENCHER]
Testes falhando: [PREENCHER]

==================================================
NÃO CONFORMIDADES E PENDÊNCIAS
==================================================

[PREENCHER — liste as falhas encontradas que precisam ser corrigidas antes da aprovação do Stage Gate.]

Não conformidade 1:
• Requisito: [PREENCHER]
• Descrição do problema: [PREENCHER]
• Ação corretiva: [PREENCHER]

==================================================
APROVAÇÃO FINAL
==================================================

Este documento deve ser assinado pelo operador humano antes de avançar para o próximo Stage Gate.

Aprovador: [PREENCHER]
Data de aprovação: [PREENCHER]
Decisão: [ ] APROVADO  [ ] REPROVADO — retornar ao Builder
