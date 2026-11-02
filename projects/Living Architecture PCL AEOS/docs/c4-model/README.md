# C4 Model Specification — Living Architecture PCL AEOS v3.6

> [!IMPORTANT]
> **👔 Visão Executiva & Valor de Negócio:** Assim como o Google Maps permite alternar da visão de satélite do país até a planta de um edifício, a notação **C4 Model** permite que executivos compreendam o ecossistema estratégico no **Nível 1** e que engenheiros inspecionem contêineres, componentes e pipelines de código nos **Níveis 2 a 4**.

> [!NOTE]
> **🛠️ Visão de Engenharia & Invariantes:** Todos os modelos estruturais JSON são validados matematicamente pelo motor **`archify.mjs` (`--quality showcase`, 9/9 checks, 0 erros)** da persona `/cortex` e compilados em artefatos HTML autocontidos com SVG inline, incluindo na **v3.6** o container do **PCL Cockpit (`:3001`)** e sua esteira cognitiva de 5 fases.

---

## 1. Visão Panorâmica Multinível C4 (Padrão Cortex v7)

```mermaid
flowchart LR
    classDef l1 fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef l2 fill:#0c2340,stroke:#60a5fa,stroke-width:1.5px,color:#ffffff;
    classDef l3 fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;
    classDef l4 fill:#2e1065,stroke:#c084fc,stroke-width:1.5px,color:#ffffff;

    subgraph C4L1 ["Nível 1: System Context"]
        direction TB
        Ctx["<b>Operador, Holding & Cloud</b><br/>Fronteira Soberana PCL AEOS"]:::l1
    end

    subgraph C4L2 ["Nível 2: Containers (:Portas)"]
        direction TB
        Cock["<b>PCL Cockpit :3001 & Paperclip :3100</b><br/>Pilotagem Dual-Plex & Squads"]:::l2
        Infra["<b>OmniRoute :20130 • Laya :20140 • DB :5432</b><br/>Gateway, CPU INT8 & PGVector"]:::l2
        Cock --> Infra
    end

    subgraph C4L3 ["Nível 3: Components"]
        direction TB
        Comp["<b>Multi-Turn, Gating & RAG Engine</b><br/>Sliding Window, PII Guard & Drawer"]:::l3
    end

    subgraph C4L4 ["Nível 4: Code & Sequences"]
        direction TB
        Code["<b>Cortex Engine & Pipeline 5 Fases</b><br/> Contratos JSON, SSE & SHA-256"]:::l4
    end

    C4L1 ==>|"Zoom In"| C4L2 ==>|"Zoom In"| C4L3 ==>|"Zoom In"| C4L4
```

---

## 2. Catálogo de Modelos Estruturados (JSON) & Diagramas Interativos (HTML)

| Nível / Modalidade | Escopo Arquitetural | Especificação JSON (Fonte) | Artefato Interativo Cortex (HTML) |
| :--- | :--- | :--- | :--- |
| **C4 Level 1** | Contexto Geral do Sistema Soberano | [c4-l1-context.json](../../diagrams/c4-l1-context.json) | [c4-l1-context.html](../../diagrams/interactive/c4-l1-context.html) |
| **C4 Level 2** | Contêineres Docker & Portas Locais | [c4-l2-containers.json](../../diagrams/c4-l2-containers.json) | [c4-l2-containers.html](../../diagrams/interactive/c4-l2-containers.html) |
| **C4 Level 3** | Componentes Internos do Kernel & RAG | [c4-l3-components.json](../../diagrams/c4-l3-components.json) | [c4-l3-components.html](../../diagrams/interactive/c4-l3-components.html) |
| **C4 Level 4** | Motor Interno PCL Cortex Engine | [c4-l4-cortex-engine.json](../../diagrams/c4-l4-cortex-engine.json) | [c4-l4-cortex-engine.html](../../diagrams/interactive/c4-l4-cortex-engine.html) |
| **Sequence v3.6** | **Pipeline Cognitivo PCL Cockpit (5 Fases)** | [seq-cockpit-v36-cognitive-pipeline.json](../../diagrams/seq-cockpit-v36-cognitive-pipeline.json) | [seq-cockpit-v36-cognitive-pipeline.html](../../diagrams/interactive/seq-cockpit-v36-cognitive-pipeline.html) |
| **Sequence Laya** | Triagem NLI & Guardrails Laya CPU INT8 | [seq-laya-system-one.json](../../diagrams/seq-laya-system-one.json) | [seq-laya-system-one.html](../../diagrams/interactive/seq-laya-system-one.html) |

> 📑 **Registro de Fronteiras Canônico:**  
> A definição formal de limites entre módulos do Kernel, Cockpit e Ventures segue a norma **`PCL-AEOS-NORM-01`** (`AGENTS.md`) e o [Boundary Register Canônico](../../../pcl-aeos-harmonization/design/canonical-architecture.md).
