import { describe, it, expect, beforeEach } from 'vitest';
import fixtures from '../docs/extraction-fixtures.json';
import { extractFactsWithHeuristics, OFFLINE_FALLBACK_BADGE } from '../src/lib/ai/heuristicExtractor';
import { mapFactsToFactors } from '../src/lib/triage/factorMapper';
import { calculatePriorityScore } from '../src/lib/triage/scoringEngine';
import { ExtractedFactsSchema } from '../src/types';
import { useAppStore } from '../src/store';

describe('Milestone 5: Intake & Structured Extraction', () => {
  beforeEach(() => {
    // Reset store to pristine state before each test
    useAppStore.getState().resetSimulation();
  });

  describe('Task T5.3: Deterministic Heuristic Fallback Extractor & Golden Oracle', () => {
    it('always outputs honest fallback badge and isAI = false', () => {
      const result = extractFactsWithHeuristics('Any crisis distress call');
      expect(result.isAI).toBe(false);
      expect(result.provenanceBadge).toBe(OFFLINE_FALLBACK_BADGE);
      expect(result.provenanceBadge).toBe('Offline heuristic extraction (not AI)');
    });

    it('never hallucinates coordinates (latitude and longitude strictly null)', () => {
      const result = extractFactsWithHeuristics('Flooded near Gadap canal 24.95, 67.12');
      expect(result.facts.latitude).toBeNull();
      expect(result.facts.longitude).toBeNull();
    });

    it('validates against ExtractedFactsSchema Zod parser', () => {
      const result = extractFactsWithHeuristics('Water is rising fast in sector 2');
      const validation = ExtractedFactsSchema.safeParse(result.facts);
      expect(validation.success).toBe(true);
    });

    it('Golden Oracle: extracts dialysis dependency and chest-deep water (NG-101)', () => {
      const ng101 = fixtures.find((f) => f.code === 'NG-101')!;
      const result = extractFactsWithHeuristics(ng101.reportText, {
        phoneAccess: ng101.phoneAccess as any,
      });

      expect(result.facts.medicalUrgencyLevel).toBe('time_critical_dependency');
      expect(result.facts.medicalConditionsReported).toContain('hemodialysis');
      expect(result.facts.waterDepthMeters).toBe(1.5);
      expect(result.factors[1]).toBe(5.0); // Medical Urgency = 5.0
      expect(result.factors[0]).toBe(4.5); // Life Threat = 4.5
      expect(result.factors[3]).toBe(4.5); // Environmental Danger = 4.5

      // Deterministic MCDA score
      const scoring = calculatePriorityScore(result.factors, {
        phoneAccess: 'has_phone',
      });
      expect(scoring.score).toBe(86.5);
      expect(scoring.category).toBe('Critical');
    });

    it('Golden Oracle: extracts Urdu distress report with roof collapse and infants (NG-102)', () => {
      const ng102 = fixtures.find((f) => f.code === 'NG-102')!;
      const result = extractFactsWithHeuristics(ng102.reportText, {
        phoneAccess: ng102.phoneAccess as any,
      });

      expect(result.facts.originalLanguage).toBe('urdu');
      expect(result.facts.structureIntegrity).toBe('cracking_roof');
      expect(result.facts.evacuationMobilityLevel).toBe('high_vulnerability');
      expect(result.facts.vulnerabilityDetails).toContain('infants_dependent');
      expect(result.factors[0]).toBe(5.0); // Collapse / cracking roof
      expect(result.factors[2]).toBe(4.5); // Infants vulnerability
      expect(result.factors[3]).toBe(5.0); // Submerged roof

      const scoring = calculatePriorityScore(result.factors, {
        phoneAccess: 'has_phone',
      });
      expect(scoring.score).toBe(81.0);
      expect(scoring.category).toBe('Critical');
    });

    it('Golden Oracle: extracts factory workers headcount (NG-105)', () => {
      const ng105 = fixtures.find((f) => f.code === 'NG-105')!;
      const result = extractFactsWithHeuristics(ng105.reportText, {
        phoneAccess: ng105.phoneAccess as any,
      });

      expect(result.facts.peopleAffected).toBe(14);
      expect(result.factors[4]).toBe(5.0); // 10+ people bucket = 5.0
      expect(result.facts.medicalUrgencyLevel).toBe('none');
      expect(result.factors[1]).toBe(0.0);
    });
  });

  describe('Acceptance Test 1.3: Community Proxy & No-Phone Vulnerability Floor', () => {
    it('enforces Evacuation Inability f3 >= 4.0 when phoneAccess is no_phone', () => {
      const ng104 = fixtures.find((f) => f.code === 'NG-104')!;
      const result = extractFactsWithHeuristics(ng104.reportText, {
        phoneAccess: 'no_phone',
      });

      expect(result.facts.phoneAccessStatus).toBe('no_phone');

      // Test scoring engine with no_phone option
      const scoring = calculatePriorityScore(result.factors, {
        reporterType: 'community_proxy',
        phoneAccess: 'no_phone',
      });

      expect(scoring.appliedFloors.noPhoneFloorApplied).toBe(true);
      expect(scoring.adjustedFactors[2]).toBeGreaterThanOrEqual(4.0);
      expect(scoring.score).toBe(56.5);
      expect(scoring.category).toBe('High');
    });

    it('guarantees proxy report yields NO_PHONE_COMMUNITY_PROXY flag in store', () => {
      const store = useAppStore.getState();
      const newInc = store.submitIncident({
        reportText: 'Reporting for neighbor: Auntie Khadija lives alone at House 14. She has no phone, water waist-deep, cannot walk.',
        sectorId: 'sector-2',
        reporterType: 'community_proxy',
        phoneAccess: 'no_phone',
        factors: [3.0, 2.0, 4.0, 3.5, 1.0],
      });

      expect(newInc.score).toBe(56.5);
      expect(newInc.category).toBe('High');
      expect(newInc.uncertaintyFlags).toContain('NO_PHONE_COMMUNITY_PROXY');
      expect(newInc.uncertaintyFlags).toContain('MISSING_LOCATION');
    });
  });

  describe('Task T5.2: Zod Schema Validation & Boundary Rules', () => {
    it('rejects invalid water depth values (> 10.0m or negative)', () => {
      const valid = ExtractedFactsSchema.safeParse({
        incidentType: 'flood_rescue',
        locationText: null,
        sectorHint: 'sector-2',
        latitude: null,
        longitude: null,
        locationStatus: 'approximate',
        peopleAffected: 5,
        waterDepthMeters: 15.0, // Invalid: exceeds 10.0m
        waterCurrentSpeed: 'fast_rushing',
        structureIntegrity: 'flooded_ground',
        medicalUrgencyLevel: 'none',
        medicalConditionsReported: [],
        evacuationMobilityLevel: 'independent_adults',
        vulnerabilityDetails: [],
        phoneAccessStatus: 'has_phone',
        extractedQuotes: [],
        originalLanguage: 'english',
        englishTranslation: null,
      });

      expect(valid.success).toBe(false);
    });

    it('rejects invalid headcount values (> 500 or <= 0)', () => {
      const valid = ExtractedFactsSchema.safeParse({
        incidentType: 'flood_rescue',
        locationText: null,
        sectorHint: 'sector-2',
        latitude: null,
        longitude: null,
        locationStatus: 'approximate',
        peopleAffected: 600, // Invalid: exceeds 500
        waterDepthMeters: 1.0,
        waterCurrentSpeed: 'fast_rushing',
        structureIntegrity: 'flooded_ground',
        medicalUrgencyLevel: 'none',
        medicalConditionsReported: [],
        evacuationMobilityLevel: 'independent_adults',
        vulnerabilityDetails: [],
        phoneAccessStatus: 'has_phone',
        extractedQuotes: [],
        originalLanguage: 'english',
        englishTranslation: null,
      });

      expect(valid.success).toBe(false);
    });
  });

  describe('Task T5.4: State Store Integration & Queue Prioritization', () => {
    it('prepends newly submitted report to the queue and auto-selects in inspector', () => {
      const store = useAppStore.getState();
      const initialCount = store.incidents.length;

      const created = store.submitIncident({
        reportText: 'Elderly cardiac patient in Sector 3A surrounded by chest-deep water.',
        sectorId: 'sector-3a',
        reporterType: 'citizen',
        phoneAccess: 'has_phone',
        factors: [4.5, 4.0, 4.0, 4.5, 2.5],
        provenanceBadge: OFFLINE_FALLBACK_BADGE,
        isAI: false,
      });

      const updatedState = useAppStore.getState();
      expect(updatedState.incidents.length).toBe(initialCount + 1);
      expect(updatedState.incidents[0].id).toBe(created.id);
      expect(updatedState.selectedIncidentId).toBe(created.id);
      expect(created.provenanceBadge).toBe('Offline heuristic extraction (not AI)');
      expect(created.isAI).toBe(false);

      // Verify audit log entry was created
      const auditLog = updatedState.activityLogs.find((l) => l.action === 'INCIDENT_SUBMITTED');
      expect(auditLog).toBeDefined();
      expect(auditLog?.incidentId).toBe(created.id);
      expect(auditLog?.details).toContain(created.code);
    });

    it('preserves pristine reset capability after submitting new reports (Test 1.9)', () => {
      const store = useAppStore.getState();

      store.submitIncident({
        reportText: 'Temporary test report',
        sectorId: 'sector-1',
        factors: [1.0, 0.0, 0.0, 1.0, 1.0],
      });

      expect(useAppStore.getState().incidents.length).toBe(13);

      // Perform 1-click reset
      useAppStore.getState().resetSimulation();

      expect(useAppStore.getState().incidents.length).toBe(12);
      expect(useAppStore.getState().timelinePhase).toBe('T0');
    });
  });
});
