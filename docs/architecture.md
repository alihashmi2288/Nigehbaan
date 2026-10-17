# Nigehbaan --- Architecture

**Status:** Planned MVP Architecture  
**Principle:** Deliver a rock-solid, zero-downtime, fully explainable emergency coordination prototype for Vercel deployment within the 36-hour hackathon.

---

## 1. Architectural Goals & Invariants

1. **Evaluator Reliability:** 100% demo uptime on Vercel without external database cold-starts, connection-pool exhaustion, or migration blockers.
2. **AI Safety Boundaries:** Pure deterministic TypeScript code for all priority calculations (0–100 scale), uncertainty flags, blind-spot floors, and opportunity cost trade-offs. The LLM is strictly used for text extraction and speech-to-text.
3. **Stateless AI Helpers:** Serverless API routes (`/api/ai/*`) act as stateless proxy helpers. If no API key is present or a rate limit occurs, the app falls back to rule-based heuristics with transparent UI labeling.
4. **Client-Side Reactive Store:** All incident, resource, shelter, and simulation state lives in an in-memory client store (Zustand or React Context) backed by `localStorage` persistence, pre-warmed with the District Alpha seed dataset.
5. **Human-in-the-Loop:** Dispatch actions update local state only upon explicit coordinator authorization.
6. **Instant Deterministic Replay:** A 1-click simulation reset restores the pristine baseline state instantly.

---

## 2. Technology Stack

| Layer | Choice | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14/15 App Router (TypeScript Strict) | Fast server-side rendering, API route encapsulation, edge deployment on Vercel. |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Built to exact tokens in `DESIGN.md` (neutral charcoal `#010102`, semantic crisis badges). |
| **State & Persistence** | Reactive Client Store + `localStorage` | Zero-dependency, sub-millisecond response, immune to DB timeouts during live judging. |
| **Business Logic** | Pure TypeScript Modules (`src/lib/*`) | Deterministic scoring, uncertainty detection, resource matching, and simulation runner. |
| **Mapping** | Leaflet + React-Leaflet | Open-source tactical GIS mapping with custom crisis markers and sector polygons. |
| **AI Intelligence** | Google Gemini API (`@google/genai`) | Structured fact extraction and bilingual audio transcription with heuristic fallback. |
| **Validation** | Zod | Runtime schema validation for forms, AI payloads, and seed data. |
| **Deployment** | Vercel | Seamless edge deployment with automated preview builds. |

---

## 3. System Data Flow & Runtime Architecture

```text
               +-------------------------------------------------------+
               |                  INGESTION CHANNELS                   |
               |  Citizen Form  |  Voice Hotline  |  Proxy Report     |
               +-------------------------------------------------------+
                                           |
                                           v
       +-----------------------------------------------------------------------+
       |                         STATELESS API ROUTES                          |
       |  POST /api/ai/extract                   POST /api/ai/transcribe       |
       |  -> Calls Gemini API                     -> Transcribes Urdu/English  |
       |  -> On failure: Heuristic Rule Parser    -> On failure: Scripted text |
       |  -> Emits { structuredFacts, isAI: boolean }                          |
       +-----------------------------------------------------------------------+
                                           |
                                           v (Structured Facts)
       +-----------------------------------------------------------------------+
       |                  CLIENT-SIDE REACTIVE STATE STORE                     |
       |                 (Zustand / Context + localStorage)                    |
       |                                                                       |
       |  Pre-warmed Seed State (District Alpha: Incidents, Assets, Shelters)  |
       |  Actions: addIncident(), assignResource(), setTimeline(), reset()    |
       +-----------------------------------------------------------------------+
                      |                                       |
                      v                                       v
       +-----------------------------+         +-------------------------------+
       |    DETERMINISTIC ENGINES    |         |       UNCERTAINTY RADAR       |
       |  (Pure TypeScript in lib/)  |         |  (Pure TypeScript in lib/)    |
       |                             |         |                               |
       | 1. 5-Factor Scorer (0-100)  |         | 1. Missing Location Detector  |
       | 2. Vulnerability Floors     |         | 2. Stale Report Monitor (>60m)|
       | 3. Opportunity Cost Warning |         | 3. Conflict & Duplicate Flags |
       | 4. Shelter Capacity Matcher |         | 4. Blind-Spot Sector Monitor  |
       | 5. Timeline Scrubber Runner |         |    -> Synthesizes Incidents   |
       +-----------------------------+         +-------------------------------+
                      \                                       /
                       \                                     /
                        v                                   v
       +-----------------------------------------------------------------------+
       |                         TACTICAL COMMAND HUD                          |
       |                                                                       |
       |  [Interactive Leaflet GIS Map]   [Deterministic Priority Queue]       |
       |  [Explainability Rationale Card] [Opportunity Cost Confirmation Modal]|
       |  [Timeline Scrubber: T-0/3/6/12] [1-Click Reset Baseline Button]      |
       +-----------------------------------------------------------------------+
                                           |
                                           v
                       Human Coordinator Approves Dispatch
                                           |
                                           v
       Store updates: Resource -> "assigned", Log entry appended, Map refreshed
```

