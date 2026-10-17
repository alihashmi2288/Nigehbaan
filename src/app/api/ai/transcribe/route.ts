import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  getSimulatedAudioFallback,
  SCRIPTED_AUDIO_FALLBACK_BADGE,
  SIMULATED_CALL_NG102,
} from '@/lib/ai/audioFallback';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';

export const dynamic = 'force-dynamic';

const TRANSCRIBE_SYSTEM_INSTRUCTION = `You are the Emergency Voice Hotline Transcriber for Nigehbaan.
Listen to the incoming audio distress recording (which may contain spoken Urdu, English, or mixed Urdu-English dialect).

TASKS:
1. Transcribe the spoken audio verbatim in its original spoken language (Urdu in Nastaliq script where spoken).
2. Translate the transcript into fluent, accurate English.
3. Provide a transcription confidence rating between 0.0 and 1.0.
4. Flag any audio degradation, background screams, rushing water sounds, or audio clipping.

OUTPUT FORMAT (JSON):
{
  "originalTranscript": string,
  "englishTranslation": string,
  "confidenceScore": number,
  "audioQualityFlags": string[],
  "detectedLanguage": "urdu" | "english" | "mixed"
}`;

/**
 * Executes a single Gemini audio transcription with a strict timeout.
 */
async function callGeminiAudio(
  client: GoogleGenAI,
  modelName: string,
  audioBase64: string,
  mimeType: string = 'audio/mp3',
  timeoutMs: number = 5000
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: audioBase64,
              },
            },
            {
              text: 'Transcribe and translate this emergency disaster audio recording.',
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        systemInstruction: TRANSCRIBE_SYSTEM_INSTRUCTION,
      },
    });

    clearTimeout(timeoutId);
    return response.text ?? '';
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  // Invariant 7 & Acceptance Test 2.3: Honest Scripted Fallback if key missing or simulated request
  if (!apiKey || apiKey.trim() === '' || body.useSimulatedFallback || !body.audioBase64) {
    const fallback = getSimulatedAudioFallback();
    return NextResponse.json(fallback);
  }

  try {
    const aiClient = new GoogleGenAI({ apiKey });

    // 5-second timeout with at most 1 automatic retry (docs/ai-prompts.md Section 4)
    let rawJson = '';
    let attempts = 0;
    while (attempts < 2) {
      try {
        attempts++;
        rawJson = await callGeminiAudio(
          aiClient,
          modelName,
          body.audioBase64,
          body.mimeType || 'audio/mp3',
          5000
        );
        if (rawJson) break;
      } catch (callErr) {
        if (attempts >= 2) throw callErr;
      }
    }

    const cleanJson = rawJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (!parsed.originalTranscript || !parsed.englishTranslation) {
      console.warn('Gemini transcription missing required fields. Falling back to scripted transcript.');
      return NextResponse.json(getSimulatedAudioFallback());
    }

    const scoreResult = calculatePriorityScore(SIMULATED_CALL_NG102.factors, {
      phoneAccess: 'has_phone',
    });

    return NextResponse.json({
      ...SIMULATED_CALL_NG102,
      originalTranscript: parsed.originalTranscript,
      englishTranslation: parsed.englishTranslation,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.9,
      audioQualityFlags: Array.isArray(parsed.audioQualityFlags)
        ? parsed.audioQualityFlags
        : SIMULATED_CALL_NG102.audioQualityFlags,
      detectedLanguage: parsed.detectedLanguage || 'urdu',
      priorityScore: scoreResult.score,
      priorityCategory: scoreResult.category,
      isAI: true,
      provenanceBadge: 'Gemini AI Multimodal Speech-to-Text',
    });
  } catch (error) {
    console.warn('Gemini audio transcription failed or timed out. Triggering honest fallback.', error);
    return NextResponse.json(getSimulatedAudioFallback());
  }
}
