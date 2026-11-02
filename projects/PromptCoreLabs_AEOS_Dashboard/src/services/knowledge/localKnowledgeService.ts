export interface LocalKnowledgeDoc {
  id: string;
  title: string;
  category: 'adr' | 'skill' | 'architecture' | 'benchmark';
  tags: string[];
  content: string;
  sourceFile: string;
}

export interface LocalKnowledgeMatch {
  doc: LocalKnowledgeDoc;
  relevanceScore: number;
  matchedSnippets: string[];
}

export const CANONICAL_PCL_KNOWLEDGE: LocalKnowledgeDoc[] = [
  {
    id: 'adr-0005-laya-system-one',
    title: 'ADR-0005: Coprocessador System One (Laya vs JEV) e Memória Cognitiva Tripartida',
    category: 'adr',
    tags: ['laya', 'jev', 'typesafe', 'convai', 'system one', 'memoria', 'graph-rag', 'cpu', '0 mb vram', 'classificador', 'modernbert', 'onnx', 'staleness', 'o(1)'],
    sourceFile: 'c:/PromptCore_Labs/architecture/decisions/ADR-0005-tripartite-memory-system-one-evolution.md',
    content: `No ecossistema de IA moderna, Modelos de Sistema 1 (System One Decision Models) são modelos não-autorregressivos de tomada de decisão rápida em complexidade O(1), estruturada e calibrada probabilisticamente, em contraste com LLMs autorregressivos (Sistema 2, complexidade O(N) token a token). Em vez de gerar parágrafos de texto, recebem um estado estruturado e perguntas tipadas, retornando probabilidades calibradas sem risco de alucinação de parsing.

Comparação Técnica e de Mercado: JEV (TypeSafe AI) vs LAYA (Convai Innovations) + Integração PCL AEOS:
1. JEV (TypeSafe AI — https://typesafe.ai/):
   - Licença & Modelo: Proprietário / Serviço gerenciado em nuvem (SaaS) desenvolvido pela TypeSafe AI.
   - Hospedagem & Execução: API Cloud gerenciada pela TypeSafe AI (sujeita a latência de rede externa e cobrança por requisição).
   - Especificação: Define a especificação de API de decisão tipada (boolean, choice, score) consumida por agentes autônomos.
2. LAYA (Convai Innovations — https://huggingface.co/convaiinnovations/laya & Laya Studio):
   - Licença & Modelo: Open-source (Licença Apache 2.0), multilíngue e não-autorregressivo, desenvolvido pela Convai Innovations (arXiv:2609.28940v1).
   - Compatibilidade: Compartilha a mesma especificação de API e formatos de dados do Jev, porém permite auto-hospedagem soberana (On-premise, Docker, ONNX Runtime).
3. Integração Soberana no PCL AEOS (ADR-0005 & ADR-0007 — Microserviço pcl-laya):
   - No PCL AEOS, o Laya é implantado localmente em container dedicado (porta 20140 / MCP Server stdio) operando 100% em CPU host (ONNX Runtime INT8) com 0 MB de VRAM alocada na GPU NVIDIA RTX 3050 (~20 a 35ms de latência determinística e custo $0.00).
   - Atua em 4 frentes críticas: (a) Staleness & Contradiction Check em documentos corporativos (93.3% recall); (b) RAG Answerability Check antes de invocar LLMs; (c) Guardrail Screening contra prompt injection; e (d) Intention & Search Gating na v3.6 (flags needsWebSearch e needsCanonicalRAG).`
  },
  {
    id: 'adr-0007-cockpit-multiturn-gating',
    title: 'ADR-0007: Arquitetura de Memória Multi-Turn, Gating Inteligente Laya e Desacoplamento de Fontes no PCL Cockpit v3.6',
    category: 'adr',
    tags: ['adr-0007', 'v3.6', 'multi-turn', 'sliding window', 'anafora', 'amnésia', 'amnesia', 'intention gating', 'fontes', 'pilula retratil', 'cockpit', 'needswebsearch'],
    sourceFile: 'c:/PromptCore_Labs/knowledge/warm/architecture/ADR-0007.md',
    content: `O ADR-0007 formaliza a evolução arquitetural v3.6 do PCL Cockpit (:3001), solucionando definitivamente a amnésia single-turn e o grounding web forçado:
1. Memória Multi-Turn Contígua com Janela Deslizante (Sliding Window): Preserva o histórico conversacional estruturado (user/assistant/system) com janela deslizante dos últimos 10 turnos e normalização estrita user/model para Google Gemini v1beta e /api/chat do Ollama local, garantindo resolução anafórica perfeita ("dessa abordagem") e síntese cross-turn.
2. Intention Gating Determinístico via Laya CPU (0 MB VRAM): Antes de qualquer busca externa, o sensor Laya (~20-35ms em CPU INT8) emite needsWebSearch e needsCanonicalRAG. Consultas conceituais (general_chat) dispensam a busca web em 0ms com zero poluição de fontes; consultas internas ativam o RAG canônico (corte de relevância >= 0.40); consultas temporais/factuais contemporâneas acionam busca web real.
3. Desacoplamento Visual de Fontes (Padrão Gemini / Perplexity): Substituição dos antigos cartões gigantescos pela pílula retrátil compacta "Fontes Consultadas (n) v", renderizada apenas quando fontes reais foram efetivamente utilizadas.
4. Live Execution Stepper (5 Fases) & Auditoria SHA-256: Telemetria em milissegundos ponta a ponta com recibos criptográficos imutáveis e política estrita de Zero Mocks.`
  },
  {
    id: 'pcl-dual-memory-taxonomy-v36',
    title: 'Clarificação Canônica v3.6: Memória Temporal Tripartida (memory.*) vs. Governança Física RAG (knowledge/)',
    category: 'architecture',
    tags: ['memoria tripartida', 'taxonomia rag', 'warm storage', 'cold storage', 'learnings', 'knowledge', 'memory', 'pgvector', 'yaml frontmatter'],
    sourceFile: 'c:/PromptCore_Labs/projects/Living Architecture PCL AEOS/docs/memory-rag/README.md',
    content: `Na arquitetura PCL AEOS v3.6 coexistem duas dimensões complementares e desacopladas de memória organizacional:
1. Modelo Temporal Operacional em Runtime (Schema memory.* no PostgreSQL 17 + PGVector :5432):
   - Curto Prazo: Buffer conversacional Multi-Turn com Sliding Window no Cockpit/OmniRoute (< 10ms) + KV-Cache (EBITDA Shield).
   - Médio Prazo: Vetores semânticos 768D (nomic-embed-text) com índice HNSW (memory.document_chunks) e claims atômicas reconciliadas pelo Laya (memory.claims).
   - Longo Prazo: Recibos criptográficos imutáveis SHA-256 (memory.evidence_receipts), histórico constitucional (STATE.md) e backups AES-256 no Cloudflare R2 (RTO homologado em 7.18s).
2. Modelo Físico de Governança Documental RAG (Diretório raiz knowledge/ com YAML Frontmatter obrigatório):
   - Warm Storage (knowledge/warm/): Especificações ativas vigentes (PCL_COCKPIT_SPEC_V3.6.md), ADRs aprovados (ADR_INDEX.md, ADR-0007.md) e Matriz Competitiva.
   - Cold Storage (knowledge/cold/): Log histórico imutável de hipóteses descartadas (DISCARDED_HYPOTHESES_LOG.md, HIP-001 a HIP-008) e auditorias passadas para prevenir regressões.
   - Agent Learnings & Rules (knowledge/learnings/ & AGENTS.md): Diretrizes mandatórias de alta prioridade para personas cognitivas (/cortex e /laya).`
  },
  {
    id: 'skill-laya-spec',
    title: 'Especificação da Skill Laya (PCL AEOS Coprocessor)',
    category: 'skill',
    tags: ['laya', 'mcp', 'coprocessador', 'system one', 'classificador', 'onnx', 'cpu'],
    sourceFile: 'c:/PromptCore_Labs/.agents/skills/laya/SKILL.md',
    content: `A skill laya provê interface para o microserviço pcl-laya (porta 20140 ou MCP stdio via mcp_server.py).
Executa inferência quantizada em INT8 via ONNX Runtime CPUExecutionProvider com latência alvo < 35ms (0.014ms via MCP local em lote) e 0 MB VRAM.
Permite avaliação binária calibrada (evaluate_binary), detecção de contradições factuais (check_contradiction), escolha tipada (evaluate_choice), cálculo de score contínuo (evaluate_score) e Intention Gating no PCL Cockpit v3.6.`
  },
  {
    id: 'omniroute-hybrid-gateway',
    title: 'OmniRoute Hybrid AI Gateway (:20130) & Fast-Path AES-256-GCM vs LiteLLM / LangGraph / CrewAI',
    category: 'architecture',
    tags: ['omniroute', 'roteamento', 'gateway', 'gemini', 'ollama', 'qwen', 'fallback', 'langgraph', 'crewai', 'litellm', 'trilema', 'open-sse', 'tcp probe'],
    sourceFile: 'c:/PromptCore_Labs/docs/hybrid-inference-architecture.md',
    content: `O OmniRoute é o gateway de roteamento de inferência híbrida do PCL AEOS rodando na porta 20130, operando em sinergia com o middleware Fast-Path do PCL Cockpit (:3001).
Orquestra modelos de fronteira em nuvem (Google Gemini 3.5 Flash-Lite / 3.6 Flash via cofre AES-256-GCM em memória e parser nativo open-sse) com Socket Probes TCP sub-segundo (250ms–300ms) e failover determinístico para o Ollama local (qwen2.5-coder:7b-instruct-q4_K_M na porta 11434 em GPU RTX 3050 sob demanda a $0.00) e LM Studio (:1234 DeepSeek-Coder-V2-Lite MoE).
Diferenciais frente a LangGraph, CrewAI e LiteLLM:
- Soluciona o Trilema de Latência, Custo e Governança Estrita ao desacoplar a triagem cognitiva O(1) (feita pelo Laya System 1 em CPU em ~25ms a $0.00) do raciocínio profundo O(N) (Sistema 2), evitando loops autorregressivos caros de múltiplos agentes.
- Combina Stage Gates TLC v3 determinísticos e Enclave de Auditoria SHA-256 com proteção PII Guard LGPD antes de qualquer tráfego externo.`
  },
  {
    id: 'pcl-rag-architectures-benchmark',
    title: 'Arquitetura de RAG Corporativo: Evolução do Naive RAG ao GraphRAG e Agentic RAG',
    category: 'benchmark',
    tags: ['rag', 'naive rag', 'advanced rag', 'modular rag', 'graphrag', 'agentic rag', 'hyde', 'reranking', 'self-rag', 'crag'],
    sourceFile: 'c:/PromptCore_Labs/architecture/decisions/ADR-0005-tripartite-memory-system-one-evolution.md',
    content: `Referência Arquitetural sobre os 5 Paradigmas de RAG (Retrieval-Augmented Generation):
1. Naive RAG: Fluxo linear clássico de Indexação em chunks fixos -> Busca por similaridade de cosseno (top-K) -> Injeção direta no prompt. Baixo custo inicial, mas sofre com perda de contexto relacional, ruído no topo da recuperação e alucinações em perguntas complexas.
2. Advanced RAG: Introduz otimizações de Pré-Recuperação (Query Rewriting, Query Expansion e HyDE - Hypothetical Document Embeddings) e Pós-Recuperação (Hybrid Search combinando BM25 esparso + Vetorial denso via RRF, seguido de Cross-Encoder Reranking e compressão de prompt).
3. Modular RAG: Desacopla o pipeline em módulos independentes e plugáveis (roteadores semânticos, caches, buscadores híbridos, memória e avaliadores), permitindo fluxos condicionais e iterativos adaptados à complexidade da consulta.
4. GraphRAG: Extrai entidades e relacionamentos estruturados na ingestão para construir um Knowledge Graph acoplado aos vetores (Hybrid GraphRAG). No PCL AEOS, implementado de forma soberana no PostgreSQL 17 + PGVector (Temporal Graph-RAG) sem custo de memória JVM/Neo4j.
5. Agentic RAG (Self-RAG e CRAG - Corrective RAG): Transforma o pipeline em um ciclo autônomo onde agentes planejam buscas e avaliam suporte factual (acelerado no PCL AEOS v3.6 pelo Laya System 1 em CPU em ~25ms com corte de relevância >= 0.40).`
  },
  {
    id: 'cortex-architecture-engine',
    title: 'Cortex Enterprise Engine, Visualizer & Guardião Mermaid v7',
    category: 'architecture',
    tags: ['cortex', 'canvas', 'dag', 'observabilidade', 'stage gates', 'tlc v3', 'mermaid v7', 'archify'],
    sourceFile: 'c:/PromptCore_Labs/.agents/skills/cortex/SKILL.md',
    content: `O Cortex é a Persona de Inteligência, Visualização de Arquitetura e Guardião dos Stage Gates TLC v3 do PCL AEOS.
Supervisiona a execução em grafos acíclicos dirigidos (DAG) no PCL Cockpit (:3001), compila diagramas HTML interativos autocontidos via archify.mjs (--quality showcase, 9/9 checks) e governa todos os diagramas Mermaid da documentação sob o Padrão Calibrado v7 (orientação panorâmica flowchart LR, caixas largas de 2 linhas, subgrafos colunares e contraste WCAG AAA).`
  },
  {
    id: 'headless-byos-zero-bin',
    title: 'Headless BYOS, Zero-Bin Custody & PII Guard LGPD',
    category: 'architecture',
    tags: ['byos', 'zero-bin', 'google drive', 'onedrive', 'storage', 'soberania', 'pii guard', 'lgpd'],
    sourceFile: 'c:/PromptCore_Labs/projects/Living Architecture PCL AEOS/docs/security-compliance/README.md',
    content: `A política Zero-Bin Custody garante que nenhum byte de artefato confidencial do cliente permaneça sob custódia em instâncias intermediárias de terceiros. A sincronização de documentos, atas e relatórios flui diretamente para os tenants corporativos do operador (Headless BYOS) com sanitização inline pelo PII Guard LGPD no cliente e atestação imutável SHA-256.`
  },
  {
    id: 'pcl-cockpit-competitive-matrix',
    title: 'Matriz Competitiva & Benchmark Empírico Cego v3.6: PCL Cockpit (4.95) vs Gemini (4.45), ChatGPT (4.30), Copilot (3.80) e Jumpad.ai',
    category: 'benchmark',
    tags: ['cockpit', 'pcl cockpit', 'jumpad', 'jumped ai', 'read ai', 'chatgpt', 'gemini', 'claude', 'copilot', 'perplexity', 'benchmark', '4.95', 'diferenciais', 'soberania'],
    sourceFile: 'c:/PromptCore_Labs/knowledge/warm/competitive/PCL_COCKPIT_COMPETITIVE_MATRIX.md',
    content: `Resultado do Benchmark Empírico Cego de 5 Turnos (v3.6) e Matriz Competitiva Corporativa:
1. Placar Consolidado do Teste Cego (Escala 1.0 a 5.0):
   - PCL Cockpit v3.6: Média Global 4.95 / 5.0 (Memória Multi-Turn: 5.0 | Síntese Cross-Turn: 5.0 | Discernimento Temporal 2026: 4.8 | Gating de Busca sem Poluição: 5.0 | Fontes Retráteis: 4.9 | Transparência de Pipeline & FinOps SHA-256: 5.0).
   - Google Gemini: Média Global 4.45 / 5.0 (Excelente síntese e busca, porém caixa-preta em telemetria/auditoria: 2.0).
   - OpenAI ChatGPT: Média Global 4.30 / 5.0 (Excelente retenção multi-turn e sobriedade temporal, porém caixa-preta em telemetria/auditoria: 1.0).
   - Microsoft Copilot: Média Global 3.80 / 5.0 (Busca Bing excessivamente agressiva poluindo perguntas teóricas: 3.5 e caixa-preta: 1.5).
2. PCL Cockpit vs Jumpad.ai / Read.ai:
   - Custódia & FinOps: PCL Cockpit opera a $0.00/mês no modo soberano local com Zero-Bin Custody, Laya em CPU (0 MB VRAM, ~25ms) e Dual-Plex DAG Canvas; Jumpad.ai e Read.ai dependem de nuvem multitenant paga por assento.`
  },
  {
    id: 'pcl-cockpit-spec-v36',
    title: 'Especificação Funcional e Arquitetural do PCL Cockpit v3.6 (PromptCore Labs Cockpit)',
    category: 'architecture',
    tags: ['cockpit', 'pcl cockpit', 'v3.6', 'especificacao', 'canvas', 'dag', 'cortex', 'laya', 'stepper', 'tokenaquaorb', 'iso 42001', '3001'],
    sourceFile: 'c:/PromptCore_Labs/knowledge/warm/cockpit/PCL_COCKPIT_SPEC_V3.6.md',
    content: `O PCL Cockpit v3.6 (porta :3001) é o centro de comando agêntico soberano do ecossistema PromptCoreLabs_AEOS:
- Layout Liquid Glass Bento Grid em 3 Colunas Retráteis: Left Utility Sidebar (acordeão de projetos + até 5 multi-abas simultâneas), Central Workspace Dual-Plex (Chat Stream + Cortex Canvas DAG + Split-Screen) e Right Sidebar (Health Probes TCP <300ms + PCL Sovereign Drawer 380px–850px com 4 abas: Documento, SHA-256, Custos FinOps e LGPD/PII).
- Live Execution Stepper (5 Fases Síncronas): (1) Triagem Semântica Laya CPU INT8 ~20ms/0 MB VRAM; (2) Consulta à Base Canônica PCL AEOS; (3) Pesquisa Web Condicional por Intention Gating; (4) Síntese Factual Fast-Path Gemini 3.5 Flash-Lite ou Ollama Local qwen2.5-coder:7b; (5) Atestação Criptográfica SHA-256 no PostgreSQL 17.
- Inovações v3.6: Memória Multi-Turn com Sliding Window (fim definitivo da amnésia), Intention Gating (zero busca forçada em perguntas conceituais), pílula retrátil "Fontes Consultadas (n) v", TokenAquaOrb 3D e PII Guard LGPD.`
  },
  {
    id: 'pcl-cold-discarded-hypotheses',
    title: 'Registro Canônico de Hipóteses Descartadas & Anti-Patterns (Cold Storage: HIP-001 a HIP-008)',
    category: 'architecture',
    tags: ['cold storage', 'hipoteses descartadas', 'anti-patterns', 'neo4j', 'bitrix24', 'mocks', 'sse', 'stateless', 'hip-007', 'hip-008'],
    sourceFile: 'c:/PromptCore_Labs/knowledge/cold/discarded_hypotheses/DISCARDED_HYPOTHESES_LOG.md',
    content: `O Cold Storage preserva as 8 decisões técnicas formalmente rejeitadas no PCL AEOS para impedir regressões arquiteturais:
- HIP-001: Descarte de Neo4j/JVM (4–8GB RAM) em favor do Temporal Graph-RAG no PostgreSQL 17 + PGVector ($0.00).
- HIP-002: Descarte de Bitrix24 Slide-Over genérico em favor do PCL Sovereign Drawer (380px–850px com SHA-256).
- HIP-003: Descarte absoluto de Hardcoded Mocks (Política Zero Mocks).
- HIP-004: Descarte de timeouts HTTP longos (25s–60s) em favor de Socket Probes TCP de 250ms–300ms.
- HIP-005: Descarte de response.json() monolítico sobre streams SSE em favor do parser universal open-sse.
- HIP-006: Descarte de injeção indiscriminada de ADRs internos em perguntas gerais de mercado.
- HIP-007 (v3.6): Descarte de busca web obrigatória em 100% dos turnos em favor de Intention Gating via Laya CPU.
- HIP-008 (v3.6): Descarte de chamadas stateless single-turn em favor de Memória Multi-Turn com Sliding Window.`
  },
  {
    id: 'pcl-canonical-adr-index',
    title: 'Índice Canônico de Decisões Arquiteturais do PCL AEOS (ADRs 0001 a 0010)',
    category: 'adr',
    tags: ['adr', 'adrs', 'adr-0001', 'adr-0002', 'adr-0003', 'adr-0004', 'adr-0005', 'adr-0006', 'adr-0007', 'adr-0008', 'adr-0009', 'adr-0010', 'decisoes'],
    sourceFile: 'c:/PromptCore_Labs/knowledge/warm/architecture/ADR_INDEX.md',
    content: `Registro canônico harmonizado das decisões arquiteturais mandatórias do ecossistema PCL AEOS v3.6:
- ADR-0001 a ADR-0004 (Fundação & Kernel): Segregação Memory/Knowledge, Bootstrap Oficial, Higiene Constitucional (FOUNDATION.md), Governança TLC Spec-Driven v3 e Isolamento Mesh Zero Trust.
- ADR-0005 (Sistema 1 & Memória): Coprocessador Laya System One em CPU (INT8 / 0 MB VRAM) vs JEV e Memória Cognitiva Tripartida (PostgreSQL 17 + PGVector).
- ADR-0006 (Resiliência & Taxonomia): Plano DRP Tripartido Cifrado AES-256 no Cloudflare R2 (RTO 7.18s) e Taxonomia RAG Canônica em knowledge/.
- ADR-0007 (Cockpit Cognitivo v3.6): Memória Multi-Turn com Sliding Window, Intention Gating via Laya CPU, Desacoplamento de Fontes em Pílula Retrátil e Live Stepper SHA-256.
- ADR-0008 a ADR-0010 (Living Architecture & Harness): Persistência de Volumes Docker, Triage Gate Dual-Track SDD (Lean vs Full) e Integração Auditável da Squad Prototyping ao Antigravity Harness.`
  }
];

