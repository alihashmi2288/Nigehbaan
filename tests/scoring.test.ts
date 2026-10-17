import { describe, it, expect } from 'vitest';
import seedData from '../src/lib/simulation/seed.json';
import {
  calculatePriorityScore,
  lookupLifeThreatScore,
  lookupMedicalUrgencyScore,
  lookupEvacuationInabilityScore,
  lookupEnvironmentalDangerScore,
  lookupPopulationScore,
  FACTOR_WEIGHTS,
} from '../src/lib/triage/scoringEngine';
import {
  rankIncidentQueue,
  compareIncidents,
  getIncidentScoreAndConfidence,
} from '../src/lib/triage/queueRanker';
import { Incident, ExtractedFactsSchema } from '../src/types';

describe('Task T1.2 & T1.4: Deterministic 5-Factor MCDA Scoring Engine', () => {
  it('verifies exact mathematical scores for all 12 District Alpha seed incidents', () => {
    const expectedCatalog: Record<string, { score: number; category: string }> = {
      'NG-101': { score: 86.5, category: 'Critical' },
      'NG-102': { score: 81.0, category: 'Critical' },
      'NG-103': { score: 68.7, category: 'High' },
      'NG-104': { score: 56.5, category: 'High' },
      'NG-105': { score: 39.5, category: 'Moderate' },
      'NG-106': { score: 17.0, category: 'Low' },
      'NG-107': { score: 5.0, category: 'Low' },
      'NG-108': { score: 11.0, category: 'Low' },
      'NG-109': { score: 50.0, category: 'Moderate' },
      'NG-110': { score: 59.5, category: 'High' },
      'NG-111': { score: 67.5, category: 'High' },
      'NG-112': { score: 60.0, category: 'High' },
    };

    for (const incident of seedData.incidents) {
      const result = calculatePriorityScore(incident.factors, {
        reporterType: incident.reporterType,
        phoneAccess: incident.phoneAccess,
      });

      const expected = expectedCatalog[incident.code];
      expect(expected).toBeDefined();

      // Assert score matches within 0.05
      expect(Math.abs(result.score - expected.score)).toBeLessThanOrEqual(0.05);

      // Assert category matches
      expect(result.category).toBe(expected.category);

      // Assert seed.json expectedScore matches
      expect(incident.expectedScore).toBe(expected.score);
      expect(incident.category).toBe(expected.category);
    }
  });

  describe('Acceptance Test 1.1: Critical Dialysis Incident (NG-101)', () => {
    it('calculates exact 86.5 Critical score and generates formula breakdown', () => {
      const factors = [4.5, 5.0, 4.0, 4.5, 2.5];
      const result = calculatePriorityScore(factors, {
        reporterType: 'citizen',
        phoneAccess: 'has_phone',
      });

      expect(result.score).toBe(86.5);
      expect(result.category).toBe('Critical');
      expect(result.confidence).toBe(1.0);
      expect(result.unknownFactorCount).toBe(0);
      expect(result.isRenormalized).toBe(false);
      expect(result.explanationText).toContain('100 ×');
      expect(result.explanationText).toContain('86.5');
      expect(result.factorBreakdown.length).toBe(5);
    });
  });

  describe('Acceptance Test 1.2: Unknown Factor Renormalization — NG-112', () => {
    it('renormalizes weights across known factors without penalizing missing data', () => {
      // Incident NG-112: f1=3.0, f2=null, f3=null, f4=3.0, f5=null
      const factors = [3.0, null, null, 3.0, null];
      const result = calculatePriorityScore(factors, {
        reporterType: 'citizen',
        phoneAccess: 'unknown',
      });

      // Known weight sum: w1 (0.30) + w4 (0.15) = 0.45
      // Known weighted sum: 0.30 * (3.0/5) + 0.15 * (3.0/5) = 0.18 + 0.09 = 0.27
      // Score: 100 * (0.27 / 0.45) = 60.0
      expect(result.score).toBe(60.0);
      expect(result.category).toBe('High');
      expect(result.confidence).toBe(0.45);
      expect(result.knownFactorCount).toBe(2);
      expect(result.unknownFactorCount).toBe(3);
      expect(result.isRenormalized).toBe(true);
    });
  });

  describe('Acceptance Test 1.2b: Critical Unknown Factor Renormalization — Panicked Dropped Call', () => {
    it('correctly scores panicked dropped call as Critical with high score', () => {
      // Dropped call: f1=4.5, f2=null, f3=null, f4=4.5, f5=null
      const factors = [4.5, null, null, 4.5, null];
      const result = calculatePriorityScore(factors, {
        reporterType: 'citizen',
        phoneAccess: 'unknown',
      });

      // Known weight sum: 0.30 + 0.15 = 0.45
      // Weighted sum: 0.30 * (4.5/5) + 0.15 * (4.5/5) = 0.270 + 0.135 = 0.405
      // Renormalized: 100 * (0.405 / 0.45) = 90.0
      expect(result.score).toBe(90.0);
      expect(result.category).toBe('Critical');
      expect(result.confidence).toBe(0.45);
      expect(result.unknownFactorCount).toBe(3);
    });
  });

  describe('Acceptance Test 1.3: Community Proxy & No-Phone Vulnerability Floor', () => {
    it('enforces f3 >= 4.0 when phoneAccess is no_phone', () => {
      // Incident NG-104: factors [3.0, 2.0, 2.0 (initial mobility), 3.5, 1.0]
      const initialFactors = [3.0, 2.0, 2.0, 3.5, 1.0];
      const result = calculatePriorityScore(initialFactors, {
        reporterType: 'community_proxy',
        phoneAccess: 'no_phone',
      });

      // Floor enforces f3 to 4.0
      expect(result.adjustedFactors[2]).toBe(4.0);
      expect(result.appliedFloors.noPhoneFloorApplied).toBe(true);
      expect(result.score).toBe(56.5);
      expect(result.category).toBe('High');
    });

    it('does not lower f3 if caller already reported f3 >= 4.0', () => {
      const factors = [3.0, 2.0, 4.5, 3.5, 1.0];
      const result = calculatePriorityScore(factors, {
        reporterType: 'community_proxy',
        phoneAccess: 'no_phone',
      });

      expect(result.adjustedFactors[2]).toBe(4.5);
      expect(result.appliedFloors.noPhoneFloorApplied).toBe(false);
    });
  });

  describe('Acceptance Test 1.4: Blind-Spot Floor & Synthesis Rules', () => {
    it('preserves score when blind-spot calculated score >= 60.0 (NG-103 = 68.7)', () => {
      // NG-103: [2.5, null, 4.0, 4.5, 3.5]
      const result = calculatePriorityScore([2.5, null, 4.0, 4.5, 3.5], {
        reporterType: 'system_blind_spot',
        phoneAccess: 'network_down',
      });

      expect(result.score).toBe(68.7);
      expect(result.category).toBe('High');
      expect(result.label).toBe('Physical Welfare Recon / Field Sweep');
      expect(result.appliedFloors.blindSpotFloorApplied).toBe(false);
    });

    it('enforces minimum score 60.0 (High) for low-scoring blind-spot reports', () => {
      // Low factors that would otherwise score ~25.0
      const lowBlindFactors = [1.0, null, 1.0, 1.0, 1.0];
      const result = calculatePriorityScore(lowBlindFactors, {
        reporterType: 'system_blind_spot',
        phoneAccess: 'network_down',
      });

      expect(result.score).toBe(60.0);
      expect(result.category).toBe('High');
      expect(result.appliedFloors.blindSpotFloorApplied).toBe(true);
      expect(result.label).toBe('Physical Welfare Recon / Field Sweep');
    });

    it('guarantees a blind-spot incident is never auto-Critical', () => {
      // High factors that would normally exceed 75
      const highBlindFactors = [5.0, null, 5.0, 5.0, 5.0];
      const result = calculatePriorityScore(highBlindFactors, {
        reporterType: 'system_blind_spot',
        phoneAccess: 'network_down',
      });

      // Blind spot is never auto-Critical
      expect(result.category).toBe('High');
    });
  });
});

