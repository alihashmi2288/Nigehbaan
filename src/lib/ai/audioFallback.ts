import { ExtractedFacts, IncidentFactors, PriorityCategory } from '@/types';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';

export const SCRIPTED_AUDIO_FALLBACK_BADGE = 'Scripted transcript for simulated call';

export interface AudioQualityFlag {
  id: string;
  label: string;
  description: string;
}

export interface AudioTranscriptionResult {
  callId: string;
  incidentCode: string;
  sectorId: string;
  timestamp: string;
  audioDurationSeconds: number;
  originalTranscript: string;
  englishTranslation: string;
  confidenceScore: number;
  audioQualityFlags: string[];
  detectedLanguage: 'urdu' | 'english' | 'mixed';
  isAI: boolean;
  provenanceBadge: string;
  extractedFacts: ExtractedFacts;
  factors: IncidentFactors;
  priorityScore: number;
  priorityCategory: PriorityCategory;
  coordinates: [number, number];
  targetResource: string;
  targetShelter: string;
}

/**
 * Pre-verified static simulated voice distress call asset for Incident NG-102.
 * Adheres to docs/ai-prompts.md Section 3, 4.3 and docs/acceptance-tests.md Test 2.3.
 */
export const SIMULATED_CALL_NG102: AudioTranscriptionResult = {
  callId: 'CALL-NG102',
  incidentCode: 'NG-102',
  sectorId: 'sector-3a',
  timestamp: '2026-10-18T08:40:00Z',
  audioDurationSeconds: 14.5,
  originalTranscript: 'چھت پر بیٹھے ہیں پانی بڑھ رہا ہے۔ دو چھوٹے بچے ساتھ ہیں چھت سے آوازیں آ رہی ہیں۔',
  englishTranslation: 'Sitting on roof, water rising, 2 babies with us, roof is making cracking sounds.',
  confidenceScore: 0.94,
  audioQualityFlags: [
    'background_water_noise',
    'minor_audio_clipping',
    'urgent_stress',
    'structural_cracking_sounds',
  ],
  detectedLanguage: 'urdu',
  isAI: false,
  provenanceBadge: SCRIPTED_AUDIO_FALLBACK_BADGE,
  extractedFacts: {
    incidentType: 'structure_collapse',
    locationText: 'Sector 3A riverbank informal settlement, rooftop',
    sectorHint: 'sector-3a',
    latitude: 24.943,
    longitude: 67.165,
    locationStatus: 'approximate',
    peopleAffected: 3,
    waterDepthMeters: 1.8,
    waterCurrentSpeed: 'fast_rushing',
    structureIntegrity: 'cracking_roof',
    medicalUrgencyLevel: 'minor_injury',
    medicalConditionsReported: [],
    evacuationMobilityLevel: 'high_vulnerability',
    vulnerabilityDetails: ['infants', 'children'],
    phoneAccessStatus: 'has_phone',
    extractedQuotes: [
      'چھت پر بیٹھے ہیں',
      'پانی بڑھ رہا ہے',
      'دو چھوٹے بچے ساتھ ہیں',
      'چھت سے آوازیں آ رہی ہیں',
    ],
    originalLanguage: 'urdu',
    englishTranslation: 'Sitting on roof, water rising, 2 babies with us, roof is making cracking sounds.',
  },
  factors: [5.0, 2.0, 4.5, 5.0, 4.0],
  priorityScore: 81.0,
  priorityCategory: 'Critical',
  coordinates: [24.943, 67.165],
  targetResource: 'shallow_boat',
  targetShelter: 'SHL-01',
};

/**
 * Returns the verified simulated audio fallback payload with honest provenance badging.
 */
export function getSimulatedAudioFallback(): AudioTranscriptionResult {
  // Deterministically verify the score arithmetic
  const scoreResult = calculatePriorityScore(SIMULATED_CALL_NG102.factors, {
    phoneAccess: SIMULATED_CALL_NG102.extractedFacts.phoneAccessStatus,
  });

  return {
    ...SIMULATED_CALL_NG102,
    priorityScore: scoreResult.score,
    priorityCategory: scoreResult.category,
    isAI: false,
    provenanceBadge: SCRIPTED_AUDIO_FALLBACK_BADGE,
  };
}
