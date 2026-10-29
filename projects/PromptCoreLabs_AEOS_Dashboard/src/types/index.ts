export type Language = 'pt' | 'en' | 'es';
export type Theme = 'light' | 'dark' | 'system';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'System Admin' | 'Squad Lead' | 'Senior Engineer' | 'Auditor QA' | 'Guest';
  squad: string;
  activeSessions: number;
  maxSessions: number;
  twoFactorEnabled: boolean;
  ssoConnected: boolean;
  dailyTokenLimit: number;
  allowedTimeWindow: string;
}

export interface Project {
  id: string;
  name: string;
  conversationsCount: number;
  activeAgentsCount: number;
  conversations: Conversation[];
}

export interface Conversation {
  id: string;
  title: string;
  dateGroup: 'Hoje' | 'Ontem' | 'Últimos 7 dias' | 'Últimos 15 dias' | 'Últimos 30 dias';
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ActionPreviewData {
  type: 'email' | 'meeting' | 'task';
  recipient: string;
  recipientEmail?: string;
  subject: string;
  body: string;
  app: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  text: string;
  artifacts?: Artifact[];
  actionProposal?: ActionPreviewData;
  toolsCalled?: string[];
  toolsCallingStatus?: string;
  webReferences?: {
    title: string;
    url: string;
    snippet: string;
    source: string;
  }[];
  isProcessing?: boolean;
  activeStepIndex?: number;
  steps?: {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'completed' | 'skipped';
    durationMs?: number;
    detail?: string;
  }[];
  elapsedSeconds?: number;
  confidenceScore?: number;
  toolCall?: {
    command: string;
    durationMs: number;
    status: 'success' | 'failed';
  };
}

export type StorageProvider = 'Google Drive' | 'OneDrive' | 'PCL Storage' | 'Local Enclave';

export interface StorageMetadata {
  provider: StorageProvider;
  cloudUri?: string;
  sha256Hash: string;
  syncStatus: 'SYNCED' | 'PENDING' | 'LOCAL_ONLY';
  lastAttestation: string;
}

export interface Artifact {
  id: string;
  title: string;
  type: 'plan' | 'code' | 'diagram' | 'doc' | 'sheet' | 'slide';
  summary: string;
  content: string;
  source?: StorageProvider;
  storage?: StorageMetadata;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'active' | 'standby' | 'offline';
  currentTask?: string;
  timerFormatted?: string;
  assignedSkills: string[];
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  latencyMs: number;
  icon: string;
}

export interface Skill {
  id: string;
  key: string;
  name: string;
  description: string;
  sourcePath: string;
  mode: 'Editable' | 'Read-Only';
  usedByAgents: string[];
  markdownContent: string;
}

export interface CostReport {
  cloudSpendUSD: number;
  localSavedUSD: number;
  localTokensTotal: number;
  cloudTokensTotal: number;
  byAgent: { name: string; spendUSD: number; tokensFormatted: string }[];
  byProject: { name: string; spendUSD: number }[];
}

export interface Integration {
  id: string;
  name: string;
  category: 'Google & Microsoft' | 'MCP Servers' | 'Plugins & Webhooks';
  description: string;
  status: 'Connected' | 'Active' | 'Disconnected';
  icon: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  sha256Hash: string;
  status: 'Approved' | 'Audited' | 'Flagged';
  complianceStandard: 'ISO 27001' | 'ISO 42001' | 'EU AI Act' | 'LGPD';
}
