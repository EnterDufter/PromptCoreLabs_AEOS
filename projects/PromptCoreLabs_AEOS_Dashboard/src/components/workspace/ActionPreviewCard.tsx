import React, { useState } from 'react';
import { Mail, Calendar, CheckCircle2, X, Send, Edit3, ArrowRight } from 'lucide-react';

export interface ActionPreviewData {
  type: 'email' | 'meeting' | 'task';
  recipient: string;
  recipientEmail?: string;
  subject: string;
  body: string;
  app: string;
}

interface ActionPreviewCardProps {
  action: ActionPreviewData;
  onConfirm?: (action: ActionPreviewData) => void;
  onDismiss?: () => void;
}

export const ActionPreviewCard: React.FC<ActionPreviewCardProps> = ({
  action,
  onConfirm,
  onDismiss
}) => {
  const [subject, setSubject] = useState(action.subject);
  const [body, setBody] = useState(action.body);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    if (onConfirm) {
      onConfirm({ ...action, subject, body });
    }
  };

  if (confirmed) {
    return (
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between my-2 animate-in fade-in duration-200 max-w-lg">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 block">
              {action.type === 'email' ? 'E-mail enviado' : 'Reunião agendada'}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Enviado com sucesso para {action.recipient}
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {action.app}
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 my-2 max-w-xl text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
          {action.type === 'email' ? (
            <Mail className="w-4 h-4 text-emerald-500" />
          ) : (
            <Calendar className="w-4 h-4 text-sky-500" />
          )}
          <span className="font-semibold">
            {action.type === 'email' ? 'Preview de Envio de E-mail' : 'Preview de Agendamento'}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
            {action.app}
          </span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center space-x-1"
        >
          <Edit3 className="w-3 h-3" />
          <span>{isEditing ? 'Concluir edição' : 'Editar mensagem'}</span>
        </button>
      </div>

      {/* Recipient */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Destinatário:</span>
        <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">
          {action.recipient} {action.recipientEmail && `(${action.recipientEmail})`}
        </span>
      </div>

      {/* Subject */}
      <div className="space-y-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Assunto</span>
        {isEditing ? (
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-xs focus:outline-none"
          />
        ) : (
          <p className="font-medium text-xs text-slate-800 dark:text-slate-200 bg-slate-50/60 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            {subject}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="space-y-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Mensagem</span>
        {isEditing ? (
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={3}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none custom-scrollbar resize-none leading-relaxed"
          />
        ) : (
          <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-wrap leading-relaxed">
            {body}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-2 pt-1">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition"
          >
            Descartar
          </button>
        )}
        <button
          onClick={handleConfirm}
          className="px-3.5 py-1.5 rounded-lg bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 text-xs font-medium hover:opacity-90 transition flex items-center space-x-1.5 shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Confirmar e Enviar</span>
        </button>
      </div>
    </div>
  );
};
