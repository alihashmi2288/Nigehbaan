import { Incident, IncidentFactors } from '@/types';
import { FACTOR_WEIGHTS } from './scoringEngine';

export interface ExplainabilityRationale {
  bullets: string[];
  primaryDriver: string;
  source: 'deterministic_rules';
  isDeterministic: boolean;
  confidencePercent: number;
  knownFactorCount: number;
}

const FACTOR_NAMES = [
  'Immediate Threat to Life',
  'Medical Urgency',
  'Evacuation Inability',
  'Environmental Danger',
  'Population Affected',
] as const;

/**
 * Deterministic explainability rationale generator.
 * Converts mathematical factor weights, scores, and incident metadata into
 * 2 to 3 concise, human-auditable justification bullets for coordinators.
 *
 * Adheres strictly to docs/ai-prompts.md Section 2 and Non-Negotiable Invariants 1 & 7.
 */
export function generateExplainabilityRationale(
  incident: Incident
): ExplainabilityRationale {
  const factors: IncidentFactors = incident.factors;
  const bullets: string[] = [];

  // Count known factors and sum known weights
  let knownWeightSum = 0;
  let knownCount = 0;
  const factorContributions: { index: number; name: string; score: number; weight: number; contribution: number }[] = [];

  factors.forEach((f, idx) => {
    if (f !== null) {
      knownCount += 1;
      const weight = FACTOR_WEIGHTS[idx];
      knownWeightSum += weight;
      factorContributions.push({
        index: idx,
        name: FACTOR_NAMES[idx],
        score: f,
        weight,
        contribution: (f / 5.0) * weight,
      });
    }
  });

  const confidencePercent = Math.round(knownWeightSum * 100);

  // Sort factor contributions descending by weighted score
  factorContributions.sort((a, b) => b.contribution - a.contribution);

  // 1. Identify primary driving factors
  const topFactor = factorContributions[0];
  const secondFactor = factorContributions[1];

  let primaryDriver = 'Multi-factor triage balance';

  if (incident.reporterType === 'system_blind_spot') {
    primaryDriver = 'Infrastructure Telemetry Silence / Recon Sweep';
    bullets.push(
      'System Blind-Spot Floor enforced (≥ 60.0, High) following >90 min telemetry blackout during rising floodwaters.'
    );
    bullets.push(
      'Dispatched for physical welfare sweep and reconnaissance to detect trapped residents without cellular coverage.'
    );
  } else if (incident.category === 'Critical' && factors[1] !== null && factors[1] >= 4.5) {
    primaryDriver = 'Time-Critical Medical Dependency (Hemodialysis / Life Support)';
    bullets.push(
      `Top priority driven by critical medical urgency (${factors[1].toFixed(1)}/5.0) with immediate risk to life.`
    );
  } else if (topFactor && topFactor.score >= 4.0) {
    primaryDriver = `${topFactor.name} (${topFactor.score.toFixed(1)}/5.0)`;
    if (secondFactor && secondFactor.score >= 3.5) {
      bullets.push(
        `Urgency primarily driven by ${topFactor.name.toLowerCase()} (${topFactor.score.toFixed(1)}/5.0) compounded by ${secondFactor.name.toLowerCase()} (${secondFactor.score.toFixed(1)}/5.0).`
      );
    } else {
      bullets.push(
        `Priority predominantly driven by ${topFactor.name.toLowerCase()} evaluated at ${topFactor.score.toFixed(1)}/5.0.`
      );
    }
  } else if (topFactor) {
    primaryDriver = `${topFactor.name} (${topFactor.score.toFixed(1)}/5.0)`;
    bullets.push(
      `Priority evaluated across balanced criteria, led by ${topFactor.name.toLowerCase()} (${topFactor.score.toFixed(1)}/5.0).`
    );
  } else {
    bullets.push('Baseline triage evaluation based on preliminary incoming report.');
  }

  // 2. Specific floor or vulnerability observations
  if (incident.phoneAccess === 'no_phone') {
    bullets.push(
      'Evacuation Inability floor enforced (f₃ ≥ 4.0) due to complete cellular phone cutoff preventing self-coordination.'
    );
  } else if (factors[3] !== null && factors[3] >= 4.0) {
    bullets.push(
      `Environmental hazard severe (${factors[3].toFixed(1)}/5.0) with deep inundation cutting off conventional road egress.`
    );
  } else if (factors[2] !== null && factors[2] >= 4.0) {
    bullets.push(
      `High evacuation vulnerability (${factors[2].toFixed(1)}/5.0) identified due to restricted mobility or isolated vulnerable residents.`
    );
  }

  // 3. Renormalization or Information Confidence bullet
  if (knownCount < 5) {
    const unknownCount = 5 - knownCount;
    bullets.push(
      `Weights renormalized across known factors (${unknownCount} unknown, confidence: ${confidencePercent}%); missing data flags uncertainty and does not reduce urgency.`
    );
  } else {
    bullets.push(
      `Complete information confidence (${confidencePercent}%): All 5 decision criteria verified deterministically.`
    );
  }

  // Ensure strict 2-3 bullets limit per prompt specification
  const trimmedBullets = bullets.slice(0, 3);

  return {
    bullets: trimmedBullets,
    primaryDriver,
    source: 'deterministic_rules',
    isDeterministic: true,
    confidencePercent,
    knownFactorCount: knownCount,
  };
}
