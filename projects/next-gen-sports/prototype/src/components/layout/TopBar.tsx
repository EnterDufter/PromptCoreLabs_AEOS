import React from 'react';
import { Bell, Lock, Search, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useNgs } from '../../context/NgsContext';
import { ActorRole } from '../../types/ngs';

const ACTORS: { id: ActorRole; label: string; context: string }[] = [
  { id: 'athlete', label: 'Atleta', context: 'Gabriel Almeida • Kart Graduados' },
  { id: 'league', label: 'Liga', context: 'Liga Paulista de Kart • Operador' },
  { id: 'sponsor', label: 'Patrocinador', context: 'PowerUp Brasil • Scouting & Cotas' },
  { id: 'guardian', label: 'Responsável Legal', context: 'Renata Almeida • Tutora LGPD' },
];

export const TopBar: React.FC = () => {
  const {
    activeActor,
    setActiveActor,
    searchQuery,
    setSearchQuery,
    primaryAthlete,
    openLgpdModal,
    setActiveModule,
  } = useNgs();

  const isApproved = primaryAthlete.lgpd.status === 'approved';
  const currentActorMeta = ACTORS.find((a) => a.id === activeActor)!;

  return (
    <header className="sticky top-0 z-30 border-b border-[#D9E3EA] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 lg:px-6">
        {/* Brand + Search */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveModule('hub')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#031B33] font-display text-sm font-bold tracking-tight text-white">
              NG<span className="text-[#17B3B3]">S</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-sm font-bold leading-none text-[#031B33]">
                NEXT GEN SPORTS
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-slate-500">
                Onde talento ganha estrutura
              </div>
            </div>
          </button>

          <div className="relative hidden md:block md:w-64 xl:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar atletas, ligas, especialistas ou marcas..."
              className="w-full rounded-lg border border-[#D9E3EA] bg-[#FAFAFB] py-1.5 pl-9 pr-3 text-xs text-[#263238] placeholder:text-slate-400 focus:border-[#0D47A1] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Actor Switcher + LGPD Status */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center rounded-lg border border-[#D9E3EA] bg-[#FAFAFB] p-0.5"
            role="group"
            aria-label="Seletor de Ator"
          >
            {ACTORS.map((actor) => {
              const active = actor.id === activeActor;
              return (
                <button
                  key={actor.id}
                  type="button"
                  onClick={() => setActiveActor(actor.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? 'bg-[#0D47A1] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-[#031B33]'
                  }`}
                >
                  {actor.label}
                </button>
              );
            })}
          </div>

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
                <span className="hidden sm:inline">Autorizado pelo Responsável</span>
                <span className="sm:hidden">LGPD OK</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Pendente Responsável</span>
                <span className="sm:hidden">LGPD Pendente</span>
              </>
            )}
          </button>

          <span className="hidden items-center gap-1 rounded-md border border-[#D9E3EA] bg-[#031B33] px-2 py-1 text-[10px] font-semibold tracking-wide text-white xl:inline-flex">
            PCL <span className="text-[#17B3B3]">Inside</span>
          </span>

          <div className="hidden h-8 w-8 items-center justify-center rounded-full border border-[#D9E3EA] bg-white text-slate-600 lg:flex">
            <Bell className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Contextual Guardian / Actor Strip */}
      {activeActor === 'guardian' && (
        <div className="border-t border-amber-200 bg-amber-50/90 px-4 py-2 text-xs text-amber-950 lg:px-6">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700" />
              <span>
                <strong>Visão Responsável Legal ({currentActorMeta.context}):</strong> Você gerencia
                autorizações de imagem, visibilidade pública e propostas comerciais para{' '}
                <strong>Gabriel Almeida (16 anos)</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={openLgpdModal}
              className="rounded-md bg-[#0D47A1] px-3 py-1 text-xs font-semibold text-white hover:bg-[#031B33]"
            >
              {isApproved ? 'Revisar / Revogar Consentimento' : 'Validar Consentimento Parental'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
