# Nigehbaan (نگہبان) --- Authoritative Task Backlog (TASKS.md)

> **MANDATORY INSTRUCTION FOR CODING AGENTS:**  
> 1. Pick the **first uncompleted task** (`[ ]`) whose dependencies are satisfied.
> 2. Read **ALL files in "Read First"** before touching any code.
> 3. Implement **only** the designated files and logic for that task.
> 4. Verify with the exact **Acceptance Criteria**.
> 5. Mark the task done (`[x]`), update `docs/memory.md`, and **stop execution**. Never batch multiple tasks into one turn.

---

## Milestone 0: Bootstrap & Project Setup (Tier 1)

### [x] Task T0.1: Initialize Next.js 14/15 App Router Skeleton
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** None
- **Files to create/edit:**
  - `package.json`
  - `tsconfig.json`
  - `next.config.mjs`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
- **Read First:**
  - [`AGENTS.md`](./AGENTS.md)
  - [`DESIGN.md`](./DESIGN.md)
- **Implementation Details:**
  - Initialize Next.js App Router project with TypeScript strict mode enabled.
  - Set page metadata: Title: *"Nigehbaan (نگہبان) --- Tactical Disaster Triage"*, description from `docs/submission-checklist.md`.
  - Ensure zero build warnings on `npm run build`.
- **Acceptance Criteria:**
  - `npm run build` succeeds cleanly with exit code 0.
  - Local server renders basic page shell with dark background.

---

### [x] Task T0.2: Configure Tailwind CSS with DESIGN.md Tokens
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T0.1
- **Files to create/edit:**
  - `tailwind.config.ts`
  - `src/app/globals.css`
- **Read First:**
  - [`DESIGN.md`](./DESIGN.md)
- **Implementation Details:**
  - Define CSS custom properties and Tailwind color extensions using DESIGN.md token names (never invent ad-hoc hex values):
    - Canvas: `--canvas: #010102`
    - Surface Levels: `--surface-1: #0f1011`, `--surface-2: #141516`, `--surface-3: #18191a`, `--surface-4: #191a1b`
    - Hairline Borders: `--hairline: #23252a`, `--hairline-strong: #34343a`, `--hairline-tertiary: #3e3e44`
    - Brand / Primary Accent: `--primary: #5e6ad2`, `--primary-hover: #828fff`, `--primary-focus: #5e69d1`
    - Crisis Semantics:
      - Critical: `--semantic-critical: #B42318`, text `--semantic-critical-text: #FDA29B`, border `--semantic-critical-border: #F04438`
      - Warning / High: `--semantic-warning: #92400E`, text `--semantic-warning-text: #FDB022`, border `--semantic-warning-border: #D97706`
      - Blind-Spot: `--semantic-blind-spot: #DB6D28`, text `--semantic-blind-spot-text: #F79009`, border `--semantic-blind-spot-border: #BD561D`
      - Success: `--semantic-success: #27a644`, text `--semantic-success-text: #75E0A7`, border `--semantic-success-border: #12B76A`
      - Unknown / Slate: `--semantic-unknown: #475569`, text `--semantic-unknown-text: #94A3B8`
  - Configure Inter / JetBrains Mono typography and WCAG AA contrast helpers.
- **Acceptance Criteria:**
  - Loading `src/app/page.tsx` exhibits deep black canvas (`--canvas: #010102`) and hairline borders (`--hairline: #23252a`).
  - Dark mode styles apply without flashing or contrast regressions.

---

### [x] Task T0.3: Setup Vitest Test Runner & Testing Infrastructure
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T0.1
- **Files to create/edit:**
  - `vitest.config.ts`
  - `package.json` (add test script: `"test": "vitest run"`)
  - `tests/sanity.test.ts`
- **Read First:**
  - [`docs/rules.md`](./docs/rules.md)
- **Implementation Details:**
  - Install and configure `vitest` with node environment for blazing-fast unit testing of scoring arithmetic.
  - Add simple sanity test verifying arithmetic assertion.
- **Acceptance Criteria:**
  - `npm test` runs vitest and exits with 0 failures.

---

### [x] Task T0.4: Deploy Empty Skeleton to Vercel
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T0.1, T0.2
- **Files to create/edit:**
  - `vercel.json` (if needed)
- **Read First:**
  - [`docs/rules.md`](./docs/rules.md) Milestone 0
- **Implementation Details:**
  - Verify project builds locally with `npm run build`.
  - Deploy to Vercel and confirm preview/production URL is live.
- **Acceptance Criteria:**
  - Live Vercel deployment renders tactical dark theme with zero console errors.

---

## Milestone 1: Deterministic Scoring Engine & Tests (Tier 1)

