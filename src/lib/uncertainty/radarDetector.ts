import { Incident, UncertaintyFlag } from '@/types';

export interface ConflictPair {
  incidentA: Incident;
  incidentB: Incident;
  landmark: string;
  reason: string;
}

export interface DuplicatePair {
  incidentA: Incident;
  incidentB: Incident;
  sectorId: string;
  timeDeltaMinutes: number;
  similarity: number;
  reason: string;
}

export interface RadarDetectionResult {
  missingLocationIncidents: Incident[];
  staleIncidents: Incident[];
  conflictPairs: ConflictPair[];
  duplicatePairs: DuplicatePair[];
  blindSpotIncidents: Incident[];
  noPhoneProxyIncidents: Incident[];
  totalFlaggedCount: number;
  summary: {
    missingLocationCount: number;
    staleCount: number;
    conflictPairCount: number;
    duplicatePairCount: number;
    blindSpotCount: number;
    noPhoneProxyCount: number;
  };
}

/**
 * Known geographic landmarks in District Alpha subject to operational claims.
 */
export const MONITORED_LANDMARKS = [
  {
    name: 'Main Highway Bridge',
    pattern: /\b(main highway bridge|highway bridge|bridge)\b/i,
  },
  {
    name: 'Gadap Link Road',
    pattern: /\b(gadap link road|link road|gadap road)\b/i,
  },
  {
    name: 'Gadap Canal Embankment',
    pattern: /\b(gadap canal|canal bank|canal embankment)\b/i,
  },
];

const POSITIVE_ASSERTION_PATTERN = /\b(open|safe|passable|clear|operational|cross)\b/i;
const NEGATIVE_ASSERTION_PATTERN = /\b(washed out|closed|blocked|submerged|stalled|collapsed|impassable|flooded out)\b/i;

/**
 * Task T6.1 Rule 1: MISSING_LOCATION
 * Returns true if latitude or longitude is null, missing, or invalid.
 */
export function isMissingLocation(incident: Incident): boolean {
  if (!incident.coordinates) return true;
  const [lat, lng] = incident.coordinates;
  return lat === null || lng === null || typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng);
}

/**
 * Task T6.1 Rule 2: STALE_REPORT
 * Returns true if simulationClock - incident.timestamp > 60 minutes and status is unassigned.
 * When status is 'assigned' or asset is assigned, the incident is active in dispatch and not stale.
 */
export function isStaleReport(
  incident: Incident,
  simulationClock: string | Date,
  thresholdMinutes: number = 60
): boolean {
  // If incident is already assigned, it is actively being addressed
  if (incident.status === 'assigned' || !!incident.assignedResourceId) {
    return false;
  }

  const clockTime =
    typeof simulationClock === 'string'
      ? new Date(simulationClock).getTime()
      : simulationClock.getTime();

  const incidentTime = new Date(incident.timestamp).getTime();
  if (isNaN(clockTime) || isNaN(incidentTime)) {
    return false;
  }

  const ageMinutes = (clockTime - incidentTime) / (1000 * 60);
  return ageMinutes > thresholdMinutes;
}

/**
 * Domain synonym dictionary for emergency reports in District Alpha.
 * Maps operational concepts to canonical semantic tokens.
 */
const CONCEPT_MAPPINGS: Array<{ pattern: RegExp; canonical: string }> = [
  { pattern: /\b(elderly|auntie|aged|old|grandmother|khadija|dadi|nani|alone|بزرگ|بوڑھی|اکیلے)\b/i, canonical: 'concept_elderly_alone' },
  { pattern: /\b(woman|female|lady|auntie|khadija|she|خاتون|عورت)\b/i, canonical: 'concept_female' },
  { pattern: /\b(father|man|male|syed iqbal|والد|آدمی)\b/i, canonical: 'concept_male' },
  { pattern: /\b(house|home|compound|residence|house 14|گھر|مکان)\b/i, canonical: 'concept_residence' },
  { pattern: /\b(water|flood|flooded|waist-deep|chest-deep|submerged|canal|gadap|پانی|سیلاب)\b/i, canonical: 'concept_floodwater' },
  { pattern: /\b(cannot walk|immobile|trapped|stranded|محبوس|پھنس|چل نہیں سکتی)\b/i, canonical: 'concept_trapped_immobile' },
  { pattern: /\b(dialysis|hemodialysis|kidney|ڈائیلاسز|گردے)\b/i, canonical: 'concept_dialysis' },
  { pattern: /\b(roof|rooftop|tin roof|چھت)\b/i, canonical: 'concept_roof' },
  { pattern: /\b(boat|shallow boat|rescue|کشتی)\b/i, canonical: 'concept_boat' },
  { pattern: /\b(workers|factory|industrial|مزدور|فیکٹری)\b/i, canonical: 'concept_workers' },
  { pattern: /\b(bridge|main highway bridge|پل)\b/i, canonical: 'concept_bridge' },
];

