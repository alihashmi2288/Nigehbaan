# Nigehbaan --- Hackathon Submission & Compliance Checklist

> **Event:** CODE//CONNECT'26 --- 36-Hour Vibe Coding Hackathon  
> **Problem Statement:** Problem 01 --- Disaster Response & Emergency Coordination  
> **Strict Cutoff:** **10:00 PM on 18 October 2026 (Asia/Karachi)**. Commits after this timestamp result in disqualification.  
> **Target Code Freeze:** **6:00 PM on 18 October 2026 (Asia/Karachi)**.

---

## 1. Official Submission Information Package

Copy-paste ready metadata for the official hackathon submission portal:

- **Project Title:** Nigehbaan (نگہبان)
- **Problem Statement:** Problem 01 --- Disaster Response ("Finding who needs help most")
- **Tagline:** *"Nigehbaan finds the people the system can't hear."*
- **Team Name:** `Byte Alpha's`
- **Team Members:**
  1. **Syed Ali Hashmi** (Team Leader) --- Roll No: `EB-24210106108` | 3rd Year BSSE (UBIT, University of Karachi)
  2. **Syed Umer Hashmi** --- Roll No: `EB-25210006105` | 2nd Year BSCS (UBIT, University of Karachi)
- **GitHub Repository:** `https://github.com/alihashmi2288/Nigehbaan.git`
- **Live Demo Link:** `https://nigehbaan.vercel.app` *(or custom Vercel preview URL)*
- **Short Description (under 100 words):**  
  Nigehbaan is an AI-assisted disaster coordination platform that finds the invisible victims of floods. When high-hazard sectors experience cellular tower collapse, its Uncertainty Radar detects the silence and synthesizes high-priority welfare recon incidents. Triage is governed by an auditable, deterministic 0–100 mathematical engine that never penalizes missing data, paired with natural-language explainability cards and deterministic opportunity-cost warnings before human dispatch approval.

---

## 2. Technical Stack Declaration

- **Frontend & App:** Next.js 14/15 App Router, React 18/19, TypeScript (Strict Mode).
- **Styling:** Tailwind CSS with high-density crisis tokens from `DESIGN.md`, Lucide React.
- **Mapping:** Leaflet, React-Leaflet, CartoDB Dark Matter vector tiles.
- **State & Store:** Reactive client store (Zustand / React Context) + `localStorage` persistence with 1-click baseline reset.
- **AI Services:** Google Gemini API (`@google/genai`) for structured entity extraction and speech-to-text.
- **Safety / Triage Engines:** 100% deterministic TypeScript logic in `src/lib/`.
- **Hosting & Deployment:** Vercel Edge / Serverless.

---

## 3. Official AI Usage Disclosure

In compliance with hackathon regulations:
1. **Development Assistance:** Built with pair-programming assistance from **Antigravity IDE** for documentation scaffolding, TypeScript type definitions, and Next.js component templates.
2. **Runtime AI Functions:** The **Google Gemini API** is used exclusively for:
   - Extracting structured facts from unstructured natural-language reports.
   - Speech-to-text transcription for simulated voice calls.
   - Generating human-auditable text summaries for Explainability Cards.
3. **Safety Invariants:** All priority scores (0–100), uncertainty flags, blind-spot floors, and opportunity-cost turnaround delays (+35 min) are **100% deterministic TypeScript arithmetic**. The LLM never computes priority scores or executes autonomous dispatches.
4. **Honest Fallback Protocol:** If no API key is supplied, the system operates on offline heuristic rules and explicitly displays:
   - *"Offline heuristic extraction (not AI)"*
   - *"Scripted transcript for simulated call"*
5. **Policy Confirmation Note:** Specific AI-tool allowances and development rules should be verified directly with CODE//CONNECT'26 event organizers.

---

## 4. Pre-Submission Verification Checklist

Run through this checklist 4 hours before the deadline (at 6:00 PM on 18 Oct 2026):

### Technical & Deployment Checks
- [ ] **Public Vercel URL:** Opens cleanly on mobile and desktop without authentication barriers.
- [ ] **Console Errors:** Chrome DevTools console displays 0 red runtime errors.
- [ ] **TypeScript Typecheck:** `npx tsc --noEmit` exits with status `0`.
- [ ] **Build Verification:** `npm run build` compiles with zero errors.
- [ ] **1-Click Reset:** Clicking "Reset Simulation" restores District Alpha baseline in $< 10\text{ms}$.
- [ ] **No Secrets in Repo:** Verified that `.env.local` is ignored and no API keys are committed in Git history.

### Feature & Demonstration Checks
- [ ] **Triage Scorer:** Dialysis patient `NG-101` scores $86.5$ (Critical); Explainability Card displays factor breakdown.
- [ ] **Uncertainty Radar:** `MISSING_LOCATION`, `STALE_REPORT`, and `CONFLICTING_REPORT` flags are visible and clickable.
- [ ] **Blind-Spot Synthesis:** Advancing timeline to `T+6` drops Sector 3A tower and synthesizes `NG-103` (Score 68.7, High).
- [ ] **Opportunity Cost Alert:** Selecting Jet-Boat 01 displays the warning modal (+35 min queue turnaround delay).
- [ ] **Human Approval:** Assigning a resource requires clicking "Approve Assignment" and updates resource state consistently.
- [ ] **Simulated Labeling:** Persistent `SIMULATED DATA` badge is visible on the HUD.

---

## 5. Timeline Freeze & Submission Plan

| Time Window (Asia/Karachi) | Target Milestone | Responsible |
| :--- | :--- | :--- |
| **18 Oct, 02:00 PM** | Complete Tier 1 and any approved Tier 2 features. | Byte Alpha's |
| **18 Oct, 04:00 PM** | Full end-to-end rehearsal of 3-minute demo script. | Syed Ali Hashmi / Syed Umer Hashmi |
| **18 Oct, 06:00 PM** | **CODE FREEZE.** Stop all feature work. Test Vercel deployment. | Byte Alpha's |
| **18 Oct, 08:00 PM** | Final Git commit tagged `v1.0-final`. Push to GitHub. | Syed Ali Hashmi |
| **18 Oct, 09:00 PM** | Submit form on official CODE//CONNECT'26 portal with live URL and repo. | Syed Ali Hashmi |
| **18 Oct, 10:00 PM** | **STRICT DEADLINE.** No commits after this point. | Absolute Cutoff |
