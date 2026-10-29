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
    tags: ['laya', 'jev', 'typesafe', 'convai', 'system one', 'memoria', 'graph-rag', 'cpu', '0 mb vram', 'classificador', 'modernbert', 'onnx', 'staleness'],
    sourceFile: 'c:/PromptCore_Labs/architecture/decisions/ADR-0005-tripartite-memory-system-one-evolution.md',
    content: `No ecossistema de IA moderna, Modelos de Sistema 1 (System One Decision Models) são modelos não-autorregressivos de tomada de decisão rápida, estruturada e calibrada probabilisticamente, em contraste com LLMs autorregressivos (Sistema 2). Em vez de gerar parágrafos de texto, recebem um estado estruturado e perguntas tipadas, retornando probabilidades calibradas sem risco de alucinação de parsing.

Comparação Técnica e de Mercado: JEV (TypeSafe AI) vs LAYA (Convai Innovations) + Integração PCL AEOS:
1. JEV (TypeSafe AI — https://typesafe.ai/):
   - Licença & Modelo: Proprietário / Serviço gerenciado em nuvem (SaaS) desenvolvido pela TypeSafe AI.
   - Hospedagem & Execução: API Cloud gerenciada pela TypeSafe AI (sujeita a latência de rede externa e cobrança por requisição).
   - Especificação: Define a especificação de API de decisão tipada (boolean, choice, score) consumida por agentes autônomos.
2. LAYA (Convai Innovations — https://huggingface.co/convaiinnovations/laya & Laya Studio):
   - Licença & Modelo: Open-source (Licença Apache 2.0), multilíngue e não-autorregressivo, desenvolvido pela Convai Innovations (pesquisa acadêmica documentada em arXiv:2609.28940v1: "Calibrated Decision Models for Autonomous Penetration-Testing Harnesses: JEV and Laya as System One Decision Layers for LLM-Driven Pentest Agents").
   - Compatibilidade: Compartilha a mesma especificação de API e formatos de dados do Jev, porém permite auto-hospedagem (On-premise, Docker, ONNX Runtime) ou uso via Laya Studio.
3. Integração Soberana no PCL AEOS (ADR-0005 — Microserviço pcl-laya):
   - No PCL AEOS, o Laya é implantado localmente em container dedicado (porta 20140 / MCP Server stdio) operando 100% em CPU host (ONNX Runtime INT8) com 0 MB de VRAM alocada na GPU NVIDIA RTX 3050 (~20 a 35ms de latência determinística e custo $0.00).
   - Atua em 4 frentes críticas: (a) Staleness & Contradiction Check em documentos corporativos; (b) RAG Answerability Check antes de invocar LLMs; (c) Guardrail Screening contra prompt injection; e (d) Tool Gating & Routing para o OmniRoute.`
  },
  {
    id: 'skill-laya-spec',
    title: 'Especificação da Skill Laya (PCL AEOS Coprocessor)',
    category: 'skill',
    tags: ['laya', 'mcp', 'coprocessador', 'system one', 'classificador', 'onnx', 'cpu'],
    sourceFile: 'c:/PromptCore_Labs/.agents/skills/laya/SKILL.md',
    content: `A skill laya provê interface para o microserviço pcl-laya (porta 20140 ou MCP stdio via mcp_server.py).
Executa inferência quantizada em INT8 via ONNX Runtime CPUExecutionProvider com latência alvo < 40ms e 0 MB VRAM.
Permite avaliação binária calibrada (evaluate_binary), detecção de contradições factuais (check_contradiction), escolha tipada (evaluate_choice) e cálculo de score contínuo (evaluate_score).`
  },
  {
    id: 'omniroute-hybrid-gateway',
    title: 'OmniRoute Hybrid AI Gateway (:20130) vs LiteLLM / LangGraph / CrewAI',
    category: 'architecture',
    tags: ['omniroute', 'roteamento', 'gateway', 'gemini', 'ollama', 'qwen', 'fallback', 'langgraph', 'crewai', 'litellm', 'trilema'],
    sourceFile: 'c:/PromptCore_Labs/OmniRoute/README.md',
    content: `O OmniRoute é o gateway de roteamento de inferência híbrida do PCL AEOS rodando na porta 20130.
Orquestra modelos de fronteira em nuvem (Google Gemini Flash/Pro, Claude 3.5 Sonnet, GPT-4o) com failover determinístico sub-segundo para o Ollama local (qwen2.5-coder:7b-instruct-q4_K_M na porta 11434).
Diferenciais frente a LangGraph, CrewAI e LiteLLM:
- Soluciona o Trilema de Latência, Custo e Governança Estrita ao desacoplar a triagem cognitiva (feita pelo Laya System 1 em CPU em ~25ms a $0.00) do raciocínio profundo (Sistema 2), evitando loops autorregressivos caros de múltiplos agentes como ocorre em CrewAI e LangGraph tradicional.
- Combina Stage Gates TLC v3 determinísticos e Enclave de Auditoria SHA-256 com proteção PII Guard antes de qualquer tráfego externo.`
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
4. GraphRAG: Extrai entidades e relacionamentos estruturados na ingestão para construir um Knowledge Graph acoplado aos vetores (Hybrid GraphRAG). Essencial para raciocínio multi-hop, visão holística de domínios corporativos e rastreabilidade de linhagem.
5. Agentic RAG (Self-RAG e CRAG - Corrective RAG): Transforma o pipeline em um ciclo autônomo onde agentes planejam buscas, avaliam a relevância e suporte factual dos trechos recuperados (No PCL AEOS, essa avaliação de Answerability e Contradiction é acelerada pelo Laya System 1 em CPU em ~25ms) e acionam buscas corretivas na Web caso o acervo interno seja insuficiente.`
  },
  {
    id: 'cortex-architecture-engine',
    title: 'Cortex Enterprise Engine & Visualizer',
    category: 'architecture',
    tags: ['cortex', 'canvas', 'dag', 'observabilidade', 'stage gates', 'tlc v3'],
    sourceFile: 'c:/PromptCore_Labs/architecture/principles.md',
    content: `O Cortex é o orquestrador de arquitetura e guardião dos Stage Gates TLC v3 do PCL AEOS.
Supervisiona a execução em grafos acíclicos dirigidos (DAG), integrando observabilidade de nós ativos, governança ISO 27001/42001 e validação de artefatos gerados pelos agentes.`
  },
  {
    id: 'headless-byos-zero-bin',
    title: 'Headless BYOS & Arquitetura Zero-Bin Custody',
    category: 'architecture',
    tags: ['byos', 'zero-bin', 'google drive', 'onedrive', 'storage', 'soberania'],
    sourceFile: 'c:/PromptCore_Labs/architecture/vision.md',
    content: `A política Zero-Bin Custody garante que nenhum byte de artefato confidencial do cliente permaneça sob custódia em instâncias intermediárias. A sincronização de documentos, atas e relatórios flui diretamente para os tenants corporativos do cliente (Google Workspace e Microsoft 365) com atestação SHA-256.`
  },
  {
    id: 'pcl-cockpit-competitive-matrix',
    title: 'PCL Cockpit vs Jumpad.ai, Read.ai, ChatGPT, Gemini & Claude (Matriz Competitiva)',
    category: 'benchmark',
    tags: ['cockpit', 'pcl cockpit', 'jumpad', 'jumped ai', 'read ai', 'chatgpt', 'gemini', 'claude', 'benchmark', 'diferenciais', 'soberania'],
    sourceFile: 'c:/PromptCore_Labs/knowledge/warm/competitive/PCL_COCKPIT_COMPETITIVE_MATRIX.md',
    content: `Matriz Comparativa do PCL Cockpit (PromptCore Labs Cockpit) frente ao ecossistema corporativo:
1. PCL Cockpit vs Jumpad.ai / Read.ai:
   - Custódia de Dados: PCL Cockpit adota Headless BYOS e Zero-Bin Custody com atestação SHA-256 no tenant corporativo do cliente (Google Workspace / Microsoft 365); Jumpad.ai e Read.ai são SaaS multitenant de caixa-preta retendo transcrições e áudios em nuvem de terceiros.
   - Decisão Rápida & FinOps: Laya System One operando em CPU host (INT8) com 0 MB de VRAM (~25ms determinísticos a $0.00 de custo marginal); concorrentes usam chamadas de LLM para toda e qualquer decisão.
   - Orquestração: OmniRoute com fallback local sub-segundo para Ollama (qwen2.5-coder) em caso de blackout de rede ou cota esgotada.
2. PCL Cockpit vs ChatGPT / Gemini / Claude Enterprise:
   - Os grandes chats operam com interfaces puramente conversacionais e memória volátil, sem orquestração de DAGs, sem Stage Gates TLC v3 auditáveis e sem rastreabilidade de linhagem em banco relacional local (PostgreSQL 17 + PGVector).
   - O PCL Cockpit entrega transparência em 5 nós de pipeline, visualização gráfica via Cortex e conformidade total ISO 27001 e ISO 42001.`
  },
  {
    id: 'pcl-cockpit-spec-v35',
    title: 'Especificação Técnica do PCL Cockpit v3.5 (PromptCore Labs Cockpit)',
    category: 'architecture',
    tags: ['cockpit', 'pcl cockpit', 'especificacao', 'canvas', 'dag', 'cortex', 'laya', 'governance', 'iso 42001'],
    sourceFile: 'c:/PromptCore_Labs/knowledge/warm/cockpit/PCL_COCKPIT_SPEC_V3.5.md',
    content: `O PCL Cockpit é a central operacional executiva unificada do ecossistema PromptCoreLabs_AEOS v3.5:
- Arquitetura Frontend: React 18, TypeScript, Tailwind CSS, Lucide Icons e Vite.
- Visualizador de Arquitetura Cortex: Renderização de fluxogramas interativos e grafos acíclicos dirigidos (DAG) representando o estado em tempo real dos 5 nós operacionais.
- Telemetria e Monitoramento de Inferência: Acompanhamento de latência e custo por token em tempo real entre modelos de fronteira e o fallback local soberano.
- Painel de Governança & RAG: Integração direta com o acervo tripartite em knowledge/ (Cold, Warm, Learnings) e consulta calibrada pelo Laya System One.`
  },
  {
    id: 'pcl-canonical-adr-index',
    title: 'Índice Canônico de Decisões Arquiteturais do PCL AEOS (ADRs 0001 a 0006)',
    category: 'adr',
    tags: ['adr', 'adrs', 'adr-0001', 'adr-0002', 'adr-0003', 'adr-0004', 'adr-0005', 'adr-0006', 'decisoes', 'arquitetura'],
    sourceFile: 'c:/PromptCore_Labs/knowledge/warm/architecture/ADR_INDEX.md',
    content: `Registro canônico das decisões arquiteturais mandatórias do PCL AEOS:
- ADR-0001: Adoção da Arquitetura Monorepo Unificado para o ecossistema PCL AEOS.
- ADR-0002: Governança TLC v3 e Stage Gates determinísticos de validação de artefatos.
- ADR-0003: Orquestração Multi-Agente Híbrida via OmniRoute Gateway (:20130).
- ADR-0004: Enclave de Auditoria Criptográfica SHA-256 e Política Zero-Bin Custody (Headless BYOS).
- ADR-0005: Coprocessador System One (Laya em CPU com 0 MB VRAM) e Memória Cognitiva Tripartida (PostgreSQL 17 + PGVector).
- ADR-0006: Localização Canônica da Memória RAG (knowledge/) e Nomenclatura PCL Cockpit.`
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
