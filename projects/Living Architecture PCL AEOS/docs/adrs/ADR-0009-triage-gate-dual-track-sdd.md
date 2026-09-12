# ADR-0009: Governança do Triage Gate e Abordagem Dual-Track SDD (Lean vs Full)

* **Status**: Accepted
* **Data**: 12/09/2026
* **Decisores**: Arquitetura PCL AEOS & Cortex Intelligence
* **Domínio**: Governança, Metodologia TLC Spec-Driven v3, Ciclo de Vida de Software
* **Refines / Extends**: ADR-0007 (Metodologia Governança TLC Spec-Driven v3 & 5 Stage Gates)

---

## 1. Contexto e Problema

A **ADR-0007** estabeleceu com sucesso a cultura Spec-Driven no ecossistema PCL AEOS através da suíte dos 5 Stage Gates (`specify.md`, `design.md`, `tasks.md`, `validate.md` + ADRs).

Contudo, para correções cirúrgicas, pequenos ajustes funcionais ou tarefas de baixo risco técnico, a exigência de gerar 5 artefatos formais completos gerava um overhead de tempo desnecessário. Fazia-se necessário introduzir um mecanismo de triagem dinâmica que mantivesse o rigor de especificação prévia do TLC v3 sem sacrificar a agilidade operacional.

---

## 2. Decisão Arquitetural

Decidiu-se pela adoção da abordagem **Dual-Track Spec-Driven Development (Dual-Track SDD)** e pela implementação do **Triage Gate (Classificador de Rotas)**:

1. **Rota Lean (`tlc-spec-lean`)**:
   * Voltada para tarefas de baixo impacto/risco.
   * Utiliza um artefato condensado em arquivo único (`.specs/templates/lean-spec-template.md`).
   * Mantém a obrigatoriedade de ter escopo delimitado, critérios de aceite e plano de verificação antes de qualquer alteração de código.

2. **Rota Full SDD (5 Stage Gates)**:
   * Mantida na íntegra conforme a **ADR-0007**.
   * Exigida para alterações em esquemas de banco de dados (`pcl-db`), infraestrutura Docker, segurança/Zero Trust ou compliance (ISO 27001 / ISO 42001).

3. **Gatilhos de Decisão Humana (Human-in-the-Loop)**:
   * A triagem é 80-90% autônoma, mas exige autorização explícita do usuário em caso de trade-off de velocidade vs arquitetura, custo/compliance ou escalação de escopo no meio da execução.

---

## 3. Consequências e Validação

* **Vantagens**:
  * **Agilidade sem Perda de Rigor**: Tarefas simples são concluídas com alta velocidade mantendo especificação e verificação prévias.
  * **Preservação da ADR-0007**: A ADR-0007 continua sendo a constituição master da governança do ecossistema.
  * **Clareza para Agentes de IA**: A regra `.agents/rules/tlc-triage-gate.md` instrui as IAs a triarem as tarefas de forma consistente e autônoma.
