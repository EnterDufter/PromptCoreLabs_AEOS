import { test, expect } from '@playwright/test';
import { SYNTHETIC_PAGES } from '../fixtures/syntheticLegacyPages';

test.describe('Stage Gate 4: Bypass de Políticas Estritas de CSP e Hardened Chrome', () => {
  test('Deve operar normalmente dentro de portais bancários com Content Security Policy restrita', async ({ page }) => {
    const cspViolations: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text());
      }
    });

    // Carrega página corporativa restrita com meta CSP estrita
    await page.setContent(SYNTHETIC_PAGES.hardenedCspPage);

    // Injeta o content script
    await page.addScriptTag({ path: 'projects/pcl-cockpit-extension/src/content/contentScript.ts' });

    // O assistente deve montar dentro do Shadow DOM sem gerar violações de CSP
    const isMounted = await page.evaluate(() => {
      const host = document.getElementById('__pcl_cockpit_companion_root__');
      return !!host?.shadowRoot?.getElementById('pcl-bubble-trigger');
    });

    expect(isMounted).toBe(true);
    expect(cspViolations.length).toBe(0);
  });
});

