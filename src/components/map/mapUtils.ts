import { PriorityCategory, Sector, TimelinePhaseId, Incident, Resource, Shelter } from '@/types';

/**
 * Tactical center of District Alpha (Malir / Indus flood basin near Karachi)
 */
export const DISTRICT_ALPHA_CENTER: [number, number] = [24.935, 67.145];
export const DISTRICT_ALPHA_ZOOM = 12;

/**
 * CartoDB Dark Matter tile layer URL and attribution.
 * Uses the CARTO Basemaps API key from NEXT_PUBLIC_CARTO_API_KEY with the 'key' query parameter
 * to eliminate the 'API KEY REQUIRED' watermark completely.
 */
export const CARTO_DARK_MATTER_URL =
  process.env.NEXT_PUBLIC_CARTO_API_KEY
    ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${process.env.NEXT_PUBLIC_CARTO_API_KEY}`
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';


/**
 * Deterministic GIS station coordinates for resources stationed in sectors.
 * Anchored to key operational terrain features within each sector polygon.
 */
export const RESOURCE_STATION_COORDINATES: Record<string, [number, number]> = {
  'RES-01': [24.922, 67.138], // Gadap Canal Boat Ramp (Sector 2)
  'RES-02': [24.948, 67.158], // Riverbank Informal Boat Launch (Sector 3A)
  'RES-03': [24.904, 67.118], // Central High Ground Staging Base (Sector 1)
  'RES-04': [24.972, 67.188], // Highway Arterial Relief Depot (Sector 4)
  'RES-05': [24.908, 67.125], // District Civil Hospital Mobile Staging (Sector 1)
  'RES-06': [24.898, 67.122], // Urban Recon Reconnaissance Base (Sector 1)
};

/**
 * Deterministic coordinates for shelter facilities located in operational sectors.
 */
export const SHELTER_COORDINATES: Record<string, [number, number]> = {
  'SHL-01': [24.902, 67.128], // Government High School Camp (Sector 1)
  'SHL-02': [24.907, 67.132], // District Civil Hospital Annexe (Sector 1)
  'SHL-03': [24.965, 67.178], // Highway Warehouse Relief Depot (Sector 4)
};

const PHASE_ORDER: Record<TimelinePhaseId, number> = {
  T0: 0,
  T3: 1,
  T6: 2,
  T12: 3,
};

/**
 * Resolves whether a given sector is currently an active communication & coverage blind spot.
 * Rule: At T6 and T12, Tower-Alpha-3 collapses (08:55) and Sector 3A enters coverage blackout.
 * Prior to T6 (at T0 and T3), all towers are operational and blind spots are inactive.
 */
export function isSectorBlindSpot(
  sector: Sector,
  currentPhase: TimelinePhaseId,
  incidents: Incident[] = []
): boolean {
  // Prior to T6 (08:55 tower collapse), towers are operational
  if (PHASE_ORDER[currentPhase] < PHASE_ORDER['T6']) {
    return false;
  }

  // Sector 3A specifically collapses at 08:55 (active at T6 and T12)
  if (sector.id === 'sector-3a') {
    return true;
  }

  // Check if sector tower is offline and contains active visible blind spot incidents
  if (sector.cellTower.status !== 'offline') {
    return false;
  }

  const hasBlindSpotIncident = incidents.some(
    (inc) =>
      inc.sectorId === sector.id &&
      PHASE_ORDER[inc.phaseArrival] <= PHASE_ORDER[currentPhase] &&
      (inc.uncertaintyFlags.includes('COVERAGE_BLIND_SPOT') ||
        inc.reporterType === 'system_blind_spot')
  );

  return hasBlindSpotIncident;
}

/**
 * Returns dynamic SVG/Leaflet style properties for a sector polygon.
 */
export interface SectorPolygonStyle {
  color: string;
  weight: number;
  opacity: number;
  fillColor: string;
  fillOpacity: number;
  dashArray?: string;
  className?: string;
}

export function getSectorPolygonStyle(
  sector: Sector,
  currentPhase: TimelinePhaseId,
  incidents: Incident[] = []
): SectorPolygonStyle {
  const isBlindSpot = isSectorBlindSpot(sector, currentPhase, incidents);

  if (isBlindSpot) {
    return {
      color: '#DB6D28', // --semantic-blind-spot
      weight: 2.5,
      opacity: 0.95,
      fillColor: '#DB6D28',
      fillOpacity: 0.22,
      dashArray: '6, 6',
      className: 'sector-polygon-blind-spot',
    };
  }

  return {
    color: '#23252a', // --hairline
    weight: 1.5,
    opacity: 0.75,
    fillColor: '#0f1011', // --surface-1
    fillOpacity: 0.35,
    className: 'sector-polygon-normal',
  };
}

/**
 * Resolves DESIGN.md semantic token colors and borders for priority categories.
 */
export function getPrioritySemanticColors(category: PriorityCategory): {
  solid: string;
  text: string;
  bg: string;
  border: string;
} {
  switch (category) {
    case 'Critical':
      return {
        solid: '#B42318',
        text: '#FDA29B',
        bg: 'rgba(180, 35, 24, 0.18)',
        border: '#F04438',
      };
    case 'High':
      return {
        solid: '#92400E',
        text: '#FDB022',
        bg: 'rgba(146, 64, 14, 0.18)',
        border: '#D97706',
      };
    case 'Moderate':
      return {
        solid: '#475569',
        text: '#CBD5E1',
        bg: 'rgba(71, 85, 105, 0.20)',
        border: '#64748B',
      };
    case 'Low':
    default:
      return {
        solid: '#27a644',
        text: '#75E0A7',
        bg: 'rgba(39, 166, 68, 0.15)',
        border: '#12B76A',
      };
  }
}

/**
 * Evaluates shelter capacity state and alert severity.
 */
export function getShelterOccupancy(shelter: Shelter): {
  percentage: number;
  isOvercrowded: boolean;
  isGeneratorFailed: boolean;
  statusBadgeColor: string;
  statusText: string;
} {
  const percentage = Math.round((shelter.capacityCurrent / shelter.capacityTotal) * 100);
  const isOvercrowded = percentage >= 95;
  const isGeneratorFailed = !shelter.backupGenerator;

  let statusBadgeColor = '#27a644'; // Success green (<80%)
  let statusText = `${percentage}% Cap`;

  if (isOvercrowded || isGeneratorFailed) {
    statusBadgeColor = '#B42318'; // Critical red
    statusText = isGeneratorFailed && isOvercrowded ? 'CRITICAL (97% + NO GEN)' : `${percentage}% CRITICAL`;
  } else if (percentage >= 80) {
    statusBadgeColor = '#92400E'; // Warning amber
    statusText = `${percentage}% Near Capacity`;
  }

  return {
    percentage,
    isOvercrowded,
    isGeneratorFailed,
    statusBadgeColor,
    statusText,
  };
}

/**
 * Filter incidents into mapped (valid coordinates) and unmapped (null coordinates).
 */
export function partitionIncidentsByCoordinates(incidents: Incident[]): {
  mapped: (Incident & { coordinates: [number, number] })[];
  unmapped: Incident[];
} {
  const mapped: (Incident & { coordinates: [number, number] })[] = [];
  const unmapped: Incident[] = [];

  for (const inc of incidents) {
    if (
      inc.coordinates &&
      Array.isArray(inc.coordinates) &&
      inc.coordinates.length === 2 &&
      typeof inc.coordinates[0] === 'number' &&
      typeof inc.coordinates[1] === 'number'
    ) {
      mapped.push(inc as Incident & { coordinates: [number, number] });
    } else {
      unmapped.push(inc);
    }
  }

  return { mapped, unmapped };
}
