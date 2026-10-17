# Nigehbaan --- Acceptance Test Criteria & Test Cases

> **Purpose:** Authoritative verification test suite for coding agents and evaluators.  
> Every test is specified in formal **Given / When / Then** format with exact values derived from [`docs/scoring-spec.md`](./scoring-spec.md) and [`docs/seed-data.md`](./seed-data.md). These specifications serve directly as automated unit-test assertions and manual browser verification steps.

---

## 1. Tier 1 Test Suite: Core Tactical Triage & Ingestion

### Test 1.1: Deterministic Scoring — Critical Dialysis Incident
- **Given:** A raw report for Incident `NG-101` in Sector 2:
  - Life Threat: `4.5` (chest-deep water)
  - Medical Urgency: `5.0` (hemodialysis dependency)
  - Evacuation Inability: `4.0` (elderly, unable to walk through surge)
  - Environmental Danger: `4.5` (chest-deep current)
  - Population Affected: `2.5` (2 people)
- **When:** The scoring engine executes `calculatePriorityScore(factors)`.
- **Then:**
  - The exact score returned is **`86.5`** (within $\pm 0.1$).
  - The priority category is **`Critical`**.
  - The incident ranks #1 in the priority queue at $T+3$.
  - An Explainability Card is generated displaying the $0.30 \cdot f_1 + \dots$ formula breakdown.

---

### Test 1.2: Unknown Factor Renormalization — Missing Headcount & Medical Data
- **Given:** A panicked distress report for Incident `NG-112`:
  - Life Threat: `4.5`
  - Environmental Danger: `4.5`
  - Medical Urgency: `null`
  - Evacuation Inability: `null`
  - Population Affected: `null`
- **When:** The scoring engine executes `calculatePriorityScore(factors)`.
- **Then:**
  - Known weight sum is $0.30 + 0.15 = 0.45$.
  - Renormalized score is $100 \times \frac{0.30 \cdot (4.5/5) + 0.15 \cdot (4.5/5)}{0.45} = \mathbf{90.0}$.
  - Category is **`Critical`**.
  - Confidence metric is **`0.45`** (45%).
  - UI displays *"3 of 5 factors unknown — weights renormalized"*.
  - An Uncertainty Radar flag `MISSING_FACTORS` is raised; urgency is **not** reduced.

---

### Test 1.3: Community Proxy & No-Phone Vulnerability Floor
- **Given:** A proxy report for `NG-104` with `communication_status = 'no_phone'` and an initial extracted mobility score of `2.0`.
- **When:** The scoring engine processes the incident.
- **Then:**
  - The vulnerability floor enforces $f_3 = \max(2.0, \mathbf{4.0})$.
  - Total calculated score is **`56.5`** (Category: **`High`**).
  - The incident displays a `NO_PHONE_COMMUNITY_PROXY` badge.

---

### Test 1.4: Sector Blind-Spot Synthesis at T+6
- **Given:** The timeline scrubber is advanced to `T+6 Grid Blackout`:
  - `Tower-Alpha-3` in Sector 3A is offline.
  - Sector 3A has received 0 incoming reports for 90 minutes.
  - Sector 3A flood gauge is at $1.9\text{m}$.
- **When:** The blind-spot detector evaluates sector health.
- **Then:**
  - A synthetic incident `NG-103` is created with `reporter_type = 'system_blind_spot'`.
  - Evacuation Inability is set to `4.0` and Environmental Danger to `4.5`.
  - Calculated score is $68.7$ and satisfies the floor condition ($\ge \mathbf{60.0}$).
  - Category is **`High`**; label is *"Physical Welfare Recon / Field Sweep"*.
  - It is **not** marked `Critical`.
  - Sector 3A map polygon highlights in `--semantic-blind-spot` tangerine with dashed borders.

---

### Test 1.5: Tactical Opportunity Cost Warning (+35 min Delay)
- **Given:**
  - Incident `NG-101` (Score 86.5, Critical, Sector 2) is opened in the inspector.
  - Available asset `RES-01` (Shallow Jet-Boat 01) is stationed in Sector 2.
  - Incident `NG-104` (Score 56.5, High, Sector 2) is the next queued incident in Sector 2.
- **When:** The coordinator clicks "Assign Resource" and selects `RES-01`.
- **Then:**
  - The confirmation modal renders an `opportunity-cost-warning` component.
  - Consequence text confirms: *"Leaves 0 shallow-draft assets available in Sector 2"*.
  - Turnaround penalty displays: *"Incident NG-104 will incur an estimated +35 min delay"*.
  - Dispatch action is blocked until the coordinator clicks explicit "Approve Assignment".

---