describe('Task T1.3: Triage Queue Ranking & Confidence Inversion Tie-Breaker', () => {
  it('ranks higher priority scores above lower priority scores', () => {
    const incA: Incident = {
      id: '1',
      code: 'A',
      sectorId: 'sector-1',
      reporterType: 'citizen',
      phoneAccess: 'has_phone',
      timestamp: '2026-10-18T10:00:00Z',
      phaseArrival: 'T6',
      reportText: 'Test A',
      factors: [5, 5, 5, 5, 5],
      score: 85.0,
      confidence: 1.0,
      category: 'Critical',
      uncertaintyFlags: [],
      coordinates: null,
    };

    const incB: Incident = {
      ...incA,
      id: '2',
      code: 'B',
      score: 60.0,
      category: 'High',
    };

    const sorted = rankIncidentQueue([incB, incA]);
    expect(sorted[0].code).toBe('A');
    expect(sorted[1].code).toBe('B');
  });

  it('implements Confidence Inversion: within ±0.1 score, lower confidence ranks HIGHER', () => {
    // Both incidents have score 60.0
    // Incident LowConf has missing factors (confidence 0.45)
    // Incident HighConf has all known factors (confidence 1.00)
    const incHighConf: Incident = {
      id: 'full-data',
      code: 'FULL',
      sectorId: 'sector-2',
      reporterType: 'citizen',
      phoneAccess: 'has_phone',
      timestamp: '2026-10-18T10:00:00Z',
      phaseArrival: 'T6',
      reportText: 'All factors known',
      factors: [3.0, 3.0, 3.0, 3.0, 3.0],
      score: 60.0,
      confidence: 1.0,
      category: 'High',
      uncertaintyFlags: [],
      coordinates: null,
    };

    const incLowConf: Incident = {
      id: 'missing-data',
      code: 'MISSING',
      sectorId: 'sector-2',
      reporterType: 'citizen',
      phoneAccess: 'has_phone',
      timestamp: '2026-10-18T10:00:00Z',
      phaseArrival: 'T6',
      reportText: '3 factors unknown',
      factors: [3.0, null, null, 3.0, null],
      score: 60.0,
      confidence: 0.45,
      category: 'High',
      uncertaintyFlags: ['MISSING_LOCATION'],
      coordinates: null,
    };

    // Even if input has FULL first, MISSING must rank first due to confidence inversion!
    const ranked = rankIncidentQueue([incHighConf, incLowConf]);
    expect(ranked[0].code).toBe('MISSING');
    expect(ranked[1].code).toBe('FULL');
  });

  it('breaks confidence tie with FIFO timestamp (earlier report ranks higher)', () => {
    const earlierInc: Incident = {
      id: 'early',
      code: 'EARLY',
      sectorId: 'sector-1',
      reporterType: 'citizen',
      phoneAccess: 'has_phone',
      timestamp: '2026-10-18T07:00:00Z',
      phaseArrival: 'T3',
      reportText: 'Report at 07:00',
      factors: [3, 3, 3, 3, 3],
      score: 60.0,
      confidence: 1.0,
      category: 'High',
      uncertaintyFlags: [],
      coordinates: null,
    };

    const laterInc: Incident = {
      ...earlierInc,
      id: 'late',
      code: 'LATE',
      timestamp: '2026-10-18T08:30:00Z',
    };

    const ranked = rankIncidentQueue([laterInc, earlierInc]);
    expect(ranked[0].code).toBe('EARLY');
    expect(ranked[1].code).toBe('LATE');
  });
});

