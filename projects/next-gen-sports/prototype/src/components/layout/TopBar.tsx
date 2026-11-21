import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Bell,
  ChevronDown,
  Handshake,
  Home,
  Lock,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Trophy,
  Users,
} from 'lucide-react';
import { useNgs } from '../../context/NgsContext';
import { ActorRole, NavModule } from '../../types/ngs';

const ACTORS: { id: ActorRole; label: string; context: string; badge: string }[] = [
  { id: 'athlete', label: 'Atleta', context: 'Gabriel Almeida • Kart Graduados', badge: 'GA' },
  { id: 'league', label: 'Liga', context: 'Liga Paulista de Kart • Operador', badge: 'LP' },
  { id: 'sponsor', label: 'Patrocinador', context: 'PowerUp Brasil • Scouting', badge: 'PU' },
  { id: 'guardian', label: 'Responsável Legal', context: 'Renata Almeida • Tutora LGPD', badge: 'RA' },
];

const TOP_TABS: {
  id: NavModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'hub', label: 'Início', icon: Home },
  { id: 'talent_network', label: 'Minha Rede', icon: Users },
  { id: 'leagues', label: 'Ligas', icon: Trophy },
  { id: 'athlete_portal', label: 'Portal', icon: Award },
  { id: 'sponsorship', label: 'Sponsorship', icon: Handshake },
  { id: 'commerce', label: 'Mercado', icon: ShoppingBag },
];

