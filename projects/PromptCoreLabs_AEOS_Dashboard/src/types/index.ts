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
  createdAt?: string;
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
  type: 'plan' | 'code' | 'diagram' | 'doc' | 'sheet' | 'slide' | 'image' | 'table' | 'audio' | 'video' | 'app' | 'meeting_capture' | 'infographic';
  summary: string;
  content: string;
  mediaUrl?: string;
  metadata?: Record<string, any>;
  source?: StorageProvider;
  storage?: StorageMetadata;
  updatedAt: string;
  formatExt?: string;
  vaultBlobSha256?: string;
  isFavorite?: boolean;
  tags?: string[];
  projectId?: string;
  projectName?: string;
  conversationId?: string;
  conversationTitle?: string;
  sizeBytes?: number;
  r2SyncedAt?: string;
  previewSvg?: string;
}

export interface StudyAttachment {
  id: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
  pageCount?: number;
  extractedText?: string;
  vaultBlobSha256?: string;
  uploadedAt: string;
  indexedOramaId?: string;
}

export type TargetArtifactFormat = 'auto' | 'diagram' | 'infographic' | 'app' | 'slide' | 'sheet' | 'doc';
export type MainViewMode = 'chat' | 'meetings' | 'flows' | 'artifacts';

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

// ============================================================================
// MARCO M0 (MIGRAÇÃO SQL 003) — TIPOS MULTI-TENANT, ENTITLEMENTS & VAULT
// ============================================================================

export type PlanTier = 'trial_14d' | 'sovereign_core' | 'growth_os_pro' | 'enterprise_appliance';

export type EntitlementAccessState = 'enabled' | 'trial_14d' | 'locked_upsell' | 'expired' | 'revoked';

export interface TenantProfile {
  id: string;
  slug: string;
  name: string;
  planTier: PlanTier;
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED';
  isolNamespace: string;
  trialStartsAt?: string;
  trialEndsAt?: string;
}

export interface PluginManifestSpec {
  id: string;
  version: string;
  vendor: string;
  tier: PlanTier;
  trial_days?: number;
  upsell_cta?: string;
  capabilities: string[];
  manifest_sha256: string;
}

export interface ModuleEntitlement {
  id: string;
  tenantId: string;
  moduleKey: string;
  moduleName: string;
  accessState: EntitlementAccessState;
  trialStartedAt?: string | null;
  trialExpiresAt?: string | null;
  trialDaysRemaining?: number | null;
  quotaLimitUnits: number;
  quotaUsedUnits: number;
  pluginManifest: PluginManifestSpec;
}

export interface FinOpsBudgetStatus {
  id: string;
  tenantId: string;
  departmentOrSquad: string;
  monthlyCapUsd: number;
  currentSpendUsd: number;
  monthlyCapTokens: number;
  currentSpendTokens: number;
  hardLockEnabled: boolean;
  hardLockTriggered: boolean;
  fallbackLocalModel: string;
  periodMonth: string;
}

export interface AuditChainRecord {
  seqId: number;
  eventId: string;
  tenantId: string;
  actorUserId: string;
  eventType: string;
  resourceTarget: string;
  payloadJson: Record<string, any>;
  prevHashSha256: string;
  recordHashSha256: string;
  createdAt: string;
}

export interface VaultConnectorEntry {
  id: string;
  tenantId: string;
  connectorKey: string;
  cipherAlgorithm: 'AES-256-GCM';
  keyFingerprintSha256: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  rotatedAt: string;
}

// ============================================================================
// MARCO M2 & PROAA-17 — MEMÓRIA VETORIAL PGVECTOR, LAYA DEDUP & TOKEN TAX SAVED
// ============================================================================

export interface TokenTaxSavedMetrics {
  tenantId: string;
  decisionsResolvedLocal: number;
  estimatedTokensSaved: number;
  baselineTariffPer1MUsd: number;
  baselineLlmLatencyMs: number;
  monetarySavingsUsd: number;
  monetarySavingsBrl: number;
  timeSavedMs: number;
  lastDecisionReceiptSha256: string;
  updatedAt: string;
}

export interface VectorDocumentChunkRecord {
  id: string;
  studyId: string;
  filename: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  contentSha256: string;
  dedupAction: 'ACTION_ADD' | 'ACTION_UPDATE' | 'ACTION_KEEP_BOTH' | 'ACTION_DISCARD';
  similarityScore?: number;
}

// ============================================================================
// MARCO M3.1 & PCL GROWTHOS™ (PROAA-20 & PROAA-21) — CONECTORES MCP & HARDENING SAAS
// ============================================================================

export type OfficialMcpConnectorIdM31 = 'google-workspace' | 'microsoft-365' | 'clickup' | 'github';

export interface OfficialMcpConnectorM31 {
  id: OfficialMcpConnectorIdM31;
  name: string;
  provider: string;
  wave: 'M3.1';
  transport: 'streamable-http';
  endpointUrl: string;
  oauth21PkceSupported: boolean;
  hitlEnforcedForWrites: boolean;
  vaultStatus: 'SEALED_AES256GCM' | 'READY_TO_SEAL';
  keyFingerprintSha256?: string | null;
  readOnlyTools: string[];
  hitlRequiredTools: string[];
}

export interface HitlActionProposal {
  proposalId: string;
  tenantId: string;
  connectorId: OfficialMcpConnectorIdM31;
  toolName: string;
  arguments: Record<string, any>;
  status: 'PENDING_HITL' | 'APPROVED_EXECUTED' | 'REJECTED';
  createdAt: string;
  executedAt?: string;
  sha256Receipt?: string;
}

export interface GrowthOsPluginManifest {
  id: string;
  version: string;
  vendor: string;
  tier: PlanTier;
  tenantId: string;
  unifiedTenantGraph: {
    tenantId: string;
    isolNamespace: string;
    memorySchema: 'memory';
    cockpitSchema: 'cockpit';
    pgvectorDimensions: 384;
  };
  requiredConnectors: string[];
  layaSystemOnePrimitives: string[];
  omnirouteGateway: {
    endpoint: string;
    fallbackLocalOllama: string;
    vramCpuInvariantMb: 0;
  };
  quotaPolicy: {
    trialDays: number;
    trialLimitUnits: number;
    exhaustionBehavior: 'DEGRADE_TO_LOCAL_LAYA_CPU';
  };
  capabilities: string[];
  manifest_sha256: string;
}

export interface TenantQuotaPreFlightResult {
  ok: boolean;
  tenantId: string;
  moduleKey: string;
  allowed: boolean;
  accessState: EntitlementAccessState;
  quotaLimitUnits: number;
  quotaUsedUnits: number;
  quotaRemainingUnits: number;
  quotaPercentUsed: number;
  degradedToLocalLayaCpu: boolean;
  executionEngine: 'omniroute-cloud-hybrid' | 'pcl-laya-cpu-int8';
  vramAllocatedMb: 0;
  marginalCostUsd: number;
  upsellCta?: string;
}

export interface SsrfValidationResult {
  ok: boolean;
  allowed: boolean;
  targetUrl: string;
  hostname?: string;
  errorCode?: string;
  reason?: string;
}


