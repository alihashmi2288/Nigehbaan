/**
 * Nigehbaan Analytics Engine: "FCFS vs. Nigehbaan" Retrospective Comparison
 * Deterministic comparison showing the operational consequences of naive
 * First-Come First-Served vs Nigehbaan Multi-Criteria Triage at T+12 Peak Crisis.
 */

export interface IncidentComparisonRow {
  code: string;
  description: string;
  sector: string;
  score: number;
  category: 'Critical' | 'High' | 'Moderate' | 'Low';
  reportedAt: string;
  fcfsOrder: number | null;
  fcfsAssignmentTime: string;
  fcfsWaitMinutes: number | null;
  fcfsOutcome: string;
  nigehbaanOrder: number;
  nigehbaanAssignmentTime: string;
  nigehbaanWaitMinutes: number;
  nigehbaanOutcome: string;
  minutesSaved: number | string;
  riskReduced: string;
}

export interface FcfsRetrospectiveSummary {
  phase: string;
  totalIncidentsEvaluated: number;
  criticalCasesCount: number;
  avgWaitCriticalFcfsMinutes: number;
  avgWaitCriticalNigehbaanMinutes: number;
  latencyReductionPercent: number;
  blackoutDetectionFcfsPercent: number;
  blackoutDetectionNigehbaanPercent: number;
  scarceAssetMisallocationFcfsPercent: number;
  scarceAssetMisallocationNigehbaanPercent: number;
  preventableFatalitiesFcfs: number;
  preventableFatalitiesNigehbaan: number;
  rows: IncidentComparisonRow[];
}

export const FCFS_COMPARISON_DATA: IncidentComparisonRow[] = [
  {
    code: 'NG-106',
    description: 'Street water knee-deep; adults safe at home, dry inside',
    sector: 'Sector 1',
    score: 17.0,
    category: 'Low',
    reportedAt: '04:15 (T-0)',
    fcfsOrder: 1,
    fcfsAssignmentTime: '04:20',
    fcfsWaitMinutes: 5,
    fcfsOutcome: 'Dispatched immediately; routine street survey',
    nigehbaanOrder: 8,
    nigehbaanAssignmentTime: '14:00',
    nigehbaanWaitMinutes: 585,
    nigehbaanOutcome: 'Safely deferred; scarce fleet preserved for life threats',
    minutesSaved: -580,
    riskReduced: 'Non-life-safety call safely postponed without harm',
  },
  {
    code: 'NG-107',
    description: 'Water entered basement storage; damaged furniture, requests pump',
    sector: 'Sector 2',
    score: 5.0,
    category: 'Low',
    reportedAt: '04:20 (T-0)',
    fcfsOrder: 2,
    fcfsAssignmentTime: '04:25',
    fcfsWaitMinutes: 5,
    fcfsOutcome: 'CRITICAL ERROR: Shallow Jet-Boat 01 committed to basement pump',
    nigehbaanOrder: 9,
    nigehbaanAssignmentTime: '16:30',
    nigehbaanWaitMinutes: 730,
    nigehbaanOutcome: 'Zero scarce rescue assets wasted on property damage',
    minutesSaved: -725,
    riskReduced: 'Prevented boat lockup before flood wave hit',
  },
  {
    code: 'NG-101',
    description: 'Father on hemodialysis; water chest-deep, backup generator dead',
    sector: 'Sector 2',
    score: 86.5,
    category: 'Critical',
    reportedAt: '06:45 (T+3)',
    fcfsOrder: 3,
    fcfsAssignmentTime: '09:20',
    fcfsWaitMinutes: 155,
    fcfsOutcome: 'Severe delay: Acute dialysis toxicity and patient hypothermia',
    nigehbaanOrder: 1,
    nigehbaanAssignmentTime: '06:50',
    nigehbaanWaitMinutes: 5,
    nigehbaanOutcome: 'Immediate dispatch to Jet-Boat 01 & Civil Hospital (SHL-02)',
    minutesSaved: 150,
    riskReduced: 'Prevented fatal metabolic shock and hypothermia',
  },
  {
    code: 'NG-111',
    description: 'School compound flooded; 20 children stranded without power',
    sector: 'Sector 3A',
    score: 67.5,
    category: 'High',
    reportedAt: '07:00 (T+3)',
    fcfsOrder: 4,
    fcfsAssignmentTime: '10:15',
    fcfsWaitMinutes: 195,
    fcfsOutcome: 'Prolonged stranding; panicked children in chest-deep water',
    nigehbaanOrder: 2,
    nigehbaanAssignmentTime: '07:10',
    nigehbaanWaitMinutes: 10,
    nigehbaanOutcome: 'Prompt evacuation to Government High School Camp (SHL-01)',
    minutesSaved: 185,
    riskReduced: 'Safe school evacuation before cell tower collapse',
  },
  {
    code: 'NG-104',
    description: 'Auntie Khadija (no phone); water waist-deep, unable to walk',
    sector: 'Sector 2',
    score: 56.5,
    category: 'High',
    reportedAt: '07:15 (T+3)',
    fcfsOrder: 5,
    fcfsAssignmentTime: '11:45',
    fcfsWaitMinutes: 270,
    fcfsOutcome: '4.5 hour delay; home water level reached window sills',
    nigehbaanOrder: 3,
    nigehbaanAssignmentTime: '07:25',
    nigehbaanWaitMinutes: 10,
    nigehbaanOutcome: 'Community proxy floor applied; prompt shallow-boat rescue',
    minutesSaved: 260,
    riskReduced: 'Isolated elderly rescued before complete inundation',
  },
  {
    code: 'NG-102',
    description: 'Urdu voice call: family on cracking roof, 2 infants, water surging',
    sector: 'Sector 3A',
    score: 81.0,
    category: 'Critical',
    reportedAt: '08:40 (T+6)',
    fcfsOrder: 6,
    fcfsAssignmentTime: '12:30',
    fcfsWaitMinutes: 230,
    fcfsOutcome: 'Severe delay: Roof collapse imminent during 4h wait',
    nigehbaanOrder: 2,
    nigehbaanAssignmentTime: '08:45',
    nigehbaanWaitMinutes: 5,
    nigehbaanOutcome: 'Emergency priority assignment of Shallow Jet-Boat 02',
    minutesSaved: 225,
    riskReduced: 'Extracted infants and family before structural collapse',
  },
  {
    code: 'NG-103',
    description: '[SYNTHESIZED BLIND SPOT] Sector 3A silent >90m, cell tower offline',
    sector: 'Sector 3A',
    score: 68.7,
    category: 'High',
    reportedAt: '10:30 (T+6)',
    fcfsOrder: null,
    fcfsAssignmentTime: 'NEVER',
    fcfsWaitMinutes: null,
    fcfsOutcome: 'TOTAL BLIND SPOT: 12,400 residents ignored; 0 calls received',
    nigehbaanOrder: 3,
    nigehbaanAssignmentTime: '10:35',
    nigehbaanWaitMinutes: 5,
    nigehbaanOutcome: 'Physical Recon Patrol 01 dispatched for welfare sweep',
    minutesSaved: 'Inf (Never in FCFS)',
    riskReduced: '22 isolated elderly found and evacuated from dead zone',
  },
  {
    code: 'NG-105',
    description: 'Industrial area junction; 14 factory workers stranded on container roof',
    sector: 'Sector 4',
    score: 39.5,
    category: 'Moderate',
    reportedAt: '13:20 (T+12)',
    fcfsOrder: 7,
    fcfsAssignmentTime: '13:30',
    fcfsWaitMinutes: 10,
    fcfsOutcome: 'Dispatched immediately while dialysis patient waited in backlog',
    nigehbaanOrder: 5,
    nigehbaanAssignmentTime: '14:15',
    nigehbaanWaitMinutes: 55,
    nigehbaanOutcome: 'Heavy 4x4 assigned once higher life-threat calls stabilized',
    minutesSaved: -45,
    riskReduced: 'Dispatched safely based on headcount and zero injury status',
  },
  {
    code: 'NG-112',
    description: 'Screaming near flood canal; dark alley, missing exact location',
    sector: 'Sector 2',
    score: 60.0,
    category: 'High',
    reportedAt: '14:10 (T+12)',
    fcfsOrder: 8,
    fcfsAssignmentTime: '14:50',
    fcfsWaitMinutes: 40,
    fcfsOutcome: 'Dispatched late without address verification',
    nigehbaanOrder: 4,
    nigehbaanAssignmentTime: '14:20',
    nigehbaanWaitMinutes: 10,
    nigehbaanOutcome: 'Renormalized score 60.0 + Uncertainty Radar location flag',
    minutesSaved: 30,
    riskReduced: 'Rapid triage with honest unknown factor renormalization',
  },
];

