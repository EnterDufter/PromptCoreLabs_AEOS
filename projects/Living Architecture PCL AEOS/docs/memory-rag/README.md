# Módulo RAG Vetorial & Memory Dataflow — PCL AEOS

==================================================
1. ARQUITETURA DA MEMÓRIA ORGANIZACIONAL
==================================================

O módulo **Memory** do **PromptCoreLabs_AEOS** é a camada responsável pela persistência computacional, indexação vetorial, gerenciamento de contexto e cache semântico de toda a plataforma.

Ao contrário do módulo `knowledge/` (que armazena documentação legível por humanos em markdown estático), o módulo `memory/` armazena e consulta índices vetoriais, embeddings e métricas legíveis por máquinas e interpretados por agentes de IA via **RAG (Retrieval-Augmented Generation)**.

## 1.1. ARQUITETURA DE MEMÓRIA TRIPARTIDA DA PROMPCORE LABS

A inteligência operacional do **PCL-AEOS** opera sobre uma estrutura de memória tripartida e multi-temporal:

```mermaid
graph TD
    classDef shortM fill:#131b2e,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef medM fill:#0f172a,stroke:#34d399,stroke-width:2px,color:#fff;
    classDef longM fill:#1e1b4b,stroke:#c084fc,stroke-width:2px,color:#fff;
    classDef db fill:#312e81,stroke:#a855f7,stroke-width:1.5px,color:#fff;

    subgraph L1["1. Memória de Curto Prazo (Sessão & Runtime)"]
        direction LR
        S1["Active Agent Context<br/><i>(Conversa & Prompt)</i>"]:::shortM
        S2["Sub-Agent Scratchpads<br/><i>(Execução Temporária)</i>"]:::shortM
        S3["OmniRoute Prompt Cache<br/><i>(Cache de KV-Tokens)</i>"]:::shortM
    end

    subgraph L2["2. Memória de Médio Prazo (PGVector RAG Semântico)"]
        direction LR
        M1["Markdown Docs & ADRs<br/><i>(specify.md, design.md)</i>"]:::medM
        M2["Vector Embeddings<br/><i>(768D / nomic-embed-text)</i>"]:::medM
        M3["Cosine Similarity Search<br/><i>(pgvector <=> HNSW)</i>"]:::medM
    end

    subgraph L3["3. Memória de Longo Prazo (Estado & Governança)"]
        direction LR
        H1["Paperclip Sprint History<br/><i>(COMPANY.md :3100)</i>"]:::longM
        H2["FOUNDATION.md & Rules<br/><i>(Regras Constitucionais)</i>"]:::longM
        H3["Constitutional STATE.md<br/><i>(Assinaturas de Gates)</i>"]:::longM
    end

    subgraph DB["Base de Dados Relacional & Vetorial (pcl-db PostgreSQL :5432)"]
        T1[("Tabela documents")]:::db
        T2[("Tabela document_chunks")]:::db
        T3[("Tabela embeddings (pgvector)")]:::db
        T4[("Tabela execution_memory_logs")]:::db
    end

    L1 -->|Flush & Summarize| L2
    L2 -->|Persistência no Banco| DB
    L3 -->|Governança & Veto| L1
```

### Matriz Comparativa das Camadas de Memória

| Camada | Escopo | Retenção / Vida Útil | Latência | Tecnologia / Repositório |
|---|---|---|---|---|
| **Curto Prazo** | Contexto ativo do agente durante a tarefa | Duração da sessão (`< 1h`) | `< 10ms` | Memory Buffer / OmniRoute KV-Cache |
| **Médio Prazo** | Conhecimento semântico do projeto (RAG) | Duração do ciclo de vida do repositório | `< 150ms` | PGVector (PostgreSQL 17 :5432) |
| **Longo Prazo** | Histórico executivo, ADRs e Constituição | Permanente (Imutável) | `< 50ms` | Paperclip (`COMPANY.md`), `STATE.md`, Git |

---

## 2. PIPELINE DE RAG LOCAL & BUSCA VETORIAL

