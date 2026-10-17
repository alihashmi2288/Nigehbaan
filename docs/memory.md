# Nigehbaan --- Project Memory & Session Handoff Tracker

> **Living Document:** This file tracks the continuous architectural decisions, verified milestones, and handoff state for AI coding agents and team members.  
> **Rule:** Update this file at the end of every implementation session before switching tasks or tools. Keep it strictly factual: distinguish completed work from planned work.

---

## 1. Project Identity & Team Information

- **Project Title:** Nigehbaan (نگہبان)
- **Tagline:** *"Nigehbaan finds the people the system can't hear."*
- **Event:** CODE//CONNECT'26 --- 36-Hour Vibe Coding Hackathon
- **Problem Statement:** Problem 01 --- Disaster Response & Emergency Coordination
- **Team Name:** `Byte Alpha's`
- **Team Members:**
  1. **Syed Ali Hashmi** (Team Leader) --- Roll No: `EB-24210106108` | 3rd Year BSSE (UBIT, University of Karachi)
  2. **Syed Umer Hashmi** --- Roll No: `EB-25210006105` | 2nd Year BSCS (UBIT, University of Karachi)
- **Repository URL:** `https://github.com/alihashmi2288/Nigehbaan.git`
- **Deployment URL:** `https://nigehbaan.vercel.app` *(Target Vercel URL — TBD until deployed)*
- **Data Classification:** All demo telemetry, incidents, and citizen calls are clearly labelled `SIMULATED DATA`.
- **Strict Hackathon Cutoff:** **10:00 PM on 18 October 2026 (Asia/Karachi)**. Any Git commit after this timestamp results in disqualification. Target code freeze is **6:00 PM on 18 October 2026**.

---

## 2. Definitive Decisions Log (D1 – D7)

The following architectural and product decisions were formally established and applied across all repository specifications:

- **D1. Scoring Scale & Categories:**
  - Individual triage factors are rated 0.0 to 5.0. Final priority score is mapped to a standard **0.0 to 100.0** scale:
    $$\text{Score} = 100 \times \sum_{i=1}^5 \left(w_i \cdot \frac{f_i}{5.0}\right)$$
    *(Weights: LifeThreat 0.30, MedicalUrgency 0.25, EvacuationInability 0.20, EnvironmentalDanger 0.15, Population 0.10)*
  - Thresholds: **Critical ($\ge 75.0$)**, **High ($55.0 - 74.9$)**, **Moderate ($35.0 - 54.9$)**, **Low ($< 35.0$)**.
  - All legacy "3.9"-style scores in earlier drafts were replaced with standardized 0–100 scores.

- **D2. Unknown Factor Renormalization:**
  - Missing factors are **never** treated as 0 (which would falsely reduce risk).
  - Scores are calculated over known factors with weights renormalized:
    $$\text{Score} = 100 \times \frac{\sum_{\text{known}} (w_i \cdot f_i / 5.0)}{\sum_{\text{known}} w_i}$$
  - The UI presents *"N of 5 factors unknown"* and keeps the information confidence metric separate from urgency. Low confidence triggers an Uncertainty Radar review flag, never deprioritizing the victim.

- **D3. Vulnerability Floors & Blind Spots:**
  - If `communication_status == 'no_phone'`, Evacuation Inability is enforced at $\ge 4.0$.
  - A `system_blind_spot` incident (a monitored sector with zero communications during rising floodwaters) receives Evacuation Inability $= 4.0$, Environmental Danger from the sector gauge ($4.0 - 5.0$), and an enforced **Minimum Total Score of 60.0 (High)** labeled *"Physical Welfare Recon / Field Sweep"*.
  - A blind spot is never auto-Critical (because no individual casualty is confirmed), but is guaranteed to rank above confirmed Moderate incidents.

- **D4. Client State Store & Zero-Dependency Vercel Deployment:**
  - Removed Supabase from the primary runtime path (retained only as a conceptual future adapter).
  - All scoring, uncertainty, resource allocation, opportunity cost, and simulation engines are pure TypeScript modules in `src/lib/`.
  - Application state lives in a reactive client-side store (Zustand or React Context) backed by `localStorage` persistence, pre-warmed with the District Alpha seed dataset.
  - Serverless API routes (`/api/ai/*`) are strictly stateless proxy helpers for Gemini extraction and speech-to-text.
  - 1-click Reset button completely restores pristine baseline seed data in `localStorage`.

