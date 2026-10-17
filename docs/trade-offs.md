# Nigehbaan (نگہبان) --- Architectural & Product Trade-offs

**Project:** Nigehbaan  
**Hackathon:** CODE//CONNECT'26 (36-Hour Vibe Coding Hackathon)  
**Problem Statement:** Problem 01 --- Disaster Response & Emergency Coordination  
**Document Purpose:** Explicitly document all engineering, architectural, AI, and design trade-offs made during development: **what we chose, what we left out, and why**.

---

## Executive Summary of Trade-offs

In a fast-paced 36-hour hackathon, the most dangerous failure mode is building an over-engineered, fragile system that breaks during live evaluation or depends on unstable third-party cloud infrastructure. Every architectural decision in Nigehbaan was evaluated against three uncompromising criteria:
1. **Evaluator Reliability:** Will the live demo work 100% of the time on Vercel without database connection timeouts or expired API keys?
2. **Domain Integrity & Safety:** Does this represent real-world emergency coordination governance, where lives are at stake and AI hallucinations cannot be tolerated?
3. **Judge Empathy & Impact:** Does this immediately prove how technology solves the hardest parts of disaster response (the invisible vulnerable, cellular blackouts, and scarce asset triage)?

---

## 1. Architectural & Infrastructure Trade-offs

### What We Chose: Next.js 14/15 App Router with Resilient In-Memory State
- **Choice:** Built as a unified full-stack TypeScript application deployed to Vercel, utilizing an in-memory / browser-cached reactive repository pre-warmed with realistic Sindh flood scenario telemetry, with serverless API route abstractions.
- **Why:** 
  - Sub-millisecond response times with zero cold-start database lag.
  - 100% immune to external database connection pool limits, SSL timeouts, or network partition errors during judging.
  - Instant scenario reset button allows judges to replay the disaster sequence from scratch in 1 click.
- **What We Left Out:** Mandatory external PostgreSQL (Supabase) as a hard runtime blocker.
  - *Rationale:* In a 36-hour hackathon, configuring external database connections, handling remote migration scripts, and managing remote connection pooling frequently causes live demo failures when judges access the site simultaneously. We preserved the exact Supabase table schemas as TypeScript interfaces so a persistent database can be plugged in without changing business logic.

---

## 2. AI & Triage Scoring Trade-offs

### What We Chose: Deterministic MCDA Algorithm + Natural Language Explainability
- **Choice:** Multi-Criteria Decision Analysis (MCDA) mathematical formula balancing 5 weighted factors:
  $$V = 0.30 \cdot \text{LifeThreat} + 0.25 \cdot \text{MedicalUrgency} + 0.20 \cdot \text{EvacuationInability} + 0.15 \cdot \text{EnvironmentalDanger} + 0.10 \cdot \text{Population}$$
  Paired with an AI-generated **Explainability Rationale Card** ("Why This Priority?").
- **Why:**
  - Emergency responders and coordinators will **never trust a black-box AI score** that cannot be mathematically audited.
  - Deterministic algorithms guarantee that identical inputs always produce identical priority rankings.
  - Unit tests can mathematically verify triage correctness.
- **What We Left Out:** Asking an LLM to directly output a final priority number (e.g. prompt: *"Rate this emergency 1 to 10"*).
  - *Rationale:* LLMs suffer from non-deterministic variance, numerical hallucinations, and susceptibility to emotional prompt gaming (e.g. a caller using exclamation marks getting higher priority than a genuinely dying patient with flat affect). 

### What We Chose: Hybrid AI with Resilient Fallback
- **Choice:** Gemini API is used strictly for structured fact extraction, bilingual speech-to-text translation, and natural language audit summaries. If no API key is supplied or rate limits are reached, the system seamlessly falls back to pre-warmed heuristic extractors.
- **Why:** Evaluators testing the public Vercel deployment link without configuring custom environment keys will experience zero degradation.

---

## 3. The "Invisible Vulnerable" & Uncertainty Trade-offs

### What We Chose: Sector-to-Incident Synthesis for Coverage Blind Spots
- **Choice:** When high-hazard sectors experience zero incoming communications past a threshold (e.g. 90 minutes) during rising floodwaters, the system automatically creates a synthetic incident (`reporter_type = 'system_blind_spot'`) with an enforced **$4.0 / 5.0$ vulnerability floor**, routing it directly into the standard triage queue for a Physical Welfare Recon / Field Sweep dispatch.
- **Why:**
  - In real disasters, **silence is an anomaly of maximum danger** (cell towers washed away, power grids drowned).
  - Synthesizing dead zones into the standard incident queue avoids creating a disjointed secondary workflow. Coordinators use one unified screen to dispatch boats for both direct 911 calls and silent sectors.
- **What We Left Out:** Fabricating synthetic individual names or phone numbers inside dead zones.
  - *Rationale:* Hallucinating fake victims inside a black hole violates emergency safety standards. Blind spots are strictly geographical entities requiring human ground reconnaissance.

### What We Chose: Pre-Disaster Vulnerability Baseline & T-0 Proactive Staging
- **Choice:** Overlaying simulated pre-existing demographic and community health logs (Lady Health Worker registries, dialysis patient rosters, informal settlement flood elevation data) onto early hydrological surge projections at `T-0 Early Warning`.
- **Why:**
  - Directly answers the prompt's *"How early can you act?"* and *"Who is most at risk?"* criteria.
  - Moving shallow boats and mobile medical units to high-ground staging depots *before* access roads are cut off at `T+3` saves more lives than reactive triage after inundation.
