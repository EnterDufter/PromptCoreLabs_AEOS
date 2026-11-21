import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShoppingBag, Star, Ticket } from 'lucide-react';
import { MOCK_KITS, MOCK_SPECIALISTS } from '../../data/mockCommerce';
import { useNgs } from '../../context/NgsContext';

type CommerceTab = 'gap' | 'specialists' | 'setups' | 'kits';

export const CommerceHubView: React.FC = () => {
  const { primaryAthlete, showToast } = useNgs();
  const [tab, setTab] = useState<CommerceTab>('gap');

  const equipmentPct = Math.round((primaryAthlete.readiness.equipment / 20) * 100);

  const visibleSpecialists =
    tab === 'gap'
      ? MOCK_SPECIALISTS.filter((s) => s.targetPillar === 'equipment' || s.targetPillar === 'physical')
      : MOCK_SPECIALISTS;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#031B33]">Commerce Hub</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Especialistas de Performance, setups e kits recomendados a partir dos seus gaps de
          prontidão.
        </p>
      </div>

      {/* Gap-Driven Contextual Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <span>
            Seu pilar <strong>Equipamento ({equipmentPct}/100)</strong> está abaixo da sua média.
            Veja setups e Especialistas de Performance para equilibrar seu Readiness Score.
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-semibold text-[#031B33] ring-1 ring-amber-200">
          <Ticket className="h-3.5 w-3.5 text-[#17B3B3]" /> Voucher de Desenvolvimento ativo
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D9E3EA] pb-2">
        {[
          { id: 'gap' as const, label: 'Recomendados por Gap' },
          { id: 'specialists' as const, label: 'Especialistas de Performance' },
          { id: 'setups' as const, label: 'Setups de Performance' },
          { id: 'kits' as const, label: 'Kits de Performance' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === item.id
                ? 'bg-[#031B33] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {(tab === 'gap' || tab === 'specialists') && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleSpecialists.map((spec) => (
            <div
              key={spec.id}
              className="flex flex-col justify-between rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-display text-sm font-bold text-[#031B33]">{spec.name}</h2>
                      {spec.ngsCertified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#17B3B3]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Especialista de Performance • {spec.specialty} • {spec.city}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#FAFAFB] px-2 py-0.5 text-xs font-semibold text-[#031B33]">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {spec.rating} ({spec.reviewsCount})
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3">
                  <div className="text-xs font-semibold text-[#031B33]">{spec.offerTitle}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Foco: {spec.sportFocus}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#D9E3EA] pt-3">
                <span className="font-display text-base font-bold text-[#031B33]">
                  {spec.priceLabel}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    showToast(`Solicitação "${spec.ctaLabel}" registrada para ${spec.name}.`)
                  }
                  className="rounded-lg bg-[#0D47A1] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#031B33]"
                >
                  {spec.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(tab === 'setups' || tab === 'kits') && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {MOCK_KITS.map((kit) => (
            <div
              key={kit.id}
              className="flex flex-col justify-between rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#0D47A1]" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0D47A1]">
                    {kit.category}
                  </span>
                </div>
                <h2 className="mt-1 font-display text-sm font-bold text-[#031B33]">{kit.title}</h2>
                <p className="mt-1.5 text-xs text-slate-600">{kit.itemsSummary}</p>
                <div className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#0E9F6E]">
                  {kit.voucherLabel}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#D9E3EA] pt-3">
                <span className="font-display text-base font-bold text-[#031B33]">
                  {kit.priceLabel}
                </span>
                <button
                  type="button"
                  onClick={() => showToast(`Simulação de pacote "${kit.title}" adicionada.`)}
                  className="rounded-lg bg-[#0D47A1] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#031B33]"
                >
                  Simular Pacote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Fiscal Conceptual Disclaimer */}
      <div className="rounded-xl border border-[#D9E3EA] bg-white p-3.5 text-xs text-slate-600">
        <strong>Aviso Fiscal Conceitual:</strong> Este pacote reúne produtos e serviços.
        Documentos fiscais são emitidos separadamente conforme a natureza de cada item (protótipo
        conceitual).
      </div>
    </div>
  );
};