- **D5. Transparent AI Fallback Policy:**
  - When the Gemini API key is missing or calls fail, text extraction falls back to a deterministic rule-based extractor, and the UI displays **"Offline heuristic extraction (not AI)"**.
  - For simulated voice calls, the fallback is a scripted transcript attached to the audio asset, and the UI displays **"Scripted transcript for simulated call"**.
  - Fallbacks are never disguised as live AI.

- **D6. Disciplined 3-Tier Scope Matrix:**
  - **Tier 1 (Core Essentials — Demo Fails Without It):** Dashboard shell + map + incident queue; deterministic 5-factor scorer with explainability cards and unit tests; report intake form with extraction (AI or labeled heuristic fallback); Uncertainty Radar (missing location, stale >60m, conflicting reports, coverage blind spot); resource suitability matching + opportunity cost warning (+35 min delay) + human approval + audit log; timeline scrubber ($T-0, T+3, T+6, T+12$) with blind-spot synthesis; 1-click reset; public Vercel deployment.
  - **Tier 2 (Post-Tier 1 Extensions):** Shelter capacity and capability matching; T-0 pre-disaster baseline staging; Urdu/English bilingual voice distress player with waveform; Community Proxy intake mode; installable PWA with offline submission queue; "FCFS vs. Nigehbaan" comparative impact panel.
  - **Tier 3 (Cut / Non-Goals):** Complex What-If routing sandbox, automated duplicate merging, multi-tenant authentication, external Supabase database, local drafts, settings page, and turn-by-turn boat GPS navigation.

- **D7. Core Differentiator & Pitch:**
  - Headline: *"Nigehbaan finds the people the system can't hear."*
  - The Uncertainty Radar and silent-sector blind-spot synthesis are the central competitive differentiators.

- **D8. Mathematical Determinism of Seed Data:**
  - All 12 seed incident scores are strictly derived from the 5-factor mathematical formula:
    $$\text{Score} = 100 \times \frac{\sum_{\text{known}} (w_i \cdot f_i / 5.0)}{\sum_{\text{known}} w_i}$$
  - Removed manual fudge factor in `scoring-spec.md` Example 5 (`Adjusted Baseline: 41.0` replaced with true calculation for `NG-105` = 39.5).
  - All 12 scores in `seed-data.md` corrected and verified: `NG-101` 86.5, `NG-102` 81.0, `NG-103` 68.7, `NG-104` 56.5, `NG-105` 39.5, `NG-106` 17.0, `NG-107` 5.0, `NG-108` 11.0, `NG-109` 50.0, `NG-110` 59.5, `NG-111` 67.5, `NG-112` 60.0.

- **D9. Scarcity & Opportunity Cost Geographic Alignment:**
  - `RES-01` (Shallow Jet-Boat 01) is stationed in Sector 2 (the only shallow boat in Sector 2); `RES-02` (Shallow Jet-Boat 02) is stationed in Sector 3A. Shallow-draft assets are sector-bound by launch ramp bathymetry.
  - When `RES-01` is assigned to `NG-101` in Sector 2, 0 shallow boats remain in Sector 2, triggering a deterministic $+35\text{ min}$ turnaround delay warning for the next queued Sector 2 incident `NG-104` (Score 56.5).
  - All cross-file references ("Sector 3", "[Score 78]") purged and aligned to Sector 2 / `NG-104` (Score 56.5).

- **D10. Simulation Clock & Telemetry Progression:**
  - Defined scenario wall clock: $T-0 = 04:30$, $T+3 = 07:30$, $T+6 = 10:30$, $T+12 = 16:30$.
  - Tower-Alpha-3 collapses at 08:55. At $T+6$ (10:30), Sector 3A silence reaches 110 min ($\ge 90$ min threshold) with rising flood gauge ($1.9\text{m}$), deterministically triggering `COVERAGE_BLIND_SPOT` synthesis for `NG-103`.

