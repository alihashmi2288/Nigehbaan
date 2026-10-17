import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/store';
import {
  SIMULATED_CALL_NG102,
  SCRIPTED_AUDIO_FALLBACK_BADGE,
  getSimulatedAudioFallback,
} from '@/lib/ai/audioFallback';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';
import { POST as transcribeRoute } from '@/app/api/ai/transcribe/route';
import { NextRequest } from 'next/server';

describe('Milestone 11: Bilingual Voice Distress Hotline (Tier 2)', () => {
  beforeEach(() => {
    useAppStore.getState().resetSimulation();
  });

  // --------------------------------------------------------------------------
  // Task T11.1 & T11.2: Fallback Data & Deterministic Scoring Verification
  // --------------------------------------------------------------------------
  describe('Simulated Audio Fallback Specification', () => {
    it('provides valid static transcript for NG-102 with honest provenance badge and audio quality flags', () => {
      const fallback = getSimulatedAudioFallback();

      expect(fallback.callId).toBe('CALL-NG102');
      expect(fallback.incidentCode).toBe('NG-102');
      expect(fallback.sectorId).toBe('sector-3a');
      expect(fallback.audioDurationSeconds).toBe(14.5);
      expect(fallback.detectedLanguage).toBe('urdu');
      expect(fallback.confidenceScore).toBe(0.94);

      // Verifies original Urdu text and directionality requirements
      expect(fallback.originalTranscript).toBe(
        'چھت پر بیٹھے ہیں پانی بڑھ رہا ہے۔ دو چھوٹے بچے ساتھ ہیں چھت سے آوازیں آ رہی ہیں۔'
      );
      expect(fallback.englishTranslation).toBe(
        'Sitting on roof, water rising, 2 babies with us, roof is making cracking sounds.'
      );

      // Audio Quality Flags
      expect(fallback.audioQualityFlags).toContain('background_water_noise');
      expect(fallback.audioQualityFlags).toContain('urgent_stress');

      // Honest Provenance Badge (Invariant 7)
      expect(fallback.provenanceBadge).toBe(SCRIPTED_AUDIO_FALLBACK_BADGE);
      expect(fallback.provenanceBadge).toBe('Scripted transcript for simulated call');
      expect(fallback.isAI).toBe(false);
    });

    it('calculates deterministic priority score 81.0 (Critical) for NG-102 factors', () => {
      // Factors for NG-102: Life Threat 5.0, Medical 2.0, Evacuation Inability 4.5, Environmental 5.0, Population 4.0
      const factors: [number, number, number, number, number] = [5.0, 2.0, 4.5, 5.0, 4.0];
      const result = calculatePriorityScore(factors, { phoneAccess: 'has_phone' });

      // Verification:
      // 5.0*0.30 (1.5) + 2.0*0.25 (0.5) + 4.5*0.20 (0.9) + 5.0*0.15 (0.75) + 4.0*0.10 (0.4) = 4.05 / 5.0 * 100 = 81.0
      expect(result.score).toBe(81.0);
      expect(result.category).toBe('Critical');
      expect(result.unknownFactorCount).toBe(0);
      expect(result.confidence).toBe(1.0);
    });
  });

  // --------------------------------------------------------------------------
  // Task T11.2: Speech-to-Text API Route (/api/ai/transcribe)
  // --------------------------------------------------------------------------
  describe('STT Proxy Route (/api/ai/transcribe)', () => {
    it('returns honest static fallback when GEMINI_API_KEY is omitted or simulation flag is active', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      try {
        const req = new NextRequest('http://localhost:3000/api/ai/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ useSimulatedFallback: true }),
        });

        const res = await transcribeRoute(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.incidentCode).toBe('NG-102');
        expect(data.isAI).toBe(false);
        expect(data.provenanceBadge).toBe('Scripted transcript for simulated call');
        expect(data.originalTranscript).toContain('چھت پر بیٹھے ہیں');
        expect(data.englishTranslation).toContain('Sitting on roof');
        expect(data.priorityScore).toBe(81.0);
        expect(data.priorityCategory).toBe('Critical');
      } finally {
        if (originalKey) {
          process.env.GEMINI_API_KEY = originalKey;
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // Acceptance Test 2.3: Bilingual Voice Distress Hotline Player
  // --------------------------------------------------------------------------
  describe('Acceptance Test 2.3: Bilingual Voice Distress Hotline Player', () => {
    it('ingests voice hotline call, activates NG-102 with Score 81.0 (Critical), Urdu RTL transcript, and honest provenance badge', () => {
      const store = useAppStore.getState();

      // Given: Evaluator navigates to the voice distress simulator
      expect(store.timelinePhase).toBe('T0');

      // When: Evaluator plays / ingests the distress call
      const fallback = getSimulatedAudioFallback();
      const ingestedIncident = store.ingestVoiceIncident(fallback);

      // Then:
      // 1. Incident NG-102 is active and selected in the store
      const updatedStore = useAppStore.getState();
      expect(updatedStore.selectedIncidentId).toBe(ingestedIncident.id);

      const ng102 = updatedStore.incidents.find((i) => i.code === 'NG-102');
      expect(ng102).toBeDefined();
      if (!ng102) return;

      // 2. Extracted facts generate Incident NG-102 (Score 81.0, Critical)
      expect(ng102.score).toBe(81.0);
      expect(ng102.category).toBe('Critical');
      expect(ng102.sectorId).toBe('sector-3a');
      expect(ng102.targetResource).toBe('shallow_boat');
      expect(ng102.targetShelter).toBe('SHL-01');

      // 3. Provenance tag displays "Scripted transcript for simulated call"
      expect(ng102.provenanceBadge).toBe('Scripted transcript for simulated call');
      expect(ng102.isAI).toBe(false);

      // 4. Transcript displays spoken Urdu phrase and English translation
      expect(ng102.reportText).toBe(
        'چھت پر بیٹھے ہیں پانی بڑھ رہا ہے۔ دو چھوٹے بچے ساتھ ہیں چھت سے آوازیں آ رہی ہیں۔'
      );
      expect(ng102.reportTranslation).toBe(
        'Sitting on roof, water rising, 2 babies with us, roof is making cracking sounds.'
      );

      // 5. Activity log records ingestion
      expect(updatedStore.activityLogs.length).toBeGreaterThan(0);
      const latestLog = updatedStore.activityLogs[0];
      expect(latestLog.action).toBe('INCIDENT_SUBMITTED');
      expect(latestLog.details).toContain('Voice distress call ingested -> NG-102');
      expect(latestLog.details).toContain('81.0');
      expect(latestLog.details).toContain('Critical');
    });
  });
});