class LocalKnowledgeService {
  /**
   * Busca no acervo canônico de documentos e especificações do PCL AEOS.
   */
  public search(query: string, threshold: number = 0.25): LocalKnowledgeMatch[] {
    const clean = query.toLowerCase();
    const tokens = clean
      .replace(/[?!,.:;()"/]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);

    const matches: LocalKnowledgeMatch[] = [];

    for (const doc of CANONICAL_PCL_KNOWLEDGE) {
      let score = 0;
      const matchedSnippets: string[] = [];

      // Verifica tags com match exato ou de palavra inteira
      for (const tag of doc.tags) {
        if (clean.includes(tag)) {
          score += 0.45;
        }
      }

      // Verifica título
      for (const token of tokens) {
        if (doc.title.toLowerCase().includes(token)) {
          score += 0.25;
        }
      }

      // Verifica conteúdo
      const docLower = doc.content.toLowerCase();
      for (const token of tokens) {
        if (token.length > 3 && docLower.includes(token)) {
          score += 0.1;
          const idx = docLower.indexOf(token);
          const start = Math.max(0, idx - 60);
          const end = Math.min(doc.content.length, idx + 140);
          matchedSnippets.push(`...${doc.content.slice(start, end).trim()}...`);
        }
      }

      if (score >= threshold) {
        matches.push({
          doc,
          relevanceScore: Math.min(Number(score.toFixed(2)), 1.0),
          matchedSnippets: Array.from(new Set(matchedSnippets)).slice(0, 3)
        });
      }
    }

    return matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

export const localKnowledgeService = new LocalKnowledgeService();
