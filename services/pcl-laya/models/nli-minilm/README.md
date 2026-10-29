# PCL AEOS - Coprocessador Laya: Modelo Neural NLI

## Especificações do Modelo & Rastreabilidade Criptográfica

- **Identificador Canônico**: `cross-encoder/nli-MiniLM2-L6-H768`
- **Origem**: Hugging Face Hub ([cross-encoder/nli-MiniLM2-L6-H768](https://huggingface.co/cross-encoder/nli-MiniLM2-L6-H768))
- **Revisão Imutável (Commit SHA)**: `b95119ce93d3e065de6214e38cd4a97b0f2f2c6d`
- **Tarefa**: Inferência em Linguagem Natural (NLI - Natural Language Inference)
- **Arquitetura**: BERT MiniLM-v2 (6 Camadas, Hidden Size 768)
- **Quantização**: INT8 / UINT8 otimizado para CPU AVX2 (`model_quint8_avx2.onnx`)
- **Tamanho do Binário**: ~78.9 MB
- **Vocabulário / Tokenizer**: WordPiece via Fast Tokenizers (`tokenizer.json`, ~1.3 MB)
- **Manifest Canônico**: [`manifest.json`](manifest.json)

## Tabela de Checksums e Integridade (SHA-256)

| Arquivo | Tamanho (Bytes) | Checksum SHA-256 | Status de Verificação |
| :--- | :---: | :--- | :---: |
| **`config.json`** | 875 | `8b0e41caff7567c0f53e6983f35591c3dec59507c9173ab125c5823394fb57f3` | Verificado |
| **`tokenizer.json`** | 1.356.048 | `82139106e603ee4e1d5bc99d056ccbed5a92bc24848b1b5a7137c26e00d0dbf6` | Verificado |
| **`model.onnx`** | 82.823.063 | `44391a5241a62e0083c1a8899a71e69a092b95aea5ba89e14062925468eceac7` | Verificado |

## Mapeamento Dinâmico de Rótulos (id2label)

Carregado dinamicamente a partir do `config.json`:

| Índice (Logit) | Rótulo | Significado no PCL AEOS | Ação na Reconciliação |
| :---: | :---: | :---: | :---: |
| `0` | **`contradiction`** | A hipótese anula ou contradiz a premissa canônica | Sinal de divergência / Alerta de Staleness |
| `1` | **`entailment`** | A premissa implica logicamente a hipótese (consonância) | Sinal de consistência factual / Coerência |
| `2` | **`neutral`** | Informações independentes ou não excludentes | Informação complementar sem conflito direto |

## Invariantes de Hardware & Observabilidade

- **Execution Provider**: `CPUExecutionProvider` exclusivo.
- **VRAM Alocada**: **0 MB** (Nenhum consumo de VRAM da GPU dedicada).
- **Threads CPU**: 2 threads intra-op (configurável via `LAYA_CPU_THREADS`).
- **Latência Típica**: ~10ms a 25ms por inferência em CPU.
- **Custo Operacional**: **$0.00** por chamada (Zero API tokens externos).
- **Dual-Engine Graceful Fallback**: Se executado sem as dependências ONNX Runtime ou se ocorrer anomalia na sessão, reverte para heurísticas com registro de log estruturado.
- **Diagnóstico de Saúde**: O endpoint `/health` reporta `healthy` apenas quando o motor ONNX estiver operacional; em caso de fallback, reporta `degraded` com causa e telemetria expostas.

