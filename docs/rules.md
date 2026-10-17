# Nigehbaan --- Agent Rules, Engineering Standards, and Milestones

This file is the authoritative implementation contract for any AI coding agent or team member working on Nigehbaan. Read it before making any changes.

---

## 1. Product & Domain Invariants

1. **Problem 01 Focus:** Build Nigehbaan for **Problem 01 --- Disaster Response & Emergency Coordination** using flood emergency as the primary operational scenario.
2. **Core Differentiator:** The **Uncertainty Radar** and **Sector Blind-Spot Detection** are the primary unique value propositions: detecting the people the system cannot hear.
3. **Operational Decision-Support Only:** The system *recommends* resources and matched shelters; an explicit human coordinator approval is required before any asset is marked assigned. **No autonomous dispatch.**
4. **No Medical Diagnoses:** Triage scores are operational urgency indicators for logistics and evacuation, never clinical diagnoses.
5. **Simulated Data Integrity:** All incidents, caller identities, phone numbers, and coordinates are clearly labelled `SIMULATED DATA`. Real individuals' distress calls or private details must never be used.

---

## 2. Mathematical Scoring & Uncertainty Rules (D1, D2, D3)

1. **Deterministic 0–100 Priority Scale:** Priority is calculated strictly via the 5-factor Multi-Criteria Decision Analysis (MCDA) formula in pure TypeScript (`src/lib/triage/scoringEngine.ts`). The LLM must **never** compute scores or assign priorities directly:
   $$\text{Score} = 100 \times \sum_{i=1}^5 \left(w_i \cdot \frac{\text{factor}_i}{5}\right)$$
   *(Weights: LifeThreat 0.30, MedicalUrgency 0.25, EvacuationInability 0.20, EnvironmentalDanger 0.15, Population 0.10)*
2. **Priority Categories:** Critical ($\ge 75.0$), High ($55.0 - 74.9$), Moderate ($35.0 - 54.9$), Low ($< 35.0$).
3. **Unknown Factor Renormalization (D2):** An unknown factor is **never** treated as 0 (which would falsely reduce risk). Missing factors are omitted and known factor weights are renormalized:
   $$\text{Score} = 100 \times \frac{\sum_{i \in \text{known}} \left(w_i \cdot \frac{\text{factor}_i}{5}\right)}{\sum_{i \in \text{known}} w_i}$$
   The UI must explicitly display *"N of 5 factors unknown"* alongside a separate information confidence metric. Low confidence triggers review; it must **never** lower urgency.
4. **Vulnerability Floor for No-Phone Victims (D3):** If `communication_status == 'no_phone'`, Evacuation Inability is enforced at $\ge 4.0$.
5. **Blind-Spot Sector Floor (D3):** When a monitored sector exhibits complete silence during rising floodwaters, the synthesized incident (`reporter_type == 'system_blind_spot'`):
   - Sets Evacuation Inability $= 4.0$.
   - Sets Environmental Danger from sector flood level ($4.0 - 5.0$).
   - Sets an enforced **Minimum Total Score of 60.0 (High)**.
   - Is labeled *"Physical Welfare Recon / Field Sweep"*.
   - Is **never** auto-Critical (because no individual is confirmed yet), but ranks above Moderate confirmed incidents and below confirmed Critical emergencies.
6. **Deterministic Opportunity Cost:** Asset scarcity and turnaround queue delay penalties ($\Delta t$) must be calculated via deterministic arithmetic heuristics (`src/lib/resources/opportunityCost.ts`), never guessed by an LLM.

---

## 3. Architecture & State Persistence Rules (D4, D5)

1. **Client-Side Reactive State Store:** Active state lives in a client-side store (Zustand or React Context) backed by `localStorage` persistence, pre-warmed with the District Alpha scenario. Never rely on server-side global memory on Vercel.
2. **Stateless API Helpers:** Serverless Next.js API routes (`/api/ai/*`) are strictly stateless proxy handlers for Gemini extraction and speech-to-text.
3. **Honest AI Fallback Labeling (D5):**
   - When Gemini API key is missing or calls fail, text extraction falls back to a deterministic rule-based extractor, and the UI displays **"Offline heuristic extraction (not AI)"**.
   - For simulated voice calls, fallback is a scripted transcript attached to the audio asset, and the UI displays **"Scripted transcript for simulated call"**.
   - **Never disguise fallbacks as live AI.**
4. **Instant Reset:** The dashboard must include a 1-click Reset button that completely restores the pristine baseline seed data in `localStorage`.

---

## 4. Design & Accessibility Standards

1. **Adhere to `DESIGN.md`:** Deep black operational canvas (`#010102`), hairline borders (`#23252a`), surface levels (`#0f1011`), and crisp semantic badges.
2. **No Neon / Flashing Decorations:** No flashing sirens, rainbow charts, or distracting hero animations. High information density is paramount.
3. **Accessibility (WCAG AA):**
   - High text contrast on `#010102`.
   - Never communicate status by color alone; always pair with text/icons.
   - Visible keyboard focus rings (`#5e6ad2`).
   - RTL and Urdu script support for bilingual voice transcripts (`dir="rtl"`).

---

## 5. Scope Tier Roadmap & Milestones (D6)

```text
TIER 1 (Launch Blockers)  --->  TIER 2 (Post-Tier 1 Extensions)  --->  TIER 3 (Cut / Non-Goals)
Must work & be deployed         Build only after Tier 1 deployed        Deliberately cut
```

