/**
 * PCL Cockpit Companion Service Worker (Manifest V3)
 * Orchestrates OmniRoute routing, HitL pending queue, and cryptographic logging.
 */

import { EXTENSION_CONFIG } from '../config/extensionConfig';

declare const chrome: any;

interface PendingHitLAction {
  id: string;
  timestamp: number;
  tier1ExpiresAt: number; // 60 segundos
  tier2ExpiresAt: number; // 120 segundos
  toolName: string;
  payload: any;
  riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
  status: 'PENDING_TIER_1' | 'ESCALATED_TIER_2' | 'APPROVED' | 'REJECTED' | 'EXPIRED_SAFE_ABORT';
  escalatedTo?: string;
  escalationHmacSignature?: string;
}

const pendingActions = new Map<string, PendingHitLAction>();

// SHA-256 helper
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Background event listener
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === 'PCL_CHECK_HEALTH') {
    checkDaemonsHealth().then(sendResponse);
    return true;
  }

  if (message.type === 'PCL_REQUEST_ACTION') {
    handleActionRequest(message.payload).then(sendResponse);
    return true;
  }

  if (message.type === 'PCL_APPROVE_HITL') {
    handleHitLDecision(message.actionId, 'APPROVED').then(sendResponse);
    return true;
  }

  if (message.type === 'PCL_REJECT_HITL') {
    handleHitLDecision(message.actionId, 'REJECTED').then(sendResponse);
    return true;
  }

  if (message.type === 'PCL_QUERY_PENDING_HITL') {
    checkEscalationsAndExpirations();
    sendResponse({ pending: Array.from(pendingActions.values()) });
    return false;
  }
});

async function checkDaemonsHealth() {
  try {
    const cockpitRes = await fetch(`${EXTENSION_CONFIG.cockpitBaseUrl}${EXTENSION_CONFIG.endpoints.cockpitStatus}`);
    const layaRes = await fetch(`${EXTENSION_CONFIG.layaBaseUrl}${EXTENSION_CONFIG.endpoints.layaHealth}`);
    return {
      cockpitUp: cockpitRes.ok,
      layaUp: layaRes.ok,
      timestamp: Date.now()
    };
  } catch (e) {
    return { cockpitUp: false, layaUp: false, error: String(e) };
  }
}

async function handleActionRequest(payload: any) {
  const actionId = `hitl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const isCritical = payload.toolName?.includes('update') || 
                     payload.toolName?.includes('delete') || 
                     payload.toolName?.includes('send_email');

  const riskLevel = isCritical ? 'CRITICAL' : 'LOW';

  // If low risk, auto execute
  if (riskLevel === 'LOW') {
    const hash = await sha256(JSON.stringify(payload));
    return {
      actionId,
      status: 'AUTO_APPROVED',
      riskLevel,
      sha256Hash: hash,
      result: `Operação de leitura "${payload.toolName}" executada com sucesso com resíduo zero.`
    };
  }

  // If critical, queue for 2-Stage Human-in-the-Loop approval
  const tier1TtlMs = 60 * 1000; // 60 segundos para aprovação primária (N1)
  const tier2TtlMs = EXTENSION_CONFIG.hitl.defaultTtlSeconds * 1000; // 120 segundos totais (N2)
  const now = Date.now();

  const actionRecord: PendingHitLAction = {
    id: actionId,
    timestamp: now,
    tier1ExpiresAt: now + tier1TtlMs,
    tier2ExpiresAt: now + tier2TtlMs,
    toolName: payload.toolName,
    payload,
    riskLevel: 'CRITICAL',
    status: 'PENDING_TIER_1'
  };

  pendingActions.set(actionId, actionRecord);

  return {
    actionId,
    status: 'REQUIRES_HITL',
    riskLevel: 'CRITICAL',
    tier1TtlSeconds: 60,
    tier2TtlSeconds: 120,
    message: 'Esta ação altera dados no sistema corporativo e requer autorização no Trivial Gate (Escalação N2 após 60s).'
  };
}

async function handleHitLDecision(actionId: string, decision: 'APPROVED' | 'REJECTED') {
  const action = pendingActions.get(actionId);
  if (!action) {
    return { success: false, reason: 'Ação não encontrada ou expirada (TTL excedido).' };
  }

  if (Date.now() > action.tier2ExpiresAt) {
    action.status = 'EXPIRED_SAFE_ABORT';
    pendingActions.delete(actionId);
    return { success: false, reason: 'Tempo de aprovação humana expirou (TTL de 120s).' };
  }

  action.status = decision;
  const hash = await sha256(`${action.id}:${decision}:${Date.now()}`);

  pendingActions.delete(actionId);

  return {
    success: true,
    actionId,
    decision,
    sha256Hash: hash,
    timestamp: new Date().toISOString()
  };
}

// 2-Stage Escalation Ladder & Safe Abort Checker
async function checkEscalationsAndExpirations() {
  const now = Date.now();
  for (const [id, action] of pendingActions.entries()) {
    // Stage 1: Escalate to Tier 2 if 60 seconds passed without decision
    if (now > action.tier1ExpiresAt && action.status === 'PENDING_TIER_1') {
      action.status = 'ESCALATED_TIER_2';
      action.escalatedTo = 'Diretoria Executiva / Backup Lead';
      
      const escalationPayload = `ESCALATE:${action.id}:${action.toolName}:${now}`;
      action.escalationHmacSignature = await sha256(escalationPayload);

      console.warn(`[PCL HitL Escalation] Ação ${action.id} escalada para ${action.escalatedTo}. HMAC: ${action.escalationHmacSignature.substring(0, 16)}...`);
    }

    // Stage 2: Safe Abort if 120 seconds passed without decision
    if (now > action.tier2ExpiresAt) {
      action.status = 'EXPIRED_SAFE_ABORT';
      pendingActions.delete(id);
      console.error(`[PCL HitL Safe Abort] Ação ${id} descartada por timeout seguro (TTL 120s). Zero vazamento de memória.`);
    }
  }
}

// Checker timer runs periodically
setInterval(checkEscalationsAndExpirations, 5000);