- **What We Left Out:** Live automated integration with nationwide civil registry databases (NADRA).
  - *Rationale:* Accessing real national citizen databases in a hackathon violates privacy regulations and creates API security vulnerabilities. Seeded demographic baselines provide complete conceptual proof-of-concept without legal or privacy risks.

### What We Chose: Deterministic Opportunity Cost & Competing Priority Trade-Off Warnings
- **Choice:** Calculating and displaying an explicit, auditable trade-off card whenever a coordinator prepares to assign a scarce asset (e.g. *"Assigning Shallow Jet-Boat 01 leaves 0 shallow assets in Sector 3; Incident #4 [Score 3.9] will incur an estimated +35 min delay"*).
- **Why:**
  - Emergency coordination is fundamentally about **competing priorities under extreme resource scarcity**.
  - Provides commanders with the true cost of their decision before they hit "Approve".
  - Strictly deterministic math: checks asset availability in the sector and computes queue turnaround time heuristics.
- **What We Left Out:** LLM-generated subjective trade-off opinions.
  - *Rationale:* Asking an LLM *"Is it worth sending this boat?"* produces vague, non-auditable opinions. Responders need hard numbers (remaining assets, projected turnaround delays).

### What We Chose: Two-Stage Allocation & Shelter Capacity State Counters
- **Choice:** Coupling asset dispatch (vehicle capability + terrain) with destination shelter capacity routing (live beds, generator backup, clinical capability like dialysis support), modeled as reactive state counters.
- **Why:**
  - Directly satisfies the hackathon's 4th stakeholder: *"Shelter and relief managers who must balance capacity against demand."*
  - Rescuing a patient with kidney failure only to drop them at a shelter without power or dialysis backup is a critical failure.
  - Automatically filters out shelters exceeding 95% occupancy or suffering grid collapse.
- **What We Left Out:** A complex multi-warehouse supply chain / ERP software module.
  - *Rationale:* Building supply-chain inventory, cot allocation grids, and food calorie logs would bloat the project and distract from the primary challenge: *Finding who needs help most and coordinating response*. Lightweight reactive state counters deliver 100% of the operational value with zero bloat.

### What We Chose: Community Proxy & Low-Tech Intake
- **Choice:** Supporting dual-mode citizen intake (self-reporting vs. proxy reporting for neighbors) with explicit phone accessibility tagging (`has_phone`, `no_phone`, `network_down`), alongside simulated **Bilingual Urdu/English Voice Hotlines**.
- **Why:**
  - The most vulnerable (elderly living alone, impoverished informal settlements) often do not have smartphones or literacy to fill English web forms.
  - Neighbor proxy reports and voice hotlines reflect how information actually travels in developing disaster zones.
- **What We Left Out:** Complex native mobile apps requiring app store downloads or 50MB installs.
  - *Rationale:* Citizens in crisis cannot download heavy apps over collapsing 2G/3G networks; a responsive web portal and voice IVR simulation are far more accessible.

---

## 4. UI/UX & Design Trade-offs

### What We Chose: High-Density Operational Crisis Clarity
- **Choice:** Clean, high-density, restrained operational interface based on `DESIGN.md` (deep canvas `#010102`, charcoal surface-1 `#0f1011`, crisp 1px borders `#23252a`, semantic crisis colors, compact table rows, and split-screen map).
- **Why:**
  - An emergency coordination tool must look and feel like an authentic, high-stakes operational cockpit.
  - High information density allows a coordinator to scan 20 incidents and 10 rescue assets simultaneously without endless scrolling.
- **What We Left Out:** Neon cyberpunk dark mode, flashing emergency sirens, rainbow charts, and decorative glassmorphism.
  - *Rationale:* Flashing red sirens and glowing effects cause cognitive fatigue, reduce accessibility, and make software look like a video game rather than a professional crisis tool.

---

## 5. Simulation & Live Demonstration Trade-offs

### What We Chose: Multi-Phase Interactive Disaster Timeline Scrubber
- **Choice:** A docked operational timeline controller allowing judges to scrub through distinct phases:
  - `T-0 Early Warning` (Pre-positioning resources)
  - `T+3 Flood Surge` (Inundation of low-lying informal settlements)
  - `T+6 Grid Blackout` (Cell towers drop, Uncertainty Radar triggers blind spot escalations)
  - `T+12 Peak Crisis` (Exhaustion of shallow boats, complex triage trade-offs)
- **Why:**
  - Hackathon judges have 3 to 5 minutes to evaluate a project. They cannot wait 6 hours for real-time events.
  - Scrubbing visually proves that the system handles evolving disaster dynamics over time.
- **What We Left Out:** Connecting to real live GIS satellite feeds or claiming live weather APIs.
  - *Rationale:* Real satellite SAR imagery requires expensive enterprise licensing and has multi-hour latency. Fictional, clearly labelled simulated data (`is_simulated = true`) is legally safe, ethical, and guarantees repeatable judging.

---

## 6. Explicit Non-Goals (What We Deliberately Did Not Build)

1. **Autonomous Emergency Dispatch:** The system *recommends* and *ranks* resource allocations; it never dispatches without explicit human approval.
2. **Medical Diagnosis or Clinical Triage:** The system flags reported medical needs (e.g. oxygen dependent, dialysis, blunt trauma) for rescue routing, but explicitly disclaims any clinical medical diagnosis.
3. **Turn-by-Turn GPS Navigation for Boats:** Real floodwater navigation requires sonar and local bathymetry; claiming automated boat pathfinding without hydrological depth sensors is hazardous.
4. **User Authentication & Complex Role Management:** For a 36-hour hackathon, mandatory login walls frustrate judges. The platform provides a 1-click coordinator persona mode.
