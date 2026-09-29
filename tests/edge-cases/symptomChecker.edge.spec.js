import { test, expect } from '@playwright/test';
import { routes, symptomLabels } from '../helpers/selectors.js';
import { attachConsoleCollector, expectNoConsoleErrors } from '../helpers/expectations.js';

test.describe('TC-SC-EDGE | Symptom Checker edge cases', () => {
  test('TC-SC-E01 | Zero symptoms — submit stays disabled', async ({ page }) => {
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    await expect(page.getByRole('button', { name: 'See overlap' })).toBeDisabled();
  });

  test('TC-SC-E02 | Single symptom — results render', async ({ page }) => {
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    await page.getByRole('button', { name: /Headaches/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    await expect(page.getByText(/Conditions with overlapping symptoms/)).toBeVisible();
  });

  test('TC-SC-E03 | Maximum symptoms — no crash, no console error', async ({ page }) => {
    const collector = attachConsoleCollector(page);
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    for (const label of symptomLabels) {
      await page.getByRole('button', { name: new RegExp(label) }).click();
    }
    await page.getByRole('button', { name: 'See overlap' }).click();
    await expect(page.getByText(/Conditions with overlapping symptoms/)).toBeVisible();
    expectNoConsoleErrors(collector);
  });

  test('TC-SC-E04 | Toggle a symptom off then submit', async ({ page }) => {
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: /Menstrual pain/ }).click(); // toggle off
    await expect(page.getByRole('button', { name: 'See overlap' })).toBeDisabled();
  });

  test('TC-SC-E05 | Rapid repeated symptom clicks keep selection count consistent', async ({ page }) => {
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    const btn = page.getByRole('button', { name: /Fatigue/ });
    for (let i = 0; i < 6; i++) await btn.click();
    // 6 toggles = net off (even count) -> submit disabled
    await expect(page.getByRole('button', { name: 'See overlap' })).toBeDisabled();
  });

  test('TC-SC-E06 | Results contain no impossible percentage >100', async ({ page }) => {
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    for (const label of symptomLabels.slice(0, 8)) {
      await page.getByRole('button', { name: new RegExp(label) }).click();
    }
    await page.getByRole('button', { name: 'See overlap' }).click();
    const pcts = await page.locator('text=/\\d+%/').allTextContents();
    for (const p of pcts) {
      const n = Number(p.replace('%', '').trim());
      expect(n, `impossible percentage ${p}`).toBeLessThanOrEqual(100);
    }
  });
});
