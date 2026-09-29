/**
 * Resilient, role-based selectors for LunaCycle.
 * These rely on visible text and semantic roles (not data-testid, which would
 * require modifying the app) so the suite stays an isolated external layer.
 */

export const nav = {
  home: { name: 'Home', exact: true },
  symptomChecker: { name: 'Symptom Checker', exact: true },
  tracker: { name: 'Health Tracker', exact: true },
  products: { name: 'Product Science', exact: true },
  conditions: { name: 'Condition Explorer', exact: true },
  about: { name: 'About', exact: true },
};

export const routes = {
  home: '/',
  symptoms: '/symptoms',
  tracker: '/tracker',
  products: '/products',
  conditions: '/conditions',
  about: '/about',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
};

/** Known condition slugs (mirrors src/data/conditions.js — not imported to keep tests hermetic). */
export const conditionSlugs = [
  'endometriosis',
  'adenomyosis',
  'uterine-fibroids',
  'pcos',
  'primary-dysmenorrhea',
];

export const symptomLabels = [
  'Menstrual pain (cramps)',
  'Pelvic pain',
  'Heavy bleeding',
  'Prolonged bleeding',
  'Irregular bleeding',
  'Fatigue',
  'Lower back pain',
  'Digestive symptoms',
  'Headaches',
  'Pain outside of menstruation',
  'Impact on daily life',
];

export function conditionRoute(slug) {
  return `/conditions/${slug}`;
}
