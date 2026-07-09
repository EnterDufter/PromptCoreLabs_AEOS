# METHODOLOGY PLAYBOOK — FinOps & Budget Control

==================================================
METADADOS
==================================================

| Campo | Valor |
|---|---|
| Documento | knowledge/playbooks/methodologies/finops-budget-control.md |
| Tipo | Playbook de Controladoria e Custos |
| Status | Aprovado |
| Versão | v1.0 |
| Camada | Knowledge |
| Autoridade | Financial_Advisor |

---

==================================================
1. CONTROLADORIA E GESTÃO ORÇAMENTÁRIA
==================================================

O gerenciamento financeiro de custos e despesas operacionais garante a sobrevivência e sustentabilidade da PCL.

### 📌 EBITDA Shield (Proteção de Custos de IA)
No AEOS, o consumo de chaves de API é monitorado e limitado a nível departamental:
*   **Limites de Cotas:** Cada squad de agentes possui uma cota financeira mensal em centavos cadastrada no PaperClip.
*   **Throttling:** Ao atingir 90% do limite orçamentário mensal, alertas de e-mail/inbox são gerados. Ao atingir 100%, o agente correspondente é colocado em estado `idle` ou `paused` de forma atômica no PaperClip.

---

==================================================
2. ANÁLISE DE BURN RATE
==================================================

*   **DRE (D-0):** Consolidação do faturamento bruto versus custos de infraestrutura e tokens no fechamento de cada dia.
*   **Previsão de Cash Flow:** Simulações financeiras com base no faturamento de assinaturas e taxas de conversão enviadas pelo RevOps_Architect.
