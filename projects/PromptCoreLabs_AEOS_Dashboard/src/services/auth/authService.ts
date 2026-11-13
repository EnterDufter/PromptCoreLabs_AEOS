import { UserProfile } from '../../types';

export type OAuthProvider = 'google' | 'microsoft' | 'github' | 'linkedin' | 'corporate_email';

export interface AuthSession {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  createdAt: string;
  isCurrentDevice: boolean;
}

export interface AuthUser extends UserProfile {
  provider?: OAuthProvider;
  companyName?: string;
  lastLoginAt?: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  requiresDeviceLimitResolution?: boolean;
  activeSessions?: AuthSession[];
  pendingSessionAttempt?: Partial<AuthSession>;
}

const STORAGE_KEY_USER = 'pcl_auth_user_v4';
const STORAGE_KEY_SESSIONS = 'pcl_auth_sessions_v4';

const INITIAL_DEFAULT_USER: AuthUser = {
  id: 'usr_01h8x9p',
  name: 'Eduardo Machado',
  email: 'eduardo@promptcorelabs.com',
  avatar: 'EM',
  role: 'System Admin',
  squad: 'Enterprise Core',
  activeSessions: 2,
  maxSessions: 2,
  twoFactorEnabled: true,
  ssoConnected: true,
  dailyTokenLimit: 500000,
  allowedTimeWindow: '24/7 (System Admin)',
  provider: 'google',
  companyName: 'PromptCore Labs Sovereign Enterprise',
  lastLoginAt: new Date().toISOString()
};

const INITIAL_SESSIONS: AuthSession[] = [
  {
    id: 'sess_workstation_current',
    userId: 'usr_01h8x9p',
    deviceName: 'Estação Principal Windows 11 (Navegador Chrome)',
    deviceType: 'desktop',
    browser: 'Chrome 128 Enterprise',
    os: 'Windows 11 Pro 64-bit',
    ipAddress: '187.54.120.44',
    location: 'São Paulo, BR (Datacenter Corporativo)',
    lastActive: 'Ativo agora',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isCurrentDevice: true
  },
  {
    id: 'sess_mobile_backup',
    userId: 'usr_01h8x9p',
    deviceName: 'iPhone 16 Pro (PCL Mobile Enclave)',
    deviceType: 'mobile',
    browser: 'Safari Mobile PWA',
    os: 'iOS 18.1 Secure',
    ipAddress: '177.89.12.90',
    location: 'São Paulo, BR',
    lastActive: 'Há 14 min',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isCurrentDevice: false
  }
];

type AuthListener = (user: AuthUser | null, sessions: AuthSession[]) => void;

