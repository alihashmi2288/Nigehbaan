import { z } from 'zod';
import { TimelinePhaseId, TimelinePhaseIdEnum } from './incident';

export interface TimelinePhase {
  id: TimelinePhaseId;
  label: string;
  wallClock: string;
  riverGauge: number;
  hazardLevel: string;
  description: string;
}

export const TimelinePhaseSchema = z.object({
  id: TimelinePhaseIdEnum,
  label: z.string(),
  wallClock: z.string(),
  riverGauge: z.number(),
  hazardLevel: z.string(),
  description: z.string(),
});

export interface CellTower {
  id: string;
  status: 'online' | 'offline';
  offlineSince: string | null;
}

export const CellTowerSchema = z.object({
  id: z.string(),
  status: z.enum(['online', 'offline']),
  offlineSince: z.string().nullable(),
});

export interface FloodGauge {
  levelMeters: number;
  trend: 'stable' | 'rising' | 'falling';
  hazardThresholdMeters: number;
}

export const FloodGaugeSchema = z.object({
  levelMeters: z.number(),
  trend: z.enum(['stable', 'rising', 'falling']),
  hazardThresholdMeters: z.number(),
});

export interface Sector {
  id: string;
  name: string;
  elevationMeters: number;
  cellTower: CellTower;
  floodGauge: FloodGauge;
  bounds: [number, number][];
}

export const SectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  elevationMeters: z.number(),
  cellTower: CellTowerSchema,
  floodGauge: FloodGaugeSchema,
  bounds: z.array(z.tuple([z.number(), z.number()])),
});

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  incidentId?: string;
  resourceId?: string;
}

export const AuditLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  action: z.string(),
  details: z.string(),
  incidentId: z.string().optional(),
  resourceId: z.string().optional(),
});

export interface Scenario {
  name: string;
  timelinePhases: TimelinePhase[];
}

export const ScenarioSchema = z.object({
  name: z.string(),
  timelinePhases: z.array(TimelinePhaseSchema),
});
