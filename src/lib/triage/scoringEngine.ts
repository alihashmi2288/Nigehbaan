import { PriorityCategory, PhoneAccessStatus, ReporterType } from '@/types';

/**
 * Weights assigned to each MCDA factor, strictly summing to 1.00.
 * Invariant 1: Pure mathematical determinism.
 */
export const FACTOR_WEIGHTS = [0.30, 0.25, 0.20, 0.15, 0.10] as const;

export const FACTOR_NAMES = [
  'Immediate Threat to Life',
  'Medical Urgency',
  'Evacuation Inability',
  'Environmental Danger',
  'Population Affected',
] as const;

export interface FactorBreakdownItem {
  factorIndex: number;
  name: string;
  weight: number;
  rawValue: number | null;
  adjustedValue: number | null;
  contribution: number;
  isKnown: boolean;
}

export interface ScoringResult {
  score: number;
  category: PriorityCategory;
  confidence: number;
  knownFactorCount: number;
  unknownFactorCount: number;
  isRenormalized: boolean;
  adjustedFactors: [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ];
  factorBreakdown: FactorBreakdownItem[];
  appliedFloors: {
    noPhoneFloorApplied: boolean;
    blindSpotFloorApplied: boolean;
  };
  label?: string;
  explanationText: string;
}

export interface ScoringOptions {
  reporterType?: ReporterType | string;
  phoneAccess?: PhoneAccessStatus | string;
}

/**
 * Deterministic MCDA 5-Factor Triage Scoring Engine.
 *
 * Implements the formula:
 *   Score = 100 * (sum_{known} w_i * (f_i / 5.0)) / (sum_{known} w_i)
 *
 * Guaranteed Invariants:
 * 1. Missing factors are NEVER treated as zero; weights are renormalized across known factors.
 * 2. If phoneAccess === 'no_phone', Evacuation Inability (f3) is enforced >= 4.0.
 * 3. If reporterType === 'system_blind_spot', Score is enforced >= 60.0 and Category is High.
 * 4. Zero LLM involvement.
 */
export function calculatePriorityScore(
  factors: (number | null | undefined)[],
  options: ScoringOptions = {}
): ScoringResult {
  const { reporterType, phoneAccess } = options;

  // Prepare factor array with exactly 5 slots
  const rawFactors: (number | null)[] = [
    factors[0] !== undefined ? factors[0] : null,
    factors[1] !== undefined ? factors[1] : null,
    factors[2] !== undefined ? factors[2] : null,
    factors[3] !== undefined ? factors[3] : null,
    factors[4] !== undefined ? factors[4] : null,
  ];

  const adjustedFactors: [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ] = [...rawFactors] as [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ];

  let noPhoneFloorApplied = false;

  // Invariant 3: Vulnerability Floor for no-phone status
  // If communication_status == 'no_phone', Evacuation Inability is >= 4.0
  if (phoneAccess === 'no_phone') {
    const currentF3 = adjustedFactors[2];
    if (currentF3 === null || currentF3 < 4.0) {
      adjustedFactors[2] = 4.0;
      noPhoneFloorApplied = true;
    }
  }

  let knownWeightSum = 0;
  let knownWeightedScoreSum = 0;
  let knownFactorCount = 0;

  for (let i = 0; i < 5; i++) {
    const val = adjustedFactors[i];
    if (val !== null && val !== undefined) {
      const weight = FACTOR_WEIGHTS[i];
      knownWeightSum += weight;
      knownWeightedScoreSum += weight * (val / 5.0);
      knownFactorCount++;
    }
  }

  const unknownFactorCount = 5 - knownFactorCount;
  const isRenormalized = unknownFactorCount > 0;
  const confidence = Math.round(knownWeightSum * 100) / 100;

  let rawCalculatedScore = 0.0;
  if (knownWeightSum > 0) {
    rawCalculatedScore = 100 * (knownWeightedScoreSum / knownWeightSum);
  }

  let finalScore = rawCalculatedScore;
  let blindSpotFloorApplied = false;

  // Invariant 3: Blind-spot floor (minimum 60.0, labeled Physical Welfare Recon / Field Sweep)
  if (reporterType === 'system_blind_spot') {
    if (finalScore < 60.0) {
      finalScore = 60.0;
      blindSpotFloorApplied = true;
    }
  }

  // Round final score to 1 decimal place
  finalScore = Math.round(finalScore * 10) / 10;

  // Determine Category
  // Thresholds: Critical >= 75.0, High 55.0 - 74.9, Moderate 35.0 - 54.9, Low < 35.0
  let category: PriorityCategory;
  if (reporterType === 'system_blind_spot') {
    // Invariant 3: A blind spot is never auto-Critical, strictly High
    category = 'High';
  } else if (finalScore >= 75.0) {
    category = 'Critical';
  } else if (finalScore >= 55.0) {
    category = 'High';
  } else if (finalScore >= 35.0) {
    category = 'Moderate';
  } else {
    category = 'Low';
  }

  // Build factor breakdown and explainability
  const factorBreakdown: FactorBreakdownItem[] = [];
  const formulaParts: string[] = [];

  for (let i = 0; i < 5; i++) {
    const rawVal = rawFactors[i];
    const adjVal = adjustedFactors[i];
    const isKnown = adjVal !== null && adjVal !== undefined;
    const weight = FACTOR_WEIGHTS[i];
    const contribution = isKnown && knownWeightSum > 0
      ? Math.round((100 * (weight * (adjVal / 5.0)) / knownWeightSum) * 10) / 10
      : 0;

    factorBreakdown.push({
      factorIndex: i + 1,
      name: FACTOR_NAMES[i],
      weight,
      rawValue: rawVal,
      adjustedValue: adjVal,
      contribution,
      isKnown,
    });

    if (isKnown) {
      formulaParts.push(`(${weight} × ${adjVal.toFixed(1)}/5.0)`);
    }
  }

  let explanationText = '';
  if (formulaParts.length > 0) {
    explanationText = `100 × [${formulaParts.join(' + ')}] / ${knownWeightSum.toFixed(2)} = ${finalScore.toFixed(1)}`;
  } else {
    explanationText = 'No known factors available to compute score (0.0)';
  }

  const result: ScoringResult = {
    score: finalScore,
    category,
    confidence,
    knownFactorCount,
    unknownFactorCount,
    isRenormalized,
    adjustedFactors,
    factorBreakdown,
    appliedFloors: {
      noPhoneFloorApplied,
      blindSpotFloorApplied,
    },
    label: reporterType === 'system_blind_spot' ? 'Physical Welfare Recon / Field Sweep' : undefined,
    explanationText,
  };

  return result;
}

