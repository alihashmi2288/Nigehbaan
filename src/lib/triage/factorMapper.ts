import { ExtractedFacts, IncidentFactors } from '@/types';

/**
 * Deterministically maps ExtractedFacts into the 5 MCDA factors [f1, f2, f3, f4, f5]
 * strictly adhering to docs/scoring-spec.md Section 3:
 *
 * f1: Immediate Threat to Life (0.0 to 5.0)
 * f2: Medical Urgency (0.0 to 5.0)
 * f3: Evacuation Inability (0.0 to 5.0)
 * f4: Environmental Danger (0.0 to 5.0)
 * f5: Population Affected (0.0 to 5.0)
 */
export function mapFactsToFactors(facts: ExtractedFacts): IncidentFactors {
  // Factor 1: Immediate Threat to Life (w1 = 0.30)
  let f1: number | null = null;
  if (facts.structureIntegrity === 'collapsed' || facts.structureIntegrity === 'submerged') {
    f1 = 5.0;
  } else if (facts.structureIntegrity === 'cracking_roof') {
    f1 = 5.0;
  } else if (facts.waterDepthMeters !== null) {
    if (facts.waterDepthMeters >= 1.8) {
      f1 = 5.0;
    } else if (facts.waterDepthMeters >= 1.2) {
      f1 = 4.5;
    } else if (facts.waterDepthMeters >= 0.6) {
      f1 = 3.0;
    } else if (facts.waterDepthMeters >= 0.2) {
      f1 = 1.0;
    } else if (facts.waterDepthMeters > 0) {
      f1 = 0.5;
    } else {
      f1 = 0.0;
    }
  } else if (facts.waterCurrentSpeed === 'torrential') {
    f1 = 5.0;
  } else if (facts.waterCurrentSpeed === 'fast_rushing') {
    f1 = 4.0;
  } else if (facts.incidentType === 'property_damage') {
    f1 = 0.0;
  } else if (facts.incidentType === 'road_hazard') {
    f1 = 3.5;
  } else if (facts.incidentType === 'flood_rescue') {
    f1 = 3.0;
  }

  // Factor 2: Medical Urgency (w2 = 0.25)
  let f2: number | null = null;
  if (facts.medicalUrgencyLevel) {
    switch (facts.medicalUrgencyLevel) {
      case 'time_critical_dependency':
        f2 = 5.0;
        break;
      case 'urgent_medical':
        f2 = 3.5;
        break;
      case 'chronic_managed':
        f2 = 2.0; // In seed/fixtures, chronic mobility/impairment is 2.0
        break;
      case 'minor_injury':
        f2 = 1.0;
        break;
      case 'none':
        f2 = 0.0;
        break;
    }
  } else if (facts.medicalConditionsReported.length > 0) {
    const hasCritical = facts.medicalConditionsReported.some((c) =>
      /dialysis|oxygen|hemorrhage|unconscious/i.test(c)
    );
    if (hasCritical) {
      f2 = 5.0;
    } else {
      f2 = 2.0;
    }
  }

  // Factor 3: Evacuation Inability / Vulnerability (w3 = 0.20)
  let f3: number | null = null;
  if (facts.evacuationMobilityLevel) {
    switch (facts.evacuationMobilityLevel) {
      case 'completely_immobile':
        f3 = 5.0;
        break;
      case 'high_vulnerability':
        f3 = facts.vulnerabilityDetails.some((v) => /infant|baby|children/i.test(v)) ? 4.5 : 4.0;
        break;
      case 'vulnerable_group':
        f3 = 2.0; // Base mobility score 2.0 before no_phone floor lifts to 4.0 (Acceptance Test 1.3)
        break;
      case 'minor_impairment':
        f3 = 1.5;
        break;
      case 'independent_adults':
        f3 = 0.0;
        break;
    }
  } else if (facts.vulnerabilityDetails.length > 0) {
    if (facts.vulnerabilityDetails.some((v) => /infant|baby|children/i.test(v))) {
      f3 = 4.5;
    } else if (facts.vulnerabilityDetails.some((v) => /elderly|alone|trapped|bedridden/i.test(v))) {
      f3 = 4.0;
    } else {
      f3 = 3.0;
    }
  }

  // Factor 4: Environmental Danger & Inundation (w4 = 0.15)
  let f4: number | null = null;
  if (facts.waterDepthMeters !== null) {
    if (facts.waterDepthMeters >= 1.8) {
      f4 = 5.0;
    } else if (facts.waterDepthMeters >= 1.2) {
      f4 = 4.5;
    } else if (facts.waterDepthMeters >= 0.6) {
      f4 = 3.5;
    } else if (facts.waterDepthMeters >= 0.2) {
      f4 = 2.0;
    } else if (facts.waterDepthMeters > 0) {
      f4 = 1.0;
    } else {
      f4 = 0.5;
    }
  } else if (facts.structureIntegrity === 'submerged' || facts.structureIntegrity === 'cracking_roof') {
    f4 = 5.0;
  } else if (facts.waterCurrentSpeed === 'fast_rushing' || facts.waterCurrentSpeed === 'torrential') {
    f4 = 4.0;
  } else if (facts.incidentType === 'road_hazard') {
    f4 = 4.0;
  } else if (facts.incidentType === 'property_damage') {
    f4 = 1.0;
  }

  // Factor 5: Population Affected (w5 = 0.10)
  let f5: number | null = null;
  if (facts.peopleAffected !== null && facts.peopleAffected !== undefined) {
    if (facts.peopleAffected >= 10) {
      f5 = 5.0;
    } else if (facts.peopleAffected >= 5) {
      f5 = 4.0;
    } else if (facts.peopleAffected >= 2) {
      f5 = 2.5;
    } else if (facts.peopleAffected >= 1) {
      f5 = 1.0;
    } else {
      f5 = 0.0;
    }
  }

  return [f1, f2, f3, f4, f5];
}
