import { test, expect } from '@playwright/test';
import { routes } from '../helpers/selectors.js';

/**
 * Stability — repeated workflows to surface intermittent bugs.
 * Records successful vs failed repetitions.
 */
test.describe('TC-STAB | Stability', () => {
  test('TC-STAB-001 | 10 repeated symptom checker cycles stable', async ({ page }) => {
    let ok = 0;
    let fail = 0;
    for (let i = 0; i < 10; i++) {
      try {
        await page.goto(routes.symptoms);
        await page.getByRole('button', { name: 'Begin' }).click();
        await page.getByRole('button', { name: /Menstrual pain/ }).click();
        await page.getByRole('button', { name: 'See overlap' }).click();
        await expect(page.getByText(/Conditions with overlapping symptoms/)).toBeVisible();
        await page.getByRole('button', { name: 'Start over' }).click();
        ok++;
      } catch {
        fail++;
      }
    }
    expect(fail, `${fail}/10 cycles failed`).toBe(0);
    expect(ok).toBe(10);
  });

  test('TC-STAB-002 | 20 repeated navigations stable (no blank pages)', async ({ page }) => {
    const pages = [routes.home, routes.conditions, routes.symptoms, routes.products, routes.about];
    let blank = 0;
    for (let i = 0; i < 20; i++) {
      await page.goto(pages[i % pages.length]);
      const h1 = await page.locator('h1').first().innerText().catch(() => '');
      if (!h1.trim()) blank++;
    }
    expect(blank, `${blank} blank pages out of 20`).toBe(0);
  });
});
