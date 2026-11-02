# Módulo RAG Vetorial, Memória Multi-Turn & Memory Dataflow — PCL AEOS v3.6

> ℹ️ **Documentação de Migração Legada (`DIAG-LEG-01`):** Para consultar a especificação de sanitização e migração do acervo `legacy/`, [abra o artigo oficial de Migração Legada](../legacy-migration/README.md).

> [!IMPORTANT]
> **👔 Visão Executiva & Valor de Negócio:** A arquitetura de memória **v3.6** resolve definitivamente os dois maiores gargalos de assistentes corporativos: a **amnésia entre perguntas** e a **alucinação por documentos irrelevantes**. O resultado foi comprovado no benchmark cego oficial (**4.95 / 5.0**), operando com banco vetorial próprio a **`$0.00`/mês** e referências organizadas em pílula retrátil limpa.

> [!NOTE]
> **🛠️ Visão de Engenharia & Invariantes:** Articula o **Modelo Temporal Operacional** (`Sliding Window Multi-Turn` + schema `memory.*` no PostgreSQL 17 `PGVector 768D HNSW`) com o **Modelo Físico de Governança RAG** (`knowledge/warm/`, `cold/`, `learnings/`), filtrados em `~20ms` pelo coprocessador **Laya CPU INT8 (`0 MB VRAM`, `score >= 0.40`)** sob `ADR-0005` e `ADR-0007`.

---

## 1. Clarificação Canônica v3.6: Modelo Temporal (`memory.*`) vs. Governança Física (`knowledge/`)

1. **Modelo Temporal Operacional (Runtime & Banco `memory.*`):** Governa o ciclo de vida dinâmico da informação em execução — **Curto Prazo** (*Sliding Window Multi-Turn* com resolução anafórica e KV-Cache), **Médio Prazo** (vetores `768D` `nomic-embed-text` e claims `Tiers 1–4` no PGVector) e **Longo Prazo** (recibos SHA-256, `STATE.md` e snapshots AES-256 no Cloudflare R2).
2. **Modelo Físico de Governança RAG (`knowledge/`):** Estrutura declarativa versionada em Git para consulta humana e indexação determinística (`#documentos`) — **Warm Storage** (`PCL_COCKPIT_SPEC_V3.6.md`, `ADR-0007.md`, Matriz Competitiva), **Cold Storage** (`HIP-001` a `HIP-008` descartadas) e **Learnings** (`AGENTS.md`).

### Arquitetura Panorâmica das Camadas de Memória (Padrão Cortex v7)

```mermaid
flowchart LR
    classDef shortM fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef gateM fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;
    classDef medM fill:#0c2340,stroke:#60a5fa,stroke-width:1.5px,color:#ffffff;
    classDef longM fill:#2e1065,stroke:#c084fc,stroke-width:1.5px,color:#ffffff;

    subgraph L1["1. Curto Prazo (Sessão v3.6)"]
        direction TB
        S1["<b>Sliding Window Multi-Turn</b><br/>Histórico contíguo & anáfora (:3001)"]:::shortM
        S2["<b>EBITDA Shield Prompt Cache</b><br/>Hashes semânticos & KV-Tokens"]:::shortM
        S1 --> S2
    end

    subgraph LG["2. Sensor Sistema 1 (CPU)"]
        direction TB
        G1["<b>Laya Intention & RAG Gate</b><br/>ONNX INT8 • 0 MB VRAM (~20ms)"]:::gateM
        G2["<b>Filtro Relevância >= 0.40</b><br/>Zero poluição em chat conceitual"]:::gateM
        G1 --> G2
    end

    subgraph L2["3. Médio Prazo (PGVector & Warm)"]
        direction TB
        M1["<b>Acervo knowledge/warm & cold</b><br/>Specs v3.6, ADRs & Anti-Patterns"]:::medM
        M2["<b>pcl-db :5432 (memory.*)</b><br/>Embeddings 768D HNSW & Claims"]:::medM
        M1 --> M2
    end

    subgraph L3["4. Longo Prazo & Prova Imutável"]
        direction TB
        H1["<b>Evidence Receipts SHA-256</b><br/>Vínculo criptográfico Git + Pílula"]:::longM
        H2["<b>Cold Backup R2 AES-256</b><br/>DRP Tripartido (RTO = 7,18s)"]:::longM
        H1 --> H2
    end

    L1 ==> LG ==> L2 ==> L3
```

### Matriz Comparativa das Camadas de Memória

| Camada | Escopo Funcional | Retenção / Vida Útil | Latência | Tecnologia / Repositório |
| :--- | :--- | :--- | :---: | :--- |
| **Curto Prazo (v3.6)** | Contexto ativo multi-turn, anáfora e janela deslizante | Sessão ativa com orçamento contíguo `K` | `< 10ms` | Multi-Turn Buffer (`omniRouteService.ts`) |
| **Gating Sensor (Laya)** | Triagem não-autorregressiva `O(1)` de intenção e relevância | Decisão instantânea por turno | `~20ms a 35ms` | Laya System One ONNX INT8 (**`0 MB VRAM`**) |
| **Médio Prazo (RAG)** | Conhecimento semântico e normas vigentes (`warm/` + vetores) | Ciclo de vida evolutivo do monorepo | `~15ms a 120ms` | `knowledge/warm/` + PGVector (`PostgreSQL 17 :5432`) |
| **Longo Prazo & Cold** | Constituição, ADRs, hipóteses descartadas e DRP | Permanente e auditável (Imutável) | `< 50ms` / `7,18s` RTO | `knowledge/cold/`, `memory.evidence_receipts`, Cloudflare R2 |