### [x] Task T1.1: Core TypeScript Data Types & Zod Schemas
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T0.1
- **Files to create/edit:**
  - `src/types/incident.ts`
  - `src/types/resource.ts`
  - `src/types/shelter.ts`
  - `src/types/simulation.ts`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md)
  - [`docs/ai-prompts.md`](./docs/ai-prompts.md)
  - [`src/lib/simulation/seed.json`](./src/lib/simulation/seed.json)
- **Implementation Details:**
  - Create full TypeScript interfaces matching `seed.json`: `Incident`, `Resource`, `Shelter`, `Sector`, `TimelinePhase`.
  - Include all factor fields `[f1, f2, f3, f4, f5]`, nullable number types, `PriorityCategory` union (`'Critical' | 'High' | 'Moderate' | 'Low'`).
  - Define `UncertaintyFlag` enum: `'MISSING_LOCATION' | 'STALE_REPORT' | 'CONFLICTING_REPORT' | 'POTENTIAL_DUPLICATE'`.
- **Acceptance Criteria:**
  - TypeScript compilation passes with zero `any` types.

---

### [x] Task T1.2: Deterministic 5-Factor MCDA Scoring Engine
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T1.1
- **Files to create/edit:**
  - `src/lib/triage/scoringEngine.ts`
- **Read First:**
  - [`docs/scoring-spec.md`](./docs/scoring-spec.md) Section 1, 3, 4, 5
- **Implementation Details:**
  - Implement mathematical MCDA formula:
    $$\text{Score} = 100 \times \frac{\sum_{\text{known}} (w_i \cdot f_i / 5.0)}{\sum_{\text{known}} w_i}$$
  - Weights: `w1 = 0.30`, `w2 = 0.25`, `w3 = 0.20`, `w4 = 0.15`, `w5 = 0.10`.
  - Renormalize unknowns: omit `null`/`undefined` factors; sum known weights in denominator.
  - Category thresholds: $\ge 75.0 \to$ Critical, $55.0 - 74.9 \to$ High, $35.0 - 54.9 \to$ Moderate, $< 35.0 \to$ Low.
  - Blind-spot and no-phone vulnerability floor rules:
    - If `communication_status === 'no_phone'`, $f_3 = \max(f_3, 4.0)$.
    - If `reporter_type === 'system_blind_spot'`, enforce $\min(\text{score}) \ge 60.0$.
  - Round final score to 1 decimal place.
- **Acceptance Criteria:**
  - Pure function matches formula exactness without any LLM dependencies.

---

### [x] Task T1.3: Triage Queue Ranking & Tie-Break Logic
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T1.2
- **Files to create/edit:**
  - `src/lib/triage/queueRanker.ts`
- **Read First:**
  - [`docs/scoring-spec.md`](./docs/scoring-spec.md) Section 2 (Triage Ranking Protocol)
- **Implementation Details:**
  - Implement 3-tier deterministic sorting:
    1. Primary: Priority Score descending (`scoreA > scoreB`).
    2. Secondary Tie-Break: Within $\pm 0.1$, incident with **lower Information Confidence** ($C = \sum_{\text{known}} w_i$) ranks higher.
    3. Tertiary Tie-Break: Earlier report timestamp ranks higher (FIFO).
- **Acceptance Criteria:**
  - Tied incidents rank higher when they have missing data (confidence inversion).

---

### [x] Task T1.4: Unit Tests for All 12 Seed Incidents
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T1.2, T1.3
- **Files to create/edit:**
  - `tests/scoring.test.ts`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 5
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.1, 1.2, 1.2b, 1.3
- **Implementation Details:**
  - Write Vitest test assertions verifying that all 12 District Alpha seed incidents produce exact expected scores:
    `NG-101: 86.5`, `NG-102: 81.0`, `NG-103: 68.7`, `NG-104: 56.5`, `NG-105: 39.5`, `NG-106: 17.0`, `NG-107: 5.0`, `NG-108: 11.0`, `NG-109: 50.0`, `NG-110: 59.5`, `NG-111: 67.5`, `NG-112: 60.0`.
  - Add tests for unknown factor renormalization (Example 3 from scoring-spec).
  - Add tests for tie-break confidence inversion.
- **Acceptance Criteria:**
  - `npm test` passes with 100% assertions green.

---

## Milestone 2: State Store & Seed Data (Tier 1)

### [x] Task T2.1: Seed Data Loader & Scenario Normalizer
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T1.1
- **Files to create/edit:**
  - `src/lib/simulation/seedLoader.ts`
- **Read First:**
  - [`src/lib/simulation/seed.json`](./src/lib/simulation/seed.json)
  - [`docs/seed-data.md`](./docs/seed-data.md)
- **Implementation Details:**
  - Load and validate pristine District Alpha scenario from `src/lib/simulation/seed.json`.
  - Expose helper functions: `getPristineIncidents()`, `getPristineResources()`, `getPristineShelters()`, `getPristineSectors()`.
