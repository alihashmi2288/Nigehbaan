import { describe, it, expect, beforeEach } from 'vitest';
import {
  useAppStore,
  selectVisibleIncidents,
  selectRankedVisibleIncidents,
  isIncidentVisibleAtPhase,
} from '@/store/useAppStore';
import { getPristineIncidents } from '@/lib/simulation/seedLoader';
import { evaluateSectorHealth } from '@/lib/uncertainty';

describe('Milestone 8: Disaster Timeline Scrubber & Telemetry (Tier 1)', () => {
  beforeEach(() => {
    useAppStore.getState().resetSimulation();
  });

  // --------------------------------------------------------------------------
  // Task T8.1: Interactive Disaster Timeline Scrubber Component & Store State
  // --------------------------------------------------------------------------
  describe('Task T8.1: Interactive Disaster Timeline Scrubber State', () => {
    it('initializes store at T-0 Early Warning baseline with wall clock 04:30 PKT', () => {
      const state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T0');
      expect(state.simulationClock).toBe('2026-10-18T04:30:00Z');
      expect(state.scenario.timelinePhases).toHaveLength(4);

      const t0Phase = state.scenario.timelinePhases.find((p) => p.id === 'T0')!;
      expect(t0Phase.label).toBe('T-0 Early Warning');
      expect(t0Phase.riverGauge).toBe(0.6);
      expect(t0Phase.hazardLevel).toBe('Normal');
    });

    it('updates timelinePhase and simulationClock when scrubbing between all 4 discrete phases', () => {
      const store = useAppStore.getState();

      // Scrub to T+3 Flood Surge
      store.setTimelinePhase('T3');
      let state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T3');
      expect(state.simulationClock).toBe('2026-10-18T07:30:00Z');

      // Scrub to T+6 Grid Blackout
      store.setTimelinePhase('T6');
      state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T6');
      expect(state.simulationClock).toBe('2026-10-18T10:30:00Z');

      // Scrub to T+12 Peak Crisis
      store.setTimelinePhase('T12');
      state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T12');
      expect(state.simulationClock).toBe('2026-10-18T16:30:00Z');

      // Scrub back to T-0
      store.setTimelinePhase('T0');
      state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T0');
      expect(state.simulationClock).toBe('2026-10-18T04:30:00Z');
    });

    it('verifies phase metadata for environmental gauges and hazard levels', () => {
      const phases = useAppStore.getState().scenario.timelinePhases;

      expect(phases[0]).toMatchObject({
        id: 'T0',
        riverGauge: 0.6,
        hazardLevel: 'Normal',
      });
      expect(phases[1]).toMatchObject({
        id: 'T3',
        riverGauge: 1.3,
        hazardLevel: 'High',
      });
      expect(phases[2]).toMatchObject({
        id: 'T6',
        riverGauge: 1.9,
        hazardLevel: 'Severe',
      });
      expect(phases[3]).toMatchObject({
        id: 'T12',
        riverGauge: 2.4,
        hazardLevel: 'Catastrophic',
      });
    });
  });

  // --------------------------------------------------------------------------
  // Task T8.2: Dynamic Telemetry & Visibility Filter Integration
  // --------------------------------------------------------------------------
  describe('Task T8.2: Dynamic Telemetry & Visibility Filter Integration', () => {
    it('Acceptance Criteria: Advancing from T-0 to T+3 reveals NG-101, NG-111, NG-104; advancing to T+6 reveals NG-102, NG-103, NG-108, NG-109, NG-110', () => {
      const allIncidents = getPristineIncidents();

      // At T-0 (04:30): only baseline incidents NG-106 and NG-107 are visible
      const visibleT0 = selectVisibleIncidents(allIncidents, 'T0', '2026-10-18T04:30:00Z');
      const codesT0 = visibleT0.map((i) => i.code);
      expect(visibleT0).toHaveLength(2);
      expect(codesT0).toContain('NG-106');
      expect(codesT0).toContain('NG-107');
      expect(codesT0).not.toContain('NG-101');
      expect(codesT0).not.toContain('NG-103');

      // At T+3 (07:30): reveals NG-101, NG-111, NG-104 (total 5)
      const visibleT3 = selectVisibleIncidents(allIncidents, 'T3', '2026-10-18T07:30:00Z');
      const codesT3 = visibleT3.map((i) => i.code);
      expect(visibleT3).toHaveLength(5);
      expect(codesT3).toContain('NG-106');
      expect(codesT3).toContain('NG-107');
      expect(codesT3).toContain('NG-101'); // Dialysis Critical
      expect(codesT3).toContain('NG-111'); // School Stranded
      expect(codesT3).toContain('NG-104'); // Proxy Elderly
      expect(codesT3).not.toContain('NG-102');
      expect(codesT3).not.toContain('NG-103');

      // At T+6 (10:30): reveals NG-102, NG-103, NG-108, NG-109, NG-110 (total 10)
      const visibleT6 = selectVisibleIncidents(allIncidents, 'T6', '2026-10-18T10:30:00Z');
      const codesT6 = visibleT6.map((i) => i.code);
      expect(visibleT6).toHaveLength(10);
      expect(codesT6).toContain('NG-102'); // Voice Hotline Call
      expect(codesT6).toContain('NG-103'); // Blind Spot Synthesized
      expect(codesT6).toContain('NG-108'); // Bridge Conflict A
      expect(codesT6).toContain('NG-109'); // Bridge Conflict B
      expect(codesT6).toContain('NG-110'); // Duplicate pair
      expect(codesT6).not.toContain('NG-105');
      expect(codesT6).not.toContain('NG-112');

      // At T+12 (16:30): reveals NG-105 and NG-112 (total 12)
      const visibleT12 = selectVisibleIncidents(allIncidents, 'T12', '2026-10-18T16:30:00Z');
      const codesT12 = visibleT12.map((i) => i.code);
      expect(visibleT12).toHaveLength(12);
      expect(codesT12).toContain('NG-105');
      expect(codesT12).toContain('NG-112');
    });

    it('verifies deterministic priority ranking order across timeline progression', () => {
      const allIncidents = getPristineIncidents();

      // At T+3: Top 3 must be NG-101 (Critical 86.5), NG-111 (High 67.5), NG-104 (High 56.5)
      const rankedT3 = selectRankedVisibleIncidents(allIncidents, 'T3', '2026-10-18T07:30:00Z');
      expect(rankedT3[0].code).toBe('NG-101');
      expect(rankedT3[1].code).toBe('NG-111');
      expect(rankedT3[2].code).toBe('NG-104');

      // At T+6: Top 4 must be NG-101 (86.5), NG-102 (81.0), NG-103 (68.7), NG-111 (67.5)
      const rankedT6 = selectRankedVisibleIncidents(allIncidents, 'T6', '2026-10-18T10:30:00Z');
      expect(rankedT6[0].code).toBe('NG-101');
      expect(rankedT6[1].code).toBe('NG-102');
      expect(rankedT6[2].code).toBe('NG-103');
      expect(rankedT6[3].code).toBe('NG-111');
    });

    it('triggers Tower-Alpha-3 collapse and blind-spot synthesis event when advancing to T+6', () => {
      const store = useAppStore.getState();

      // Initially at T-0: Sector 3A tower has offlineSince 08:55, so it is operational at 04:30
      const sector3aT0 = store.sectors.find((s) => s.id === 'sector-3a')!;
      const healthT0 = evaluateSectorHealth(
        sector3aT0,
        store.simulationClock,
        store.incidents.filter((i) => i.sectorId === 'sector-3a')
      );
      expect(healthT0.isTowerOffline).toBe(false);

      // Advance to T+6
      store.setTimelinePhase('T6');
      const state = useAppStore.getState();

      // Sector 3A cell tower collapsed
      const sector3aT6 = state.sectors.find((s) => s.id === 'sector-3a')!;
      expect(sector3aT6.cellTower.status).toBe('offline');
      expect(sector3aT6.cellTower.offlineSince).toBe('2026-10-18T08:55:00Z');

      const healthT6 = evaluateSectorHealth(
        sector3aT6,
        state.simulationClock,
        state.incidents.filter((i) => i.sectorId === 'sector-3a')
      );
      expect(healthT6.isTowerOffline).toBe(true);
      expect(healthT6.isBlindSpotActive).toBe(true);

      // Verifies infrastructure alert and blind-spot synthesis logs
      const towerLog = state.activityLogs.find((l) => l.action === 'INFRASTRUCTURE_ALERT');
      expect(towerLog).toBeDefined();
      expect(towerLog?.details).toContain('Tower-Alpha-3 collapsed');

      const blindSpotLog = state.activityLogs.find((l) => l.action === 'BLIND_SPOT_SYNTHESIS');
      expect(blindSpotLog).toBeDefined();
      expect(blindSpotLog?.details).toContain('NG-103');

      // NG-103 is present in state with score 68.7, Category High, Floor >= 60.0
      const ng103 = state.incidents.find((i) => i.code === 'NG-103');
      expect(ng103).toBeDefined();
      expect(ng103?.score).toBe(68.7);
      expect(ng103?.category).toBe('High');
      expect(ng103?.label).toBe('Physical Welfare Recon / Field Sweep');
    });

    it('triggers SHL-03 generator loss infrastructure event when advancing to T+12', () => {
      const store = useAppStore.getState();

      // Advance to T+12 Peak Crisis
      store.setTimelinePhase('T12');
      const state = useAppStore.getState();

      // SHL-03 lost generator and is overcrowded
      const shl03 = state.shelters.find((s) => s.id === 'SHL-03')!;
      expect(shl03.backupGenerator).toBe(false);
      expect(shl03.status).toBe('overcrowded');

      // Verifies shelter alert in audit logs
      const shelterLog = state.activityLogs.find(
        (l) => l.action === 'INFRASTRUCTURE_ALERT' && l.details.includes('SHL-03')
      );
      expect(shelterLog).toBeDefined();
      expect(shelterLog?.details).toContain('SHL-03 (Highway Warehouse Relief Depot) generator failed');
    });

    it('restores baseline simulation clock and seed data on 1-click Reset', () => {
      const store = useAppStore.getState();

      // Advance to T12 and assign a resource
      store.setTimelinePhase('T12');
      const inc101 = store.incidents.find((i) => i.code === 'NG-101')!;
      store.assignResource(inc101.id, 'RES-01');

      let state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T12');
      expect(state.simulationClock).toBe('2026-10-18T16:30:00Z');
      expect(state.resources.find((r) => r.id === 'RES-01')?.status).toBe('assigned');

      // Click Reset Simulation
      store.resetSimulation();

      state = useAppStore.getState();
      expect(state.timelinePhase).toBe('T0');
      expect(state.simulationClock).toBe('2026-10-18T04:30:00Z');
      expect(state.resources.find((r) => r.id === 'RES-01')?.status).toBe('available');

      const visible = selectVisibleIncidents(state.incidents, state.timelinePhase, state.simulationClock);
      expect(visible).toHaveLength(2);
      expect(visible.map((i) => i.code)).toEqual(['NG-106', 'NG-107']);
    });
  });
});
