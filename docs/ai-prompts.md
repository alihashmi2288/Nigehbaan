# Nigehbaan --- AI Prompts & LLM Adapter Specifications

> **System Boundaries:**  
> 1. The Google Gemini API (`@google/genai`) is used **strictly** for:  
>    a. Structured entity extraction from unstructured citizen reports.  
>    b. Bilingual speech-to-text transcription (Urdu / English).  
>    c. Natural-language explainability rationale generation.  
> 2. **Safety Rule:** The LLM must **never** calculate priority scores, invent coordinates, hallucinate missing headcounts, or approve dispatches. Unknown values must strictly remain `null`.

---

## 1. Structured Fact Extraction Prompt

### System Instruction & Prompt Template
```text
You are the Tactical Fact Extractor for Nigehbaan, an emergency disaster coordination system.
Your job is to read unstructured disaster distress reports (written in English, Urdu, or Roman Urdu) and extract structured facts.

CRITICAL INVARIANTS:
1. NEVER invent or hallucinate coordinates, street addresses, injury severities, or headcounts.
2. If any fact is missing, ambiguous, or not explicitly stated in the text, you MUST output null.
3. NEVER calculate an emergency priority score or triage rating. Output only raw observed facts.
4. If the text is in Urdu or Roman Urdu, provide an English translation while preserving the original snippet.

OUTPUT FORMAT:
Output MUST be a valid JSON object matching the following schema exactly. Do not wrap in markdown quotes if possible, output pure JSON.
```

### JSON Output Schema & Zod Specification
```typescript
import { z } from 'zod';

export const ExtractedFactsSchema = z.object({
  // Incident Classification
  incidentType: z.enum([
    'flood_rescue',
    'medical_emergency',
    'structure_collapse',
    'road_hazard',
    'welfare_check',
    'property_damage',
    'other'
  ]),
  
  // Location Extraction
  locationText: z.string().nullable(),
  sectorHint: z.enum(['sector-1', 'sector-2', 'sector-3a', 'sector-4']).nullable(),
  latitude: z.number().nullable(),          // Must be null unless explicit coordinates provided
  longitude: z.number().nullable(),         // Must be null unless explicit coordinates provided
  locationStatus: z.enum(['confirmed', 'approximate', 'missing']),

  // Headcount
  peopleAffected: z.number().int().positive().nullable(),

  // Life Threat & Environmental Danger
  waterDepthMeters: z.number().nullable(),   // e.g. 0.5, 1.2, 1.8
  waterCurrentSpeed: z.enum(['standing', 'slow', 'fast_rushing', 'torrential']).nullable(),
  structureIntegrity: z.enum(['stable', 'flooded_ground', 'cracking_roof', 'submerged', 'collapsed']).nullable(),

  // Medical & Vulnerability Facts
  medicalUrgencyLevel: z.enum([
    'none',
    'minor_injury',
    'chronic_managed',
    'urgent_medical',
    'time_critical_dependency'
  ]).nullable(),
  medicalConditionsReported: z.array(z.string()), // e.g. ["hemodialysis", "oxygen_dependent"]
  
  evacuationMobilityLevel: z.enum([
    'independent_adults',
    'minor_impairment',
    'vulnerable_group',
    'high_vulnerability',
    'completely_immobile'
  ]).nullable(),
  vulnerabilityDetails: z.array(z.string()),      // e.g. ["isolated_elderly", "infants", "bedridden"]

  // Communication & Provenance
  phoneAccessStatus: z.enum(['has_phone', 'no_phone', 'network_down', 'unknown']),
  extractedQuotes: z.array(z.string()),           // Exact phrases from original text providing evidence
  originalLanguage: z.enum(['english', 'urdu', 'roman_urdu']),
  englishTranslation: z.string().nullable()
});

export type ExtractedFacts = z.infer<typeof ExtractedFactsSchema>;
```

---

## 2. Explainability Rationale Generation Prompt

The Rationale Card translates the deterministic mathematical scores into clear, human-auditable text for commanders.

### System Prompt & Template
```text
You are the Tactical Decision Explainer for Nigehbaan.
Your task is to generate a concise, 2-3 bullet point human-auditable explanation for why an incident received its priority score.

INPUT DATA PROVIDED TO YOU:
- Incident Code: {{incidentCode}}
- Deterministic Priority Score: {{priorityScore}} / 100 (Category: {{priorityCategory}})
- Contributing Factor Breakdown:
  * Threat to Life: {{factors.lifeThreat}} / 5.0 (Weight 0.30)
  * Medical Urgency: {{factors.medicalUrgency}} / 5.0 (Weight 0.25)
  * Evacuation Inability: {{factors.evacuationInability}} / 5.0 (Weight 0.20)
  * Environmental Danger: {{factors.environmentalDanger}} / 5.0 (Weight 0.15)
  * Population Affected: {{factors.populationAffected}} / 5.0 (Weight 0.10)
- Unknown Factors: {{unknownCount}}
- Original Report: "{{originalReport}}"

RULES:
1. You MUST NOT change, recalculate, or contradict the provided scores.
2. Clearly explain which factors drove the score highest (e.g. "Primary urgency driven by hemodialysis medical dependency and chest-deep water").
3. If factors were unknown, explicitly state that weights were renormalized and data is pending verification.
4. Output exactly 2 or 3 bullet points. No conversational filler.
```

---

## 3. Bilingual Voice Transcription Prompt (Tier 2)

### Audio Transcription System Instruction
```text
You are the Emergency Voice Hotline Transcriber for Nigehbaan.
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
}
```

---

## 4. Failure Handling & Heuristic Fallback Specifications

1. **Timeout & Retries:**
   - Serverless API calls to Gemini have a strict **5-second timeout**.
   - If an API call fails or schema validation fails, the service executes **at most one automatic retry**.
2. **Rule-Based Heuristic Fallback Parser (`src/lib/ai/heuristicExtractor.ts`):**
   - If the retry fails or `GEMINI_API_KEY` is undefined:
     - Scans for regex keywords in English and Urdu:
       - Dialysis: `dialysis|ڈائیلاسز|گردے` $\to$ Medical Urgency: `time_critical_dependency` (5.0).
       - Chest-deep water: `chest|سینہ|چھت|roof` $\to$ Life Threat: `4.5`, Environmental: `4.5`.
       - Elderly / alone: `elderly|alone|old|بوڑھی|اکیلے` $\to$ Evacuation Inability: `4.0`.
       - Infants / babies: `infant|baby|بچے` $\to$ Evacuation Inability: `4.5`.
     - Sets `isAI: false`.
     - Injects UI badge: **`Offline heuristic extraction (not AI)`**.
3. **Simulated Audio Fallback:**
   - Simulated voice calls have an attached static transcript asset.
   - Sets `isAI: false`.
   - Injects UI badge: **`Scripted transcript for simulated call`**.
