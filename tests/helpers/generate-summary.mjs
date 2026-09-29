/**
 * Post-run report generator.
 *
 * Reads the Playwright JSON reporter output (test-results/latest/results.json)
 * and writes:
 *   - test-results/latest/summary.json   (machine-readable executive summary)
 *   - test-results/latest/report.html     (human-readable report)
 *
 * Run after `npx playwright test`:
 *   node tests/helpers/generate-summary.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LATEST = join(__dirname, '..', '..', 'test-results', 'latest');
const RESULTS = join(LATEST, 'results.json');

if (!existsSync(RESULTS)) {
  console.error('No results.json found. Run the test suite first: npx playwright test');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(RESULTS, 'utf8'));
const stats = raw.stats || {};

const byCategory = {};
const failures = [];

function walk(specs) {
  for (const s of specs || []) {
    for (const t of s.tests || []) {
      const id = t.title.match(/TC-[A-Z]+-\d+/)?.[0] || t.title;
      const cat = id.match(/TC-([A-Z]+)-/)?.[1] || 'OTHER';
      const status = t.status || (t.results?.[0]?.status) || 'unknown';
      byCategory[cat] = byCategory[cat] || { total: 0, passed: 0, failed: 0, blocked: 0, skipped: 0 };
      byCategory[cat].total++;
      if (status === 'passed') byCategory[cat].passed++;
      else if (status === 'failed') {
        byCategory[cat].failed++;
        failures.push({
          id,
          title: t.title,
          error: t.results?.[0]?.error?.message || '',
          duration: t.results?.[0]?.duration || 0,
        });
      } else if (status === 'skipped') byCategory[cat].skipped++;
      else if (status === 'interrupted' || status === 'timedOut') byCategory[cat].blocked++;
    }
    if (s.specs) walk(s.specs);
  }
}
walk(raw.suites || raw.results || []);

const total = stats.total ?? 0;
const passed = stats.passed ?? 0;
const failed = stats.failed ?? 0;
const skipped = stats.skipped ?? 0;
const flaky = stats.flaky ?? 0;
const passRate = total ? ((passed / total) * 100).toFixed(1) : '0.0';

const summary = {
  generatedAt: new Date().toISOString(),
  totals: { total, passed, failed, skipped, flaky, passRate: `${passRate}%` },
  byCategory,
  failures,
};

mkdirSync(LATEST, { recursive: true });
writeFileSync(join(LATEST, 'summary.json'), JSON.stringify(summary, null, 2));

const html = `<!doctype html><html><head><meta charset="utf-8">
<title>LunaCycle Test Report</title>
<style>
body{font-family:system-ui,sans-serif;background:#0c0b12;color:#e8e6f5;padding:2rem}
h1{color:#c4b5fd}table{border-collapse:collapse;width:100%;margin:1rem 0}
th,td{border:1px solid #2a2740;padding:.5rem;text-align:left}
th{background:#16131f}.pass{color:#6ee7b7}.fail{color:#fda4af}.skip{color:#fcd34d}
</style></head><body>
<h1>LunaCycle Automated Test Report</h1>
<p>Generated: ${summary.generatedAt}</p>
<h2>Executive Summary</h2>
<table>
<tr><th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th><th>Pass rate</th></tr>
<tr><td>${total}</td><td class="pass">${passed}</td><td class="fail">${failed}</td><td class="skip">${skipped}</td><td>${passRate}%</td></tr>
</table>
<h2>By Category</h2>
<table><tr><th>Category</th><th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th></tr>
${Object.entries(byCategory).map(([k,v])=>`<tr><td>${k}</td><td>${v.total}</td><td class="pass">${v.passed}</td><td class="fail">${v.failed}</td><td class="skip">${v.skipped}</td></tr>`).join('')}
</table>
<h2>Failures</h2>
${failures.length?`<table><tr><th>ID</th><th>Title</th><th>Error</th></tr>${failures.map(f=>`<tr><td>${f.id}</td><td>${f.title}</td><td><pre>${(f.error||'').replace(/</g,'&lt;')}</pre></td></tr>`).join('')}</table>`:'<p class="pass">No failures.</p>'}
<p><em>See test-results/latest/html/ for the full interactive Playwright report.</em></p>
</body></html>`;
writeFileSync(join(LATEST, 'report.html'), html);

console.log(`Report written to ${LATEST}/summary.json and report.html`);
console.log(`Total ${total} | Passed ${passed} | Failed ${failed} | Pass rate ${passRate}%`);