---

## 4. Application Routes & Navigation

```text
/
  -> Root entry: Redirects to /dashboard

/dashboard
  -> Unified Tactical Operations HUD:
     - Top bar: Timeline Scrubber (T-0, T+3, T+6, T+12), Reset Button, Simulation badge
     - Left pane: Priority Incident Queue with filter tabs & search
     - Center pane: Interactive GIS Map with incident markers, resource bases, sector polygons
     - Right inspector: Selected Incident details, Factor Breakdown, Rationale Card, Resource Dispatcher

/incidents/new
  -> Emergency Report Form:
     - Direct self-report or Community Proxy mode
     - Natural language description input
     - Fact extraction preview with honest fallback badges

/uncertainty
  -> Dedicated Uncertainty Radar Monitor:
     - Review cards for missing locations, conflicting road claims, stale items, and blind spots

/resources
  -> Resource Fleet & Shelter Roster:
     - Vehicle availability status, terrain capabilities, sector staging
     - Shelter capacity meters, backup power status, medical capabilities

/api/ai/extract
  -> Stateless POST endpoint: extracts structured facts from text using Gemini with heuristic fallback

/api/ai/transcribe
  -> Stateless POST endpoint: transcribes distress audio using Gemini with scripted fallback
```

---

## 5. Repository File Structure

```text
nigehbaan/
├── README.md                          <-- Project homepage & pitch
├── AGENTS.md                          <-- AI agent system contract & tier rules
├── DESIGN.md                          <-- Design system tokens & crisis UI specs
├── docs/                              <-- Specifications & engineering documentation
│   ├── PRD.md                         <-- Product requirements & tier matrix
│   ├── scoring-spec.md                <-- Deterministic triage formula & lookup tables
│   ├── seed-data.md                   <-- District Alpha scenarios, sectors, & timeline
│   ├── acceptance-tests.md            <-- Given/When/Then test criteria
│   ├── ai-prompts.md                  <-- System prompts, Zod schemas, & fallbacks
│   ├── architecture.md                <-- System architecture & data flow (this file)
│   ├── trade-offs.md                  <-- Architectural choices, cuts, & rationale
│   ├── rules.md                       <-- Engineering standards & phase milestones
│   ├── demo-script.md                 <-- 3-minute evaluation walkthrough & pitch
│   ├── submission-checklist.md        <-- Hackathon compliance checklist
│   └── memory.md                      <-- Living state & decision history
├── src/
│   ├── app/                           <-- Next.js App Router pages
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── incidents/new/page.tsx
│   │   │   ├── uncertainty/page.tsx
│   │   │   └── resources/page.tsx
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── extract/route.ts
│   │   │   │   └── transcribe/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/                 <-- Incident queue, detail inspector, explainability card
│   │   ├── maps/                      <-- Leaflet tactical GIS map, sector polygons, markers
│   │   ├── uncertainty/               <-- Uncertainty Radar cards & blind spot alert badges
│   │   ├── resources/                 <-- Opportunity cost warning modal, shelter meters
│   │   ├── audio/                     <-- Voice distress player & waveform visualizer
│   │   ├── simulation/                <-- Timeline scrubber (T-0 to T-12) & reset button
│   │   └── ui/                        <-- Design system primitives (buttons, badges, inputs)
│   ├── lib/                           <-- Pure TypeScript business logic engines
│   │   ├── triage/
│   │   │   ├── scoringEngine.ts       <-- 5-factor deterministic MCDA formula
│   │   │   ├── lookupTables.ts        <-- Fact-to-score bucket mappings
│   │   │   └── explainability.ts      <-- Audit rationale generator
│   │   ├── uncertainty/
│   │   │   ├── radar.ts               <-- Detector for missing, stale, and conflicting reports
│   │   │   └── blindSpots.ts          <-- Sector silence evaluator & incident synthesizer
│   │   ├── resources/
│   │   │   ├── allocation.ts          <-- Vehicle suitability matching
│   │   │   ├── opportunityCost.ts     <-- Sector depletion & queue turnaround delay calculator
│   │   │   └── shelterMatching.ts     <-- Bed occupancy & medical capability matcher
│   │   ├── simulation/
│   │   │   ├── timelineRunner.ts      <-- Advances T-0, T-3, T-6, T-12 state
│   │   │   └── seedData.ts            <-- District Alpha baseline scenario data
│   │   ├── store/
│   │   │   ├── useAppStore.ts         <-- Client-side reactive store with localStorage sync
│   │   │   └── initialBaseline.ts     <-- Factory function for pristine reset
│   │   └── ai/
│   │       ├── geminiClient.ts        <-- Google Gemini API wrapper
│   │       └── heuristicExtractor.ts  <-- Rule-based offline fallback parser
│   └── types/
│       ├── incident.ts                <-- Incident, report, and extraction interfaces
│       ├── resource.ts                <-- Vehicle, boat, and crew interfaces
│       ├── shelter.ts                 <-- Shelter capacity and capability interfaces
│       ├── sector.ts                  <-- Sector polygon and telemetry interfaces
│       └── uncertainty.ts             <-- Uncertainty flag types and schemas
├── tests/
│   ├── scoring.test.ts                <-- Deterministic unit tests for 5-factor scoring
│   ├── uncertainty.test.ts            <-- Unit tests for radar flags and blind-spot floor
│   └── opportunityCost.test.ts        <-- Unit tests for delay calculation and trade-offs
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 6. Core Data Interfaces

### `Incident` Interface
```typescript
export interface Incident {
  id: string;
  incidentCode: string;               // e.g. "NG-101"
  originalReport: string;
  sourceType: 'citizen' | 'voice_hotline' | 'community_proxy' | 'system_blind_spot';
  timestamp: string;                  // ISO 8601
  status: 'new' | 'investigating' | 'assigned' | 'in_progress' | 'resolved';
  
