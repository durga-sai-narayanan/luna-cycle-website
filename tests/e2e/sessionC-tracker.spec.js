import { test, expect } from '@playwright/test';
import { routes } from '../helpers/selectors.js';

/**
 * Session C — Health Tracker.
 * The tracker is behind ProtectedRoute. Without a saved auth session these
 * CRUD tests are BLOCKED (not FAIL). The gating test itself runs unauthenticated.
 */

const STORAGE = process.env.LUNA_STORAGE_STATE;

test.describe('TC-PT | Health Tracker', () => {
  test('TC-PT-001 | Unauthenticated tracker is gated', async ({ page }) => {
    await page.goto(routes.tracker);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(routes.login);
  });

  // The following tests require an authenticated session.
  // Without LUNA_STORAGE_STATE they register as skipped (BLOCKED), not failed.

  (STORAGE ? test : test.skip)('TC-PT-002 | Log-a-day modal opens and closes', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    await page.getByRole('button', { name: 'Log a day' }).click();
    await expect(page.getByRole('heading', { name: 'Log a day' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Log a day' })).toBeHidden();
    await ctx.close();
  });

  (STORAGE ? test : test.skip)('TC-PT-003 | Create entry persists in timeline', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    await page.getByRole('button', { name: 'Log a day' }).click();
    await page.getByLabel('Date').fill('2026-09-15');
    await page.getByRole('button', { name: 'Save entry' }).click();
    await expect(page.getByText('Sep 15')).toBeVisible();
    await ctx.close();
  });

  (STORAGE ? test : test.skip)('TC-PT-004 | Delete entry removes from timeline', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    const before = await page.locator('text=/Sep 15/').count();
    if (before === 0) {
      await ctx.close();
      test.skip(true, 'No entry to delete');
    }
    await page.locator('button[aria-label="Remove"]').first().click();
    await expect(page.locator('text=/Sep 15/')).toHaveCount(Math.max(0, before - 1));
    await ctx.close();
  });

  (STORAGE ? test : test.skip)('TC-PT-005 | Calendar navigation across months', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    const initial = await page.locator('text=/^[A-Z][a-z]+ \d{4}$/').first().innerText();
    await page.getByRole('button', { name: '›' }).click();
    const next = await page.locator('text=/^[A-Z][a-z]+ \d{4}$/').first().innerText();
    expect(initial).not.toEqual(next);
    await ctx.close();
  });

  (STORAGE ? test : test.skip)('TC-PT-006 | Boundary entry all-zero saves', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    await page.getByRole('button', { name: 'Log a day' }).click();
    // leave all sliders at 0 by not moving them; set date
    await page.getByLabel('Date').fill('2026-09-16');
    await page.getByRole('button', { name: 'Save entry' }).click();
    await expect(page.getByText('Sep 16')).toBeVisible();
    await ctx.close();
  });

  (STORAGE ? test : test.skip)('TC-PT-007 | Future date handled gracefully', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    await page.getByRole('button', { name: 'Log a day' }).click();
    await page.getByLabel('Date').fill('2099-12-31');
    await page.getByRole('button', { name: 'Save entry' }).click();
    // No crash: timeline still renders
    await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();
    await ctx.close();
  });
});
