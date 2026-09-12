# Regra de Governança: Triage Gate (Classificador de Rotas SDD) — PCL AEOS

Esta regra orienta o assistente de IA e a persona Cortex na fase de planejamento de qualquer tarefa no repositório **PromptCoreLabs_AEOS**, classificando dinamicamente o fluxo de execução em **Rota Lean (`tlc-spec-lean`)** ou **Rota Full SDD (5 Stage Gates)**.

---

## 1. Princípio Fundamental de Dual-Track SDD (Refines ADR-0007)

Toda tarefa deve possuir alinhamento prévio e especificação formal antes da alteração de código. O rito de alinhamento é dividido em duas trilhas:

- **Rota Lean (`tlc-spec-lean`)**: Para tarefas cirúrgicas, isoladas e de baixo risco. Utiliza um único documento enxuto (`.specs/lean-spec.md`).
- **Rota Full SDD (5 Stage Gates)**: Para mudanças arquiteturais, sistêmicas, de segurança ou de dados. Exige os 5 artefatos formais (`specify.md`, `design.md`, `tasks.md`, `validate.md` + ADR).

---

## 2. Matriz de Triagem e Classificação de Risco

Durante a fase de planejamento, avalie a tarefa com base na pontuação de complexidade (1 a 5):

| Pontuação | Critérios de Impacto Técnico | Rota Recomendada |
|:---:|---|:---:|
| **1 — Mínimo** | Alteração em 1 arquivo isolado (ex: fix visual, texto, log, typo). | **Rota Lean** |
| **2 — Baixo** | Refatoração interna de utilitário ou componente sem alterar contratos públicos. | **Rota Lean** |
| **3 — Médio** | Adição de novos métodos/rotas simples sem alteração de banco de dados. | **Rota Lean** (com confirmação) |
| **4 — Alto** | Alteração em esquemas de banco de dados (`pcl-db`), contêineres Docker ou APIs públicas. | **Rota Full SDD** |
| **5 — Crítico** | Alterações em segurança/Zero Trust, autenticação, DRP/backups ou compliance ISO (27001/42001). | **Rota Full SDD** |

---

## 3. Regras de Exceção e Gatilhos de Decisão Humana (Human-in-the-Loop)

O assistente **DEVE** pausar a execução e solicitar confirmação/aprovação do usuário quando:

1. **Dilema de Trade-off:** A solução via Rota Lean exigir um "quebra-galho" (gambiarra) temporário, enquanto a Rota Full SDD criar a estrutura definitiva.
2. **Impacto em Custo/Compliance:** A tarefa envolver novos custos de tokens/infraestrutura ou impacto em políticas ISO (27001/42001).
3. **Escalação de Rota (Upgrade):** Uma tarefa iniciada na Rota Lean revelar acoplamentos ocultos durante a execução. O assistente encerra a Rota Lean e solicita promoção para Rota Full SDD.
