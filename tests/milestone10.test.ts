import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/store';
import {
  matchShelterForIncident,
  extractRequiredCapabilities,
  evaluateShelterEligibility,
  hasCapability,
} from '@/lib/shelters';
import {
  getStagingRecommendations,
  getSectorStagingRecommendation,
} from '@/lib/simulation/stagingAdvisor';
import { Shelter, Incident } from '@/types';

describe('Milestone 10: Shelter Matching & Evacuee Routing (Tier 2)', () => {
  beforeEach(() => {
    useAppStore.getState().resetSimulation();
  });

  // --------------------------------------------------------------------------
  // Acceptance Test 2.1: Shelter Capacity & Capability Destination Matching
  // --------------------------------------------------------------------------
  describe('Test 2.1: Shelter Capacity & Capability Destination Matching', () => {
    it('evaluates candidate destinations for NG-101: filters out SHL-03, deprioritizes SHL-01, selects SHL-02, and increments capacityOccupied upon assignment', () => {
      const store = useAppStore.getState();
      const ng101 = store.incidents.find((i) => i.code === 'NG-101');
      expect(ng101).toBeDefined();
      if (!ng101) return;

      const shelters = store.shelters;
      expect(shelters.length).toBe(3);

      const shl01 = shelters.find((s) => s.id === 'SHL-01')!;
      const shl02 = shelters.find((s) => s.id === 'SHL-02')!;
      const shl03 = shelters.find((s) => s.id === 'SHL-03')!;

      // Given specifications from docs/acceptance-tests.md Test 2.1:
      // SHL-01 has 32% occupancy but no dialysis capability.
      expect(Math.round((shl01.capacityCurrent / shl01.capacityTotal) * 100)).toBe(32);
      expect(shl01.capabilities).not.toContain('Dialysis Support');

      // SHL-02 has 70% occupancy and has dialysis_support + active backup generator.
      expect(Math.round((shl02.capacityCurrent / shl02.capacityTotal) * 100)).toBe(70);
      expect(shl02.capabilities).toContain('Dialysis Support');
      expect(shl02.backupGenerator).toBe(true);

      // SHL-03 has 97% occupancy and grid blackout (no generator).
      expect(Math.round((shl03.capacityCurrent / shl03.capacityTotal) * 100)).toBe(97);
      expect(shl03.backupGenerator).toBe(false);

      // When: The shelter allocation engine evaluates candidate destinations for NG-101
      const matchResult = matchShelterForIncident(ng101, shelters);

      // Then:
      // 1. Required capability detected is Dialysis Support
      expect(matchResult.requiredCapabilities).toContain('Dialysis Support');

      // 2. SHL-03 is strictly filtered out (occupancy >= 95% and power failure)
      const shl03Candidate = matchResult.candidates.find((c) => c.shelter.id === 'SHL-03');
      expect(shl03Candidate).toBeDefined();
      expect(shl03Candidate?.isEligible).toBe(false);
      expect(shl03Candidate?.exclusionReason).toContain('95%');

      // 3. SHL-01 is deprioritized (lacks medical capability)
      const shl01Candidate = matchResult.candidates.find((c) => c.shelter.id === 'SHL-01');
      expect(shl01Candidate).toBeDefined();
      expect(shl01Candidate?.isEligible).toBe(true);
      expect(shl01Candidate?.deprioritizationReason).toContain('Dialysis Support');

      // 4. SHL-02 is selected as the recommended destination
      expect(matchResult.recommendedShelter).toBeDefined();
      expect(matchResult.recommendedShelter?.id).toBe('SHL-02');
      expect(matchResult.recommendedShelter?.name).toBe('District Civil Hospital Annexe');

      // 5. Upon assignment, SHL-02.capacityOccupied increments by the incident headcount
      const initialOccupied = shl02.capacityOccupied ?? shl02.capacityCurrent; // 84
      expect(initialOccupied).toBe(84);

      const res01 = store.resources.find((r) => r.id === 'RES-01')!;
      const assignSuccess = store.assignResource(ng101.id, res01.id, 'SHL-02');
      expect(assignSuccess).toBe(true);

      const updatedStore = useAppStore.getState();
      const updatedShl02 = updatedStore.shelters.find((s) => s.id === 'SHL-02')!;

      // Headcount for NG-101 is 2 -> increments by 2 (from 84 to 86)
      expect(updatedShl02.capacityCurrent).toBe(initialOccupied + 2);
      expect(updatedShl02.capacityOccupied).toBe(initialOccupied + 2);

      // Verify incident recorded target shelter
      const updatedNg101 = updatedStore.incidents.find((i) => i.id === ng101.id)!;
      expect(updatedNg101.status).toBe('assigned');
      expect(updatedNg101.targetShelter).toBe('SHL-02');

      // Verify audit log entry details contain assignment and destination
      const latestLog = updatedStore.activityLogs[0];
      expect(latestLog.action).toBe('COORDINATOR_ASSIGN');
      expect(latestLog.details).toContain('Shallow Jet-Boat 01 assigned to NG-101');
      expect(latestLog.details).toContain('District Civil Hospital Annexe');

      // Verify unassignment rolls back shelter capacity
      const unassignSuccess = store.unassignResource(ng101.id);
      expect(unassignSuccess).toBe(true);

      const rolledBackStore = useAppStore.getState();
      const rolledBackShl02 = rolledBackStore.shelters.find((s) => s.id === 'SHL-02')!;
      expect(rolledBackShl02.capacityCurrent).toBe(initialOccupied);
      expect(rolledBackShl02.capacityOccupied).toBe(initialOccupied);
    });

    it('correctly detects different medical capabilities (Oxygen, Maternal Care, ICU Beds)', () => {
      const mockIncidentBase: Incident = {
        id: 'inc-test-med',
        code: 'NG-TEST',
        sectorId: 'sector-1',
        reporterType: 'citizen',
        phoneAccess: 'has_phone',
        timestamp: '2026-10-18T05:00:00Z',
        phaseArrival: 'T0',
        reportText: 'Elderly patient on oxygen ventilator struggling to breathe.',
        factors: [4.0, 4.5, 3.0, 3.0, 1.0],
        expectedScore: 70.0,
        category: 'High',
        uncertaintyFlags: [],
        coordinates: [24.9, 67.1],
        targetResource: 'mobile_medical',
        status: 'triaged',
      };

      const capsOxygen = extractRequiredCapabilities(mockIncidentBase);
      expect(capsOxygen).toContain('Oxygen');

      const mockPregnant: Incident = {
        ...mockIncidentBase,
        reportText: 'Pregnant mother in active labor in floodwater.',
      };
      const capsMaternal = extractRequiredCapabilities(mockPregnant);
      expect(capsMaternal).toContain('Maternal Care');

      const mockICU: Incident = {
        ...mockIncidentBase,
        reportText: 'Severe multi-trauma victim requires ICU intensive care immediately.',
        factors: [5.0, 5.0, 4.0, 4.0, 1.0],
      };
      const capsICU = extractRequiredCapabilities(mockICU);
      expect(capsICU).toContain('ICU Beds');
    });

    it('strictly excludes shelters with critical capacity or offline status', () => {
      const fullShelter: Shelter = {
        id: 'SHL-FULL',
        name: 'Full Camp',
        sectorId: 'sector-1',
        capacityTotal: 100,
        capacityCurrent: 96,
        capacityOccupied: 96,
        backupGenerator: true,
        capabilities: ['Basic First Aid'],
        status: 'active',
      };

      const eligibilityFull = evaluateShelterEligibility(fullShelter);
      expect(eligibilityFull.isEligible).toBe(false);
      expect(eligibilityFull.exclusionReason).toContain('95%');

      const offlineShelter: Shelter = {
        id: 'SHL-OFF',
        name: 'Flooded Camp',
        sectorId: 'sector-2',
        capacityTotal: 100,
        capacityCurrent: 40,
        capacityOccupied: 40,
        backupGenerator: true,
        capabilities: ['Basic First Aid'],
        status: 'offline',
      };

      const eligibilityOff = evaluateShelterEligibility(offlineShelter);
      expect(eligibilityOff.isEligible).toBe(false);
      expect(eligibilityOff.exclusionReason).toContain('offline');
    });
  });

  // --------------------------------------------------------------------------
  // Acceptance Test 2.2: T-0 Pre-Disaster Baseline Staging Recommendation
  // --------------------------------------------------------------------------
  describe('Test 2.2: T-0 Pre-Disaster Baseline Staging Recommendation', () => {
    it('displays proactive staging recommendation at phase T-0 with exact rationale for Sector 3A', () => {
      const store = useAppStore.getState();

      // Given: Timeline is set to T-0 Early Warning
      expect(store.timelinePhase).toBe('T0');

      // When: The coordinator inspects Sector 3A
      const rec = getSectorStagingRecommendation('sector-3a', 'T0');

      // Then:
      // 1. Staging recommendation exists
      expect(rec).toBeDefined();
      expect(rec).not.toBeNull();
      if (!rec) return;

      // 2. The UI displays pre-position-pill badge text
      expect(rec.badgeText).toBe('Proactive Staging Recommended');

      // 3. System recommends pre-positioning RES-01 (Shallow Jet-Boat 01) at High Ground Depot Alpha
      expect(rec.recommendedResourceId).toBe('RES-01');
      expect(rec.recommendedResourceCallsign).toBe('Shallow Jet-Boat 01');
      expect(rec.stagingLocation).toBe('High Ground Depot Alpha');
      expect(rec.actionText).toContain('Pre-position Shallow Jet-Boat 01 at High Ground Depot Alpha');

      // 4. Rationale displays exact specification
      expect(rec.rationale).toBe(
        'Arterial access road submerges at T+3; 22 isolated elderly registered in sector.'
      );
      expect(rec.details.isolatedElderlyCount).toBe(22);
    });

    it('deactivates pre-disaster staging recommendations after phase T-0', () => {
      // At T+3, T+6, T+12, pre-disaster staging window has passed
      const recsT3 = getStagingRecommendations('T3');
      expect(recsT3.length).toBe(0);

      const recSector3aT3 = getSectorStagingRecommendation('sector-3a', 'T3');
      expect(recSector3aT3).toBeNull();

      const recsT6 = getStagingRecommendations('T6');
      expect(recsT6.length).toBe(0);

      const recsT12 = getStagingRecommendations('T12');
      expect(recsT12.length).toBe(0);
    });
  });
});
