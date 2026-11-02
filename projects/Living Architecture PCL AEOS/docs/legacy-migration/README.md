# 🔄 DIAG-LEG-01: Legacy Migration Dataflow & Sanitização de Dados Legados (PCL AEOS v3.6)

> **Especificação Técnica do Sistema Operacional PCL AEOS**  
> **ID**: `DIAG-LEG-01` | **Categoria**: Dataflow Architecture | **Norma**: `PCL-AEOS-NORM-01`  
> **Escopo**: Sanitização UTF-8, Deduplicação SHA-256, Gating CISO e Ingestão do Acervo Legado (`legacy/` & `knowledge/cold/`)

> [!IMPORTANT]
> **👔 Visão Executiva & Valor de Negócio:** Documentos históricos valiosos não precisam ser descartados nem podem contaminar decisões atuais. O pipeline **`DIAG-LEG-01`** higieniza o acervo legado, remove segredos acidentais e classifica documentos superados (`Superseded` / `Cold Storage`), preservando a memória institucional sem induzir erros nos agentes.

> [!NOTE]
> **🛠️ Visão de Engenharia & Invariantes:** Padroniza arquivos históricos em **UTF-8 puro (NFC, zero mojibake)**, aplica deduplicação criptográfica **SHA-256**, gera vetores locais `nomic-embed-text` (`768D`) a custo `$0.00` e isola metadados `is_legacy: true` na tabela `memory.document_chunks` (`pcl-db :5432`).

---

## 1. Pipeline Panorâmico de Migração & Higienização (Padrão Cortex v7)

```mermaid
flowchart LR
    classDef legacy fill:#0f172a,stroke:#64748b,stroke-width:1.5px,color:#ffffff;
    classDef process fill:#0c2340,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef security fill:#451a03,stroke:#fbbf24,stroke-width:1.5px,color:#ffffff;
    classDef target fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;

    subgraph Source["1. Origem Legada"]
        direction TB
        L1["<b>📁 Diretório legacy/ & Histórico</b><br/>Especificações antigas .md / .json"]:::legacy
        L2["<b>🧊 Triagem Térmica (Warm vs Cold)</b><br/>Classificação Superseded / Rejected"]:::legacy
        L1 --> L2
    end

    subgraph ETL["2. Higienização & Chunking"]
        direction TB
        E1["<b>🧹 Normalização UTF-8 Puro</b><br/>Remoção de ruído e controle NFC"]:::process
        E2["<b>🔐 Deduplicação SHA-256</b><br/>Corte semântico 800–1200 chars"]:::process
        E1 --> E2
    end

    subgraph Audit["3. Barreira CISO & LGPD"]
        direction TB
        A1["<b>🛡️ Varredura Zero Secret Leak</b><br/>PII Guard LGPD & CISO RegEx"]:::security
        A2["<b>⚡ Check Contradição Laya CPU</b><br/>Evita sobrescrever specs v3.6"]:::security
        A1 --> A2
    end

    subgraph Destination["4. Persistência Soberana"]
        direction TB
        D1["<b>💾 Embeddings Locais 768D</b><br/>Ollama nomic-embed-text ($0.00)"]:::target
        D2["<b>🗄️ pcl-db :5432 (memory.*)</b><br/>Tag is_legacy: true + Git Hash"]:::target
        D1 --> D2
    end

    Source ==> ETL ==> Audit ==> Destination
```

---

## 2. Fases Determinísticas do Processo de Migração

### Fase 1: Extração, Normalização UTF-8 & Deduplicação
* **Varredura Controlada:** Mapeamento integral do diretório `legacy/` e versões superadas (ex: `PCL_COCKPIT_SPEC_V3.5.md` marcada como `Superseded`).
* **Integridade de Encoding:** Padronização estrita em UTF-8 NFC, eliminando caracteres de controle e dupla codificação.
* **Assinatura SHA-256:** Cálculo do hash por arquivo para impedir indexação duplicada.

### Fase 2: Fragmentação Semântica & Vetorização Local (`$0.00`)
* **Chunking Estruturado:** Blocos semânticos preservando cabeçalhos Markdown e tags `source_file`, `legacy_path`, `migrated_at` e `sha256_hash`.
* **Embeddings Soberanos:** Vetores densos de `768` dimensões via `nomic-embed-text` local sem envio de acervo histórico para APIs pagas.

### Fase 3: Auditoria de Governança (Stage Gate 3 & Cold Storage)
* **Sanitização CISO / LGPD:** Interceptação automática de qualquer credencial ou dado pessoal remanescente.
* **Proteção Anti-Regressão:** Todo fragmento legado recebe `is_legacy: true`, impedindo que sobreponha especificações `Approved` do `knowledge/warm/`.

---

## 3. Modelo Relacional da Migração (`memory.document_chunks`)

| Campo em `document_chunks` | Tipo SQL | Função no Dataflow Legado |
| :--- | :--- | :--- |
| `id` | `UUID` | Identificador único do fragmento migrado |
| `source_file` | `VARCHAR(512)` | Caminho original auditável em `legacy/` ou `knowledge/cold/` |
| `content` | `TEXT` | Texto higienizado em UTF-8 puro |
| `embedding` | `vector(768)` | Vetor denso local (`nomic-embed-text`) para busca por cosseno |
| `metadata` | `JSONB` | Contém `sha256`, `is_legacy: true`, `status` e `migrated_at` |

---

## 4. Artefatos Relacionados
* 🔄 **[data-legacy-migration.html](../../diagrams/interactive/data-legacy-migration.html)** — Diagrama interativo `DIAG-LEG-01`.
* 🧠 **[Módulo RAG Vetorial & Memory Dataflow v3.6](../memory-rag/README.md)** — Arquitetura completa da memória dual.
* 🧊 **[Registro Canônico de Hipóteses Descartadas](../../../../knowledge/cold/discarded_hypotheses/DISCARDED_HYPOTHESES_LOG.md)** — Cold Storage `HIP-001` a `HIP-008`.
