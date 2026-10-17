import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  enqueueOfflineSubmission,
  getOfflineQueue,
  clearOfflineQueue,
  removeOfflineSubmission,
  syncOfflineQueue,
  OFFLINE_QUEUED_MESSAGE,
  OFFLINE_QUEUE_STORAGE_KEY,
} from '@/lib/pwa/offlineQueue';
import {
  getFcfsRetrospectiveSummary,
  FCFS_COMPARISON_DATA,
} from '@/lib/analytics/fcfsComparison';
import { useAppStore } from '@/store';
import fs from 'fs';
import path from 'path';

describe('Milestone 12: PWA Offline Queue & FCFS Retrospective Verification', () => {
  beforeEach(() => {
    // Reset store and offline queue
    useAppStore.getState().resetSimulation();
    clearOfflineQueue();
  });

  describe('T12.1: PWA Manifest & Offline Submission Queue', () => {
    it('manifest.json exists and conforms to PWA tactical theme specifications', () => {
      const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
      expect(fs.existsSync(manifestPath)).toBe(true);

      const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      expect(manifestContent.name).toContain('Nigehbaan');
      expect(manifestContent.theme_color).toBe('#010102');
      expect(manifestContent.background_color).toBe('#010102');
      expect(manifestContent.display).toBe('standalone');
      expect(manifestContent.start_url).toBe('/');
      expect(manifestContent.icons.length).toBeGreaterThan(0);
    });

    it('enqueues submissions into localStorage when offline and returns OFFLINE_QUEUED_MESSAGE', () => {
      expect(OFFLINE_QUEUED_MESSAGE).toBe('Report queued locally (offline mode)');

      const queued = enqueueOfflineSubmission({
        reportText: 'Elderly neighbor trapped in flood water near Gadap canal, no phone',
        sectorId: 'sector-2',
        reporterType: 'community_proxy',
        phoneAccess: 'no_phone',
        factors: [3.5, 2.0, 4.0, 3.5, 1.0],
        reportTranslation: 'Elderly woman trapped in canal flood',
        coordinates: null,
      });

      expect(queued.id).toMatch(/^OFFLINE-/);
      expect(queued.status).toBe('pending');
      expect(queued.reportText).toContain('Elderly neighbor trapped');

      // Verify persistence in localStorage
      const queueInStorage = getOfflineQueue();
      expect(queueInStorage.length).toBe(1);
      expect(queueInStorage[0].id).toBe(queued.id);
      expect(queueInStorage[0].phoneAccess).toBe('no_phone');
    });

    it('drains and auto-syncs queued reports to the live Zustand dashboard store upon reconnect', () => {
      // Step 1: Enqueue two offline reports
      const item1 = enqueueOfflineSubmission({
        reportText: 'First offline report - roof submerged',
        sectorId: 'sector-3a',
        reporterType: 'citizen',
        phoneAccess: 'has_phone',
        factors: [4.0, 2.0, 4.0, 4.0, 2.0],
        coordinates: null,
      });

      const item2 = enqueueOfflineSubmission({
        reportText: 'Second offline report - no phone proxy',
        sectorId: 'sector-2',
        reporterType: 'community_proxy',
        phoneAccess: 'no_phone',
        factors: [3.0, 2.0, 4.0, 3.5, 1.0],
        coordinates: null,
      });

      expect(getOfflineQueue().length).toBe(2);

      const store = useAppStore.getState();
      const initialCount = store.incidents.length;

      // Step 2: Simulate online reconnection sync
      const syncResult = syncOfflineQueue((submission) => {
        store.submitIncident({
          reportText: submission.reportText,
          sectorId: submission.sectorId,
          reporterType: submission.reporterType,
          phoneAccess: submission.phoneAccess,
          factors: submission.factors,
          reportTranslation: submission.reportTranslation,
          coordinates: submission.coordinates,
        });
      });

      // Step 3: Verify sync results
      expect(syncResult.syncedCount).toBe(2);
      expect(syncResult.failedCount).toBe(0);
      expect(syncResult.syncedIds).toEqual([item1.id, item2.id]);

      // Step 4: Verify queue is now empty in localStorage
      expect(getOfflineQueue().length).toBe(0);

      // Step 5: Verify store now has both new incidents
      const updatedStore = useAppStore.getState();
      expect(updatedStore.incidents.length).toBe(initialCount + 2);
      const added = updatedStore.incidents.find((i) =>
        i.reportText.includes('First offline report')
      );
      expect(added).toBeDefined();
      expect(added?.sectorId).toBe('sector-3a');
    });
  });

  describe('T12.2: "FCFS vs. Nigehbaan" Retrospective Calculation & Metrics', () => {
    it('proves that naive FCFS prioritizes minor property damage (NG-107) over silent dialysis patients (NG-101)', () => {
      const ng107 = FCFS_COMPARISON_DATA.find((r) => r.code === 'NG-107')!;
      const ng101 = FCFS_COMPARISON_DATA.find((r) => r.code === 'NG-101')!;

      // In FCFS, NG-107 (score 5.0) arrived at 04:20 and got dispatched at 04:25 (Order #2)
      expect(ng107.fcfsOrder).toBe(2);
      expect(ng107.fcfsWaitMinutes).toBe(5);
      expect(ng107.score).toBe(5.0);

      // In FCFS, NG-101 (Critical score 86.5) arrived at 06:45 and waited 155 minutes until 09:20
      expect(ng101.fcfsOrder).toBe(3);
      expect(ng101.fcfsWaitMinutes).toBe(155);
      expect(ng101.score).toBe(86.5);

      // Under Nigehbaan, NG-101 is ranked #1 and dispatched in 5 minutes
      expect(ng101.nigehbaanOrder).toBe(1);
      expect(ng101.nigehbaanWaitMinutes).toBe(5);
      expect(ng101.minutesSaved).toBe(150);

      // Under Nigehbaan, NG-107 is deferred without wasting rescue assets
      expect(ng107.nigehbaanOrder).toBe(9);
      expect(ng107.nigehbaanWaitMinutes).toBeGreaterThan(600);
    });

    it('proves that naive FCFS completely abandons silent dead zone Sector 3A (NG-103) while Nigehbaan sweeps it', () => {
      const ng103 = FCFS_COMPARISON_DATA.find((r) => r.code === 'NG-103')!;

      // In FCFS, NG-103 has zero calls, so it was never dispatched
      expect(ng103.fcfsOrder).toBeNull();
      expect(ng103.fcfsWaitMinutes).toBeNull();
      expect(ng103.fcfsAssignmentTime).toBe('NEVER');

      // In Nigehbaan, synthesized blind spot (score 68.7, floor >= 60) dispatched in 5 minutes
      expect(ng103.nigehbaanOrder).toBe(3);
      expect(ng103.nigehbaanWaitMinutes).toBe(5);
      expect(ng103.score).toBe(68.7);
    });

    it('computes summary metrics showing -97% critical latency reduction and zero preventable fatalities', () => {
      const summary = getFcfsRetrospectiveSummary();

      expect(summary.totalIncidentsEvaluated).toBe(9);
      expect(summary.criticalCasesCount).toBe(2); // NG-101 and NG-102
      expect(summary.avgWaitCriticalFcfsMinutes).toBeGreaterThanOrEqual(150);
      expect(summary.avgWaitCriticalNigehbaanMinutes).toBeLessThanOrEqual(10);
      expect(summary.latencyReductionPercent).toBeGreaterThanOrEqual(90);
      expect(summary.blackoutDetectionFcfsPercent).toBe(0);
      expect(summary.blackoutDetectionNigehbaanPercent).toBe(100);
      expect(summary.preventableFatalitiesFcfs).toBe(4);
      expect(summary.preventableFatalitiesNigehbaan).toBe(0);
    });
  });
});