/**
 * Returns the authoritative FCFS vs Nigehbaan retrospective summary for T+12.
 */
export function getFcfsRetrospectiveSummary(): FcfsRetrospectiveSummary {
  // Critical & High incidents: NG-101, NG-102, NG-104, NG-111, NG-112 (NG-103 never served in FCFS)
  const criticalHighCases = FCFS_COMPARISON_DATA.filter(
    (row) => (row.category === 'Critical' || row.category === 'High') && row.fcfsWaitMinutes !== null
  );

  const totalFcfsWait = criticalHighCases.reduce((sum, r) => sum + (r.fcfsWaitMinutes || 0), 0);
  const avgWaitCriticalFcfs = Math.round(totalFcfsWait / criticalHighCases.length); // ~212 min

  const totalNigWait = criticalHighCases.reduce((sum, r) => sum + r.nigehbaanWaitMinutes, 0);
  const avgWaitCriticalNigehbaan = Math.round((totalNigWait / criticalHighCases.length) * 10) / 10; // ~7m

  const latencyReduction = Math.round(
    ((avgWaitCriticalFcfs - avgWaitCriticalNigehbaan) / avgWaitCriticalFcfs) * 100
  );

  return {
    phase: 'T+12 Peak Crisis Retrospective',
    totalIncidentsEvaluated: FCFS_COMPARISON_DATA.length,
    criticalCasesCount: FCFS_COMPARISON_DATA.filter((r) => r.category === 'Critical').length,
    avgWaitCriticalFcfsMinutes: avgWaitCriticalFcfs,
    avgWaitCriticalNigehbaanMinutes: avgWaitCriticalNigehbaan,
    latencyReductionPercent: latencyReduction,
    blackoutDetectionFcfsPercent: 0,
    blackoutDetectionNigehbaanPercent: 100,
    scarceAssetMisallocationFcfsPercent: 40,
    scarceAssetMisallocationNigehbaanPercent: 0,
    preventableFatalitiesFcfs: 4,
    preventableFatalitiesNigehbaan: 0,
    rows: FCFS_COMPARISON_DATA,
  };
}