- **Acceptance Criteria:**
  - Loader returns all 12 incidents, 6 resources, 3 shelters, 4 sectors with correct stationing (`RES-01` in `sector-2`, `RES-02` in `sector-3a`).

---

### [x] Task T2.2: Reactive Client State Store with LocalStorage Persistence
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T2.1, T1.2
- **Files to create/edit:**
  - `src/store/useAppStore.ts`
- **Read First:**
  - [`AGENTS.md`](./AGENTS.md) Invariant 6
  - [`docs/rules.md`](./docs/rules.md) Section 3
- **Implementation Details:**
  - Implement Zustand store (or React Context) with `localStorage` persistence.
  - Store state: `incidents: Incident[]`, `resources: Resource[]`, `shelters: Shelter[]`, `timelinePhase: TimelinePhaseId`, `activityLogs: AuditLogEntry[]`, `selectedIncidentId: string | null`.
  - Initialize store with pristine seed data if `localStorage` is empty.
  - Implement actions: `assignResource(incidentId, resourceId)`, `submitIncident(report)`, `setTimelinePhase(phaseId)`.
- **Acceptance Criteria:**
  - State changes persist across browser page reloads.

---

### [x] Task T2.3: 1-Click Simulation Reset Function & Activity Log
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T2.2
- **Files to create/edit:**
  - `src/store/useAppStore.ts`
  - `src/components/layout/ResetButton.tsx`
- **Read First:**
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.6, Test 1.9
- **Implementation Details:**
  - Action `resetSimulation()` restores `localStorage` to pristine baseline seed data immediately (< 10ms).
  - Resets timeline scrubber to `T-0 Early Warning`.
  - Appends audit log entries with ISO timestamp for coordinator assignments.
- **Acceptance Criteria:**
  - Clicking "Reset Simulation" restores initial state, clears dirty assignments, and returns timeline to T-0.

---

## Milestone 3: GIS Map & Sector Polygons (Tier 1)

### [x] Task T3.1: Leaflet GIS Map Container & Dark Matter Tiles
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T0.2, T1.1
- **Files to create/edit:**
  - `src/components/map/TacticalMap.tsx`
  - `src/components/map/MapWrapper.tsx` (Dynamic client-only import with `ssr: false`)
- **Read First:**
  - [`DESIGN.md`](./DESIGN.md)
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 1
- **Implementation Details:**
  - Dynamically load Leaflet without SSR.
  - Center on District Alpha: `[24.935, 67.145]`, zoom level 12.
  - Use CartoDB Dark Matter tile layer:  
    `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`.
  - Custom dark map styling removing generic bright Leaflet controls.
- **Acceptance Criteria:**
  - Map renders crisp dark tiles centered on District Alpha with smooth pan/zoom.

---

### [x] Task T3.2: Render Sector Polygons with Blind-Spot Styling
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T3.1, T2.2
- **Files to create/edit:**
  - `src/components/map/SectorPolygonLayer.tsx`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 1
  - [`DESIGN.md`](./DESIGN.md) Crisis Semantic Badges & Tokens
- **Implementation Details:**
  - Draw 4 sector polygons (`sector-1`, `sector-2`, `sector-3a`, `sector-4`).
  - Default styling: subtle border using `--hairline` (`#23252a`), fill using `--surface-1` (`#0f1011`) with 0.3 opacity.
  - When a sector is flagged as a blind spot (e.g. `sector-3a` at T+6):  
    border turns `--semantic-blind-spot` (`#DB6D28`), dashed stroke (`dashArray: '6, 6'`), pulsing glow. Reference DESIGN.md token names rather than hardcoding ad-hoc hex values.
- **Acceptance Criteria:**
  - Sectors render with crisp boundaries; Sector 3A highlights in tangerine (`--semantic-blind-spot`) when blind spot is active.

---

### [x] Task T3.3: Incident Markers with Priority Severity Rings
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T3.1, T2.2
- **Files to create/edit:**
  - `src/components/map/IncidentMarkerLayer.tsx`
- **Read First:**
  - [`DESIGN.md`](./DESIGN.md)
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.2
- **Implementation Details:**
  - Render SVG markers for incidents with known coordinates (`latitude !== null`).
  - Color-code using DESIGN.md semantic token names:
    - Critical: `--semantic-critical` (`#B42318`)
    - High: `--semantic-warning` (`#92400E`)
    - Moderate: `--semantic-warning` / amber with reduced intensity
    - Low: `--semantic-unknown` / slate (`#475569`) or low accent
  - Add pulsing ring animation around Critical incidents.
  - Clicking a marker selects the incident in the store and opens the inspector panel.
  - Omit markers for `NG-112` (missing coordinates) and display badge indicator instead.
