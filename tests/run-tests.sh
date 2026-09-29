#!/usr/bin/env bash
# Convenience runner for the LunaCycle test suite.
# Does NOT modify the application. Run from the repository root.
set -e

CONFIG=tests/config/playwright.config.js

echo "==> Running Playwright suite"
npx playwright test --config=$CONFIG "$@"

echo "==> Generating summary report"
node tests/helpers/generate-summary.mjs

echo "==> Done. See test-results/latest/report.html"
