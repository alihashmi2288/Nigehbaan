import { z } from 'zod';

export type ResourceType = 'shallow_boat' | 'heavy_4x4' | 'mobile_medical' | 'recon_patrol';

export const ResourceTypeEnum = z.enum([
  'shallow_boat',
  'heavy_4x4',
  'mobile_medical',
  'recon_patrol',
]);

export type ResourceStatus =
  | 'available'
  | 'assigned'
  | 'en_route'
  | 'on_scene'
  | 'maintenance';

export const ResourceStatusEnum = z.enum([
  'available',
  'assigned',
  'en_route',
  'on_scene',
  'maintenance',
]);

export interface Resource {
  id: string;
  callsign: string;
  type: ResourceType;
  stationSector: string;
  seatCapacity: number;
  speedKmH: number;
  turnaroundMinutes: number;
  status: ResourceStatus;
  assignedIncidentId?: string | null;
}

export const ResourceSchema = z.object({
  id: z.string(),
  callsign: z.string(),
  type: ResourceTypeEnum,
  stationSector: z.string(),
  seatCapacity: z.number().int().positive(),
  speedKmH: z.number().positive(),
  turnaroundMinutes: z.number().int().nonnegative(),
  status: ResourceStatusEnum,
  assignedIncidentId: z.string().nullable().optional(),
});
