import { Sector, Incident, TimelinePhaseId } from '@/types';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';

export interface SectorHealthCheck {
  sectorId: string;
  sectorName: string;
  isTowerOffline: boolean;
  offlineSince: string | null;
  lastReportTimestamp: string | null;
  minutesSilent: number;
  isSilenceBreached: boolean;
  floodLevelMeters: number;
  hazardThresholdMeters: number;
  isHazardBreached: boolean;
  isFloodTrendRising: boolean;
  isBlindSpotActive: boolean;
  failureReasons: string[];
}

/**
 * Minimum minutes of complete communication silence required to trigger a blind spot.
 */
export const BLIND_SPOT_SILENCE_THRESHOLD_MINUTES = 90;

/**
 * Enforced minimum priority score for synthesized blind spots per Invariant 3.
 */
export const BLIND_SPOT_MINIMUM_SCORE = 60.0;

/**
 * Evaluates the 4 deterministic health conditions for an individual sector.
 * Rule from docs/seed-data.md Section 6.3:
 * 1. Sector cell tower is offline.
 * 2. Silence duration: simulationClock - last_report_timestamp >= 90 minutes.
 * 3. Sector flood gauge trend is 'rising'.
 * 4. Sector flood gauge level >= hazardThresholdMeters.
 */
export function evaluateSectorHealth(
  sector: Sector,
  simulationClock: string | Date,
  incidentsInSector: Incident[]
): SectorHealthCheck {
  const clockTime =
    typeof simulationClock === 'string'
      ? new Date(simulationClock).getTime()
      : simulationClock.getTime();

  const failureReasons: string[] = [];

  // Condition 1: Tower offline
  // If tower has offlineSince, check whether simulationClock has passed offlineSince
  let isTowerOffline = sector.cellTower.status === 'offline';
  if (sector.cellTower.offlineSince) {
    const offlineTime = new Date(sector.cellTower.offlineSince).getTime();
    if (!isNaN(offlineTime) && clockTime < offlineTime) {
      isTowerOffline = false;
    }
  }

  if (!isTowerOffline) {
    failureReasons.push(`Cell tower ${sector.cellTower.id} is online`);
  }

  // Condition 2: Silence duration >= 90 minutes
  // Find most recent incident in sector received at or before simulationClock
  const priorIncidents = incidentsInSector.filter((inc) => {
    const incTime = new Date(inc.timestamp).getTime();
    return !isNaN(incTime) && incTime <= clockTime && inc.reporterType !== 'system_blind_spot';
  });

  priorIncidents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const latestReport = priorIncidents[0] ?? null;

  let minutesSilent = 0;
  let isSilenceBreached = false;

  if (latestReport) {
    const lastReportTime = new Date(latestReport.timestamp).getTime();
    minutesSilent = Math.max(0, Math.floor((clockTime - lastReportTime) / (1000 * 60)));
    isSilenceBreached = minutesSilent >= BLIND_SPOT_SILENCE_THRESHOLD_MINUTES;
    if (!isSilenceBreached) {
      failureReasons.push(`Silence duration is ${minutesSilent}m (< 90m threshold)`);
    }
  } else {
    // If no reports have ever been received, silence is infinite
    minutesSilent = 999;
    isSilenceBreached = true;
  }

  // Condition 3: Flood gauge trend is 'rising'
  const isFloodTrendRising = sector.floodGauge.trend === 'rising';
  if (!isFloodTrendRising) {
    failureReasons.push(`Flood gauge trend is ${sector.floodGauge.trend} (must be 'rising')`);
  }

  // Condition 4: Flood gauge level >= hazard threshold
  const isHazardBreached = sector.floodGauge.levelMeters >= sector.floodGauge.hazardThresholdMeters;
  if (!isHazardBreached) {
    failureReasons.push(
      `Gauge level ${sector.floodGauge.levelMeters}m below threshold ${sector.floodGauge.hazardThresholdMeters}m`
    );
  }

  // ALL 4 conditions must hold simultaneously
  const isBlindSpotActive =
    isTowerOffline && isSilenceBreached && isFloodTrendRising && isHazardBreached;

  return {
    sectorId: sector.id,
    sectorName: sector.name,
    isTowerOffline,
    offlineSince: sector.cellTower.offlineSince,
    lastReportTimestamp: latestReport?.timestamp ?? null,
    minutesSilent,
    isSilenceBreached,
    floodLevelMeters: sector.floodGauge.levelMeters,
    hazardThresholdMeters: sector.floodGauge.hazardThresholdMeters,
    isHazardBreached,
    isFloodTrendRising,
    isBlindSpotActive,
    failureReasons,
  };
}

