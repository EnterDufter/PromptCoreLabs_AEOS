# ARCHITECTURE — ADR Process

## Metadados

| Campo | Valor |
|--------|-------|
| Documento | architecture/adr-process.md |
| Tipo | Documento Arquitetural Fundacional |
| Status | Aprovado pelo Usuário |
| Versão | 1.0 |
| Camada | Architecture |
| Autoridade | Fonte Oficial de Verdade |

---

# Objetivo

Definir como decisões arquiteturais permanentes deverão ser registradas no PromptCoreLabs_AEOS.

Architecture Decision Records (ADR) representam a memória oficial das decisões estruturais da plataforma.

Seu propósito não é registrar histórico de implementação, mas preservar o racional arquitetural que motivou cada decisão.

---

# Quando criar um ADR

Um ADR deverá ser criado quando uma decisão:

- alterar módulos da arquitetura;
- alterar princípios fundacionais;
- introduzir novas capacidades permanentes;
- modificar responsabilidades entre camadas;
- criar dependência estrutural;
- impactar múltiplos projetos;
- modificar a estratégia de Runtime, Memory, Knowledge ou Governance.

---

# Quando NÃO criar um ADR

Não registrar ADR para:

- correções de bugs;
- ajustes de implementação;
- troca de bibliotecas equivalentes;
- configurações locais;
- experimentos temporários;
- mudanças sem impacto arquitetural.

---

# Estrutura Oficial

Todo ADR deverá conter:

1. Identificador
2. Título
3. Status
4. Contexto
5. Problema
6. Alternativas consideradas
7. Decisão
8. Justificativa
9. Consequências
10. Plano de reversão
11. Impacto arquitetural
12. Documentos relacionados

---

# Estados

Um ADR poderá assumir apenas um dos estados abaixo:

- Proposed
- Accepted
- Superseded
- Deprecated
- Rejected

Nenhum outro estado deverá ser utilizado.

---

# Convenção de Identificação

Os arquivos deverão seguir:

```
ADR-0001-short-title.md
ADR-0002-short-title.md
ADR-0003-short-title.md
```

A numeração nunca deverá ser reutilizada.

---

# Relação com outros documentos

Todo ADR deverá referenciar:

- Vision
- Principles
- Decision Framework
- Modules afetados

Sempre que possível deverá indicar também as Specifications relacionadas.

---

# Imutabilidade

Um ADR aceito representa um registro histórico.

Seu conteúdo não deverá ser reescrito.

Caso uma decisão seja alterada futuramente, deverá ser criado um novo ADR que substitua o anterior.

---

# Papel dos Agentes

Agentes podem:

- sugerir ADRs;
- preencher templates;
- identificar conflitos.

Agentes não podem aprovar ADRs.

A aprovação pertence ao responsável pela arquitetura.

---

# Estado Arquitetural

Este documento estabelece o processo oficial para criação e manutenção de Architecture Decision Records do PromptCoreLabs_AEOS.
