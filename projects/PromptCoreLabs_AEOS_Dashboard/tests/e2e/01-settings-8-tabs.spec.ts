import { test, expect, Page } from '@playwright/test';

async function openCockpitWithoutMutatingVault(page: Page) {
  await page.route('**/api/aeos/cockpit/sync', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, e2eIntercepted: true })
      });
      return;
    }
    await route.continue();
  });

  await page.goto('/');
  await expect(page.locator('header')).toBeVisible();
}

async function openSettingsFromHeader(page: Page) {
  await page.locator('header').getByRole('button', { name: /Eduardo/i }).click();
  await page.getByRole('button', { name: /Configurações do Sistema/i }).click();
  await expect(page.getByText('Painel Geral de Configurações & Governança')).toBeVisible();
}

test.describe('Suite 4.1: Settings 8 Tabs, Auto-Save, Live MCP & Zero Secret Persistence', () => {
  test('navega pelas 8 abas do SettingsModal sem console errors e valida Auto-Save', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedHttpUrls: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });
    page.on('response', (res) => {
      if (res.status() >= 400) {
        failedHttpUrls.push(`${res.status()} ${res.url()}`);
      }
    });

    await openCockpitWithoutMutatingVault(page);
    await openSettingsFromHeader(page);

    // 1. Verifica footer Auto-Save sem botões enganosos
    await expect(page.getByText(/Auto-Save em tempo real ativo/i)).toBeVisible();
    await expect(page.getByTestId('settings-close-footer')).toBeVisible();
    await expect(page.getByRole('button', { name: /Salvar Alterações/i })).toHaveCount(0);

    // 2. Navega nas 8 abas verificando renderização saudável
    const tabs = [
      'Geral & Idioma',
      'Segurança & Sessões',
      'Conexões & MCPs',
      'FinOps & Teto Orçamentário',
      'Squads & Agentes',
      'Gestor de Skills',
      'Audit ISO & Dossiê',
      'Criador No-Code'
    ];

    for (const label of tabs) {
      await page.getByRole('button', { name: label }).click();
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }

    // 3. Testa Auto-Save em Geral & Idioma e retorna para PT antes de sair
    await page.getByRole('button', { name: 'Geral & Idioma' }).click();
    await page.getByText('English (United States)').click();
    await expect(page.getByTestId('settings-autosave-toast')).toBeVisible();

    // Retorna para Português imediatamente para manter consistência de UI
    await page.getByText('Português (Brasil)').click();
    await expect(page.getByTestId('settings-autosave-toast')).toBeVisible();

    await page.getByTestId('settings-close-footer').click();
    await expect(page.getByText('Painel Geral de Configurações & Governança')).toBeHidden();

    expect(pageErrors, `Page errors: ${pageErrors.join(' | ')}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')} | HTTP>=400: ${failedHttpUrls.join(' | ')}`).toEqual([]);
  });

  test('executa diagnóstico real de MCP/infra, inspeciona Sovereign MCP e bloqueia segredos em localStorage', async ({ page }) => {
    await openCockpitWithoutMutatingVault(page);
    await openSettingsFromHeader(page);

    await page.getByRole('button', { name: 'Conexões & MCPs' }).click();

    // 1. Executa botão "Executar Diagnóstico Completo" conectado ao backend real
    await page.getByTestId('run-all-diagnostics-btn').click();
    const diagReport = page.getByTestId('diagnostics-report');
    await expect(diagReport).toBeVisible({ timeout: 25_000 });
    await expect(page.getByTestId('diagnostic-item-mcp-pcl-sovereign')).toContainText(/PASS/i);

    // 2. Inspeciona PCL Sovereign MCP via JSON-RPC stdio real
    await page.getByTestId('btn-inspect-mcp-pcl-sovereign').click();
    await expect(page.getByText(/HANDSHAKE STDIO REAL CONCLUÍDO/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('pcl_workspace_inventory', { exact: true })).toBeVisible();
    await expect(page.getByText('Schema Verificado').first()).toBeVisible();
    await page.getByRole('button', { name: 'Fechar Inspetor' }).click();
    await expect(page.getByRole('button', { name: 'Fechar Inspetor' })).toBeHidden();

    // 3. Adiciona servidor MCP customizado e confirma status honesto (Aguardando Handshake / 0 tools)
    await page.getByRole('button', { name: /Novo Servidor MCP/i }).click();
    await page.getByPlaceholder('ex: Local SQLite DB ou Corporate CRM MCP').fill('E2E Unverified MCP');
    await page.getByPlaceholder('npx, python, docker, etc.').fill('echo');
    await page.getByRole('button', { name: 'Salvar Servidor MCP' }).click();

    await expect(page.getByText('E2E Unverified MCP')).toBeVisible();
    await expect(page.getByText(/Aguardando Handshake/i).first()).toBeVisible();

    // 4. Configura conector SAP e valida que a chave secreta NÃO é gravada em texto claro no localStorage
    await page.getByPlaceholder('Buscar conector...').fill('SAP ERP');
    await page.getByRole('button', { name: /^Configurar$/i }).first().click();

    const secretToken = 'sap_live_sec_SUPER_SECRET_E2E_TOKEN';
    await page.getByPlaceholder('https://my-sap-instance.corp.company.com').fill('https://sap-e2e.corp.local');
    await page.getByPlaceholder('sap_live_sec_...').fill(secretToken);
    await page.getByPlaceholder('100').fill('100');
    await page.getByRole('button', { name: 'Salvar Credenciais no Cofre Local' }).click();

    const rawStoredConnectors = await page.evaluate(() => localStorage.getItem('pcl_configured_connectors') || '');
    expect(rawStoredConnectors).toContain('https://sap-e2e.corp.local');
    expect(rawStoredConnectors).not.toContain(secretToken);
    expect(rawStoredConnectors).toContain('apiKey_masked');
    expect(rawStoredConnectors).toContain('••••OKEN');
  });
});