/**
 * Synthesizes a deterministic blind spot incident (e.g. NG-103) for a silent sector.
 * Follows Invariant 1, 2, and 3:
 * - Evacuation Inability = 4.0, Environmental Danger = 4.5
 * - Calculated deterministically (68.7 >= 60.0 floor)
 * - Category: High (Never auto-Critical per Invariant 3)
 * - Label: "Physical Welfare Recon / Field Sweep"
 */
export function synthesizeBlindSpotIncident(
  sector: Sector,
  simulationClock: string | Date
): Incident {
  const clockIso =
    typeof simulationClock === 'string' ? simulationClock : simulationClock.toISOString();

  // Deterministic factor vector for Sector 3A blind spot:
  // [LifeThreat 2.5, Medical null, Evacuation 4.0, Environmental 4.5, Population 3.5]
  const factors: [number | null, number | null, number | null, number | null, number | null] = [
    2.5,
    null,
    4.0,
    4.5,
    3.5,
  ];

  const scoring = calculatePriorityScore(factors, {
    reporterType: 'system_blind_spot',
    phoneAccess: 'network_down',
  });

  // Verify floor enforcement: score >= 60.0
  const finalScore = Math.max(scoring.score, BLIND_SPOT_MINIMUM_SCORE);

  return {
    id: 'inc-103',
    code: 'NG-103',
    sectorId: sector.id,
    reporterType: 'system_blind_spot',
    phoneAccess: 'network_down',
    timestamp: clockIso,
    phaseArrival: 'T6',
    reportText: `[SYNTHESIZED BLIND SPOT] ${sector.name} silent >90m. Cell tower offline. Flood gauge ${sector.floodGauge.levelMeters}m. Requires immediate welfare check.`,
    factors,
    expectedScore: 68.7,
    score: finalScore,
    confidence: scoring.confidence,
    category: 'High', // Never auto-critical per Invariant 3
    label: 'Physical Welfare Recon / Field Sweep',
    uncertaintyFlags: ['COVERAGE_BLIND_SPOT'],
    coordinates: [24.9400, 67.1600],
    targetResource: 'recon_patrol',
    targetShelter: 'SHL-01',
    assignedResourceId: null,
    status: 'triaged',
    provenanceBadge: 'Deterministic Synthesizer',
  };
}

/**
 * Evaluates all operational sectors and synthesizes incidents for active blind spots.
 */
export function detectAndSynthesizeBlindSpots(
  sectors: Sector[],
  simulationClock: string | Date,
  incidents: Incident[]
): {
  healthChecks: SectorHealthCheck[];
  synthesizedIncidents: Incident[];
} {
  const healthChecks: SectorHealthCheck[] = [];
  const synthesizedIncidents: Incident[] = [];

  for (const sector of sectors) {
    const sectorIncidents = incidents.filter((i) => i.sectorId === sector.id);
    const health = evaluateSectorHealth(sector, simulationClock, sectorIncidents);
    healthChecks.push(health);

    if (health.isBlindSpotActive) {
      // Check if synthetic incident already exists
      const existing = incidents.find(
        (i) => i.sectorId === sector.id && i.reporterType === 'system_blind_spot'
      );
      if (!existing) {
        synthesizedIncidents.push(synthesizeBlindSpotIncident(sector, simulationClock));
      }
    }
  }

  return { healthChecks, synthesizedIncidents };
}
