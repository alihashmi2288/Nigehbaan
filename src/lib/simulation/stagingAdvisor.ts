import { TimelinePhaseId, Resource, Sector } from '@/types';

export interface StagingRecommendation {
  id: string;
  phase: TimelinePhaseId;
  sectorId: string;
  targetSectorName: string;
  recommendedResourceId: string;
  recommendedResourceCallsign: string;
  stagingLocation: string;
  badgeText: string;
  actionText: string;
  rationale: string;
  details: {
    isolatedElderlyCount: number;
    unaccompaniedMinorsCount: number;
    submersionPhase: TimelinePhaseId;
    vulnerabilitySummary: string;
  };
}

/**
 * Pre-disaster community health registry baseline priors (docs/seed-data.md Section 2).
 */
export const PRE_DISASTER_REGISTRY = {
  'sector-3a': {
    sectorName: 'Sector 3A (Riverbank Settlement)',
    isolatedElderly: 22,
    unaccompaniedMinors: 47,
    informalRoofsPercent: 89,
    arterialCutPhase: 'T3' as TimelinePhaseId,
    elevationMeters: 1.8,
    recommendedResourceCallsign: 'Shallow Jet-Boat 01',
    recommendedResourceId: 'RES-01',
    stagingLocation: 'High Ground Depot Alpha',
    rationale: 'Arterial access road submerges at T+3; 22 isolated elderly registered in sector.',
  },
};

/**
 * Evaluates pre-disaster baseline priors and returns proactive staging recommendations.
 * Active exclusively during phase T-0 (Early Warning).
 */
export function getStagingRecommendations(
  timelinePhase: TimelinePhaseId,
  resources?: Resource[],
  sectors?: Sector[]
): StagingRecommendation[] {
  // Proactive staging recommendations only apply at T-0 pre-disaster baseline
  if (timelinePhase !== 'T0') {
    return [];
  }

  const sector3aData = PRE_DISASTER_REGISTRY['sector-3a'];
  const res01 = resources?.find((r) => r.id === sector3aData.recommendedResourceId);
  const resourceCallsign = res01 ? res01.callsign : sector3aData.recommendedResourceCallsign;

  return [
    {
      id: 'staging-rec-sector-3a-t0',
      phase: 'T0',
      sectorId: 'sector-3a',
      targetSectorName: sector3aData.sectorName,
      recommendedResourceId: sector3aData.recommendedResourceId,
      recommendedResourceCallsign: resourceCallsign,
      stagingLocation: sector3aData.stagingLocation,
      badgeText: 'Proactive Staging Recommended',
      actionText: `Pre-position ${resourceCallsign} at ${sector3aData.stagingLocation}`,
      rationale: sector3aData.rationale,
      details: {
        isolatedElderlyCount: sector3aData.isolatedElderly,
        unaccompaniedMinorsCount: sector3aData.unaccompaniedMinors,
        submersionPhase: sector3aData.arterialCutPhase,
        vulnerabilitySummary: `${sector3aData.isolatedElderly} isolated elderly living alone; informal mud/concrete dwellings submerge first. Single arterial bridge cut at T+3.`,
      },
    },
  ];
}

/**
 * Checks if a specific sector has an active pre-disaster staging recommendation.
 */
export function getSectorStagingRecommendation(
  sectorId: string,
  timelinePhase: TimelinePhaseId
): StagingRecommendation | null {
  if (timelinePhase !== 'T0') return null;

  const normId = sectorId.trim().toLowerCase();
  if (normId === 'sector-3a') {
    const recommendations = getStagingRecommendations('T0');
    return recommendations.length > 0 ? recommendations[0] : null;
  }
  return null;
}
