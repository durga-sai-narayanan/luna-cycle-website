import { test, expect } from '@playwright/test';
import { routes } from '../helpers/selectors.js';

const STORAGE = process.env.LUNA_STORAGE_STATE;

/**
 * Tracker edge cases. All require an authenticated session; without one they
 * are SKIPPED (treated as BLOCKED) rather than reported as LunaCycle failures.
 */
const maybe = STORAGE ? test : test.skip;

test.describe('TC-PT-EDGE | Tracker edge cases', () => {
  maybe('TC-PT-E01 | Same-day duplicate entries allowed without crash', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    for (const _ of [1, 2]) {
      await page.getByRole('button', { name: 'Log a day' }).click();
      await page.getByLabel('Date').fill('2026-09-20');
      await page.getByRole('button', { name: 'Save entry' }).click();
    }
    await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();
    await ctx.close();
  });

  maybe('TC-PT-E02 | Rapid repeated log clicks do not duplicate the modal', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    await page.getByRole('button', { name: 'Log a day' }).click({ clickCount: 3 });
    await expect(page.getByRole('heading', { name: 'Log a day' })).toHaveCount(1);
    await ctx.close();
  });

  maybe('TC-PT-E03 | Refresh persists entries (localStorage)', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    await page.getByRole('button', { name: 'Log a day' }).click();
    await page.getByLabel('Date').fill('2026-09-21');
    await page.getByRole('button', { name: 'Save entry' }).click();
    await page.reload();
    await expect(page.getByText('Sep 21')).toBeVisible();
    await ctx.close();
  });

  maybe('TC-PT-E04 | Navigate away and back preserves data', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE });
    const page = await ctx.newPage();
    await page.goto(routes.tracker);
    await page.getByRole('button', { name: 'Log a day' }).click();
    await page.getByLabel('Date').fill('2026-09-22');
    await page.getByRole('button', { name: 'Save entry' }).click();
    await page.goto(routes.home);
    await page.goto(routes.tracker);
    await expect(page.getByText('Sep 22')).toBeVisible();
    await ctx.close();
  });
});