  // Location
  sectorId: string;                   // e.g. "sector-3a"
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  locationStatus: 'confirmed' | 'approximate' | 'missing';

  // Structured Triage Factors (0 - 5 scale)
  factors: {
    lifeThreat: number;
    medicalUrgency: number;
    evacuationInability: number;
    environmentalDanger: number;
    populationAffected: number;
  };
  unknownFactorsCount: number;        // 0 to 5
  
  // Deterministic Scoring Output
  priorityScore: number;              // 0.0 to 100.0
  priorityCategory: 'Critical' | 'High' | 'Moderate' | 'Low';
  confidenceScore: number;            // 0.0 to 1.0 (kept separate from urgency)
  rationaleCard: string;              // Human-auditable explanation text

  // Community Proxy & Telecom Status
  communicationStatus: 'has_phone' | 'no_phone' | 'network_down' | 'unknown';
  reporterPhone?: string;

  // Active Assignment
  assignedResourceId?: string | null;
  assignedShelterId?: string | null;
}
```

### `Resource` Interface
```typescript
export interface Resource {
  id: string;
  callsign: string;                   // e.g. "Shallow Jet-Boat 01"
  type: 'shallow_boat' | 'deep_boat' | 'heavy_4x4' | 'mobile_medical' | 'recon_patrol';
  sectorId: string;
  status: 'available' | 'assigned' | 'in_transit' | 'maintenance';
  crewCapacity: number;
  transitSpeedKmH: number;
  turnaroundMinutes: number;          // Baseline roundtrip cycle time (e.g. 35 mins)
}
```

### `Shelter` Interface
```typescript
export interface Shelter {
  id: string;
  name: string;                       // e.g. "Government High School Relief Camp"
  sectorId: string;
  capacityTotal: number;
  capacityOccupied: number;
  hasGeneratorPower: boolean;
  medicalCapabilities: Array<'basic_first_aid' | 'dialysis_support' | 'maternal_care' | 'oxygen'>;
  status: 'active' | 'full' | 'compromised';
}
```

---

## 7. Tier 2: Progressive Web App (PWA) & Offline Queue Design

In Tier 2, Nigehbaan includes an installable PWA manifest and service worker for field coordinators and volunteers operating in unstable cellular areas:

1. **Static Shell Caching:** Cache the HTML shell, Tailwind CSS bundle, and Leaflet vector assets using Cache-First strategy.
2. **Offline Report Queue:** When a report is submitted without network connectivity:
   - Save the raw submission to `localStorage` / `IndexedDB` under `pending_offline_submissions`.
   - Show an immediate UI indicator: *"Report queued locally (offline mode)"*.
   - Listen for `window.addEventListener('online')` to trigger a background sync.
3. **Graceful De-duplication:** On sync, check timestamps and reporter phone to prevent duplicate ingestion.

---

## 8. Deployment & Environment Configuration

### Environment Variables (`.env.example`)
```bash
# Server-Side Only: Google Gemini API Key for Extraction & Speech-to-Text
GEMINI_API_KEY=""

# Optional: Gemini Model Override (Defaults to gemini-2.5-flash)
GEMINI_MODEL="gemini-2.5-flash"

# Application Mode
NEXT_PUBLIC_APP_MODE="demo"
```

### Vercel Deployment Checklist
- Deploy Next.js App Router to Vercel without database connection dependencies.
- Zero server-side persistent state: Next.js API routes are strictly stateless JSON converters.
- Client boots up instantly by initializing the seed scenario in `localStorage` if empty.
- 1-Click "Reset Simulation" clears `localStorage` and re-injects pristine baseline seed data.