/**
 * Deterministic factor lookup tables strictly derived from docs/scoring-spec.md Section 3.
 */

export function lookupLifeThreatScore(condition: string): number {
  switch (condition.toLowerCase()) {
    case 'none':
      return 0.0;
    case 'potential':
      return 1.5;
    case 'moderate_threat':
      return 3.0;
    case 'severe_threat':
      return 4.0;
    case 'imminent_drowning':
    case 'collapse':
      return 5.0;
    default:
      return 0.0;
  }
}

export function lookupMedicalUrgencyScore(condition: string): number {
  switch (condition.toLowerCase()) {
    case 'none':
      return 0.0;
    case 'minor_injury':
      return 1.0;
    case 'chronic_managed':
      return 2.5;
    case 'urgent_medical':
      return 3.5;
    case 'time_critical_dependency':
      return 5.0;
    default:
      return 0.0;
  }
}

export function lookupEvacuationInabilityScore(condition: string): number {
  switch (condition.toLowerCase()) {
    case 'independent_adults':
      return 0.0;
    case 'minor_impairment':
      return 1.5;
    case 'vulnerable_group':
      return 3.0;
    case 'high_vulnerability':
      return 4.0;
    case 'completely_immobile':
      return 5.0;
    default:
      return 0.0;
  }
}

export function lookupEnvironmentalDangerScore(condition: string): number {
  switch (condition.toLowerCase()) {
    case 'dry':
    case 'ankle_deep':
      return 0.5;
    case 'knee_deep':
      return 2.0;
    case 'waist_deep':
      return 3.5;
    case 'chest_deep':
      return 4.5;
    case 'submerged_roof':
      return 5.0;
    default:
      return 0.5;
  }
}

export function lookupPopulationScore(headcount: number | null | undefined): number {
  if (headcount === null || headcount === undefined || headcount <= 0) {
    return 1.0;
  }
  if (headcount === 1) return 1.0;
  if (headcount >= 2 && headcount <= 4) return 2.5;
  if (headcount >= 5 && headcount <= 9) return 4.0;
  return 5.0; // 10+ people / institutional
}
