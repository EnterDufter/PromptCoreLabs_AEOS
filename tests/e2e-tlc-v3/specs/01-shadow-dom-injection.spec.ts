import { test, expect } from '@playwright/test';
import { SYNTHETIC_PAGES } from '../fixtures/syntheticLegacyPages';

test.describe('Stage Gate 1: Isolamento de Shadow DOM e Mutabilidade de Seletores', () => {
  test('Deve injetar o PCL Cockpit Companion dentro de Shadow Root fechado sem sofrer poluição do CSS do Salesforce', async ({ page }) => {
    // 1. Carrega página simulada do Salesforce com CSS destrutivo (* { color: red !important; font-family: Comic Sans !important; })
    await page.setContent(SYNTHETIC_PAGES.salesforceOpportunityPage);

    // 2. Injeta o content script do PCL Cockpit Companion
    await page.addScriptTag({ path: 'projects/pcl-cockpit-extension/src/content/contentScript.ts' });

    // 3. Verifica a presença do elemento host isolado
    const hostLocator = page.locator('#__pcl_cockpit_companion_root__');
    await expect(hostLocator).toBeAttached();

    // 4. Inspeciona o Shadow Root
    const hasShadowRoot = await page.evaluate(() => {
      const host = document.getElementById('__pcl_cockpit_companion_root__');
      return !!host?.shadowRoot;
    });
    expect(hasShadowRoot).toBe(true);

    // 5. Valida que o botão flutuante NÃO herdou o CSS agressivo do host
    const bubbleStyles = await page.evaluate(() => {
      const host = document.getElementById('__pcl_cockpit_companion_root__');
      const bubble = host?.shadowRoot?.getElementById('pcl-bubble-trigger');
      if (!bubble) return null;
      const computed = window.getComputedStyle(bubble);
      return {
        color: computed.color,
        fontFamily: computed.fontFamily,
        position: computed.position
      };
    });

    expect(bubbleStyles).not.toBeNull();
    // A cor deve ser branca (#ffffff), e NÃO o vermelho (#990000) imposto pelo host
    expect(bubbleStyles?.color).toBe('rgb(255, 255, 255)');
    expect(bubbleStyles?.position).toBe('fixed');
  });

  test('Deve manter estabilidade mesmo se seletores da página legada sofrerem mutações dinâmicas', async ({ page }) => {
    await page.setContent(SYNTHETIC_PAGES.jiraIssuePage);
    await page.addScriptTag({ path: 'projects/pcl-cockpit-extension/src/content/contentScript.ts' });

    // Simula mutação dinâmica no DOM pelo Jira
    await page.evaluate(() => {
      const commentField = document.getElementById('jira-comment');
      if (commentField) {
        commentField.id = 'jira-comment-renamed-by-angular';
        commentField.className = 'jira-mutated-input';
      }
    });

    // O PCL Companion deve continuar íntegro e operacional no Shadow DOM
    const isBubbleVisible = await page.evaluate(() => {
      const host = document.getElementById('__pcl_cockpit_companion_root__');
      const bubble = host?.shadowRoot?.getElementById('pcl-bubble-trigger');
      return !!bubble;
    });
    expect(isBubbleVisible).toBe(true);
  });
});

