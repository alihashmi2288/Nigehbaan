import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculatePriorityScore,
  FACTOR_WEIGHTS,
} from '@/lib/triage/scoringEngine';
import {
  rankIncidentQueue,
  compareIncidents,
  getIncidentScoreAndConfidence,
} from '@/lib/triage/queueRanker';
import { generateExplainabilityRationale } from '@/lib/triage/explainabilityGenerator';
import {
  evaluateUncertaintyRadar,
  isMissingLocation,
  isStaleReport,
  detectConflictPairs,
  detectDuplicatePairs,
} from '@/lib/uncertainty/radarDetector';
import {
  evaluateSectorHealth,
  synthesizeBlindSpotIncident,
  detectAndSynthesizeBlindSpots,
  BLIND_SPOT_MINIMUM_SCORE,
} from '@/lib/uncertainty/blindSpotDetector';
import {
  calculateOpportunityCost,
} from '@/lib/resources/opportunityCost';
import {
  extractFactsWithHeuristics,
  OFFLINE_FALLBACK_BADGE,
} from '@/lib/ai/heuristicExtractor';
import {
  useAppStore,
  selectVisibleIncidents,
  selectRankedVisibleIncidents,
} from '@/store/useAppStore';
import {
  getPristineState,
  getPristineIncidents,
  getPristineResources,
  getPristineSectors,
} from '@/lib/simulation/seedLoader';
import { ExtractedFactsSchema, Incident } from '@/types';
import { matchShelterForIncident } from '@/lib/shelters';
import { getSectorStagingRecommendation } from '@/lib/simulation/stagingAdvisor';

/**
 * Tier 1 Acceptance Test Suite
 * Defined in docs/acceptance-tests.md (Tests 1.1 through 1.9)
 * Authoritative verification for CODE//CONNECT'26 Disaster Response & Emergency Coordination
 */
