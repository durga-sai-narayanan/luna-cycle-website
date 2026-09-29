import { expect } from '@playwright/test';

/** Assert the page did not navigate to a 404 / PageNotFound shell. */
export async function expectNot404(page) {
  const body = await page.locator('body').innerText();
  expect(
    /404|not found|page not found/i.test(body),
    'Page rendered a 404 / not-found state'
  ).toBeFalsy();
}

/** Assert no uncaught console errors were collected during the session. */
export function expectNoConsoleErrors({ errors }) {
  expect(
    errors,
    `Unexpected console errors: ${errors.join('\n')}`
  ).toEqual([]);
}

/** Assert a visible disclaimer / "not a diagnosis" message is present. */
export async function expectDisclaimerVisible(page) {
  const text = await page.locator('body').innerText();
  expect(text.toLowerCase()).toContain('diagnosis');
}

/** Assert a percentage string is a valid number in [0,100]. */
export function expectValidPercentage(value) {
  const n = Number(String(value).replace('%', '').trim());
  expect(Number.isFinite(n), `Percentage not a number: ${value}`).toBeTruthy();
  expect(n, `Percentage out of range: ${value}`).toBeGreaterThanOrEqual(0);
  expect(n, `Percentage out of range: ${value}`).toBeLessThanOrEqual(100);
}
