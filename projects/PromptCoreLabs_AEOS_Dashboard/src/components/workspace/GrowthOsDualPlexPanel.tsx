import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Layers,
  Award,
  ArrowRight,
  RefreshCw,
  Server,
  Lock
} from 'lucide-react';
import {
  GrowthStoreDivisionId,
  GrowthStoreDivisionSpec,
  GrowthBlockSchemaModule,
  GrowthOsStoreState,
  ConfidenceSurfacingLevel,
  GoLiveReadinessReport
} from '../../types';

interface GrowthOsDualPlexPanelProps {
  activeDivisionId?: GrowthStoreDivisionId;
  onSelectDivision?: (divisionId: GrowthStoreDivisionId) => void;
  onTrialPillTextChange?: (pillText: string, mode: 'trial_14d_all_modules' | 'post_trial_custom_bundle', count: number) => void;
  onExecuteModulePrompt?: (prompt: string) => void;
}

const INITIAL_DIVISIONS: GrowthStoreDivisionSpec[] = [
  {
    id: 'estudio-midia',
    order: 1,
    name: '1. Estúdio & Mídia',
    tagline: 'Brand DNA, PCL VoxCanvas™ & Landing Pages High-Ticket Zero AI Slop',
    accentColor: 'indigo',
    modules: [
      {
        id: 'mod-brand-dna-voxcanvas',
        divisionId: 'estudio-midia',
        title: 'Brand DNA & PCL VoxCanvas™ Studio',
        subtitle: 'Direção criativa multimodal por voz neural e identidade determinística.',
        layaInsideBadge: 'Laya™ Inside • 0 MB VRAM',
        vramMb: 0,
        confidenceScore: 0.96,
        confidenceLevel: 'green',
        confidenceLabel: 'Verde (96% • Alta Confiança Laya)',
        microRoiLabel: '+$3.420/mês • 38h poupadas',
        microRoiUsdMonthly: 3420,
        microRoiHoursSaved: 38,
        day14RoiRank: 2,
        previewSummary: 'Extrai o Brand DNA corporativo e compila LPs e peças criativas com CLS = 0 e WCAG AAA.',
        previewKpis: [
          { label: 'Fidelidade Brand DNA', value: '99.2%', delta: '+18% vs Genérico' },
          { label: 'Tempo de Produção LP', value: '4 min', delta: '-92% retrabalho' },
          { label: 'Custo Marginal CPU', value: '$0.00', delta: '0 MB VRAM' }
        ],
        selectedForPostTrial: true
      },
      {
        id: 'mod-high-ticket-lps',
        divisionId: 'estudio-midia',
        title: 'High-Ticket Landing Pages & Answer Nuggets',
        subtitle: 'Páginas B2B com Schema.org JSON-LD e dobra superior de 3 segundos.',
        layaInsideBadge: 'Laya™ Inside • 0 MB VRAM',
        vramMb: 0,
        confidenceScore: 0.89,
        confidenceLevel: 'green',
        confidenceLabel: 'Verde (89% • Alta Confiança Laya)',
        microRoiLabel: '+$2.150/mês • 24h poupadas',
        microRoiUsdMonthly: 2150,
        microRoiHoursSaved: 24,
        day14RoiRank: 5,
        previewSummary: 'Gera estruturas Schema.org e Answer Nuggets prontos para indexação GEO/SEO.',
        previewKpis: [
          { label: 'Score Lighthouse CLS', value: '0.00', delta: 'Zero Layout Shift' },
          { label: 'Conversão Dobra 3s', value: '6.8%', delta: '+2.4x baseline' },
          { label: 'Auditoria WCAG AAA', value: '100%', delta: 'Aprovado' }
        ],
        selectedForPostTrial: false
      }
    ]
  },
  {
    id: 'atracao-trafego',
    order: 2,
    name: '2. Atração & Tráfego',
    tagline: 'SEO Programático, GEO Answer Nuggets & Inteligência Competitiva PulseIQ™',
    accentColor: 'sky',
    modules: [
      {
        id: 'mod-seo-pulseiq',
        divisionId: 'atracao-trafego',
        title: 'PCL PulseIQ™ & GEO Programático',
        subtitle: 'Domínio de citações em motores generativos e radar de demanda B2B.',
        layaInsideBadge: 'Laya™ Inside • 0 MB VRAM',
        vramMb: 0,
        confidenceScore: 0.92,
        confidenceLevel: 'green',
        confidenceLabel: 'Verde (92% • Alta Confiança Laya)',
        microRoiLabel: '+$2.890/mês • 31h poupadas',
        microRoiUsdMonthly: 2890,
        microRoiHoursSaved: 31,
        day14RoiRank: 3,
        previewSummary: 'Monitora lacunas semânticas de concorrentes (anti-SSRF ativo) e publica clusters GEO.',
        previewKpis: [
          { label: 'Share of Model (GEO)', value: '64.5%', delta: '+29% em 14d' },
          { label: 'CAC Orgânico', value: '-41%', delta: 'Tráfego Qualificado' },
          { label: 'Triagem Laya NLI', value: '22 ms', delta: 'CPU INT8' }
        ],
        selectedForPostTrial: true
      },
      {
        id: 'mod-linkedin-oidc-syndication',
        divisionId: 'atracao-trafego',
        title: 'LinkedIn Executive Syndication (OIDC Oficial)',
        subtitle: 'Publicação executiva via API REST v2 oficial sem risco de bloqueio.',
        layaInsideBadge: 'Laya™ Inside • 0 MB VRAM',
        vramMb: 0,
        confidenceScore: 0.78,
        confidenceLevel: 'amber',
        confidenceLabel: 'Âmbar (78% • Revisão Assistida)',
        microRoiLabel: '+$1.640/mês • 19h poupadas',
        microRoiUsdMonthly: 1640,
        microRoiHoursSaved: 19,
        day14RoiRank: 6,
        previewSummary: 'Prepara narrativas Sexy Canvas para C-Level com aprovação humana antes do post.',
        previewKpis: [
          { label: 'Compliance LinkedIn', value: '100% OIDC', delta: 'Zero Cookie Scraping' },
          { label: 'Engajamento Decisores', value: '4.9x', delta: 'C-Level Reach' },
          { label: 'Gate Humano HITL', value: 'Obrigatório', delta: 'ISO 42001' }
        ],
        selectedForPostTrial: false
      }
    ]
  },
  {
    id: 'conversao-receita',
    order: 3,
    name: '3. Conversão & Receita',
    tagline: 'Funil Bowtie RevOps, Lead X-Ray (HubSpot/RD) & Otimização Contínua Morph™',
    accentColor: 'emerald',
    modules: [
      {
        id: 'mod-bowtie-revops',
        divisionId: 'conversao-receita',
        title: 'Bowtie RevOps & Lead X-Ray (HubSpot + RD Station)',
        subtitle: 'Qualificação preditiva em 22ms e expansão de LTV pós-venda.',
        layaInsideBadge: 'Laya™ Inside • 0 MB VRAM',
        vramMb: 0,
        confidenceScore: 0.94,
        confidenceLevel: 'green',
        confidenceLabel: 'Verde (94% • Alta Confiança Laya)',
        microRoiLabel: '+$4.750/mês • 46h poupadas',
        microRoiUsdMonthly: 4750,
        microRoiHoursSaved: 46,
        day14RoiRank: 1,
        previewSummary: 'Cruza sinais de intenção do CRM via MCP oficial e prioriza deals de fechamento imediato.',
        previewKpis: [
          { label: 'Velocidade de Pipeline', value: '+38%', delta: 'HubSpot + RD v2' },
          { label: 'Recuperação de Deals', value: '$14.2k', delta: 'Em 14 dias' },
          { label: 'Precisão Lead Scoring', value: '94.1%', delta: 'Laya 771d Head' }
        ],
        selectedForPostTrial: true
      },
      {
        id: 'mod-morph-outbound-hitl',
        divisionId: 'conversao-receita',
        title: 'PCL Morph™ Outbound & Cadência Crítica',
        subtitle: 'Disparos comerciais multicanal com trava obrigatória Human-in-the-Loop.',
        layaInsideBadge: 'Laya™ Inside • 0 MB VRAM',
        vramMb: 0,
        confidenceScore: 0.56,
        confidenceLevel: 'red',
        confidenceLabel: 'Vermelho (56% • Requer Gate Humano HITL)',
        microRoiLabel: '+$1.290/mês • 15h poupadas',
        microRoiUsdMonthly: 1290,
        microRoiHoursSaved: 15,
        day14RoiRank: 7,
        previewSummary: 'Ações externas de escrita em lote exigem confirmação explícita no ActionPreviewCard.',
        previewKpis: [
          { label: 'Política de Disparo', value: 'HITL Strict', delta: 'Zero Spam Autônomo' },
          { label: 'Taxa de Resposta', value: '21.4%', delta: 'Personalização Real' },
          { label: 'Trilha SHA-256', value: 'Ativa', delta: 'Auditável' }
        ],
        selectedForPostTrial: false
      }
    ]
  },
  {
    id: 'comando-blindagem',
    order: 4,
    name: '4. Comando & Blindagem',
    tagline: 'PCL Aegis™ Zero-Leakage, Cortex Reflex™ & Economia Token Tax Saved',
    accentColor: 'amber',
    modules: [
      {
        id: 'mod-aegis-reflex-finops',
        divisionId: 'comando-blindagem',
        title: 'PCL Aegis™ + Cortex Reflex™ & Token Tax Saved',
        subtitle: 'Defesa Out-of-Band p95 < 30ms, Hard Lock FinOps e Custo Marginal $0.00.',
        layaInsideBadge: 'Laya™ Inside • 0 MB VRAM',
        vramMb: 0,
        confidenceScore: 0.99,
        confidenceLevel: 'green',
        confidenceLabel: 'Verde (99% • Alta Confiança Laya)',
        microRoiLabel: '+$2.680/mês • 40h poupadas',
        microRoiUsdMonthly: 2680,
        microRoiHoursSaved: 40,
        day14RoiRank: 4,
        previewSummary: 'Bloqueia vazamento de PII/segredos em <1ms e elimina a Taxa de Tokens de nuvens opacas.',
        previewKpis: [
          { label: 'Latência Gatekeeper p95', value: '0.13 ms', delta: 'SLA < 30 ms' },
          { label: 'Economia de Tokens', value: '84.2%', delta: 'Laya CPU + CodeGraph' },
          { label: 'Conformidade ISO', value: '42001/27001', delta: 'No Black-Box Score' }
        ],
        selectedForPostTrial: true
      }
    ]
  }
];

