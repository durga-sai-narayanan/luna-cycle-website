import { test, expect } from '@playwright/test';
import { routes } from '../helpers/selectors.js';
import { loadFixture } from '../helpers/loadFixture.js';

const terms = loadFixture('search-terms.json');

test.describe('TC-CE | Condition Explorer search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.conditions);
    await page.waitForLoadState('networkidle');
  });

  test('TC-CE-004 | Valid term filters list', async ({ page }) => {
    await page.getByPlaceholder('Search conditions…').fill('endometriosis');
    const cards = page.locator('a[href^="/conditions/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    // At least one card text mentions endometriosis
    const text = await page.locator('body').innerText();
    expect(text.toLowerCase()).toContain('endometriosis');
  });

  test('TC-CE-005 | Invalid term shows empty state', async ({ page }) => {
    await page.getByPlaceholder('Search conditions…').fill(terms.invalid[0]);
    const cards = page.locator('a[href^="/conditions/"]');
    await expect(cards).toHaveCount(0);
    const body = await page.locator('body').innerText();
    expect(/no conditions match/i.test(body)).toBeTruthy();
  });

  test('TC-CE-006 | Search is case-insensitive', async ({ page }) => {
    await page.getByPlaceholder('Search conditions…').fill('ENDOMETRIOSIS');
    const cards = page.locator('a[href^="/conditions/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CE-007 | Special characters do not crash search', async ({ page }) => {
    const collector = { errors: [] };
    page.on('pageerror', (e) => collector.errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && collector.errors.push(m.text()));
    await page.getByPlaceholder('Search conditions…').fill(terms.special[0]);
    await page.waitForTimeout(200);
    expect(collector.errors, `console errors on special chars`).toEqual([]);
  });

  test('TC-CE-006b | Partial term matches', async ({ page }) => {
    await page.getByPlaceholder('Search conditions…').fill('endo');
    const cards = page.locator('a[href^="/conditions/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('TC-CE-006c | Empty search restores full list', async ({ page }) => {
    const input = page.getByPlaceholder('Search conditions…');
    await input.fill('zzzz');
    await input.fill('');
    const cards = page.locator('a[href^="/conditions/"]');
    expect(await cards.count()).toBeGreaterThan(1);
  });
});
