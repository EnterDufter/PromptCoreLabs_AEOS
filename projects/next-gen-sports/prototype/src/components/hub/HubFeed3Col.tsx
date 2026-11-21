import React, { useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  FileCheck2,
  Gauge,
  Lock,
  Plus,
  Send,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { useNgs } from '../../context/NgsContext';
import { FeedCategory } from '../../types/ngs';
import { PostCard } from './PostCard';

type FeedFilter = 'all' | 'following' | 'proofs' | 'opportunities';

const TRENDING_TAGS = [
  '#CopaSPKart',
  '#Readiness80Plus',
  '#DigitalTwin',
  '#ProofOfTalent',
  '#KartGraduados',
];

const UPCOMING_EVENTS = [
  { month: 'MAI', day: '22', title: 'Treino Técnico', place: 'Interlagos' },
  { month: 'MAI', day: '24', title: 'Avaliação Física', place: 'NGS Lab' },
  { month: 'MAI', day: '28', title: 'Etapa 4 • Copa SP', place: 'Liga Paulista de Kart' },
];

const SUGGESTIONS = [
  {
    id: 'sug-mariana',
    name: 'Mariana Silva',
    role: 'Especialista • Preparadora Física',
    avatar: '/assets/avatar-mariana.jpg',
  },
  {
    id: 'sug-felipe',
    name: 'Felipe Rossi',
    role: 'Atleta • Kart Graduados',
    avatar: '/assets/avatar-felipe.jpg',
  },
  {
    id: 'sug-powerup',
    name: 'PowerUp Brasil',
    role: 'Patrocinador • Hidratação',
    badge: 'PU',
  },
];

const ReadinessGaugeSvg: React.FC<{ score: number }> = ({ score }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 44;
  const circumference = Math.PI * radius; // semicircle arc
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative mx-auto flex h-24 w-36 flex-col items-center justify-end">
      <svg viewBox="0 0 110 62" className="h-20 w-36 overflow-visible">
        <defs>
          <linearGradient id="ngsGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="45%" stopColor="#17B3B3" />
            <stop offset="100%" stopColor="#0E9F6E" />
          </linearGradient>
        </defs>
        <path
          d="M 11 54 A 44 44 0 0 1 99 54"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 11 54 A 44 44 0 0 1 99 54"
          fill="none"
          stroke="url(#ngsGaugeGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="-mt-9 text-center">
        <div className="font-display text-2xl font-bold leading-none text-[#031B33]">{clamped}</div>
        <div className="mt-0.5 text-[11px] font-semibold text-[#0E9F6E]">Muito Bom</div>
      </div>
    </div>
  );
};

