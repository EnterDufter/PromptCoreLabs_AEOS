# Glossário Canônico de Termos & Taxonomia — PCL AEOS v3.6

> [!IMPORTANT]
> **👔 Visão Executiva & Valor de Negócio:** Este glossário traduz de forma direta os termos estratégicos, financeiros e regulatórios do **PCL AEOS & PCL Cockpit v3.6**, permitindo alinhamento imediato entre diretoria, jurídico/LGPD, auditoria e times de produto.

> [!NOTE]
> **🛠️ Visão de Engenharia & Invariantes:** Define com precisão semântica os contratos arquiteturais, portas de serviço, algoritmos de memória e mecanismos criptográficos exigidos pela norma **`PCL-AEOS-NORM-01`**.

---

## Dicionário Unificado da Arquitetura (Edição v3.6)

| Termo Canônico | Definição Executiva & Técnica no Ecossistema PCL AEOS |
| :--- | :--- |
| **AEOS** | *AI Engineering Operating System* — Sistema operacional soberano para orquestração de agentes, governança de engenharia e decisão corporativa assistida por IA. |
| **Claims Atômicas (`memory.claims`)** | Afirmações factuais unitárias extraídas com níveis de autoridade (`Tiers 1 a 4`) e rastreamento de supersessão, blindando agentes contra alucinações. |
| **Cold Storage (`knowledge/cold/`)** | Camada física de governança RAG dedicada ao registro histórico de hipóteses e arquiteturas descartadas (`HIP-001` a `HIP-008`), prevenindo regressões técnicas. |
| **Coprocessador Laya (`:20140`)** | Motor neural não-autorregressivo de Sistema 1 (`nli-MiniLM-2-L6-H768` ONNX INT8 em CPU, **`0 MB VRAM`**, `~20–35ms`, complexidade `O(1)`) para *Intention Gating*, NLI e *Answerability Gate*. |
| **Cortex (`/cortex`)** | Persona cognitiva e motor visual (`archify.mjs` + Padrão Mermaid v7) guardião dos diagramas interativos, anti-clipping, contraste WCAG AAA e visualização DAG. |
| **Dual-Plex Workspace** | Área central do PCL Cockpit (`:3001`) que opera em modo Chat, modo **Cortex Canvas (DAG)** ou tela dividida simultânea (*Split Dual-Plex*). |
| **EBITDA Shield** | Estratégia FinOps de blindagem de margem via cache semântico de prompts, triagem prévia Laya em CPU e failover local a **`$0.00`**. |
| **Evidence Receipts** | Recibos criptográficos imutáveis no PostgreSQL 17 contendo hash **SHA-256** do arquivo-fonte e commit Git exato de cada afirmação ou resposta. |
| **Execution Cell** | Unidade atômica e auditável de execução de tarefa processada por um agente dentro do harness operacional. |
| **Fast-Path `AES-256-GCM` (`open-sse`)** | Rota de baixa latência (`~1.2s–3.4s`) do Cockpit v3.6 que descriptografa em memória a credencial do cofre OmniRoute e decodifica streams SSE em tempo real. |
| **Fontes Retráteis (Pílula)** | Componente de UX (`Fontes Consultadas (n) v`) que desacopla referências bibliográficas/web do corpo executivo da resposta, evitando poluição visual (`ADR-0007`). |
| **Harness** | Conjunto isolado de serviços locais (`pcl-db :5432`, `pcl-omniroute :20130`, `pcl-laya :20140`, `pcl-paperclip :3100`, `PCL Cockpit :3001`). |
| **Intention Gating** | Classificação determinística pré-inferência (`general_chat | internal_rag | web_search`) que impede buscas web desnecessárias em perguntas conceituais (`HIP-007`). |
| **Learnings (`knowledge/learnings/`)** | Camada normativa contendo regras operacionais consolidadas (`AGENTS.md` / `PCL-AEOS-NORM-01`) aplicadas transversalmente a todos os agentes. |
| **Live Execution Stepper (5 Fases)** | Componente síncrono de observabilidade no Cockpit v3.6 que exibe a latência real de cada etapa (*Triagem Laya*, *Base Canônica*, *Busca Web*, *Síntese* e *Auditoria SHA-256*). |
| **Living Architecture** | Documentação viva sincronizada com o código-fonte, publicada no repositório e no Portal GitHub Pages com **Narrativa Dual Calibrada** (Executiva + Engenharia). |
| **Memória Tripartida (`memory.*`)** | Arquitetura temporal em runtime no PostgreSQL 17 + PGVector dividida em `document_chunks` (`768D`), `claims` ontológicas e `evidence_receipts`. |
| **OmniRoute (`:20130`)** | AI Gateway unificado com cofre `AES-256-GCM`, controle de orçamento de tokens e failover dinâmico entre nuvem e modelos locais (`Ollama :11434` / `LM Studio :1234`). |
| **PaperClip (`:3100`)** | Painel operacional para supervisão dos 15 papéis de agentes departamentais e de engenharia. |
| **PCL Cockpit v3.6 (`:3001`)** | Estação oficial de pilotagem agêntica (*Liquid Glass Bento Grid*), vencedora do benchmark cego multi-turn com nota **4.95 / 5.0**. |
| **PCL Sovereign Drawer** | Gaveta lateral redimensionável (`PCLArtifactDrawer.tsx`, `380px–850px`) com 4 abas: *Documento*, *Audit Trail SHA-256*, *Custos FinOps* e *PII Guard LGPD*. |
| **PGVector** | Extensão vetorial no `pcl-db` (`PostgreSQL 17`) com índice `HNSW` para busca semântica de cosseno a custo zero de JVM externa (`HIP-001`). |
| **PII Guard LGPD** | Motor inline no cliente que detecta e mascara dados pessoais sensíveis (CPF, CNPJ, e-mails, chaves) antes de qualquer envio externo. |
| **RTO Homologado (`7,18s`)** | *Recovery Time Objective* aferido em laboratório para restauração integral da memória e banco a partir de backup cifrado AES-256 no Cloudflare R2 (SLA `<= 15min`). |
| **Sliding Window Multi-Turn** | Algoritmo de janela deslizante (`ADR-0007`) que preserva diretriz de sistema, turnos âncora e os últimos `K` diálogos, erradicando amnésia conversacional (`HIP-008`). |
| **Sondas TCP Sub-Segundo** | Verificação `checkTcpPort` (`250ms–300ms`) que detecta portas locais offline instantaneamente, eliminando esperas HTTP de 38s–58s (`HIP-004`). |
| **Stage Gates TLC v3** | Cinco portões formais sequenciais (*Specify, Design, Tasks, Execute/QA, Signoff Humano*) onde nenhum agente pode se autoaprovar em produção. |
| **Staleness Daemon** | Sentinela determinístico que audita hashes SHA-256 de arquivos em `0,2s` via Git hook sem consumir tokens de nuvem. |
| **TokenAquaOrb 3D** | Esfera vítrea interativa no Cockpit que sinaliza visualmente a saturação da janela de contexto do modelo ativo. |
| **Warm Storage (`knowledge/warm/`)** | Camada física prioritária de especificações vigentes homologadas (`PCL_COCKPIT_SPEC_V3.6.md`, `ADR-0007.md`, Matriz Competitiva). |
| **Zero-Bin Custody (Headless BYOS)** | Arquitetura de soberania documental onde anexos permanecem sob custódia local do cliente, sem retenção opaca em nuvens de terceiros. |
| **Zero Secret Leak** | Política perimetral auditada pelo CISO Agent que bloqueia exposição de chaves `.env`, tokens ou credenciais em código, logs e diagramas. |
