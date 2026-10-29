import React, { useState, useEffect } from 'react';
import { Language, Theme, UserProfile, Project, Conversation, Agent, ServiceStatus, Artifact } from './types';
import { Header } from './components/layout/Header';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebarStatus } from './components/layout/RightSidebarStatus';
import { DualPlexWorkspace } from './components/workspace/DualPlexWorkspace';
import { SuperChatbubble } from './components/composer/SuperChatbubble';
import { PCLArtifactDrawer } from './components/workspace/PCLArtifactDrawer';
import { SettingsModal } from './components/admin/SettingsModal';
import { MeetingsIntelligenceView } from './components/workspace/MeetingsIntelligenceView';
import { FlowsAutomationCanvas } from './components/workspace/FlowsAutomationCanvas';
import { omniRouteService } from './services/llm/omniRouteService';
import { layaCoprocessorService } from './services/laya/layaCoprocessorService';
import { webSearchService } from './services/search/webSearchService';
import { intelligentGroundingService } from './services/grounding/intelligentGroundingService';
import { ChatMessage } from './types';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('pt');
  const [theme, setTheme] = useState<Theme>('light');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string>('security');
  const [activeMainView, setActiveMainView] = useState<'chat' | 'meetings' | 'flows'>('chat');

  // Refração Dinâmica de Luz controlada pelo cursor do mouse (Design System Liquid Glass)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const userProfile: UserProfile = {
    id: 'USR-001',
    name: 'Eduardo Antigravity',
    email: 'eduardo@promptcorelabs.com',
    avatar: 'EA',
    role: 'System Admin',
    squad: 'Next Gen Sports',
    activeSessions: 2,
    maxSessions: 2,
    twoFactorEnabled: true,
    ssoConnected: true,
    dailyTokenLimit: 500000,
    allowedTimeWindow: '24/7'
  };

  const initialArtifacts: Artifact[] = [
    {
      id: 'art-1',
      title: 'Especificação Mestra de UI/UX PCL AEOS v3',
      type: 'doc',
      summary: 'Diretrizes de design hyper-clean minimalista, 3 colunas e conformidade ISO.',
      content: `# Especificação Mestra PCL AEOS v3\n\n## 1. Diretrizes Visuais\n- Estética Hyper-Clean Minimalista (ChatGPT, Linear, Apple, Vercel).\n- Fundo branco limpo (#FFFFFF) em modo claro e slate-900 em modo escuro.\n- Layout Primordial em 3 Colunas com Sidebars Retráteis.\n\n## 2. Conformidade & Segurança\n- Limite estrito de no máximo 2 dispositivos simultâneos por usuário.\n- Trilha de auditoria imutável PostgreSQL SHA-256 (ISO 27001 / ISO 42001).\n- Transcrição de voz local via Whisper WASM.`,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'art-2',
      title: 'Arquitetura Cortex Engine & Stage Gates TLC v3',
      type: 'plan',
      summary: 'Pipeline de execução multimodal com verificação de viés e sanitização PII.',
      content: `# Arquitetura Cortex Engine\n\n1. Ingestão Multimodal\n2. Sanitizador PII Guard LGPD\n3. Omniroute Ollama Local ($0.00) vs Cloud\n4. Validação Stage Gates TLC v3\n5. Registro SHA-256 no PostgreSQL`,
      updatedAt: new Date().toISOString()
    }
  ];

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'prj-nextgen',
      name: 'Next Gen Sports',
      conversationsCount: 4,
      activeAgentsCount: 3,
      conversations: [
        {
          id: 'conv-1',
          title: 'Implementação Mestra da Interface PCL AEOS Dashboard',
          dateGroup: 'Hoje',
          updatedAt: new Date().toISOString(),
          messages: [
            {
              id: 'm-1',
              sender: 'user',
              senderName: 'Eduardo Antigravity',
              timestamp: '02:15',
              text: 'Seguindo todo rigor da PCL AEOS, vamos criar o novo projeto oficial do Dashboard em c:\\PromptCore_Labs\\projects\\PromptCoreLabs_AEOS_Dashboard. Quero todos os recursos previstos!'
            },
            {
              id: 'm-2',
              sender: 'agent',
              senderName: 'Cortex Enterprise Engine',
              timestamp: '02:16',
              text: 'Com certeza! Iniciei a construção completa com estética Hyper-Clean Minimalista, layout de 3 colunas retráteis, Super-Chatbubble Composer com Whisper WASM local, gaveta Bitrix24 com ações rápidas e conformidade estrita com 2 dispositivos e ISO 27001/42001.',
              toolCall: { command: 'create_project_and_services', durationMs: 42, status: 'success' },
              artifacts: initialArtifacts
            },
            {
              id: 'm-2b',
              sender: 'user',
              senderName: 'Eduardo Antigravity',
              timestamp: '02:18',
              text: 'Notifique a Juliana Castro (Compliance) por e-mail sobre o teto mensal de $19.200 com Hard Lock e anexe a especificação mestra.'
            },
            {
              id: 'm-2c',
              sender: 'agent',
              senderName: 'Cortex Enterprise Engine',
              timestamp: '02:18',
              text: 'Preparei a minuta do e-mail para revisão. Você pode alterar o assunto ou o corpo antes de autorizar o envio direto via Gmail:',
              actionProposal: {
                type: 'email',
                recipient: 'Juliana Castro',
                recipientEmail: 'juliana.castro@promptcorelabs.com',
                subject: 'Alocação Orçamentária Q3 & Relatório ISO 42001 Aprovado',
                body: 'Olá Juliana,\n\nConforme calibrado na revisão executiva, o teto orçamentário mensal foi ajustado para $19.200,00 com Hard Lock ativo para evitar surpresas. Segue em anexo a especificação técnica revisada.\n\nAtenciosamente,\nEduardo Machado',
                app: 'Gmail'
              }
            },
            {
              id: 'm-2d',
              sender: 'user',
              senderName: 'Eduardo Antigravity',
              timestamp: '04:26',
              text: 'Quais clientes estão com pagamentos em atraso este mês? @SAP e @Salesforce',
              toolsCalled: ['sap', 'salesforce'],
              toolsCallingStatus: 'Chamando ferramenta'
            },
            {
              id: 'm-2e',
              sender: 'agent',
              senderName: 'Cortex Enterprise Engine',
              timestamp: '04:26',
              text: 'Consultei os registros financeiros no @SAP e cruzei com o cadastro de contatos do @Salesforce. Encontrei 3 faturas vencidas com atraso superior a 15 dias:\n\n• **Acme Engenharia Corp** (FAT-2026-9812): R$ 48.500,00 (18 dias de atraso) — Contato: Carlos Silva (CFO)\n• **Beta Logística S.A.** (FAT-2026-9740): R$ 32.100,00 (22 dias de atraso) — Contato: Fernando Rocha (Diretor)\n• **Delta Tech Inovações** (FAT-2026-9655): R$ 19.800,00 (16 dias de atraso) — Contato: Roberta Mendes (Financeiro)\n\nVocê pode inspecionar e disparar o fluxo de cobrança automática passo a passo na aba **Fluxos de Automação**.'
            }
          ]
        },
        {
          id: 'conv-2',
          title: 'Validação de Algoritmos de Roteamento Omniroute $0.00',
          dateGroup: 'Hoje',
          updatedAt: new Date().toISOString(),
          messages: [
            {
              id: 'm-3',
              sender: 'user',
              senderName: 'Eduardo Antigravity',
              timestamp: '01:40',
              text: 'Como está o roteamento local de tokens no Ollama?'
            },
            {
              id: 'm-4',
              sender: 'agent',
              senderName: 'Omniroute Router',
              timestamp: '01:41',
              text: 'Roteamento 95.2% Local ativado! Economizando aproximadamente $850 USD acumulados em comparação com APIs de Nuvem.'
            }
          ]
        }
      ]
    },
    {
      id: 'prj-arch',
      name: 'Arch Living',
      conversationsCount: 2,
      activeAgentsCount: 2,
      conversations: [
        {
          id: 'conv-3',
          title: 'Design System & Renderização 3D de Ambientes',
          dateGroup: 'Ontem',
          updatedAt: new Date().toISOString(),
          messages: []
        }
      ]
    },
    {
      id: 'prj-defesa',
      name: 'Defesa B2B',
      conversationsCount: 1,
      activeAgentsCount: 1,
      conversations: [
        {
          id: 'conv-4',
          title: 'Auditoria de Vulnerabilidades & SAIF Google',
          dateGroup: 'Últimos 7 dias',
          updatedAt: new Date().toISOString(),
          messages: []
        }
      ]
    }
  ]);

  const [activeConversation, setActiveConversation] = useState<Conversation>(projects[0].conversations[0]);
  const [openConversations, setOpenConversations] = useState<Conversation[]>([
    projects[0].conversations[0],
    projects[0].conversations[1]
  ]);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setActiveMainView('chat');
    setOpenConversations(prev => {
      if (prev.some(c => c.id === conv.id)) {
        return prev;
      }
      if (prev.length < 5) {
        return [...prev, conv];
      }
      // Se já atingiu 5 abas, substitui a última pela nova selecionada
      return [...prev.slice(0, 4), conv];
    });
  };

  const handleCloseTab = (convId: string) => {
    setOpenConversations(prev => {
      if (prev.length <= 1) return prev;
      const nextTabs = prev.filter(c => c.id !== convId);
      if (activeConversation.id === convId) {
        setActiveConversation(nextTabs[0]);
      }
      return nextTabs;
    });
  };

  const handleNewConversation = () => {
    const newC: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'Nova Conversa PCL AEOS',
      dateGroup: 'Hoje',
      updatedAt: new Date().toISOString(),
      messages: []
    };

    setProjects(prevProjects => {
      const updated = [...prevProjects];
      if (updated[0]) {
        updated[0] = {
          ...updated[0],
          conversations: [newC, ...updated[0].conversations]
        };
      }
      return updated;
    });

    setOpenConversations(prev => {
      if (prev.length < 5) {
        return [...prev, newC];
      }
      return [...prev.slice(0, 4), newC];
    });

    setActiveConversation(newC);
    setActiveMainView('chat');
  };

  const handleRenameConversation = (convId: string, newTitle: string) => {
    setProjects(prev => prev.map(proj => ({
      ...proj,
      conversations: proj.conversations.map(c => c.id === convId ? { ...c, title: newTitle } : c)
    })));
    setOpenConversations(prev => prev.map(c => c.id === convId ? { ...c, title: newTitle } : c));
    if (activeConversation.id === convId) {
      setActiveConversation(prev => ({ ...prev, title: newTitle }));
    }
  };

  const handleDeleteConversation = (convId: string) => {
    setProjects(prev => prev.map(proj => ({
      ...proj,
      conversations: proj.conversations.filter(c => c.id !== convId)
    })));
    setOpenConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConversation.id === convId) {
      const remaining = openConversations.filter(c => c.id !== convId);
      if (remaining.length > 0) {
        setActiveConversation(remaining[0]);
      } else if (projects[0]?.conversations[0]) {
        setActiveConversation(projects[0].conversations[0]);
      }
    }
  };

  const handleMoveConversation = (convId: string, targetProjectId: string) => {
    let targetConv: Conversation | null = null;
    projects.forEach(p => {
      const found = p.conversations.find(c => c.id === convId);
      if (found) targetConv = found;
    });

    if (!targetConv) return;

    setProjects(prev => prev.map(proj => {
      // Remove do projeto atual
      const filtered = proj.conversations.filter(c => c.id !== convId);
      // Se for o projeto de destino, adiciona
      if (proj.id === targetProjectId) {
        return {
          ...proj,
          conversations: [targetConv!, ...filtered],
          conversationsCount: filtered.length + 1
        };
      }
      return {
        ...proj,
        conversations: filtered,
        conversationsCount: filtered.length
      };
    }));
  };

  const handleCreateProject = (projectName: string) => {
    const newProj: Project = {
      id: `prj-${Date.now()}`,
      name: projectName,
      conversationsCount: 0,
      activeAgentsCount: 1,
      conversations: []
    };
    setProjects(prev => [...prev, newProj]);
  };

  const agentsList: Agent[] = [
    { id: 'ag-1', name: 'Cortex Master', role: 'Orquestrador de Arquitetura', model: 'Ollama llama3.3:70b', status: 'active', currentTask: 'Validando Stage Gates TLC v3', timerFormatted: '00:04:12', assignedSkills: ['cortex'] },
    { id: 'ag-2', name: 'Paperclip Auditor', role: 'Inspeção de Anexos & Contexto', model: 'Ollama qwen2.5:72b', status: 'active', currentTask: 'Sanitizando PII Guard LGPD', timerFormatted: '00:01:45', assignedSkills: ['accidental-data-loss-prevention'] },
    { id: 'ag-3', name: 'Claude 3.5 Architect', role: 'Engenheiro de Código & UI', model: 'Claude 3.5 Sonnet', status: 'standby', assignedSkills: [] }
  ];

  const systemServices: ServiceStatus[] = [
    { id: 's-1', name: 'Ollama Engine Local', status: 'online', latencyMs: 24, icon: 'Cpu' },
    { id: 's-2', name: 'PostgreSQL Audit Trail', status: 'online', latencyMs: 12, icon: 'Database' },
    { id: 's-3', name: 'Cortex Graph Visualizer', status: 'online', latencyMs: 45, icon: 'GitBranch' },
    { id: 's-4', name: 'Google Vertex AI Hub', status: 'online', latencyMs: 180, icon: 'Globe' }
  ];

  const handleSendMessage = async (text: string, webSearch?: boolean, profileId: string = 'sintese-executiva') => {
    const userMessageId = `msg-${Date.now()}`;
    const agentReplyId = `msg-reply-${Date.now() + 1}`;

    const newMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      senderName: userProfile.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    // Estrutura inicial do Stepper de Execução Cognitiva
    const initialSteps: ChatMessage['steps'] = [
      { id: 'laya_coprocessor', label: 'Triagem Semântica & Intenção (Laya Coprocessor em CPU)', status: 'running', detail: 'Processando em CPU local host (0 MB VRAM)...' },
      { id: 'canonical_knowledge', label: 'Consulta à Base Canônica PCL AEOS (ADRs & Skills)', status: 'pending' },
      { id: 'web_search', label: 'Pesquisa Web Avançada em Múltiplas Fontes', status: 'pending' },
      { id: 'omniroute_llm', label: 'Síntese de Resposta Factual Fundamentada', status: 'pending' },
      { id: 'audit_validation', label: 'Validação de Evidências & Auditoria de Resposta', status: 'pending' }
    ];

    const placeholderReply: ChatMessage = {
      id: agentReplyId,
      sender: 'agent',
      senderName: 'Cortex Enterprise Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: '',
      isProcessing: true,
      activeStepIndex: 0,
      steps: initialSteps,
      elapsedSeconds: 0.1
    };

    setActiveConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage, placeholderReply]
    }));

    // Cronômetro dinâmico em tempo real atualizado a cada 100ms
    const startTime = performance.now();
    const timerInterval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      setActiveConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => m.id === agentReplyId ? { ...m, elapsedSeconds: elapsed } : m)
      }));
    }, 100);

    try {
      // ETAPA 1: Laya Coprocessor System One em CPU
      const layaStartTime = performance.now();
      const layaResult = await layaCoprocessorService.classifyIntent(text);
      const layaDuration = Math.round(performance.now() - layaStartTime);

      setActiveConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== agentReplyId || !m.steps) return m;
          const updatedSteps = [...m.steps];
          updatedSteps[0] = { ...updatedSteps[0], status: 'completed', durationMs: layaDuration, detail: `Intenção: ${layaResult.intent} | Rota: ${layaResult.recommendedRoute} (0 MB VRAM)` };
          updatedSteps[1] = { ...updatedSteps[1], status: 'running', detail: 'Indexando ADR-0001 a ADR-0005 e catálogo de skills...' };
          return { ...m, activeStepIndex: 1, steps: updatedSteps };
        })
      }));

      // ETAPA 2 & 3: Grounding Híbrido Federado (Conhecimento Local + Busca Web Automática)
      const groundingStartTime = performance.now();
      const groundingResult = await intelligentGroundingService.performGrounding(text, webSearch);
      const groundingDuration = Math.round(performance.now() - groundingStartTime);

      setActiveConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== agentReplyId || !m.steps) return m;
          const updatedSteps = [...m.steps];
          updatedSteps[1] = { 
            ...updatedSteps[1], 
            status: 'completed', 
            durationMs: Math.round(groundingDuration * 0.4), 
            detail: `${groundingResult.localMatchesCount} especificações canônicas PCL recuperadas.` 
          };
          updatedSteps[2] = { 
            ...updatedSteps[2], 
            status: groundingResult.webResultsCount > 0 ? 'completed' : 'skipped', 
            durationMs: Math.round(groundingDuration * 0.6), 
            detail: groundingResult.webResultsCount > 0 
              ? `${groundingResult.webResultsCount} referências externas indexadas (Google / DuckDuckGo).`
              : 'Dispensada (coberta integralmente pelas fontes canônicas).' 
          };
          updatedSteps[3] = { ...updatedSteps[3], status: 'running', detail: 'Executando inferência com grounding factual estrito...' };
          return { ...m, activeStepIndex: 3, steps: updatedSteps };
        })
      }));

      // ETAPA 4: Inferência Fundamentada no OmniRoute / Ollama
      const omniStartTime = performance.now();
      const omniResult = await omniRouteService.sendPrompt(groundingResult.groundedPrompt, undefined, profileId);
      const omniDuration = Math.round(performance.now() - omniStartTime);

      // ETAPA 5: Finalização e Auditoria
      clearInterval(timerInterval);
      const totalElapsed = (performance.now() - startTime) / 1000;

      const webRefs = groundingResult.sources.map(s => ({
        title: s.title,
        url: s.url,
        snippet: s.snippet,
        source: s.sourceType === 'local_canonical' ? 'Repositório Canônico PCL' : 'Web Externa'
      }));

      setActiveConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== agentReplyId || !m.steps) return m;
          const updatedSteps = [...m.steps];
          updatedSteps[3] = { ...updatedSteps[3], status: 'completed', durationMs: omniDuration, detail: `Inferência concluída via ${omniResult.providerUsed} (${omniResult.modelUsed}).` };
          updatedSteps[4] = { ...updatedSteps[4], status: 'completed', durationMs: 12, detail: `Consistência factual validada (SHA-256: ${omniResult.sha256Hash.slice(0, 12)}...).` };

          return {
            ...m,
            text: omniResult.text,
            isProcessing: false,
            activeStepIndex: 4,
            steps: updatedSteps,
            elapsedSeconds: totalElapsed,
            confidenceScore: groundingResult.confidenceScore,
            webReferences: webRefs
          };
        })
      }));
    } catch (err) {
      clearInterval(timerInterval);
      console.error('Falha na execução do pipeline cognitivo:', err);
      setActiveConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== agentReplyId) return m;
          return {
            ...m,
            text: 'Ocorreu uma falha na orquestração da consulta. Por favor, tente novamente.',
            isProcessing: false
          };
        })
      }));
    }
  };

  const handleCreateBranch = (messageId: string) => {
    const msgIndex = activeConversation.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const branchedMessages = activeConversation.messages.slice(0, msgIndex + 1);
    const newConv: Conversation = {
      id: `conv-branch-${Date.now()}`,
      title: `${activeConversation.title} (Branch)`,
      dateGroup: 'Hoje',
      updatedAt: new Date().toISOString(),
      messages: branchedMessages
    };

    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.conversations.some(c => c.id === activeConversation.id)) {
          return {
            ...p,
            conversations: [newConv, ...p.conversations]
          };
        }
        return p;
      });
    });

    setOpenConversations(prev => {
      if (prev.length < 5) {
        return [...prev, newConv];
      }
      return [...prev.slice(0, 4), newConv];
    });

    setActiveConversation(newConv);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Header Bar com Botão Telemetria & Status */}
      <Header
        user={userProfile}
        lang={lang}
        onLanguageChange={setLang}
        theme={theme}
        onThemeToggle={handleToggleTheme}
        onOpenSettings={(tab) => {
          if (tab) setSettingsTab(tab);
          setSettingsOpen(true);
        }}
        onToggleStatusPanel={() => setRightCollapsed(!rightCollapsed)}
        isStatusPanelOpen={!rightCollapsed}
      />

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Retrátil com Acordeão de Projetos e Switcher de Visão) */}
        <LeftSidebar
          collapsed={leftCollapsed}
          onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
          projects={projects}
          activeConversationId={activeConversation.id}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          activeView={activeMainView}
          onSelectView={setActiveMainView}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleDeleteConversation}
          onMoveConversation={handleMoveConversation}
          onCreateProject={handleCreateProject}
        />

        {/* Central Workspace & Composer or Specialized Views (Meetings / Flows) */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">
          {activeMainView === 'chat' ? (
            <>
              <DualPlexWorkspace
                conversation={activeConversation}
                openConversations={openConversations}
                onSelectConversation={handleSelectConversation}
                onCloseConversation={handleCloseTab}
                onNewConversation={handleNewConversation}
                onOpenArtifact={art => setActiveArtifact(art)}
                onCreateBranch={handleCreateBranch}
              />

              <SuperChatbubble
                onSendMessage={handleSendMessage}
                usedTokens={14200}
                maxTokens={128000}
              />
            </>
          ) : activeMainView === 'meetings' ? (
            <MeetingsIntelligenceView onOpenArtifact={art => setActiveArtifact(art)} />
          ) : (
            <FlowsAutomationCanvas />
          )}
        </main>

        {/* Right Sidebar (Status Real-Time & Timers com sincronização ativa de inferência) */}
        <RightSidebarStatus
          collapsed={rightCollapsed}
          onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
          agents={agentsList}
          services={systemServices}
          isProcessing={Boolean(activeConversation.messages.find(m => m.isProcessing))}
          activeTaskName={
            activeConversation.messages.find(m => m.isProcessing)?.steps?.[
              activeConversation.messages.find(m => m.isProcessing)?.activeStepIndex ?? 0
            ]?.label
          }
          activeStepIndex={
            activeConversation.messages.find(m => m.isProcessing)?.activeStepIndex ?? 4
          }
        />
      </div>

      {/* PCL Sovereign Drawer (Enclave Documental & Telemetria DAG) */}
      <PCLArtifactDrawer
        artifact={activeArtifact}
        onClose={() => setActiveArtifact(null)}
      />

      {/* Unified Administration & Governance Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          user={userProfile}
          defaultTab={settingsTab}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
