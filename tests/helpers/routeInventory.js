import { routes, conditionSlugs, conditionRoute } from './selectors.js';

/**
 * Static route inventory derived from src/App.jsx (not crawled at runtime).
 * Used by navigation + regression suites to assert every route loads.
 */
export const staticRoutes = [
  routes.home,
  routes.symptoms,
  routes.products,
  routes.conditions,
  routes.about,
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.resetPassword,
];

export const dynamicRoutes = conditionSlugs.map(conditionRoute);

/** Routes that require authentication (ProtectedRoute). */
export const protectedRoutes = [routes.tracker];

export const allPublicRoutes = [...staticRoutes, ...dynamicRoutes];

export const knownBrokenRoutes = []; // populated by navigation suite at runtime
