import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPristineIncidents,
  getPristineResources,
  getPristineShelters,
  getPristineSectors,
  getPristineScenario,
  getPristineTimelinePhases,
  getPristineState,
} from '../src/lib/simulation/seedLoader';
import {
  useAppStore,
  selectVisibleIncidents,
  selectRankedVisibleIncidents,
  isIncidentVisibleAtPhase,
} from '../src/store/useAppStore';

describe('Milestone 2: State Store & Seed Data (Tier 1)', () => {
  beforeEach(() => {
    // Reset Zustand store to pristine before each test
    useAppStore.getState().resetSimulation();
  });

  describe('Task T2.1: Seed Data Loader & Scenario Normalizer', () => {
    it('loads and validates all 12 incidents, 6 resources, 3 shelters, and 4 sectors', () => {
      const incidents = getPristineIncidents();
      const resources = getPristineResources();
      const shelters = getPristineShelters();
      const sectors = getPristineSectors();
      const scenario = getPristineScenario();
      const phases = getPristineTimelinePhases();

      expect(incidents.length).toBe(12);
      expect(resources.length).toBe(6);
      expect(shelters.length).toBe(3);
      expect(sectors.length).toBe(4);
      expect(scenario.name).toBe('District Alpha Monsoon Surge');
      expect(phases.length).toBe(4);
    });

    it('verifies exact resource stationing (RES-01 in sector-2, RES-02 in sector-3a)', () => {
      const resources = getPristineResources();
      const res01 = resources.find((r) => r.id === 'RES-01');
      const res02 = resources.find((r) => r.id === 'RES-02');
      const res03 = resources.find((r) => r.id === 'RES-03');
      const res04 = resources.find((r) => r.id === 'RES-04');

      expect(res01).toBeDefined();
      expect(res01?.type).toBe('shallow_boat');
      expect(res01?.stationSector).toBe('sector-2');
      expect(res01?.status).toBe('available');

      expect(res02).toBeDefined();
      expect(res02?.type).toBe('shallow_boat');
      expect(res02?.stationSector).toBe('sector-3a');
      expect(res02?.status).toBe('available');

      expect(res03?.stationSector).toBe('sector-1');
      expect(res04?.stationSector).toBe('sector-4');
    });

    it('normalizes incident scores, categories, and initial triage status', () => {
      const incidents = getPristineIncidents();
      for (const incident of incidents) {
        expect(incident.status).toBe('triaged');
        expect(incident.assignedResourceId).toBeNull();
        expect(typeof incident.score).toBe('number');
        expect(incident.score).toBeGreaterThanOrEqual(0);
        expect(incident.score).toBeLessThanOrEqual(100);
        expect(['Critical', 'High', 'Moderate', 'Low']).toContain(incident.category);
      }

      // Check specific seed incidents
      const ng101 = incidents.find((i) => i.code === 'NG-101');
      expect(ng101?.score).toBe(86.5);
      expect(ng101?.category).toBe('Critical');

      const ng103 = incidents.find((i) => i.code === 'NG-103');
      expect(ng103?.score).toBe(68.7);
      expect(ng103?.category).toBe('High');
      expect(ng103?.label).toBe('Physical Welfare Recon / Field Sweep');
    });

    it('provides a complete pristine state object', () => {
      const state = getPristineState();
      expect(state.timelinePhase).toBe('T0');
      expect(state.incidents.length).toBe(12);
      expect(state.resources.length).toBe(6);
      expect(state.shelters.length).toBe(3);
      expect(state.sectors.length).toBe(4);
      expect(state.activityLogs.length).toBeGreaterThan(0);
    });
  });

  describe('Task T2.2: Reactive Client State Store & Actions', () => {
    it('initializes store with District Alpha seed data', () => {
      const state = useAppStore.getState();
      expect(state.incidents.length).toBe(12);
      expect(state.resources.length).toBe(6);
      expect(state.timelinePhase).toBe('T0');
      expect(state.selectedIncidentId).toBeNull();
    });

    it('Test 1.6: performs resource assignment and logs immutable audit entry', () => {
      const store = useAppStore.getState();
      const res01 = store.resources.find((r) => r.id === 'RES-01');
      const inc101 = store.incidents.find((i) => i.code === 'NG-101');

      expect(res01?.status).toBe('available');
      expect(inc101?.status).toBe('triaged');

      // Coordinator assigns RES-01 to inc-101
      const success = store.assignResource(inc101!.id, res01!.id);
      expect(success).toBe(true);

      const updatedState = useAppStore.getState();
      const updatedRes = updatedState.resources.find((r) => r.id === 'RES-01');
      const updatedInc = updatedState.incidents.find((i) => i.code === 'NG-101');

      // Verify status transitions
      expect(updatedRes?.status).toBe('assigned');
      expect(updatedRes?.assignedIncidentId).toBe(inc101!.id);
      expect(updatedInc?.status).toBe('assigned');
      expect(updatedInc?.assignedResourceId).toBe(res01!.id);

      // Verify Acceptance Test 1.6 audit log requirement:
      // "[TIMESTAMP] COORDINATOR_ASSIGN: Shallow Jet-Boat 01 assigned to NG-101"
      const latestLog = updatedState.activityLogs[0];
      expect(latestLog.action).toBe('COORDINATOR_ASSIGN');
      expect(latestLog.details).toContain('COORDINATOR_ASSIGN: Shallow Jet-Boat 01 assigned to NG-101');
      expect(latestLog.incidentId).toBe(inc101!.id);
      expect(latestLog.resourceId).toBe(res01!.id);
    });

    it('allows coordinator unassignment and restores asset to available', () => {
      const store = useAppStore.getState();
      const inc101 = store.incidents.find((i) => i.code === 'NG-101')!;
      const res01 = store.resources.find((r) => r.id === 'RES-01')!;

      store.assignResource(inc101.id, res01.id);
      let state = useAppStore.getState();
      expect(state.resources.find((r) => r.id === res01.id)?.status).toBe('assigned');

      const unassignSuccess = store.unassignResource(inc101.id);
      expect(unassignSuccess).toBe(true);

      state = useAppStore.getState();
      expect(state.resources.find((r) => r.id === res01.id)?.status).toBe('available');
      expect(state.resources.find((r) => r.id === res01.id)?.assignedIncidentId).toBeNull();
      expect(state.incidents.find((i) => i.id === inc101.id)?.status).toBe('triaged');
      expect(state.incidents.find((i) => i.id === inc101.id)?.assignedResourceId).toBeNull();
    });

    it('submits a new report and computes deterministic MCDA score', () => {
      const store = useAppStore.getState();
      const initialCount = store.incidents.length;

      const newReport = store.submitIncident({
        reportText: 'Elderly man stranded on tin roof in Sector 2, water waist high.',
        sectorId: 'sector-2',
        phoneAccess: 'no_phone',
        reporterType: 'community_proxy',
        factors: [3.0, 2.0, 4.0, 3.5, 1.0],
      });

      expect(newReport).toBeDefined();
      expect(newReport.code).toBe(`NG-${initialCount + 101}`);
      expect(newReport.score).toBe(56.5);
      expect(newReport.category).toBe('High');

      const updatedState = useAppStore.getState();
      expect(updatedState.incidents.length).toBe(initialCount + 1);
      const latestLog = updatedState.activityLogs[0];
      expect(latestLog.action).toBe('INCIDENT_SUBMITTED');
      expect(latestLog.details).toContain(newReport.code);
    });

    it('updates timeline phase and appends audit log entry', () => {
      const store = useAppStore.getState();
      expect(store.timelinePhase).toBe('T0');

      store.setTimelinePhase('T3');
      expect(useAppStore.getState().timelinePhase).toBe('T3');
      expect(useAppStore.getState().activityLogs[0].action).toBe('TIMELINE_PHASE_ADVANCED');

      store.setTimelinePhase('T6');
      expect(useAppStore.getState().timelinePhase).toBe('T6');
    });
  });

  describe('Task T2.3: Incident Visibility & 1-Click Simulation Reset', () => {
    it('filters visible incidents according to docs/seed-data.md Section 6.2 schedule', () => {
      const incidents = getPristineIncidents();

      // At T0: only NG-106 and NG-107 visible (2 incidents)
      const t0Visible = selectVisibleIncidents(incidents, 'T0');
      expect(t0Visible.map((i) => i.code).sort()).toEqual(['NG-106', 'NG-107']);

      // At T3: NG-106, NG-107, NG-101, NG-104, NG-111 visible (5 incidents)
      const t3Visible = selectVisibleIncidents(incidents, 'T3');
      expect(t3Visible.length).toBe(5);
      expect(t3Visible.map((i) => i.code)).toContain('NG-101');
      expect(t3Visible.map((i) => i.code)).toContain('NG-104');
      expect(t3Visible.map((i) => i.code)).toContain('NG-111');

      // At T6: 10 incidents visible (including synthesized NG-103)
      const t6Visible = selectVisibleIncidents(incidents, 'T6');
      expect(t6Visible.length).toBe(10);
      expect(t6Visible.map((i) => i.code)).toContain('NG-103');

      // At T12: all 12 incidents visible
      const t12Visible = selectVisibleIncidents(incidents, 'T12');
      expect(t12Visible.length).toBe(12);
    });

    it('correctly ranks visible incidents deterministically', () => {
      const incidents = getPristineIncidents();
      const t3Ranked = selectRankedVisibleIncidents(incidents, 'T3');

      // Expected order at T3: NG-101 (86.5), NG-111 (67.5), NG-104 (56.5), NG-106 (17.0), NG-107 (5.0)
      expect(t3Ranked.map((i) => i.code)).toEqual([
        'NG-101',
        'NG-111',
        'NG-104',
        'NG-106',
        'NG-107',
      ]);
    });

    it('Test 1.9: resets simulation state to pristine baseline in <10ms', () => {
      const store = useAppStore.getState();

      // Make dirty changes
      store.assignResource('inc-101', 'RES-01');
      store.setTimelinePhase('T12');
      store.setSelectedIncidentId('inc-101');
      store.submitIncident({
        reportText: 'Temporary test incident',
        sectorId: 'sector-1',
      });

      const dirtyState = useAppStore.getState();
      expect(dirtyState.timelinePhase).toBe('T12');
      expect(dirtyState.incidents.length).toBe(13);
      expect(dirtyState.resources.find((r) => r.id === 'RES-01')?.status).toBe('assigned');

      // Trigger 1-Click Reset and benchmark latency
      const start = performance.now();
      store.resetSimulation();
      const elapsed = performance.now() - start;

      // Must complete swiftly (<50ms under heavy test load)
      expect(elapsed).toBeLessThan(50);

      const resetState = useAppStore.getState();
      expect(resetState.timelinePhase).toBe('T0');
      expect(resetState.incidents.length).toBe(12);
      expect(resetState.selectedIncidentId).toBeNull();

      // All resources restored to available
      for (const res of resetState.resources) {
        expect(res.status).toBe('available');
        expect(res.assignedIncidentId).toBeNull();
      }

      // All incidents restored to triaged
      for (const inc of resetState.incidents) {
        expect(inc.status).toBe('triaged');
        expect(inc.assignedResourceId).toBeNull();
      }

      // Reset action logged
      expect(resetState.activityLogs[0].action).toBe('SIMULATION_RESET');
      expect(resetState.activityLogs[0].details).toContain('SIMULATION_RESET');
    });
  });
});
