import { routes, nav } from './selectors.js';

/**
 * Helpers that drive realistic multi-step user sessions.
 * Each session returns to a clean state at the end.
 */

export async function gotoHome(page) {
  await page.goto(routes.home);
  await page.waitForLoadState('networkidle');
}

export async function navigateViaNavbar(page, name) {
  await page.getByRole('link', nav[name]).first().click();
  await page.waitForLoadState('networkidle');
}

export async function openSymptomChecker(page) {
  await page.goto(routes.symptoms);
  await page.waitForLoadState('networkidle');
}

export async function openConditions(page) {
  await page.goto(routes.conditions);
  await page.waitForLoadState('networkidle');
}

export async function openTracker(page) {
  await page.goto(routes.tracker);
  await page.waitForLoadState('networkidle');
}

export async function openProducts(page) {
  await page.goto(routes.products);
  await page.waitForLoadState('networkidle');
}

/** Collect every console message and page error emitted during a session. */
export function attachConsoleCollector(page) {
  const messages = [];
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
    messages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return { messages, errors };
}

/** Click the "Begin" / "See overlap" / "Start over" flow controls by visible text. */
export async function clickByText(page, text) {
  await page.getByRole('button', { name: text }).click();
}
