import React, { useMemo, useState } from 'react';
import { Check, Lock, Plus, Search, ShieldCheck, Users } from 'lucide-react';
import { useNgs } from '../../context/NgsContext';

export const TalentNetworkView: React.FC = () => {
  const {
    athletes,
    primaryAthlete,
    scoutingBoardIds,
    toggleScoutingBoard,
    openLgpdModal,
    setActiveModule,
    showToast,
  } = useNgs();

  const [sportFilter, setSportFilter] = useState<string>('Todas');
  const [minScore, setMinScore] = useState<number>(0);
  const [localSearch, setLocalSearch] = useState('');

  const isPrimaryPending =
    primaryAthlete.lgpd.isMinor && primaryAthlete.lgpd.status !== 'approved';

  const visibleAthletes = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    return athletes.filter((ath) => {
      // LGPD Art. 14: minor without approval is hidden from public Talent Network
      if (ath.lgpd.isMinor && ath.lgpd.status !== 'approved') return false;
      if (sportFilter !== 'Todas' && !ath.primarySport.includes(sportFilter)) return false;
      if (ath.readiness.total < minScore) return false;
      if (q && !ath.name.toLowerCase().includes(q) && !ath.city.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [athletes, sportFilter, minScore, localSearch]);

  const savedAthletes = athletes.filter(
    (a) => scoutingBoardIds.includes(a.id) && (!a.lgpd.isMinor || a.lgpd.status === 'approved')
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#031B33]">Talent Network</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Descoberta, comparação e scouting de talentos com histórico verificável.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#D9E3EA] bg-white p-3.5 shadow-sm">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar atleta ou cidade..."
            className="w-full rounded-lg border border-[#D9E3EA] bg-[#FAFAFB] py-1.5 pl-9 pr-3 text-xs focus:border-[#0D47A1] focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="rounded-lg border border-[#D9E3EA] bg-white px-3 py-1.5 text-xs font-medium text-[#263238]"
        >
          <option value="Todas">Todas Modalidades</option>
          <option value="Kart">Kart / Automobilismo</option>
          <option value="Basquete">Basquete</option>
          <option value="Natação">Natação</option>
        </select>

        <select
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="rounded-lg border border-[#D9E3EA] bg-white px-3 py-1.5 text-xs font-medium text-[#263238]"
        >
          <option value={0}>Readiness: Todos</option>
          <option value={70}>Readiness: 70+</option>
          <option value={80}>Readiness: 80+</option>
        </select>
      </div>

      {/* Privacy by Default Notice when Gabriel Almeida is Pending */}
      {isPrimaryPending && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950">
          <div className="flex items-center gap-2.5">
            <Lock className="h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <strong>Privacidade Protegida (Aguardando Responsável Legal):</strong> O perfil de{' '}
              <strong>Gabriel Almeida (16 anos • Readiness 84/100)</strong> está oculto nas buscas
              públicas do Talent Network até aprovação parental (LGPD Art. 14).
            </div>
          </div>
          <button
            type="button"
            onClick={openLgpdModal}
            className="rounded-lg bg-[#0D47A1] px-3.5 py-1.5 font-semibold text-white hover:bg-[#031B33]"
          >
            Autorizar Visibilidade
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Athlete List */}
        <div className="space-y-3 lg:col-span-8">
          {visibleAthletes.map((ath) => {
            const inBoard = scoutingBoardIds.includes(ath.id);
            return (
              <div
                key={ath.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#031B33] font-display text-sm font-bold text-white">
                    {ath.name
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-sm font-bold text-[#031B33]">{ath.name}</h2>
                      <span className="rounded-full bg-[#17B3B3]/15 px-2 py-0.5 text-[10px] font-semibold text-[#031B33]">
                        {ath.statusTag}
                      </span>
                      {ath.lgpd.isMinor && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#0E9F6E]">
                          <ShieldCheck className="h-3 w-3" /> LGPD Autorizado
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {ath.primarySport} • {ath.categoryLabel} • {ath.age} anos • {ath.city}
                    </div>
                    <div className="mt-1 text-xs font-medium text-[#263238]">
                      Readiness: <strong className="text-[#0D47A1]">{ath.readiness.total}/100</strong>{' '}
                      • Academy: <strong>{ath.academy.xpTotal}/1000 XP</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModule('athlete_portal')}
                    className="rounded-lg border border-[#D9E3EA] px-3 py-1.5 text-xs font-semibold text-[#031B33] hover:bg-slate-50"
                  >
                    Ver Perfil
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleScoutingBoard(ath.id)}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      inBoard
                        ? 'bg-emerald-50 text-[#0E9F6E]'
                        : 'bg-[#0D47A1] text-white hover:bg-[#031B33]'
                    }`}
                  >
                    {inBoard ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    <span>{inBoard ? 'No Board' : 'Scouting Board'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scouting Board */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-[#031B33]">
                Scouting Board ({savedAthletes.length})
              </h2>
              <Users className="h-4 w-4 text-[#17B3B3]" />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Atletas salvos para comparação dos 5 pilares e convite de patrocínio.
            </p>

            <div className="mt-4 space-y-2.5">
              {savedAthletes.map((ath) => (
                <div
                  key={ath.id}
                  className="rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-[#031B33]">
                    <span>{ath.name}</span>
                    <span className="text-[#0D47A1]">{ath.readiness.total}/100</span>
                  </div>
                  <div className="mt-1 grid grid-cols-5 gap-1 text-center text-[10px] text-slate-600">
                    <div>T:{ath.readiness.technical}</div>
                    <div>F:{ath.readiness.physical}</div>
                    <div>M:{ath.readiness.mental}</div>
                    <div>C:{ath.readiness.consistency}</div>
                    <div>E:{ath.readiness.equipment}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => showToast('Convite de proposta enviado aos atletas do Scouting Board.')}
              className="mt-4 w-full rounded-lg bg-[#031B33] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0D47A1]"
            >
              Convidar para Proposta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
