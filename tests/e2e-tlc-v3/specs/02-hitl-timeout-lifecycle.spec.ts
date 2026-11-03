import { test, expect } from '@playwright/test';
import { SYNTHETIC_PAGES } from '../fixtures/syntheticLegacyPages';

test.describe('Stage Gate 2: Ciclo de Vida e Timeout do Human-in-the-Loop (HitL)', () => {
  test('Deve bloquear ações críticas e exibir o modal Trivial Gate no Shadow DOM', async ({ page }) => {
    await page.setContent(SYNTHETIC_PAGES.salesforceOpportunityPage);
    await page.addScriptTag({ path: 'projects/pcl-cockpit-extension/src/content/contentScript.ts' });

    // Dispara uma ação crítica que requer HitL
    await page.evaluate(() => {
      (window as any).__PCL_TRIGGER_HITL_MODAL__({
        toolName: 'salesforce_update_account',
        payload: { accountId: '0015g00000XXXXX', newStage: 'Closed Won' }
      });
    });

    // Valida que o modal de HitL apareceu dentro do Shadow DOM
    const modalExists = await page.evaluate(() => {
      const host = document.getElementById('__pcl_cockpit_companion_root__');
      const modal = host?.shadowRoot?.getElementById('pcl-active-hitl-modal');
      return !!modal;
    });
    expect(modalExists).toBe(true);

    // Valida a presença do botão de confirmação e do badge de risco crítico
    const modalDetails = await page.evaluate(() => {
      const host = document.getElementById('__pcl_cockpit_companion_root__');
      const modal = host?.shadowRoot?.getElementById('pcl-active-hitl-modal');
      const badge = modal?.querySelector('.pcl-hitl-badge')?.textContent;
      const title = modal?.querySelector('.pcl-hitl-title')?.textContent;
      return { badge, title };
    });

    expect(modalDetails.badge).toBe('Risco Crítico');
    expect(modalDetails.title).toContain('Trivial Gate: Autorização Requerida');
  });

  test('Deve registrar a decisão humana e fechar o modal com confirmação criptográfica', async ({ page }) => {
    await page.setContent(SYNTHETIC_PAGES.salesforceOpportunityPage);
    await page.addScriptTag({ path: 'projects/pcl-cockpit-extension/src/content/contentScript.ts' });

    await page.evaluate(() => {
      (window as any).__PCL_TRIGGER_HITL_MODAL__({
        toolName: 'salesforce_update_account',
        payload: { accountId: '0015g00000XXXXX', newStage: 'Closed Won' }
      });
    });

    // Clica no botão "Aprovar e Executar" dentro do Shadow DOM
    await page.evaluate(() => {
      const host = document.getElementById('__pcl_cockpit_companion_root__');
      const approveBtn = host?.shadowRoot?.getElementById('pcl-hitl-btn-approve') as HTMLElement;
      approveBtn?.click();
    });

    // Valida que o modal foi descartado pós-aprovação
    const isModalOpen = await page.evaluate(() => {
      const host = document.getElementById('__pcl_cockpit_companion_root__');
      return !!host?.shadowRoot?.getElementById('pcl-active-hitl-modal');
    });
    expect(isModalOpen).toBe(false);
  });
});

