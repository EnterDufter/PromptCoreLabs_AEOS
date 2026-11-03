import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const extensionPath = path.resolve(__dirname, '../../projects/pcl-cockpit-extension');

export default defineConfig({
  testDir: './specs',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false, // Execução sequencial para auditoria estrita TLC v3
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/tlc-v3-html-report', open: 'never' }],
    ['json', { outputFile: 'test-results/tlc-v3-audit-report.json' }]
  ],
  use: {
    headless: false, // Chrome extensions requerem headless: false no Chromium
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 }
  },
  projects: [
    {
      name: 'Chromium-PCL-Extension',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]
        }
      }
    }
  ]
});

