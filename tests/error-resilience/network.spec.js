import { test, expect } from '@playwright/test';
import { routes, conditionSlugs, conditionRoute } from '../helpers/selectors.js';

/**
 * Error & resilience + security-oriented functional checks.
 * No destructive testing. Observes behavior only.
 */
test.describe('TC-ERR | Error & resilience', () => {
  test('TC-ERR-001 | Blocked API shows graceful state (no silent blank)', async ({ page }) => {
    // Simulate request failure by aborting all XHR/fetch; the public pages render
    // from static data so they should still show content, not a blank page.
    await page.route('**/*', (route) => {
      const req = route.request();
      if (['xhr', 'fetch'].includes(req.resourceType())) route.abort();
      else route.continue();
    });
    await page.goto(routes.home);
    const h1 = await page.locator('h1').first().innerText().catch(() => '');
    expect(h1.trim().length, 'Page went blank under failed requests').toBeGreaterThan(0);
  });

  test('TC-ERR-002 | No sensitive data in URL after interactions', async ({ page }) => {
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    await page.getByRole('button', { name: /Pelvic pain/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    const url = page.url();
    expect(url, 'symptom data leaked into URL').not.toMatch(/pain|bleeding|symptom/i);
  });

  test('TC-ERR-003 | Condition detail for unknown slug redirects to list', async ({ page }) => {
    await page.goto('/conditions/does-not-exist');
    await page.waitForLoadState('networkidle');
    // ConditionDetail returns <Navigate to="/conditions"> for unknown slug
    expect(page.url()).toContain(routes.conditions);
  });

  test('TC-ERR-004 | No console errors across all condition pages', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    for (const slug of conditionSlugs) {
      await page.goto(conditionRoute(slug));
    }
    expect(errors, `console errors: ${errors.join('\n')}`).toEqual([]);
  });
});

test.describe('TC-SEC | Security-oriented functional checks', () => {
  test('TC-SEC-001 | No health/symptom data persisted in URL across app', async ({ page }) => {
    await page.goto(routes.home);
    await page.goto(routes.symptoms);
    await page.getByRole('button', { name: 'Begin' }).click();
    await page.getByRole('button', { name: /Heavy bleeding/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    expect(page.url()).not.toMatch(/bleeding|pain|fatigue/i);
  });

  test('TC-SEC-002 | Protected route not reachable without auth', async ({ page }) => {
    await page.goto(routes.tracker);
    expect(page.url()).toContain(routes.login);
    // Manually navigating back to /tracker should bounce again
    await page.goto(routes.tracker);
    expect(page.url()).toContain(routes.login);
  });

  test('TC-SEC-003 | No sensitive keys in console logs on home', async ({ page }) => {
    const secrets = [];
    page.on('console', (m) => {
      if (/api[_-]?key|secret|token|password/i.test(m.text())) secrets.push(m.text());
    });
    await page.goto(routes.home);
    expect(secrets, `potential secrets logged: ${secrets.join('\n')}`).toEqual([]);
  });
});
