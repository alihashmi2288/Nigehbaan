# Nigehbaan (نگہبان) --- AI Agent System Contract

> **MANDATORY INSTRUCTION FOR ALL AI CODING AGENTS (Antigravity, Claude, Gemini, Cursor, Copilot):**  
> Before generating, modifying, or refactoring ANY code in this repository, you **MUST** read and strictly adhere to the non-negotiable rules and reading sequence below.

---

## 1. Required Reading Order (Source of Truth)

Read these authoritative specification files before touching code:
1. **[`docs/scoring-spec.md`](./docs/scoring-spec.md)** --- Exact lookup tables, 0–5 factor scoring rules, MCDA formula (0–100 scale), unknown factor renormalization, and blind-spot floors.
2. **[`docs/seed-data.md`](./docs/seed-data.md)** --- District Alpha scenario data: 12 incidents, 6 resources, 3 shelters, 4 sector polygons, and timeline events ($T-0, T+3, T+6, T+12$).
3. **[`docs/acceptance-tests.md`](./docs/acceptance-tests.md)** --- Given/When/Then test criteria for every Tier 1 and Tier 2 feature.
4. **[`DESIGN.md`](./DESIGN.md)** --- Authoritative visual design tokens (`#010102` canvas, `#0f1011` surface, `#5e6ad2` primary, crisis semantic badges), typography, and WCAG AA contrast standards.
5. **[`docs/rules.md`](./docs/rules.md)** --- Engineering standards, milestone checklist, and deadline rules.
6. **[`docs/memory.md`](./docs/memory.md)** --- Living project state, active decisions, and session changelog.
7. **[`TASKS.md`](./TASKS.md)** --- Authoritative atomic task backlog grouped by milestone with dependencies and acceptance criteria.

> **RULE ON CONFLICTS:** If any specification documents conflict, **STOP IMMEDIATELY**, do not guess, and log the conflict in `docs/memory.md`.

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

- **Current Tier:** **Milestone 0 --- Bootstrap & Project Setup**
- **Next Smallest Coding Task:** Follow `TASKS.md` starting at task **`T0.1`** (Initialize Next.js App Router skeleton with TypeScript and Tailwind).
- **Reference:** See [`docs/memory.md`](./docs/memory.md) for full session logs and [`TASKS.md`](./TASKS.md) for task tracking.

