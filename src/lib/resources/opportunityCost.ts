import { Incident, Resource, ResourceType } from '@/types';

export interface OpportunityCostResult {
  hasScarcity: boolean;
  remainingCount: number;
  assetType: ResourceType;
  sectorId: string;
  delayMinutes: number;
  warningLabel: string;
  consequenceText: string;
  turnaroundText: string;
  affectedIncident: Incident | null;
  fullWarningText: string;
}

/**
 * Normalizes sector identifier to human-readable format.
 * e.g., 'sector-2' -> 'Sector 2', 'sector-3a' -> 'Sector 3A'
 */
export function formatSectorDisplay(sectorId: string): string {
  if (!sectorId) return 'Sector';
  const cleaned = sectorId.toLowerCase().replace('sector-', '');
  if (cleaned === '3a') return 'Sector 3A';
  return `Sector ${cleaned.toUpperCase()}`;
}

/**
 * Returns descriptive noun for resource type in scarcity warnings.
 */
export function getAssetTypeDescriptor(type: ResourceType): string {
  switch (type) {
    case 'shallow_boat':
      return 'shallow-draft';
    case 'heavy_4x4':
      return 'heavy-rescue';
    case 'mobile_medical':
      return 'mobile-medical';
    case 'recon_patrol':
      return 'recon-patrol';
    default:
      return type;
  }
}

/**
 * Deterministic Opportunity Cost Calculator
 * Enforces Invariant 4: Scarcity and turnaround queue delay (+35 min) computed strictly
 * by deterministic arithmetic. Never guessed by an LLM.
 *
 * Shallow jet-boats are launched from fixed ramp sites and cannot provide
 * cross-sector reinforcement within a single cycle (docs/seed-data.md Section 6.6, 8).
 *
 * @param asset The candidate resource being considered for assignment
 * @param incident The incident requiring dispatch
 * @param availableResources All currently available resources in the system
 * @param queue All visible incidents in the queue (or all incidents)
 */
export function calculateOpportunityCost(
  asset: Resource,
  incident: Incident,
  availableResources: Resource[],
  queue: Incident[]
): OpportunityCostResult {
  const targetSector = incident.sectorId;
  const sectorLabel = formatSectorDisplay(targetSector);
  const typeDescriptor = getAssetTypeDescriptor(asset.type);

  // Count remaining available assets of the SAME type stationed in the SAME sector,
  // explicitly excluding the candidate asset being dispatched.
  const remainingInSector = availableResources.filter(
    (r) =>
      r.id !== asset.id &&
      r.stationSector.toLowerCase() === targetSector.toLowerCase() &&
      r.type === asset.type &&
      r.status === 'available'
  );

  const remainingCount = remainingInSector.length;
  const hasScarcity = remainingCount === 0;

  if (hasScarcity) {
    const delayMinutes = asset.turnaroundMinutes || 35;
    const warningLabel = `0 ${typeDescriptor} assets left in sector`;
    const consequenceText = `Leaves 0 ${typeDescriptor} assets available in ${sectorLabel}`;

    // Phase order lookup for timeline awareness
    const phaseOrder: Record<string, number> = { T0: 0, T3: 1, T6: 2, T12: 3 };
    const incidentPhaseRank = incident.phaseArrival ? (phaseOrder[incident.phaseArrival] ?? 3) : 3;

    // Find the next queued incident in this sector that requires this resource type
    const queuedInSector = queue
      .filter((i) => {
        if (i.id === incident.id) return false;
        if (i.sectorId.toLowerCase() !== targetSector.toLowerCase()) return false;
        if (i.status === 'assigned' || i.status === 'resolved') return false;

        // If the incident under review arrived at a specific timeline phase,
        // do not consider incidents from future timeline phases that have not arrived yet.
        if (incident.phaseArrival && i.phaseArrival) {
          const iPhaseRank = phaseOrder[i.phaseArrival] ?? 0;
          if (iPhaseRank > incidentPhaseRank) return false;
        }

        return (
          i.targetResource === asset.type ||
          (!i.targetResource && asset.type === 'shallow_boat')
        );
      })
      .sort((a, b) => {
        // Order by priority score descending
        const scoreA = a.score ?? a.expectedScore ?? 0;
        const scoreB = b.score ?? b.expectedScore ?? 0;
        if (Math.abs(scoreB - scoreA) > 0.1) {
          return scoreB - scoreA;
        }
        // If tied or close, sort by earlier timestamp (FIFO)
        return (a.timestamp || '').localeCompare(b.timestamp || '');
      });

    const affectedIncident = queuedInSector.length > 0 ? queuedInSector[0] : null;

    let turnaroundText = '';
    let fullWarningText = '';

    if (affectedIncident) {
      const scoreDisplay = (affectedIncident.score ?? affectedIncident.expectedScore ?? 0).toFixed(1);
      turnaroundText = `Incident ${affectedIncident.code} will incur an estimated +${delayMinutes} min delay`;
      fullWarningText = `Committing ${asset.callsign} to ${incident.code} leaves 0 ${typeDescriptor} assets available in ${sectorLabel}. Queued Incident ${affectedIncident.code} [Score ${scoreDisplay} — ${affectedIncident.category}] will incur an estimated +${delayMinutes} min delay.`;
    } else {
      turnaroundText = `Any subsequent incident in ${sectorLabel} will incur an estimated +${delayMinutes} min turnaround delay`;
      fullWarningText = `Committing ${asset.callsign} to ${incident.code} leaves 0 ${typeDescriptor} assets available in ${sectorLabel}.`;
    }

    return {
      hasScarcity: true,
      remainingCount: 0,
      assetType: asset.type,
      sectorId: targetSector,
      delayMinutes,
      warningLabel,
      consequenceText,
      turnaroundText,
      affectedIncident,
      fullWarningText,
    };
  }

  return {
    hasScarcity: false,
    remainingCount,
    assetType: asset.type,
    sectorId: targetSector,
    delayMinutes: 0,
    warningLabel: `No scarcity — ${remainingCount} asset(s) remain`,
    consequenceText: `${remainingCount} ${typeDescriptor} asset(s) remain available in ${sectorLabel}`,
    turnaroundText: 'Immediate response available for subsequent requests',
    affectedIncident: null,
    fullWarningText: `Dispatching ${asset.callsign} to ${incident.code}. ${remainingCount} other ${typeDescriptor} assets remain available in ${sectorLabel}.`,
  };
}
