import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, ShieldCheck, Key, Sparkles, CheckCircle2, 
  AlertCircle, ShieldAlert, Cpu, Eye, EyeOff, Layers, ExternalLink 
} from 'lucide-react';
import { 
  GoogleOfficialLogo, 
  MicrosoftOfficialLogo, 
  GitHubOfficialLogo, 
  LinkedInOfficialLogo 
} from '../common/AppOfficialLogos';
import { 
  authService, 
  OAuthProvider, 
  AuthUser, 
  AuthSession 
} from '../../services/auth/authService';
import { DeviceLimitResolutionModal } from './DeviceLimitResolutionModal';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'password' | 'magic_link'>('password');
  const [email, setEmail] = useState('eduardo@promptcorelabs.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState<string | null>(null);

  // Estados para tratamento da trava de 2 dispositivos concorrentes
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictSessions, setConflictSessions] = useState<AuthSession[]>([]);
  const [pendingAttempt, setPendingAttempt] = useState<Partial<AuthSession> | null>(null);

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMagicLinkSent(null);

    try {
      const res = await authService.loginWithOAuth(provider);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else if (res.requiresDeviceLimitResolution) {
        setConflictSessions(res.activeSessions || authService.getActiveSessions());
        setPendingAttempt(res.pendingSessionAttempt || null);
        setConflictModalOpen(true);
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Falha na autenticação corporativa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Por favor, informe seu e-mail corporativo.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setMagicLinkSent(null);

    try {
      if (authMode === 'magic_link') {
        const res = await authService.requestMagicLink(email);
        setMagicLinkSent(res.message);
      } else {
        const res = await authService.loginWithEmail(email, password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else if (res.requiresDeviceLimitResolution) {
          setConflictSessions(res.activeSessions || authService.getActiveSessions());
          setPendingAttempt(res.pendingSessionAttempt || null);
          setConflictModalOpen(true);
        } else if (res.error) {
          setErrorMessage(res.error);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao processar login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveConflict = (revokeSessionId: string) => {
    const res = authService.resolveThirdSessionConflict(revokeSessionId, pendingAttempt || undefined);
    setConflictModalOpen(false);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    }
  };

  // Simula tentativa de 3º dispositivo para teste da trava de concorrência
  const handleSimulateThirdDeviceAttempt = () => {
    const simulation = authService.simulateThirdDeviceAttempt();
    setConflictSessions(authService.getActiveSessions());
    setPendingAttempt(simulation.candidateSession);
    setConflictModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-800 dark:text-slate-100 select-none">
      {/* Barra de Topo Discreta */}
      <header className="h-16 px-6 md:px-12 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <img 
              src="/assets/PCL_Logo_Transparente.png" 
              alt="PromptCore Labs Logo" 
              className="h-8 w-auto object-contain filter drop-shadow-xs dark:brightness-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextEl) nextEl.style.display = 'flex';
              }}
            />
            <div className="hidden w-8 h-8 rounded-lg bg-slate-900 text-white items-center justify-center font-black text-xs">
              PCL
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                PCL Cockpit
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-semibold">
                v4.0 PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Cognitive Engineering Platform • Portal de Acesso Corporativo
            </p>
          </div>
        </div>

        {/* Badges de Confiança */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>ISO 27001 / ISO 42001</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Enclave Local Ativo</span>
          </div>
        </div>
      </header>

      {/* Container Central de Login */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg">
          {/* Card Principal de Autenticação */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10 space-y-7">
            {/* Cabeçalho do Card */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-xs mb-1">
                <Lock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Acesse a Cabine de Comando
              </h1>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                Conecte-se com sua identidade corporativa para orquestrar agentes e inteligência soberana.
              </p>
            </div>

            {/* Alertas de Erro ou Sucesso */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="flex-1 leading-snug">{errorMessage}</span>
              </div>
            )}

            {magicLinkSent && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start space-x-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="flex-1 leading-snug">{magicLinkSent}</span>
              </div>
            )}

            {/* Provedores OAuth2 / OIDC Corporativos */}
            <div className="space-y-2.5">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                Acesso Rápido via Single Sign-On (SSO)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Google Workspace */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2.5 transition shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <GoogleOfficialLogo className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Google Workspace</span>
                </button>

                {/* Microsoft 365 / Entra ID */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('microsoft')}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2.5 transition shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <MicrosoftOfficialLogo className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Microsoft 365</span>
                </button>

                {/* GitHub Enterprise */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2.5 transition shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <GitHubOfficialLogo className="w-4 h-4 flex-shrink-0 text-slate-900 dark:text-slate-100" />
                  <span className="truncate">GitHub Enterprise</span>
                </button>

                {/* LinkedIn Corporate */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('linkedin')}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2.5 transition shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <LinkedInOfficialLogo className="w-4 h-4 flex-shrink-0 text-[#0A66C2]" />
                  <span className="truncate">LinkedIn OIDC</span>
                </button>
              </div>
            </div>

            {/* Divisor com Texto */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider relative">
                ou continue com e-mail corporativo
              </span>
            </div>

            {/* Formulário Direto de Autenticação */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {/* E-mail Corporativo */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  E-mail Institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@empresa.com.br"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Seletor de Modo: Senha vs Magic Link */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('password')}
                    className={`text-[11px] font-semibold pb-0.5 border-b-2 transition ${
                      authMode === 'password'
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Senha Corporativa
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <button
                    type="button"
                    onClick={() => setAuthMode('magic_link')}
                    className={`text-[11px] font-semibold pb-0.5 border-b-2 transition ${
                      authMode === 'magic_link'
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Link Seguro (Sem Senha)
                  </button>
                </div>

                {authMode === 'password' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('magic_link')}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>

              {/* Campo de Senha (quando no modo password) */}
              {authMode === 'password' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha corporativa"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Botão de Submissão Principal */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Validando credenciais corporativas...</span>
                ) : authMode === 'magic_link' ? (
                  <>
                    <span>Enviar Magic Link de Acesso</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Teste da Trava de Concorrência (Auditoria de Segurança) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Auditoria de Concorrência:
              </span>
              <button
                type="button"
                onClick={handleSimulateThirdDeviceAttempt}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold flex items-center space-x-1 underline decoration-dotted"
                title="Simula uma tentativa de login em 3º dispositivo para validação da trava de segurança"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Simular Teste de 3º Dispositivo</span>
              </button>
            </div>
          </div>

          {/* Cartão de Garantias Soberanas & Invariantes */}
          <div className="mt-6 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[10px]">
            <div className="space-y-1">
              <span className="block font-bold text-slate-800 dark:text-slate-200">100% BYOS</span>
              <span className="text-slate-400">Resíduo Zero de Dados</span>
            </div>
            <div className="space-y-1">
              <span className="block font-bold text-emerald-600 dark:text-emerald-400">0 MB VRAM</span>
              <span className="text-slate-400">Laya System One CPU</span>
            </div>
            <div className="space-y-1">
              <span className="block font-bold text-slate-800 dark:text-slate-200">AES-256-GCM</span>
              <span className="text-slate-400">Cofre Criptografado</span>
            </div>
            <div className="space-y-1">
              <span className="block font-bold text-slate-800 dark:text-slate-200">Máx 2 Devices</span>
              <span className="text-slate-400">Trava Anti-Vazamento</span>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé Corporativo Institucional */}
      <footer className="h-14 px-6 md:px-12 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between text-[11px] text-slate-500">
        <div>
          <span>© 2026 PromptCore Labs • AI Engineering Operating System (PCL AEOS)</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            Modo Soberano • Custo Marginal $0.00
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Privacidade Blindada LGPD</span>
        </div>
      </footer>

      {/* Modal de Resolução de Limite de Dispositivos Concorrentes */}
      <DeviceLimitResolutionModal
        isOpen={conflictModalOpen}
        sessions={conflictSessions}
        pendingAttempt={pendingAttempt}
        onResolve={handleResolveConflict}
        onCancel={() => setConflictModalOpen(false)}
      />
    </div>
  );
};