- **Acceptance Criteria:**
  - Incidents render at proper coordinates; clicking marker selects incident in queue.

---

### [x] Task T3.4: Rescue Resource Stations & Shelter Markers
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T3.1, T2.2
- **Files to create/edit:**
  - `src/components/map/ResourceStationLayer.tsx`
  - `src/components/map/ShelterMarkerLayer.tsx`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 3, 4
- **Implementation Details:**
  - Render distinct icons for resources (`RES-01` to `RES-06`) at their station sectors.
  - Render shelter facilities (`SHL-01`, `SHL-02`, `SHL-03`) with capacity badges (e.g. `32%`, `70%`, `97%`).
  - Status indicators: available (emerald green), assigned (amber).
- **Acceptance Criteria:**
  - All 6 resources and 3 shelters visible on map with correct tooltips.

---

## Milestone 4: Triage Queue & Incident Inspector (Tier 1)

### [x] Task T4.1: Filterable Triage Incident Queue
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T2.2, T1.3
- **Files to create/edit:**
  - `src/components/queue/IncidentQueue.tsx`
  - `src/components/queue/IncidentCard.tsx`
- **Read First:**
  - [`DESIGN.md`](./DESIGN.md)
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.1
- **Implementation Details:**
  - Display list of active incidents sorted by `queueRanker.ts`.
  - Filter by sector, priority category, and uncertainty flags.
  - Display code, category badge, 0–100 score, timestamp, and headline snippet.
  - Active incident card highlighted with `--primary-accent` border.
- **Acceptance Criteria:**
  - Incidents render sorted with highest score first (`NG-101` at 86.5 top of list at T+3).

---

### [x] Task T4.2: Incident Detail Inspector & Factor Breakdown Card
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T4.1
- **Files to create/edit:**
  - `src/components/inspector/IncidentInspector.tsx`
  - `src/components/inspector/FactorBreakdownCard.tsx`
- **Read First:**
  - [`docs/scoring-spec.md`](./docs/scoring-spec.md) Section 1, 3
  - [`DESIGN.md`](./DESIGN.md)
- **Implementation Details:**
  - Render detailed inspector pane when an incident is selected.
  - Show 5 factor progress bars (0.0 to 5.0) with contributing weights:
    - Threat to Life (0.30)
    - Medical Urgency (0.25)
    - Evacuation Inability (0.20)
    - Environmental Danger (0.15)
    - Population Affected (0.10)
  - If a factor is `null`, display *"Unknown — weight renormalized"* with dashed styling.
- **Acceptance Criteria:**
  - Selecting `NG-101` displays all 5 factors correctly matching `[4.5, 5.0, 4.0, 4.5, 2.5]`.

---

### [x] Task T4.3: Explainability Rationale Card Component
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T4.2
- **Files to create/edit:**
  - `src/components/inspector/ExplainabilityCard.tsx`
  - `src/lib/triage/explainabilityGenerator.ts`
- **Read First:**
  - [`docs/ai-prompts.md`](./docs/ai-prompts.md) Section 2
- **Implementation Details:**
  - Deterministic fallback summary generator that crafts 2–3 concise bullet points explaining highest factors.
  - If factor weights were renormalized, explicitly explains: *"Weights renormalized across known factors; priority reflects verified urgency."*
  - Optional serverless call to Gemini when online, falling back to deterministic template immediately.
- **Acceptance Criteria:**
  - Displays human-auditable rationale bullets without altering or contradicting the mathematical score.

---

## Milestone 5: Intake & Extraction (Tier 1)

### [x] Task T5.1: Emergency Intake Report Form Modal
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T2.2
- **Files to create/edit:**
  - `src/components/intake/IntakeModal.tsx`
  - `src/components/intake/CommunityProxyToggle.tsx`
- **Read First:**
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.3, Test 1.8
- **Implementation Details:**
  - Modal with textarea for unstructured distress text.
  - Sector hint selector (optional), phone access toggle (`has_phone`, `no_phone`, `network_down`).
  - Pre-fill button with sample crisis prompts for quick testing.
- **Acceptance Criteria:**
  - Form allows submitting distress report; respects dark theme and accessibility focus rings.

---

### [x] Task T5.2: Gemini Fact Extraction API Route
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T1.1
- **Files to create/edit:**
  - `src/app/api/ai/extract/route.ts`
- **Read First:**
  - [`docs/ai-prompts.md`](./docs/ai-prompts.md) Section 1
- **Implementation Details:**
  - Serverless API route using `@google/genai` or `@google/generative-ai`.
  - Uses `process.env.GEMINI_MODEL || 'gemini-2.5-flash'`.
  - Wraps input in `<citizen_report>` untrusted data tags.
  - Validates output with `ExtractedFactsSchema` Zod parser (clamping depth 0–10m, people 1–500).
  - 5-second timeout with at most 1 retry.
  - Returns `{ success: true, facts, isAI: true }` or throws to trigger fallback.
