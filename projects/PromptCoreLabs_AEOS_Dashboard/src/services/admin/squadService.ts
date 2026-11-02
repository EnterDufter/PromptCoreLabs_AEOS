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
}

export interface AgentDefinition extends Agent {
  systemPrompt?: string;
  autonomyLevel: 'Assistido (TLC v3)' | 'Supervisionado' | 'Autônomo';
  isLocalSovereign: boolean;
  avatarIcon?: string;
  monthlyBudgetCapUSD?: number;
}

const STORAGE_KEY = 'pcl_cockpit_squads_v1';
const UPDATE_EVENT = 'pcl:squads-updated';

const DEFAULT_SQUADS: SquadDefinition[] = [
  {
    id: 'sq-next-gen',
    name: 'Squad Next Gen Engineering',
    department: 'Engenharia de Software & IA Soberana',
    lead: 'Eduardo Antigravity',
    leadEmail: 'eduardo@promptcorelabs.com',
    budgetCapTokens: 50000000,
    monthlySpendUSD: 0.00,
    status: 'active',
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
        avatarIcon: 'Brain',
        monthlyBudgetCapUSD: 0
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
        monthlyBudgetCapUSD: 0
      },
      {
        id: 'ag-paperclip',
        name: 'Paperclip Auditor',
        role: 'Validação de Anexos & Linhas de Execução',
        model: 'Ollama nomic-embed-text:latest',
        status: 'active',
        assignedSkills: ['paperclip-task-orchestrator', 'accidental-data-loss-prevention'],
        systemPrompt: 'Auditor de contexto e anexos em tempo real com preservação de memória sem amnésia.',
        autonomyLevel: 'Supervisionado',
        isLocalSovereign: true,
        avatarIcon: 'Paperclip',
        monthlyBudgetCapUSD: 0
      }
    ]
  },
  {
    id: 'sq-arch-living',
    name: 'Squad Arch Living & CX',
    department: 'Design System & Experiência Executiva',
    lead: 'Ana Silva',
    leadEmail: 'ana.silva@promptcorelabs.com',
    budgetCapTokens: 25000000,
    monthlySpendUSD: 42.50,
    status: 'active',
    agents: [
      {
        id: 'ag-arch-designer',
        name: 'Arch Designer',
        role: 'Renderização Visual, Design System & WCAG AAA',
        model: 'Claude 3.5 Sonnet',
        status: 'active',
        assignedSkills: ['cortex', 'action-item-extractor'],
        systemPrompt: 'Especialista em design visual de alta fidelidade e ergonomia de interfaces executivas.',
        autonomyLevel: 'Assistido (TLC v3)',
        isLocalSovereign: false,
        avatarIcon: 'Palette',
        monthlyBudgetCapUSD: 50
      },
      {
        id: 'ag-code-reviewer',
        name: 'Code Reviewer',
        role: 'Stage Gate QA & Linter Arquitetural',
        model: 'GPT-4o',
        status: 'standby',
        assignedSkills: ['accidental-data-loss-prevention', 'bigquery-sql'],
        systemPrompt: 'Revisor de conformidade de código e testes automatizados.',
        autonomyLevel: 'Supervisionado',
        isLocalSovereign: false,
        avatarIcon: 'ShieldCheck',
        monthlyBudgetCapUSD: 30
      }
    ]
  },
  {
    id: 'sq-governance-finops',
    name: 'Squad Governança & FinOps',
    department: 'Controladoria & Conformidade Regulatória',
    lead: 'Roberto Lima (Diretor de Governança)',
    leadEmail: 'roberto.lima@promptcorelabs.com',
    budgetCapTokens: 15000000,
    monthlySpendUSD: 0.00,
    status: 'active',
    agents: [
      {
        id: 'ag-finops-sentinel',
        name: 'FinOps Sentinel',
        role: 'Guardião de Teto Orçamentário e Soberania $0.00',
        model: 'Ollama qwen2.5-coder:7b-instruct-q4_K_M',
        status: 'active',
        assignedSkills: ['finops-budget-enforcer', 'sha256-audit-witness'],
        systemPrompt: 'Monitor de custos marginais locais e bloqueio físico de estouro de orçamento.',
        autonomyLevel: 'Autônomo',
        isLocalSovereign: true,
        avatarIcon: 'DollarSign',
        monthlyBudgetCapUSD: 0
      },
      {
        id: 'ag-iso-witness',
        name: 'ISO 42001 Witness',
        role: 'Atesto Criptográfico SHA-256 e Dossiês de Auditoria',
        model: 'Local Enclave SHA-256 (:5432)',
        status: 'active',
        assignedSkills: ['sha256-audit-witness'],
        systemPrompt: 'Validador imutável de conformidade ética, rastreabilidade e LGPD com residuo zero.',
        autonomyLevel: 'Autônomo',
        isLocalSovereign: true,
        avatarIcon: 'FileCheck',
        monthlyBudgetCapUSD: 0
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
      console.warn('[squadService] Falha ao ler squads do localStorage, usando padrões:', e);
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

  subscribe(callback: (squads: SquadDefinition[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<SquadDefinition[]>;
      callback(customEvent.detail || this.getSquads());
    };
    window.addEventListener(UPDATE_EVENT, handler);
    return () => window.removeEventListener(UPDATE_EVENT, handler);
  }
};