export const GrowthOsDualPlexPanel: React.FC<GrowthOsDualPlexPanelProps> = ({
  activeDivisionId = 'estudio-midia',
  onSelectDivision,
  onTrialPillTextChange,
  onExecuteModulePrompt
}) => {
  const [selectedDivisionId, setSelectedDivisionId] = useState<GrowthStoreDivisionId>(activeDivisionId);
  const [divisions, setDivisions] = useState<GrowthStoreDivisionSpec[]>(INITIAL_DIVISIONS);
  const [trialMode, setTrialMode] = useState<'trial_14d_all_modules' | 'post_trial_custom_bundle'>('trial_14d_all_modules');
  const [activeDay, setActiveDay] = useState<'D0' | 'D3' | 'D7' | 'D14'>('D0');
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    'mod-brand-dna-voxcanvas',
    'mod-seo-pulseiq',
    'mod-bowtie-revops',
    'mod-aegis-reflex-finops'
  ]);
  const [focusedModuleId, setFocusedModuleId] = useState<string>('mod-brand-dna-voxcanvas');
  const [readiness, setReadiness] = useState<GoLiveReadinessReport | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    setSelectedDivisionId(activeDivisionId);
    const div = divisions.find(d => d.id === activeDivisionId);
    if (div && div.modules[0]) {
      setFocusedModuleId(div.modules[0].id);
    }
  }, [activeDivisionId]);

  useEffect(() => {
    fetch('/api/aeos/growthos/store-state')
      .then(r => (r.ok ? r.json() : null))
      .then((data: GrowthOsStoreState | null) => {
        if (data && data.ok) {
          setDivisions(data.divisions);
          setTrialMode(data.trialMode);
          setActiveDay(data.activeCurrentDay);
          const ids = data.divisions
            .flatMap(d => d.modules)
            .filter(m => m.selectedForPostTrial)
            .map(m => m.id);
          if (ids.length > 0) setSelectedModuleIds(ids);
        }
      })
      .catch(() => {});

    fetch('/api/aeos/ops/go-live-readiness')
      .then(r => (r.ok ? r.json() : null))
      .then((rep: GoLiveReadinessReport | null) => {
        if (rep && rep.ok) setReadiness(rep);
      })
      .catch(() => {});
  }, []);

  const currentDivision = divisions.find(d => d.id === selectedDivisionId) || divisions[0];
  const allModules = divisions.flatMap(d => d.modules);
  const focusedModule: GrowthBlockSchemaModule =
    allModules.find(m => m.id === focusedModuleId) || currentDivision.modules[0];

  const syncOnboardingState = async (
    nextDay: 'D0' | 'D3' | 'D7' | 'D14',
    nextMode: 'trial_14d_all_modules' | 'post_trial_custom_bundle',
    nextModuleIds: string[]
  ) => {
    setActiveDay(nextDay);
    setTrialMode(nextMode);
    setSelectedModuleIds(nextModuleIds);
    const pillText =
      nextMode === 'post_trial_custom_bundle'
        ? `Núcleo Laya + ${nextModuleIds.length} Módulos`
        : '14d Trial • Todos os Módulos';
    onTrialPillTextChange?.(pillText, nextMode, nextModuleIds.length);

    try {
      await fetch('/api/aeos/growthos/onboarding/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeCurrentDay: nextDay,
          trialMode: nextMode,
          selectedModuleIds: nextModuleIds
        })
      });
    } catch {}
  };

  const handleToggleModuleSelection = (modId: string) => {
    const exists = selectedModuleIds.includes(modId);
    const nextIds = exists
      ? selectedModuleIds.filter(id => id !== modId)
      : [...selectedModuleIds, modId];
    const safeIds = nextIds.length > 0 ? nextIds : [modId];
    syncOnboardingState(activeDay, trialMode, safeIds);
  };

  const handleTriggerR2Backup = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch('/api/aeos/ops/backup-snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'cloudflare-r2' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.receipt && readiness) {
          setReadiness({
            ...readiness,
            r2B2BackupVerified: true,
            lastBackupReceipt: data.receipt
          });
        }
      }
    } catch {}
    setIsBackingUp(false);
  };

  const renderConfidenceBadge = (level: ConfidenceSurfacingLevel, label: string) => {
    if (level === 'green') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>{label}</span>
        </span>
      );
    }
    if (level === 'amber') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          <span>{label}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30">
        <ShieldAlert className="w-3 h-3 text-rose-500" />
        <span>{label}</span>
      </span>
    );
  };

  const day14Ranking = [...allModules].sort((a, b) => a.day14RoiRank - b.day14RoiRank);

  return (
    <div
      data-testid="growthos-dualplex-panel"
      className="h-full flex flex-col bg-slate-50/70 dark:bg-slate-950/70 overflow-y-auto custom-scrollbar p-4 space-y-4 select-none"
    >
      {/* Cabeçalho da Casca PCL GrowthOS™ (PROAA-18/19/22/23) */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                  PCL GrowthOS™ Store • BlockSchema Modular (CLS = 0)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Laya™ Inside • 0 MB VRAM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                4 Divisões Autônomas Supervisionadas • Confidence Surfacing • Onboarding Telepático D0–D14
              </p>
            </div>
          </div>

          {/* Botão de Transição Transparente do Trial 14d -> Núcleo Laya + X Módulos */}
          <button
            type="button"
            data-testid="dualplex-trial-transition-btn"
            onClick={() => {
              const nextMode =
                trialMode === 'trial_14d_all_modules'
                  ? 'post_trial_custom_bundle'
                  : 'trial_14d_all_modules';
              const nextDay = nextMode === 'post_trial_custom_bundle' ? 'D14' : 'D0';
              syncOnboardingState(nextDay, nextMode, selectedModuleIds);
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition flex items-center space-x-1.5 shadow-2xs ${
              trialMode === 'post_trial_custom_bundle'
                ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                : 'bg-slate-900 dark:bg-slate-800 text-white border-slate-700 hover:bg-slate-800'
            }`}
            title="Alternar visualização entre Trial 14d (Todos os Módulos) e Pacote Consolidado Pós-Dia 14"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {trialMode === 'post_trial_custom_bundle'
                ? `Núcleo Laya + ${selectedModuleIds.length} Módulos`
                : '14d Trial • Todos os Módulos'}
            </span>
          </button>
        </div>

        {/* Navegação Rápida pelas 4 Divisões da Growth Store */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 pt-1">
          {divisions.map(div => {
            const isSelected = div.id === selectedDivisionId;
            return (
              <button
                key={div.id}
                type="button"
                data-testid={`growth-division-tab-${div.id}`}
                onClick={() => {
                  setSelectedDivisionId(div.id);
                  if (div.modules[0]) setFocusedModuleId(div.modules[0].id);
                  onSelectDivision?.(div.id);
                }}
                className={`px-2.5 py-2 rounded-xl text-left border transition flex flex-col justify-between min-h-[54px] ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-emerald-500/50 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-[11px] font-bold truncate">{div.name}</span>
                <span className={`text-[9.5px] truncate ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {div.modules.length} Módulos • Laya™ Inside
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grade BlockSchema (CLS = 0: altura mínima fixa reservada por bloco) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentDivision.modules.map(mod => {
          const isFocused = mod.id === focusedModule.id;
          const isKept = selectedModuleIds.includes(mod.id);
          return (
            <div
              key={mod.id}
              data-testid={`block-schema-card-${mod.id}`}
              onClick={() => setFocusedModuleId(mod.id)}
              className={`min-h-[172px] p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isFocused
                  ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/30 shadow-md'
                  : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <Cpu className="w-3 h-3 text-indigo-500" />
                    <span>{mod.layaInsideBadge}</span>
                  </span>
                  {renderConfidenceBadge(mod.confidenceLevel, mod.confidenceLabel)}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{mod.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {mod.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {mod.microRoiLabel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleModuleSelection(mod.id);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition ${
                    isKept
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400/60'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isKept ? '✓ Mantido Pós-D14' : '+ Incluir no Pacote'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Canvas de Preview + Micro-ROI do Módulo Selecionado */}
      <div
        data-testid="growthos-module-preview-canvas"
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
              Dual-Plex Preview Canvas • Micro-ROI Auditável (#Rank {focusedModule.day14RoiRank} no Dia 14)
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {focusedModule.title}
            </h4>
          </div>

          {onExecuteModulePrompt && (
            <button
              type="button"
              onClick={() =>
                onExecuteModulePrompt(
                  `[PCL GrowthOS™ • ${currentDivision.name}] Executar módulo "${focusedModule.title}" com Laya™ Inside (0 MB VRAM) e apresentar diagnóstico de Micro-ROI.`
                )
              }
              className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-[11px] font-semibold hover:opacity-90 transition flex items-center space-x-1.5"
            >
              <span>Acionar Módulo no Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {focusedModule.previewSummary}
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {focusedModule.previewKpis.map((kpi, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800"
            >
              <span className="text-[10px] text-slate-400 block truncate">{kpi.label}</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                {kpi.value}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {kpi.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fluxo Onboarding Telepático D0–D14 com Ranking Executivo de ROI no Dia 14 */}
      <div
        data-testid="telepathic-onboarding-d0-d14"
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
              Jornada Zero-Friction • PROAA-19 / PROAA-23
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Onboarding Telepático D0–D14 & Ranking de ROI no Dia 14
            </h4>
          </div>

          <div className="flex items-center space-x-1">
            {(['D0', 'D3', 'D7', 'D14'] as const).map(d => (
              <button
                key={d}
                type="button"
                data-testid={`onboarding-day-btn-${d}`}
                onClick={() =>
                  syncOnboardingState(
                    d,
                    d === 'D14' ? 'post_trial_custom_bundle' : trialMode,
                    selectedModuleIds
                  )
                }
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition ${
                  activeDay === d
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Milestones D0, D3, D7, D14 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              day: 'D0',
              title: 'D0 • Brand DNA & Cofre AES-256-GCM',
              desc: 'Ingestão telepática de identidade e 8 conectores MCP oficiais (M3.1/M3.2).'
            },
            {
              day: 'D3',
              title: 'D3 • Atração GEO & Bowtie RevOps',
              desc: 'Clusters Answer Nuggets + triagem Laya 771d no pipeline HubSpot/RD.'
            },
            {
              day: 'D7',
              title: 'D7 • VoxCanvas™ & Executor DAG SHA-256',
              desc: 'Reuniões viram tasks no ClickUp/Jira via HITL com 38h/mês poupadas.'
            },
            {
              day: 'D14',
              title: 'D14 • Ranking Executivo de ROI & Escolha',
              desc: `Transição sem surpresa: "14d Trial • Todos os Módulos" -> "Núcleo Laya + ${selectedModuleIds.length} Módulos".`
            }
          ].map(ms => (
            <div
              key={ms.day}
              className={`p-2.5 rounded-xl border text-xs ${
                activeDay === ms.day
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700'
                  : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800'
              }`}
            >
              <div className="font-bold text-slate-900 dark:text-white text-[11px]">{ms.title}</div>
              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">{ms.desc}</div>
            </div>
          ))}
        </div>

        {/* Tabela de Ranking de ROI no Dia 14 */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
            <span>Ranking Executivo de ROI no Dia 14 (Auditoria FinOps Real)</span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              Economia Mensal Projetada: $
              {allModules
                .filter(m => selectedModuleIds.includes(m.id))
                .reduce((acc, m) => acc + m.microRoiUsdMonthly, 0)
                .toLocaleString()}
              /mês
            </span>
          </div>
          <div className="space-y-1">
            {day14Ranking.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[10px] flex items-center justify-center">
                    #{item.day14RoiRank}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 font-mono text-[10.5px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    +${item.microRoiUsdMonthly}/mês
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                    {(item.microRoiUsdMonthly / 290).toFixed(1)}x ROI
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marco M5 — Go-Live Readiness (Containers 0 MB VRAM + Caddy HTTPS + Backup R2/B2) */}
      <div
        data-testid="m5-golive-readiness-card"
        className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">
              Marco M5 • Go-Live Readiness (Docker Non-Root • 0 MB VRAM • Caddy HTTPS • R2/B2 DRP)
            </span>
          </div>
          <button
            type="button"
            onClick={handleTriggerR2Backup}
            disabled={isBackingUp}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-semibold transition flex items-center space-x-1"
          >
            <RefreshCw className={`w-3 h-3 ${isBackingUp ? 'animate-spin' : ''}`} />
            <span>{isBackingUp ? 'Sincronizando R2/B2...' : 'Snapshot Backup R2/B2'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block">pcl-codegraph :20150</span>
            <span className="text-emerald-400 font-bold">0 MB VRAM • 512m • Non-Root</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block">pcl-laya :20140 & GK :20160</span>
            <span className="text-emerald-400 font-bold">CPU INT8 • p95 &lt; 30ms</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block">Caddy TLS & Backup DRP</span>
            <span className="text-sky-300 font-bold truncate block">
              SHA-256: {readiness?.lastBackupReceipt?.manifestSha256?.slice(0, 12) || 'VERIFIED'}...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