- **Acceptance Criteria:**
  - Valid JSON returned for valid extraction; rejects malformed output.

---

### [x] Task T5.3: Deterministic Heuristic Fallback Extractor
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T1.1
- **Files to create/edit:**
  - `src/lib/ai/heuristicExtractor.ts`
- **Read First:**
  - [`docs/ai-prompts.md`](./docs/ai-prompts.md) Section 4
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.8
- **Implementation Details:**
  - Rule-based parser triggered if Gemini key is missing, API fails, or validation errors.
  - Word-boundary regexes with case-insensitivity:
    - Dialysis: `/\b(dialysis|hemodialysis)\b|ڈائیلاسز|گردے/i`
    - Chest-deep: `/\b(chest[- ]deep|waist[- ]deep|roof|submerged)\b|سینہ|چھت/i`
    - Elderly/alone: `/\b(elderly|alone|aged|old)\b|بوڑھی|بوڑھے|اکیلے/i`
    - Infants: `/\b(infant|baby|babies|children|toddler)\b|بچے|بچہ/i`
  - Injects badge metadata: `isAI: false`, fallbackBadge: `"Offline heuristic extraction (not AI)"`.
- **Acceptance Criteria:**
  - Golden test oracle passes: runs against `docs/extraction-fixtures.json` and extracts dialysis dependency and vulnerability correctly.

---

### [x] Task T5.4: Wire Intake Submission to Scoring & State Store
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T5.1, T5.2, T5.3, T1.2
- **Files to create/edit:**
  - `src/components/intake/IntakeModal.tsx`
  - `src/store/useAppStore.ts`
- **Read First:**
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.3, Test 1.8
- **Implementation Details:**
  - On submit: call `/api/ai/extract` (or heuristic fallback if offline).
  - Convert extracted facts into 5 numeric factors using factor lookup rules.
  - Compute priority score and category deterministically via `scoringEngine.ts`.
  - Prepend new incident to store and update priority queue.
- **Acceptance Criteria:**
  - Submitting new report creates prioritized incident in queue with correct score and honest fallback badge.

---

## Milestone 6: Uncertainty Radar & Blind-Spot Engine (Tier 1)

### [x] Task T6.1: Uncertainty Radar Detection Engine
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T1.1, T2.2
- **Files to create/edit:**
  - `src/lib/uncertainty/radarDetector.ts`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 6
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.7
- **Implementation Details:**
  - Implement 4 deterministic flag rules:
    1. `MISSING_LOCATION`: `latitude === null || longitude === null`.
    2. `STALE_REPORT`: `simulationClock - incident.timestamp > 60 minutes` and status is unassigned.
    3. `CONFLICTING_REPORT`: Incidents referencing opposing claims on the same landmark (e.g. `NG-108` and `NG-109`).
    4. `POTENTIAL_DUPLICATE`: Same sector, text similarity $\ge 0.75$, within 180 min (e.g. `NG-104` and `NG-110`).
- **Acceptance Criteria:**
  - Correctly flags `NG-112` (missing location), `NG-111` (stale at T+6), `NG-108/109` (conflict pair), and `NG-104/110` (duplicate).

---

### [x] Task T6.2: Sector Blind-Spot Detector & Incident Synthesizer
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T6.1, T1.2
- **Files to create/edit:**
  - `src/lib/uncertainty/blindSpotDetector.ts`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 6.3
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.4
- **Implementation Details:**
  - Evaluates sector health when simulation clock changes:
    - Tower status is `offline`.
    - Silence duration: `simulationClock - last_report_timestamp >= 90 minutes`.
    - Flood gauge trend is `rising` and level $\ge$ hazard threshold.
  - When all hold (Sector 3A at T+6): synthesize incident `NG-103`:
    - `reporter_type: 'system_blind_spot'`
    - Evacuation Inability $= 4.0$, Environmental Danger $= 4.5$.
    - Score calculated deterministically ($68.7 \ge 60.0$ floor).
    - Label: *"Physical Welfare Recon / Field Sweep"*. Category: `High`.
- **Acceptance Criteria:**
  - At T+6 (10:30), Sector 3A triggers blind spot and synthesizes `NG-103` with score 68.7.

---

### [x] Task T6.3: Uncertainty Radar UI Panel & Conflict Modal
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T6.1, T6.2
- **Files to create/edit:**
  - `src/components/uncertainty/UncertaintyRadarPanel.tsx`
  - `src/components/uncertainty/ConflictModal.tsx`