### Test 1.6: Resource Assignment Consistency & Audit Log
- **Given:** Resource `RES-01` is marked `available`.
- **When:** The coordinator approves assignment of `RES-01` to incident `NG-101`.
- **Then:**
  - `RES-01.status` transitions to `assigned`.
  - `RES-01` is immediately disabled/hidden from candidate resource lists for other incidents.
  - Incident `NG-101.status` transitions to `assigned`.
  - An immutable entry is appended to the Activity Audit Log:  
    `[TIMESTAMP] COORDINATOR_ASSIGN: Shallow Jet-Boat 01 assigned to NG-101`.

---

### Test 1.7: Uncertainty Radar Flag Detection
- **Given:** The baseline District Alpha dataset is loaded.
- **When:** The Uncertainty Radar detector evaluates all incidents and routes.
- **Then:**
  - `NG-112` triggers **`MISSING_LOCATION`** (coordinates are null).
  - `NG-111` triggers **`STALE_REPORT`** (age $> 75 \text{ min} > 60 \text{ min threshold}$).
  - `NG-108` and `NG-109` trigger **`CONFLICTING_REPORT`** (opposing claims on Main Highway Bridge).
  - `NG-104` and `NG-110` trigger **`POTENTIAL_DUPLICATE`** (same sector, same time window, text similarity).
  - Clicking a flag opens both reports side-by-side without auto-merging or deleting.

---

### Test 1.8: Honest AI Fallback Labeling
- **Given:** The application is running without a `GEMINI_API_KEY` configured.
- **When:** A user submits a new text report in `/incidents/new`.
- **Then:**
  - The serverless endpoint falls back to the deterministic rule-based extractor.
  - The extracted facts card visibly renders the exact badge:  
    **`Offline heuristic extraction (not AI)`** with neutral slate styling.
  - The report is successfully saved and prioritized in the incident queue.

---

### Test 1.9: Pristine 1-Click Simulation Reset
- **Given:** Several incidents have been assigned, new reports submitted, and the timeline moved to $T+12$.
- **When:** The user clicks the "Reset Simulation" button in the HUD.
- **Then:**
  - `localStorage` is cleared and re-seeded with the original District Alpha baseline.
  - Timeline reverts to `T-0 Early Warning`.
  - Incident queue, map markers, and resource statuses match pristine seed data exactly.

---

## 2. Tier 2 Test Suite: Post-Tier 1 Extensions

### Test 2.1: Shelter Capacity & Capability Destination Matching
- **Given:** Incident `NG-101` requires evacuation for a patient on hemodialysis:
  - `SHL-01` has 32% occupancy but **no** dialysis capability.
  - `SHL-02` (Civil Hospital) has 70% occupancy and **has** `dialysis_support` + active backup generator.
  - `SHL-03` has 97% occupancy and **grid blackout** (no generator).
- **When:** The shelter allocation engine evaluates candidate destinations for `NG-101`.
- **Then:**
  - `SHL-03` is strictly filtered out (occupancy $\ge 95\%$ and power failure).
  - `SHL-01` is deprioritized (lacks medical capability).
  - `SHL-02` is selected as the recommended destination.
  - Upon assignment, `SHL-02.capacityOccupied` increments by the incident headcount.

---

### Test 2.2: T-0 Pre-Disaster Baseline Staging Recommendation
- **Given:** Timeline is set to `T-0 Early Warning`.
- **When:** The coordinator inspects Sector 3A.
- **Then:**
  - The UI displays a `pre-position-pill` badge: *"Proactive Staging Recommended"*.
  - System recommends pre-positioning `RES-01` (Shallow Jet-Boat 01) at High Ground Depot Alpha.
  - Rationale displays: *"Arterial access road submerges at T+3; 22 isolated elderly registered in sector."*

---

### Test 2.3: Bilingual Voice Distress Hotline Player
- **Given:** Evaluator navigates to the voice distress simulator.
- **When:** Evaluator clicks "Play Distress Call".
- **Then:**
  - The Web Audio waveform visualizer animates audio playback.
  - The transcript displays the spoken Urdu phrase in `dir="rtl"` alongside English translation.
  - Provenance tag displays: **`Scripted transcript for simulated call`**.
  - Extracted facts generate Incident `NG-102` (Score 81.0, Critical).

---

### Test 2.4: Installable PWA Offline Queue
- **Given:** The app is installed as a PWA and the browser network is toggled to Offline.
- **When:** A volunteer submits a report via `/incidents/new`.
- **Then:**
  - The submission is intercepted by the service worker and queued in local storage.
  - UI displays: *"Report queued locally (offline mode)"*.
  - When network is toggled to Online, the queue automatically syncs and populates the dashboard.
