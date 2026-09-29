import { defineConfig, devices } from '@playwright/test';

/**
 * LunaCycle automated test suite — Playwright configuration.
 *
 * This config targets the LunaCycle app WITHOUT modifying it.
 * It launches the Vite dev server (or reuses one already running) and points
 * all specs at http://localhost:5173.
 *
 * Adjust BASE_URL / webServer.port below if your dev server runs elsewhere.
 */

const BASE_URL = process.env.LUNA_BASE_URL || 'http://localhost:5173';
const REPORT_DIR = 'test-results/latest';

export default defineConfig({
  testDir: '../',
  // Only pick up *.spec.js / *.spec.jsx files under tests/
  testMatch: /.*\.spec\.(js|jsx)$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: `${REPORT_DIR}/html`, open: 'never' }],
    ['json', { outputFile: `${REPORT_DIR}/results.json` }],
    ['junit', { outputFile: `${REPORT_DIR}/junit.xml` }],
  ],
  outputDir: `${REPORT_DIR}/artifacts`,
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    viewport: { width: 1280, height: 900 },
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'tablet-1004',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1004, height: 1366 },
      },
      testIgnore: /accessibility\/.*/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    cwd: '..',
  },
});
