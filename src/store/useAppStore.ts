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
  UncertaintyFlag,
  ExtractedFacts,
} from '@/types';
import { getPristineState, normalizeIncident } from '@/lib/simulation/seedLoader';
import { rankIncidentQueue } from '@/lib/triage/queueRanker';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';
import { detectAndSynthesizeBlindSpots } from '@/lib/uncertainty';

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
 * Filters strictly by simulation clock timestamp: incident.timestamp <= simulationClock,
 * falling back to phaseArrival rank when simulationClock is omitted.
 */
export function selectVisibleIncidents(
  incidents: Incident[],
  currentPhase: TimelinePhaseId,
  simulationClock?: string
): Incident[] {
  if (simulationClock) {
    const clockTime = new Date(simulationClock).getTime();
    if (!isNaN(clockTime)) {
      return incidents.filter((inc) => {
        const incTime = new Date(inc.timestamp).getTime();
        return !isNaN(incTime) && incTime <= clockTime;
      });
    }
  }
  return incidents.filter((inc) => isIncidentVisibleAtPhase(inc.phaseArrival, currentPhase));
}

/**
 * Returns incidents visible at the active timeline phase, ordered deterministically
 * by priority score, confidence inversion, and FIFO timestamps.
 */
export function selectRankedVisibleIncidents(
  incidents: Incident[],
  currentPhase: TimelinePhaseId,
  simulationClock?: string
): Incident[] {
  const visible = selectVisibleIncidents(incidents, currentPhase, simulationClock);
  return rankIncidentQueue(visible);
}

export interface AppState {
  // Core State
  scenario: Scenario;
  timelinePhase: TimelinePhaseId;
  simulationClock: string;
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
      provenanceBadge?: string;
      isAI?: boolean;
      extractedFacts?: ExtractedFacts;
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
      simulationClock: pristine.scenario.timelinePhases[0]?.wallClock ?? '2026-10-18T04:30:00Z',
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

        const phaseObj = get().scenario.timelinePhases.find((p) => p.id === phaseId);
        const wallClock = phaseObj?.wallClock ?? new Date().toISOString();

        const newLogs: AuditLogEntry[] = [
          {
            id: `log-phase-${Date.now()}`,
            timestamp,
            action: 'TIMELINE_PHASE_ADVANCED',
            details: `[${timestamp}] TIMELINE_PHASE_ADVANCED: Timeline advanced from ${currentPhase} to ${phaseId}`,
          },
        ];

        // Dynamic sector infrastructure & flood gauge telemetry
        const updatedSectors = get().sectors.map((s) => {
          if (s.id === 'sector-3a') {
            const isOffline = phaseId === 'T6' || phaseId === 'T12';
            return {
              ...s,
              cellTower: {
                ...s.cellTower,
                status: (isOffline ? 'offline' : 'online') as 'online' | 'offline',
                offlineSince: isOffline ? '2026-10-18T08:55:00Z' : null,
              },
              floodGauge: {
                ...s.floodGauge,
                levelMeters: phaseId === 'T0' ? 0.4 : phaseId === 'T3' ? 1.0 : phaseId === 'T6' ? 1.9 : 2.6,
                trend: (phaseId === 'T0' ? 'stable' : 'rising') as 'stable' | 'rising' | 'falling',
              },
            };
          }
          if (s.id === 'sector-2') {
            return {
              ...s,
              floodGauge: {
                ...s.floodGauge,
                levelMeters: phaseId === 'T0' ? 0.6 : phaseId === 'T3' ? 1.4 : phaseId === 'T6' ? 1.7 : 2.4,
              },
            };
          }
          return s;
        });

