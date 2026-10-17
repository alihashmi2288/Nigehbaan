# Nigehbaan (نگہبان) --- AI Agent Instructions & System Contract

> **MANDATORY INSTRUCTION FOR ALL AI CODING AGENTS (Antigravity, Claude, Gemini, Cursor, Copilot):**  
> Before generating, modifying, or refactoring ANY code in this repository, you **MUST** read and strictly adhere to the project specifications and rules detailed below.

---

## 1. Required Reading Order (Source of Truth)

Before starting any task or implementation phase, read these authoritative documents in sequence:

1. **[`docs/rules.md`](./docs/rules.md)** --- Engineering standards, AI boundaries, deterministic scoring rules, error handling, and the 8-phase milestone checklist.
2. **[`docs/architecture.md`](./docs/architecture.md)** --- Full-stack Next.js App Router architecture, service boundaries, data schemas, API routes, and Vercel resilience design.
3. **[`DESIGN.md`](./DESIGN.md)** --- Authoritative Nigehbaan Design System: exact color tokens (`--canvas: #010102`, `--surface-1: #0f1011`, `--primary: #5e6ad2`, `--critical: #B42318`, `--warning: #92400E`, `--blind-spot: #DB6D28`), typography (Inter/SF Pro Display), and component constraints.
4. **[`docs/PRD.md`](./docs/PRD.md)** --- Product requirements, acceptance criteria, and user journeys (including Community Proxy reporting and Bilingual Voice Hotline).
5. **[`docs/trade-offs.md`](./docs/trade-offs.md)** --- Architectural and product rationale: what was chosen, what was left out, and why.
6. **[`docs/memory.md`](./docs/memory.md)** --- Living project state, active decisions, and session handoff tracker.

---

## 2. Immutable Engineering & Architectural Constraints

Every AI agent must follow these strict technical rules:

### A. Technology Stack & Deployment
- **Framework:** Next.js 14/15 App Router with TypeScript (Strict mode).
- **Styling:** Tailwind CSS using the exact tokens from `DESIGN.md`. Do **NOT** introduce random Tailwind utility colors (e.g. `bg-purple-600`, `bg-red-500`)—always map to Nigehbaan design tokens.
- **Target Deployment:** **Vercel**. Every change must compile cleanly with `npm run build`.
- **Data Persistence Strategy:** The primary runtime data store is a **zero-dependency, resilient In-Memory / Local Storage Repository** pre-warmed with the Sindh/Indus flood scenario (`SIMULATED DATA`). This guarantees 100% demo uptime and sub-millisecond response on Vercel without third-party database latency or migration blockers.

### B. AI Boundaries & Safety Invariants
- **NEVER allow an LLM to generate the final priority score or opportunity cost.** Priority is calculated strictly via the deterministic 5-factor MCDA mathematical formula in `src/lib/triageEngine.ts`. Opportunity cost trade-offs (asset availability and delay penalties to next queued incidents) are calculated via deterministic heuristics in `src/lib/resourceAllocation.ts`.
- **LLM Role:** The Google Gemini API is used *only* for:
  1. Structured fact extraction from unstructured citizen reports.
  2. Bilingual speech-to-text translation (Urdu/English).
  3. Generating human-auditable natural language explainability cards.
- **Resilient Fallback:** All AI services must include automatic heuristic fallbacks so the app operates 100% reliably even if no API key is set on Vercel.
- **NO Autonomous Dispatch:** The system *recommends* resources and matched destination shelters; an explicit human coordinator approval is required to assign an asset.
- **NO Medical Diagnosis:** Triage scores are operational decision-support heuristics, never clinical diagnoses.

