import { Agent } from '../../types';

export interface SquadDefinition {
  id: string;
  name: string;
  department: string;
  lead: string;
  leadEmail?: string;
  budgetCapTokens: number;
  monthlySpendUSD: number;
  status: 'active' | 'review' | 'archived';
  agents: AgentDefinition[];
  orchestratorSource?: 'paperclip' | 'langchain' | 'crewai' | 'autogen' | 'manual';
}

export interface AgentDefinition extends Agent {
  systemPrompt?: string;
  autonomyLevel: 'Assistido (TLC v3)' | 'Supervisionado' | 'Autônomo';
  isLocalSovereign: boolean;
  avatarIcon?: string;
  monthlyBudgetCapUSD?: number;
  tier?: 'TIER-1' | 'TIER-2' | 'TIER-3';
}

const STORAGE_KEY = 'pcl_cockpit_squads_v1';
const UPDATE_EVENT = 'pcl:squads-updated';

/**
 * Squads e Agentes canônicos refletindo a estrutura real do PaperClip
 * (PaperClip-Companies/promptcore-labs - COMPANY.md & .paperclip.yaml)
 */
const DEFAULT_SQUADS: SquadDefinition[] = [
  {
    id: 'sq-estrategia-gov',
    name: 'Cluster Estratégia & Governança (PaperClip)',
    department: 'Holding & Gestão de Verticais (COMPANY.md)',
    lead: 'CEO (Eduardo)',
    leadEmail: 'eduardo@promptcorelabs.com',
    budgetCapTokens: 50000000,
    monthlySpendUSD: 0.00,
    status: 'active',
    orchestratorSource: 'paperclip',
    agents: [
      {
        id: 'ag-ceo',
        name: 'CEO Agent',
        role: 'Orquestração Estratégica & 15 Verticais de Negócio',
        model: 'cloud-high-logic / local Ollama',
        status: 'active',
        assignedSkills: ['business-model', 'strategic-decision', 'cortex'],
        systemPrompt: 'CEO da Holding Digital PromptCore Labs operando sob o sistema operacional soberano PCL AEOS.',
        autonomyLevel: 'Autônomo',
        isLocalSovereign: true,
        avatarIcon: 'Brain',
        monthlyBudgetCapUSD: 0,
        tier: 'TIER-1'
      },
      {
        id: 'ag-squad-estrategia',
        name: 'Squad Estratégia',
        role: 'Spec-Driven Development, PRD & ADRs',
        model: 'Ollama qwen2.5-coder:7b-instruct-q4_K_M',
        status: 'active',
        assignedSkills: ['tlc-spec-driven', 'create-adr', 'create-prd'],
        systemPrompt: 'Especialista em SDD e decisões de arquitetura duráveis (ADR-0001 a ADR-0010).',
        autonomyLevel: 'Assistido (TLC v3)',
        isLocalSovereign: true,
        avatarIcon: 'Layers',
        monthlyBudgetCapUSD: 0,
        tier: 'TIER-1'
      },
      {
        id: 'ag-squad-infra-sec',
        name: 'Squad Infra & DevSecOps',
        role: 'CISO, Blindagem de Uptime 99.9% e 100% LGPD',
        model: 'FastMCP CPU INT8 (:20140)',
        status: 'active',
        assignedSkills: ['pii-redactor-guard', 'accidental-data-loss-prevention'],
        systemPrompt: 'Guardião de segurança, infraestrutura e conformidade regulatória ISO 27001/42001.',
        autonomyLevel: 'Supervisionado',
        isLocalSovereign: true,
        avatarIcon: 'ShieldCheck',
        monthlyBudgetCapUSD: 0,
        tier: 'TIER-1'
      },
      {
        id: 'ag-bot-financial',
        name: 'Bot Financial (EBITDA Shield)',
        role: 'Precificação de IA, Margens e Forecast D-0',
        model: 'Ollama nomic-embed-text:latest',
        status: 'active',
        assignedSkills: ['ai-pricing', 'finops-budget-enforcer'],
        systemPrompt: 'Garantidor de margem de lucro, FinOps corporativo e custo marginal $0.00 local.',
        autonomyLevel: 'Autônomo',
        isLocalSovereign: true,
        avatarIcon: 'DollarSign',
        monthlyBudgetCapUSD: 0,
        tier: 'TIER-2'
      }
    ]
  },
  {
    id: 'sq-eng-soberana',
    name: 'Cluster Engenharia Soberana & SDD (PaperClip)',
    department: 'Engenharia de Software & IA Soberana',
    lead: 'Cortex Master & Arch Lead',
    leadEmail: 'eng@promptcorelabs.com',
    budgetCapTokens: 40000000,
    monthlySpendUSD: 0.00,
    status: 'active',
    orchestratorSource: 'paperclip',
    agents: [
      {
        id: 'ag-cortex',
        name: 'Cortex Master',
        role: 'Orquestrador de Arquitetura & Diagrams SVG/Mermaid',
        model: 'Ollama qwen2.5-coder:7b-instruct-q4_K_M',
        status: 'active',
        assignedSkills: ['cortex', 'accidental-data-loss-prevention'],
        systemPrompt: 'Você é a persona Cortex, autoridade de governança de arquitetura corporativa e visualização do PCL AEOS.',
        autonomyLevel: 'Assistido (TLC v3)',
        isLocalSovereign: true,
        avatarIcon: 'Cpu',
        monthlyBudgetCapUSD: 0,
        tier: 'TIER-1'
      },
      {
        id: 'ag-laya',
        name: 'Laya System One',
        role: 'Coprocessador de Decisão Rápida & Gating em CPU',
        model: 'FastMCP CPU INT8 (:20140)',
        status: 'active',
        assignedSkills: ['laya-fast-classifier', 'pii-redactor-guard'],
        systemPrompt: 'Classificador não-autorregressivo ultrarrápido (20ms, 0 MB VRAM) para triagem de intenção e guardrails.',
        autonomyLevel: 'Autônomo',
        isLocalSovereign: true,
        avatarIcon: 'Zap',
        monthlyBudgetCapUSD: 0,
        tier: 'TIER-1'
      },
      {
        id: 'ag-squad-prototyping',
        name: 'Squad Prototyping & UI',
        role: 'Prototipagem Ágil & Design System Executivo',
        model: 'Claude 3.5 Sonnet / Local Hybrid',
        status: 'active',
        assignedSkills: ['ui-mockups-antigravity', 'rapid-prototyping'],
        systemPrompt: 'Desenvolvimento e prototipagem de produtos com SDD de alta fidelidade e ergonomia de ponta.',
        autonomyLevel: 'Assistido (TLC v3)',
        isLocalSovereign: false,
        avatarIcon: 'Palette',
        monthlyBudgetCapUSD: 20,
        tier: 'TIER-1'
      },
      {
        id: 'ag-bot-agile',
        name: 'Bot Agile Master',
        role: 'Validação de Sprints, Heartbeats & DAGs',
        model: 'Ollama nomic-embed-text:latest',
        status: 'active',
        assignedSkills: ['sprint-plan', 'retro'],
        systemPrompt: 'Orquestrador de execução ágil e monitoramento de tarefas agênticas sem amnésia.',
        autonomyLevel: 'Supervisionado',
        isLocalSovereign: true,
        avatarIcon: 'Paperclip',
        monthlyBudgetCapUSD: 0,
        tier: 'TIER-2'
      }
    ]
  },
  {
    id: 'sq-revops-growth',
    name: 'Cluster RevOps, Marketing & Growth Ops',
    department: 'GTM, Programmatic SEO & Automação Comercial',
    lead: 'Squad RevOps Lead',
    leadEmail: 'growth@promptcorelabs.com',
    budgetCapTokens: 30000000,
    monthlySpendUSD: 15.00,
    status: 'active',
    orchestratorSource: 'paperclip',
    agents: [
      {
        id: 'ag-squad-revops',
        name: 'Squad RevOps',
        role: 'CRM Salesforce/HubSpot, Signal-to-Action & SDR AI',
        model: 'cloud-fast-execution',
        status: 'active',
        assignedSkills: ['ai-sdr', 'ai-cold-outreach'],
        systemPrompt: 'Automação de processos comerciais com integração bilateral a CRMs corporativos.',
        autonomyLevel: 'Supervisionado',
        isLocalSovereign: false,
        avatarIcon: 'TrendingUp',
        monthlyBudgetCapUSD: 15,
        tier: 'TIER-2'
      },
      {
        id: 'ag-squad-growth',
        name: 'Squad Growth & DS',
        role: 'Programmatic SEO, Análise de Cohort & Métricas GTM',
        model: 'cloud-fast-execution',
        status: 'active',
        assignedSkills: ['ai-seo', 'growth-loops', 'cohort-analysis'],
        systemPrompt: 'Otimização de crescimento analítico e distribuição em escala.',
        autonomyLevel: 'Supervisionado',
        isLocalSovereign: false,
        avatarIcon: 'Activity',
        monthlyBudgetCapUSD: 10,
        tier: 'TIER-2'
      },
      {
        id: 'ag-squad-criacao',
        name: 'Squad Criação & Mídia',
        role: 'Branding, Copywriting, UGC Ads & Produção de Mídia',
        model: 'cloud-fast-execution',
        status: 'active',
        assignedSkills: ['ai-ugc-ads', 'positioning-ideas'],
        systemPrompt: 'Criação de narrativas visuais e posicionamento executivo no padrão Sexy Canvas.',
        autonomyLevel: 'Assistido (TLC v3)',
        isLocalSovereign: false,
        avatarIcon: 'Sparkles',
        monthlyBudgetCapUSD: 15,
        tier: 'TIER-2'
      }
    ]
  }
];