describe('Factor Lookup Helpers', () => {
  it('correctly maps discrete condition strings to factor scores', () => {
    expect(lookupLifeThreatScore('imminent_drowning')).toBe(5.0);
    expect(lookupLifeThreatScore('severe_threat')).toBe(4.0);
    expect(lookupLifeThreatScore('moderate_threat')).toBe(3.0);
    expect(lookupLifeThreatScore('potential')).toBe(1.5);
    expect(lookupLifeThreatScore('none')).toBe(0.0);

    expect(lookupMedicalUrgencyScore('time_critical_dependency')).toBe(5.0);
    expect(lookupMedicalUrgencyScore('urgent_medical')).toBe(3.5);
    expect(lookupMedicalUrgencyScore('chronic_managed')).toBe(2.5);
    expect(lookupMedicalUrgencyScore('minor_injury')).toBe(1.0);
    expect(lookupMedicalUrgencyScore('none')).toBe(0.0);

    expect(lookupEvacuationInabilityScore('completely_immobile')).toBe(5.0);
    expect(lookupEvacuationInabilityScore('high_vulnerability')).toBe(4.0);
    expect(lookupEvacuationInabilityScore('vulnerable_group')).toBe(3.0);
    expect(lookupEvacuationInabilityScore('minor_impairment')).toBe(1.5);
    expect(lookupEvacuationInabilityScore('independent_adults')).toBe(0.0);

    expect(lookupEnvironmentalDangerScore('submerged_roof')).toBe(5.0);
    expect(lookupEnvironmentalDangerScore('chest_deep')).toBe(4.5);
    expect(lookupEnvironmentalDangerScore('waist_deep')).toBe(3.5);
    expect(lookupEnvironmentalDangerScore('knee_deep')).toBe(2.0);
    expect(lookupEnvironmentalDangerScore('dry')).toBe(0.5);

    expect(lookupPopulationScore(1)).toBe(1.0);
    expect(lookupPopulationScore(3)).toBe(2.5);
    expect(lookupPopulationScore(7)).toBe(4.0);
    expect(lookupPopulationScore(15)).toBe(5.0);
  });
});

