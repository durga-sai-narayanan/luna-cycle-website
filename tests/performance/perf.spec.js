import { test, expect } from '@playwright/test';
import { routes, conditionSlugs, conditionRoute } from '../helpers/selectors.js';

test.describe('TC-PERF | Performance', () => {
  test('TC-PERF-001 | Home LCP under 2.5s', async ({ page }) => {
    await page.goto(routes.home);
    const lcp = await page.evaluate(() =>
      new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length) resolve(entries[entries.length - 1].startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => resolve(-1), 5000);
      })
    );
    expect(lcp, `LCP ${lcp}ms`).toBeLessThan(2500);
  });

  test('TC-PERF-002 | Symptom Checker interaction under 500ms', async ({ page }) => {
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    const start = Date.now();
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    await page.getByText(/Conditions with overlapping symptoms/).waitFor({ timeout: 5000 });
    const elapsed = Date.now() - start;
    expect(elapsed, `interaction took ${elapsed}ms`).toBeLessThan(500);
  });

  for (const slug of conditionSlugs) {
    test(`TC-PERF-003 | ${slug} page load under 1.5s`, async ({ page }) => {
      const start = Date.now();
      await page.goto(conditionRoute(slug));
      await page.locator('h1').first().waitFor({ timeout: 5000 });
      const elapsed = Date.now() - start;
      expect(elapsed, `${slug} took ${elapsed}ms`).toBeLessThan(1500);
    });
  }
});