### Milestone 0 --- Skeleton & Vercel Pipeline (Target: Hours 0–3)
- Initialize Next.js 14/15 App Router with TypeScript (Strict) and Tailwind CSS.
- Configure `DESIGN.md` tokens and layout shell.
- Deploy empty skeleton to Vercel and verify public preview URL.
- *Acceptance:* Vercel URL renders with zero console errors.

### Milestone 1 --- Tier 1 Core: State Store, Scorer & Map (Target: Hours 3–9)
- Implement `useAppStore` with `localStorage` persistence and District Alpha seed data.
- Build pure TypeScript deterministic 5-factor scoring engine with unit tests (`scoring.test.ts`).
- Build interactive Leaflet GIS map with incident markers, resource bases, and sector polygons.
- Build filterable priority incident queue.
- *Acceptance:* Incidents render sorted by 0–100 score; unit tests pass with 100% deterministic outputs.

### Milestone 2 --- Tier 1 Core: Ingestion & Uncertainty Radar (Target: Hours 9–15)
- Build emergency report form with Gemini extraction and labeled heuristic fallback.
- Build Uncertainty Radar detector: missing locations, stale claims (>60m), and conflicting road reports.
- Implement sector silence detector synthesizing blind-spot incidents with score $\ge 60$ (High).
- *Acceptance:* Submitting report updates queue; silent sectors synthesize recon incidents; fallback is honestly labeled.

### Milestone 3 --- Tier 1 Core: Opportunity Cost, Timeline & Reset (Target: Hours 15–21)
- Implement resource allocation modal with deterministic Opportunity Cost Warning Card (+35 min delay).
- Build human approval workflow and activity audit log.
- Build interactive Timeline Scrubber ($T-0, T+3, T+6, T+12$) updating water levels, closures, and tower blackouts.
- Build 1-click simulation reset button.
- *Acceptance:* Scrubbing timeline dynamically drops cell towers and triggers blind spots; approving dispatch updates resource states; reset button restores baseline.

### Milestone 4 --- Tier 1 Hardening & Public Deploy Verification (Target: Hours 21–24)
- End-to-end browser walkthrough of all Tier 1 features on public Vercel URL.
- Fix all lint, TypeScript, and responsive styling issues.
- *Acceptance:* Public demo passes all Tier 1 acceptance tests with zero failures.

---

> [!CAUTION]
> **Strict Hackathon Cut-Line Rule:**  
> If Tier 1 is not deployed on Vercel by **18 Oct 12:00 PM (Asia/Karachi)** (10 hours before the final deadline), **drop all Tier 2 features** immediately. Spend the remaining time polishing Tier 1, recording the demo video, and packaging the submission. Never risk an incomplete Tier 2 deploy jeopardizing a rock-solid Tier 1 submission.

*(Only proceed to Tier 2 if Milestone 4 is 100% verified, deployed, and the clock is before 18 Oct 12:00 PM)*

---

### Milestone 5 --- Tier 2: Shelter Matching & T-0 Staging (Target: Hours 24–28)
- Implement two-stage matching: route evacuees to destination shelters based on bed capacity and dialysis/power capabilities. Auto-filter shelters $>95\%$ full.
- Implement Pre-Disaster Baseline overlay at $T-0$ with proactive staging recommendations.
- *Acceptance:* High-acuity incidents route only to capable shelters; T-0 suggests pre-positioning boats before roads flood.

### Milestone 6 --- Tier 2: Voice Hotline & Community Proxy (Target: Hours 28–31)
- Implement Urdu/English voice distress audio player with interactive waveform visualizer.
- Speech-to-text integration with transcript provenance and honest simulated fallback badge.
- Add Community Proxy intake toggle (`has_phone`, `no_phone`, `network_down`).
- *Acceptance:* Voice playback renders waveform; proxy intake enforces vulnerability floor for `no_phone`.

### Milestone 7 --- Tier 2: PWA Offline Queue & FCFS Comparison (Target: Hours 31–33)
- Add PWA manifest, service worker shell caching, and offline submission queue.
- Add "FCFS vs. Nigehbaan" comparison summary panel on the $T+12$ screen.
- *Acceptance:* App can be installed as PWA; offline submissions queue and sync upon reconnect.

### Milestone 8 --- Final Freeze & Submission Package (Target: Hours 33–36)
- **Target Code Freeze:** **6:00 PM on 18 October 2026 (Asia/Karachi)**.
- **Strict Hard Cutoff:** **No Git commits after 10:00 PM on 18 October 2026** (commits after this timestamp result in disqualification).
- Verify public Vercel URL, GitHub repository accessibility, and required AI disclosures.
- *Acceptance:* Clean repository, working demo, zero blockers.

---

## 6. Coding Agent Workflow Invariants

At the start of every implementation turn:
1. Read `docs/memory.md` to identify the current milestone and smallest next task.
2. Read `docs/scoring-spec.md`, `docs/seed-data.md`, and `docs/acceptance-tests.md` before touching business logic.
3. If documents conflict, **STOP** and log the contradiction in `docs/memory.md`. Never guess.
4. Implement only the active milestone task and its direct dependencies.
5. Verify changes with unit tests and manual browser checks.
6. Log all changed files, tests, and next steps in `docs/memory.md`.
