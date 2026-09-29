import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/** Version-agnostic JSON fixture loader (no import-attribute dependency). */
export function loadFixture(name) {
  const here = dirname(fileURLToPath(import.meta.url));
  return JSON.parse(readFileSync(join(here, '..', 'fixtures', name), 'utf8'));
}
