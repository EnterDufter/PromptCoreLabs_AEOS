import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useNgs } from '../../context/NgsContext';

export const LgpdConsentModal: React.FC = () => {
  const { lgpdModalOpen, closeLgpdModal, approveLgpdConsent, keepProfilePrivate, primaryAthlete } =
    useNgs();

  const [guardianName, setGuardianName] = useState(primaryAthlete.lgpd.guardianName ?? '');
  const [guardianCpf, setGuardianCpf] = useState('');
  const [guardianEmail, setGuardianEmail] = useState(primaryAthlete.lgpd.guardianEmail ?? '');
  const [guardianRelation, setGuardianRelation] = useState<'Mãe' | 'Pai' | 'Tutor(a) Legal'>(
    primaryAthlete.lgpd.guardianRelation ?? 'Mãe'
  );

  const [checkSportsData, setCheckSportsData] = useState(false);
  const [checkVisibility, setCheckVisibility] = useState(false);
  const [checkLegalDecl, setCheckLegalDecl] = useState(false);

  if (!lgpdModalOpen) return null;

  const canApprove =
    guardianName.trim().length >= 3 &&
    guardianCpf.trim().length >= 11 &&
    guardianEmail.includes('@') &&
    checkSportsData &&
    checkVisibility &&
    checkLegalDecl;

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canApprove) return;
    approveLgpdConsent({
      guardianName: guardianName.trim(),
      guardianCpf: guardianCpf.trim(),
      guardianEmail: guardianEmail.trim(),
      guardianRelation,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#031B33]/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lgpd-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#D9E3EA] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D47A1]/10 text-[#0D47A1]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 id="lgpd-modal-title" className="font-display text-lg font-bold text-[#031B33]">
                Autorização do Responsável Legal (LGPD — Art. 14)
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Atleta vinculado: <strong>{primaryAthlete.name} ({primaryAthlete.age} anos)</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLgpdModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar modal LGPD"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3.5 text-xs leading-relaxed text-[#263238]">
          Para proteger atletas menores de 18 anos, o perfil nasce{' '}
          <strong>privado por padrão</strong> (<code>Pendente Responsável</code>). A validação de um
          pai, mãe ou tutor legal é obrigatória para liberar a visibilidade controlada no{' '}
          <strong>Talent Network</strong> e no módulo <strong>Sponsorship</strong>.
        </p>

        <form onSubmit={handleApprove} className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#031B33]">
                Nome completo do Responsável Legal
              </label>
              <input
                type="text"
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="Ex.: Renata Almeida"
                className="w-full rounded-lg border border-[#D9E3EA] px-3 py-2 text-sm text-[#263238] focus:border-[#0D47A1] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#031B33]">
                CPF do Responsável
              </label>
              <input
                type="text"
                required
                value={guardianCpf}
                onChange={(e) => setGuardianCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-[#D9E3EA] px-3 py-2 text-sm text-[#263238] focus:border-[#0D47A1] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#031B33]">
                Vínculo com o(a) atleta
              </label>
              <select
                value={guardianRelation}
                onChange={(e) =>
                  setGuardianRelation(e.target.value as 'Mãe' | 'Pai' | 'Tutor(a) Legal')
                }
                className="w-full rounded-lg border border-[#D9E3EA] bg-white px-3 py-2 text-sm text-[#263238] focus:border-[#0D47A1] focus:outline-none"
              >
                <option value="Mãe">Mãe</option>
                <option value="Pai">Pai</option>
                <option value="Tutor(a) Legal">Tutor(a) Legal</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#031B33]">
                E-mail de confirmação do Responsável
              </label>
              <input
                type="email"
                required
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                placeholder="responsavel@email.com"
                className="w-full rounded-lg border border-[#D9E3EA] px-3 py-2 text-sm text-[#263238] focus:border-[#0D47A1] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2.5 border-t border-[#D9E3EA] pt-4 text-xs text-[#263238]">
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={checkSportsData}
                onChange={(e) => setCheckSportsData(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
              <span>
                <strong>Consentimento para Tratamento de Dados Esportivos:</strong> Autorizo o
                tratamento dos dados esportivos, educacionais (<code>NGS Academy</code>) e de
                telemetria não-sensível de pista do(a) menor sob minha responsabilidade para
                construção do <code>Portal do Atleta</code> e cálculo explicável do{' '}
                <code>Readiness Score</code>, ciente de que nenhum dado biométrico ou de saúde é
                coletado.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={checkVisibility}
                onChange={(e) => setCheckVisibility(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
              <span>
                <strong>Autorização de Visibilidade Controlada:</strong> Autorizo a exibição do
                perfil esportivo no <code>Talent Network</code> e no módulo <code>Sponsorship</code>{' '}
                para descoberta por ligas, especialistas e patrocinadores, podendo revogar esta
                autorização e retornar o perfil ao modo privado a qualquer momento.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={checkLegalDecl}
                onChange={(e) => setCheckLegalDecl(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
              <span>
                <strong>Declaração de Responsabilidade Legal:</strong> Declaro ser pai, mãe ou
                tutor(a) legal do(a) atleta menor de 18 anos e confirmo a leitura dos Termos de Uso
                e da Política de Privacidade da Next Gen Sports.
              </span>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[#D9E3EA] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={keepProfilePrivate}
              className="rounded-lg border border-[#D9E3EA] bg-white px-4 py-2 text-xs font-semibold text-[#263238] hover:bg-slate-50"
            >
              Manter Perfil Privado
            </button>
            <button
              type="submit"
              disabled={!canApprove}
              className="rounded-lg bg-[#0D47A1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#031B33] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Aprovar Acesso &amp; Visibilidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