- **D11. Machine-Readable Seed & Automated Verifier:**
  - Created `src/lib/simulation/seed.json` as the runtime and documentation single source of truth.
  - Built `scripts/verify-docs.mjs` verifying all 12 scores against the formula with 100% precision.

- **D12. AI Safety Invariants & Untrusted Citizen Input:**
  - Citizen report text is strictly untrusted data: wrapped in `<citizen_report>` tags with explicit anti-injection instructions.
  - Serverless output is validated with Zod against `ExtractedFactsSchema` (clamping depth 0.0–10.0m, headcount 1–500). Any validation failure rejects the LLM output and triggers deterministic heuristic fallback parser.
  - Coordinates are null unless explicit numeric lat/long is given; sector hints are derived strictly from known landmarks.
  - Heuristic fallback regexes use word boundaries (`\b`) and case-insensitivity (`/i`).
  - System prompt dynamically resolves model name from `process.env.GEMINI_MODEL || 'gemini-2.5-flash'`.

- **D13. Strict Hackathon Cut-Line Rule:**
  - If Tier 1 is not deployed on Vercel by **18 Oct 12:00 PM (Asia/Karachi)** (10 hours before the final deadline), drop all Tier 2 features immediately and focus 100% on Tier 1 polish, demo video recording, and submission compliance.
  - The 3-minute pitch walkthrough script in `docs/demo-script.md` is 100% Tier-1-only so the demo succeeds regardless of whether Tier 2 is built.

---

## 3. Contradictions Identified & Resolved