class AuthService {
  private currentUser: AuthUser | null = null;
  private sessions: AuthSession[] = [];
  private listeners: Set<AuthListener> = new Set();
  private pendingNewSession: Partial<AuthSession> | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const storedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);

      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      } else {
        this.currentUser = { ...INITIAL_DEFAULT_USER };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      }

      if (storedSessions) {
        this.sessions = JSON.parse(storedSessions);
      } else {
        this.sessions = [...INITIAL_SESSIONS];
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(this.sessions));
      }

      if (this.currentUser) {
        this.currentUser.activeSessions = this.sessions.length;
      }
    } catch {
      this.currentUser = { ...INITIAL_DEFAULT_USER };
      this.sessions = [...INITIAL_SESSIONS];
    }
  }

  private saveToStorage() {
    try {
      if (this.currentUser) {
        this.currentUser.activeSessions = this.sessions.length;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(this.sessions));
    } catch {
      // Storage safe fallback
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentUser, [...this.sessions]);
      } catch (err) {
        console.error('Error in auth listener:', err);
      }
    });
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener(this.currentUser, [...this.sessions]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public getActiveSessions(): AuthSession[] {
    return [...this.sessions];
  }

  public getMaxSessions(): number {
    return this.currentUser?.maxSessions ?? 2;
  }

  public isSessionLimitReached(): boolean {
    return this.sessions.length >= this.getMaxSessions();
  }

  /**
   * Efetua login via provedor OAuth2/OIDC corporativo
   */
  public async loginWithOAuth(provider: OAuthProvider): Promise<LoginResult> {
    const providerMeta: Record<OAuthProvider, { email: string; name: string; avatar: string }> = {
      google: {
        email: 'eduardo@promptcorelabs.com',
        name: 'Eduardo Machado (Google Workspace)',
        avatar: 'EM'
      },
      microsoft: {
        email: 'eduardo.machado@promptcorelabs.onmicrosoft.com',
        name: 'Eduardo Machado (Entra ID / M365)',
        avatar: 'EM'
      },
      github: {
        email: 'eduardo@promptcorelabs.com',
        name: 'Eduardo Machado (GitHub Enterprise)',
        avatar: 'EM'
      },
      linkedin: {
        email: 'eduardo.machado@linkedin.com',
        name: 'Eduardo Machado (LinkedIn Corporate)',
        avatar: 'EM'
      },
      corporate_email: {
        email: 'eduardo@promptcorelabs.com',
        name: 'Eduardo Machado',
        avatar: 'EM'
      }
    };

    const targetUser = providerMeta[provider];
    const newSessionCandidate: Partial<AuthSession> = {
      id: `sess_${provider}_${Date.now()}`,
      deviceName: `Navegador Corporativo (${provider.toUpperCase()} SSO)`,
      deviceType: 'desktop',
      browser: 'Secure Enterprise Browser',
      os: 'Windows 11 / macOS Workstation',
      ipAddress: '189.120.45.12',
      location: 'São Paulo, BR (Rede Corporativa)',
      lastActive: 'Ativo agora',
      createdAt: new Date().toISOString(),
      isCurrentDevice: true
    };

    // Verificação estrita de concorrência: Máximo 2 dispositivos
    if (this.sessions.length >= 2) {
      this.pendingNewSession = newSessionCandidate;
      return {
        success: false,
        requiresDeviceLimitResolution: true,
        activeSessions: [...this.sessions],
        pendingSessionAttempt: newSessionCandidate,
        error: 'Limite de 2 dispositivos ativos simultâneos atingido pela política de segurança corporativa.'
      };
    }

    const newUser: AuthUser = {
      ...INITIAL_DEFAULT_USER,
      name: targetUser.name,
      email: targetUser.email,
      avatar: targetUser.avatar,
      provider,
      lastLoginAt: new Date().toISOString()
    };

    this.sessions.forEach(s => (s.isCurrentDevice = false));
    this.sessions.push(newSessionCandidate as AuthSession);
    this.currentUser = newUser;
    this.pendingNewSession = null;
    this.saveToStorage();

    return {
      success: true,
      user: this.currentUser,
      activeSessions: [...this.sessions]
    };
  }

  /**
   * Login via e-mail corporativo com credencial ou hash
   */
  public async loginWithEmail(email: string, _password?: string): Promise<LoginResult> {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Por favor, insira um e-mail institucional corporativo válido.' };
    }

    const newSessionCandidate: Partial<AuthSession> = {
      id: `sess_corp_email_${Date.now()}`,
      deviceName: `Workstation Corporativa (${email.split('@')[1] || 'Empresa'})`,
      deviceType: 'desktop',
      browser: 'Chrome Enterprise Managed',
      os: 'Windows 11 Enterprise',
      ipAddress: '187.54.120.44',
      location: 'São Paulo, BR',
      lastActive: 'Ativo agora',
      createdAt: new Date().toISOString(),
      isCurrentDevice: true
    };

    if (this.sessions.length >= 2) {
      this.pendingNewSession = newSessionCandidate;
      return {
        success: false,
        requiresDeviceLimitResolution: true,
        activeSessions: [...this.sessions],
        pendingSessionAttempt: newSessionCandidate,
        error: 'Limite de 2 dispositivos ativos atingido. Escolha qual dispositivo desconectar para liberar acesso.'
      };
    }

    const userName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PCL';

    this.currentUser = {
      ...INITIAL_DEFAULT_USER,
      name: userName,
      email,
      avatar: initials,
      provider: 'corporate_email',
      companyName: email.split('@')[1] ? email.split('@')[1].toUpperCase() : 'PromptCore Labs Enterprise',
      lastLoginAt: new Date().toISOString()
    };

    this.sessions.forEach(s => (s.isCurrentDevice = false));
    this.sessions.push(newSessionCandidate as AuthSession);
    this.pendingNewSession = null;
    this.saveToStorage();

    return {
      success: true,
      user: this.currentUser,
      activeSessions: [...this.sessions]
    };
  }

  /**
   * Simulação de envio de Magic Link criptografado
   */
  public async requestMagicLink(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'E-mail corporativo inválido.' };
    }
    return {
      success: true,
      message: `Token criptográfico temporário de uso único enviado para ${email}. Verifique sua caixa corporativa.`
    };
  }

  /**
   * Resolução da Trava de Concorrência: Revoga a sessão escolhida e conecta o novo dispositivo
   */
  public resolveThirdSessionConflict(revokeSessionId: string, customNewSession?: Partial<AuthSession>): LoginResult {
    // Revoga a sessão indicada
    this.sessions = this.sessions.filter(s => s.id !== revokeSessionId);

    const sessionToAdd: AuthSession = {
      id: customNewSession?.id || this.pendingNewSession?.id || `sess_resolved_${Date.now()}`,
      userId: this.currentUser?.id || INITIAL_DEFAULT_USER.id,
      deviceName: customNewSession?.deviceName || this.pendingNewSession?.deviceName || 'Novo Dispositivo Autorizado',
      deviceType: customNewSession?.deviceType || this.pendingNewSession?.deviceType || 'desktop',
      browser: customNewSession?.browser || this.pendingNewSession?.browser || 'Chrome Enterprise 128',
      os: customNewSession?.os || this.pendingNewSession?.os || 'Windows 11 Workstation',
      ipAddress: customNewSession?.ipAddress || this.pendingNewSession?.ipAddress || '189.120.45.12',
      location: customNewSession?.location || this.pendingNewSession?.location || 'São Paulo, BR',
      lastActive: 'Ativo agora',
      createdAt: new Date().toISOString(),
      isCurrentDevice: true
    };

    this.sessions.forEach(s => (s.isCurrentDevice = false));
    this.sessions.push(sessionToAdd);

    if (!this.currentUser) {
      this.currentUser = { ...INITIAL_DEFAULT_USER };
    }

    this.pendingNewSession = null;
    this.saveToStorage();

    return {
      success: true,
      user: this.currentUser,
      activeSessions: [...this.sessions]
    };
  }

  /**
   * Revoga uma sessão ativa
   */
  public revokeSession(sessionId: string): boolean {
    const beforeCount = this.sessions.length;
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    if (this.sessions.length < beforeCount) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Simula a tentativa de um 3º dispositivo para teste da trava de concorrência
   */
  public simulateThirdDeviceAttempt(): { alertMessage: string; candidateSession: AuthSession } {
    const candidate: AuthSession = {
      id: `sess_attempt_third_${Date.now()}`,
      userId: this.currentUser?.id || 'usr_01h8x9p',
      deviceName: 'MacBook Air M2 (Datacenter Externo)',
      deviceType: 'desktop',
      browser: 'Safari 18.0 Enterprise',
      os: 'macOS Sequoia 15.1',
      ipAddress: '201.88.4.19',
      location: 'Rio de Janeiro, BR',
      lastActive: 'Tentativa há instantes',
      createdAt: new Date().toISOString(),
      isCurrentDevice: false
    };

    this.pendingNewSession = candidate;

    return {
      alertMessage: `🚨 BLOQUEIO DE CONCORRÊNCIA: Limite de 2 dispositivos ativos atingido! Tentativa de conexão a partir de "${candidate.deviceName}" (${candidate.ipAddress}) foi sumariamente retida pela trava de segurança.`,
      candidateSession: candidate
    };
  }

  /**
   * Encerra a sessão atual com segurança (Logout)
   */
  public logout(): void {
    // Remove a sessão marcada como atual
    this.sessions = this.sessions.filter(s => !s.isCurrentDevice);
    this.currentUser = null;
    this.pendingNewSession = null;
    this.saveToStorage();
  }
}

export const authService = new AuthService();

// Compatibilidade retroativa com declarações legadas
export const initialUserProfile = INITIAL_DEFAULT_USER;
export const activeDeviceSessions = INITIAL_SESSIONS;
export const checkDeviceSessionLimit = (attemptedDeviceName: string) => {
  if (authService.isSessionLimitReached()) {
    return {
      allowed: false,
      alertMessage: `🚨 BLOQUEIO DE SEGURANÇA: Limite de 2 dispositivos atingido! Tentativa de conexão a partir de "${attemptedDeviceName}" foi bloqueada automaticamente. Revogue uma sessão anterior para conectar.`
    };
  }
  return { allowed: true };
};