describe('Tier 1 Acceptance Test Suite (Tests 1.1 – 1.9)', () => {
  beforeEach(() => {
    // Reset store to pristine District Alpha baseline before each test
    useAppStore.getState().resetSimulation();
  });

  // --------------------------------------------------------------------------
  // Test 1.1: Deterministic Scoring — Critical Dialysis Incident
  // --------------------------------------------------------------------------
  describe('Test 1.1: Deterministic Scoring — Critical Dialysis Incident', () => {
    it('calculates score 86.5, category Critical, ranks #1 at T+3, and generates Explainability Card', () => {
      // Given: Raw report factors for Incident NG-101 in Sector 2:
      // Life Threat: 4.5, Medical Urgency: 5.0, Evacuation Inability: 4.0, Environmental Danger: 4.5, Population: 2.5
      const factors: [number, number, number, number, number] = [4.5, 5.0, 4.0, 4.5, 2.5];

      // When: The scoring engine executes calculatePriorityScore(factors)
      const result = calculatePriorityScore(factors, { phoneAccess: 'has_phone' });

      // Then:
      // 1. The exact score returned is 86.5 (within ±0.1)
      expect(result.score).toBeCloseTo(86.5, 1);
      expect(result.score).toBe(86.5);

      // 2. The priority category is Critical
      expect(result.category).toBe('Critical');

      // 3. The incident ranks #1 in the priority queue at T+3
      const allIncidents = getPristineIncidents();
      const rankedVisible = selectRankedVisibleIncidents(
        allIncidents,
        'T3',
        '2026-10-18T07:30:00Z'
      );
      expect(rankedVisible.length).toBeGreaterThan(0);
      expect(rankedVisible[0].code).toBe('NG-101');
      expect(rankedVisible[0].expectedScore ?? rankedVisible[0].score).toBe(86.5);

      // 4. An Explainability Card is generated displaying the formula breakdown
      expect(result.explanationText).toContain('0.3');
      expect(result.explanationText).toContain('0.25');
      expect(result.explanationText).toContain('0.2');
      expect(result.explanationText).toContain('0.15');
      expect(result.explanationText).toContain('0.1');
      expect(result.explanationText).toContain('86.5');

      const explainability = generateExplainabilityRationale(rankedVisible[0]);
      expect(explainability.isDeterministic).toBe(true);
      expect(explainability.bullets.length).toBeGreaterThanOrEqual(2);
      expect(explainability.bullets[0].toLowerCase()).toContain('medical urgency');
      expect(explainability.primaryDriver).toContain('Medical Dependency');
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.2: Unknown Factor Renormalization — Missing Location Incident NG-112
  // --------------------------------------------------------------------------
  describe('Test 1.2: Unknown Factor Renormalization — Missing Location Incident NG-112', () => {
    it('renormalizes weights across known factors yielding score 60.0 (High), confidence 0.45, and flags MISSING_LOCATION', () => {
      // Given: Panicked distress report for Incident NG-112 in Sector 2
      // Life Threat: 3.0, Environmental Danger: 3.0, Medical/Evac/Pop: null
      const factors: [number | null, number | null, number | null, number | null, number | null] = [
        3.0,
        null,
        null,
        3.0,
        null,
      ];

      // When: The scoring engine executes calculatePriorityScore(factors)
      const result = calculatePriorityScore(factors);

      // Then:
      // 1. Known weight sum / confidence metric is 0.30 + 0.15 = 0.45
      expect(result.confidence).toBeCloseTo(0.45, 2);

      // 2. Renormalized score is 100 * [0.30*(3/5) + 0.15*(3/5)] / 0.45 = 60.0
      expect(result.score).toBe(60.0);

      // 3. Category is High
      expect(result.category).toBe('High');

      // 4. Unknown count is 3, known factor count is 2
      expect(result.unknownFactorCount).toBe(3);
      expect(result.knownFactorCount).toBe(2);
      expect(result.isRenormalized).toBe(true);

      // 5. Formula explanation string confirms renormalization
      expect(result.explanationText).toContain('/ 0.45');
      expect(result.explanationText).toContain('= 60.0');

      // 6. Uncertainty Radar flag MISSING_LOCATION is raised; urgency is NOT reduced
      const ng112 = getPristineIncidents().find((i) => i.code === 'NG-112')!;
      expect(ng112.coordinates).toBeNull();
      expect(isMissingLocation(ng112)).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(60.0);
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.2b: Critical Unknown Factor Renormalization — Panicked Dropped Call
  // --------------------------------------------------------------------------
  describe('Test 1.2b: Critical Unknown Factor Renormalization — Panicked Dropped Call', () => {
    it('renormalizes factors to yield score 90.0, category Critical, and confidence 0.45', () => {
      // Given: Dropped call factors (Life Threat 4.5, Environmental Danger 4.5, others null)
      const factors: [number | null, number | null, number | null, number | null, number | null] = [
        4.5,
        null,
        null,
        4.5,
        null,
      ];

      // When: The scoring engine executes calculatePriorityScore
      const result = calculatePriorityScore(factors);

      // Then:
      // Known weight sum is 0.45; score = 100 * [0.30*(4.5/5) + 0.15*(4.5/5)] / 0.45 = 90.0
      expect(result.confidence).toBeCloseTo(0.45, 2);
      expect(result.score).toBe(90.0);
      expect(result.category).toBe('Critical');
      expect(result.unknownFactorCount).toBe(3);
      expect(result.isRenormalized).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.3: Community Proxy & No-Phone Vulnerability Floor
  // --------------------------------------------------------------------------
  describe('Test 1.3: Community Proxy & No-Phone Vulnerability Floor', () => {
    it('enforces evacuation inability floor >= 4.0 when communication_status == no_phone', () => {
      // Given: Proxy report for NG-104 with phoneAccess = 'no_phone' and initial mobility score 2.0
      // Factors: LifeThreat 3.0, Medical 2.0, Evac 2.0 (sub-floor), Env 3.5, Pop 1.0
      const initialFactors: [number, number, number, number, number] = [3.0, 2.0, 2.0, 3.5, 1.0];

      // When: The scoring engine processes the incident with phoneAccess: 'no_phone'
      const result = calculatePriorityScore(initialFactors, {
        phoneAccess: 'no_phone',
        reporterType: 'community_proxy',
      });

      // Then:
      // 1. Vulnerability floor enforces f3 = max(2.0, 4.0) = 4.0
      expect(result.adjustedFactors[2]).toBe(4.0);

      // 2. Total calculated score is 56.5 (Category: High)
      // 100 * (0.30*0.6 + 0.25*0.4 + 0.20*0.8 + 0.15*0.7 + 0.10*0.2)
      // = 100 * (0.18 + 0.10 + 0.16 + 0.105 + 0.02) = 56.5
      expect(result.score).toBe(56.5);
      expect(result.category).toBe('High');

      // 3. Flags floor application
      expect(result.appliedFloors.noPhoneFloorApplied).toBe(true);

      // 4. Incident displays NO_PHONE_COMMUNITY_PROXY badge metadata
      const pristineIncidents = getPristineIncidents();
      const ng104 = pristineIncidents.find((i) => i.code === 'NG-104')!;
      expect(ng104.phoneAccess).toBe('no_phone');
      expect(ng104.reporterType).toBe('community_proxy');
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.4: Sector Blind-Spot Synthesis at T+6
  // --------------------------------------------------------------------------
  describe('Test 1.4: Sector Blind-Spot Synthesis at T+6', () => {
    it('synthesizes NG-103 with score 68.7 (High), >= 60.0 floor, not Critical, when Tower-Alpha-3 goes offline', () => {
      // Given: Timeline scrubber is advanced to T+6 Grid Blackout (T6)
      useAppStore.getState().setTimelinePhase('T6');

      const updatedStore = useAppStore.getState();

      // Check Tower-Alpha-3 offline in Sector 3A
      const sector3a = updatedStore.sectors.find((s) => s.id === 'sector-3a')!;
      expect(sector3a).toBeDefined();
      expect(sector3a.cellTower.status).toBe('offline');
      expect(sector3a.floodGauge.levelMeters).toBeGreaterThanOrEqual(1.9);

      // When & Then:
      // 1. Synthetic incident NG-103 is present in active incidents with reporter_type = 'system_blind_spot'
      const ng103 = updatedStore.incidents.find((i) => i.code === 'NG-103');
      expect(ng103).toBeDefined();
      expect(ng103?.reporterType).toBe('system_blind_spot');

      // 2. Evacuation Inability is set to 4.0 and Environmental Danger to 4.5
      expect(ng103?.factors[2]).toBe(4.0);
      expect(ng103?.factors[3]).toBe(4.5);

      // 3. Calculated score is 68.7 and satisfies the floor condition (>= 60.0)
      const scoreValue = ng103?.expectedScore ?? ng103?.score;
      expect(scoreValue).toBe(68.7);
      expect(scoreValue!).toBeGreaterThanOrEqual(BLIND_SPOT_MINIMUM_SCORE);

      // 4. Category is High; label is "Physical Welfare Recon / Field Sweep"
      expect(ng103?.category).toBe('High');
      expect(ng103?.category).not.toBe('Critical'); // Invariant 3: never auto-Critical
      expect(ng103?.label).toBe('Physical Welfare Recon / Field Sweep');

      // 5. Visibility filter: Advancing from T-0 to T+3 reveals NG-101, NG-111, NG-104; advancing to T+6 reveals NG-102, NG-103, NG-108, NG-109, NG-110
      const allIncidents = getPristineIncidents();
      const visibleT3 = selectVisibleIncidents(allIncidents, 'T3', '2026-10-18T07:30:00Z');
      const codesT3 = visibleT3.map((i) => i.code);
      expect(codesT3).toContain('NG-101');
      expect(codesT3).toContain('NG-111');
      expect(codesT3).toContain('NG-104');

      const visibleT6 = selectVisibleIncidents(allIncidents, 'T6', '2026-10-18T10:30:00Z');
      const codesT6 = visibleT6.map((i) => i.code);
      expect(codesT6).toContain('NG-102');
      expect(codesT6).toContain('NG-103');
      expect(codesT6).toContain('NG-108');
      expect(codesT6).toContain('NG-109');
      expect(codesT6).toContain('NG-110');
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.5: Tactical Opportunity Cost Warning (+35 min Delay)
  // --------------------------------------------------------------------------
  describe('Test 1.5: Tactical Opportunity Cost Warning (+35 min Delay)', () => {
    it('detects acute scarcity, confirms 0 shallow assets left in Sector 2, and calculates +35 min delay for NG-104', () => {
      // Given:
      const pristine = getPristineState();
      const ng101 = pristine.incidents.find((i) => i.code === 'NG-101')!;
      const res01 = pristine.resources.find((r) => r.id === 'RES-01')!;
      const availableResources = pristine.resources.filter((r) => r.status === 'available');

      expect(ng101.sectorId).toBe('sector-2');
      expect(res01.stationSector).toBe('sector-2');
      expect(res01.type).toBe('shallow_boat');

      // When: The opportunity cost is calculated for assigning RES-01 to NG-101
      const cost = calculateOpportunityCost(
        res01,
        ng101,
        availableResources,
        pristine.incidents
      );

      // Then:
      // 1. Scarcity is triggered
      expect(cost.hasScarcity).toBe(true);
      expect(cost.remainingCount).toBe(0);

      // 2. Consequence text confirms 0 shallow-draft assets available in Sector 2
      expect(cost.consequenceText).toBe('Leaves 0 shallow-draft assets available in Sector 2');

      // 3. Turnaround penalty displays +35 min delay for next queued incident NG-104
      expect(cost.delayMinutes).toBe(35);
      expect(cost.affectedIncident?.code).toBe('NG-104');
      expect(cost.turnaroundText).toBe('Incident NG-104 will incur an estimated +35 min delay');

      // 4. Invariant 5: Human approval gate required (status remains triaged/unassigned without explicit action)
      expect(ng101.status).toBe('triaged');
      expect(res01.status).toBe('available');
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.6: Resource Assignment Consistency & Audit Log
  // --------------------------------------------------------------------------
  describe('Test 1.6: Resource Assignment Consistency & Audit Log', () => {
    it('transitions resource and incident status to assigned, hides resource from other candidates, and logs immutable entry', () => {
      const store = useAppStore.getState();
      const res01 = store.resources.find((r) => r.id === 'RES-01')!;
      const ng101 = store.incidents.find((i) => i.code === 'NG-101')!;

      // Given: Resource RES-01 is marked available and NG-101 is triaged
      expect(res01.status).toBe('available');
      expect(ng101.status).toBe('triaged');

      // When: Coordinator approves assignment of RES-01 to incident NG-101 using incident ID
      const assigned = store.assignResource(ng101.id, res01.id);
      expect(assigned).toBe(true);

      const afterStore = useAppStore.getState();
      const updatedRes01 = afterStore.resources.find((r) => r.id === 'RES-01')!;
      const updatedNg101 = afterStore.incidents.find((i) => i.code === 'NG-101')!;

      // Then:
      // 1. RES-01.status transitions to assigned
      expect(updatedRes01.status).toBe('assigned');
      expect(updatedRes01.assignedIncidentId).toBe(ng101.id);

      // 2. RES-01 is immediately excluded from available candidate resource lists
      const availableResources = afterStore.resources.filter((r) => r.status === 'available');
      expect(availableResources.some((r) => r.id === 'RES-01')).toBe(false);

      // 3. Incident NG-101.status transitions to assigned
      expect(updatedNg101.status).toBe('assigned');
      expect(updatedNg101.assignedResourceId).toBe(res01.id);

      // 4. An immutable entry is appended to the Activity Audit Log
      const auditLog = afterStore.activityLogs;
      expect(auditLog.length).toBeGreaterThan(0);
      const latestEntry = auditLog[0]; // newest is at index 0
      expect(latestEntry.action).toBe('COORDINATOR_ASSIGN');
      expect(latestEntry.incidentId).toBe(ng101.id);
      expect(latestEntry.resourceId).toBe(res01.id);
      expect(latestEntry.details).toContain('Shallow Jet-Boat 01');
      expect(latestEntry.details).toContain('NG-101');
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.7: Uncertainty Radar Flag Detection
  // --------------------------------------------------------------------------
  describe('Test 1.7: Uncertainty Radar Flag Detection', () => {
    it('accurately identifies missing locations, stale reports, conflicts, and duplicate pairs without auto-merging', () => {
      const incidents = getPristineIncidents();

      // When: Uncertainty Radar detector evaluates all incidents at T+6 (10:30)
      const report = evaluateUncertaintyRadar(incidents, '2026-10-18T10:30:00Z');

      // Then:
      // 1. NG-112 triggers MISSING_LOCATION (coordinates null)
      expect(report.summary.missingLocationCount).toBeGreaterThanOrEqual(1);
      const missingLocIncident = incidents.find((i) => i.code === 'NG-112')!;
      expect(isMissingLocation(missingLocIncident)).toBe(true);

      // 2. NG-111 triggers STALE_REPORT (age > 60 min at T+6, report timestamp 07:00 vs 10:30 = 210m)
      const staleIncident = incidents.find((i) => i.code === 'NG-111')!;
      expect(isStaleReport(staleIncident, '2026-10-18T10:30:00Z')).toBe(true);

      // 3. NG-108 and NG-109 trigger CONFLICTING_REPORT (opposing claims on Main Highway Bridge)
      const conflicts = detectConflictPairs(incidents);
      expect(conflicts.length).toBeGreaterThanOrEqual(1);
      const bridgeConflict = conflicts.find(
        (c) =>
          (c.incidentA.code === 'NG-108' && c.incidentB.code === 'NG-109') ||
          (c.incidentA.code === 'NG-109' && c.incidentB.code === 'NG-108')
      );
      expect(bridgeConflict).toBeDefined();
      expect(bridgeConflict?.landmark).toContain('Main Highway Bridge');

      // 4. NG-104 and NG-110 trigger POTENTIAL_DUPLICATE (same sector, same time window, text similarity >= 0.75)
      const duplicates = detectDuplicatePairs(incidents);
      expect(duplicates.length).toBeGreaterThanOrEqual(1);
      const dupPair = duplicates.find(
        (d) =>
          (d.incidentA.code === 'NG-104' && d.incidentB.code === 'NG-110') ||
          (d.incidentA.code === 'NG-110' && d.incidentB.code === 'NG-104')
      );
      expect(dupPair).toBeDefined();
      expect(dupPair?.similarity).toBeGreaterThanOrEqual(0.75);

      // 5. Invariant 5 / D6: Both reports preserved side-by-side, never auto-merged or deleted
      expect(incidents.find((i) => i.code === 'NG-108')).toBeDefined();
      expect(incidents.find((i) => i.code === 'NG-109')).toBeDefined();
      expect(incidents.find((i) => i.code === 'NG-104')).toBeDefined();
      expect(incidents.find((i) => i.code === 'NG-110')).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.8: Honest AI Fallback Labeling
  // --------------------------------------------------------------------------
  describe('Test 1.8: Honest AI Fallback Labeling', () => {
    it('returns honest heuristic provenance badge and parses cleanly into incident queue', () => {
      // Given: Emergency report submitted when AI is offline or heuristic extraction is invoked
      const reportText = 'Elderly grandmother on dialysis trapped by chest deep water near Gadap canal Sector 2.';

      // When: Fallback heuristic extractor processes the report
      const extraction = extractFactsWithHeuristics(reportText, { phoneAccess: 'has_phone' });

      // Then:
      // 1. isAI is strictly false
      expect(extraction.isAI).toBe(false);

      // 2. Exact honest badge is rendered
      expect(extraction.provenanceBadge).toBe(OFFLINE_FALLBACK_BADGE);
      expect(extraction.provenanceBadge).toBe('Offline heuristic extraction (not AI)');

      // 3. Schema validation succeeds
      const validation = ExtractedFactsSchema.safeParse(extraction.facts);
      expect(validation.success).toBe(true);

      // 4. The report is successfully prioritized in the incident queue
      const scoring = calculatePriorityScore(extraction.factors, { phoneAccess: 'has_phone' });
      expect(scoring.score).toBeGreaterThan(70.0);
      expect(scoring.category).toBe('Critical');
    });
  });

  // --------------------------------------------------------------------------
  // Test 1.9: Pristine 1-Click Simulation Reset
  // --------------------------------------------------------------------------
  describe('Test 1.9: Pristine 1-Click Simulation Reset', () => {
    it('restores pristine baseline seed data, timeline clock, and resource states upon reset', () => {
      const store = useAppStore.getState();

      // Given: Several mutations have occurred
      store.setTimelinePhase('T12');
      const ng101Before = store.incidents.find((i) => i.code === 'NG-101')!;
      const res01Before = store.resources.find((r) => r.id === 'RES-01')!;
      store.assignResource(ng101Before.id, res01Before.id);
      store.setSelectedIncidentId('inc-102');

      const mutatedStore = useAppStore.getState();
      expect(mutatedStore.timelinePhase).toBe('T12');
      expect(mutatedStore.resources.find((r) => r.id === 'RES-01')?.status).toBe('assigned');
      expect(mutatedStore.activityLogs.length).toBeGreaterThan(0);

      // When: Coordinator clicks "Reset Simulation"
      store.resetSimulation();

      const resetStore = useAppStore.getState();

      // Then:
      // 1. Timeline reverts to T-0 Early Warning (04:30)
      expect(resetStore.timelinePhase).toBe('T0');
      expect(resetStore.simulationClock).toBe('2026-10-18T04:30:00Z');

      // 2. All 12 seed incidents match pristine seed data
      expect(resetStore.incidents.length).toBe(12);
      const ng101 = resetStore.incidents.find((i) => i.code === 'NG-101')!;
      expect(ng101.status).toBe('triaged');
      expect(ng101.assignedResourceId).toBeNull();

      // 3. All resources match pristine status (RES-01 available in sector-2)
      const res01 = resetStore.resources.find((r) => r.id === 'RES-01')!;
      expect(res01.status).toBe('available');
      expect(res01.assignedIncidentId).toBeNull();
      expect(res01.stationSector).toBe('sector-2');

      // 4. Selection cleared and simulation reset logged
      expect(resetStore.selectedIncidentId).toBeNull();
      expect(resetStore.activityLogs[0].action).toBe('SIMULATION_RESET');
      expect(resetStore.activityLogs[0].details).toContain('SIMULATION_RESET');
    });
  });

  // --------------------------------------------------------------------------
  // Tier 2 Test Suite: Post-Tier 1 Extensions (docs/acceptance-tests.md Section 2)
  // --------------------------------------------------------------------------
  describe('Tier 2 Acceptance Test Suite (Milestone 10: Tests 2.1 – 2.2)', () => {
    // ------------------------------------------------------------------------
    // Test 2.1: Shelter Capacity & Capability Destination Matching
    // ------------------------------------------------------------------------
    describe('Test 2.1: Shelter Capacity & Capability Destination Matching', () => {
      it('strictly filters SHL-03, deprioritizes SHL-01, selects SHL-02 for NG-101, and increments capacityOccupied', () => {
        const store = useAppStore.getState();
        const ng101 = store.incidents.find((i) => i.code === 'NG-101')!;
        const res01 = store.resources.find((r) => r.id === 'RES-01')!;
        const shelters = store.shelters;

        // When: The shelter allocation engine evaluates candidate destinations for NG-101
        const matchResult = matchShelterForIncident(ng101, shelters);

        // Then:
        // 1. SHL-03 is strictly filtered out (occupancy >= 95% and power failure)
        const shl03 = matchResult.candidates.find((c) => c.shelter.id === 'SHL-03')!;
        expect(shl03.isEligible).toBe(false);
        expect(shl03.exclusionReason).toContain('95%');

        // 2. SHL-01 is deprioritized (lacks medical capability)
        const shl01 = matchResult.candidates.find((c) => c.shelter.id === 'SHL-01')!;
        expect(shl01.isEligible).toBe(true);
        expect(shl01.deprioritizationReason).toContain('Dialysis Support');

        // 3. SHL-02 is selected as the recommended destination
        expect(matchResult.recommendedShelter?.id).toBe('SHL-02');

        // 4. Upon assignment, SHL-02.capacityOccupied increments by the incident headcount (84 -> 86)
        const initialOccupied = shelters.find((s) => s.id === 'SHL-02')!.capacityCurrent;
        expect(initialOccupied).toBe(84);

        store.assignResource(ng101.id, res01.id, 'SHL-02');

        const updatedShelter = useAppStore.getState().shelters.find((s) => s.id === 'SHL-02')!;
        expect(updatedShelter.capacityCurrent).toBe(86);
        expect(updatedShelter.capacityOccupied).toBe(86);
      });
    });

    // ------------------------------------------------------------------------
    // Test 2.2: T-0 Pre-Disaster Baseline Staging Recommendation
    // ------------------------------------------------------------------------
    describe('Test 2.2: T-0 Pre-Disaster Baseline Staging Recommendation', () => {
      it('displays proactive staging recommendation pill for Sector 3A at T-0 with exact rationale', () => {
        const store = useAppStore.getState();
        expect(store.timelinePhase).toBe('T0');

        // When: The coordinator inspects Sector 3A
        const rec = getSectorStagingRecommendation('sector-3a', 'T0');

        // Then:
        // 1. Pre-position pill badge displays "Proactive Staging Recommended"
        expect(rec).not.toBeNull();
        expect(rec?.badgeText).toBe('Proactive Staging Recommended');

        // 2. Recommends pre-positioning RES-01 (Shallow Jet-Boat 01) at High Ground Depot Alpha
        expect(rec?.recommendedResourceId).toBe('RES-01');
        expect(rec?.recommendedResourceCallsign).toBe('Shallow Jet-Boat 01');
        expect(rec?.stagingLocation).toBe('High Ground Depot Alpha');

        // 3. Rationale displays exact specification
        expect(rec?.rationale).toBe(
          'Arterial access road submerges at T+3; 22 isolated elderly registered in sector.'
        );
      });
    });
  });
});