export const squadService = {
  getSquads(): SquadDefinition[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[squadService] Falha ao ler squads do localStorage, usando padrões PaperClip:', e);
    }
    return DEFAULT_SQUADS;
  },

  saveSquads(squads: SquadDefinition[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(squads));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: squads }));
    } catch (e) {
      console.error('[squadService] Falha ao salvar squads no localStorage:', e);
    }
  },

  addSquad(newSquad: Omit<SquadDefinition, 'id'>): SquadDefinition {
    const squads = this.getSquads();
    const created: SquadDefinition = {
      ...newSquad,
      id: `sq-${Date.now()}`
    };
    squads.push(created);
    this.saveSquads(squads);
    return created;
  },

  updateSquad(squadId: string, updates: Partial<SquadDefinition>): void {
    const squads = this.getSquads();
    const index = squads.findIndex(s => s.id === squadId);
    if (index !== -1) {
      squads[index] = { ...squads[index], ...updates };
      this.saveSquads(squads);
    }
  },

  deleteSquad(squadId: string): void {
    const squads = this.getSquads();
    const filtered = squads.filter(s => s.id !== squadId);
    this.saveSquads(filtered);
  },

  addAgent(squadId: string, agentData: Omit<AgentDefinition, 'id'>): AgentDefinition {
    const squads = this.getSquads();
    const squadIndex = squads.findIndex(s => s.id === squadId);
    if (squadIndex === -1) {
      throw new Error(`Squad com ID ${squadId} não encontrado`);
    }

    const createdAgent: AgentDefinition = {
      ...agentData,
      id: `ag-${Date.now()}`
    };

    squads[squadIndex].agents.push(createdAgent);
    this.saveSquads(squads);
    return createdAgent;
  },

  updateAgent(squadId: string, agentId: string, updates: Partial<AgentDefinition>): void {
    const squads = this.getSquads();
    const squadIndex = squads.findIndex(s => s.id === squadId);
    if (squadIndex === -1) return;

    const agentIndex = squads[squadIndex].agents.findIndex(a => a.id === agentId);
    if (agentIndex === -1) return;

    squads[squadIndex].agents[agentIndex] = {
      ...squads[squadIndex].agents[agentIndex],
      ...updates
    };
    this.saveSquads(squads);
  },

  deleteAgent(squadId: string, agentId: string): void {
    const squads = this.getSquads();
    const squadIndex = squads.findIndex(s => s.id === squadId);
    if (squadIndex === -1) return;

    squads[squadIndex].agents = squads[squadIndex].agents.filter(a => a.id !== agentId);
    this.saveSquads(squads);
  },

  toggleAgentStatus(squadId: string, agentId: string): void {
    const squads = this.getSquads();
    const squadIndex = squads.findIndex(s => s.id === squadId);
    if (squadIndex === -1) return;

    const agent = squads[squadIndex].agents.find(a => a.id === agentId);
    if (!agent) return;

    agent.status = agent.status === 'active' ? 'standby' : 'active';
    this.saveSquads(squads);
  },

  resetToDefaults(): SquadDefinition[] {
    this.saveSquads(DEFAULT_SQUADS);
    return DEFAULT_SQUADS;
  },

  /**
   * Importador Universal de Configurações Agênticas
   * Suporta PaperClip YAML/MD, LangChain/LangGraph, CrewAI e AutoGen
   */
  importOrchestratorConfig(format: 'paperclip' | 'langchain' | 'crewai' | 'autogen', textContent: string): {
    success: boolean;
    importedSquadsCount: number;
    importedAgentsCount: number;
    message: string;
  } {
    try {
      const currentSquads = this.getSquads();
      let newAgentsCount = 0;

      if (format === 'paperclip') {
        // Parse de .paperclip.yaml ou COMPANY.md
        const lines = textContent.split('\n');
        const extractedAgents: AgentDefinition[] = [];
        let inAgentsBlock = false;
        let currentAgentKey = '';

        lines.forEach(line => {
          if (line.trim().startsWith('agents:')) {
            inAgentsBlock = true;
            return;
          }
          if (inAgentsBlock) {
            const agentMatch = line.match(/^\s{2}([a-zA-Z0-9_-]+):/);
            if (agentMatch) {
              currentAgentKey = agentMatch[1];
              extractedAgents.push({
                id: `ag-imported-${currentAgentKey}-${Date.now()}`,
                name: currentAgentKey.replace(/-/g, ' ').toUpperCase(),
                role: `Agente importado do PaperClip (${currentAgentKey})`,
                model: 'cloud-fast-execution / Ollama Local',
                status: 'active',
                assignedSkills: ['cortex', 'tlc-spec-driven'],
                autonomyLevel: 'Supervisionado',
                isLocalSovereign: true,
                avatarIcon: 'Bot',
                monthlyBudgetCapUSD: 0,
                tier: 'TIER-2'
              });
            }
          }
        });

        if (extractedAgents.length > 0) {
          const importedSquad: SquadDefinition = {
            id: `sq-paperclip-import-${Date.now()}`,
            name: `Importação PaperClip (${new Date().toLocaleDateString()})`,
            department: 'Orquestração Importada PaperClip',
            lead: 'PaperClip Engine',
            leadEmail: 'admin@promptcorelabs.com',
            budgetCapTokens: 25000000,
            monthlySpendUSD: 0,
            status: 'active',
            orchestratorSource: 'paperclip',
            agents: extractedAgents
          };
          currentSquads.push(importedSquad);
          newAgentsCount = extractedAgents.length;
          this.saveSquads(currentSquads);
          return {
            success: true,
            importedSquadsCount: 1,
            importedAgentsCount: newAgentsCount,
            message: `Sucesso: 1 Squad e ${newAgentsCount} agentes importados do PaperClip!`
          };
        }
      }

      // Fallback genérico para JSON (LangChain / CrewAI / AutoGen)
      if (textContent.trim().startsWith('{') || textContent.trim().startsWith('[')) {
        const parsed = JSON.parse(textContent);
        const agentsToImport: AgentDefinition[] = [];

        if (Array.isArray(parsed)) {
          parsed.forEach((item: any, idx: number) => {
            agentsToImport.push({
              id: item.id || `ag-${format}-${idx}-${Date.now()}`,
              name: item.name || item.role || `Agente ${format} #${idx + 1}`,
              role: item.role || item.description || 'Especialista Agêntico',
              model: item.model || item.llm || 'cloud-fast-execution',
              status: 'active',
              assignedSkills: Array.isArray(item.tools || item.skills) ? item.tools || item.skills : ['cortex'],
              systemPrompt: item.goal || item.backstory || item.systemPrompt || '',
              autonomyLevel: 'Supervisionado',
              isLocalSovereign: true,
              avatarIcon: 'Bot',
              monthlyBudgetCapUSD: 0
            });
          });
        }

        if (agentsToImport.length > 0) {
          const newSquad: SquadDefinition = {
            id: `sq-${format}-${Date.now()}`,
            name: `Squad ${format.toUpperCase()} Importado`,
            department: 'Engenharia de Multi-Agentes',
            lead: 'Orquestrador Externo',
            budgetCapTokens: 30000000,
            monthlySpendUSD: 0,
            status: 'active',
            orchestratorSource: format,
            agents: agentsToImport
          };
          currentSquads.push(newSquad);
          this.saveSquads(currentSquads);
          return {
            success: true,
            importedSquadsCount: 1,
            importedAgentsCount: agentsToImport.length,
            message: `Sucesso: Squad ${format.toUpperCase()} com ${agentsToImport.length} agentes importado!`
          };
        }
      }

      return {
        success: false,
        importedSquadsCount: 0,
        importedAgentsCount: 0,
        message: 'Nenhum agente ou squad reconhecido no arquivo fornecido. Verifique a sintaxe YAML/JSON.'
      };
    } catch (e: any) {
      return {
        success: false,
        importedSquadsCount: 0,
        importedAgentsCount: 0,
        message: `Erro ao importar arquivo: ${e.message}`
      };
    }
  },

  async syncFromPaperClipDisk(): Promise<{
    ok: boolean;
    totalSquads: number;
    totalAgents: number;
    companyHash?: string;
    repoPath?: string;
    syncedAt?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/aeos/paperclip/sync', { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.squads) && data.squads.length > 0) {
        this.saveSquads(data.squads);
        return {
          ok: true,
          totalSquads: data.squads.length,
          totalAgents: data.stats?.totalAgentsOnDisk || data.squads.reduce((acc: number, s: any) => acc + s.agents.length, 0),
          companyHash: data.companyHash,
          repoPath: data.repoPath,
          syncedAt: data.syncedAt
        };
      }
      return { ok: false, totalSquads: 0, totalAgents: 0, error: 'Nenhum squad retornado do disco.' };
    } catch (e: any) {
      return { ok: false, totalSquads: 0, totalAgents: 0, error: e?.message || 'Backend indisponível' };
    }
  },

  subscribe(callback: (squads: SquadDefinition[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<SquadDefinition[]>;
      callback(customEvent.detail || this.getSquads());
    };
    window.addEventListener(UPDATE_EVENT, handler);
    return () => window.removeEventListener(UPDATE_EVENT, handler);
  }
};
