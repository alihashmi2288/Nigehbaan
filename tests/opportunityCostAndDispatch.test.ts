import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateOpportunityCost,
  formatSectorDisplay,
  getAssetTypeDescriptor,
} from '@/lib/resources/opportunityCost';
import { getPristineState } from '@/lib/simulation/seedLoader';
import { Resource, Incident } from '@/types';
import { useAppStore } from '@/store';

describe('Milestone 7: Deterministic Opportunity Cost & Dispatch Engine', () => {
  let pristine: ReturnType<typeof getPristineState>;

  beforeEach(() => {
    pristine = getPristineState();
    useAppStore.getState().resetSimulation();
  });

  // --------------------------------------------------------------------------
  // Task T7.1: Deterministic Opportunity Cost Calculator
  // --------------------------------------------------------------------------
  describe('T7.1: Deterministic Opportunity Cost Calculator (opportunityCost.ts)', () => {
    it('calculates acute scarcity (+35 min delay for NG-104) when assigning RES-01 to NG-101 (Test 1.5)', () => {
      const res01 = pristine.resources.find((r) => r.id === 'RES-01')!;
      const ng101 = pristine.incidents.find((i) => i.code === 'NG-101')!;
      const availableResources = pristine.resources.filter((r) => r.status === 'available');

      const result = calculateOpportunityCost(
        res01,
        ng101,
        availableResources,
        pristine.incidents
      );

      expect(result.hasScarcity).toBe(true);
      expect(result.remainingCount).toBe(0);
      expect(result.delayMinutes).toBe(35);
      expect(result.affectedIncident?.code).toBe('NG-104');
      expect(result.warningLabel).toBe('0 shallow-draft assets left in sector');
      expect(result.consequenceText).toBe('Leaves 0 shallow-draft assets available in Sector 2');
      expect(result.turnaroundText).toBe('Incident NG-104 will incur an estimated +35 min delay');
      expect(result.fullWarningText).toBe(
        'Committing Shallow Jet-Boat 01 to NG-101 leaves 0 shallow-draft assets available in Sector 2. Queued Incident NG-104 [Score 56.5 — High] will incur an estimated +35 min delay.'
      );
    });

    it('returns zero delay and no scarcity when another asset remains in the sector', () => {
      const res01 = pristine.resources.find((r) => r.id === 'RES-01')!;
      const ng101 = pristine.incidents.find((i) => i.code === 'NG-101')!;

      // Add a backup boat to Sector 2
      const backupBoat: Resource = {
        id: 'RES-99',
        callsign: 'Shallow Jet-Boat Backup',
        type: 'shallow_boat',
        stationSector: 'sector-2',
        seatCapacity: 6,
        speedKmH: 28,
        turnaroundMinutes: 35,
        status: 'available',
      };

      const availableResources = [...pristine.resources, backupBoat];

      const result = calculateOpportunityCost(
        res01,
        ng101,
        availableResources,
        pristine.incidents
      );

      expect(result.hasScarcity).toBe(false);
      expect(result.remainingCount).toBe(1);
      expect(result.delayMinutes).toBe(0);
      expect(result.affectedIncident).toBeNull();
      expect(result.warningLabel).toContain('No scarcity');
      expect(result.turnaroundText).toContain('Immediate response available');
    });

    it('enforces sector-bound constraint: assets in other sectors do not alleviate sector scarcity', () => {
      const res01 = pristine.resources.find((r) => r.id === 'RES-01')!;
      const ng101 = pristine.incidents.find((i) => i.code === 'NG-101')!;

      // RES-02 is in sector-3a, not sector-2
      const availableResources = pristine.resources.filter((r) => r.status === 'available');
      const res02 = availableResources.find((r) => r.id === 'RES-02');
      expect(res02?.stationSector).toBe('sector-3a');

      const result = calculateOpportunityCost(
        res01,
        ng101,
        availableResources,
        pristine.incidents
      );

      expect(result.hasScarcity).toBe(true);
      expect(result.remainingCount).toBe(0);
      expect(result.delayMinutes).toBe(35);
    });

    it('handles queue with no further incidents in the same sector', () => {
      const res01 = pristine.resources.find((r) => r.id === 'RES-01')!;
      const ng101 = pristine.incidents.find((i) => i.code === 'NG-101')!;

      // Filter queue so only NG-101 exists in sector-2
      const solitaryQueue = pristine.incidents.filter((i) => i.code === 'NG-101');
      const availableResources = pristine.resources.filter((r) => r.status === 'available');

      const result = calculateOpportunityCost(
        res01,
        ng101,
        availableResources,
        solitaryQueue
      );

      expect(result.hasScarcity).toBe(true);
      expect(result.remainingCount).toBe(0);
      expect(result.affectedIncident).toBeNull();
      expect(result.turnaroundText).toContain('turnaround delay');
      expect(result.fullWarningText).toContain('leaves 0 shallow-draft assets available in Sector 2');
    });

    it('formats sector strings correctly', () => {
      expect(formatSectorDisplay('sector-2')).toBe('Sector 2');
      expect(formatSectorDisplay('sector-3a')).toBe('Sector 3A');
      expect(formatSectorDisplay('sector-1')).toBe('Sector 1');
      expect(formatSectorDisplay('sector-4')).toBe('Sector 4');
      expect(formatSectorDisplay('')).toBe('Sector');
    });

    it('maps asset types to readable descriptors', () => {
      expect(getAssetTypeDescriptor('shallow_boat')).toBe('shallow-draft');
      expect(getAssetTypeDescriptor('heavy_4x4')).toBe('heavy-rescue');
      expect(getAssetTypeDescriptor('mobile_medical')).toBe('mobile-medical');
      expect(getAssetTypeDescriptor('recon_patrol')).toBe('recon-patrol');
    });

    it('calculates opportunity cost correctly for other resource types (e.g. mobile_medical)', () => {
      const res05 = pristine.resources.find((r) => r.id === 'RES-05')!;
      expect(res05.type).toBe('mobile_medical');
      expect(res05.stationSector).toBe('sector-1');

      const mockIncident: Incident = {
        ...pristine.incidents[0],
        id: 'mock-med-1',
        code: 'NG-M1',
        sectorId: 'sector-1',
        targetResource: 'mobile_medical',
      };

      const availableResources = pristine.resources.filter((r) => r.status === 'available');
      const result = calculateOpportunityCost(res05, mockIncident, availableResources, []);

      expect(result.hasScarcity).toBe(true);
      expect(result.remainingCount).toBe(0);
      expect(result.delayMinutes).toBe(res05.turnaroundMinutes);
      expect(result.consequenceText).toContain('Leaves 0 mobile-medical assets available in Sector 1');
    });
  });

  // --------------------------------------------------------------------------
  // Task T7.2: Resource Assignment Warning Card & Modal Presentation (Test 1.5)
  // --------------------------------------------------------------------------
  describe('T7.2: Warning Card Contract & Consequence Presentation (Test 1.5)', () => {
    it('verifies exact warning texts mandated by Test 1.5', () => {
      const res01 = pristine.resources.find((r) => r.id === 'RES-01')!;
      const ng101 = pristine.incidents.find((i) => i.code === 'NG-101')!;
      const availableResources = pristine.resources.filter((r) => r.status === 'available');

      const result = calculateOpportunityCost(
        res01,
        ng101,
        availableResources,
        pristine.incidents
      );

      // Acceptance criterion 1: Consequence text confirms "Leaves 0 shallow-draft assets available in Sector 2"
      expect(result.consequenceText).toBe('Leaves 0 shallow-draft assets available in Sector 2');

      // Acceptance criterion 2: Turnaround penalty displays "Incident NG-104 will incur an estimated +35 min delay"
      expect(result.turnaroundText).toBe('Incident NG-104 will incur an estimated +35 min delay');

      // Acceptance criterion 3: Full text matches documentation worked example
      expect(result.fullWarningText).toContain('Committing Shallow Jet-Boat 01 to NG-101');
      expect(result.fullWarningText).toContain('leaves 0 shallow-draft assets available in Sector 2');
      expect(result.fullWarningText).toContain('Queued Incident NG-104 [Score 56.5 — High] will incur an estimated +35 min delay.');
    });

    it('matched staging shelter is correctly identified for NG-101', () => {
      const ng101 = pristine.incidents.find((i) => i.code === 'NG-101')!;
      expect(ng101.targetShelter).toBe('SHL-02');

      const matched = pristine.shelters.find((s) => s.id === ng101.targetShelter);
      expect(matched).toBeDefined();
      expect(matched?.name).toBe('District Civil Hospital Annexe');
      expect(matched?.capabilities).toContain('Dialysis Support');
    });
  });

  // --------------------------------------------------------------------------
  // Task T7.3: Human Approval Gate & Resource State Transitions (Test 1.6)
  // --------------------------------------------------------------------------
  describe('T7.3: Human Approval Gate & Activity Audit Log (Test 1.6)', () => {
    it('enforces Invariant 5: No dispatch executes autonomously until explicit approval', () => {
      const store = useAppStore.getState();
      const ng101 = store.incidents.find((i) => i.code === 'NG-101')!;
      const res01 = store.resources.find((r) => r.id === 'RES-01')!;

      // Initial state: unassigned
      expect(ng101.status).toBe('triaged');
      expect(ng101.assignedResourceId).toBeNull();
      expect(res01.status).toBe('available');
      expect(res01.assignedIncidentId).toBeNull();
    });

    it('transitions resource and incident to assigned status upon coordinator approval', () => {
      const store = useAppStore.getState();
      const res01Before = store.resources.find((r) => r.id === 'RES-01')!;
      const ng101Before = store.incidents.find((i) => i.code === 'NG-101')!;

      expect(res01Before.status).toBe('available');
      expect(ng101Before.status).not.toBe('assigned');

      // Coordinator approves assignment
      const success = store.assignResource(ng101Before.id, res01Before.id);
      expect(success).toBe(true);

      const storeAfter = useAppStore.getState();
      const res01After = storeAfter.resources.find((r) => r.id === 'RES-01')!;
      const ng101After = storeAfter.incidents.find((i) => i.code === 'NG-101')!;

      expect(res01After.status).toBe('assigned');
      expect(res01After.assignedIncidentId).toBe(ng101Before.id);

      expect(ng101After.status).toBe('assigned');
      expect(ng101After.assignedResourceId).toBe(res01Before.id);
    });

    it('assigned resource is immediately excluded from available resources for other incidents', () => {
      const store = useAppStore.getState();
      const ng101 = store.incidents.find((i) => i.code === 'NG-101')!;

      store.assignResource(ng101.id, 'RES-01');

      const availableAfter = useAppStore
        .getState()
        .resources.filter((r) => r.status === 'available');

      expect(availableAfter.some((r) => r.id === 'RES-01')).toBe(false);
    });

    it('appends an immutable entry to the Activity Audit Log with exact COORDINATOR_ASSIGN prefix', () => {
      const store = useAppStore.getState();
      const ng101 = store.incidents.find((i) => i.code === 'NG-101')!;

      store.assignResource(ng101.id, 'RES-01');

      const logs = useAppStore.getState().activityLogs;
      expect(logs.length).toBeGreaterThan(0);

      const latestLog = logs[0];
      expect(latestLog.action).toBe('COORDINATOR_ASSIGN');
      expect(latestLog.incidentId).toBe(ng101.id);
      expect(latestLog.resourceId).toBe('RES-01');
      // Format: [TIMESTAMP] COORDINATOR_ASSIGN: Shallow Jet-Boat 01 assigned to NG-101
      expect(latestLog.details).toMatch(
        /\[.*\] COORDINATOR_ASSIGN: Shallow Jet-Boat 01 assigned to NG-101/
      );
    });

    it('allows coordinator to unassign a resource, updating status and logging action', () => {
      const store = useAppStore.getState();
      const ng101 = store.incidents.find((i) => i.code === 'NG-101')!;

      // Assign first
      store.assignResource(ng101.id, 'RES-01');
      expect(useAppStore.getState().incidents.find((i) => i.id === ng101.id)?.status).toBe('assigned');

      // Now unassign
      const unassignSuccess = store.unassignResource(ng101.id);
      expect(unassignSuccess).toBe(true);

      const stateAfter = useAppStore.getState();
      const ng101After = stateAfter.incidents.find((i) => i.id === ng101.id)!;
      const res01After = stateAfter.resources.find((r) => r.id === 'RES-01')!;

      expect(ng101After.status).toBe('triaged');
      expect(ng101After.assignedResourceId).toBeNull();
      expect(res01After.status).toBe('available');
      expect(res01After.assignedIncidentId).toBeNull();

      const latestLog = stateAfter.activityLogs[0];
      expect(latestLog.action).toBe('COORDINATOR_UNASSIGN');
      expect(latestLog.details).toContain('COORDINATOR_UNASSIGN');
    });
  });
});
