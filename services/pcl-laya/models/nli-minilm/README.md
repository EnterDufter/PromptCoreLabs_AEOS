# PCL AEOS - Coprocessador Laya: Modelo Neural NLI

## Especificações do Modelo

- **Identificador Canônico**: `cross-encoder/nli-MiniLM-2-L6-H768`
- **Origem**: Hugging Face Hub ([cross-encoder/nli-MiniLM2-L6-H768](https://huggingface.co/cross-encoder/nli-MiniLM2-L6-H768))
- **Tarefa**: Inferência em Linguagem Natural (NLI - Natural Language Inference) & Zero-Shot Classification
- **Arquitetura**: BERT MiniLM-v2 (6 Camadas, Hidden Size 768)
- **Quantização**: INT8 / UINT8 otimizado para CPU AVX2 (`model_quint8_avx2.onnx`)
- **Tamanho do Binário**: ~78.9 MB
- **Vocabulário / Tokenizer**: WordPiece via Fast Tokenizers (`tokenizer.json`, ~1.3 MB)

## Mapeamento de Rótulos (id2label)

| Índice (Logit) | Rótulo | Significado no PCL AEOS | Ação na Reconciliação |
| :---: | :---: | :---: | :---: |
| `0` | **`contradiction`** | A hipótese anula ou contradiz a premissa canônica | Supersessão de claim antigo / Alerta de Staleness |
| `1` | **`entailment`** | A premissa implica logicamente a hipótese (consonância) | Validação de consistência factual / Answerability alta |
| `2` | **`neutral`** | Informações independentes ou não excludentes | Adição como novo claim sem supersessão |

## Invariantes de Hardware PCL AEOS

- **Execution Provider**: `CPUExecutionProvider` exclusivo.
- **VRAM Alocada**: **0 MB** (Nenhum consumo de VRAM da GPU dedicada).
- **Threads CPU**: 2 threads intra-op (configurável via `LAYA_CPU_THREADS`).
- **Latência Típica**: ~10ms a 25ms por inferência em CPUs modernas.
- **Custo Operacional**: **$0.00** por chamada (Zero API tokens externos).
- **Dual-Engine Graceful Fallback**: Se executado sem as dependências ONNX Runtime, reverte deterministicamente para heurísticas sem interrupção de serviço.