export const TopBar: React.FC = () => {
  const {
    activeActor,
    setActiveActor,
    activeModule,
    setActiveModule,
    searchQuery,
    setSearchQuery,
    primaryAthlete,
    openLgpdModal,
    resetDemo,
    showToast,
  } = useNgs();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isApproved = primaryAthlete.lgpd.status === 'approved';
  const currentActorMeta = ACTORS.find((a) => a.id === activeActor)!;

  return (
    <header className="sticky top-0 z-30 border-b border-[#D9E3EA] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 lg:px-6">
        {/* Left: Crisp SVG Brand + Rounded Search */}
        <div className="flex items-center gap-3 py-2">
          <button
            type="button"
            onClick={() => setActiveModule('hub')}
            className="flex items-center gap-2 text-left focus:outline-none"
            aria-label="Ir para Início"
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <rect width="38" height="38" rx="10" fill="#031B33" />
              <path
                d="M7 25L11.5 13H14.5L17.8 20.5L20.5 13H23.2L18.8 25H15.8L12.5 17.6L9.7 25H7Z"
                fill="white"
              />
              <path
                d="M24 19C24 15.5 26.5 13 30 13C31.5 13 32.8 13.4 33.7 14.1L32.1 16.4C31.5 16 30.8 15.8 30 15.8C28.2 15.8 27 17.1 27 19C27 21 28.2 22.3 30.2 22.3C31.1 22.3 31.8 22 32.3 21.6V20.2H29.8V17.9H34.9V23.2C33.6 24.4 31.9 25.1 29.9 25.1C26.4 25.1 24 22.5 24 19Z"
                fill="#17B3B3"
              />
            </svg>
            <div className="hidden sm:block">
              <div className="font-display text-sm font-bold leading-none tracking-tight text-[#031B33]">
                NGS
              </div>
              <div className="mt-0.5 text-[10px] font-semibold tracking-wider text-slate-500">
                NEXT GEN SPORTS
              </div>
            </div>
          </button>

          <div className="relative hidden md:block md:w-56 xl:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar atletas, ligas, equipes ou marcas..."
              className="w-full rounded-full border border-[#D9E3EA] bg-[#FAFAFB] py-1.5 pl-9 pr-3.5 text-xs text-[#263238] placeholder:text-slate-400 focus:border-[#0D47A1] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Center: Social Network Tabs (Icon on top + Label below + Active bottom border) */}
        <nav
          className="hidden items-stretch gap-1 lg:flex"
          aria-label="Navegação Principal"
        >
          {TOP_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveModule(tab.id)}
                className={`flex min-w-[76px] flex-col items-center justify-center border-b-2 px-3 py-2 text-[11px] font-semibold transition ${
                  active
                    ? 'border-[#0D47A1] text-[#0D47A1]'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-[#031B33]'
                }`}
              >
                <Icon className={`mb-0.5 h-4 w-4 ${active ? 'text-[#0D47A1]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Notifications + Discreet LGPD Pill + Real Avatar with Actor Dropdown */}
        <div className="flex items-center gap-2.5 py-2">
          <button
            type="button"
            onClick={() =>
              showToast('3 notificações: Folha Interlagos homologada, 1 endosso técnico e 1 cota aberta.')
            }
            className="relative hidden h-8 w-8 items-center justify-center rounded-full border border-[#D9E3EA] bg-[#FAFAFB] text-slate-600 hover:bg-slate-100 sm:flex"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0D47A1] text-[9px] font-bold text-white">
              3
            </span>
          </button>

          <button
            type="button"
            onClick={openLgpdModal}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
              isApproved
                ? 'border-emerald-200 bg-emerald-50 text-[#0E9F6E] hover:bg-emerald-100'
                : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
            title="Gerenciar Consentimento Parental LGPD Art. 14"
          >
            {isApproved ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">LGPD Autorizado</span>
                <span className="sm:hidden">LGPD OK</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Pendente Responsável</span>
                <span className="sm:hidden">LGPD</span>
              </>
            )}
          </button>

          {/* Avatar + Actor Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-[#D9E3EA] bg-white py-1 pl-1 pr-2.5 text-left transition hover:bg-slate-50"
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
            >
              {activeActor === 'athlete' ? (
                <img
                  src="/assets/avatar-gabriel.jpg"
                  alt="Gabriel Almeida"
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#031B33] font-display text-[10px] font-bold text-white">
                  {currentActorMeta.badge}
                </div>
              )}
              <div className="hidden text-left xl:block">
                <div className="text-xs font-bold leading-none text-[#031B33]">
                  {currentActorMeta.label}
                </div>
                <div className="mt-0.5 text-[10px] text-slate-500">
                  {activeActor === 'athlete'
                    ? 'Gabriel A.'
                    : activeActor === 'league'
                    ? 'Liga Paulista'
                    : activeActor === 'sponsor'
                    ? 'PowerUp'
                    : 'Renata A.'}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#D9E3EA] bg-white p-2 shadow-xl"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Alternar Visão de Ator
                </div>
                <div className="space-y-1">
                  {ACTORS.map((actor) => {
                    const active = actor.id === activeActor;
                    return (
                      <button
                        key={actor.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setActiveActor(actor.id);
                          setDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                          active
                            ? 'bg-[#0D47A1]/10 text-[#0D47A1]'
                            : 'text-[#263238] hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{actor.label}</div>
                          <div className="text-[11px] text-slate-500">{actor.context}</div>
                        </div>
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-[#0D47A1]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 border-t border-[#D9E3EA] pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetDemo();
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#031B33]"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#17B3B3]" />
                    <span>Resetar Demo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contextual Actor Strip */}
      {activeActor !== 'athlete' && (
        <div
          className={`border-t px-4 py-2 text-xs lg:px-6 ${
            activeActor === 'guardian'
              ? 'border-amber-200 bg-amber-50/90 text-amber-950'
              : 'border-[#D9E3EA] bg-[#031B33] text-white'
          }`}
        >
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert
                className={`h-4 w-4 shrink-0 ${
                  activeActor === 'guardian' ? 'text-amber-700' : 'text-[#17B3B3]'
                }`}
              />
              {activeActor === 'guardian' && (
                <span>
                  <strong>Visão Responsável Legal ({currentActorMeta.context}):</strong> Você
                  gerencia autorizações de imagem, visibilidade pública e propostas comerciais para{' '}
                  <strong>Gabriel Almeida (16 anos)</strong>.
                </span>
              )}
              {activeActor === 'league' && (
                <span>
                  <strong>Visão Liga ({currentActorMeta.context}):</strong> Operação B2B2C ativa
                  para homologação de etapas, súmulas e distribuição White Label.
                </span>
              )}
              {activeActor === 'sponsor' && (
                <span>
                  <strong>Visão Patrocinador ({currentActorMeta.context}):</strong> Filtro{' '}
                  <code>Readiness Score &gt; 70</code> ativo — atletas menores sem consentimento
                  permanecem ocultos por LGPD.
                </span>
              )}
            </div>

            {activeActor === 'guardian' && (
              <button
                type="button"
                onClick={openLgpdModal}
                className="rounded-md bg-[#0D47A1] px-3 py-1 text-xs font-semibold text-white hover:bg-[#031B33]"
              >
                {isApproved ? 'Revisar / Revogar Consentimento' : 'Validar Consentimento Parental'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