describe('Zod Schema Validation & Invariants', () => {
  it('validates extracted facts conforming to docs/ai-prompts.md', () => {
    const validData = {
      incidentType: 'flood_rescue',
      locationText: 'House 14 near Gadap Canal',
      sectorHint: 'sector-2',
      latitude: 24.915,
      longitude: 67.139,
      locationStatus: 'confirmed',
      peopleAffected: 4,
      waterDepthMeters: 1.2,
      waterCurrentSpeed: 'fast_rushing',
      structureIntegrity: 'flooded_ground',
      medicalUrgencyLevel: 'chronic_managed',
      medicalConditionsReported: ['arthritis'],
      evacuationMobilityLevel: 'high_vulnerability',
      vulnerabilityDetails: ['isolated_elderly'],
      phoneAccessStatus: 'no_phone',
      extractedQuotes: ['lives alone at House 14', 'water waist-deep'],
      originalLanguage: 'english',
      englishTranslation: null,
    };

    const parsed = ExtractedFactsSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid facts exceeding clamped bounds', () => {
    const invalidDepth = {
      incidentType: 'flood_rescue',
      locationText: null,
      sectorHint: null,
      latitude: null,
      longitude: null,
      locationStatus: 'missing',
      peopleAffected: 10,
      waterDepthMeters: 15.0, // Exceeds max 10.0m
      waterCurrentSpeed: null,
      structureIntegrity: null,
      medicalUrgencyLevel: null,
      medicalConditionsReported: [],
      evacuationMobilityLevel: null,
      vulnerabilityDetails: [],
      phoneAccessStatus: 'unknown',
      extractedQuotes: [],
      originalLanguage: 'english',
      englishTranslation: null,
    };

    const parsed = ExtractedFactsSchema.safeParse(invalidDepth);
    expect(parsed.success).toBe(false);
  });
});
