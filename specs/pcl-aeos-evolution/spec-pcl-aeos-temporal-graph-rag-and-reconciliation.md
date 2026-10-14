# SPEC-PCL-AEOS-MEMORY-03: PCL Temporal Graph-RAG, Reconciliação Canônica e Armazenamento Soberano

**Versão:** 2.0-Blindada  
**Status:** Approved for Implementation (Ports & Adapters / PostgreSQL Schema Isolation)  
**Autor:** Forward Deployed Architecture (FDA) & Cortex Intelligence  
**Escopo:** `pcl-db` (PostgreSQL 17), `memory/`, `OmniRoute/`, `pcl-laya`  
**Padrão Arquitetural:** Hexagonal Architecture (Ports & Adapters) / Living Architecture  
**Normas de Governança:** ISO/IEC 27001 & ISO/IEC 42001 | [ADR-0005](file:///c:/PromptCore_Labs/architecture/decisions/ADR-0005-tripartite-memory-system-one-evolution.md) & [ADR-006](file:///c:/PromptCore_Labs/projects/Living%20Architecture%20PCL%20AEOS/docs/adrs/ADR-006-tripartite-memory-drp-cloudflare.md)  

---

## 1. Visão Geral e Arquitetura Lógica

Esta especificação define a implementação técnica da **Memória Semântica e Cognitiva** do PCL AEOS, resolvendo os problemas de:
1. **Memory Drift & Poisoning:** Crenças desatualizadas servidas com alta confiança após alterações de código.
2. **Reconciliação Multi-Modelo:** Conflitos conceituais entre artefatos gerados por diferentes LLMs (Claude, GPT, Gemini, Llama) em momentos distintos do projeto.
3. **Triagem de Ultra-Baixa Latência:** Uso do Coprocessador System One (Laya em CPU) via contrato abstrato `PCL Classifier Port` ([`SPEC-PCL-AEOS-CLASSIFIER-01`](file:///c:/PromptCore_Labs/specs/pcl-aeos-evolution/spec-pcl-aeos-classifier-engine.md)).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITETURA DA MEMÓRIA TEMPORAL E RAG                           │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. INGESTÃO & EXTRAÇÃO PROVENIENTE                                                     │
│    - Artefatos Markdown, JSON, Código, Specs TLC v3                                    │
│    - Extração de Triplas (Subject -> Predicate -> Object / Value)                      │
│    - Carimbo de Origem: { source_model, timestamp, git_commit_hash, file_sha256 }       │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. ARBITRAGEM & DETECÇÃO DE DIVERGÊNCIAS (System One ~35ms)                            │
│    - Avaliação via PCL Classifier Port (Laya / ONNX CPU INT8)                          │
│    - Matriz de Divergência: Detecção de contradições lógicas                           │
│    - Hierarquia de Verdade PCL:                                                        │
│      Tier 1 (ADRs/Princípios) > Tier 2 (Specs TLC v3) > Tier 3 (Código) > Tier 4 (LLM)  │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. PERSISTÊNCIA ISOLADA NO PCL-DB (PostgreSQL 17)                                      │
│    - Namespace Dedicado: schema 'memory.*' (blindagem do Paperclip 'public')           │
│    - Tabelas: entities, claims, evidence_receipts, document_chunks (768D)              │
│    - Índice Vetorial: HNSW sobre nomic-embed-text                                      │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. DETERMINISTIC STALENESS VERIFIER (Zero Tokens de LLM)                               │
│    - Hook Git / Daemon de Verificação determinística                                  │
│    - Compara file_sha256 com o arquivo atual do repositório                            │
│    - Se hash divergir -> Marca claim como 'STALE' (incerteza durável)                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Esquema Físico de Dados: PostgreSQL (`schema: memory`)

Para atender ao [ADR-0005](file:///c:/PromptCore_Labs/architecture/decisions/ADR-0005-tripartite-memory-system-one-evolution.md) e blindar o schema `public` gerenciado pelo Drizzle ORM do Paperclip ([ADR-0008](file:///c:/PromptCore_Labs/projects/Living%20Architecture%20PCL%20AEOS/docs/adrs/ADR-008-docker-volume-persistence-governance.md)), todas as estruturas residem estritamente dentro do schema `memory`:

```sql
-- Habilitação preventiva de extensões no banco 'paperclip'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Criação do namespace isolado
CREATE SCHEMA IF NOT EXISTS memory;

-- 1. Entidades do Grafo de Conhecimento
CREATE TABLE IF NOT EXISTS memory.entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL, -- 'module', 'principle', 'adr', 'model', 'agent'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_memory_entity UNIQUE (name, entity_type)
);

-- 2. Afirmações e Relações com Temporalidade (Claims)
CREATE TABLE IF NOT EXISTS memory.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES memory.entities(id) ON DELETE CASCADE,
    predicate VARCHAR(150) NOT NULL, -- 'implements', 'depends_on', 'conflicts_with', 'prescribes'
    object_id UUID REFERENCES memory.entities(id) ON DELETE SET NULL,
    value_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'TRUSTED' CHECK (status IN ('TRUSTED', 'STALE', 'CONFLICT', 'DEPRECATED')),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP WITH TIME ZONE,
    source_model VARCHAR(100) NOT NULL, -- 'claude-3-5-sonnet', 'gpt-4o', 'gemini-1-5-pro', 'manual'
    confidence_score REAL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Recibos Determinísticos de Evidência (Evidence Grounding)
CREATE TABLE IF NOT EXISTS memory.evidence_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES memory.claims(id) ON DELETE CASCADE,
    source_file VARCHAR(500) NOT NULL,
    file_sha256 VARCHAR(64) NOT NULL,
    git_commit_hash VARCHAR(40),
    section_anchor VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Chunks Vetoriais Padronizados em 768D (Ollama nomic-embed-text)
CREATE TABLE IF NOT EXISTS memory.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_file VARCHAR(500) NOT NULL,
    section_title VARCHAR(255),
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    file_sha256 VARCHAR(64) NOT NULL,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Alta Performance
CREATE INDEX IF NOT EXISTS idx_memory_claims_subject ON memory.claims(subject_id);
CREATE INDEX IF NOT EXISTS idx_memory_claims_status ON memory.claims(status);
CREATE INDEX IF NOT EXISTS idx_memory_receipts_file ON memory.evidence_receipts(source_file);
CREATE INDEX IF NOT EXISTS idx_memory_chunks_embedding_hnsw 
ON memory.document_chunks USING hnsw (embedding vector_cosine_ops);
```

---

## 3. Protocolo de Verificação Determinística de Staleness

O verificador de frescor (*Staleness Daemon*) roda como um script Python ou CLI leve acoplado a commits Git ou tarefas agênticas, com **custo zero de tokens de LLM**:

### Algoritmo de Verificação (Sem IA):
1. Seleciona todos os claims ativos com `status = 'TRUSTED'`.
2. Para cada recibo em `evidence_receipts`:
   * Calcula o `SHA256` atual do arquivo local `source_file`.
   * Se o hash for idêntico ao `file_sha256`: mantém o claim como `TRUSTED`.
   * Se o arquivo não existir ou o hash divergir:
     * Atualiza o claim para `status = 'STALE'`.
     * Registra o evento de incerteza durável: *"Evidência modificada. Requer revalidação no fluxo de trabalho."*
3. O agente, ao consultar o RAG, recebe claims `STALE` envelopados com aviso: `[UNTRUSTED EVIDENCE: Fonte modificada no commit X]`.

---

## 4. Pipeline de Reconciliação Canônica para Engenharia Reversa

Quando múltiplos artefatos legados de épocas distintas e provedores diferentes entram em conflito:

### 4.1. Construção da Matriz de Divergência
1. O extrator extrai as triplas de cada artefato associando o metadado `source_model` e a data de emissão.
2. O **Laya System One** avalia pares de claims sobre a mesma entidade executando uma chamada binária:
   * Pergunta tipada: *"O Claim A ('valor A') contradiz frontalmente o Claim B ('valor B')?"*
3. Se detectada contradição (probabilidade > 0.75):
   * O sistema cria um registro de divergência e marca ambos os claims como `status = 'CONFLICT'`.

### 4.2. Arbitragem por Precedência Epistemológica
A reconciliação aplica a seguinte máquina de estados determinística:
* **Caso 1:** Se o Claim A deriva de um ADR aprovado (`architecture/decisions/`) e o Claim B deriva de um log de chat: o Claim A prevalece automaticamente como canônico; o Claim B é arquivado como histórico.
* **Caso 2:** Se ambos derivam de rascunhos informais de LLMs (Claude vs GPT): a divergência é exposta como **Stage Gate de Incerteza**, solicitando a intervenção humana do Tech Lead para eleger o estado canônico.

---

## 5. Especificação de Hardware e Contrato do Coprocessador Laya

Para assegurar conformidade estrita com a **invariante de 0 MB de VRAM na GPU NVIDIA RTX 3050**:

### 5.1. Docker Container Spec (`pcl-laya`)
* **Imagem Base:** `python:3.11-slim`
* **Runtime:** `onnxruntime` (compilação CPU x86_64 otimizada com AVX2/AVX-512)
* **Variável de Ambiente Mandatória:** `ONNXRUNTIME_EXECUTION_PROVIDERS=CPUExecutionProvider`
* **Modelo Base:** ModernBERT-base quantizado em **INT8** (~421M parâmetros, ~450 MB em RAM)
* **Porta Interna:** `20140` (na rede Docker `aeos-net`)
* **SLA de Latência:** < 40ms por requisição em lote (até 16 perguntas tipadas simultâneas)
* **VRAM Alocada:** **0 MB garantido**

### 5.2. Mapeamento com o `PCL Classifier Port`
O `pcl-laya` atua como o **Adapter Primário Local** da especificação [`SPEC-PCL-AEOS-CLASSIFIER-01`](file:///c:/PromptCore_Labs/specs/pcl-aeos-evolution/spec-pcl-aeos-classifier-engine.md):
* Endpoint exposto: `POST http://pcl-laya:20140/v1/classifier/evaluate`
* Suporta primitivas `binary`, `choice` e `score`.
* Fallback: Se o contêiner `pcl-laya` estiver indisponível, o OmniRoute redireciona a chamada para o fallback estruturado do LLM ou bypass transparente.

---

## 6. Governança e Validação de DRP (ADR-006)

Em conformidade com o Plano de Recuperação de Desastres:
1. O script [`scripts/backup/backup-aeos-tripartido.ps1`](file:///c:/PromptCore_Labs/scripts/backup/backup-aeos-tripartido.ps1) deve executar `pg_dump -Fc` cobrindo explicitamente ambos os schemas: `-n public -n memory`.
2. O script [`scripts/backup/restore-aeos-tripartido.ps1`](file:///c:/PromptCore_Labs/scripts/backup/restore-aeos-tripartido.ps1) deve executar `CREATE EXTENSION IF NOT EXISTS vector;` antes do restore físico, assegurando que o SLA de **RTO $\le$ 15 minutos** seja cumprido com integridade de 100%.

---

## 7. Critérios de Aceitação (Definition of Done)

- [ ] Schema `memory` e extensão `vector` criados com sucesso no `pcl-db` sem interferência nas tabelas do Paperclip.
- [ ] Contêiner `pcl-laya` respondendo em < 40ms na porta 20140 consumindo 0 MB de VRAM na RTX 3050.
- [ ] Staleness Verifier testado: modificação proposital em arquivo Markdown reflete em claim marcado como `STALE` em < 500ms.
- [ ] Teste de DRP executado via `restore-aeos-tripartido.ps1` com restauração validada em menos de 10 segundos.
