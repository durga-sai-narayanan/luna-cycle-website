import { test, expect } from '@playwright/test';
import { conditionSlugs } from '../helpers/selectors.js';
import { loadFixture } from '../helpers/loadFixture.js';

const symptomsFixture = loadFixture('symptoms.json');

/**
 * Unit-level data consistency tests.
 * These import the app's data modules directly (read-only) to verify internal
 * consistency WITHOUT launching a browser. They do not modify the app.
 */

// Import the app's real data so we test the actual source of truth.
const { symptomOptions, conditionSymptoms } = await import('../../src/data/symptoms.js');
const { conditions, getCondition } = await import('../../src/data/conditions.js');

test.describe('Data consistency (no browser)', () => {
  test('TC-UNIT-001 | Every condition slug resolves to a record', () => {
    for (const slug of conditionSlugs) {
      const c = getCondition(slug);
      expect(c, `Missing condition for slug: ${slug}`).toBeTruthy();
    }
  });

  test('TC-UNIT-002 | conditionSymptoms keys match condition slugs', () => {
    const conditionKeys = Object.keys(conditionSymptoms);
    for (const key of conditionKeys) {
      expect(getCondition(key), `conditionSymptoms has unknown slug: ${key}`).toBeTruthy();
    }
  });

  test('TC-UNIT-003 | Every symptom id referenced in conditionSymptoms exists in symptomOptions', () => {
    const knownIds = new Set(symptomOptions.map((s) => s.id));
    for (const [slug, ids] of Object.entries(conditionSymptoms)) {
      for (const id of ids) {
        expect(knownIds.has(id), `${slug} references unknown symptom id: ${id}`).toBeTruthy();
      }
    }
  });

  test('TC-UNIT-004 | No condition has an empty symptom list', () => {
    for (const c of conditions) {
      const ids = conditionSymptoms[c.slug] || [];
      expect(ids.length, `${c.slug} has no symptoms`).toBeGreaterThan(0);
    }
  });

  test('TC-UNIT-005 | Fixture mirrors app symptomOptions', () => {
    expect(symptomOptions.map((s) => s.id)).toEqual(symptomsFixture.options.map((s) => s.id));
  });

  test('TC-UNIT-006 | Overlap score is always in [0,1]', () => {
    // Replicate the component's scoring to validate the math invariant.
    for (const c of conditions) {
      const cSymptoms = conditionSymptoms[c.slug] || [];
      for (let k = 0; k <= cSymptoms.length; k++) {
        const selected = cSymptoms.slice(0, k);
        const score = cSymptoms.length ? selected.length / cSymptoms.length : 0;
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }
    }
  });
});
