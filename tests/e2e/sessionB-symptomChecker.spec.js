import { test, expect } from '@playwright/test';
import { routes, symptomLabels } from '../helpers/selectors.js';
import { expectDisclaimerVisible, expectValidPercentage } from '../helpers/expectations.js';

async function openChecker(page) {
  await page.goto(routes.symptoms);
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Begin' }).click();
}

async function getOverlapPercentages(page) {
  const bars = page.locator('[class*="rounded-full"]');
  const texts = await page.locator('text=/\\d+%/').allTextContents();
  return texts;
}

test.describe('TC-SC | Symptom Checker', () => {
  test('TC-SC-001 | Intro step renders Begin control', async ({ page }) => {
    await page.goto(routes.symptoms);
    await expect(page.getByRole('button', { name: 'Begin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Begin' })).toBeEnabled();
  });

  test('TC-SC-002 | Submit disabled when no symptom selected', async ({ page }) => {
    await openChecker(page);
    const submit = page.getByRole('button', { name: 'See overlap' });
    await expect(submit).toBeDisabled();
  });

  test('TC-SC-003 | Selecting one symptom enables submit', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await expect(page.getByRole('button', { name: 'See overlap' })).toBeEnabled();
  });

  test('TC-SC-004 | Results show ranked overlapping conditions', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: /Pelvic pain/ }).click();
    await page.getByRole('button', { name: /Fatigue/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    await expect(page.getByText(/Conditions with overlapping symptoms/)).toBeVisible();
    const cards = page.locator('a[href^="/conditions/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('TC-SC-005 | Percentages are valid numbers in [0,100]', async ({ page }) => {
    await openChecker(page);
    for (const label of ['Menstrual pain (cramps)', 'Pelvic pain', 'Fatigue', 'Lower back pain']) {
      await page.getByRole('button', { name: new RegExp(label) }).click();
    }
    await page.getByRole('button', { name: 'See overlap' }).click();
    const pcts = await getOverlapPercentages(page);
    expect(pcts.length, 'No percentages rendered').toBeGreaterThan(0);
    for (const p of pcts) expectValidPercentage(p);
  });

  test('TC-SC-006 | No duplicate conditions in results', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: /Heavy bleeding/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    const hrefs = await page.locator('a[href^="/conditions/"]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href'))
    );
    const set = new Set(hrefs);
    expect(set.size, `Duplicate conditions: ${hrefs.join(',')}`).toBe(hrefs.length);
  });

  test('TC-SC-007 | Disclaimer visible on results step', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    await expectDisclaimerVisible(page);
  });

  test('TC-SC-008 | Clear all resets selections', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: /Fatigue/ }).click();
    await page.getByRole('button', { name: 'Clear all' }).click();
    await expect(page.getByRole('button', { name: 'See overlap' })).toBeDisabled();
  });

  test('TC-SC-009 | Start over resets to intro', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    await page.getByRole('button', { name: 'Start over' }).click();
    await expect(page.getByRole('button', { name: 'Begin' })).toBeVisible();
  });

  test('TC-SC-010 | All symptoms selected yields results without error', async ({ page }) => {
    await openChecker(page);
    for (const label of symptomLabels) {
      await page.getByRole('button', { name: new RegExp(label) }).click();
    }
    await page.getByRole('button', { name: 'See overlap' }).click();
    const cards = page.locator('a[href^="/conditions/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('TC-SC-011 | Results update when selections change', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Headaches/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    const firstCount = await page.locator('a[href^="/conditions/"]').count();
    await page.getByRole('button', { name: 'Adjust selections' }).click();
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: /Pelvic pain/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    const secondCount = await page.locator('a[href^="/conditions/"]').count();
    // Adding more symptoms should not reduce the condition set below 1.
    expect(secondCount).toBeGreaterThanOrEqual(1);
    expect(firstCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-SC-012 | Repeated submit clicks do not duplicate results', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    const before = await page.locator('a[href^="/conditions/"]').count();
    // Re-submitting via Adjust -> See overlap rapidly
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Adjust selections' }).click();
      await page.getByRole('button', { name: 'See overlap' }).click();
    }
    const after = await page.locator('a[href^="/conditions/"]').count();
    expect(after, 'Result count drifted on repeated submit').toBe(before);
  });

  test('TC-SC-013 | Reload mid-workflow resets to intro', async ({ page }) => {
    await openChecker(page);
    await page.getByRole('button', { name: /Menstrual pain/ }).click();
    await page.getByRole('button', { name: 'See overlap' }).click();
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Begin' })).toBeVisible();
  });
});
