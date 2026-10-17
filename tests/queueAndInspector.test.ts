import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, selectRankedVisibleIncidents, selectVisibleIncidents } from '@/store';
import { rankIncidentQueue } from '@/lib/triage/queueRanker';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';
import { generateExplainabilityRationale } from '@/lib/triage/explainabilityGenerator';
import { Incident } from '@/types';

describe('Milestone 4: Triage Queue & Incident Inspector Test Suite', () => {
  beforeEach(() => {
    useAppStore.getState().resetSimulation();
  });

  describe('Task T4.1: Filterable Triage Incident Queue', () => {
    it('ranks NG-101 at score 86.5 at the top of the queue at T+3 Flood Surge', () => {
      const state = useAppStore.getState();
      state.setTimelinePhase('T3');

      const ranked = selectRankedVisibleIncidents(
        useAppStore.getState().incidents,
        'T3'
      );

      expect(ranked.length).toBeGreaterThan(0);
      const topIncident = ranked[0];
      expect(topIncident.code).toBe('NG-101');
      expect(topIncident.score).toBeCloseTo(86.5, 1);
      expect(topIncident.category).toBe('Critical');
    });

    it('enforces deterministic 3-tier queue ranking order across all visible incidents', () => {
      const state = useAppStore.getState();
      state.setTimelinePhase('T3');

      const ranked = selectRankedVisibleIncidents(state.incidents, 'T3');

      for (let i = 0; i < ranked.length - 1; i++) {
        const a = ranked[i];
        const b = ranked[i + 1];

        const scoreA = a.score ?? a.expectedScore ?? 0;
        const scoreB = b.score ?? b.expectedScore ?? 0;

        if (Math.abs(scoreA - scoreB) > 0.1) {
          expect(scoreA).toBeGreaterThanOrEqual(scoreB);
        } else {
          // Tie-break: lower confidence ranks higher
          const confA = a.confidence ?? 1.0;
          const confB = b.confidence ?? 1.0;
          if (Math.abs(confA - confB) > 0.001) {
            expect(confA).toBeLessThanOrEqual(confB);
          }
        }
      }
    });

    it('filters visible incidents accurately by sector', () => {
      const state = useAppStore.getState();
      state.setTimelinePhase('T3');

      const visible = selectRankedVisibleIncidents(state.incidents, 'T3');
      const sector2Incidents = visible.filter((i) => i.sectorId === 'sector-2');

      expect(sector2Incidents.length).toBeGreaterThan(0);
      expect(sector2Incidents.every((i) => i.sectorId === 'sector-2')).toBe(true);
    });

    it('filters visible incidents accurately by priority category', () => {
      const state = useAppStore.getState();
      state.setTimelinePhase('T3');

      const visible = selectRankedVisibleIncidents(state.incidents, 'T3');
      const criticalIncidents = visible.filter((i) => i.category === 'Critical');

      expect(criticalIncidents.length).toBeGreaterThan(0);
      expect(criticalIncidents.every((i) => i.category === 'Critical')).toBe(true);
      expect(criticalIncidents.some((i) => i.code === 'NG-101')).toBe(true);
    });
  });

  describe('Task T4.2: Incident Detail Inspector & Factor Breakdown Card', () => {
    it('displays NG-101 factors exactly matching [4.5, 5.0, 4.0, 4.5, 2.5] and computes score 86.5', () => {
      const state = useAppStore.getState();
      const ng101 = state.incidents.find((i) => i.code === 'NG-101')!;

      expect(ng101).toBeDefined();
      expect(ng101.factors).toEqual([4.5, 5.0, 4.0, 4.5, 2.5]);

      const scoreResult = calculatePriorityScore(ng101.factors, {
        reporterType: ng101.reporterType,
        phoneAccess: ng101.phoneAccess,
      });

      expect(scoreResult.score).toBeCloseTo(86.5, 1);
      expect(scoreResult.category).toBe('Critical');
      expect(scoreResult.confidence).toBe(1.0);
      expect(scoreResult.isRenormalized).toBe(false);
    });

    it('renormalizes missing factors correctly for NG-112 to score 60.0 (High) with confidence 0.45', () => {
      const state = useAppStore.getState();
      const ng112 = state.incidents.find((i) => i.code === 'NG-112')!;

      expect(ng112).toBeDefined();
      expect(ng112.factors).toEqual([3.0, null, null, 3.0, null]);

      const scoreResult = calculatePriorityScore(ng112.factors, {
        reporterType: ng112.reporterType,
        phoneAccess: ng112.phoneAccess,
      });

      // 100 * [ (0.30 * 3.0/5.0) + (0.15 * 3.0/5.0) ] / 0.45 = 60.0
      expect(scoreResult.score).toBeCloseTo(60.0, 1);
      expect(scoreResult.category).toBe('High');
      expect(scoreResult.confidence).toBeCloseTo(0.45, 2);
      expect(scoreResult.isRenormalized).toBe(true);
    });

    it('synchronizes selected incident in store when inspector selection changes', () => {
      const state = useAppStore.getState();
      expect(state.selectedIncidentId).toBeNull();

      const ng101 = state.incidents.find((i) => i.code === 'NG-101')!;
      state.setSelectedIncidentId(ng101.id);

      expect(useAppStore.getState().selectedIncidentId).toBe(ng101.id);

      state.setSelectedIncidentId(null);
      expect(useAppStore.getState().selectedIncidentId).toBeNull();
    });

    it('allows coordinator to assign and unassign resources to selected incident', () => {
      const state = useAppStore.getState();
      const ng101 = state.incidents.find((i) => i.code === 'NG-101')!;
      const res01 = state.resources.find((r) => r.id === 'RES-01')!;

      expect(res01.status).toBe('available');
      expect(ng101.assignedResourceId).toBeNull();

      // Assign resource
      const success = state.assignResource(ng101.id, res01.id);
      expect(success).toBe(true);

      const updatedIncident = useAppStore.getState().incidents.find((i) => i.id === ng101.id)!;
      const updatedResource = useAppStore.getState().resources.find((r) => r.id === res01.id)!;

      expect(updatedIncident.status).toBe('assigned');
      expect(updatedIncident.assignedResourceId).toBe('RES-01');
      expect(updatedResource.status).toBe('assigned');
      expect(updatedResource.assignedIncidentId).toBe(ng101.id);

      // Verify immutable audit log entry
      const latestLog = useAppStore.getState().activityLogs[0];
      expect(latestLog.action).toBe('COORDINATOR_ASSIGN');
      expect(latestLog.resourceId).toBe('RES-01');
      expect(latestLog.details).toContain(res01.callsign);
      expect(latestLog.details).toContain('NG-101');

      // Unassign resource
      const unassignSuccess = useAppStore.getState().unassignResource(ng101.id);
      expect(unassignSuccess).toBe(true);

      const unassignedIncident = useAppStore.getState().incidents.find((i) => i.id === ng101.id)!;
      const unassignedResource = useAppStore.getState().resources.find((r) => r.id === res01.id)!;

      expect(unassignedIncident.assignedResourceId).toBeNull();
      expect(unassignedResource.status).toBe('available');
    });
  });

  describe('Task T4.3: Explainability Rationale Generation', () => {
    it('generates 2-3 concise auditable bullets for critical dialysis incident NG-101', () => {
      const state = useAppStore.getState();
      const ng101 = state.incidents.find((i) => i.code === 'NG-101')!;

      const rationale = generateExplainabilityRationale(ng101);

      expect(rationale.isDeterministic).toBe(true);
      expect(rationale.source).toBe('deterministic_rules');
      expect(rationale.bullets.length).toBeGreaterThanOrEqual(2);
      expect(rationale.bullets.length).toBeLessThanOrEqual(3);
      expect(rationale.primaryDriver).toContain('Medical Dependency');
      expect(rationale.bullets[0].toLowerCase()).toContain('medical urgency');
      expect(rationale.confidencePercent).toBe(100);
    });

    it('explains unknown factor renormalization explicitly for NG-112', () => {
      const state = useAppStore.getState();
      const ng112 = state.incidents.find((i) => i.code === 'NG-112')!;

      const rationale = generateExplainabilityRationale(ng112);

      expect(rationale.bullets.length).toBeGreaterThanOrEqual(2);
      expect(rationale.confidencePercent).toBe(45);
      expect(rationale.knownFactorCount).toBe(2);

      const renormBullet = rationale.bullets.find((b) =>
        b.toLowerCase().includes('renormalized')
      );
      expect(renormBullet).toBeDefined();
      expect(renormBullet).toContain('45%');
    });

    it('explains no-phone floor enforcement for proxy report NG-104', () => {
      const state = useAppStore.getState();
      const ng104 = state.incidents.find((i) => i.code === 'NG-104')!;

      const rationale = generateExplainabilityRationale(ng104);

      const floorBullet = rationale.bullets.find((b) =>
        b.toLowerCase().includes('phone')
      );
      expect(floorBullet).toBeDefined();
      expect(floorBullet).toContain('f₃ ≥ 4.0');
    });

    it('explains system blind-spot recon sweep for NG-103', () => {
      const state = useAppStore.getState();
      const ng103 = state.incidents.find((i) => i.code === 'NG-103')!;

      const rationale = generateExplainabilityRationale(ng103);

      expect(rationale.primaryDriver).toContain('Telemetry Silence');
      expect(rationale.bullets.some((b) => b.includes('Blind-Spot Floor'))).toBe(true);
      expect(rationale.bullets.some((b) => b.includes('60.0'))).toBe(true);
    });
  });
});
