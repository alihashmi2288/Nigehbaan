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
import {
  SCRIPTED_AUDIO_FALLBACK_BADGE,
  SIMULATED_CALL_NG102,
  AudioTranscriptionResult,
} from '@/lib/ai/audioFallback';

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
  assignResource: (incidentId: string, resourceId: string, destinationShelterId?: string) => boolean;
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
  ingestVoiceIncident: (callData?: Partial<AudioTranscriptionResult>) => Incident;
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

      assignResource: (incidentId, resourceId, destinationShelterId) => {
        const { incidents, resources, shelters, activityLogs } = get();
        const incident = incidents.find((i) => i.id === incidentId);
        const resource = resources.find((r) => r.id === resourceId);

        if (!incident || !resource) {
          console.warn(`[useAppStore] assignResource failed: incident ${incidentId} or resource ${resourceId} not found.`);
          return false;
        }

        // Resolve destination shelter: explicitly passed shelter, or incident's pre-matched shelter
        const shelterIdToUse = destinationShelterId || incident.targetShelter;
        const shelter = shelterIdToUse ? shelters.find((s) => s.id === shelterIdToUse) : null;

        // Calculate evacuee headcount from incident (for NG-101, headcount is 2)
        let headcount = 1;
        if (incident.extractedFacts?.peopleAffected) {
          headcount = incident.extractedFacts.peopleAffected;
        } else if (incident.code === 'NG-101') {
          headcount = 2;
        } else if (incident.code === 'NG-102') {
          headcount = 3;
        } else if (incident.code === 'NG-105') {
          headcount = 14;
        } else if (incident.factors && incident.factors[4] !== null) {
          const pop = incident.factors[4];
          if (pop <= 1.0) headcount = 1;
          else if (pop <= 2.5) headcount = 2;
          else if (pop <= 3.5) headcount = 4;
          else headcount = Math.max(1, Math.round(pop * 2));
        }

        const timestamp = new Date().toISOString();
        const detailsString = shelter
          ? `[${timestamp}] COORDINATOR_ASSIGN: ${resource.callsign} assigned to ${incident.code} -> Destination: ${shelter.name}`
          : `[${timestamp}] COORDINATOR_ASSIGN: ${resource.callsign} assigned to ${incident.code}`;

        const logEntry: AuditLogEntry = {
          id: `log-assign-${Date.now()}`,
          timestamp,
          action: 'COORDINATOR_ASSIGN',
          details: detailsString,
          incidentId: incident.id,
          resourceId: resource.id,
        };

        const updatedShelters = shelters.map((shl) => {
          if (shelter && shl.id === shelter.id) {
            const updatedCurrent = shl.capacityCurrent + headcount;
            return {
              ...shl,
              capacityCurrent: updatedCurrent,
              capacityOccupied: updatedCurrent,
            };
          }
          return shl;
        });

        set({
          resources: resources.map((r) =>
            r.id === resourceId
              ? { ...r, status: 'assigned', assignedIncidentId: incidentId }
              : r
          ),
          incidents: incidents.map((i) =>
            i.id === incidentId
              ? {
                  ...i,
                  status: 'assigned',
                  assignedResourceId: resourceId,
                  targetShelter: shelterIdToUse || i.targetShelter,
                }
              : i
          ),
          shelters: updatedShelters,
          activityLogs: [logEntry, ...activityLogs],
        });

        return true;
      },

      unassignResource: (incidentId) => {
        const { incidents, resources, shelters, activityLogs } = get();
        const incident = incidents.find((i) => i.id === incidentId);
        if (!incident) return false;

        const assignedResId = incident.assignedResourceId;
        const resource = resources.find((r) => r.id === assignedResId);

        // Calculate evacuee headcount from incident to roll back shelter capacity
        let headcount = 1;
        if (incident.extractedFacts?.peopleAffected) {
          headcount = incident.extractedFacts.peopleAffected;
        } else if (incident.code === 'NG-101') {
          headcount = 2;
        } else if (incident.code === 'NG-102') {
          headcount = 3;
        } else if (incident.code === 'NG-105') {
          headcount = 14;
        } else if (incident.factors && incident.factors[4] !== null) {
          const pop = incident.factors[4];
          if (pop <= 1.0) headcount = 1;
          else if (pop <= 2.5) headcount = 2;
          else if (pop <= 3.5) headcount = 4;
          else headcount = Math.max(1, Math.round(pop * 2));
        }

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

        const updatedShelters = shelters.map((shl) => {
          if (incident.targetShelter && shl.id === incident.targetShelter) {
            const updatedCurrent = Math.max(0, shl.capacityCurrent - headcount);
            return {
              ...shl,
              capacityCurrent: updatedCurrent,
              capacityOccupied: updatedCurrent,
            };
          }
          return shl;
        });

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
          shelters: updatedShelters,
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

      ingestVoiceIncident: (callData) => {
        const state = get();
        const timestamp = new Date().toISOString();
        const fallback = SIMULATED_CALL_NG102;

        const existingIndex = state.incidents.findIndex((i) => i.code === 'NG-102');
        const badge = callData?.provenanceBadge ?? SCRIPTED_AUDIO_FALLBACK_BADGE;
        const isAI = callData?.isAI ?? false;
        const text = callData?.originalTranscript ?? fallback.originalTranscript;
        const translation = callData?.englishTranslation ?? fallback.englishTranslation;
        const factors = (callData?.factors ?? fallback.factors) as IncidentFactors;
        const facts = callData?.extractedFacts ?? fallback.extractedFacts;

        let ng102: Incident;
        let updatedIncidents: Incident[];

        if (existingIndex >= 0) {
          const existing = state.incidents[existingIndex];
          ng102 = normalizeIncident({
            ...existing,
            phaseArrival: state.timelinePhase,
            reportText: text,
            reportTranslation: translation,
            factors,
            status: 'triaged',
            provenanceBadge: badge,
            isAI,
            extractedFacts: facts,
            timestamp: existing.timestamp || timestamp,
          });
          updatedIncidents = [
            ng102,
            ...state.incidents.filter((i) => i.code !== 'NG-102'),
          ];
        } else {
          const raw = {
            id: 'inc-102',
            code: 'NG-102',
            sectorId: 'sector-3a',
            reporterType: 'voice_hotline' as const,
            phoneAccess: 'has_phone' as const,
            timestamp,
            phaseArrival: state.timelinePhase,
            reportText: text,
            reportTranslation: translation,
            factors,
            uncertaintyFlags: [] as UncertaintyFlag[],
            coordinates: [24.943, 67.165] as [number, number],
            targetResource: 'shallow_boat',
            targetShelter: 'SHL-01',
            assignedResourceId: null,
            status: 'triaged' as const,
            provenanceBadge: badge,
            isAI,
            extractedFacts: facts,
          };
          ng102 = normalizeIncident(raw);
          updatedIncidents = [ng102, ...state.incidents];
        }

        const logEntry: AuditLogEntry = {
          id: `log-voice-${Date.now()}`,
          timestamp,
          action: 'INCIDENT_SUBMITTED',
          details: `[${timestamp}] INCIDENT_SUBMITTED: Voice distress call ingested -> ${ng102.code} (Priority: ${ng102.score?.toFixed(1) ?? '81.0'} - ${ng102.category})`,
          incidentId: ng102.id,
        };

        set({
          incidents: updatedIncidents,
          selectedIncidentId: ng102.id,
          activityLogs: [logEntry, ...state.activityLogs],
        });

        return ng102;
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
