import { UserProfile } from '../../types';

export interface DeviceSession {
  id: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrentDevice: boolean;
}

export const initialUserProfile: UserProfile = {
  id: 'usr_01h8x9p',
  name: 'Eduardo Machado',
  email: 'eduardo@pcl.ai',
  avatar: 'EM',
  role: 'System Admin',
  squad: 'Enterprise Core',
  activeSessions: 2,
  maxSessions: 2,
  twoFactorEnabled: true,
  ssoConnected: true,
  dailyTokenLimit: 500000,
  allowedTimeWindow: '08:00 às 20:00 (Seg a Sex)'
};

export const activeDeviceSessions: DeviceSession[] = [
  {
    id: 'sess_macbook_01',
    deviceName: 'MacBook Pro 16 (Navegador Chrome)',
    ipAddress: '187.54.120.44',
    location: 'São Paulo, BR',
    lastActive: 'Agora',
    isCurrentDevice: true
  },
  {
    id: 'sess_iphone_02',
    deviceName: 'iPhone 15 Pro (App Mobile)',
    ipAddress: '187.54.120.44',
    location: 'São Paulo, BR',
    lastActive: 'Há 12 min',
    isCurrentDevice: false
  }
];

export const checkDeviceSessionLimit = (attemptedDeviceName: string): { allowed: boolean; alertMessage?: string } => {
  if (activeDeviceSessions.length >= initialUserProfile.maxSessions) {
    return {
      allowed: false,
      alertMessage: `🚨 BLOQUEIO DE SEGURANÇA: Limite de ${initialUserProfile.maxSessions} dispositivos atingido! Tentativa de conexão a partir de "${attemptedDeviceName}" foi bloqueada automaticamente. Revogue uma sessão anterior para conectar.`
    };
  }
  return { allowed: true };
};
