import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Search, Folder, FolderOpen, 
  MessageSquare, Clock, ChevronDown, Database,
  MoreVertical, Pin, Trash2, Edit3, Share2, FolderPlus,
  Check, X
} from 'lucide-react';
import { Project, Conversation } from '../../types';

interface LeftSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  projects: Project[];
  activeConversationId: string;
  onSelectConversation: (conv: Conversation) => void;
  onNewConversation: () => void;
  activeView?: 'chat' | 'meetings' | 'flows';
  onSelectView?: (view: 'chat' | 'meetings' | 'flows') => void;
  onRenameConversation?: (convId: string, newTitle: string) => void;
  onDeleteConversation?: (convId: string) => void;
  onMoveConversation?: (convId: string, targetProjectId: string) => void;
  onCreateProject?: (projectName: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  projects,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  activeView = 'chat',
  onSelectView,
  onRenameConversation,
  onDeleteConversation,
  onMoveConversation,
  onCreateProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Largura redimensionável da barra lateral (entre 240px e 480px)
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

  // Controle dos Módulos Retráteis (Estado Padrão: FECHADO conforme aprovado)
  const [isMeetingsOpen, setIsMeetingsOpen] = useState(false);
  const [isFlowsOpen, setIsFlowsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  // Pastas de projetos abertas internamente
  const [openProjectFolders, setOpenProjectFolders] = useState<Record<string, boolean>>({
    'prj-nextgen': true
  });

  // Períodos do histórico abertos (Apenas "Hoje" aberto por padrão)
  const [openPeriods, setOpenPeriods] = useState<Record<string, boolean>>({
    'Hoje': true,
    'Ontem': false,
    'Últimos 7 dias': false,
    'Últimos 15 dias': false,
    'Últimos 30 dias': false
  });

  // Controle de Menu de Contexto (···) e Edição Inline
  const [pinnedConvIds, setPinnedConvIds] = useState<string[]>([]);
  const [activeContextMenuConvId, setActiveContextMenuConvId] = useState<string | null>(null);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [tempRenameTitle, setTempRenameTitle] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isMoveSubmenuOpen, setIsMoveSubmenuOpen] = useState(false);

  // Listener para arrastar a borda da sidebar (Redimensionamento suave)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(e.clientX, 240), 480);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const toggleProjectFolder = (projectId: string) => {
    setOpenProjectFolders(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const togglePeriod = (period: string) => {
    setOpenPeriods(prev => ({ ...prev, [period]: !prev[period] }));
  };

  const togglePinConversation = (convId: string) => {
    setPinnedConvIds(prev => 
      prev.includes(convId) ? prev.filter(id => id !== convId) : [...prev, convId]
    );
    setActiveContextMenuConvId(null);
  };

  const handleStartRename = (conv: Conversation) => {
    setEditingConvId(conv.id);
    setTempRenameTitle(conv.title);
    setActiveContextMenuConvId(null);
  };

  const handleSaveRename = (convId: string) => {
    if (tempRenameTitle.trim() && onRenameConversation) {
      onRenameConversation(convId, tempRenameTitle.trim());
    }
    setEditingConvId(null);
  };

  const handleCreateNewProject = () => {
    if (newProjectName.trim() && onCreateProject) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreatingProject(false);
    }
  };

  // Coleta todas as conversas existentes para os períodos
  const allConversations: Conversation[] = [];
  projects.forEach(p => {
    p.conversations.forEach(c => {
      if (!allConversations.some(item => item.id === c.id)) {
        allConversations.push(c);
      }
    });
  });

  const filteredConversations = allConversations.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupamento por períodos exatos da imagem original
  const periodsConfig = [
    { label: 'Hoje', items: filteredConversations.filter(c => c.dateGroup === 'Hoje') },
    { label: 'Ontem', items: filteredConversations.filter(c => c.dateGroup === 'Ontem') },
    { label: 'Últimos 7 dias', items: filteredConversations.filter(c => c.dateGroup === 'Últimos 7 dias') },
    { label: 'Últimos 15 dias', items: filteredConversations.filter(c => c.dateGroup === 'Últimos 15 dias') },
    { label: 'Últimos 30 dias', items: filteredConversations.filter(c => c.dateGroup === 'Últimos 30 dias') },
  ];

  // 1. MODO COLAPSADO (W-16)
  if (collapsed) {
    const tier1Items = [
      { id: 'chat', icon: 'forum', label: 'Conversas & Chat' },
      { id: 'meetings', icon: 'video_camera_front', label: 'Reuniões & Atas' },
      { id: 'flows', icon: 'account_tree', label: 'Fluxos de Automação' },
      { id: 'projects', icon: 'folder_open', label: 'Projetos' },
      { id: 'artifacts', icon: 'article', label: 'Artefatos & Relatórios' },
    ];

    return (
      <aside className="w-16 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col items-center py-3 space-y-4 select-none z-20 transition-all duration-300">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
          title="Expandir Barra Lateral"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (onSelectView) onSelectView('chat');
            onNewConversation();
          }}
          className="p-2.5 rounded-xl bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 hover:scale-105 shadow-sm transition active:scale-95"
          title="Nova Conversa"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="w-8 h-[1px] bg-slate-200 dark:border-slate-800 my-1"></div>

        <div className="space-y-2 flex flex-col items-center">
          {tier1Items.map((item) => {
            const isItemActive = (item.id === 'chat' && activeView === 'chat') || 
                                 (item.id === 'meetings' && activeView === 'meetings') ||
                                 (item.id === 'flows' && activeView === 'flows');
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    if (item.id === 'chat' && onSelectView) onSelectView('chat');
                    if (item.id === 'meetings' && onSelectView) onSelectView('meetings');
                    if (item.id === 'flows' && onSelectView) onSelectView('flows');
                  }}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm transition-all duration-200 ${
                    isItemActive
                      ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 border-transparent'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </button>
                
                <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-medium rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    );
  }

  // 2. MODO EXPANDIDO RESTAURADO (Com Redimensionamento e Ordem Exata)
  return (
    <aside 
      style={{ width: `${sidebarWidth}px` }}
      className="bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full select-none z-20 relative transition-none"
    >
      {/* Alça de Redimensionamento Arrastável (col-resize) */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-emerald-500/50 active:bg-emerald-500 transition-colors z-40 group"
        title="Arraste para redimensionar a largura da barra lateral"
      />

      {/* 1º TOPO: Botão Nova Conversa & Botão Recolher */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => {
            if (onSelectView) onSelectView('chat');
            onNewConversation();
          }}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-medium text-xs hover:opacity-90 shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Conversa</span>
        </button>
        <button
          onClick={onToggleCollapse}
          className="ml-2 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 transition"
          title="Recolher Barra Lateral [<<]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 2º GRADE TIER 1: 5 Ícones de Navegação */}
      <div className="px-2 py-1.5 grid grid-cols-5 gap-1 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/50">
        {[
          { id: 'chat', icon: 'forum', label: 'Chat', active: activeView === 'chat' },
          { id: 'meetings', icon: 'video_camera_front', label: 'Reuniões', active: activeView === 'meetings' },
          { id: 'flows', icon: 'account_tree', label: 'Fluxos', active: activeView === 'flows' },
          { id: 'projects', icon: 'folder_open', label: 'Projetos' },
          { id: 'artifacts', icon: 'article', label: 'Artefatos' },
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              if (mod.id === 'chat' && onSelectView) onSelectView('chat');
              if (mod.id === 'meetings' && onSelectView) onSelectView('meetings');
              if (mod.id === 'flows' && onSelectView) onSelectView('flows');
            }}
            className={`flex flex-col items-center py-1 px-0.5 rounded-lg transition ${
              mod.active 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs border border-slate-200/60 dark:border-slate-700/60' 
                : 'text-slate-500 hover:bg-white/60 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={mod.label}
          >
            <span className="material-symbols-outlined text-[17px]">{mod.icon}</span>
            <span className="truncate max-w-full text-[9px] tracking-tight mt-0.5">{mod.label}</span>
          </button>
        ))}
      </div>

      {/* 3º MÓDULOS DIRETOS (Ordem e layout exato da imagem Ajustes 02 23-10-2026.png) */}
      <div className="px-2 py-1 space-y-1">
        {/* Chat Stream & IA */}
        <button
          onClick={() => onSelectView && onSelectView('chat')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
            activeView === 'chat'
              ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-medium shadow-xs border border-slate-200/80 dark:border-slate-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2 truncate">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">Chat Stream & IA</span>
          </div>
          <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-medium">
            Ativo
          </span>
        </button>

        {/* Reuniões & Atas (Retrátil, Padrão: FECHADO, Badge cinza simples '4') */}
        <div className="rounded-lg overflow-hidden">
          <button
            onClick={() => setIsMeetingsOpen(!isMeetingsOpen)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
              activeView === 'meetings'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-medium shadow-xs border border-slate-200/80 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              <span className="material-symbols-outlined text-[16px] text-emerald-500">video_camera_front</span>
              <span className="truncate">Reuniões & Atas</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-medium">
                4
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMeetingsOpen ? '' : '-rotate-90'}`} />
            </div>
          </button>

          {/* Lista interna de Reuniões ao expandir */}
          {isMeetingsOpen && (
            <div className="ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-0.5 mt-0.5 py-0.5 bg-slate-50/50 dark:bg-slate-950/40 rounded">
              {[
                { title: 'Comitê de Crédito & Alinhamento', dur: '12m' },
                { title: 'Kickoff Técnico: Next Gen Sports', dur: '08m' },
                { title: 'Revisão de Segurança & LGPD', dur: '14m' },
                { title: 'Planejamento Sprint 5 & DAG', dur: '06m' },
              ].map((meet, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectView && onSelectView('meetings')}
                  className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-900 transition flex items-center justify-between"
                >
                  <span className="truncate pr-2">{meet.title}</span>
                  <span className="text-[9px] font-mono text-slate-400">{meet.dur}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fluxos de Automação (Retrátil, Padrão: FECHADO, Badge cinza simples '5') */}
        <div className="rounded-lg overflow-hidden">
          <button
            onClick={() => setIsFlowsOpen(!isFlowsOpen)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
              activeView === 'flows'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-medium shadow-xs border border-slate-200/80 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              <span className="material-symbols-outlined text-[16px] text-indigo-500">account_tree</span>
              <span className="truncate">Fluxos de Automação</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-medium">
                5
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isFlowsOpen ? '' : '-rotate-90'}`} />
            </div>
          </button>

          {/* Lista interna de Fluxos ao expandir */}
          {isFlowsOpen && (
            <div className="ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-0.5 mt-0.5 py-0.5 bg-slate-50/50 dark:bg-slate-950/40 rounded">
              {[
                { name: 'Conciliação SAP & Salesforce', ver: 'v1.4' },
                { name: 'Onboarding Leads RD Station', ver: 'v2.1' },
                { name: 'Triagem LGPD & PII', ver: 'v1.0' },
                { name: 'Follow-up Deals HubSpot', ver: 'v1.2' },
                { name: 'Sincronização Pipedrive & SAP', ver: 'v1.0' },
              ].map((flw, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectView && onSelectView('flows')}
                  className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-900 transition flex items-center justify-between"
                >
                  <span className="truncate pr-2">{flw.name}</span>
                  <span className="text-[9px] font-mono text-slate-400">{flw.ver}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4º BUSCA: Posicionada exatamente acima de Projetos */}
      <div className="px-2 pt-2 pb-1">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-xs"
          />
        </div>
      </div>

      {/* ÁREA COM SCROLL: 5º PROJETOS DA SQUAD + 6º HISTÓRICO POR PERÍODO */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3 custom-scrollbar text-xs">
        
        {/* 5º PROJETOS (Retrátil, Padrão: FECHADO, Badge cinza numérico com chevron no final) */}
        <div>
          <button
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            className="w-full px-2 py-1 font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            <span>Projetos</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-medium">
                {projects.length}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProjectsOpen ? '' : '-rotate-90'}`} />
            </div>
          </button>

          {/* Pastas de Projetos (quando aberto) */}
          {isProjectsOpen && (
            <div className="space-y-1 mt-1 pl-1">
              {projects.map(project => {
                const isOpen = openProjectFolders[project.id];
                const filteredProjectConvs = project.conversations.filter(c =>
                  c.title.toLowerCase().includes(searchTerm.toLowerCase())
                );

                return (
                  <div key={project.id} className="rounded-md overflow-hidden">
                    <button
                      onClick={() => toggleProjectFolder(project.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition font-medium"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        {isOpen ? (
                          <FolderOpen className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{project.name}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                        <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-medium">
                          {project.conversations.length}
                        </span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                      </div>
                    </button>

                    {/* Conversas dentro da pasta */}
                    {isOpen && (
                      <div className="ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-0.5 mt-0.5 py-0.5">
                        {filteredProjectConvs.length === 0 ? (
                          <div className="px-2 py-1 text-[11px] text-slate-400 italic">Pasta vazia</div>
                        ) : (
                          filteredProjectConvs.map(conv => renderConversationItem(conv, true))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6º HISTÓRICO (Sempre aberto como bloco mestre, períodos internos agrupados) */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="px-2 py-1 font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1 mb-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Histórico</span>
          </div>

          <div className="space-y-1">
            {periodsConfig.map(period => {
              const isOpen = openPeriods[period.label] ?? false;
              return (
                <div key={period.label} className="rounded-md overflow-hidden">
                  {/* Cabeçalho do Período */}
                  <button
                    onClick={() => togglePeriod(period.label)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition text-xs font-medium"
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                      <span className="truncate">{period.label}</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-medium">
                      {period.items.length}
                    </span>
                  </button>

                  {/* Conversas do Período */}
                  {isOpen && (
                    <div className="ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-0.5 mt-0.5 py-0.5">
                      {period.items.length === 0 ? (
                        <div className="px-2 py-1 text-[11px] text-slate-400 italic">Nenhuma conversa neste período</div>
                      ) : (
                        period.items.map(conv => renderConversationItem(conv))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 7º RODAPÉ ORIGINAL: PCL SQLite Local & Sincronizado */}
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between bg-slate-100/40 dark:bg-slate-900/40">
        <div className="flex items-center space-x-1.5 truncate">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">PCL SQLite Local</span>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
          Sincronizado
        </span>
      </div>
    </aside>
  );

  // Renderizador Universal de Linha de Conversa com Menu de Contexto (···)
  function renderConversationItem(conv: Conversation, isNested = false) {
    const isActive = conv.id === activeConversationId;
    const isPinned = pinnedConvIds.includes(conv.id);
    const isMenuOpen = activeContextMenuConvId === conv.id;
    const isEditing = editingConvId === conv.id;

    return (
      <div key={conv.id} className="relative group">
        {isEditing ? (
          <div className="flex items-center space-x-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-emerald-500 shadow-sm">
            <input
              type="text"
              value={tempRenameTitle}
              onChange={e => setTempRenameTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveRename(conv.id);
                if (e.key === 'Escape') setEditingConvId(null);
              }}
              autoFocus
              className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
            />
            <button
              onClick={() => handleSaveRename(conv.id)}
              className="p-1 text-emerald-600 hover:text-emerald-500"
              title="Salvar"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setEditingConvId(null)}
              className="p-1 text-slate-400 hover:text-slate-600"
              title="Cancelar"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              if (onSelectView) onSelectView('chat');
              onSelectConversation(conv);
            }}
            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-medium shadow-xs border border-slate-200/90 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2 truncate pr-2 flex-1">
              <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className="truncate">{conv.title}</span>
            </div>

            {/* Ações ao passar o mouse ou se menu estiver aberto */}
            <div className="flex items-center space-x-1">
              {isPinned && !isNested && (
                <Pin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveContextMenuConvId(isMenuOpen ? null : conv.id);
                  setIsMoveSubmenuOpen(false);
                }}
                className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition ${
                  isMenuOpen ? 'opacity-100 bg-slate-200 dark:bg-slate-800' : 'opacity-0 group-hover:opacity-100'
                }`}
                title="Opções da Conversa"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Menu de Contexto Popover (···) */}
        {isMenuOpen && (
          <div 
            onClick={e => e.stopPropagation()}
            className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-50 text-xs space-y-0.5 animate-in fade-in duration-100"
          >
            <button
              onClick={() => handleStartRename(conv)}
              className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Renomear Conversa</span>
            </button>

            <button
              onClick={() => togglePinConversation(conv.id)}
              className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Pin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isPinned ? 'Desafixar do Topo' : 'Fixar no Topo'}</span>
            </button>

            {/* Submenu Mover para Projeto */}
            <div className="relative">
              <button
                onClick={() => setIsMoveSubmenuOpen(!isMoveSubmenuOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div className="flex items-center space-x-2">
                  <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mover para Projeto</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>

              {isMoveSubmenuOpen && (
                <div className="pl-3 py-1 border-l border-slate-200 dark:border-slate-800 space-y-0.5 bg-slate-50 dark:bg-slate-950 rounded mt-0.5">
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (onMoveConversation) onMoveConversation(conv.id, p.id);
                        setActiveContextMenuConvId(null);
                        setIsMoveSubmenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 truncate"
                    >
                      • {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link seguro da conversa copiado para a área de transferência.');
                setActiveContextMenuConvId(null);
              }}
              className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Compartilhar Link</span>
            </button>

            <div className="border-t border-slate-100 dark:border-slate-800 my-0.5"></div>

            <button
              onClick={() => {
                if (confirm(`Tem certeza que deseja excluir a conversa "${conv.title}"?`)) {
                  if (onDeleteConversation) onDeleteConversation(conv.id);
                  setActiveContextMenuConvId(null);
                }
              }}
              className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Conversa</span>
            </button>
          </div>
        )}
      </div>
    );
  }
};