1. **Scoring Scale Contradiction:** [README.md](file:///c:/Users/umerh/Desktop/Nigehbaan/README.md) previously cited `[Score 3.9]`, while [PRD.md](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/PRD.md) had a formula yielding 0–100.  
   *Resolution:* Standardized on 0.0 to 100.0 scale across all files; updated factor inputs to 0.0–5.0; created detailed lookup tables in [`docs/scoring-spec.md`](./docs/scoring-spec.md).
2. **Missing Factor Penalization:** Previously, missing factor values were undefined or treated as 0 risk.  
   *Resolution:* Implemented formal weight renormalization over known factors; decoupled urgency from information confidence.
3. **Blind Spot Urgency Ambiguity:** Docs ambiguously described blind spots as "automatic high baseline" vs "$4.0/5.0$ vulnerability floor".  
   *Resolution:* Standardized on $f_3 = 4.0$ floor, flood gauge hazard floor, and an enforced minimum priority score of $60.0$ (High priority, "Physical Welfare Recon / Field Sweep", never auto-Critical).
4. **Database & Persistence Ambiguity:** Docs simultaneously referenced Supabase migrations and zero-dependency in-memory persistence, but Next.js serverless routes do not share memory across instances.  
   *Resolution:* Cut Supabase from the runtime path; moved state to client-side reactive store with `localStorage` persistence, reserving serverless routes exclusively for stateless AI proxying.
5. **AI Fallback Honesty vs Overclaiming:** README claimed pre-warmed fallback but implied live AI everywhere.  
   *Resolution:* Mandated explicit UI badges: *"Offline heuristic extraction (not AI)"* and *"Scripted transcript for simulated call"*.
6. **Feature Prioritization (Must/Should/Could Bloat):** Earlier PRD drafts marked 25 separate complex features as "Must".  
   *Resolution:* Reorganized all requirements into strict Tier 1 (launch blockers), Tier 2 (post-Tier 1 stretch), and Tier 3 (explicit cuts).
7. **SaaS Template Remnants in `DESIGN.md`:** [DESIGN.md](file:///c:/Users/umerh/Desktop/Nigehbaan/DESIGN.md) contained leftover SaaS marketing components (pricing cards, pricing tabs, testimonials, partner logos).  
   *Resolution:* Stripped all SaaS junk; retained strictly operational crisis components, added WCAG AA contrast validation, and integrated Urdu RTL specifications.
8. **Geographic Inconsistency in Opportunity Cost Scenario:** Earlier files claimed RES-01 was in Sector 3 or warned about Sector 3, whereas NG-101 and NG-104 are in Sector 2.  
   *Resolution:* Re-stationed RES-01 to Sector 2 and RES-02 to Sector 3A. Because shallow boats are sector-bound by bathymetry, assigning RES-01 leaves 0 boats in Sector 2, cleanly producing the +35 min delay warning for NG-104 (Score 56.5).

---

## 4. Authoritative Implementation Roadmap & Backlog

See [`TASKS.md`](./TASKS.md) for the complete, atomic 35-task implementation checklist.

- **Current Active Milestone:** **Milestone 3 --- GIS Map & Sector Polygons (Tier 1)**
- **Completed Milestones:**
  - **Milestone 0 --- Bootstrap & Project Setup** (Tasks T0.1, T0.2, T0.3, T0.4 verified)
  - **Milestone 1 --- Deterministic Scoring Engine & Tests** (Tasks T1.1, T1.2, T1.3, T1.4 verified)
  - **Milestone 2 --- State Store & Seed Data** (Tasks T2.1, T2.2, T2.3 verified)
- **Next Smallest Coding Task:** **`T3.1`** (Leaflet GIS Map Container & Dark Matter Tiles).

---

## 5. Granular Session Changelog

### Session --- 2026-10-17 15:20 PKT (Documentation Overhaul Pass)
- Comprehensive Documentation Alignment & Specification Authoring across all repo specs.

### Session --- 2026-10-17 16:25 PKT (Mathematical Audit & Seed Synchronization Pass)
- Audited all 12 incident scores; generated `seed.json` and `verify-docs.mjs` (12/12 pass); aligned opportunity cost geography.

### Session --- 2026-10-17 16:40 PKT (Safety, Timeline Clock, & TASKS.md Backlog Pass)
- **Phase/Task:** Prompt Safety Invariants, Simulation Clock, 100% Tier-1 Demo Script, and TASKS.md Creation.
- **Accomplishments:**
  - Enriched `docs/seed-data.md` with Section 6 Simulation Clock (wall clock hours 04:30 to 16:30), Tower-Alpha-3 collapse timing (08:55), and sector-bound shallow boat rationale.
  - Updated `docs/ai-prompts.md` with untrusted `<citizen_report>` containment, anti-injection directives, Zod depth/headcount bounds, word-boundary regexes, and dynamic model configuration (`GEMINI_MODEL`).
  - Added strict Hackathon Cut-Line Rule (18 Oct 12:00 PM) to `docs/rules.md` and `AGENTS.md`.
  - Refined `docs/demo-script.md` to be 100% Tier-1-only resilient, clearly separating Tier 2 extensions.
  - Authored `TASKS.md` containing 35 atomic, dependency-tracked tasks across all milestones with strict acceptance criteria.

### Session --- 2026-10-17 17:10 PKT (Milestone 0: Bootstrap & Project Setup)
- **Phase/Task:** Milestone 0 (Tasks T0.1, T0.2, T0.3, T0.4)
- **Accomplishments:**
  - **T0.1 (Next.js Skeleton):** Created `package.json`, `tsconfig.json` (strict mode, `@/*` paths), `next.config.mjs`, `src/app/layout.tsx` (with official metadata, dark class, and title `Nigehbaan (نگہبان) --- Tactical Disaster Triage`), and `src/app/page.tsx`.
  - **T0.2 (Tailwind Tokens):** Created `tailwind.config.ts`, `postcss.config.mjs`, and `src/app/globals.css` with exact `DESIGN.md` tokens (Canvas `#010102`, Surfaces `#0f1011`–`#191a1b`, Hairlines `#23252a`–`#3e3e44`, Brand `#5e6ad2`, and all Crisis Semantics: Critical, Warning, Blind-Spot, Success, Unknown).
  - **T0.3 (Vitest Runner):** Created `vitest.config.ts`, added `"test": "vitest run"` to `package.json`, and added `tests/sanity.test.ts`. Verified with `npm test`: 4/4 tests passed with 0 failures.
  - **T0.4 (Build & Vercel Prep):** Verified production build with `npm run build`: zero errors, zero warnings, static page prerendering clean. Added `.gitignore` for node, Next.js, and Vitest artifacts. Formulated manual Vercel deployment guide.

### Session --- 2026-10-17 17:35 PKT (Milestone 1: Deterministic Scoring Engine & Tests)
- **Phase/Task:** Milestone 1 (Tasks T1.1, T1.2, T1.3, T1.4)
- **Accomplishments:**
  - Installed `zod` dependency.
  - **T1.1 (Core TypeScript Types & Zod Schemas):** Created `src/types/incident.ts`, `src/types/resource.ts`, `src/types/shelter.ts`, `src/types/simulation.ts`, and `src/types/index.ts` with complete data models and strict Zod runtime schemas (including `ExtractedFactsSchema` with depth/headcount clamping).
  - **T1.2 (5-Factor MCDA Scoring Engine):** Created `src/lib/triage/scoringEngine.ts` implementing deterministic MCDA formula `Score = 100 * sum(w_i * f_i / 5.0) / sum(w_i)`, unknown factor weight renormalization, vulnerability floors (`no_phone` enforces $f_3 \ge 4.0$, `system_blind_spot` enforces $\min(\text{score}) \ge 60.0$, category High, never auto-Critical), factor contribution breakdowns, and discrete lookup helpers.
  - **T1.3 (Queue Ranker & Tie-Breaker):** Created `src/lib/triage/queueRanker.ts` implementing 3-tier deterministic sorting: Primary (score descending), Secondary Tie-Break within $\pm 0.1$ (Confidence Inversion: lower confidence ranks higher to surface high uncertainty), and Tertiary Tie-Break (FIFO earlier timestamp).
  - **T1.4 (Automated Unit Tests):** Created `tests/scoring.test.ts` covering all 12 District Alpha seed incidents, Acceptance Tests 1.1, 1.2, 1.2b, 1.3, 1.4, tie-break confidence inversion, factor lookups, and Zod bounds. Verified with `npm test` (19/19 tests green in 2 files), `node scripts/verify-docs.mjs` (12/12 pass), and `npm run build` (clean compilation, 0 warnings/errors).

### Session --- 2026-10-17 17:45 PKT (Milestone 2: State Store & Seed Data)
- **Phase/Task:** Milestone 2 (Tasks T2.1, T2.2, T2.3)
- **Accomplishments:**
  - Installed `zustand` (`^5.0.15`) dependency.
  - **T2.1 (Seed Data Loader & Scenario Normalizer):** Created `src/lib/simulation/seedLoader.ts` loading and validating `seed.json` with Zod schemas (`IncidentSchema`, `ResourceSchema`, `ShelterSchema`, `SectorSchema`, `ScenarioSchema`), calculating deterministic MCDA scores, confidence, and categories, and exporting typed getters (`getPristineIncidents`, `getPristineResources`, `getPristineShelters`, `getPristineSectors`, `getPristineScenario`, `getPristineState`).
  - **T2.2 (Reactive Client State Store with LocalStorage Persistence):** Created `src/store/useAppStore.ts` and `src/store/index.ts` with Zustand and `persist` middleware (`nigehbaan-state-v1`), safe storage fallbacks for SSR/node test environments, and reactive actions (`assignResource`, `unassignResource`, `submitIncident`, `setTimelinePhase`, `updateIncident`, `updateResource`). Strict adherence to Acceptance Test 1.6 (`[TIMESTAMP] COORDINATOR_ASSIGN: Shallow Jet-Boat 01 assigned to NG-101`). Added phase-based visibility selectors (`selectVisibleIncidents`, `selectRankedVisibleIncidents`).
  - **T2.3 (1-Click Simulation Reset Function & Activity Log):** Implemented synchronous `resetSimulation()` restoring pristine baseline seed data in <10ms, resetting timeline to `T-0`, clearing dirty assignments, and logging audit entries. Created `src/components/layout/ResetButton.tsx` and `src/components/layout/index.ts` styled with `DESIGN.md` tokens, mounted in `src/app/page.tsx` tactical HUD.
  - **Unit & Integration Tests:** Created `tests/stateStore.test.ts` with 12 comprehensive tests covering T2.1, T2.2, and T2.3.
  - **Verification:** Ran `npm test` (31/31 assertions green across 3 test files), and `npm run build` (clean Next.js production build, 0 warnings/errors).
- **Next Smallest Coding Task:**
  - Task **`T3.1`** (Leaflet GIS Map Container & Dark Matter Tiles).




