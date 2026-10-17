import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Incident,
  Resource,
  Shelter,
  Sector,
  Scenario,
  TimelinePhaseId,
  AuditLogEntry,
  IncidentFactors,
  PhoneAccessStatus,
  ReporterType,
} from '@/types';
import { getPristineState, normalizeIncident } from '@/lib/simulation/seedLoader';
import { rankIncidentQueue } from '@/lib/triage/queueRanker';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';

export const PHASE_ORDER: Record<TimelinePhaseId, number> = {
  T0: 0,
  T3: 1,
  T6: 2,
  T12: 3,
};

/**
 * Returns true if an incident is visible at or before the given timeline phase.
 */
export function isIncidentVisibleAtPhase(
  incidentPhase: TimelinePhaseId,
  currentPhase: TimelinePhaseId
): boolean {
  const incidentRank = PHASE_ORDER[incidentPhase] ?? 0;
  const currentRank = PHASE_ORDER[currentPhase] ?? 0;
  return incidentRank <= currentRank;
}

/**
 * Returns incidents that are visible at the active timeline phase.
 */
export function selectVisibleIncidents(
  incidents: Incident[],
  currentPhase: TimelinePhaseId
): Incident[] {
  return incidents.filter((inc) => isIncidentVisibleAtPhase(inc.phaseArrival, currentPhase));
}

/**
 * Returns incidents visible at the active timeline phase, ordered deterministically
 * by priority score, confidence inversion, and FIFO timestamps.
 */
export function selectRankedVisibleIncidents(
  incidents: Incident[],
  currentPhase: TimelinePhaseId
): Incident[] {
  const visible = selectVisibleIncidents(incidents, currentPhase);
  return rankIncidentQueue(visible);
}

export interface AppState {
  // Core State
  scenario: Scenario;
  timelinePhase: TimelinePhaseId;
  sectors: Sector[];
  resources: Resource[];
  shelters: Shelter[];
  incidents: Incident[];
  activityLogs: AuditLogEntry[];
  selectedIncidentId: string | null;
  isHydrated: boolean;

  // Actions
  setHydrated: (isHydrated: boolean) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setTimelinePhase: (phaseId: TimelinePhaseId) => void;
  assignResource: (incidentId: string, resourceId: string) => boolean;
  unassignResource: (incidentId: string) => boolean;
  submitIncident: (
    report: {
      reportText: string;
      sectorId: string;
      reporterType?: ReporterType;
      phoneAccess?: PhoneAccessStatus;
      factors?: IncidentFactors;
      coordinates?: [number, number] | null;
      reportTranslation?: string | null;
      targetResource?: string;
      targetShelter?: string;
    }
  ) => Incident;
  updateIncident: (incidentId: string, updates: Partial<Incident>) => void;
  updateResource: (resourceId: string, updates: Partial<Resource>) => void;
  resetSimulation: () => void;
}

const pristine = getPristineState();

// Safe storage resolution for SSR and Node test environments
const memoryStorage = new Map<string, string>();

