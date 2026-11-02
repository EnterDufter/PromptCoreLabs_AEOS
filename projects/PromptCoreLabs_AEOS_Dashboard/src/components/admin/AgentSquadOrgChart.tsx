import React, { useState, useEffect } from 'react';
import { 
  Users, Bot, GitBranch, Plus, Search, ShieldCheck, Zap, 
  Settings, Trash2, Edit3, Power, CheckCircle, AlertTriangle, 
  Cpu, HardDrive, DollarSign, X, HelpCircle, Layers
} from 'lucide-react';
import { squadService, SquadDefinition, AgentDefinition } from '../../services/admin/squadService';
import { skillsService } from '../../services/admin/skillsService';

export const AgentSquadOrgChart: React.FC = () => {
  const [squads, setSquads] = useState<SquadDefinition[]>(squadService.getSquads());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [editingSquad, setEditingSquad] = useState<SquadDefinition | null>(null);
  
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [targetSquadId, setTargetSquadId] = useState<string>('');
  const [editingAgent, setEditingAgent] = useState<AgentDefinition | null>(null);

  // Form states for Squad
  const [squadName, setSquadName] = useState('');
  const [squadDept, setSquadDept] = useState('');
  const [squadLead, setSquadLead] = useState('');
  const [squadLeadEmail, setSquadLeadEmail] = useState('');
  const [squadBudgetTokens, setSquadBudgetTokens] = useState('25000000');

  // Form states for Agent
  const [agentName, setAgentName] = useState('');
  const [agentRole, setAgentRole] = useState('');
  const [agentModel, setAgentModel] = useState('Ollama qwen2.5-coder:7b-instruct-q4_K_M');
  const [agentAutonomy, setAgentAutonomy] = useState<'Assistido (TLC v3)' | 'Supervisionado' | 'Autônomo'>('Assistido (TLC v3)');
  const [agentSystemPrompt, setAgentSystemPrompt] = useState('');
  const [agentSkills, setAgentSkills] = useState<string[]>(['cortex']);

  const availableSkills = skillsService.getSkills();

  useEffect(() => {
    const unsubscribe = squadService.subscribe(updatedSquads => {
      setSquads(updatedSquads);
    });
    return () => unsubscribe();
  }, []);

  // Stats calculation
  const totalSquads = squads.length;
  const allAgents = squads.flatMap(s => s.agents);
  const totalAgents = allAgents.length;
  const activeAgents = allAgents.filter(a => a.status === 'active').length;
  const localSovereignCount = allAgents.filter(a => a.isLocalSovereign).length;
  const sovereignRatio = totalAgents > 0 ? Math.round((localSovereignCount / totalAgents) * 100) : 100;

  // Filter squads by search
  const filteredSquads = squads.map(squad => {
    const matchesSquad = squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         squad.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         squad.lead.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchingAgents = squad.agents.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchesSquad) return squad;
    if (matchingAgents.length > 0) return { ...squad, agents: matchingAgents };
    return null;
  }).filter(Boolean) as SquadDefinition[];

  // Squad Handlers
  const handleOpenNewSquadModal = () => {
    setEditingSquad(null);
    setSquadName('');
    setSquadDept('');
    setSquadLead('');
    setSquadLeadEmail('');
    setSquadBudgetTokens('25000000');
    setIsSquadModalOpen(true);
  };

  const handleOpenEditSquadModal = (squad: SquadDefinition) => {
    setEditingSquad(squad);
    setSquadName(squad.name);
    setSquadDept(squad.department);
    setSquadLead(squad.lead);
    setSquadLeadEmail(squad.leadEmail || '');
    setSquadBudgetTokens(String(squad.budgetCapTokens));
    setIsSquadModalOpen(true);
  };

  const handleSaveSquad = () => {
    if (!squadName.trim()) return;
    if (editingSquad) {
      squadService.updateSquad(editingSquad.id, {
        name: squadName,
        department: squadDept,
        lead: squadLead,
        leadEmail: squadLeadEmail,
        budgetCapTokens: Number(squadBudgetTokens) || 25000000
      });
    } else {
      squadService.addSquad({
        name: squadName,
        department: squadDept,
        lead: squadLead,
        leadEmail: squadLeadEmail,
        budgetCapTokens: Number(squadBudgetTokens) || 25000000,
        monthlySpendUSD: 0.00,
        status: 'active',
        agents: []
      });
    }
    setIsSquadModalOpen(false);
  };

  const handleDeleteSquad = (squadId: string, squadName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o Squad "${squadName}" e todos os seus agentes?`)) {
      squadService.deleteSquad(squadId);
    }
  };

  // Agent Handlers
  const handleOpenNewAgentModal = (squadId: string) => {
    setTargetSquadId(squadId);
    setEditingAgent(null);
    setAgentName('');
    setAgentRole('');
    setAgentModel('Ollama qwen2.5-coder:7b-instruct-q4_K_M');
    setAgentAutonomy('Assistido (TLC v3)');
    setAgentSystemPrompt('');
    setAgentSkills(['cortex']);
    setIsAgentModalOpen(true);
  };

  const handleOpenEditAgentModal = (squadId: string, agent: AgentDefinition) => {
    setTargetSquadId(squadId);
    setEditingAgent(agent);
    setAgentName(agent.name);
    setAgentRole(agent.role);
    setAgentModel(agent.model);
    setAgentAutonomy(agent.autonomyLevel);
    setAgentSystemPrompt(agent.systemPrompt || '');
    setAgentSkills(agent.assignedSkills || []);
    setIsAgentModalOpen(true);
  };

  const handleSaveAgent = () => {
    if (!agentName.trim() || !targetSquadId) return;
    const isLocal = agentModel.includes('Ollama') || agentModel.includes('FastMCP') || agentModel.includes('Local') || agentModel.includes('Omniroute');

    if (editingAgent) {
      squadService.updateAgent(targetSquadId, editingAgent.id, {
        name: agentName,
        role: agentRole,
        model: agentModel,
        autonomyLevel: agentAutonomy,
        systemPrompt: agentSystemPrompt,
        assignedSkills: agentSkills,
        isLocalSovereign: isLocal
      });
    } else {
      squadService.addAgent(targetSquadId, {
        name: agentName,
        role: agentRole,
        model: agentModel,
        status: 'active',
        autonomyLevel: agentAutonomy,
        systemPrompt: agentSystemPrompt,
        assignedSkills: agentSkills,
        isLocalSovereign: isLocal
      });
    }
    setIsAgentModalOpen(false);
  };

  const handleDeleteAgent = (squadId: string, agentId: string, agentName: string) => {
    if (window.confirm(`Deseja remover o agente de IA "${agentName}" deste Squad?`)) {
      squadService.deleteAgent(squadId, agentId);
    }
  };

  const handleToggleAgentStatus = (squadId: string, agentId: string) => {
    squadService.toggleAgentStatus(squadId, agentId);
  };

  const toggleSkillInForm = (key: string) => {
    if (agentSkills.includes(key)) {
      setAgentSkills(agentSkills.filter(s => s !== key));
    } else {
      setAgentSkills([...agentSkills, key]);
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none pb-12">
      {/* Top Banner & Control Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <GitBranch className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Organograma Hierárquico de Squads & Agentes
              </h2>
            </div>
            <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
              Estrutura viva de inteligências autônomas distribuídas. Crie novos squads corporativos, aloque agentes especializados e defina níveis de autonomia e governança.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenNewSquadModal}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Squad</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Deseja restaurar os squads e agentes canônicos padrão?')) {
                  squadService.resetToDefaults();
                }
              }}
              className="px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition"
              title="Restaurar Squads Originais PCL AEOS"
            >
              Restaurar Padrões
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Squads Ativos</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{totalSquads}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Agentes Cadastrados</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-lg font-bold text-white">{totalAgents}</span>
              <span className="text-[11px] text-emerald-400 font-semibold">({activeAgents} online)</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Taxa de Soberania Local</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-lg font-bold text-emerald-400">{sovereignRatio}%</span>
              <span className="text-[10px] text-slate-400 font-mono">($0.00 Host)</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Governança TLC v3</span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-indigo-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Stage Gates Ativos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome do agente, especialidade, modelo ou squad..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Exibindo {filteredSquads.length} squad(s)
        </span>
      </div>

      {/* Squads Container */}
      <div className="space-y-6">
        {filteredSquads.map((squad) => (
          <div 
            key={squad.id} 
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm transition hover:shadow-md"
          >
            {/* Squad Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {squad.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {squad.department}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 pl-8">
                  <span>Líder: <strong className="text-slate-700 dark:text-slate-200">{squad.lead}</strong></span>
                  <span>•</span>
                  <span>Teto: <strong className="font-mono">{(squad.budgetCapTokens / 1000000).toFixed(0)}M tokens/mês</strong></span>
                </div>
              </div>

              {/* Squad Action Controls */}
              <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                <button
                  onClick={() => handleOpenNewAgentModal(squad.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] transition flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar Agente</span>
                </button>
                <button
                  onClick={() => handleOpenEditSquadModal(squad)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  title="Editar dados do Squad"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteSquad(squad.id, squad.name)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition"
                  title="Excluir Squad"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {squad.agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                    agent.status === 'active'
                      ? 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200/90 dark:border-slate-800 hover:border-indigo-400/60 shadow-xs'
                      : 'bg-slate-100/50 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/50 opacity-70'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Top row: Avatar + Status + Actions */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                          agent.isLocalSovereign
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                        }`}>
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              {agent.name}
                            </span>
                            <span 
                              className={`w-2 h-2 rounded-full ${
                                agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                              }`}
                              title={agent.status === 'active' ? 'Agente Ativo' : 'Agente em Standby'}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            @{agent.name.toLowerCase().replace(/\s+/g, '')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleAgentStatus(squad.id, agent.id)}
                          className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition ${
                            agent.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                          title={agent.status === 'active' ? 'Pausar Agente' : 'Ativar Agente'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditAgentModal(squad.id, agent)}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                          title="Editar Agente"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(squad.id, agent.id, agent.name)}
                          className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition"
                          title="Excluir Agente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Role description */}
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {agent.role}
                    </p>

                    {/* Autonomy Badge */}
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                        {agent.autonomyLevel}
                      </span>
                    </div>

                    {/* Skills pills */}
                    {agent.assignedSkills && agent.assignedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {agent.assignedSkills.map(skKey => (
                          <span 
                            key={skKey} 
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            #{skKey}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Engine & Cost Footer */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono truncate max-w-[170px]" title={agent.model}>
                      {agent.model}
                    </span>
                    {agent.isLocalSovereign ? (
                      <span className="px-1.5 py-0.5 rounded font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80">
                        $0.00 Local
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-800">
                        Cloud API
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {squad.agents.length === 0 && (
                <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <Bot className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="text-xs text-slate-500">Nenhum agente cadastrado neste Squad ainda.</p>
                  <button
                    onClick={() => handleOpenNewAgentModal(squad.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition"
                  >
                    Adicionar Primeiro Agente
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CRIAR / EDITAR SQUAD */}
      {isSquadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingSquad ? 'Editar Squad Corporativo' : 'Criar Novo Squad de Inteligências'}
                </h3>
              </div>
              <button 
                onClick={() => setIsSquadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nome do Squad *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Squad FinOps & Governança"
                  value={squadName}
                  onChange={e => setSquadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Departamento / Área de Negócio
                </label>
                <input
                  type="text"
                  placeholder="Ex: Controladoria & Auditoria"
                  value={squadDept}
                  onChange={e => setSquadDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Líder Humano Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Silva"
                    value={squadLead}
                    onChange={e => setSquadLead(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email de Notificação
                  </label>
                  <input
                    type="email"
                    placeholder="carlos@empresa.com"
                    value={squadLeadEmail}
                    onChange={e => setSquadLeadEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Teto Orçamentário Mensal (Tokens)
                </label>
                <select
                  value={squadBudgetTokens}
                  onChange={e => setSquadBudgetTokens(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-mono"
                >
                  <option value="10000000">10.000.000 tokens/mês (Pequeno porte)</option>
                  <option value="25000000">25.000.000 tokens/mês (Padrão)</option>
                  <option value="50000000">50.000.000 tokens/mês (Engenharia Pesada)</option>
                  <option value="100000000">100.000.000 tokens/mês (Enterprise)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsSquadModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSquad}
                disabled={!squadName.trim()}
                className={`px-4 py-2 rounded-lg font-bold text-white transition ${
                  squadName.trim() ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                Salvar Squad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CRIAR / EDITAR AGENTE */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingAgent ? `Editar Agente: ${editingAgent.name}` : 'Cadastrar Novo Agente de IA'}
                </h3>
              </div>
              <button 
                onClick={() => setIsAgentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nome do Agente *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Auditor de Contratos"
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Grau de Autonomia (Governança)
                  </label>
                  <select
                    value={agentAutonomy}
                    onChange={e => setAgentAutonomy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-medium"
                  >
                    <option value="Assistido (TLC v3)">Assistido (TLC v3 - Exige confirmação humana)</option>
                    <option value="Supervisionado">Supervisionado (Alçada média)</option>
                    <option value="Autônomo">Autônomo (Execução contínua sem bloqueio)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Especialidade / Missão Principal
                </label>
                <input
                  type="text"
                  placeholder="Ex: Inspecionar minutas contratuais e alertar sobre cláusulas de renovação automática"
                  value={agentRole}
                  onChange={e => setAgentRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Motor de Inferência LLM
                </label>
                <select
                  value={agentModel}
                  onChange={e => setAgentModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-mono"
                >
                  <optgroup label="Soberanos Locais ($0.00 marginal)">
                    <option value="Ollama qwen2.5-coder:7b-instruct-q4_K_M">Ollama qwen2.5-coder:7b (GPU Host - $0.00)</option>
                    <option value="Ollama nomic-embed-text:latest">Ollama nomic-embed-text (Embeddings - $0.00)</option>
                    <option value="FastMCP CPU INT8 (:20140)">FastMCP Laya System One (CPU INT8 0MB VRAM)</option>
                    <option value="Local Enclave SHA-256 (:5432)">Local Enclave PostgreSQL 17 (:5432)</option>
                  </optgroup>
                  <optgroup label="Nuvem Proprietária (Consumo Externo)">
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                    <option value="GPT-4o">GPT-4o (OpenAI Enterprise)</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google Cloud)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Instruções Diretivas (System Prompt)
                </label>
                <textarea
                  rows={3}
                  placeholder="Defina o comportamento e tom do agente..."
                  value={agentSystemPrompt}
                  onChange={e => setAgentSystemPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Vincular Habilidades (Skills)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 custom-scrollbar border border-slate-200 dark:border-slate-800 rounded-lg">
                  {availableSkills.map(sk => {
                    const isChecked = agentSkills.includes(sk.key);
                    return (
                      <div
                        key={sk.key}
                        onClick={() => toggleSkillInForm(sk.key)}
                        className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="font-medium text-[11px] truncate">{sk.name}</span>
                        {isChecked && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsAgentModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAgent}
                disabled={!agentName.trim()}
                className={`px-4 py-2 rounded-lg font-bold text-white transition ${
                  agentName.trim() ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                Salvar Agente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
