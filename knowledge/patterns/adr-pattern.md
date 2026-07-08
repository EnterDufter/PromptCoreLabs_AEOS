==================================================
OBJETIVO
==================================================

Definir o padrão de formato (Pattern) para os Architecture Decision Records (ADR) no ecossistema PromptCoreLabs_AEOS.

Este documento funciona como o template e guia de escrita obrigatório para qualquer nova decisão de arquitetura.

==================================================
CONVENÇÃO DE NOME E LOCALIZAÇÃO
==================================================

Localização padrão:
Decisões gerais da plataforma vivem em:
foundation/architecture/decisions/ (ou no diretório especificado pelo arquiteto)

Nomenclatura do arquivo:
ADR-[NÚMERO-COM-4-DÍGITOS]-[titulo-em-kebab-case].md

Exemplo:
ADR-0001-memory-module-segregation.md

==================================================
TEMPLATE OFICIAL DE ADR
==================================================

Todo arquivo de ADR deve seguir a seguinte estrutura e preenchimento de campos:

# ADR-[NÚMERO] — [Título da Decisão]

## Metadados

| Campo | Valor |
|---|---|
| ID | ADR-[NÚMERO] |
| Status | [Proposed / Accepted / Superseded / Deprecated / Rejected] |
| Data | [AAAA-MM-DD] |
| Autor | [Nome ou Papel] |
| Aprovador | [Nome ou Papel - humano] |

---

## 1. Contexto
Descrição detalhada do cenário atual, das condições que levaram à necessidade desta decisão e dos sistemas ou módulos afetados.

## 2. Problema
Definição clara do problema técnico ou operacional que está sendo resolvido. Apresente as restrições e limitações do modelo atual.

## 3. Alternativas Consideradas
Liste as soluções alternativas avaliadas, com seus respectivos prós e contras:
• Alternativa A: [breve descrição]
  - Prós: ...
  - Contras: ...
• Alternativa B: [breve descrição]
  - Prós: ...
  - Contras: ...

## 4. Decisão
Declaração explícita da alternativa escolhida e do curso de ação a ser adotado.

## 5. Justificativa
Por que a alternativa escolhida é a melhor? Como ela se alinha com os princípios fundacionais do AEOS (Principles) e protege o EBITDA?

## 6. Consequências
Quais são os impactos da adoção desta decisão?
• Consequências Positivas: [ex: desacoplamento de RAG]
• Consequências Negativas: [ex: necessidade de novas chamadas de API]

## 7. Plano de Reversão
Como desfazer ou reverter esta decisão caso ela se mostre ineficaz ou cause impactos indesejados no Runtime.

## 8. Impacto Arquitetural
Quais outros módulos, playbooks ou diretórios do repositório precisarão ser alterados em função desta decisão.

## 9. Documentos Relacionados
• [Link para a Foundation](file:///c:/PromptCore_Labs/foundation/FOUNDATION.md)
• [Link para outro ADR](file:///c:/PromptCore_Labs/...)

==================================================
CONFORMIDADE E VALIDAÇÃO
==================================================

Aprovadores:
Apenas humanos com autoridade de arquitetura podem alterar o status de um ADR para "Accepted".

Reutilização de ID:
A numeração de IDs de ADRs deve ser estritamente sequencial. Um ID nunca deve ser reutilizado ou apagado, mesmo que a decisão seja rejeitada ("Rejected").

==================================================
FONTES DE REFERÊNCIA
==================================================

architecture/adr-process.md

governance/decision-authority.md

foundation/governance/standards.md