---

## 2. Os 5 Paradigmas de RAG & Pipeline Vetorial Local (Cortex v7)

O ecossistema implementa cinco estágios complementares: **(1) Vector RAG 768D**, **(2) Hybrid Lexical+Semantic RAG**, **(3) Cross-Encoder NLI Reranking**, **(4) Temporal Graph-RAG (`claims` + `superseded_by`)** e **(5) Conditional Agentic Gated RAG (`ADR-0007`)**:

```mermaid
flowchart LR
    classDef ing fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef emb fill:#0c2340,stroke:#60a5fa,stroke-width:1.5px,color:#ffffff;
    classDef ret fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#ffffff;
    classDef out fill:#2e1065,stroke:#c084fc,stroke-width:1.5px,color:#ffffff;

    subgraph P1["1. Ingestão & Hashing"]
        direction TB
        SRC["<b>Módulos Markdown (.md)</b><br/>YAML Frontmatter + Títulos"]:::ing
        CHUNK["<b>Chunking Semântico</b><br/>800–1200 chars (overlap 150–200)"]:::ing
        SRC --> CHUNK
    end

    subgraph P2["2. Vetorização Local ($0.00)"]
        direction TB
        EMBED["<b>Ollama nomic-embed-text</b><br/>Vetores densos de 768 dimensões"]:::emb
        PG["<b>PostgreSQL 17 (pgvector)</b><br/>Índice HNSW (m=16, ef=64)"]:::emb
        EMBED --> PG
    end

    subgraph P3["3. Recuperação & Gating v3.6"]
        direction TB
        SIM["<b>Busca Híbrida + Cosseno (<=>)</b><br/>Candidatos Top-K + Filtro Status"]:::ret
        LAYA["<b>Laya NLI Rerank & Gate</b><br/>Score >= 0.40 + Check Contradição"]:::ret
        SIM --> LAYA
    end

    subgraph P4["4. Síntese Desacoplada"]
        direction TB
        GEN["<b>OmniRoute / Fast-Path / Local</b><br/>Resposta fluida sem jargão forçado"]:::out
        PILL["<b>Pílula 'Fontes Consultadas (n) v'</b><br/>Expansão sob demanda + SHA-256"]:::out
        GEN --> PILL
    end

    P1 ==> P2 ==> P3 ==> P4
```

---

## 3. Especificação de Chunking & Metadados do Vetor (`JSONB`)

* **Tamanho do Chunk:** `800` a `1200` caracteres (`~200` a `300` tokens por fatia) com *overlap* de `150` a `200` caracteres.
* **Divisão Semântica:** Respeita hierarquia Markdown (`#`, `##`, `###`) e cabeçalhos YAML Frontmatter (`status: Approved | Superseded | Rejected`).

```json
{
  "source_file": "knowledge/warm/cockpit/PCL_COCKPIT_SPEC_V3.6.md",
  "section": "2. Pipeline Cognitivo em 5 Fases",
  "kernel_version": "v3.6.0",
  "status": "Approved",
  "taxonomy": "AEOS",
  "layer": "Warm_Storage",
  "sha_commit": "89a8f6d",
  "tokens": 260
}
```

---

## 4. Infraestrutura Relacional & Vetorial (`pcl-db :5432`)

```mermaid
erDiagram
    document_chunks {
        uuid id PK
        varchar source_file
        varchar section
        timestamp last_modified
        vector_768 embedding
        jsonb metadata
    }
    agent_execution_logs {
        uuid execution_id PK
        uuid session_id
        timestamp timestamp
        varchar agent_role
        varchar status
        integer prompt_tokens
        integer completion_tokens
        jsonb metrics
    }
```

---

## 5. Integração com Diagramas Interativos

* ⚡ **[seq-cockpit-v36-cognitive-pipeline.html](../../diagrams/interactive/seq-cockpit-v36-cognitive-pipeline.html)** — Pipeline Multi-Turn, Intention Gating e Fontes Retráteis v3.6.
* 🟡 **[data-rag-memory.html](../../diagrams/interactive/data-rag-memory.html)** — Dataflow completo de ingestão e busca vetorial RAG.
* 🔄 **[data-legacy-migration.html](../../diagrams/interactive/data-legacy-migration.html)** — Pipeline de sanitização e migração do acervo legado.
* 💜 **[obs-audit-trail.html](../../diagrams/interactive/obs-audit-trail.html)** — Coleta de telemetria e recibos de auditoria no `pcl-db`.
