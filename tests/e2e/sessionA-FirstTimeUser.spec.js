import { test, expect } from '@playwright/test';
import { routes } from '../helpers/selectors.js';
import { attachConsoleCollector, expectNoConsoleErrors } from '../helpers/expectations.js';

/**
 * Session A — First-Time User
 * Home → Conditions → search → open condition → back → Symptom Checker →
 * select symptoms → submit → review → Tracker (gated).
 */
test('TC-E2E-A | First-time user journey', async ({ page }) => {
  const collector = attachConsoleCollector(page);

  await page.goto(routes.home);
  await expect(page.locator('h1')).toBeVisible();

  await page.getByRole('link', { name: 'Condition Explorer', exact: true }).first().click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain(routes.conditions);

  await page.getByPlaceholder('Search conditions…').fill('endometriosis');
  await page.locator('a[href="/conditions/endometriosis"]').first().click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('/conditions/endometriosis');
  await expect(page.locator('h1')).toBeVisible();

  await page.goBack();
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: 'Symptom Checker', exact: true }).first().click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'Begin' }).click();
  await page.getByRole('button', { name: /Menstrual pain/ }).click();
  await page.getByRole('button', { name: /Pelvic pain/ }).click();
  await page.getByRole('button', { name: 'See overlap' }).click();
  await expect(page.getByText(/Conditions with overlapping symptoms/)).toBeVisible();

  await page.getByRole('link', { name: 'Health Tracker', exact: true }).first().click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain(routes.login);

  expectNoConsoleErrors(collector);
});
