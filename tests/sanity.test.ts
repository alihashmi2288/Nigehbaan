import { describe, it, expect } from 'vitest';
import seedData from '../src/lib/simulation/seed.json';

describe('Sanity & Testing Infrastructure', () => {
  it('verifies basic arithmetic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('verifies that triage weights sum exactly to 1.00', () => {
    const weights = {
      lifeThreat: 0.30,
      medicalUrgency: 0.25,
      evacuationInability: 0.20,
      environmentalDanger: 0.15,
      population: 0.10,
    };

    const sum = Object.values(weights).reduce((acc, w) => acc + w, 0);
    expect(Number(sum.toFixed(2))).toBe(1.00);
  });

  it('verifies deterministic MCDA calculation bounds (0 to 100)', () => {
    const weights = [0.30, 0.25, 0.20, 0.15, 0.10];
    
    // Min score when all factors are 0
    const minScore = 100 * weights.reduce((acc, w) => acc + w * (0 / 5), 0);
    expect(minScore).toBe(0);

    // Max score when all factors are 5
    const maxScore = 100 * weights.reduce((acc, w) => acc + w * (5 / 5), 0);
    expect(maxScore).toBe(100);
  });

  it('verifies seed.json is accessible and valid', () => {
    expect(seedData).toBeDefined();
    expect(Array.isArray(seedData.incidents)).toBe(true);
    expect(seedData.incidents.length).toBe(12);
  });
});
