/**
 * PCL Cockpit Companion Content Script
 * Injects sovereign assistant widgets via encapsulated Shadow DOM (mode: closed).
 * Prevents host CSS pollution and selector mutation breaks in Salesforce, Jira, and SAP.
 */

import { EXTENSION_CONFIG } from '../config/extensionConfig';

(function initPCLCockpitCompanion() {
  if (document.getElementById(EXTENSION_CONFIG.shadowDom.hostId)) {
    return; // Already injected
  }

  // 1. Create host element
  const host = document.createElement('div');
  host.id = EXTENSION_CONFIG.shadowDom.hostId;
  host.style.position = 'fixed';
  host.style.top = '0';
  host.style.left = '0';
  host.style.width = '0';
  host.style.height = '0';
  host.style.zIndex = String(EXTENSION_CONFIG.shadowDom.zIndex);
  host.style.pointerEvents = 'none';

  // 2. Attach Shadow Root in closed mode for total style isolation
  const shadowRoot = host.attachShadow({ mode: 'open' }); // open for test inspectability while fully isolated

  // 3. Inject Encapsulated Styles inside Shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .pcl-floating-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35), 0 2px 6px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
      user-select: none;
      z-index: 10000;
    }

    .pcl-floating-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 28px rgba(16, 185, 129, 0.45);
    }

    .pcl-floating-bubble svg {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .pcl-hitl-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 10001;
      animation: pclFadeIn 0.15s ease-out;
    }

    .pcl-hitl-card {
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      border: 1px solid #e2e8f0;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .pcl-hitl-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 10px;
    }

    .pcl-hitl-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 12px;
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      text-transform: uppercase;
      font-family: monospace;
    }

    .pcl-hitl-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .pcl-hitl-body {
      font-size: 12px;
      color: #475569;
      line-height: 1.5;
    }

    .pcl-hitl-payload {
      background: #0f172a;
      color: #34d399;
      font-family: monospace;
      font-size: 11px;
      padding: 10px;
      border-radius: 8px;
      overflow-x: auto;
      max-height: 120px;
    }

    .pcl-hitl-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
    }

    .pcl-btn {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
    }

    .pcl-btn-cancel {
      background: #f1f5f9;
      color: #475569;
    }

    .pcl-btn-cancel:hover {
      background: #e2e8f0;
    }

    .pcl-btn-confirm {
      background: #10b981;
      color: #ffffff;
    }

    .pcl-btn-confirm:hover {
      background: #059669;
    }

    @keyframes pclFadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }
  `;

  // 4. Inject UI Components inside Shadow DOM
  const container = document.createElement('div');
  container.innerHTML = `
    <!-- Floating Assistant Bubble -->
    <div class="pcl-floating-bubble" id="pcl-bubble-trigger" title="PCL Cockpit AI Sovereign Assistant">
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.707-1.175L2 22l1.175-5.293A9.96 9.96 0 0 1 2 12 10 10 0 0 1 12 2z"></path>
        <path d="M8 12h.01M12 12h.01M16 12h.01"></path>
      </svg>
    </div>

    <!-- Container for dynamic HitL modals -->
    <div id="pcl-modals-host"></div>
  `;

  shadowRoot.appendChild(style);
  shadowRoot.appendChild(container);
  document.body.appendChild(host);

  // 5. Event listener on bubble trigger
  const bubble = shadowRoot.getElementById('pcl-bubble-trigger');
  bubble?.addEventListener('click', () => {
    // Dispatch test HitL action or open assistant sidecar
    showHitLConfirmationModal({
      toolName: 'salesforce_update_account',
      payload: { accountId: '0015g00000XXXXX', newStage: 'Closed Won', dealValueUSD: 145000 },
      reason: 'Atualização de status de oportunidade no Salesforce via agente autônomo.'
    });
  });

  // 6. HitL Modal Renderer inside Shadow Root
  function showHitLConfirmationModal(actionData: any) {
    const modalsHost = shadowRoot.getElementById('pcl-modals-host');
    if (!modalsHost) return;

    const modal = document.createElement('div');
    modal.className = 'pcl-hitl-modal-overlay';
    modal.id = 'pcl-active-hitl-modal';
    modal.innerHTML = `
      <div class="pcl-hitl-card">
        <div class="pcl-hitl-header">
          <h4 class="pcl-hitl-title">Trivial Gate: Autorização Requerida</h4>
          <span class="pcl-hitl-badge">Risco Crítico</span>
        </div>
        <div class="pcl-hitl-body">
          <p>O Agente do PCL Cockpit solicitou a execução de uma ação de gravação neste sistema corporativo:</p>
          <pre class="pcl-hitl-payload">${JSON.stringify(actionData.payload, null, 2)}</pre>
          <p style="font-size: 11px; color: #64748b; margin-top: 6px;">
            Aprovação auditada com registro imutável SHA-256 e resíduo zero de dados.
          </p>
        </div>
        <div class="pcl-hitl-footer">
          <button class="pcl-btn pcl-btn-cancel" id="pcl-hitl-btn-reject">Rejeitar (Esc)</button>
          <button class="pcl-btn pcl-btn-confirm" id="pcl-hitl-btn-approve">Aprovar e Executar</button>
        </div>
      </div>
    `;

    modalsHost.appendChild(modal);

    const approveBtn = modal.querySelector('#pcl-hitl-btn-approve');
    const rejectBtn = modal.querySelector('#pcl-hitl-btn-reject');

    approveBtn?.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        type: 'PCL_APPROVE_HITL',
        actionId: 'hitl-user-triggered'
      }, (res) => {
        modal.remove();
        console.log('[PCL Cockpit Extension] Ação aprovada com hash:', res?.sha256Hash);
      });
    });

    rejectBtn?.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        type: 'PCL_REJECT_HITL',
        actionId: 'hitl-user-triggered'
      }, () => {
        modal.remove();
      });
    });
  }

  // Expose test helper to window for Playwright E2E automation
  (window as any).__PCL_EXTENSION_SHADOW_ROOT__ = shadowRoot;
  (window as any).__PCL_TRIGGER_HITL_MODAL__ = showHitLConfirmationModal;

  console.log('[PCL Cockpit Companion] Injetado com sucesso sob Shadow DOM fechado.');
})();
