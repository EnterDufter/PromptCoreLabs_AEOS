# Registros de Decisões Arquiteturais (ADRs) — PCL AEOS

==================================================
1. VISÃO GERAL DOS ADRS
==================================================

Os **Architecture Decision Records (ADRs)** registram todas as decisões arquiteturais permanentes que alteram a estrutura, módulos, princípios, governança e escolhas tecnológicas da plataforma **PromptCoreLabs_AEOS**.

Cada ADR é imutável: uma decisão aceita nunca é excluída, apenas substituída por uma decisão posterior (`Superseded`) se os requisitos mudarem.

---

## 2. REGRAS DE CONVENÇÃO E GOVERNANÇA

- **Formato do Arquivo**: `ADR-[4-DÍGITOS]-[titulo-em-kebab-case].md`
- **Ciclo de Vida do Status**:
  - `Proposed` — Em análise pelo arquiteto / persona Cortex.
  - `Accepted` — Decisão aprovada e em vigor no PCL AEOS.
  - `Superseded` — Substituído por uma decisão mais recente.
  - `Deprecated` — Obsoleto por mudança de paradigma.
  - `Rejected` — Recusado após avaliação técnica.

---

## 3. CATÁLOGO COMPLETO DE DECISÕES ARQUITETURAIS (ADR-0001 A ADR-0007)

| ID | Título da Decisão Arquitetural | Status | Data | Impacto Principal |
|---|---|---|---|---|
| **ADR-0001** | Segregação do Módulo Memory do Módulo Knowledge | **Accepted** | 2026-07-08 | Separação entre documentação legível por humanos (`knowledge/`) e banco vetorial/embeddings (`memory/`). |
| **ADR-0002** | Bootstrap como Ponto de Entrada Oficial de Primeiro Nível | **Accepted** | 2026-07-08 | Padronização de onboarding e instanciação Spec-Driven via diretório `bootstrap/`. |
| **ADR-0003** | Higiene da Documentação Constitucional da Foundation v1.0 | **Accepted** | 2026-07-08 | Estabelecimento do `FOUNDATION.md` como constituição imutável da plataforma. |
| **ADR-0004** | Implementação Concorrente de Knowledge e Runtime | **Accepted** | 2026-07-08 | Paralelismo na construção de playbooks e contêineres do Harness local. |
| **ADR-0005** | Unificação do AI Gateway via OmniRoute no Harness | **Accepted** | 2026-07-15 | Proxy unificado de inferência (porta `:20130`), prompt caching e fallback dinâmico. |
| **ADR-0006** | Adoção do Cortex Archify CLI para Living Architecture | **Accepted** | 2026-07-25 | Motor visual `archify.mjs` para validação e compilação de diagramas interativos HTML. |
| **ADR-0007** | Metodologia Governança TLC Spec-Driven v3 & 5 Stage Gates | **Accepted** | 2026-07-30 | Exigência da suíte `.specs/` (`specify.md`, `design.md`, `tasks.md`, `validate.md`) para todo projeto. |

---

## 4. DETALHAMENTO DAS DECISÕES CHAVE

### 📍 **ADR-0001: Memory vs. Knowledge Segregation**
- **Contexto**: Evitar acoplamento entre a documentação em markdown estático e o armazenamento vetorial de embeddings (PGVector no PostgreSQL).
- **Justificativa**: Alta coesão e independência tecnológica. Permitir troca do motor de busca vetorial sem alterar a documentação.

### 📍 **ADR-0005: OmniRoute AI Gateway Unification**
- **Contexto**: Necessidade de controlar custos de token, latência e disponibilidade entre modelos locais (Ollama/LM Studio) e Cloud (Gemini/Claude).
- **Justificativa**: EBITDA Shield (cache de prompt), fallback automático sem quebrar a sessão do agente e auditoria centralizada.

### 📍 **ADR-0006: Cortex Archify CLI & Living Architecture**
- **Contexto**: Documentações em imagem estática se tornam obsoletas rapidamente.
- **Justificativa**: Renderização visual dinâmica 100% soberana em HTML interativo autocontido com SVG inline e validação de regras de composição em tempo de build.

### 📍 **ADR-0007: TLC Spec-Driven v3 Governance**
- **Contexto**: Prevenção de escrita direta de código de produção sem alinhamento de escopo, design e validação QA.
- **Justificativa**: Disciplinaridade atômica via 5 Stage Gates sequenciais e rastreabilidade bidirecional.
