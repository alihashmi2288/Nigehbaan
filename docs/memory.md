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

---

## 4. Current Milestone Status (Milestone 0: Bootstrap)

- [ ] **Milestone 0 --- Skeleton & Vercel Pipeline (Current)**
  - [ ] Initialize Next.js 14/15 App Router with TypeScript (Strict)
  - [ ] Configure Tailwind CSS with `DESIGN.md` tokens
  - [ ] Deploy empty skeleton to Vercel and verify public URL
- [ ] **Milestone 1 --- Tier 1 Core: State Store, Scorer & Map**
- [ ] **Milestone 2 --- Tier 1 Core: Ingestion & Uncertainty Radar**
- [ ] **Milestone 3 --- Tier 1 Core: Opportunity Cost, Timeline & Reset**
- [ ] **Milestone 4 --- Tier 1 Hardening & Public Deploy Verification**
- [ ] **Milestone 5 --- Tier 2: Shelter Matching & T-0 Staging**
- [ ] **Milestone 6 --- Tier 2: Voice Hotline & Community Proxy**
- [ ] **Milestone 7 --- Tier 2: PWA Offline Queue & FCFS Comparison**
- [ ] **Milestone 8 --- Final Freeze & Submission Package**

---

## 5. Granular Session Changelog

### Session --- 2026-10-17 15:20 PKT (Documentation Overhaul Pass)
- **Phase/Task:** Comprehensive Documentation Alignment & Specification Authoring.
- **Changed Files:**
  - [`README.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/README.md) --- Refocused headline to *"Nigehbaan finds the people the system can't hear"*; corrected formula to 0–100 scale; marked live URL as TBD; added team details, AI disclosure, and spec cross-links.
  - [`AGENTS.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/AGENTS.md) --- Shrunk to 1 page max; documented 10 non-negotiable rules, tier discipline, reading order, and conflict handling.
  - [`DESIGN.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/DESIGN.md) --- Stripped all SaaS template junk (pricing cards, testimonials, logos); documented crisis components; added WCAG AA contrast standards and Urdu RTL support; adjusted `ink-tertiary` to `#858a93` for contrast compliance.
  - [`docs/PRD.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/PRD.md) --- Rewrote Scope and FR matrix around Tier 1 / Tier 2 / Tier 3; marked user journeys with tiers; updated Section 8 to 0–100 scale with unknown renormalization and blind-spot floors.
  - [`docs/architecture.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/architecture.md) --- Removed Supabase from runtime path; drew client store + pure TS engines data flow; updated folder structure; specified Tier 2 PWA offline queue.
  - [`docs/rules.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/rules.md) --- Replaced schedule with 9 milestone checklists aligned to tiers; embedded D1–D7 invariants; documented strict 10:00 PM 18 Oct deadline and 6:00 PM code freeze.
  - [`docs/trade-offs.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/trade-offs.md) --- Documented client-store vs DB trade-off, unknown factor renormalization rationale, and explicit "What we cut and why" section for Tier 3.
  - [`docs/memory.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/memory.md) --- Reset to Milestone 0; added Decisions log (D1–D7), contradiction resolutions, milestone checklist, and team metadata.
- **Created Files:**
  - [`docs/scoring-spec.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/scoring-spec.md) --- Factor lookup tables (0–5), MCDA formula (0–100), unknown renormalization math, vulnerability floors, and 6 worked calculation examples.
  - [`docs/seed-data.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/seed-data.md) --- Complete District Alpha dataset: 4 sectors (Karachi bounding polygons), 6 rescue resources, 3 shelters, 12 incidents, pre-disaster baseline, timeline event progression table, and worked opportunity cost example (+35 min).
  - [`docs/acceptance-tests.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/acceptance-tests.md) --- Given/When/Then test criteria for all Tier 1 and Tier 2 features doubling as unit tests.
  - [`docs/ai-prompts.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/ai-prompts.md) --- Exact Gemini extraction prompt, Zod schemas, rationale generation prompt, audio transcription prompt, and keyword heuristic fallback rules.
  - [`docs/demo-script.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/demo-script.md) --- 90-second rapid pitch, 3-minute click-by-click walkthrough script, and contingency fallback plan.
  - [`docs/submission-checklist.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/submission-checklist.md) --- Official team submission metadata, technical stack disclosure, pre-submission verification checklist, and deadline freeze timeline.
- **Assumptions Made for Review:**
  1. *Turnaround cycle time:* Shallow jet-boat turnaround baseline cycle is assumed to be 35 minutes round-trip for Sector 2.
  2. *Karachi bounding coordinates:* Approximate fictional coordinates around 24.89–24.98 N, 67.11–67.19 E (Malir basin) are used for District Alpha map sectors.
  3. *Client Store Implementation:* Assumed Zustand or React Context + localStorage is acceptable for client store management.
  4. *Gemini Model:* Assumed `gemini-2.5-flash` or current stable Gemini model via `@google/genai` is the primary LLM adapter target.
- **Next Smallest Coding Task:**
  - Milestone 0: Initialize Next.js 14/15 skeleton with TypeScript (Strict) and Tailwind CSS using `DESIGN.md` tokens, verify clean build, and deploy empty skeleton to Vercel.

