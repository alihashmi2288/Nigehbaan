import { Incident } from '@/types';
import { calculatePriorityScore } from './scoringEngine';

/**
 * Retrieves or computes score and confidence for an incident deterministically.
 */
export function getIncidentScoreAndConfidence(incident: Incident): {
  score: number;
  confidence: number;
} {
  if (
    typeof incident.score === 'number' &&
    typeof incident.confidence === 'number'
  ) {
    return {
      score: incident.score,
      confidence: incident.confidence,
    };
  }

  // If score is stored as expectedScore and confidence is not set, compute accurately
  const result = calculatePriorityScore(incident.factors, {
    reporterType: incident.reporterType,
    phoneAccess: incident.phoneAccess,
  });

  return {
    score: typeof incident.score === 'number' ? incident.score : result.score,
    confidence:
      typeof incident.confidence === 'number'
        ? incident.confidence
        : result.confidence,
  };
}

/**
 * Deterministic 3-tier comparator for triage queue ordering.
 *
 * Ranking Protocol (docs/scoring-spec.md Section 2):
 * 1. Primary Sort: Priority Score descending (highest score ranks first).
 * 2. Secondary Tie-Break (Confidence Inversion): If scores are tied within ±0.1,
 *    the incident with LOWER Information Confidence (C = sum_{known} w_i) is placed higher
 *    to immediately surface high-uncertainty risks for human review.
 * 3. Tertiary Tie-Break (FIFO / Seniority): If both score and confidence are identical,
 *    the incident with the earlier report timestamp ranks first.
 * 4. Deterministic Fallback: Incident code/id ascending.
 */
export function compareIncidents(a: Incident, b: Incident): number {
  const dataA = getIncidentScoreAndConfidence(a);
  const dataB = getIncidentScoreAndConfidence(b);

  const scoreDiff = dataB.score - dataA.score;

  // Primary: If difference is strictly greater than 0.1, sort by score descending
  if (Math.abs(scoreDiff) > 0.1) {
    return scoreDiff;
  }

  // Secondary Tie-Break: Within ±0.1, lower confidence ranks HIGHER (Confidence Inversion)
  const confDiff = dataA.confidence - dataB.confidence;
  if (Math.abs(confDiff) > 0.001) {
    return confDiff; // Smaller confidence comes first
  }

  // Tertiary Tie-Break: Earlier timestamp ranks HIGHER (FIFO)
  const timeA = new Date(a.timestamp).getTime();
  const timeB = new Date(b.timestamp).getTime();
  if (timeA !== timeB) {
    return timeA - timeB; // Smaller timestamp (earlier) comes first
  }

  // Deterministic Fallback
  const codeA = a.code || a.id;
  const codeB = b.code || b.id;
  return codeA.localeCompare(codeB);
}

/**
 * Returns a new array of incidents sorted strictly by the deterministic ranking protocol.
 * Does not mutate the original array.
 */
export function rankIncidentQueue(incidents: Incident[]): Incident[] {
  return [...incidents].sort(compareIncidents);
}