        // Cell tower collapse infrastructure event at T+6
        if ((phaseId === 'T6' || phaseId === 'T12') && (currentPhase === 'T0' || currentPhase === 'T3')) {
          newLogs.push({
            id: `log-tower-${Date.now()}`,
            timestamp,
            action: 'INFRASTRUCTURE_ALERT',
            details: `[${timestamp}] INFRASTRUCTURE_ALERT: Cell tower Tower-Alpha-3 collapsed in Sector 3A at 08:55 PKT. Telemetry signal lost.`,
          });
        }

        // Evaluate sector blind spots with updated sector status and wall clock
        const { synthesizedIncidents } = detectAndSynthesizeBlindSpots(
          updatedSectors,
          wallClock,
          get().incidents
        );

        for (const synth of synthesizedIncidents) {
          newLogs.push({
            id: `log-blindspot-${Date.now()}-${synth.code}`,
            timestamp,
            action: 'BLIND_SPOT_SYNTHESIS',
            details: `[${timestamp}] BLIND_SPOT_SYNTHESIS: Sector ${synth.sectorId} blackout triggered synthetic welfare recon incident ${synth.code} (Score: ${synth.score?.toFixed(1) ?? '68.7'} - ${synth.category})`,
            incidentId: synth.id,
          });
        }

        // If advancing to T6 and NG-103 exists in seed
        if ((phaseId === 'T6' || phaseId === 'T12') && synthesizedIncidents.length === 0) {
          const ng103 = get().incidents.find((i) => i.code === 'NG-103');
          if (ng103) {
            newLogs.push({
              id: `log-blindspot-${Date.now()}-NG-103`,
              timestamp,
              action: 'BLIND_SPOT_SYNTHESIS',
              details: `[${timestamp}] BLIND_SPOT_SYNTHESIS: Sector 3A communication blackout triggered synthetic welfare recon incident NG-103 (Score: ${ng103.score?.toFixed(1) ?? '68.7'} - High)`,
              incidentId: ng103.id,
            });
          }
        }

        // Shelter generator failure event at T+12
        const updatedShelters = get().shelters.map((shl) => {
          if (shl.id === 'SHL-03') {
            const isPeakCrisis = phaseId === 'T12';
            return {
              ...shl,
              backupGenerator: false,
              status: 'overcrowded' as const,
            };
          }
          return shl;
        });

        if (phaseId === 'T12' && currentPhase !== 'T12') {
          newLogs.push({
            id: `log-shelter-${Date.now()}`,
            timestamp,
            action: 'INFRASTRUCTURE_ALERT',
            details: `[${timestamp}] INFRASTRUCTURE_ALERT: Shelter SHL-03 (Highway Warehouse Relief Depot) generator failed; capacity breached 97%.`,
          });
        }

        set((state) => ({
          timelinePhase: phaseId,
          simulationClock: wallClock,
          sectors: updatedSectors,
          shelters: updatedShelters,
          incidents:
            synthesizedIncidents.length > 0
              ? [...synthesizedIncidents, ...state.incidents]
              : state.incidents,
          activityLogs: [...newLogs, ...state.activityLogs],
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

        // Determine uncertainty flags automatically per Acceptance Tests 1.3 & 1.7
        const flags: UncertaintyFlag[] = [];
        if (phoneAccess === 'no_phone') {
          flags.push('NO_PHONE_COMMUNITY_PROXY');
        }
        if (!report.coordinates) {
          flags.push('MISSING_LOCATION');
        }
        if (factors.some((f) => f === null)) {
          flags.push('MISSING_FACTORS');
        }

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
          uncertaintyFlags: flags,
          coordinates: report.coordinates ?? null,
          targetResource: report.targetResource,
          targetShelter: report.targetShelter,
          assignedResourceId: null,
          status: 'triaged' as const,
          provenanceBadge: report.provenanceBadge,
          isAI: report.isAI,
          extractedFacts: report.extractedFacts,
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
          incidents: [newIncident, ...state.incidents],
          selectedIncidentId: newIncident.id,
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
          simulationClock: fresh.scenario.timelinePhases[0]?.wallClock ?? '2026-10-18T04:30:00Z',
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
