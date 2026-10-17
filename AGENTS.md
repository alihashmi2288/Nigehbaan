# Nigehbaan (نگہبان) --- AI Agent System Contract

> **MANDATORY INSTRUCTION FOR ALL AI CODING AGENTS (Antigravity, Claude, Gemini, Cursor, Copilot):**  
> Before generating, modifying, or refactoring ANY code in this repository, you **MUST** read and strictly adhere to the non-negotiable rules and reading sequence below.

---

## 1. Required Reading Order (Source of Truth)

Read only your current task in [`TASKS.md`](./TASKS.md) (find it by ID) and the files in its "Read First" list, plus the 10 invariants below. Never read the whole `TASKS.md` or every doc.

Where files disagree:
- **`src/lib/simulation/seed.json`** wins for data and field names.
- **`DESIGN.md`** wins for colors and design tokens.
- **`docs/scoring-spec.md`** wins for mathematical formulas and triage factor lookups.

If you cannot resolve a conflict, **STOP IMMEDIATELY**, do not guess, and log the conflict in `docs/memory.md`.

---

## 2. Non-Negotiable Engineering Rules (The 10 Invariants)

1. **Deterministic Triage (0–100 Scale):** Final priority scores are calculated strictly by the deterministic 5-factor mathematical formula in `src/lib/triage/scoringEngine.ts`. **The LLM must NEVER compute priority scores.**
2. **Renormalize Unknowns (Never Zero):** When factor data is missing, renormalize weights across known factors:
   $$\text{Score} = 100 \times \frac{\sum_{\text{known}} (w_i \cdot f_i / 5)}{\sum_{\text{known}} w_i}$$
   Missing data flags uncertainty; it **never** lowers priority.
3. **Blind-Spot & No-Phone Floors:** If `communication_status == 'no_phone'`, Evacuation Inability is $\ge 4.0$. If a sector goes dark during rising floodwaters, synthesize a `system_blind_spot` incident with an enforced minimum score of **60.0 (High)** labeled *"Physical Welfare Recon / Field Sweep"*. It is never auto-Critical.
4. **Deterministic Opportunity Cost:** Asset scarcity and queue turnaround delay penalties (+35 min) must be computed by deterministic arithmetic (`src/lib/resources/opportunityCost.ts`), never guessed by an LLM.
5. **No Autonomous Dispatch:** The system *recommends* resources and matched shelters; an explicit human coordinator approval is required to assign an asset.
6. **Client-Side State with `localStorage`:** All runtime application state lives in a client-side store (Zustand or React Context) backed by `localStorage` persistence and pre-warmed with the District Alpha scenario. Never rely on server-side global memory.
7. **Stateless AI Helpers with Honest Fallbacks:** Serverless API routes (`/api/ai/*`) are strictly stateless proxy handlers. If Gemini is unavailable, the UI must explicitly display:
   - Text fallback: *"Offline heuristic extraction (not AI)"*
   - Audio fallback: *"Scripted transcript for simulated call"*
   - **Never disguise fallbacks as live AI.**
8. **1-Click Reset:** The UI must include a Reset button that restores the pristine baseline seed data in `localStorage` completely.
9. **Strict Tier Discipline:** Agents must complete and verify Tier 1 entirely before touching Tier 2 features. Tier 3 features (Supabase, Auth, What-If routing sandbox, turn-by-turn navigation) are cut.
10. **Strict Hackathon Deadline & Cut-Line:** All work must be completed and pushed well before **10:00 PM on 18 October 2026 (Asia/Karachi)**. Commits after this timestamp result in disqualification. Target code freeze is **6:00 PM on 18 October 2026**. **Strict Cut-Line:** If Tier 1 is not deployed on Vercel by **18 Oct 12:00 PM**, drop all Tier 2 features and polish Tier 1.

---

## 3. Current Implementation Status

- **Current Tier:** **Milestones 0 through 13 --- Complete & Verified (100% Implementation)**
- **Completed Milestones:**
  - Milestone 0 (T0.1–T0.4): Bootstrap & Project Setup
  - Milestone 1 (T1.1–T1.4): Deterministic Scoring Engine & Tests
  - Milestone 2 (T2.1–T2.3): State Store & Seed Data
  - Milestone 3 (T3.1–T3.4): GIS Map & Sector Polygons
  - Milestone 4 (T4.1–T4.3): Triage Queue & Incident Inspector
  - Milestone 5 (T5.1–T5.4): Emergency Intake & AI Extraction with Heuristic Fallback
  - Milestone 6 (T6.1–T6.3): Uncertainty Radar & Blind-Spot Engine
  - Milestone 7 (T7.1–T7.3): Tactical Opportunity Cost & Human Dispatch
  - Milestone 8 (T8.1–T8.2): Disaster Timeline Scrubber & Dynamic Telemetry
  - Milestone 9 (T9.1–T9.3): Tier 1 Hardening & Production Deploy
  - Milestone 10 (T10.1–T10.2): Capability Shelter Matching & T-0 Proactive Staging
  - Milestone 11 (T11.1–T11.2): Bilingual Voice Hotline with Web Audio Waveform
  - Milestone 12 (T12.1–T12.2): PWA Offline Queue & FCFS Retrospective Panel
  - Milestone 13 (T13.1–T13.2): 3-Minute Walkthrough Video Script & Portal Submission Package
- **Verification Status:**
  - Vitest: 13/13 test files passed, 139/139 tests passed (100% pass rate).
  - TypeScript: `npx tsc --noEmit` exits 0 (clean).
  - ESLint: `npm run lint` exits 0 (0 warnings, 0 errors).
  - Production Build: `npm run build` exits 0 (all 5 pages generated cleanly).
- **Next Smallest Coding Task:** None! All 35 backlog tasks across Milestones 0 to 13 are complete, tested, and verified.
- **Reference:** See [`docs/memory.md`](./docs/memory.md) for full session logs and [`TASKS.md`](./TASKS.md) for task tracking.



