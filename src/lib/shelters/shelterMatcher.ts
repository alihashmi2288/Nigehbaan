import { Incident, Shelter, ShelterMatchCandidate, ShelterMatchResult } from '@/types';

/**
 * Extracts required medical capabilities from an incident report.
 * Evaluates distress report text, translation, and structured extraction.
 */
export function extractRequiredCapabilities(incident: Incident): string[] {
  const medicalConditions = incident.extractedFacts?.medicalConditionsReported ?? [];
  const textToScan = [
    incident.reportText,
    incident.reportTranslation ?? '',
    ...medicalConditions,
  ]
    .join(' ')
    .toLowerCase();

  const required: string[] = [];

  // Hemodialysis dependency (e.g. NG-101)
  if (
    textToScan.includes('dialysis') ||
    textToScan.includes('hemodialysis') ||
    textToScan.includes('kidney') ||
    (incident.code === 'NG-101')
  ) {
    required.push('Dialysis Support');
  }

  // Oxygen / Ventilator dependency
  if (
    textToScan.includes('oxygen') ||
    textToScan.includes('ventilator') ||
    textToScan.includes('respiratory') ||
    textToScan.includes('breathing')
  ) {
    required.push('Oxygen');
  }

  // Maternal care / pregnancy
  if (
    textToScan.includes('pregnant') ||
    textToScan.includes('maternal') ||
    textToScan.includes('labor') ||
    textToScan.includes('baby') ||
    textToScan.includes('infant')
  ) {
    required.push('Maternal Care');
  }

  // ICU / Critical Care for severe multi-trauma
  if (
    textToScan.includes('icu') ||
    textToScan.includes('intensive care') ||
    (incident.factors &&
      incident.factors[0] !== null &&
      incident.factors[1] !== null &&
      incident.factors[0] >= 4.8 &&
      incident.factors[1] >= 4.8)
  ) {
    required.push('ICU Beds');
  }

  // Fallback if no specialized care was detected
  if (required.length === 0) {
    required.push('Basic First Aid');
  }

  return required;
}

/**
 * Checks whether a shelter possesses a specific capability.
 */
export function hasCapability(shelter: Shelter, capability: string): boolean {
  const normCap = capability.trim().toLowerCase();
  return shelter.capabilities.some((c) => {
    const sCap = c.trim().toLowerCase();
    return sCap.includes(normCap) || normCap.includes(sCap);
  });
}

/**
 * Evaluates whether a shelter is eligible for evacuee routing.
 * Strictly filters out shelters with occupancy >= 95% or power failure.
 */
export function evaluateShelterEligibility(shelter: Shelter): {
  isEligible: boolean;
  exclusionReason?: string;
} {
  const current = shelter.capacityOccupied ?? shelter.capacityCurrent;
  const occupancyPercentage = shelter.capacityTotal > 0 ? (current / shelter.capacityTotal) * 100 : 100;

  // Strict Rule 1: Occupancy >= 95% combined with or without power failure
  if (occupancyPercentage >= 95 && !shelter.backupGenerator) {
    return {
      isEligible: false,
      exclusionReason: `Critical overcrowding (${Math.round(occupancyPercentage)}% ≥ 95%) and power failure (no backup generator)`,
    };
  }

  if (occupancyPercentage >= 95) {
    return {
      isEligible: false,
      exclusionReason: `Critical overcrowding (${Math.round(occupancyPercentage)}% ≥ 95% capacity threshold)`,
    };
  }

  // Strict Rule 2: Grid blackout without backup generator when status is overcrowded or offline
  if (!shelter.backupGenerator && (shelter.status === 'overcrowded' || shelter.status === 'offline')) {
    return {
      isEligible: false,
      exclusionReason: `Grid power failure without operational backup generator`,
    };
  }

  // Strict Rule 3: Facility offline or evacuating
  if (shelter.status === 'offline' || shelter.status === 'evacuating') {
    return {
      isEligible: false,
      exclusionReason: `Shelter status is '${shelter.status}'`,
    };
  }

  return { isEligible: true };
}

/**
 * Evaluates candidate destination shelters for an incident.
 * Returns sorted candidates with recommended destination, filtered out facilities,
 * and auditable capability match rationale.
 */
export function matchShelterForIncident(
  incident: Incident,
  shelters: Shelter[]
): ShelterMatchResult {
  const requiredCapabilities = extractRequiredCapabilities(incident);

  const candidates: ShelterMatchCandidate[] = shelters.map((shelter) => {
    const current = shelter.capacityOccupied ?? shelter.capacityCurrent;
    const occupancyPercentage =
      shelter.capacityTotal > 0 ? (current / shelter.capacityTotal) * 100 : 100;

    const eligibility = evaluateShelterEligibility(shelter);

    const matchingCapabilities = requiredCapabilities.filter((req) =>
      hasCapability(shelter, req)
    );
    const missingCapabilities = requiredCapabilities.filter(
      (req) => !hasCapability(shelter, req)
    );

    let matchScore = 0;
    let deprioritizationReason: string | undefined;

    if (!eligibility.isEligible) {
      matchScore = -1000;
    } else {
      // 1. Capability Score: heavily weight matching required medical capabilities
      const hasAllRequired = missingCapabilities.length === 0;
      if (hasAllRequired) {
        matchScore += 100 + matchingCapabilities.length * 20;
      } else {
        matchScore += matchingCapabilities.length * 10;
        deprioritizationReason = `Lacks required medical capability: ${missingCapabilities.join(', ')}`;
      }

      // 2. Headroom score (remaining capacity)
      const headroomFraction = Math.max(0, 1 - occupancyPercentage / 100);
      matchScore += headroomFraction * 20;

      // 3. Active backup generator bonus
      if (shelter.backupGenerator) {
        matchScore += 10;
      }

      // 4. Proximity bonus (same sector)
      if (
        shelter.sectorId.toLowerCase() === incident.sectorId.toLowerCase()
      ) {
        matchScore += 5;
      }
    }

    return {
      shelter: {
        ...shelter,
        capacityOccupied: current,
      },
      isEligible: eligibility.isEligible,
      isRecommended: false,
      matchScore,
      matchingCapabilities,
      missingCapabilities,
      occupancyPercentage: Math.round(occupancyPercentage),
      exclusionReason: eligibility.exclusionReason,
      deprioritizationReason,
    };
  });

  // Sort candidates: eligible first, then by matchScore descending
  candidates.sort((a, b) => {
    if (a.isEligible !== b.isEligible) {
      return a.isEligible ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });

  const eligibleCandidates = candidates.filter((c) => c.isEligible);
  const bestCandidate = eligibleCandidates.length > 0 ? eligibleCandidates[0] : null;

  if (bestCandidate) {
    bestCandidate.isRecommended = true;
  }

  const eligibleCount = eligibleCandidates.length;
  const filteredOutCount = candidates.length - eligibleCount;

  // Build auditable rationale
  let rationale = '';
  if (bestCandidate) {
    const medCaps = bestCandidate.matchingCapabilities.join(', ');
    rationale = `Selected ${bestCandidate.shelter.name} (${bestCandidate.occupancyPercentage}% capacity) based on required capabilities [${medCaps || 'Standard Relief'}] and active backup generator.`;
  } else {
    rationale = 'No eligible shelters available matching constraints.';
  }

  return {
    recommendedShelter: bestCandidate ? bestCandidate.shelter : null,
    candidates,
    eligibleCount,
    filteredOutCount,
    requiredCapabilities,
    rationale,
  };
}
