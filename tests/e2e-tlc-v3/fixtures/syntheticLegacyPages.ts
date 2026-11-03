/**
 * Synthetic Enterprise Mock Pages for TLC v3 Testing
 * Simulates legacy Salesforce, Jira, and Webmail DOM environments with aggressive host CSS.
 */

export const SYNTHETIC_PAGES = {
  salesforceOpportunityPage: `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Salesforce CRM - Opportunity #0015g00000XXXXX</title>
      <style>
        /* Aggressive legacy host styles that break unprotected injected overlays */
        * {
          color: #990000 !important;
          font-family: "Comic Sans MS", cursive, sans-serif !important;
        }
        body {
          margin: 40px !important;
          background: #f4f6f9;
        }
        .slds-input {
          width: 100%;
          padding: 10px;
          border: 2px solid #005fb2;
        }
      </style>
    </head>
    <body>
      <div id="salesforce-app-root">
        <h1>Salesforce Lightning Experience</h1>
        <div class="opportunity-card">
          <label for="deal-notes">Notas da Oportunidade (Acme Corp):</label>
          <textarea id="deal-notes" class="slds-input" rows="4">Cliente solicitou proposta com desconto de 15%.</textarea>
          <button id="save-deal-btn">Salvar Oportunidade</button>
        </div>
      </div>
    </body>
    </html>
  `,

  jiraIssuePage: `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Jira Software - PCL-9868</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .jira-field { margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <h2>[PCL-9868] Implementação de Trava Orçamentária EBITDA Shield</h2>
      <div class="jira-field">
        <label>Status do Ticket:</label>
        <span id="jira-status">IN PROGRESS</span>
      </div>
      <div class="jira-field">
        <textarea id="jira-comment" placeholder="Adicione um comentário no ticket..."></textarea>
      </div>
    </body>
    </html>
  `,

  hardenedCspPage: `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hardened Banking Portal (Strict CSP)</title>
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; connect-src 'self' http://localhost:3001 http://localhost:20130 http://localhost:20140; style-src 'self' 'unsafe-inline';">
    </head>
    <body>
      <h2>Portal de Governança Bancária</h2>
      <p>Página sob política severa de Content Security Policy (CSP Restrita).</p>
      <input type="text" id="bank-input" placeholder="Digite instrução de transferência..." />
    </body>
    </html>
  `
};

