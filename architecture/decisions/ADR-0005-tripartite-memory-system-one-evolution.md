| Campo | Valor |
|---|---|
| ID | ADR-0005 |
| Título | Evolução da Memória Cognitiva Tripartida, Temporal Graph-RAG e Coprocessador System One (Laya) |
| Status | Accepted |
| Data | 2026-10-13 |
| Autor | Eduardo Machado & Antigravity (PCL Architecture & Cortex Intelligence) |
| Aprovador | Eduardo Machado (PromptCore Labs) |

---

==================================================
1. CONTEXTO
==================================================

O PromptCoreLabs_AEOS consolidou seu ecossistema operacional apoiado em contêineres Docker (`pcl-db` PostgreSQL 17 + pgvector, `pcl-omniroute` porta 20130 e `pcl-paperclip` porta 3100), com governança disciplinada pela metodologia TLC Spec-Driven v3 e resiliência garantida pela Memória Tripartida de DRP e Cloudflare Zero Trust (ADR-006).

Entretanto, o crescimento da base de conhecimento da plataforma e a necessidade de realizar engenharia reversa sobre múltiplos artefatos legados — gerados em épocas distintas por provedores e modelos de IA heterogêneos (GPT-4, Claude 3.5, Gemini 1.5/3.1, Llama) — revelou limitações no modelo convencional de RAG e na gestão da memória operacional:
1. O RAG vetorial ingênuo sofre de perda de precisão por ruído semântico, incapaz de distinguir entre fatos vigentes e afirmações obsoletas (*memory poisoning* e *memory drift*).
2. Não havia mecanismo determinístico para validar se uma crença mantida pelo agente ainda possuía respaldo no código-fonte ou se foi invalidada por modificações recentes.
3. Decisões estruturais e de triagem (como classificação de intenção, filtragem de segurança e roteamento) vinham sendo submetidas a LLMs generativos (System Two), gerando latência de segundos e consumo desnecessário de tokens.

==================================================
2. PROBLEMA
==================================================

A ausência de uma camada de memória cognitiva estruturada com autocorreção determinística impunha os seguintes riscos e gargalos ao PCL AEOS:

• Degradação e Ambiguidade do Conhecimento: Conflitos não reconciliados entre especificações antigas e novas resultavam em alucinações onde agentes seguiam padrões depreciados com elevado grau de certeza.

• Ineficiência e Latência de Decisão: Utilizar LLMs autoregressivos para avaliar perguntas binárias de triagem (ex: "o documento C responde à dúvida?", "este prompt contém injeção?") impunha latência entre 800ms e 3.000ms e custo contínuo de inferência.

• Risco de Quebra Física de Hardware: A GPU de desenvolvimento local (NVIDIA GeForce RTX 3050 com 6 GB de VRAM) possui uma política estrita de 0 MB de VRAM em repouso no modo online e ~4.7 GB alocados no Ollama durante o failover offline. Qualquer solução de IA local que dispute VRAM causaria Out Of Memory (OOM) catastrófico no failover.

• Conflito com a Governança Existente: Frameworks externos de memória ou agentes autônomos desgovernados violariam as barreiras dos Stage Gates do TLC v3 e poderiam colidir com o banco de dados do Paperclip (`@paperclipai/db`) ou com o DRP ativo do ADR-006.

==================================================
3. ALTERNATIVAS CONSIDERADAS
==================================================

Alternativa A — Adoção de Plataformas Especializadas Externas (Graphiti Cloud / Zep / Mem0 / Qdrant + Neo4j)
• Prós: Recursos avançados de grafos e memória temporal prontos para uso.
• Contras: Viola os Princípios 1 e 9 do AEOS (Soberania e Independência Tecnológica); introduz custos recorrentes de SaaS ou consumo massivo de memória RAM (4GB a 8GB para JVM do Neo4j e Qdrant); dependência de redes externas.