- **Read First:**
  - [`DESIGN.md`](./DESIGN.md)
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.7
- **Implementation Details:**
  - Dedicated HUD panel showing active uncertainty flags with counts.
  - Clicking `CONFLICTING_REPORT` opens side-by-side comparison modal of `NG-108` and `NG-109`.
  - Never auto-merges or deletes conflicting reports.
- **Acceptance Criteria:**
  - Clicking conflicting report flag displays both reports side-by-side for human coordinator judgment.

---

## Milestone 7: Opportunity Cost & Human Dispatch (Tier 1)

### [x] Task T7.1: Deterministic Opportunity Cost Calculator
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T1.1
- **Files to create/edit:**
  - `src/lib/resources/opportunityCost.ts`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 6.6, 8
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.5
- **Implementation Details:**
  - Implement opportunity cost algorithm:
    ```typescript
    function calculateOpportunityCost(asset: Resource, incident: Incident, availableResources: Resource[], queue: Incident[])
    ```
  - Shallow boats are sector-bound: count remaining shallow boats in `incident.sector` (excluding candidate asset).
  - If remaining $== 0$: delay = `asset.turnaroundMinutes` (35 min), label: *"0 shallow-draft assets left in sector"*.
  - Find next queued incident in that sector needing shallow boat (e.g. `NG-104`).
- **Acceptance Criteria:**
  - Assigning `RES-01` to `NG-101` produces exactly: 0 assets left, +35 min delay for `NG-104`.

---

### [x] Task T7.2: Resource Assignment Modal & Warning Card
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T7.1, T2.2
- **Files to create/edit:**
  - `src/components/dispatch/AssignmentModal.tsx`
  - `src/components/dispatch/OpportunityCostWarningCard.tsx`
- **Read First:**
  - [`DESIGN.md`](./DESIGN.md)
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.5
- **Implementation Details:**
  - Modal opening when coordinator clicks "Assign Resource" in inspector.
  - Lists candidate resources filtered by sector and status (`available`).
  - When selecting `RES-01`, renders `--semantic-high` Opportunity Cost Warning Card:  
    *"Committing Shallow Jet-Boat 01 to NG-101 leaves 0 shallow-draft assets available in Sector 2. Queued Incident NG-104 [Score 56.5 — High] will incur an estimated +35 min delay."*
- **Acceptance Criteria:**
  - Modal displays the +35 min delay warning clearly before assignment approval.

---

### [x] Task T7.3: Human Approval Gate & Activity Audit Log
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T7.2, T2.2
- **Files to create/edit:**
  - `src/components/dispatch/AssignmentModal.tsx`
  - `src/components/audit/AuditLogDrawer.tsx`
- **Read First:**
  - [`AGENTS.md`](./AGENTS.md) Invariant 5
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.6
- **Implementation Details:**
  - Action requires coordinator to explicitly click "Approve Assignment".
  - Disables candidate resource from other queues (`status: 'assigned'`).
  - Updates incident status to `assigned`.
  - Appends immutable log entry: `[TIMESTAMP] COORDINATOR_ASSIGN: Shallow Jet-Boat 01 assigned to NG-101`.
- **Acceptance Criteria:**
  - No dispatch executes without button click; assignment updates status and appends audit log.

---

## Milestone 8: Disaster Timeline Scrubber (Tier 1)

### [x] Task T8.1: Interactive Disaster Timeline Scrubber Component
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T2.2
- **Files to create/edit:**
  - `src/components/timeline/TimelineScrubber.tsx`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 6.1
  - [`DESIGN.md`](./DESIGN.md)
- **Implementation Details:**
  - 4-phase horizontal scrubber bar:
    - `T-0 Early Warning` (Wall Clock: `04:30`)
    - `T+3 Flood Surge` (Wall Clock: `07:30`)
    - `T+6 Grid Blackout` (Wall Clock: `10:30`)
    - `T+12 Peak Crisis` (Wall Clock: `16:30`)
  - Displays environmental gauge levels and active scenario badges.
  - Updates `timelinePhase` and `simulationClock` in store.
- **Acceptance Criteria:**
  - Clicking any phase updates active state and displays corresponding wall clock.

---

### [x] Task T8.2: Dynamic Telemetry & Visibility Filter Integration
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T8.1, T6.2
- **Files to create/edit:**
  - `src/store/useAppStore.ts`
  - `src/components/timeline/TimelineScrubber.tsx`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 6.2, 6.3, 7
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 1.4
- **Implementation Details:**
  - Filter visible incidents: `incident.timestamp <= simulationClock`.
  - Trigger telemetry events on phase transitions:
    - At $T+6$: `Tower-Alpha-3` collapses $\to$ triggers blind spot detector $\to$ synthesizes `NG-103`.
    - At $T+12$: `SHL-03` loses power generator.
- **Acceptance Criteria:**
  - Advancing from T-0 to T+3 reveals `NG-101`, `NG-111`, `NG-104`; advancing to T+6 reveals `NG-102`, `NG-103`, `NG-108`, `NG-109`, `NG-110`.

