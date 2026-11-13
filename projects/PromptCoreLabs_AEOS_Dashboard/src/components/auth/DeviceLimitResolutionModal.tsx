import React from 'react';
import { ShieldAlert, Laptop, Smartphone, LogOut, X, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthSession } from '../../services/auth/authService';

interface DeviceLimitResolutionModalProps {
  isOpen: boolean;
  sessions: AuthSession[];
  pendingAttempt?: Partial<AuthSession> | null;
  onResolve: (revokeSessionId: string) => void;
  onCancel: () => void;
}

export const DeviceLimitResolutionModal: React.FC<DeviceLimitResolutionModalProps> = ({
  isOpen,
  sessions,
  pendingAttempt,
  onResolve,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header Corporativo de Segurança */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Trava de Concorrência
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[10px] text-slate-500 font-medium">Limite 2 Dispositivos</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Limite de Dispositivos Concorrentes Atingido
              </h2>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Fechar e cancelar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Alerta e Sessões Ativas */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
          {/* Banner de Contexto */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">
                Sua credencial já está ativa em 2 dispositivos simultaneamente.
              </p>
              <p className="text-amber-800/90 dark:text-amber-300/80 text-[11px]">
                Para prevenir compartilhamento indevido de contas e garantir conformidade com a política ISO 27001, escolha abaixo qual dispositivo deseja desconectar imediatamente para permitir o acesso neste novo ambiente.
              </p>
            </div>
          </div>

          {/* Candidato à nova conexão (se informado) */}
          {pendingAttempt && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Dispositivo Solicitante Atual</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Aguardando Autorização</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-semibold text-xs">
                <ArrowRight className="w-4 h-4 text-emerald-500" />
                <span>{pendingAttempt.deviceName || 'Nova Estação de Trabalho'}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                IP: {pendingAttempt.ipAddress || '189.120.45.12'} • {pendingAttempt.location || 'São Paulo, BR'}
              </div>
            </div>
          )}

          {/* Lista de Sessões Ativas para Desconexão */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Dispositivos Ativos Atualmente ({sessions.length}/2)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Clique para desautorizar</span>
            </div>

            <div className="space-y-2.5">
              {sessions.map((sess) => {
                const isMobile = sess.deviceType === 'mobile' || sess.deviceName.toLowerCase().includes('iphone') || sess.deviceName.toLowerCase().includes('android');
                return (
                  <div
                    key={sess.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300">
                        {isMobile ? <Smartphone className="w-5 h-5 text-indigo-500" /> : <Laptop className="w-5 h-5 text-blue-500" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {sess.deviceName}
                          </p>
                          {sess.isCurrentDevice && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-bold">
                              Atual
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {sess.browser} • {sess.os}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          IP: {sess.ipAddress} • {sess.location} • <span className="text-emerald-600 dark:text-emerald-400">{sess.lastActive}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onResolve(sess.id)}
                      className="px-3.5 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold text-xs border border-rose-200 dark:border-rose-800/80 flex items-center space-x-1.5 flex-shrink-0 transition active:scale-[0.98] cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Desconectar & Acessar</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé Seguro */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Auditoria criptográfica com log SHA-256</span>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition cursor-pointer"
          >
            Cancelar Login
          </button>
        </div>
      </div>
    </div>
  );
};

