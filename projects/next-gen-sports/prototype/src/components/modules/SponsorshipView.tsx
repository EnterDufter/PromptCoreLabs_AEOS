import React, { useState } from 'react';
import { CheckCircle2, Filter, Handshake, Lock, ShieldAlert } from 'lucide-react';
import { INITIAL_SPONSORSHIP_OPPORTUNITIES } from '../../data/mockSponsorship';
import { useNgs } from '../../context/NgsContext';

export const SponsorshipView: React.FC = () => {
  const {
    athletes,
    primaryAthlete,
    appliedSponsorshipIds,
    applyToSponsorship,
    openLgpdModal,
  } = useNgs();

  const [onlyAbove70, setOnlyAbove70] = useState(true);

  const isPrimaryMinorPending =
    primaryAthlete.lgpd.isMinor && primaryAthlete.lgpd.status !== 'approved';

  const eligibleAthletes = athletes.filter((ath) => {
    if (ath.lgpd.isMinor && ath.lgpd.status !== 'approved') return false;
    if (onlyAbove70 && ath.readiness.total <= 70) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#031B33]">Sponsorship</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Conexão direta entre marcas e atletas com prontidão comprovada por dados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOnlyAbove70((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
            onlyAbove70
              ? 'border-[#0E9F6E] bg-emerald-50 text-[#0E9F6E]'
              : 'border-[#D9E3EA] bg-white text-slate-600'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>
            Filtro de Elegibilidade: {onlyAbove70 ? 'Readiness Score > 70 (Ativo)' : 'Todos Scores'}
          </span>
        </button>
      </div>

      {/* LGPD Minor Block Alert */}
      {isPrimaryMinorPending && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950">
          <div className="flex items-center gap-2.5">
            <Lock className="h-5 w-5 shrink-0 text-amber-700" />
            <span>
              <strong>Privacidade Protegida (LGPD Art. 14):</strong>{' '}
              <strong>{primaryAthlete.name} (16 anos)</strong> está oculto nas vitrines de
              patrocínio enquanto o status for <code>Pendente Responsável</code>.
            </span>
          </div>
          <button
            type="button"
            onClick={openLgpdModal}
            className="rounded-lg bg-[#0D47A1] px-3.5 py-1.5 font-semibold text-white hover:bg-[#031B33]"
          >
            Validar Responsável Legal
          </button>
        </div>
      )}

      {/* Opportunities + FinOps CPE / EMV */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {INITIAL_SPONSORSHIP_OPPORTUNITIES.map((opp) => {
          const applied = appliedSponsorshipIds.includes(opp.id);
          const cpe = Math.round(opp.budgetBrl / Math.max(1, opp.evidencesDelivered));
          return (
            <div
              key={opp.id}
              className="flex flex-col justify-between rounded-2xl border border-[#D9E3EA] bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-[#031B33]">
                    <Handshake className="h-4 w-4 text-[#0D47A1]" />
                    {opp.brandName}
                  </span>
                  <span className="rounded-full bg-[#0D47A1]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#0D47A1]">
                    Score &gt; {opp.minReadiness}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {opp.sector} • {opp.benefitType}
                </div>
                <p className="mt-2.5 text-xs font-medium text-[#263238]">{opp.requirementText}</p>

                {/* FinOps Sponsor Ops Metrics */}
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3 text-[11px]">
                  <div>
                    <div className="text-slate-500">Orçamento / Entregue</div>
                    <div className="font-bold text-[#031B33]">
                      R$ {opp.budgetBrl.toLocaleString('pt-BR')} ({opp.committedPct}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">CPE / EMV Simulado</div>
                    <div className="font-bold text-[#0E9F6E]">
                      R$ {cpe.toLocaleString('pt-BR')} / R$ {opp.estimatedEmvBrl.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                  {opp.deliverables.map((del) => (
                    <li key={del} className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#17B3B3]" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-t border-[#D9E3EA] pt-3">
                <button
                  type="button"
                  onClick={() => applyToSponsorship(opp.id, opp.brandName)}
                  disabled={applied}
                  className={`w-full rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    applied
                      ? 'bg-emerald-50 text-[#0E9F6E]'
                      : isPrimaryMinorPending
                      ? 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                      : 'bg-[#0D47A1] text-white hover:bg-[#031B33]'
                  }`}
                >
                  {applied
                    ? 'Mídia-Kit Auditável Enviado'
                    : isPrimaryMinorPending
                    ? 'Bloqueado (Aguardando Responsável Legal)'
                    : 'Enviar Mídia-Kit Auditável'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Eligible Athletes Preview respecting filter & LGPD */}
      <div className="rounded-2xl border border-[#D9E3EA] bg-white p-5 shadow-sm">
        <h2 className="font-display text-sm font-bold text-[#031B33]">
          Atletas Visíveis para Contrapartidas ({eligibleAthletes.length})
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {eligibleAthletes.map((ath) => (
            <div
              key={ath.id}
              className="flex items-center justify-between rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3 text-xs"
            >
              <div>
                <div className="font-bold text-[#031B33]">{ath.name}</div>
                <div className="text-[11px] text-slate-500">
                  {ath.primarySport} • {ath.city}
                </div>
              </div>
              <span className="font-display text-sm font-bold text-[#0E9F6E]">
                {ath.readiness.total}/100
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Compliance Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#D9E3EA] bg-white p-4 text-xs leading-relaxed text-slate-600">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#0D47A1]" />
        <div>
          <strong>Aviso de Conformidade:</strong> Este módulo realiza exclusivamente a conexão
          comercial direta e gestão de patrocínios esportivos entre marcas, ligas e atletas. Não
          constitui oferta pública de valores mobiliários, intermediação financeira regulada,
          captação de investimento ou gestão de incentivos fiscais.
        </div>
      </div>
    </div>
  );
};