```mermaid
graph TD
    subgraph IngestionPipeline["1. Ingestão & Chunking"]
        SRC["Módulos Markdown (.md)"] --> PARSE["Context Parser & Hashing"]
        PARSE --> CHUNK["Chunking Inteligente (800-1200 chars, overlap 150-200)"]
    end

    subgraph EmbeddingPipeline["2. Geração de Embeddings & Banco"]
        CHUNK --> EMBED["Ollama API / nomic-embed-text (768 dimensões)"]
        EMBED --> PG["PostgreSQL 17 / pcl-db (Extensão pgvector)"]
    end

    subgraph RetrievalPipeline["3. Consulta & Injeção de Contexto"]
        USER["Prompt do Agente"] --> SIM["Search Cosseno / HNSW Index"]
        PG --> SIM
        SIM --> CTX["Payload de Contexto Enriquecido"]
        CTX --> OMNI["OmniRoute AI Gateway (:20130)"]
        OMNI --> LLM["Modelo de Linguagem (Cloud / GPU Local)"]
    end

    IngestionPipeline --> EmbeddingPipeline
    EmbeddingPipeline --> RetrievalPipeline
```

---

## 3. ESPECIFICAÇÃO DE CHUNKING & REGRAS DE INDEXAÇÃO

### Regras de Segmentação de Texto
- **Tamanho do Chunk**: 800 a 1200 caracteres (~200 a 300 tokens por fatia).
- **Sobreposição (Overlap)**: 150 a 200 caracteres para preservação de contexto contíguo.
- **Divisão Semântica**: Respeita a estrutura do documento utilizando delimitadores de linha (`===`) ou títulos Markdown (`#`, `##`, `###`).

### Estrutura de Payload e Metadados do Vetor (`JSONB`)
Cada vetor armazenado no `pcl-db` contém a seguinte estrutura de metadados obrigatórios:

```json
{
  "source_file": "foundation/FOUNDATION.md",
  "section": "1. PRINCÍPIOS FUNDAMENTAIS",
  "last_modified": "2026-07-30T21:40:00Z",
  "taxonomy": "AEOS",
  "layer": "Foundation",
  "sha_commit": "a1b2c3d4e5f67890",
  "tokens": 245
}
```

---

## 4. INFRAESTRUTURA DE BANCO VETORIAL (`pcl-db`)

A persistência vetorial roda dentro do contêiner Docker `pcl-db` (PostgreSQL 17 com extensão `pgvector` habilitada):

- **Porta do Banco**: `5432`
- **Banco de Dados**: `paperclip`
- **Tabela de Vetores**: `document_chunks`
- **Tabela de Logs e Telemetria**: `agent_execution_logs`
- **Algoritmo de Similaridade**: Distância por Cosseno (`<=>`)
- **Aceleração de Índice**: Índice HNSW (`m=16`, `ef_construction=64`)

### Tabela Relacional E-R (`document_chunks` & `agent_execution_logs`)

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

## 5. INTEGRAÇÃO COM OS DIAGRAMAS INTERATIVOS
Este módulo refere-se diretamente aos diagramas do Portal Mestre:
- 🟡 **[data-rag-memory.html](file:///c:/PromptCore_Labs/projects/Living%20Architecture%20PCL%20AEOS/diagrams/interactive/data-rag-memory.html)**: Lineage do pipeline de ingestão e busca vetorial RAG.
- 🔄 **[data-legacy-migration.html](file:///c:/PromptCore_Labs/projects/Living%20Architecture%20PCL%20AEOS/diagrams/interactive/data-legacy-migration.html)**: Dataflow de sanitização e migração do acervo legado (Ver **[Documentação de Migração Legada](../legacy-migration/README.md)**).
- 💜 **[obs-audit-trail.html](file:///c:/PromptCore_Labs/projects/Living%20Architecture%20PCL%20AEOS/diagrams/interactive/obs-audit-trail.html)**: Coleta de logs de execução e métricas de tokens no `pcl-db`.