### C. The "Invisible Vulnerable" & Uncertainty Radar
- **Decouple Urgency from Confidence:** Missing information must be flagged as uncertain, but must **never** automatically lower an incident's priority.
- **Pre-Disaster Baseline & T-0 Staging:** Community health/demographic baseline data (isolated elderly, chronic illness registry, low-lying informal settlements) is leveraged at `T-0 Early Warning` to recommend proactive staging before infrastructure fails.
- **Sector-to-Incident Synthesis:** When a monitored geographical sector exhibits zero incoming communications during flood conditions, the system raises a `coverage_blind_spot` and automatically creates a synthetic incident (`reporter_type = 'system_blind_spot'`) with an enforced **$4.0 / 5.0$ vulnerability floor**, routing it into the dispatch queue for an immediate **Physical Welfare Recon / Field Sweep**.
- **Community Proxy Reporting:** Intake must track whether the victim has phone access (`has_phone`, `no_phone`, `network_down`, `unknown`).

### D. UI/UX & Aesthetics
- Strictly follow `DESIGN.md`.
- High information density, neutral charcoal surfaces, hairline borders (`1px #23252a`), clean typography.
- **NO decorative cyberpunk neon glows, flashing emergency sirens, or rainbow gradients.** Urgent states are indicated through semantic text badges and crisp border highlights.

### E. Mandatory Living Memory & Decision History (`docs/memory.md`)
- **Continuous Decision Tracking:** Every codebase decision, file creation, code edit, refactoring, library addition, and design adjustment **MUST** be recorded in [`docs/memory.md`](./docs/memory.md).
- **Changelog Integrity:** You must maintain a continuous, granular chronological history in `docs/memory.md` (Section 5) specifying:
  1. What was changed and why (architectural and implementation decisions).
  2. Exact file paths added, modified, or removed.
  3. Commands executed and their outcomes.
  4. Current blockers, tests verified, and the next pending task.
- **Never proceed across sessions without logging:** Before completing a response or ending a turn where code was modified, the living history in `docs/memory.md` must be up to date.

---

## 3. Project File Tree & Component Map

```text
nigehbaan/
├── AGENTS.md                  <-- You are here (AI coding contract)
├── DESIGN.md                  <-- Authoritative visual design tokens
├── README.md                  <-- Public repository homepage
├── docs/                      <-- Complete engineering specifications
│   ├── PRD.md
│   ├── architecture.md
│   ├── trade-offs.md
│   ├── rules.md
│   └── memory.md
├── src/
│   ├── app/                   <-- Next.js App Router pages and API routes
│   │   ├── (dashboard)/       <-- Operations command center
│   │   ├── api/               <-- Serverless triage, audio, dispatch endpoints
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/            <-- Reusable UI components
│   │   ├── dashboard/         <-- Incident queue, explainability cards
│   │   ├── maps/              <-- Leaflet tactical GIS map & blind spot overlays
│   │   ├── uncertainty/       <-- Uncertainty Radar & blind spot monitor
│   │   ├── audio/             <-- Voice distress player & waveform visualizer
│   │   ├── simulation/        <-- Timeline scrubber (T-0 to T-12)
│   │   └── ui/                <-- Primitive buttons, inputs, dialogs
│   ├── lib/                   <-- Core business logic (deterministic)
│   │   ├── triage/            <-- 5-factor mathematical scoring engine
│   │   ├── uncertainty/       <-- Epistemic flag detectors
│   │   ├── data/              <-- In-memory scenario repository & seed data
│   │   └── ai/                <-- Gemini extraction adapter & fallback
│   └── types/                 <-- TypeScript interfaces & Zod schemas
```

---

## 4. Definition of Done for Any Code Change

Before marking any task or phase complete:
1. **TypeScript Typecheck:** Run `npm run type-check` (or `npx tsc --noEmit`) to verify zero type errors.
2. **Build Verification:** Run `npm run build` to ensure valid Next.js serverless compilation.
3. **Deterministic Verification:** Ensure deterministic scoring unit tests pass with identical outputs for identical inputs.
4. **Visual & Interactive Verification:** Test the feature in the browser (handling loading, empty, and error states).
5. **Mandatory History & Decision Log in [`docs/memory.md`](./docs/memory.md):** Append a session entry documenting every codebase decision, reason for changes, files modified, verification status, and next steps.
6. **Strict Hackathon Deadline:** All work must be completed and pushed well before **10:00 PM on 18 October 2026** (commits after this timestamp result in disqualification).
