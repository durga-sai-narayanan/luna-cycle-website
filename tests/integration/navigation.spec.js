import { test, expect } from '@playwright/test';
import { allPublicRoutes, protectedRoutes } from '../helpers/routeInventory.js';
import { routes, nav, conditionSlugs, conditionRoute } from '../helpers/selectors.js';
import { attachConsoleCollector, expectNoConsoleErrors } from '../helpers/expectations.js';

test.describe('TC-NAV | Navigation', () => {
  for (const route of allPublicRoutes) {
    test(`TC-NAV-001 | ${route} loads without 404`, async ({ page }) => {
      const collector = attachConsoleCollector(page);
      const resp = await page.goto(route);
      expect(resp?.status(), `${route} returned non-200`).toBe(200);
      const heading = await page.locator('h1').first().innerText().catch(() => '');
      expect(heading.trim().length, `${route} rendered no h1`).toBeGreaterThan(0);
      expectNoConsoleErrors(collector);
    });
  }

  test('TC-NAV-002 | Navbar links navigate to correct route', async ({ page }) => {
    await page.goto(routes.home);
    for (const [name, expected] of [
      ['symptomChecker', routes.symptoms],
      ['products', routes.products],
      ['conditions', routes.conditions],
      ['about', routes.about],
      ['home', routes.home],
    ]) {
      await page.getByRole('link', nav[name]).first().click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(expected);
    }
  });

  test('TC-NAV-003 | Back/forward preserves rendering', async ({ page }) => {
    await page.goto(routes.conditions);
    await page.goto(routes.symptoms);
    await page.goBack();
    expect(page.url()).toContain(routes.conditions);
    const h1 = await page.locator('h1').first().innerText();
    expect(h1.trim().length).toBeGreaterThan(0);
    await page.goForward();
    expect(page.url()).toContain(routes.symptoms);
  });

  test('TC-NAV-004 | Unknown route shows PageNotFound (not blank)', async ({ page }) => {
    await page.goto('/no-such-route-xyz');
    const body = await page.locator('body').innerText();
    expect(/404|not found/i.test(body)).toBeTruthy();
  });

  test('TC-NAV-005 | Tracker redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto(routes.tracker);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(routes.login);
  });

  test('TC-NAV-006 | Every condition slug route loads its detail page', async ({ page }) => {
    for (const slug of conditionSlugs) {
      await page.goto(conditionRoute(slug));
      const h1 = await page.locator('h1').first().innerText();
      expect(h1.trim().length, `${slug} rendered no h1`).toBeGreaterThan(0);
    }
  });
});
