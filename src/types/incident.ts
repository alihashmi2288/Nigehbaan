import { z } from 'zod';

export type PriorityCategory = 'Critical' | 'High' | 'Moderate' | 'Low';

export const PriorityCategoryEnum = z.enum(['Critical', 'High', 'Moderate', 'Low']);

export type UncertaintyFlag =
  | 'MISSING_LOCATION'
  | 'STALE_REPORT'
  | 'CONFLICTING_REPORT'
  | 'POTENTIAL_DUPLICATE'
  | 'COVERAGE_BLIND_SPOT'
  | 'NO_PHONE_COMMUNITY_PROXY'
  | 'MISSING_FACTORS';

export const UncertaintyFlagEnum = z.enum([
  'MISSING_LOCATION',
  'STALE_REPORT',
  'CONFLICTING_REPORT',
  'POTENTIAL_DUPLICATE',
  'COVERAGE_BLIND_SPOT',
  'NO_PHONE_COMMUNITY_PROXY',
  'MISSING_FACTORS',
]);

export type ReporterType = 'citizen' | 'voice_hotline' | 'system_blind_spot' | 'community_proxy';

export const ReporterTypeEnum = z.enum([
  'citizen',
  'voice_hotline',
  'system_blind_spot',
  'community_proxy',
]);

export type PhoneAccessStatus = 'has_phone' | 'no_phone' | 'network_down' | 'unknown';

export const PhoneAccessStatusEnum = z.enum([
  'has_phone',
  'no_phone',
  'network_down',
  'unknown',
]);

export type IncidentStatus = 'triaged' | 'assigned' | 'in_progress' | 'resolved';

export const IncidentStatusEnum = z.enum(['triaged', 'assigned', 'in_progress', 'resolved']);

export type TimelinePhaseId = 'T0' | 'T3' | 'T6' | 'T12';

export const TimelinePhaseIdEnum = z.enum(['T0', 'T3', 'T6', 'T12']);

export type IncidentFactors = [
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
];

export const IncidentFactorsSchema = z.tuple([
  z.number().min(0).max(5).nullable(),
  z.number().min(0).max(5).nullable(),
  z.number().min(0).max(5).nullable(),
  z.number().min(0).max(5).nullable(),
  z.number().min(0).max(5).nullable(),
]);

/**
 * Authoritative Fact Extraction Schema as mandated by docs/ai-prompts.md.
 * Used for structured output validation from Gemini and heuristic fallback parsers.
 */
export const ExtractedFactsSchema = z.object({
  // Incident Classification
  incidentType: z.enum([
    'flood_rescue',
    'medical_emergency',
    'structure_collapse',
    'road_hazard',
    'welfare_check',
    'property_damage',
    'other',
  ]),

  // Location Extraction
  locationText: z.string().nullable(),
  sectorHint: z.enum(['sector-1', 'sector-2', 'sector-3a', 'sector-4']).nullable(),
  latitude: z.number().min(-90).max(90).nullable(), // Must be null unless explicit coordinates provided
  longitude: z.number().min(-180).max(180).nullable(), // Must be null unless explicit coordinates provided
  locationStatus: z.enum(['confirmed', 'approximate', 'missing']),

  // Headcount (Clamped 1 to 500)
  peopleAffected: z.number().int().min(1).max(500).nullable(),

  // Life Threat & Environmental Danger (Depth Clamped 0.0 to 10.0m)
  waterDepthMeters: z.number().min(0.0).max(10.0).nullable(),
  waterCurrentSpeed: z.enum(['standing', 'slow', 'fast_rushing', 'torrential']).nullable(),
  structureIntegrity: z
    .enum(['stable', 'flooded_ground', 'cracking_roof', 'submerged', 'collapsed'])
    .nullable(),

  // Medical & Vulnerability Facts
  medicalUrgencyLevel: z
    .enum([
      'none',
      'minor_injury',
      'chronic_managed',
      'urgent_medical',
      'time_critical_dependency',
    ])
    .nullable(),
  medicalConditionsReported: z.array(z.string()),

  evacuationMobilityLevel: z
    .enum([
      'independent_adults',
      'minor_impairment',
      'vulnerable_group',
      'high_vulnerability',
      'completely_immobile',
    ])
    .nullable(),
  vulnerabilityDetails: z.array(z.string()),

  // Communication & Provenance
  phoneAccessStatus: PhoneAccessStatusEnum,
  extractedQuotes: z.array(z.string()),
  originalLanguage: z.enum(['english', 'urdu', 'roman_urdu']),
  englishTranslation: z.string().nullable(),
});

export type ExtractedFacts = z.infer<typeof ExtractedFactsSchema>;

export interface ExtractionResult {
  success: boolean;
  facts: ExtractedFacts;
  factors: IncidentFactors;
  isAI: boolean;
  provenanceBadge: string;
  error?: string;
}

/**
 * Core Incident interface strictly matching seed.json and runtime store state.
 */
export interface Incident {
  id: string;
  code: string;
  sectorId: string;
  reporterType: ReporterType;
  phoneAccess: PhoneAccessStatus;
  timestamp: string;
  phaseArrival: TimelinePhaseId;
  reportText: string;
  reportTranslation?: string | null;
  factors: IncidentFactors;
  expectedScore?: number;
  score?: number;
  confidence?: number;
  category: PriorityCategory;
  label?: string;
  uncertaintyFlags: UncertaintyFlag[];
  coordinates: [number, number] | null;
  targetResource?: string;
  targetShelter?: string;
  assignedResourceId?: string | null;
  status?: IncidentStatus;
  provenanceBadge?: string;
  isAI?: boolean;
  extractedFacts?: ExtractedFacts;
}

export const IncidentSchema = z.object({
  id: z.string(),
  code: z.string(),
  sectorId: z.string(),
  reporterType: ReporterTypeEnum,
  phoneAccess: PhoneAccessStatusEnum,
  timestamp: z.string(),
  phaseArrival: TimelinePhaseIdEnum,
  reportText: z.string(),
  reportTranslation: z.string().nullable().optional(),
  factors: IncidentFactorsSchema,
  expectedScore: z.number().optional(),
  score: z.number().optional(),
  confidence: z.number().min(0).max(1).optional(),
  category: PriorityCategoryEnum,
  label: z.string().optional(),
  uncertaintyFlags: z.array(UncertaintyFlagEnum),
  coordinates: z.tuple([z.number(), z.number()]).nullable(),
  targetResource: z.string().optional(),
  targetShelter: z.string().optional(),
  assignedResourceId: z.string().nullable().optional(),
  status: IncidentStatusEnum.optional(),
  provenanceBadge: z.string().optional(),
  isAI: z.boolean().optional(),
  extractedFacts: ExtractedFactsSchema.optional(),
});

