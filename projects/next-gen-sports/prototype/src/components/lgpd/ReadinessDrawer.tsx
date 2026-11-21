import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useNgs } from '../../context/NgsContext';

const PILLAR_LABELS = [
  { key: 'technical', label: 'Técnico' },
  { key: 'physical', label: 'Físico' },
  { key: 'mental', label: 'Mental' },
  { key: 'consistency', label: 'Consistência' },
  { key: 'equipment', label: 'Equipamento' },
] as const;

export const ReadinessDrawer: React.FC = () => {
  const { readinessDrawerOpen, closeReadinessDrawer, primaryAthlete } = useNgs();

  if (!readinessDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#031B33]/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Explicabilidade do Readiness Score"
    >
      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#D9E3EA] px-6 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-[#031B33]">
              Explicabilidade do Readiness Score (LGPD Art. 20)
            </h2>
            <p className="text-xs text-slate-500">
              {primaryAthlete.name} • Nota Oficial: {primaryAthlete.readiness.total}/100
            </p>
          </div>
          <button
            type="button"
            onClick={closeReadinessDrawer}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar painel de explicabilidade"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-4 text-xs leading-relaxed text-[#263238]">
            <div className="mb-1 flex items-center gap-1.5 font-semibold text-[#0D47A1]">
              <Info className="h-4 w-4" />
              <span>Critério Auditável (Zero Dados Biométricos)</span>
            </div>
            O <strong>Readiness Score (0–100)</strong> soma 5 pilares de até 20 pontos cada,
            sustentados exclusivamente por evidências esportivas, telemetria de pista não-sensível
            e módulos concluídos na <strong>NGS Academy (0–1000 XP)</strong>.
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-bold text-[#031B33]">
              Composição por Pilar (0–20 pts)
            </h3>
            <div className="space-y-2.5">
              {PILLAR_LABELS.map((p) => {
                const val = primaryAthlete.readiness[p.key];
                const pct = Math.round((val / 20) * 100);
                return (
                  <div key={p.key}>
                    <div className="mb-1 flex justify-between text-xs font-medium">
                      <span>{p.label}</span>
                      <span className="font-semibold text-[#031B33]">
                        {val}/20 pts ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#17B3B3]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-bold text-[#031B33]">
              Artefatos &amp; Evidências que Sustentam a Nota
            </h3>
            <div className="space-y-3">
              {primaryAthlete.readiness.evidences.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-xl border border-[#D9E3EA] bg-white p-3.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-[#031B33]">{ev.title}</div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#0E9F6E]">
                      +{ev.impactPoints} pts
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">{ev.summary}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#17B3B3]" />
                    <span>
                      {ev.verifiedBy} • {ev.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
