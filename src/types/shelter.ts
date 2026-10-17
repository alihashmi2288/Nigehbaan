import { z } from 'zod';

export type ShelterStatus = 'active' | 'overcrowded' | 'evacuating' | 'offline';

export const ShelterStatusEnum = z.enum(['active', 'overcrowded', 'evacuating', 'offline']);

export interface Shelter {
  id: string;
  name: string;
  sectorId: string;
  capacityTotal: number;
  capacityCurrent: number;
  backupGenerator: boolean;
  capabilities: string[];
  status: ShelterStatus;
}

export const ShelterSchema = z.object({
  id: z.string(),
  name: z.string(),
  sectorId: z.string(),
  capacityTotal: z.number().int().nonnegative(),
  capacityCurrent: z.number().int().nonnegative(),
  backupGenerator: z.boolean(),
  capabilities: z.array(z.string()),
  status: ShelterStatusEnum,
});
