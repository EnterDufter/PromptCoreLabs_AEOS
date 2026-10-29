import React, { useState } from 'react';
import { Lock, Shield, Laptop, Smartphone, AlertTriangle, CheckCircle, UserCheck, Key } from 'lucide-react';
import { UserProfile } from '../../types';

interface UserManagementSecurityProps {
  user: UserProfile;
}

export const UserManagementSecurity: React.FC<UserManagementSecurityProps> = ({ user }) => {
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Navegador Chrome - Windows 11 (Esta sessão)', ip: '189.120.45.12', lastActive: 'Ativo agora', isCurrent: true },
    { id: 'sess-2', device: 'App Mobile PCL - iPhone 15 Pro', ip: '177.89.12.90', lastActive: 'Há 12 min', isCurrent: false }
  ]);

  const [thirdAttemptAlert, setThirdAttemptAlert] = useState<string | null>(
    'Bloqueio Automático Ativo: Tentativa de login simultâneo em 3º dispositivo (MacBook Air / 201.88.4.1) foi sumariamente BLOQUEADA pela norma de segurança.'
  );

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none">
      {/* Strict 2 Devices Rule Warning Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Política Estrita de 2 Dispositivos Concorrentes</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/40">
            {sessions.length} / {user.maxSessions} Dispositivos Ativos
          </span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          Para prevenção contra vazamento de credenciais e compartilhamento indevido de conta, cada usuário pode estar logado em no máximo 2 dispositivos simultaneamente. Qualquer tentativa em um 3º dispositivo gera um alerta automático com bloqueio temporário por segurança.
        </p>
      </div>

      {/* Alert for 3rd device attempt blocked */}
      {thirdAttemptAlert && (
        <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-[11px]">
            <span className="font-bold block mb-0.5">Alerta de Segurança Disparado</span>
            <p>{thirdAttemptAlert}</p>
          </div>
        </div>
      )}

      {/* Active Device Sessions Table */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Sessões Ativas</h4>
        <div className="space-y-2">
          {sessions.map(sess => (
            <div
              key={sess.id}
              className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {sess.device.includes('iPhone') ? <Smartphone className="w-5 h-5 text-indigo-500" /> : <Laptop className="w-5 h-5 text-blue-500" />}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold">
                        ESTA SESSÃO
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">IP: {sess.ip} • {sess.lastActive}</span>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(sess.id)}
                  className="px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-medium transition"
                >
                  Revogar Acesso
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Auth & Permissions Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SSO & 2FA Status */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="font-bold text-xs text-slate-800 dark:text-slate-100 block">Autenticação & Acesso</span>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Duplo Fator de Autenticação (2FA)</span>
              </div>
              <span className="text-emerald-600 font-bold">ATIVADO</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-indigo-500" />
                <span>Single Sign-On (SSO Google/GitHub)</span>
              </div>
              <span className="text-emerald-600 font-bold">CONECTADO</span>
            </div>
          </div>
        </div>

        {/* Cotas & Limites de Tempo */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="font-bold text-xs text-slate-800 dark:text-slate-100 block">Limites de Cota & Horário</span>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Limite Diário de Tokens LLM:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">500,000 / dia</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Janela de Horário Permitida:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">24/7 (System Admin)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
