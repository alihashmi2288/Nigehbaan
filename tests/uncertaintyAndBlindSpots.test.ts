import { describe, it, expect, beforeEach } from 'vitest';
import {
  isMissingLocation,
  isStaleReport,
  calculateTextSimilarity,
  detectConflictPairs,
  detectDuplicatePairs,
  evaluateUncertaintyRadar,
  evaluateSectorHealth,
  synthesizeBlindSpotIncident,
  detectAndSynthesizeBlindSpots,
  BLIND_SPOT_SILENCE_THRESHOLD_MINUTES,
  BLIND_SPOT_MINIMUM_SCORE,
} from '@/lib/uncertainty';
import {
  getPristineIncidents,
  getPristineSectors,
  getPristineState,
} from '@/lib/simulation/seedLoader';
import { useAppStore, selectVisibleIncidents } from '@/store';
import { Incident } from '@/types';

describe('Milestone 6: Uncertainty Radar & Blind-Spot Engine (Tier 1)', () => {
  const incidents = getPristineIncidents();
  const sectors = getPristineSectors();

  beforeEach(() => {
    useAppStore.getState().resetSimulation();
  });

  // --------------------------------------------------------------------------
  // Task T6.1: Uncertainty Radar Detection Engine
  // --------------------------------------------------------------------------
  describe('Task T6.1: Uncertainty Radar Detection Engine (radarDetector.ts)', () => {
    describe('Rule 1: MISSING_LOCATION Detection', () => {
      it('correctly flags NG-112 as missing location (coordinates === null)', () => {
        const ng112 = incidents.find((i) => i.code === 'NG-112')!;
        expect(ng112).toBeDefined();
        expect(ng112.coordinates).toBeNull();
        expect(isMissingLocation(ng112)).toBe(true);
      });

      it('does not flag incidents with valid geographic coordinates', () => {
        const ng101 = incidents.find((i) => i.code === 'NG-101')!;
        const ng102 = incidents.find((i) => i.code === 'NG-102')!;
        const ng103 = incidents.find((i) => i.code === 'NG-103')!;

        expect(isMissingLocation(ng101)).toBe(false);
        expect(isMissingLocation(ng102)).toBe(false);
        expect(isMissingLocation(ng103)).toBe(false);
      });

      it('flags mock incidents with incomplete or invalid coordinate pairs', () => {
        const invalidA = { ...incidents[0], coordinates: [NaN, 67.12] as any };
        const invalidB = { ...incidents[0], coordinates: [24.91, null] as any };
        expect(isMissingLocation(invalidA)).toBe(true);
        expect(isMissingLocation(invalidB)).toBe(true);
      });
    });

    describe('Rule 2: STALE_REPORT Detection', () => {
      it('Acceptance Test 1.7: flags NG-111 as STALE at T+6 (10:30 PKT, age = 210m > 60m threshold)', () => {
        const ng111 = incidents.find((i) => i.code === 'NG-111')!;
        expect(ng111).toBeDefined();
        expect(ng111.timestamp).toBe('2026-10-18T07:00:00Z');

        // At T+6 (10:30)
        const t6Clock = '2026-10-18T10:30:00Z';
        expect(isStaleReport(ng111, t6Clock, 60)).toBe(true);
      });

      it('does NOT flag NG-111 as stale at T+3 (07:30 PKT, age = 30m <= 60m threshold)', () => {
        const ng111 = incidents.find((i) => i.code === 'NG-111')!;
        const t3Clock = '2026-10-18T07:30:00Z';
        expect(isStaleReport(ng111, t3Clock, 60)).toBe(false);
      });

      it('does NOT flag an assigned incident as stale even if age > 60m', () => {
        const ng111Assigned: Incident = {
          ...incidents.find((i) => i.code === 'NG-111')!,
          status: 'assigned',
          assignedResourceId: 'RES-02',
        };
        const t6Clock = '2026-10-18T10:30:00Z';
        expect(isStaleReport(ng111Assigned, t6Clock, 60)).toBe(false);
      });
    });

    describe('Rule 3: CONFLICTING_REPORT Detection', () => {
      it('Acceptance Test 1.7: correctly detects conflict pair NG-108 and NG-109 on Main Highway Bridge', () => {
        const visibleT6 = selectVisibleIncidents(incidents, 'T6');
        const conflictPairs = detectConflictPairs(visibleT6);

        expect(conflictPairs.length).toBeGreaterThanOrEqual(1);
        const bridgeConflict = conflictPairs.find(
          (p) =>
            (p.incidentA.code === 'NG-108' && p.incidentB.code === 'NG-109') ||
            (p.incidentA.code === 'NG-109' && p.incidentB.code === 'NG-108')
        );

        expect(bridgeConflict).toBeDefined();
        expect(bridgeConflict?.landmark).toBe('Main Highway Bridge');
        expect(bridgeConflict?.reason).toContain('Contradictory');
      });

      it('does not flag false conflicts when reports describe distinct locations', () => {
        const subset = incidents.filter((i) => ['NG-101', 'NG-102', 'NG-106'].includes(i.code));
        const conflicts = detectConflictPairs(subset);
        expect(conflicts).toHaveLength(0);
      });
    });

    describe('Rule 4: POTENTIAL_DUPLICATE Detection', () => {
      it('calculates high semantic text similarity (>= 0.75) between NG-104 and NG-110', () => {
        const ng104 = incidents.find((i) => i.code === 'NG-104')!;
        const ng110 = incidents.find((i) => i.code === 'NG-110')!;

        const similarity = calculateTextSimilarity(ng104.reportText, ng110.reportText);
        expect(similarity).toBeGreaterThanOrEqual(0.75);
      });

      it('Acceptance Test 1.7: flags NG-104 and NG-110 as a POTENTIAL_DUPLICATE pair at T+6', () => {
        const visibleT6 = selectVisibleIncidents(incidents, 'T6');
        const duplicatePairs = detectDuplicatePairs(visibleT6, 180, 0.75);

        expect(duplicatePairs.length).toBeGreaterThanOrEqual(1);
        const dupe = duplicatePairs.find(
          (p) =>
            (p.incidentA.code === 'NG-104' && p.incidentB.code === 'NG-110') ||
            (p.incidentA.code === 'NG-110' && p.incidentB.code === 'NG-104')
        );

        expect(dupe).toBeDefined();
        expect(dupe?.sectorId).toBe('sector-2');
        expect(dupe?.timeDeltaMinutes).toBe(175); // 07:15 to 10:10 = 175 minutes (< 180 min)
      });

      it('distinguishes distinct incidents in the same sector (e.g. NG-101 vs NG-104)', () => {
        const ng101 = incidents.find((i) => i.code === 'NG-101')!;
        const ng104 = incidents.find((i) => i.code === 'NG-104')!;

        const similarity = calculateTextSimilarity(ng101.reportText, ng104.reportText);
        expect(similarity).toBeLessThanOrEqual(0.40);
        expect(similarity).toBeLessThan(0.75); // Strictly below duplicate threshold
      });
    });

    describe('Full Radar Evaluation', () => {
      it('correctly aggregates all 4 uncertainty categories at T+6', () => {
        const visibleT6 = selectVisibleIncidents(incidents, 'T6');
        const t6Clock = '2026-10-18T10:30:00Z';

        const result = evaluateUncertaintyRadar(visibleT6, t6Clock);

        // At T+6: NG-111 is stale, NG-108/109 is conflict pair, NG-104/110 is dupe pair, NG-103 is blind spot
        expect(result.summary.staleCount).toBeGreaterThanOrEqual(1);
        expect(result.summary.conflictPairCount).toBe(1);
        expect(result.summary.duplicatePairCount).toBe(1);
        expect(result.summary.blindSpotCount).toBe(1);
        expect(result.totalFlaggedCount).toBeGreaterThanOrEqual(4);
      });

      it('evaluates T+12 crisis clock and includes NG-112 missing location', () => {
        const visibleT12 = selectVisibleIncidents(incidents, 'T12');
        const t12Clock = '2026-10-18T16:30:00Z';

        const result = evaluateUncertaintyRadar(visibleT12, t12Clock);
        expect(result.summary.missingLocationCount).toBe(1);
        expect(result.missingLocationIncidents[0].code).toBe('NG-112');
      });
    });
  });

  // --------------------------------------------------------------------------
  // Task T6.2: Sector Blind-Spot Detector & Incident Synthesizer
  // --------------------------------------------------------------------------
  describe('Task T6.2: Sector Blind-Spot Detector & Synthesizer (blindSpotDetector.ts)', () => {
    const sector3a = sectors.find((s) => s.id === 'sector-3a')!;
    const sector1 = sectors.find((s) => s.id === 'sector-1')!;
    const sector2 = sectors.find((s) => s.id === 'sector-2')!;

    it('evaluates Sector 3A health at T+3 (07:30 PKT): tower is still online, blind spot does NOT fire', () => {
      const t3Clock = '2026-10-18T07:30:00Z';
      const sector3aIncidents = incidents.filter((i) => i.sectorId === 'sector-3a');

      const health = evaluateSectorHealth(sector3a, t3Clock, sector3aIncidents);

      expect(health.isBlindSpotActive).toBe(false);
      expect(health.isTowerOffline).toBe(false); // Tower offlineSince is 08:55
      expect(health.isSilenceBreached).toBe(false);
    });

    it('Acceptance Test 1.4: Sector 3A triggers blind spot at T+6 (10:30 PKT) with all 4 conditions holding', () => {
      const t6Clock = '2026-10-18T10:30:00Z';
      const sector3aIncidents = incidents.filter((i) => i.sectorId === 'sector-3a');

      const health = evaluateSectorHealth(sector3a, t6Clock, sector3aIncidents);

      // Condition 1: Tower offline
      expect(health.isTowerOffline).toBe(true);

      // Condition 2: Silence >= 90 minutes (last report NG-102 at 08:40 -> 110 min silence)
      expect(health.minutesSilent).toBe(110);
      expect(health.isSilenceBreached).toBe(true);
      expect(health.minutesSilent).toBeGreaterThanOrEqual(BLIND_SPOT_SILENCE_THRESHOLD_MINUTES);

      // Condition 3: Flood trend rising
      expect(health.isFloodTrendRising).toBe(true);

      // Condition 4: Gauge level (1.9m) >= hazard threshold (1.2m)
      expect(health.isHazardBreached).toBe(true);
      expect(health.floodLevelMeters).toBe(1.9);
      expect(health.hazardThresholdMeters).toBe(1.2);

      // All 4 hold:
      expect(health.isBlindSpotActive).toBe(true);
    });

    it('evaluates non-blind-spot sectors (Sector 1, Sector 2) as healthy even at T+6', () => {
      const t6Clock = '2026-10-18T10:30:00Z';

      const healthS1 = evaluateSectorHealth(sector1, t6Clock, incidents.filter((i) => i.sectorId === 'sector-1'));
      const healthS2 = evaluateSectorHealth(sector2, t6Clock, incidents.filter((i) => i.sectorId === 'sector-2'));

      expect(healthS1.isBlindSpotActive).toBe(false);
      expect(healthS2.isBlindSpotActive).toBe(false);
    });

    it('Acceptance Test 1.4: synthesizes NG-103 with deterministic score 68.7, Category High, and floor >= 60.0', () => {
      const t6Clock = '2026-10-18T10:30:00Z';
      const synthetic = synthesizeBlindSpotIncident(sector3a, t6Clock);

      expect(synthetic.code).toBe('NG-103');
      expect(synthetic.sectorId).toBe('sector-3a');
      expect(synthetic.reporterType).toBe('system_blind_spot');
      expect(synthetic.phoneAccess).toBe('network_down');

      // Factors: [LifeThreat 2.5, Medical null, Evacuation 4.0, Environmental 4.5, Population 3.5]
      expect(synthetic.factors[0]).toBe(2.5);
      expect(synthetic.factors[1]).toBeNull();
      expect(synthetic.factors[2]).toBe(4.0); // Evacuation floor
      expect(synthetic.factors[3]).toBe(4.5); // Environmental danger
      expect(synthetic.factors[4]).toBe(3.5);

      // Calculated score is exactly 68.7
      expect(synthetic.score).toBe(68.7);
      expect(synthetic.score).toBeGreaterThanOrEqual(BLIND_SPOT_MINIMUM_SCORE);

      // Invariant 3: Category is High, NEVER auto-Critical
      expect(synthetic.category).toBe('High');
      expect(synthetic.category).not.toBe('Critical');

      // Required label
      expect(synthetic.label).toBe('Physical Welfare Recon / Field Sweep');

      // Asset and destination recommendations
      expect(synthetic.targetResource).toBe('recon_patrol');
      expect(synthetic.targetShelter).toBe('SHL-01');
      expect(synthetic.uncertaintyFlags).toContain('COVERAGE_BLIND_SPOT');
    });

    it('detectAndSynthesizeBlindSpots identifies Sector 3A and synthesizes incident if absent', () => {
      const t6Clock = '2026-10-18T10:30:00Z';
      // Pass incidents without NG-103
      const incidentsWithout103 = incidents.filter((i) => i.code !== 'NG-103');

      const { healthChecks, synthesizedIncidents } = detectAndSynthesizeBlindSpots(
        sectors,
        t6Clock,
        incidentsWithout103
      );

      const s3Health = healthChecks.find((h) => h.sectorId === 'sector-3a');
      expect(s3Health?.isBlindSpotActive).toBe(true);

      expect(synthesizedIncidents).toHaveLength(1);
      expect(synthesizedIncidents[0].code).toBe('NG-103');
      expect(synthesizedIncidents[0].score).toBe(68.7);
    });
  });

  // --------------------------------------------------------------------------
  // Task T6.3: UI & Store Integration
  // --------------------------------------------------------------------------
  describe('Task T6.3: Uncertainty Radar & Conflict Gate Store Integration', () => {
    it('Invariant 5: never auto-merges or deletes conflicting reports (NG-108 and NG-109)', () => {
      const store = useAppStore.getState();
      store.setTimelinePhase('T6');

      const stateIncidents = useAppStore.getState().incidents;
      const ng108 = stateIncidents.find((i) => i.code === 'NG-108');
      const ng109 = stateIncidents.find((i) => i.code === 'NG-109');

      // Both must exist independently
      expect(ng108).toBeDefined();
      expect(ng109).toBeDefined();
      expect(ng108?.id).not.toBe(ng109?.id);

      // Verify scores are preserved separately
      expect(ng108?.score).toBe(11.0);
      expect(ng109?.score).toBe(50.0);
    });

    it('appends BLIND_SPOT_SYNTHESIS audit log when advancing timeline to T+6', () => {
      const store = useAppStore.getState();
      expect(store.timelinePhase).toBe('T0');

      store.setTimelinePhase('T6');

      const state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T6');

      const blindSpotLog = state.activityLogs.find(
        (log) => log.action === 'BLIND_SPOT_SYNTHESIS'
      );
      expect(blindSpotLog).toBeDefined();
      expect(blindSpotLog?.details).toContain('Sector 3A communication blackout');
      expect(blindSpotLog?.details).toContain('NG-103');
      expect(blindSpotLog?.details).toContain('68.7');
    });

    it('1-Click Reset restores all radar flags to pristine T-0 baseline', () => {
      const store = useAppStore.getState();
      store.setTimelinePhase('T12');

      let state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T12');

      store.resetSimulation();

      state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T0');

      const visible = selectVisibleIncidents(state.incidents, 'T0');
      const t0Clock = '2026-10-18T04:30:00Z';
      const radar = evaluateUncertaintyRadar(visible, t0Clock);

      // At T0: only NG-106 and NG-107 are visible, neither is stale or conflict
      expect(radar.summary.staleCount).toBe(0);
      expect(radar.summary.conflictPairCount).toBe(0);
      expect(radar.summary.missingLocationCount).toBe(0);
      expect(radar.summary.blindSpotCount).toBe(0);
    });
  });
});
