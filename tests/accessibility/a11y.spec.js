import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes, conditionSlugs, conditionRoute } from '../helpers/selectors.js';

test.describe('TC-A11Y | Accessibility', () => {
  for (const [name, route] of [
    ['home', routes.home],
    ['symptoms', routes.symptoms],
    ['conditions', routes.conditions],
    ['products', routes.products],
    ['about', routes.about],
  ]) {
    test(`TC-A11Y-001 | ${name} has no critical axe violations`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const critical = results.violations.filter((v) => v.impact === 'critical');
      expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
    });
  }

  test('TC-A11Y-002 | Symptom Checker controls are keyboard reachable', async ({ page }) => {
    await page.goto(routes.symptoms);
    for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
    const active = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT'].includes(active || '')).toBeTruthy();
  });

  test('TC-A11Y-003 | Condition pages have logical heading order', async ({ page }) => {
    for (const slug of conditionSlugs) {
      await page.goto(conditionRoute(slug));
      const levels = await page.locator('h1, h2, h3').evaluateAll((els) =>
        els.map((e) => Number(e.tagName.slice(1)))
      );
      // No jump from h1 to h3 (h2 skipped)
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1], `${slug} skipped heading`).toBeLessThanOrEqual(1);
      }
    }
  });

  test('TC-A11Y-004 | Images have alternative text', async ({ page }) => {
    await page.goto(routes.home);
    const imgs = page.locator('img');
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute('alt');
      expect(alt !== null, `img #${i} missing alt`).toBeTruthy();
    }
  });
});
