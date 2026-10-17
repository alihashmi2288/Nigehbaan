import seedDataJson from './seed.json';
import {
  Incident,
  IncidentSchema,
  Resource,
  ResourceSchema,
  Shelter,
  ShelterSchema,
  Sector,
  SectorSchema,
  Scenario,
  ScenarioSchema,
  TimelinePhase,
  TimelinePhaseId,
  AuditLogEntry,
} from '@/types';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';

export interface PristineState {
  scenario: Scenario;
  timelinePhase: TimelinePhaseId;
  sectors: Sector[];
  resources: Resource[];
  shelters: Shelter[];
  incidents: Incident[];
  activityLogs: AuditLogEntry[];
}

/**
 * Normalizes a raw incident from seed data:
 * - Computes deterministic MCDA score, confidence, and category
 * - Sets default status to 'triaged' if absent
 * - Sets assignedResourceId to null
 */
export function normalizeIncident(raw: any): Incident {
  const scoring = calculatePriorityScore(raw.factors, {
    reporterType: raw.reporterType,
    phoneAccess: raw.phoneAccess,
  });

  const normalized: Incident = {
    id: raw.id,
    code: raw.code,
    sectorId: raw.sectorId,
    reporterType: raw.reporterType,
    phoneAccess: raw.phoneAccess,
    timestamp: raw.timestamp,
    phaseArrival: raw.phaseArrival,
    reportText: raw.reportText,
    reportTranslation: raw.reportTranslation ?? null,
    factors: raw.factors,
    expectedScore: raw.expectedScore ?? scoring.score,
    score: scoring.score,
    confidence: scoring.confidence,
    category: scoring.category,
    label: raw.label ?? scoring.label,
    uncertaintyFlags: raw.uncertaintyFlags ?? [],
    coordinates: raw.coordinates ?? null,
    targetResource: raw.targetResource,
    targetShelter: raw.targetShelter,
    assignedResourceId: raw.assignedResourceId ?? null,
    status: raw.status ?? 'triaged',
    provenanceBadge: raw.provenanceBadge,
    isAI: raw.isAI,
    extractedFacts: raw.extractedFacts,
  };

  return IncidentSchema.parse(normalized);
}

/**
 * Normalizes a raw resource from seed data:
 * - Sets default status to 'available' if absent
 * - Sets assignedIncidentId to null
 */
export function normalizeResource(raw: any): Resource {
  const normalized: Resource = {
    id: raw.id,
    callsign: raw.callsign,
    type: raw.type,
    stationSector: raw.stationSector,
    seatCapacity: raw.seatCapacity,
    speedKmH: raw.speedKmH,
    turnaroundMinutes: raw.turnaroundMinutes,
    status: raw.status ?? 'available',
    assignedIncidentId: raw.assignedIncidentId ?? null,
  };

  return ResourceSchema.parse(normalized);
}

/**
 * Returns deep-cloned pristine Sector entities validated against SectorSchema.
 */
export function getPristineSectors(): Sector[] {
  return seedDataJson.sectors.map((s) => SectorSchema.parse(JSON.parse(JSON.stringify(s))));
}

/**
 * Returns deep-cloned pristine Shelter entities validated against ShelterSchema.
 */
export function getPristineShelters(): Shelter[] {
  return seedDataJson.shelters.map((s) => {
    const cloned = JSON.parse(JSON.stringify(s));
    if (cloned.capacityOccupied === undefined) {
      cloned.capacityOccupied = cloned.capacityCurrent;
    }
    return ShelterSchema.parse(cloned);
  });
}

/**
 * Returns deep-cloned pristine Resource entities validated against ResourceSchema.
 * Confirms exact stationing: RES-01 in sector-2, RES-02 in sector-3a.
 */
export function getPristineResources(): Resource[] {
  return seedDataJson.resources.map((r) => normalizeResource(JSON.parse(JSON.stringify(r))));
}

/**
 * Returns deep-cloned pristine Incident entities with deterministic MCDA scores.
 */
export function getPristineIncidents(): Incident[] {
  return seedDataJson.incidents.map((i) => normalizeIncident(JSON.parse(JSON.stringify(i))));
}

/**
 * Returns pristine Scenario metadata and timeline phases.
 */
export function getPristineScenario(): Scenario {
  return ScenarioSchema.parse(JSON.parse(JSON.stringify(seedDataJson.scenario)));
}

/**
 * Returns timeline phases for the District Alpha scenario.
 */
export function getPristineTimelinePhases(): TimelinePhase[] {
  return getPristineScenario().timelinePhases;
}

/**
 * Returns initial baseline audit log entries.
 */
export function getPristineAuditLogs(): AuditLogEntry[] {
  return [
    {
      id: 'log-seed-001',
      timestamp: '2026-10-18T04:30:00Z',
      action: 'SYSTEM_INIT',
      details: 'District Alpha scenario initialized at T-0 Early Warning baseline.',
    },
  ];
}

/**
 * Returns complete pristine application state pre-warmed for District Alpha.
 */
export function getPristineState(): PristineState {
  return {
    scenario: getPristineScenario(),
    timelinePhase: 'T0',
    sectors: getPristineSectors(),
    resources: getPristineResources(),
    shelters: getPristineShelters(),
    incidents: getPristineIncidents(),
    activityLogs: getPristineAuditLogs(),
  };
}