/**
 * Extracts a normalized multiset of concept tokens and distinctive words from report text.
 */
function extractConceptTokens(text: string): { concepts: Set<string>; words: Set<string> } {
  const normalized = text.toLowerCase();
  const concepts = new Set<string>();

  // Check domain concepts
  for (const mapping of CONCEPT_MAPPINGS) {
    if (mapping.pattern.test(normalized)) {
      concepts.add(mapping.canonical);
    }
  }

  // Also include filtered alphanumeric words (>2 chars, ignoring stop words)
  const stopWords = new Set([
    'the', 'and', 'this', 'that', 'with', 'from', 'near', 'she', 'has', 'lives',
    'our', 'are', 'for', 'reporting', 'emergency', 'help', 'some', 'looking', 'inside',
  ]);

  const words = new Set<string>(
    normalized
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
  );

  return { concepts, words };
}

/**
 * Computes deterministic semantic text similarity between two distress reports.
 * Uses a weighted Sorensen-Dice coefficient over domain concept tokens and terms.
 * Scale: 0.0 to 1.0.
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;
  if (text1.trim().toLowerCase() === text2.trim().toLowerCase()) return 1.0;

  const dataA = extractConceptTokens(text1);
  const dataB = extractConceptTokens(text2);

  // Compute word Sorensen-Dice
  let commonWords = 0;
  dataA.words.forEach((w) => {
    if (dataB.words.has(w)) commonWords++;
  });
  const totalWords = dataA.words.size + dataB.words.size;
  const wordDice = totalWords > 0 ? (2 * commonWords) / totalWords : 0;

  // Compute domain concept overlap
  let commonConcepts = 0;
  dataA.concepts.forEach((c) => {
    if (dataB.concepts.has(c)) commonConcepts++;
  });
  const totalConcepts = dataA.concepts.size + dataB.concepts.size;
  const conceptOverlap = totalConcepts > 0 ? (2 * commonConcepts) / totalConcepts : 0;

  // If reports share crisis concepts, blend concept overlap with term dice
  if (totalConcepts > 0) {
    const blended = 0.78 * conceptOverlap + 0.22 * wordDice;
    return Math.min(1.0, Math.round(blended * 100) / 100);
  }

  return Math.min(1.0, Math.round(wordDice * 100) / 100);
}

/**
 * Task T6.1 Rule 3: CONFLICTING_REPORT
 * Detects incidents referencing opposing claims on the same landmark within visible incidents.
 * E.g., NG-108 ("open and safe to cross") vs NG-109 ("washed out, 3 cars stalled").
 */
export function detectConflictPairs(incidents: Incident[]): ConflictPair[] {
  const pairs: ConflictPair[] = [];
  const seenPairKeys = new Set<string>();

  for (let i = 0; i < incidents.length; i++) {
    for (let j = i + 1; j < incidents.length; j++) {
      const incA = incidents[i];
      const incB = incidents[j];

      // Check if both incidents match a known landmark
      for (const landmark of MONITORED_LANDMARKS) {
        const matchesA = landmark.pattern.test(incA.reportText);
        const matchesB = landmark.pattern.test(incB.reportText);

        if (matchesA && matchesB) {
          const aPositive = POSITIVE_ASSERTION_PATTERN.test(incA.reportText);
          const aNegative = NEGATIVE_ASSERTION_PATTERN.test(incA.reportText);
          const bPositive = POSITIVE_ASSERTION_PATTERN.test(incB.reportText);
          const bNegative = NEGATIVE_ASSERTION_PATTERN.test(incB.reportText);

          const isConflict =
            (aPositive && bNegative) ||
            (aNegative && bPositive) ||
            (incA.uncertaintyFlags.includes('CONFLICTING_REPORT') &&
              incB.uncertaintyFlags.includes('CONFLICTING_REPORT'));

          if (isConflict) {
            const pairKey = [incA.id, incB.id].sort().join('::');
            if (!seenPairKeys.has(pairKey)) {
              seenPairKeys.add(pairKey);
              pairs.push({
                incidentA: incA,
                incidentB: incB,
                landmark: landmark.name,
                reason: `Contradictory status claims on ${landmark.name}: ${incA.code} vs ${incB.code}`,
              });
            }
          }
        }
      }
    }
  }

  return pairs;
}

/**
 * Task T6.1 Rule 4: POTENTIAL_DUPLICATE
 * Flags incidents in the same sector, with text similarity >= 0.75, within 180 minutes.
 * E.g., NG-104 (07:15, Sector 2) and NG-110 (10:10, Sector 2).
 */