Alternativa B — Manutenção do RAG Vetorial Atual com Re-indexação Batch Periódica
• Prós: Zero impacto imediato na infraestrutura atual.
• Contras: Não resolve a obsolescência de fatos entre re-indexações; não oferece suporte à resolução canônica de divergências entre modelos; mantém o alto custo e latência de tokens em tarefas de triagem.

Alternativa C — Arquitetura Soberana: PCL Temporal Graph-RAG no PostgreSQL 17 + Coprocessador System One (Laya em CPU) + Harmonização com ADR-006
• Prós: 100% Open Source (Apache 2.0 / PostgreSQL); custo marginal zero ($0.00/mês); isolamento físico de dados via schema `memory` no `pcl-db`; inferência do Laya em ~35ms via ONNX Runtime estritamente em CPU (0 MB de VRAM na RTX 3050); verificação determinística de staleness sem gastar tokens; total conformidade com os Stage Gates do TLC v3 e com o DRP do ADR-006.
• Contras: Exige criação de especificações formais de esquemas e implementação do microserviço `pcl-laya` no Docker Compose.

==================================================
4. DECISÃO
==================================================

Adotar a **Alternativa C**: Implementar a evolução da Memória Cognitiva Tripartida do PCL AEOS apoiada em:
1. **PCL Temporal Graph-RAG:** Modelagem de entidades, alegações temporais (`claims`) com status (`TRUSTED`, `STALE`, `CONFLICT`) e recibos criptográficos de evidência (`evidence_receipts` com SHA-256 e git commit hash), persistida no schema isolado `memory` do PostgreSQL 17 (`pcl-db`).
2. **Coprocessador System One (Laya vs Jev):**
   - Paradigma System One: Modelos não-autorregressivos de tomada de decisão rápida em single forward pass, retornando probabilidades matematicamente calibradas e saídas estritamente tipadas (`boolean`, `choice`, `score`).
   - Jev (TypeSafe AI — https://typesafe.ai): Serviço gerenciado proprietário em nuvem (SaaS) que estabeleceu a especificação de API de decisão calibrada.
   - Laya (Convai Innovations — https://huggingface.co/convaiinnovations/laya): Implementação open-source sob licença Apache 2.0, multilíngue e não-autorregressiva documentada na literatura acadêmica (arXiv:2609.28940v1). Permite auto-hospedagem local ou uso via Laya Studio.
   - No PCL AEOS: Microserviço Docker `pcl-laya` (porta 20140 / MCP stdio) executando modelo quantizado em INT8 via **ONNX Runtime CPU (`CPUExecutionProvider`)**, com latência determinística de **~20 a 35ms**, custo marginal **$0.00** e **0 MB de VRAM alocada** na GPU NVIDIA RTX 3050, preservando a VRAM integralmente para o Ollama local no modo offline.
3. **Pipeline de Reconciliação Canônica:** Protocolo formal para ingestão e determinação do Estado Canônico Definitivo (SSOT) de artefatos heterogêneos de múltiplos modelos.
4. **Governança de Autonomia Confinada:** Qualquer worker assíncrono em background (`pcl-daemon`) é confinado à execução de tarefas já aprovadas no **Gate 3 (tasks)** do Paperclip, proibido de autoaprovação de requisitos e submetido aos Gates 4 e 5.
5. **Harmonização Estrita com o ADR-006:** A Memória Cognitiva constitui a camada lógica operacional resguardada e replicada pelo DRP físico criptografado (Cold SQL R2, Event Docs R2 e Hot Sync D1/Vectorize).

==================================================
5. JUSTIFICATIVA
==================================================

Esta decisão está em estrita conformidade com os princípios fundacionais do PCL AEOS:
• **Princípio 1 (O Conhecimento é o Principal Ativo):** O conhecimento torna-se auditável, versionado e imutável em suas fontes de evidência, evitando perda por sobreposição ingênua.
• **Princípio 2 (Modelos de IA são Recursos Intercambiáveis):** O conhecimento acumulado não pertence ao modelo que gerou o texto (Claude, GPT, Gemini), mas ao grafo de evidências do AEOS.
• **Princípio 3 (Separação entre Conhecimento e Execução):** A memória reside na infraestrutura de dados soberana (`pcl-db`), desacoplada da vida útil dos agentes.
• **Princípio 4 (Governança Antes da Automação):** Incertezas e divergências não são resolvidas por adivinhação; recebem a marcação `CONFLICT` até que passem por validação governada.
• **Princípio 9 (Independência Tecnológica):** Zero dependência de provedores proprietários, mantendo 100% de licenças FOSS e custo zero.
• **Invariante de Hardware da Living Architecture:** O confinamento do Laya à CPU protege a GPU RTX 3050 para o failover do Ollama (`qwen2.5-coder:7b`), assegurando soberania 100% offline.

==================================================
6. CONSEQUÊNCIAS
==================================================

Positivas:
• Eliminação de alucinações por fatos obsoletos via checagem determinística de staleness (custo zero de LLM).
• Redução de até 85% no tráfego de tokens de LLM e latência de decisões reduzida para ~35ms em tarefas de triagem, tool gating e reranking.
• Capacidade de consolidar e reconciliar artefatos legados heterogêneos em uma verdade canônica auditável.
• Preservação da estabilidade do banco do Paperclip através do isolamento no schema `memory`.
• Respeito integral aos SLAs de DRP (RTO <= 15min) estabelecidos no ADR-006 a custo $0.00/mês.

Negativas / Trade-offs:
• Adição de um novo contêiner (`pcl-laya`) no `docker-compose.aeos.yml`, consumindo ~800 MB a 1.2 GB de memória RAM do sistema host (em CPU).
• Necessidade de atualização dos scripts de backup e restore (`backup-aeos-tripartido.ps1` e `restore-aeos-tripartido.ps1`) para contemplar a extensão `vector` e o schema `memory`.

==================================================
7. PLANO DE REVERSÃO
==================================================

Caso a nova camada de memória apresente instabilidade ou impacto operacional indesejado:
1. O contêiner `pcl-laya` pode ser desligado via `docker compose stop pcl-laya`, fazendo com que o OmniRoute e os agentes revertam imediatamente para o modo de fallback direto (System Two).
2. O schema `memory` no PostgreSQL pode ser descartado via `DROP SCHEMA memory CASCADE;`, restaurando o `pcl-db` ao estado anterior sem afetar nenhuma tabela ou dado do Paperclip (`public`).
3. O script `restore-aeos-tripartido.ps1` pode ser executado para recuperar o último estado estável validado a partir do Cloudflare R2.

==================================================
8. IMPACTO ARQUITETURAL
==================================================

• `docker-compose.aeos.yml`: Inclusão do serviço `pcl-laya` (imagem Python/ONNX CPU).
• `pcl-db`: Criação da extensão `vector`, extensão `uuid-ossp` e do schema `memory`.
• `memory/`: Atualização da documentação de RAG e contexto com os novos esquemas de dados.
• `OmniRoute/`: Adição de middleware assíncrono para triagem preditiva e guardrails de segurança.
• `scripts/backup/`: Atualização dos scripts PowerShell de DRP para contemplar o schema `memory`.
• `specs/pcl-aeos-evolution/`: Criação da especificação formal técnica de esquema e contratos de API.

==================================================
9. DOCUMENTOS RELACIONADOS
==================================================

• architecture/principles.md
• architecture/modules.md
• governance/stage-gates.md
• projects/Living Architecture PCL AEOS/docs/adrs/ADR-006-tripartite-memory-drp-cloudflare.md
• projects/Living Architecture PCL AEOS/docs/adrs/ADR-0008-docker-volume-persistence-governance.md
• projects/Living Architecture PCL AEOS/docs/adrs/ADR-0009-triage-gate-dual-track-sdd.md
• projects/Living Architecture PCL AEOS/docs/adrs/ADR-0010-squad-prototyping-and-antigravity-harness-integration.md
• docs/architecture/pcl-aeos-evolution-master-plan.md
• specs/pcl-aeos-evolution/spec-pcl-aeos-temporal-graph-rag-and-system-one.md
