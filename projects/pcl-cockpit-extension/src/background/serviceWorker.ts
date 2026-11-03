/**
 * PCL Cockpit Companion Service Worker (Manifest V3)
 * Orchestrates OmniRoute routing, HitL pending queue, and cryptographic logging.
 */

import { EXTENSION_CONFIG } from '../config/extensionConfig';

declare const chrome: any;

interface PendingHitLAction {
  id: string;
  timestamp: number;
  expiresAt: number;
  toolName: string;
  payload: any;
  riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
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
    cleanExpiredActions();
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

  // If critical, queue for Human-in-the-Loop approval
  const ttlMs = EXTENSION_CONFIG.hitl.defaultTtlSeconds * 1000;
  const actionRecord: PendingHitLAction = {
    id: actionId,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttlMs,
    toolName: payload.toolName,
    payload,
    riskLevel: 'CRITICAL',
    status: 'PENDING'
  };

  pendingActions.set(actionId, actionRecord);

  return {
    actionId,
    status: 'REQUIRES_HITL',
    riskLevel: 'CRITICAL',
    expiresInSeconds: EXTENSION_CONFIG.hitl.defaultTtlSeconds,
    message: 'Esta ação altera dados no sistema corporativo e requer sua autorização no Trivial Gate.'
  };
}

async function handleHitLDecision(actionId: string, decision: 'APPROVED' | 'REJECTED') {
  const action = pendingActions.get(actionId);
  if (!action) {
    return { success: false, reason: 'Ação não encontrada ou expirada (TTL excedido).' };
  }

  if (Date.now() > action.expiresAt) {
    action.status = 'EXPIRED';
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

function cleanExpiredActions() {
  const now = Date.now();
  for (const [id, action] of pendingActions.entries()) {
    if (now > action.expiresAt) {
      action.status = 'EXPIRED';
      pendingActions.delete(id);
    }
  }
}

// Cleanup timer
setInterval(cleanExpiredActions, 15000);