---

## Milestone 9: Tier 1 Hardening & Production Deploy (Tier 1)

### [x] Task T9.1: Acceptance Test Suite Verification
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** All previous Tier 1 tasks (M0–M8)
- **Files to create/edit:**
  - `tests/acceptance.test.ts`
- **Read First:**
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Tests 1.1 to 1.9
- **Implementation Details:**
  - Run full programmatic verification covering all 9 Tier 1 acceptance tests.
  - Verify zero math regressions, zero styling regressions, zero console errors.
- **Acceptance Criteria:**
  - All Tier 1 acceptance tests pass 100% in Vitest.

---

### [x] Task T9.2: Production Build & Vercel Live Deployment
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T9.1
- **Files to create/edit:**
  - Project build artifacts
- **Read First:**
  - [`docs/rules.md`](./docs/rules.md) Milestone 4
- **Implementation Details:**
  - Execute `npm run build` and `npm run lint`.
  - Push to GitHub `main` branch.
  - Verify live deployment on Vercel preview/production domain.
- **Acceptance Criteria:**
  - Production build succeeds; live Vercel URL is functional with 0 runtime console errors.

---

### [x] Task T9.3: Tier 1 Code Freeze & Cut-Line Sign-Off
- **Tier:** Tier 1 (Launch Blocker)
- **Dependencies:** T9.2
- **Files to create/edit:**
  - `docs/memory.md`
- **Read First:**
  - [`docs/rules.md`](./docs/rules.md) Cut-Line Rule
- **Implementation Details:**
  - Check current wall clock against cut-line: **18 Oct 12:00 PM (Asia/Karachi)**.
  - If current time is past 18 Oct 12:00 PM: declare Tier 1 code freeze, drop all Tier 2 features, proceed directly to Milestone 13.
  - If current time is before 18 Oct 12:00 PM: authorize Tier 2 implementation.
- **Acceptance Criteria:**
  - Documented sign-off in `docs/memory.md`.

---

## 🛑 STRICT CUT-LINE: If past 18 Oct 12:00 PM, STOP HERE and proceed to Milestone 13 🛑

---

## Milestone 10: Shelter Matching & Evacuee Routing (Tier 2)

### [x] Task T10.1: Capability-Based Shelter Matching Engine
- **Tier:** Tier 2 (Post-Tier 1 Extension)
- **Dependencies:** T9.3
- **Files to create/edit:**
  - `src/lib/shelters/shelterMatcher.ts`
  - `src/components/dispatch/ShelterMatchCard.tsx`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 4
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 2.1
- **Implementation Details:**
  - Match destination shelters based on required medical capabilities:
    - Dialysis patients (`NG-101`) route strictly to shelters with `dialysis_support: true` (`SHL-02`).
    - Strictly filter out shelters with occupancy $\ge 95\%$ or power failure (`SHL-03` at T+12).
  - Automatically suggest matched destination in assignment modal.
- **Acceptance Criteria:**
  - Test 2.1 passes: `SHL-02` selected for `NG-101`, `SHL-03` filtered out.

---

### [x] Task T10.2: T-0 Pre-Disaster Staging Recommendations
- **Tier:** Tier 2 (Post-Tier 1 Extension)
- **Dependencies:** T10.1
- **Files to create/edit:**
  - `src/lib/simulation/stagingAdvisor.ts`
  - `src/components/timeline/StagingAlertBadge.tsx`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md) Section 2
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 2.2
- **Implementation Details:**
  - At $T-0$, inspect pre-disaster health registry for Sector 3A (22 isolated elderly, arterial cut at T+3).
  - Display proactive staging pill badge: *"Proactive Staging Recommended: Pre-position Shallow Jet-Boat 01 at High Ground Depot Alpha."*
- **Acceptance Criteria:**
  - Test 2.2 passes: Staging alert displays at T-0 with correct rationale.

---

## Milestone 11: Bilingual Voice Distress Hotline (Tier 2)

### [x] Task T11.1: Web Audio Waveform Player Component
- **Tier:** Tier 2 (Post-Tier 1 Extension)
- **Dependencies:** T9.3
- **Files to create/edit:**
  - `src/components/voice/VoiceDistressPlayer.tsx`
- **Read First:**
  - [`DESIGN.md`](./DESIGN.md)
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 2.3
- **Implementation Details:**
  - Web Audio API canvas visualizer displaying simulated audio waveform.
  - Play / Pause controls with playback scrubbing.
  - Bilingual transcript pane rendering Urdu text in `dir="rtl"` alongside English translation.
- **Acceptance Criteria:**
  - Audio waveform animates smoothly; Urdu and English text render with high typography contrast.

---

