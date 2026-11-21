import React, { useState } from 'react';
import { Calendar, CheckCircle2, FileSpreadsheet, Share2, Upload } from 'lucide-react';
import { useNgs } from '../../context/NgsContext';

export const LeaguesView: React.FC = () => {
  const { leagues, simulateTimeslipUpload, showToast, publishPost } = useNgs();
  const [selectedLeagueId, setSelectedLeagueId] = useState(leagues[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'timesheets' | 'social'>(
    'overview'
  );
  const [sampleFile, setSampleFile] = useState('folha-tempos-interlagos-etapa4.pdf');

  const league = leagues.find((l) => l.id === selectedLeagueId) ?? leagues[0];
  const proPct = Math.round((league.proAthletesCount / league.athletesCount) * 100);
  const effectiveCostPerAthlete = (league.monthlyFeeBrl / league.athletesCount).toFixed(2);

  const handleUploadTimeslip = (e: React.FormEvent) => {
    e.preventDefault();
    simulateTimeslipUpload(league.id, sampleFile);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#031B33]">Gestão de Ligas</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Operação esportiva, homologação de resultados e distribuição White Label.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {leagues.map((lg) => (
            <button
              key={lg.id}
              type="button"
              onClick={() => setSelectedLeagueId(lg.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                lg.id === league.id
                  ? 'border-[#0D47A1] bg-[#0D47A1] text-white'
                  : 'border-[#D9E3EA] bg-white text-[#263238] hover:bg-slate-50'
              }`}
            >
              {lg.name}
            </button>
          ))}
        </div>
      </div>

      {/* FinOps Enxuto & Operação (Máx 3 blocos de KPI) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Ocupação &amp; Mix do Cluster</div>
          <div className="mt-1 font-display text-2xl font-bold text-[#031B33]">
            {league.athletesCount}/{league.capacityCount}{' '}
            <span className="text-xs font-medium text-[#0E9F6E]">({proPct}% Pro)</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Subsídio cruzado: {league.athletesCount - league.proAthletesCount} Base /{' '}
            {league.proAthletesCount} Pro
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500">
            Custo Efetivo por Atleta Engajado
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-[#031B33]">
            R$ {effectiveCostPerAthlete.replace('.', ',')}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Plano White Label R$ {league.monthlyFeeBrl}/mês • {league.whiteLabelDomain}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500">
            Taxa de Homologação de Evidências
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-[#17B3B3]">
            {league.evidenceApprovalRatePct}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Readiness Médio da Liga: {league.avgReadiness}/100 • {league.pendingTimeSheets}{' '}
            folhas pendentes
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D9E3EA] pb-2">
        {[
          { id: 'overview' as const, label: 'Visão Geral & Etapas' },
          { id: 'stages' as const, label: 'Inscritos & Check-in' },
          { id: 'timesheets' as const, label: 'Súmulas & Folha de Tempos (PLG)' },
          { id: 'social' as const, label: 'Distribuição Social White Label' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-[#031B33] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === 'overview' || activeTab === 'stages') && (
        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[#031B33]">
              Etapas &amp; Inscrições — {league.name}
            </h2>
            <span className="text-xs text-slate-500">Operador: {league.operatorName}</span>
          </div>

          <div className="space-y-3">
            {league.stages.map((st) => (
              <div
                key={st.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D47A1]/10 text-[#0D47A1]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#031B33]">{st.name}</div>
                    <div className="text-xs text-slate-500">
                      {st.date} • {st.location} • Vagas: {st.slotsFilled}/{st.slotsTotal}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      st.status === 'Homologada'
                        ? 'bg-emerald-50 text-[#0E9F6E]'
                        : 'bg-[#0D47A1]/10 text-[#0D47A1]'
                    }`}
                  >
                    {st.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast(`Check-in da etapa "${st.name}" atualizado.`)}
                    className="rounded-lg border border-[#D9E3EA] bg-white px-3 py-1.5 text-xs font-semibold text-[#031B33] hover:bg-slate-50"
                  >
                    Gerenciar Etapa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timesheets' && (
        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17B3B3]/15 text-[#0D47A1]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#031B33]">
                Simulador de Leitura de Folha de Tempos (PLG Kart)
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Normaliza PDF/CSV de cronometragem de pista, atualiza o Readiness Score e publica
                automaticamente um card de <strong>Proof of Talent</strong> no Hub Central.
              </p>
            </div>
          </div>

          <form onSubmit={handleUploadTimeslip} className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1">
              <label className="mb-1 block text-xs font-semibold text-[#031B33]">
                Arquivo de Cronometragem Simulado (PDF / CSV)
              </label>
              <select
                value={sampleFile}
                onChange={(e) => setSampleFile(e.target.value)}
                className="w-full rounded-lg border border-[#D9E3EA] bg-[#FAFAFB] px-3 py-2 text-xs text-[#263238]"
              >
                <option value="folha-tempos-interlagos-etapa4.pdf">
                  folha-tempos-interlagos-etapa4.pdf (18 voltas • Graduados)
                </option>
                <option value="cronometragem-granja-viana-bateria2.csv">
                  cronometragem-granja-viana-bateria2.csv (15 voltas • Treino Livre)
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0D47A1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#031B33]"
            >
              <Upload className="h-4 w-4" />
              <span>Processar Folha &amp; Publicar Prova</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="rounded-2xl border border-[#D9E3EA] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#031B33]">
                Distribuição Social White Label ({league.whiteLabelDomain})
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Publique resultados homologados e cards de pódio automaticamente nos canais da
                liga (motor de Content Ops acoplado).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                publishPost(
                  `Resultados homologados na ${league.name}: média de Readiness ${league.avgReadiness}/100 na ${league.nextStageLocation}.`,
                  'league_podium',
                  'Card de Pódio White Label',
                  league.sport
                );
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0D47A1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#031B33]"
            >
              <Share2 className="h-4 w-4" />
              <span>Preparar Post da Etapa</span>
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3 text-xs text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-[#0E9F6E]" />
            <span>
              Fluxo pronto para aprovação editorial antes da publicação externa (zero disparo
              automático sem revisão).
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
