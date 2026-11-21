import React, { useState } from 'react';
import { Copy, Lock, Share2, X } from 'lucide-react';
import { useNgs } from '../../context/NgsContext';

export const CopyAiModal: React.FC = () => {
  const { copyAiPost, closeCopyAiModal, primaryAthlete, openLgpdModal, showToast } = useNgs();
  const [channel, setChannel] = useState<'Instagram' | 'LinkedIn'>('Instagram');

  if (!copyAiPost) return null;

  const isBlockedMinor =
    copyAiPost.authorId === primaryAthlete.id &&
    primaryAthlete.lgpd.isMinor &&
    primaryAthlete.lgpd.status !== 'approved';

  const generatedCopy =
    channel === 'Instagram'
      ? `${copyAiPost.title}\n\n${copyAiPost.body}\n\nEvidência verificada na Next Gen Sports (${copyAiPost.evidenceTag}).\n#NextGenSports #ProofOfTalent #ReadinessScore`
      : `Evolução auditável na Next Gen Sports: ${copyAiPost.title}.\n\n${copyAiPost.body}\n\nRegistro validado: ${copyAiPost.evidenceTag}.`;

  const handleCopy = () => {
    if (isBlockedMinor) return;
    navigator.clipboard?.writeText(generatedCopy).catch(() => {});
    showToast(`Rascunho para ${channel} copiado para fila de distribuição externa.`);
    closeCopyAiModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#031B33]/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Preparar Distribuição Externa"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#D9E3EA] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17B3B3]/15 text-[#0D47A1]">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#031B33]">
                Content Ops — Distribuição Externa
              </h2>
              <p className="text-[11px] text-slate-500">
                Simulação determinística local (sem APIs externas pagas)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCopyAiModal}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isBlockedMinor ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold">
              <Lock className="h-4 w-4 text-amber-700" />
              <span>Compartilhamento Externo Bloqueado (LGPD Art. 14)</span>
            </div>
            <p className="mt-1.5 leading-relaxed">
              O perfil de <strong>{primaryAthlete.name} (16 anos)</strong> está em{' '}
              <code>Pendente Responsável</code>. É necessária a autorização do Responsável Legal
              para exportar publicações para redes externas.
            </p>
            <button
              type="button"
              onClick={() => {
                closeCopyAiModal();
                openLgpdModal();
              }}
              className="mt-3 rounded-lg bg-[#0D47A1] px-3 py-1.5 font-semibold text-white"
            >
              Validar Responsável Legal
            </button>
          </div>
        ) : (
          <>
            <div className="mt-4 flex gap-2">
              {(['Instagram', 'LinkedIn'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    channel === c
                      ? 'bg-[#0D47A1] text-white'
                      : 'border border-[#D9E3EA] bg-[#FAFAFB] text-slate-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <textarea
              readOnly
              rows={6}
              value={generatedCopy}
              className="mt-3 w-full rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] p-3 text-xs leading-relaxed text-[#263238]"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeCopyAiModal}
                className="rounded-lg border border-[#D9E3EA] px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D47A1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#031B33]"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar para Agendamento</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