### [x] Task T11.2: Speech-to-Text Integration & Simulated Audio Fallback
- **Tier:** Tier 2 (Post-Tier 1 Extension)
- **Dependencies:** T11.1
- **Files to create/edit:**
  - `src/app/api/ai/transcribe/route.ts`
  - `src/lib/ai/audioFallback.ts`
- **Read First:**
  - [`docs/ai-prompts.md`](./docs/ai-prompts.md) Section 3, 4.3
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 2.3
- **Implementation Details:**
  - API route proxying audio to Gemini multimodal STT.
  - Fallback attaches pre-verified static transcript and injects badge:  
    **`Scripted transcript for simulated call`**.
  - Feeds extracted facts into incident generator (`NG-102`, Score 81.0, Critical).
- **Acceptance Criteria:**
  - Test 2.3 passes: Voice call generates incident `NG-102` with honest provenance badge.

---

## Milestone 12: PWA Offline Queue & FCFS Comparison (Tier 2)

### [ ] Task T12.1: PWA Manifest & Service Worker Offline Submission Queue
- **Tier:** Tier 2 (Post-Tier 1 Extension)
- **Dependencies:** T9.3
- **Files to create/edit:**
  - `public/manifest.json`
  - `src/lib/pwa/serviceWorkerRegistration.ts`
  - `src/lib/pwa/offlineQueue.ts`
- **Read First:**
  - [`docs/acceptance-tests.md`](./docs/acceptance-tests.md) Test 2.4
- **Implementation Details:**
  - Add PWA manifest with dark theme metadata and icons.
  - Service worker caching application shell.
  - Offline report queue intercepting submissions when `navigator.onLine === false`.
  - Auto-syncs queue and updates dashboard when connectivity returns.
- **Acceptance Criteria:**
  - Test 2.4 passes: Submissions in offline mode queue locally and sync on reconnect.

---

### [ ] Task T12.2: "FCFS vs. Nigehbaan" Retrospective Dashboard Panel
- **Tier:** Tier 2 (Post-Tier 1 Extension)
- **Dependencies:** T9.3
- **Files to create/edit:**
  - `src/components/analytics/FcfsComparisonPanel.tsx`
- **Read First:**
  - [`docs/seed-data.md`](./docs/seed-data.md)
  - [`docs/trade-offs.md`](./docs/trade-offs.md)
- **Implementation Details:**
  - Retrospective summary comparison available at $T+12$:
    - Naive First-Come First-Served: Prioritizes minor property damage (`NG-107`) over silent dialysis patients (`NG-101`).
    - Nigehbaan Triage: Critical priorities addressed first, blind-spot recon sweeps executed.
    - Metrics: simulated comparison: minutes to first assignment, FCFS vs score-based.
- **Acceptance Criteria:**
  - Clear visual comparison showing simulated comparison: minutes to first assignment, FCFS vs score-based.

---

## Milestone 13: Final Submission & Video Walkthrough

### [ ] Task T13.1: 3-Minute Walkthrough Video Recording
- **Tier:** Tier 1 / Tier 2 Finalization
- **Dependencies:** T9.2 (or T12.2 if Tier 2 completed)
- **Files to create/edit:**
  - `docs/demo-script.md`
- **Read First:**
  - [`docs/demo-script.md`](./docs/demo-script.md)
- **Implementation Details:**
  - Record crisp 3-minute video walkthrough following `docs/demo-script.md` step-by-step:
    - 0:00–0:30 HUD overview
    - 0:30–1:00 Scorer + Explainability card
    - 1:00–1:30 Uncertainty Radar (conflicts & missing locations)
    - 1:30–2:15 Sector 3A blind spot synthesis (NG-103)
    - 2:15–2:45 Opportunity cost warning (+35 min delay) & approval
    - 2:45–3:00 Honest fallback & 1-click reset
  - Upload video to YouTube / Loom / Drive as an unlisted link.
- **Acceptance Criteria:**
  - Video length is under 3 minutes, audio is crisp, all key innovations demonstrated.

---

### [ ] Task T13.2: Submission Checklist Compliance & Portal Submission
- **Tier:** Tier 1 / Tier 2 Finalization
- **Dependencies:** T13.1
- **Files to create/edit:**
  - `docs/submission-checklist.md`
  - `README.md`
- **Read First:**
  - [`docs/submission-checklist.md`](./docs/submission-checklist.md)
  - [`AGENTS.md`](./AGENTS.md)
- **Implementation Details:**
  - Verify all checklist items in `docs/submission-checklist.md`.
  - Confirm public visibility of GitHub repository.
  - Confirm live Vercel URL.
  - Final commit and push before **6:00 PM on 18 October 2026** (hard deadline 10:00 PM).
- **Acceptance Criteria:**
  - Submission submitted on hackathon portal with zero missing requirements.