export const HubFeed3Col: React.FC = () => {
  const {
    activeActor,
    primaryAthlete,
    feedPosts,
    searchQuery,
    publishPost,
    setActiveModule,
    openReadinessDrawer,
    openLgpdModal,
    connectedIds,
    toggleConnect,
  } = useNgs();

  const [filter, setFilter] = useState<FeedFilter>('all');
  const [composerText, setComposerText] = useState('');
  const [composerType, setComposerType] = useState<{
    category: FeedCategory;
    label: string;
  }>({ category: 'telemetry_proof', label: 'Telemetria' });

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return feedPosts.filter((post) => {
      if (filter === 'proofs') {
        if (!['telemetry_proof', 'academy_badge', 'coach_endorsement'].includes(post.category)) {
          return false;
        }
      } else if (filter === 'opportunities') {
        if (!['sponsorship_opportunity', 'league_podium'].includes(post.category)) {
          return false;
        }
      } else if (filter === 'following') {
        if (post.authorId !== primaryAthlete.id && !connectedIds.includes(post.authorId) && !post.isOfficial) {
          return false;
        }
      }

      if (!q) return true;
      return (
        post.authorName.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q) ||
        post.title.toLowerCase().includes(q) ||
        post.sport.toLowerCase().includes(q)
      );
    });
  }, [feedPosts, filter, searchQuery, primaryAthlete.id, connectedIds]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;
    publishPost(composerText, composerType.category, `${composerType.label} • Proof of Talent`);
    setComposerText('');
  };

  const isMinorPending = primaryAthlete.lgpd.isMinor && primaryAthlete.lgpd.status !== 'approved';

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      {/* Left Column: Social Profile Card with Real Cover & Avatar + Semicircular Gauge */}
      <div className="space-y-4 xl:col-span-3">
        <div className="overflow-hidden rounded-2xl border border-[#D9E3EA] bg-white shadow-sm">
          <div className="relative h-24 w-full overflow-hidden bg-[#031B33]">
            <img
              src="/assets/cover-track.jpg"
              alt="Pista de Kart"
              className="h-full w-full object-cover opacity-90"
            />
          </div>

          <div className="px-4 pb-4">
            <div className="-mt-10 flex items-end justify-between">
              {activeActor === 'league' ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#031B33] font-display text-xl font-bold text-white shadow">
                  LP
                </div>
              ) : activeActor === 'sponsor' ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#031B33] font-display text-xl font-bold text-white shadow">
                  PU
                </div>
              ) : (
                <img
                  src="/assets/avatar-gabriel.jpg"
                  alt={primaryAthlete.name}
                  className="h-20 w-20 rounded-full border-4 border-white object-cover shadow"
                />
              )}

              {isMinorPending && (activeActor === 'athlete' || activeActor === 'guardian') ? (
                <button
                  type="button"
                  onClick={openLgpdModal}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200"
                >
                  <Lock className="h-3 w-3" /> Pendente LGPD
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-[#0E9F6E]">
                  <CheckCircle2 className="h-3 w-3" /> Verificado
                </span>
              )}
            </div>

            {activeActor === 'league' ? (
              <div className="mt-3">
                <h2 className="font-display text-base font-bold text-[#031B33]">
                  Liga Paulista de Kart
                </h2>
                <p className="text-xs text-slate-500">Operador: Carlos Menezes • White-Label Ativo</p>
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#FAFAFB] p-3 text-center">
                  <div>
                    <div className="font-display text-lg font-bold text-[#031B33]">40</div>
                    <div className="text-[11px] text-slate-500">Atletas Ativos</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-[#17B3B3]">94%</div>
                    <div className="text-[11px] text-slate-500">Homologação</div>
                  </div>
                </div>
              </div>
            ) : activeActor === 'sponsor' ? (
              <div className="mt-3">
                <h2 className="font-display text-base font-bold text-[#031B33]">PowerUp Brasil</h2>
                <p className="text-xs text-slate-500">Juliana Prado • Scouting &amp; Cotas</p>
                <div className="mt-4 rounded-xl bg-[#FAFAFB] p-3 text-xs text-[#263238]">
                  <div className="font-semibold text-[#0D47A1]">Filtro Ativo: Readiness &gt; 70</div>
                  <p className="mt-1 text-slate-600">
                    3 cotas regionais abertas com contrapartidas auditadas por evidências.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-2.5 text-center sm:text-left">
                  <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                    <h2 className="font-display text-base font-bold text-[#031B33]">
                      {primaryAthlete.name}
                    </h2>
                    <CheckCircle2 className="h-4 w-4 text-[#0D47A1]" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Kart • {primaryAthlete.categoryLabel} • {primaryAthlete.city}
                  </p>
                </div>

                {/* Semicircular Colorful Gauge + Academy LMS */}
                <div className="mt-3 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Readiness Score</span>
                    <button
                      type="button"
                      onClick={openReadinessDrawer}
                      className="text-[11px] font-semibold text-[#0D47A1] hover:underline"
                    >
                      Explicar nota
                    </button>
                  </div>

                  <ReadinessGaugeSvg score={primaryAthlete.readiness.total} />

                  <div className="mt-2 flex items-center justify-between border-t border-[#D9E3EA] pt-2 text-[11px]">
                    <span className="text-slate-600">Academy LMS</span>
                    <span className="font-semibold text-[#0D47A1]">
                      {primaryAthlete.academy.xpTotal} / 1000 XP
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-600">
                  <span>
                    <strong className="text-[#031B33]">
                      {primaryAthlete.followers.toLocaleString('pt-BR')}
                    </strong>{' '}
                    Seguidores
                  </span>
                  <span>
                    <strong className="text-[#031B33]">{primaryAthlete.connections}</strong> Conexões
                  </span>
                </div>
              </>
            )}

            <div className="mt-4 space-y-1 border-t border-[#D9E3EA] pt-3 text-xs">
              <button
                type="button"
                onClick={() => setActiveModule('athlete_portal')}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-[#263238] hover:bg-[#FAFAFB] hover:text-[#0D47A1]"
              >
                <Award className="h-4 w-4 text-[#17B3B3]" />
                <span>Meu Perfil Público</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('athlete_portal')}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-[#263238] hover:bg-[#FAFAFB] hover:text-[#0D47A1]"
              >
                <Gauge className="h-4 w-4 text-[#0D47A1]" />
                <span>Digital Twin Driver</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('sponsorship')}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-[#263238] hover:bg-[#FAFAFB] hover:text-[#0D47A1]"
              >
                <FileCheck2 className="h-4 w-4 text-[#0E9F6E]" />
                <span>Mídia-Kit Auditável</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('leagues')}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-[#263238] hover:bg-[#FAFAFB] hover:text-[#0D47A1]"
              >
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>Minhas Ligas</span>
              </button>
            </div>

            {/* Single discreet PromptCore Labs badge */}
            <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-[#D9E3EA] pt-3 text-[11px] font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-[#17B3B3]" />
              <span>Powered by PromptCore Labs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Column: Composer + Filters + Feed */}
      <div className="space-y-4 xl:col-span-6">
        <form
          onSubmit={handlePublish}
          className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <img
              src="/assets/avatar-gabriel.jpg"
              alt="Avatar"
              className="hidden h-9 w-9 shrink-0 rounded-full object-cover sm:block"
            />
            <div className="flex-1">
              <div className="mb-1.5 text-xs font-semibold text-[#031B33]">Criar publicação</div>
              <textarea
                rows={2}
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Compartilhe um treino, telemetria, conquista ou bastidor..."
                className="w-full resize-none rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3 text-sm text-[#263238] placeholder:text-slate-400 focus:border-[#0D47A1] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {[
                { category: 'telemetry_proof' as const, label: 'Telemetria', icon: TrendingUp },
                { category: 'academy_badge' as const, label: 'Conquista', icon: Award },
                { category: 'coach_endorsement' as const, label: 'Evidência', icon: FileCheck2 },
                { category: 'league_podium' as const, label: 'Foto/Vídeo', icon: Camera },
              ].map((chip) => {
                const Icon = chip.icon;
                const active = composerType.label === chip.label;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setComposerType({ category: chip.category, label: chip.label })}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                      active
                        ? 'border-[#0D47A1] bg-[#0D47A1]/10 text-[#0D47A1]'
                        : 'border-[#D9E3EA] bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={!composerText.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D47A1] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#031B33] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Publicar</span>
            </button>
          </div>
        </form>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-[#D9E3EA] pb-2">
          {[
            { id: 'all' as const, label: 'Tudo' },
            { id: 'following' as const, label: 'Seguindo' },
            { id: 'proofs' as const, label: 'Provas & PBs' },
            { id: 'opportunities' as const, label: 'Oportunidades' },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-[#031B33] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Feed Stream */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-[#D9E3EA] bg-white p-8 text-center text-sm text-slate-500">
              Nenhuma publicação encontrada para o filtro atual.
            </div>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>

      {/* Right Column: Discovery, Trending & Events */}
      <div className="space-y-4 xl:col-span-3">
        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#031B33]">Sugestões para conectar</h3>
          <div className="mt-3 space-y-3">
            {SUGGESTIONS.map((item) => {
              const connected = connectedIds.includes(item.id);
              return (
                <div key={item.id} className="flex items-center justify-between gap-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#031B33] font-display text-xs font-bold text-white">
                        {item.badge}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#031B33]">{item.name}</div>
                      <div className="text-[11px] leading-snug text-slate-500">{item.role}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleConnect(item.id, item.name)}
                    className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                      connected
                        ? 'border-emerald-200 bg-emerald-50 text-[#0E9F6E]'
                        : 'border-[#D9E3EA] bg-white text-[#0D47A1] hover:bg-[#0D47A1]/5'
                    }`}
                  >
                    {connected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    <span>{connected ? 'Conectado' : 'Conectar'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#031B33]">Em alta na NGS</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {TRENDING_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#D9E3EA] bg-[#FAFAFB] px-2.5 py-1 text-xs font-medium text-[#0D47A1]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-[#031B33]">Próximos Eventos</h3>
            <Calendar className="h-4 w-4 text-[#17B3B3]" />
          </div>
          <div className="mt-3 space-y-2.5">
            {UPCOMING_EVENTS.map((ev) => (
              <div
                key={ev.title}
                className="flex items-center gap-3 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-2.5"
              >
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#031B33] text-white">
                  <span className="text-[9px] font-semibold uppercase text-[#17B3B3]">
                    {ev.month}
                  </span>
                  <span className="font-display text-xs font-bold leading-none">{ev.day}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#031B33]">{ev.title}</div>
                  <div className="text-[11px] text-slate-500">{ev.place}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
