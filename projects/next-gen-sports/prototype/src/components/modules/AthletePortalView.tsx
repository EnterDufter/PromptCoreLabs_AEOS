import React from 'react';
import {
  Award,
  CheckCircle2,
  FileCheck2,
  Gauge,
  Info,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useNgs } from '../../context/NgsContext';

const PILLARS = [
  { key: 'technical', label: 'Técnico' },
  { key: 'physical', label: 'Físico' },
  { key: 'mental', label: 'Mental' },
  { key: 'consistency', label: 'Consistência' },
  { key: 'equipment', label: 'Equipamento' },
] as const;

export const AthletePortalView: React.FC = () => {
  const {
    primaryAthlete,
    academyModules,
    completeAcademyModule,
    openReadinessDrawer,
    openLgpdModal,
    showToast,
  } = useNgs();

  const isApproved = primaryAthlete.lgpd.status === 'approved';
  const driver = primaryAthlete.driverTelemetry;

  return (
    <div className="space-y-5">
      {/* Athlete Portal Cover + Real Avatar */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E3EA] bg-white shadow-sm">
        <div className="relative h-28 w-full bg-[#031B33] sm:h-36">
          <img
            src="/assets/cover-track.jpg"
            alt="Pista de Kart"
            className="h-full w-full object-cover opacity-85"
          />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 pb-5">
          <div className="flex items-end gap-4">
            <img
              src="/assets/avatar-gabriel.jpg"
              alt={primaryAthlete.name}
              className="-mt-10 h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md"
            />
            <div className="pt-2">
              <h1 className="font-display text-2xl font-bold text-[#031B33]">Portal do Atleta</h1>
              <p className="text-xs text-slate-600 sm:text-sm">
                Modo Piloto • {primaryAthlete.primarySport} ({primaryAthlete.categoryLabel}) •
                Prontidão esportiva, evolução na Academy e evidências auditáveis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isApproved) {
                openLgpdModal();
                return;
              }
              showToast('Mídia-Kit Auditável exportado com Readiness Score e evidências.');
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              isApproved
                ? 'bg-[#0D47A1] text-white hover:bg-[#031B33]'
                : 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {isApproved ? <FileCheck2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <span>
              {isApproved ? 'Gerar Mídia-Kit Auditável' : 'Mídia-Kit Público Bloqueado (LGPD)'}
            </span>
          </button>
        </div>
      </div>

      {/* Block 1: Readiness Score (0–100) + 5 Pillars */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-5 shadow-sm lg:col-span-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#031B33]">
                Readiness Score (0–100)
              </h2>
              <p className="text-xs text-slate-500">
                Score calculado por evidências validadas de pista e regularidade.
              </p>
            </div>
            <button
              type="button"
              onClick={openReadinessDrawer}
              className="inline-flex items-center gap-1 rounded-lg border border-[#D9E3EA] px-2.5 py-1 text-xs font-semibold text-[#0D47A1] hover:bg-slate-50"
            >
              <Info className="h-3.5 w-3.5" />
              <span>Ver Evidências</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6">
            <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-8 border-[#17B3B3] bg-[#FAFAFB]">
              <span className="font-display text-3xl font-bold text-[#031B33]">
                {primaryAthlete.readiness.total}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">/100</span>
            </div>

            <div className="flex-1 space-y-2">
              {PILLARS.map((p) => {
                const score = primaryAthlete.readiness[p.key];
                const pct = Math.round((score / 20) * 100);
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={openReadinessDrawer}
                    className="block w-full text-left"
                  >
                    <div className="mb-0.5 flex justify-between text-xs">
                      <span className="font-medium text-[#263238]">{p.label}</span>
                      <span className="font-semibold text-[#031B33]">
                        {score}/20 ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          score <= 14 ? 'bg-amber-500' : 'bg-[#0D47A1]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Block 2: NGS Academy LMS (0–1000 XP) + Explicit Normalization */}
        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-5 shadow-sm lg:col-span-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#031B33]">
                NGS Academy LMS (0–1000 XP)
              </h2>
              <p className="text-xs text-slate-500">
                {primaryAthlete.academy.rankLabel} • Normalização explícita para o Readiness:{' '}
                <strong>+{primaryAthlete.academy.normalizedReadinessContribution}/20 pts</strong>
              </p>
            </div>
            <span className="rounded-full bg-[#0D47A1]/10 px-2.5 py-1 font-display text-xs font-bold text-[#0D47A1]">
              {primaryAthlete.academy.xpTotal} / 1000 XP
            </span>
          </div>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#0D47A1] transition-all"
              style={{ width: `${(primaryAthlete.academy.xpTotal / 1000) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {primaryAthlete.academy.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-full border border-[#D9E3EA] bg-[#FAFAFB] px-2.5 py-0.5 text-[11px] font-semibold text-[#031B33]"
              >
                <Award className="h-3 w-3 text-[#17B3B3]" />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-2.5">
            {academyModules.map((mod) => (
              <div
                key={mod.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#031B33]">{mod.title}</div>
                  <div className="text-[11px] text-slate-500">
                    Trilha {mod.trackName} • +{mod.xpReward} XP • {mod.duration}
                  </div>
                </div>

                {mod.completed ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-[#0E9F6E]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Concluído
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => completeAcademyModule(mod.id)}
                    className="rounded-lg bg-[#0D47A1] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#031B33]"
                  >
                    Enviar Evidência Prática
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Block 3: Motorsport-only Digital Twin Driver + LGPD Governance */}
      {driver && (
        <div className="rounded-2xl border border-[#D9E3EA] bg-[#031B33] p-5 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Gauge className="h-5 w-5 text-[#17B3B3]" />
              <div>
                <h2 className="font-display text-base font-bold">
                  Módulo Automobilismo: Digital Twin Driver
                </h2>
                <p className="text-xs text-slate-300">
                  {driver.kartTrack} • {driver.lapsAnalyzed} voltas analisadas (telemetria
                  não-sensível)
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#17B3B3]">
              <ShieldCheck className="h-3.5 w-3.5" /> Zero Dados Biométricos
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-[11px] text-slate-300">Melhor Volta</div>
              <div className="font-display text-xl font-bold text-white">{driver.bestLap}</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-[11px] text-slate-300">Delta Setor 2</div>
              <div className="font-display text-xl font-bold text-[#17B3B3]">
                {driver.sectorDeltaS2}
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-[11px] text-slate-300">Desvio Médio</div>
              <div className="font-display text-xl font-bold text-white">
                {driver.avgDeviationSec}s
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-[11px] text-slate-300">Consistência</div>
              <div className="font-display text-xl font-bold text-[#0E9F6E]">
                {driver.consistencyPct}%
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-200">
            <strong>Insight objetivo:</strong> {driver.insight}
          </p>
        </div>
      )}
    </div>
  );
};
