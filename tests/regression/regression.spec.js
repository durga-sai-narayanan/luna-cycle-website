import { test, expect } from '@playwright/test';
import { routes, conditionSlugs, conditionRoute } from '../helpers/selectors.js';
import { loadFixture } from '../helpers/loadFixture.js';

const expectedSections = loadFixture('conditions.json').expectedSections;

/**
 * Regression — the most important workflows, kept runnable after future changes.
 */
test.describe('TC-REG | Regression suite', () => {
  test('TC-REG-001 | Home renders hero + feature cards', async ({ page }) => {
    await page.goto(routes.home);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.locator('a[href="/symptoms"]').count()).toBeGreaterThan(0);
  });

  test('TC-REG-002 | Condition Explorer lists all conditions', async ({ page }) => {
    await page.goto(routes.conditions);
    for (const slug of conditionSlugs) {
      expect(await page.locator(`a[href="/conditions/${slug}"]`).count()).toBeGreaterThan(0);
    }
  });

  test('TC-REG-003 | Condition search returns a result', async ({ page }) => {
    await page.goto(routes.conditions);
    await page.getByPlaceholder('Search conditions…').fill('pcos');
    expect(await page.locator('a[href="/conditions/pcos"]').count()).toBeGreaterThan(0);
  });

  test('TC-REG-004 | Condition page renders all sections', async ({ page }) => {
    await page.goto(conditionRoute('endometriosis'));
    const body = await page.locator('body').innerText();
    for (const section of expectedSections) {
      expect(body, `missing section: ${section}`).toContain(section);
    }
  });

  test('TC-REG-005 | Symptom Checker produces results', async ({ page }) => {
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    await page.getByRole('button', { name: /Pelvic pain/ }).click();
    await page.getByRole('button', { name: /Heavy bleeding/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    await expect(page.getByText(/Conditions with overlapping symptoms/)).toBeVisible();
  });

  test('TC-REG-006 | Product Science tabs switch', async ({ page }) => {
    await page.goto(routes.products);
    await expect(page.getByText(/Product Science/).first()).toBeVisible();
    // Evidence legend present
    await expect(page.getByText(/Evidence status key/)).toBeVisible();
  });

  test('TC-REG-007 | Navigation across all primary routes', async ({ page }) => {
    for (const r of [routes.home, routes.symptoms, routes.products, routes.conditions, routes.about]) {
      await page.goto(r);
      expect(await page.locator('h1').first().innerText()).toBeTruthy();
    }
  });

  test('TC-REG-008 | Disclaimer present on key pages', async ({ page }) => {
    for (const r of [routes.home, routes.symptoms, routes.conditions]) {
      await page.goto(r);
      const body = (await page.locator('body').innerText()).toLowerCase();
      expect(body, `${r} missing disclaimer`).toContain('diagnosis');
    }
  });
});
