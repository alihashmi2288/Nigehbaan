import { z } from 'zod';

export type ShelterStatus = 'active' | 'overcrowded' | 'evacuating' | 'offline';

export const ShelterStatusEnum = z.enum(['active', 'overcrowded', 'evacuating', 'offline']);

export interface Shelter {
  id: string;
  name: string;
  sectorId: string;
  capacityTotal: number;
  capacityCurrent: number;
  capacityOccupied?: number; // Alias kept in sync with capacityCurrent for Test 2.1
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
  capacityOccupied: z.number().int().nonnegative().optional(),
  backupGenerator: z.boolean(),
  capabilities: z.array(z.string()),
  status: ShelterStatusEnum,
});

export interface ShelterMatchCandidate {
  shelter: Shelter;
  isEligible: boolean;
  isRecommended: boolean;
  matchScore: number;
  matchingCapabilities: string[];
  missingCapabilities: string[];
  occupancyPercentage: number;
  exclusionReason?: string;
  deprioritizationReason?: string;
}

export interface ShelterMatchResult {
  recommendedShelter: Shelter | null;
  candidates: ShelterMatchCandidate[];
  eligibleCount: number;
  filteredOutCount: number;
  requiredCapabilities: string[];
  rationale: string;
}
