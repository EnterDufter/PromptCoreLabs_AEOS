import { test, expect } from '@playwright/test';

async function interceptVaultWrites(page: import('@playwright/test').Page) {
  await page.route('**/api/aeos/cockpit/sync', (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }
    return route.continue();
  });
}

test.describe('Suite 4.2: Regressões Visuais, Agrupamento Temporal, Help Center, Auth & Simulações', () => {
  test('Central de Ajuda exibe porta :20130 (zero :8000) e filtra busca ao vivo', async ({ page }) => {
    await interceptVaultWrites(page);

    await page.goto('/');
    await page.getByRole('button', { name: 'Central de Ajuda' }).click();

    const searchInput = page.getByPlaceholder(/Pesquisar tópico ou parâmetro/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('20130');
    const searchResults = page.getByTestId('help-search-results');
    await expect(searchResults).toBeVisible();
    await expect(searchResults).toContainText('OmniRoute');

    await page.getByTestId('help-search-hit-t-ports').click();
    await expect(page.getByText('Troubleshooting & Matriz de Portas Locais')).toBeVisible();
    await expect(page.getByText(':20130').first()).toBeVisible();

    const modalText = await page.locator('body').innerText();
    expect(modalText).not.toContain(':8000');

    await searchInput.fill('termo-totalmente-inexistente-e2e');
    await expect(page.getByTestId('help-search-empty')).toBeVisible();
  });

  test('Sidebar agrupa conversas em Hoje, Ontem e Últimos 7 dias por updatedAt e limpa RightSidebar', async ({ page }) => {
    const now = Date.now();
    const seededState = {
      ok: true,
      activeConversationId: 'e2e-today',
      openConversationIds: ['e2e-today'],
      updatedAt: new Date(now).toISOString(),
      projects: [
        {
          id: 'e2e-proj',
          name: 'Projeto E2E Cronologia',
          conversationsCount: 3,
          activeAgentsCount: 1,
          conversations: [
            {
              id: 'e2e-today',
              title: 'Conversa E2E Hoje',
              updatedAt: new Date(now - 30 * 60 * 1000).toISOString(),
              messages: [{ id: 'm1', sender: 'user', senderName: 'Eduardo', timestamp: '10:00', text: 'Oi hoje' }]
            },
            {
              id: 'e2e-yesterday',
              title: 'Conversa E2E Ontem',
              updatedAt: new Date(now - 26 * 3600 * 1000).toISOString(),
              messages: [{ id: 'm2', sender: 'user', senderName: 'Eduardo', timestamp: 'Ontem', text: 'Oi ontem' }]
            },
            {
              id: 'e2e-week',
              title: 'Conversa E2E 4 Dias',
              updatedAt: new Date(now - 4 * 24 * 3600 * 1000).toISOString(),
              messages: [{ id: 'm3', sender: 'user', senderName: 'Eduardo', timestamp: '4d', text: 'Oi 4d' }]
            }
          ]
        }
      ]
    };

    await page.route('**/api/aeos/cockpit/sync', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(seededState) });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });

    await page.goto('/');

    await expect(page.getByText('Conversa E2E Hoje')).toBeVisible();
    await expect(page.locator('aside button', { hasText: 'Ontem' }).first()).toContainText('1');
    await expect(page.locator('aside button', { hasText: 'Últimos 7 dias' }).first()).toContainText('1');

    // Garante que acordeões "Ontem" e "Últimos 7 dias" estejam expandidos e visíveis
    if (!(await page.getByText('Conversa E2E Ontem').isVisible())) {
      await page.locator('aside button', { hasText: 'Ontem' }).first().click();
    }
    await expect(page.getByText('Conversa E2E Ontem')).toBeVisible();

    if (!(await page.getByText('Conversa E2E 4 Dias').isVisible())) {
      await page.locator('aside button', { hasText: 'Últimos 7 dias' }).first().click();
    }
    await expect(page.getByText('Conversa E2E 4 Dias')).toBeVisible();

    // Valida RightSidebarStatus sem sessões mockadas de Companion Extension
    await page.getByRole('button', { name: /Telemetria & Status/i }).click();
    await page.getByRole('button', { name: /Extensões Injetadas/i }).click();
    await expect(page.getByTestId('companion-extensions-empty')).toBeVisible();
  });

  test('Dropdown de usuário mantém z-index acima do Inspetor em Fluxos e exibe badges de preview em Reuniões/Fluxos', async ({ page }) => {
    await interceptVaultWrites(page);

    await page.goto('/');

    // 1. Navega para Fluxos de Automação
    await page.getByRole('button', { name: /Fluxos de Automação/i }).first().click();
    await expect(page.getByTestId('flows-simulated-badge')).toBeVisible();

    // 2. Abre o slide-over inspector do nó à direita
    await page.locator('.node-card').first().click();
    await expect(page.locator('aside.inspector-panel')).toBeVisible();

    // 3. Abre dropdown do usuário e valida com elementFromPoint que está acima do drawer
    await page.locator('header').getByRole('button', { name: /Eduardo/i }).click();
    const logoutBtn = page.getByRole('button', { name: 'Encerrar Sessão Segura' });
    await expect(logoutBtn).toBeVisible();

    const box = await logoutBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const topMostText = await page.evaluate(({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        return el ? (el.textContent || '').trim() : '';
      }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
      expect(topMostText).toContain('Encerrar Sessão Segura');
    }

    // Fecha dropdown antes de trocar para Reuniões
    await page.locator('header').getByRole('button', { name: /Eduardo/i }).click();

    // 4. Navega para Reuniões & Atas e verifica banner de Modo Simulado
    await page.getByRole('button', { name: /Reuniões & Atas/i }).first().click();
    await expect(page.getByTestId('meetings-simulated-badge')).toBeVisible();
  });

  test('Logout exibe LoginScreen e trava de 2 dispositivos abre modal de resolução de conflito', async ({ page }) => {
    await interceptVaultWrites(page);

    await page.goto('/');

    await page.locator('header').getByRole('button', { name: /Eduardo/i }).click();
    await page.getByRole('button', { name: 'Encerrar Sessão Segura' }).click();

    await expect(page.getByText('Acesse a Cabine de Comando')).toBeVisible();

    // Aciona simulação de 3º dispositivo e verifica modal ISO 27001
    await page.getByRole('button', { name: /Simular Teste de 3º Dispositivo/i }).click();
    await expect(page.getByText('Limite de Dispositivos Concorrentes Atingido')).toBeVisible();

    // Resolve desconectando uma sessão e confirma reentrada no Cockpit
    await page.getByRole('button', { name: /Desconectar & Acessar/i }).first().click();
    await expect(page.locator('header').getByRole('button', { name: /Eduardo/i })).toBeVisible();
  });
});