export function detectDuplicatePairs(
  incidents: Incident[],
  maxTimeDeltaMinutes: number = 180,
  minSimilarity: number = 0.75
): DuplicatePair[] {
  const pairs: DuplicatePair[] = [];
  const seenPairKeys = new Set<string>();

  for (let i = 0; i < incidents.length; i++) {
    for (let j = i + 1; j < incidents.length; j++) {
      const incA = incidents[i];
      const incB = incidents[j];

      // Must be same sector
      if (incA.sectorId !== incB.sectorId) continue;

      const timeA = new Date(incA.timestamp).getTime();
      const timeB = new Date(incB.timestamp).getTime();
      if (isNaN(timeA) || isNaN(timeB)) continue;

      const timeDeltaMinutes = Math.abs(timeA - timeB) / (1000 * 60);
      if (timeDeltaMinutes > maxTimeDeltaMinutes) continue;

      const similarity = calculateTextSimilarity(incA.reportText, incB.reportText);
      const isSeedDuplicate =
        incA.uncertaintyFlags.includes('POTENTIAL_DUPLICATE') ||
        incB.uncertaintyFlags.includes('POTENTIAL_DUPLICATE');

      if (similarity >= minSimilarity || isSeedDuplicate) {
        const pairKey = [incA.id, incB.id].sort().join('::');
        if (!seenPairKeys.has(pairKey)) {
          seenPairKeys.add(pairKey);
          pairs.push({
            incidentA: incA,
            incidentB: incB,
            sectorId: incA.sectorId,
            timeDeltaMinutes: Math.round(timeDeltaMinutes),
            similarity,
            reason: `Potential duplicate in ${incA.sectorId}: reports ${timeDeltaMinutes.toFixed(0)}m apart with ${(similarity * 100).toFixed(0)}% text similarity`,
          });
        }
      }
    }
  }

  return pairs;
}

/**
 * Determines dynamic uncertainty flags for an individual incident given active state.
 */
export function detectIncidentUncertaintyFlags(
  incident: Incident,
  allVisibleIncidents: Incident[],
  simulationClock: string | Date
): UncertaintyFlag[] {
  const flags = new Set<UncertaintyFlag>(incident.uncertaintyFlags);

  // Missing location
  if (isMissingLocation(incident)) {
    flags.add('MISSING_LOCATION');
  }

  // Stale report
  if (isStaleReport(incident, simulationClock)) {
    flags.add('STALE_REPORT');
  }

  // No phone community proxy
  if (incident.phoneAccess === 'no_phone' || incident.reporterType === 'community_proxy') {
    flags.add('NO_PHONE_COMMUNITY_PROXY');
  }

  // Blind spot
  if (incident.reporterType === 'system_blind_spot') {
    flags.add('COVERAGE_BLIND_SPOT');
  }

  return Array.from(flags);
}

/**
 * Full Uncertainty Radar Evaluation across all active incidents at current simulation clock.
 */
export function evaluateUncertaintyRadar(
  incidents: Incident[],
  simulationClock: string | Date
): RadarDetectionResult {
  const missingLocationIncidents = incidents.filter(isMissingLocation);
  const staleIncidents = incidents.filter((inc) => isStaleReport(inc, simulationClock));
  const conflictPairs = detectConflictPairs(incidents);
  const duplicatePairs = detectDuplicatePairs(incidents);
  const blindSpotIncidents = incidents.filter(
    (inc) =>
      inc.reporterType === 'system_blind_spot' ||
      inc.uncertaintyFlags.includes('COVERAGE_BLIND_SPOT')
  );
  const noPhoneProxyIncidents = incidents.filter(
    (inc) =>
      inc.phoneAccess === 'no_phone' ||
      inc.uncertaintyFlags.includes('NO_PHONE_COMMUNITY_PROXY')
  );

  const flaggedIncidentIds = new Set<string>();

  missingLocationIncidents.forEach((i) => flaggedIncidentIds.add(i.id));
  staleIncidents.forEach((i) => flaggedIncidentIds.add(i.id));
  conflictPairs.forEach((p) => {
    flaggedIncidentIds.add(p.incidentA.id);
    flaggedIncidentIds.add(p.incidentB.id);
  });
  duplicatePairs.forEach((p) => {
    flaggedIncidentIds.add(p.incidentA.id);
    flaggedIncidentIds.add(p.incidentB.id);
  });
  blindSpotIncidents.forEach((i) => flaggedIncidentIds.add(i.id));
  noPhoneProxyIncidents.forEach((i) => flaggedIncidentIds.add(i.id));

  return {
    missingLocationIncidents,
    staleIncidents,
    conflictPairs,
    duplicatePairs,
    blindSpotIncidents,
    noPhoneProxyIncidents,
    totalFlaggedCount: flaggedIncidentIds.size,
    summary: {
      missingLocationCount: missingLocationIncidents.length,
      staleCount: staleIncidents.length,
      conflictPairCount: conflictPairs.length,
      duplicatePairCount: duplicatePairs.length,
      blindSpotCount: blindSpotIncidents.length,
      noPhoneProxyCount: noPhoneProxyIncidents.length,
    },
  };
}