const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(name);
      } catch {
        return memoryStorage.get(name) ?? null;
      }
    }
    return memoryStorage.get(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(name, value);
        return;
      } catch {
        memoryStorage.set(name, value);
        return;
      }
    }
    memoryStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(name);
        return;
      } catch {
        memoryStorage.delete(name);
        return;
      }
    }
    memoryStorage.delete(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      scenario: pristine.scenario,
      timelinePhase: pristine.timelinePhase,
      sectors: pristine.sectors,
      resources: pristine.resources,
      shelters: pristine.shelters,
      incidents: pristine.incidents,
      activityLogs: pristine.activityLogs,
      selectedIncidentId: null,
      isHydrated: false,

      setHydrated: (isHydrated) => set({ isHydrated }),

      setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

      setTimelinePhase: (phaseId) => {
        const timestamp = new Date().toISOString();
        const currentPhase = get().timelinePhase;
        if (currentPhase === phaseId) return;

        const logEntry: AuditLogEntry = {
          id: `log-phase-${Date.now()}`,
          timestamp,
          action: 'TIMELINE_PHASE_ADVANCED',
          details: `[${timestamp}] TIMELINE_PHASE_ADVANCED: Timeline advanced from ${currentPhase} to ${phaseId}`,
        };

        set((state) => ({
          timelinePhase: phaseId,
          activityLogs: [logEntry, ...state.activityLogs],
        }));
      },

      assignResource: (incidentId, resourceId) => {
        const { incidents, resources, activityLogs } = get();
        const incident = incidents.find((i) => i.id === incidentId);
        const resource = resources.find((r) => r.id === resourceId);

        if (!incident || !resource) {
          console.warn(`[useAppStore] assignResource failed: incident ${incidentId} or resource ${resourceId} not found.`);
          return false;
        }

        const timestamp = new Date().toISOString();
        const detailsString = `[${timestamp}] COORDINATOR_ASSIGN: ${resource.callsign} assigned to ${incident.code}`;

        const logEntry: AuditLogEntry = {
          id: `log-assign-${Date.now()}`,
          timestamp,
          action: 'COORDINATOR_ASSIGN',
          details: detailsString,
          incidentId: incident.id,
          resourceId: resource.id,
        };

        set({
          resources: resources.map((r) =>
            r.id === resourceId
              ? { ...r, status: 'assigned', assignedIncidentId: incidentId }
              : r
          ),
          incidents: incidents.map((i) =>
            i.id === incidentId
              ? { ...i, status: 'assigned', assignedResourceId: resourceId }
              : i
          ),
          activityLogs: [logEntry, ...activityLogs],
        });

        return true;
      },

      unassignResource: (incidentId) => {
        const { incidents, resources, activityLogs } = get();
        const incident = incidents.find((i) => i.id === incidentId);
        if (!incident) return false;

        const assignedResId = incident.assignedResourceId;
        const resource = resources.find((r) => r.id === assignedResId);

        const timestamp = new Date().toISOString();
        const detailsString = resource
          ? `[${timestamp}] COORDINATOR_UNASSIGN: ${resource.callsign} unassigned from ${incident.code}`
          : `[${timestamp}] COORDINATOR_UNASSIGN: Resource unassigned from ${incident.code}`;

        const logEntry: AuditLogEntry = {
          id: `log-unassign-${Date.now()}`,
          timestamp,
          action: 'COORDINATOR_UNASSIGN',
          details: detailsString,
          incidentId: incident.id,
          resourceId: assignedResId ?? undefined,
        };

        set({
          resources: resources.map((r) =>
            r.assignedIncidentId === incidentId || r.id === assignedResId
              ? { ...r, status: 'available', assignedIncidentId: null }
              : r
          ),
          incidents: incidents.map((i) =>
            i.id === incidentId
              ? { ...i, status: 'triaged', assignedResourceId: null }
              : i
          ),
          activityLogs: [logEntry, ...activityLogs],
        });

        return true;
      },

      submitIncident: (report) => {
        const state = get();
        const timestamp = new Date().toISOString();
        const id = `inc-${Date.now()}`;
        const newCodeNumber = state.incidents.length + 101;
        const code = `NG-${newCodeNumber}`;

        const reporterType = report.reporterType ?? 'citizen';
        const phoneAccess = report.phoneAccess ?? 'has_phone';
        const factors: IncidentFactors = report.factors ?? [2.5, null, null, 2.5, 1.0];

        const raw = {
          id,
          code,
          sectorId: report.sectorId,
          reporterType,
          phoneAccess,
          timestamp,
          phaseArrival: state.timelinePhase,
          reportText: report.reportText,
          reportTranslation: report.reportTranslation ?? null,
          factors,
          uncertaintyFlags: [],
          coordinates: report.coordinates ?? null,
          targetResource: report.targetResource,
          targetShelter: report.targetShelter,
          assignedResourceId: null,
          status: 'triaged' as const,
        };

        const newIncident = normalizeIncident(raw);

        const logEntry: AuditLogEntry = {
          id: `log-submit-${Date.now()}`,
          timestamp,
          action: 'INCIDENT_SUBMITTED',
          details: `[${timestamp}] INCIDENT_SUBMITTED: ${newIncident.code} reported in ${newIncident.sectorId} (Priority: ${newIncident.score} - ${newIncident.category})`,
          incidentId: newIncident.id,
        };

        set({
          incidents: [...state.incidents, newIncident],
          activityLogs: [logEntry, ...state.activityLogs],
        });

        return newIncident;
      },

      updateIncident: (incidentId, updates) => {
        set((state) => ({
          incidents: state.incidents.map((i) =>
            i.id === incidentId ? { ...i, ...updates } : i
          ),
        }));
      },

      updateResource: (resourceId, updates) => {
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === resourceId ? { ...r, ...updates } : r
          ),
        }));
      },

      resetSimulation: () => {
        const fresh = getPristineState();
        const timestamp = new Date().toISOString();

        const resetLog: AuditLogEntry = {
          id: `log-reset-${Date.now()}`,
          timestamp,
          action: 'SIMULATION_RESET',
          details: `[${timestamp}] SIMULATION_RESET: District Alpha scenario restored to baseline T-0.`,
        };

        set({
          scenario: fresh.scenario,
          timelinePhase: 'T0',
          sectors: fresh.sectors,
          resources: fresh.resources,
          shelters: fresh.shelters,
          incidents: fresh.incidents,
          activityLogs: [resetLog, ...fresh.activityLogs],
          selectedIncidentId: null,
        });
      },
    }),
    {
      name: 'nigehbaan-state-v1',
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
