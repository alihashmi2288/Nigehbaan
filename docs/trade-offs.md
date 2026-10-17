# Nigehbaan (نگہبان) --- Architectural & Product Trade-offs

**Project:** Nigehbaan  
**Hackathon:** CODE//CONNECT'26 (36-Hour Vibe Coding Hackathon)  
**Problem Statement:** Problem 01 --- Disaster Response & Emergency Coordination  
**Document Purpose:** Explicitly document all engineering, architectural, AI, and design trade-offs made during development: **what we chose, what we left out, and why**.

---

## Executive Summary of Trade-offs

In a fast-paced 36-hour hackathon, the most dangerous failure mode is building an over-engineered, fragile architecture that crashes during live evaluation or depends on unstable third-party cloud connections. Every architectural decision in Nigehbaan was evaluated against three uncompromising criteria:
1. **Evaluator Reliability:** Will the live demo work 100% of the time on Vercel without database connection timeouts or cold-start lag?
2. **Domain Integrity & Safety:** Does this represent real-world emergency coordination governance, where lives are at stake and AI hallucinations cannot be tolerated?
3. **Judge Empathy & Impact:** Does this immediately prove how technology solves the hardest parts of disaster response (the invisible vulnerable, cellular blackouts, and scarce asset triage)?

---

## 1. Architectural & Infrastructure Trade-offs

### What We Chose: Client-Side Reactive Store + `localStorage`
- **Choice:** Built as a unified full-stack TypeScript application deployed to Vercel, utilizing an in-memory client store (Zustand or React Context) backed by `localStorage` persistence, pre-warmed with the District Alpha seed dataset. Next.js API routes are stateless helpers used strictly for Gemini extraction and transcription.
- **Why:** 
  - Sub-millisecond response times with zero cold-start database lag.
  - 100% immune to external database connection pool limits, SSL timeouts, or network partition errors during live evaluation.
  - Next.js serverless functions do not share in-memory state across requests; client-side state eliminates cross-instance desynchronization.
  - Instant scenario reset button allows judges to replay the disaster sequence from scratch in 1 click.
- **What We Left Out:** Mandatory external PostgreSQL (Supabase) as a hard runtime blocker.
  - *Rationale:* In a 36-hour hackathon, configuring external database connections, handling remote migration scripts, and managing remote connection pooling frequently causes live demo failures when judges access the site simultaneously. We preserved clean TypeScript interfaces so a persistent database can be plugged in without changing business logic.

---

## 2. AI & Triage Scoring Trade-offs

### What We Chose: Deterministic MCDA Algorithm (0–100) + Explainability Cards
- **Choice:** Multi-Criteria Decision Analysis (MCDA) mathematical formula balancing 5 weighted factors:
  $$\text{Score} = 100 \times \sum_{i=1}^5 \left(w_i \cdot \frac{\text{factor}_i}{5}\right)$$
  *(Weights: LifeThreat 0.30, MedicalUrgency 0.25, EvacuationInability 0.20, EnvironmentalDanger 0.15, Population 0.10)*
  Paired with an automated **Explainability Rationale Card** ("Why This Priority?").
- **Why:**
  - Emergency responders and coordinators will **never trust a black-box AI score** that cannot be mathematically audited.
  - Deterministic algorithms guarantee that identical inputs always produce identical priority rankings.
  - Unit tests can mathematically verify triage correctness.
- **What We Left Out:** Asking an LLM to directly output a final priority number (e.g. prompt: *"Rate this emergency 1 to 10"*).
  - *Rationale:* LLMs suffer from non-deterministic variance, numerical hallucinations, and susceptibility to emotional prompt gaming (e.g. a caller using exclamation marks getting higher priority than a genuinely dying patient with flat affect).

### What We Chose: Honest AI Fallbacks with Explicit UI Labeling
- **Choice:** Gemini API is used strictly for structured fact extraction and speech-to-text translation. If no API key is supplied or rate limits are reached, the system falls back to rule-based heuristics and displays **"Offline heuristic extraction (not AI)"** or **"Scripted transcript for simulated call"**.
- **Why:** Evaluators testing the public Vercel deployment link without configuring custom environment keys will experience zero downtime, while transparent labeling demonstrates ethical AI engineering.
- **What We Left Out:** Pretending offline scripts or fallbacks are live AI intelligence.
  - *Rationale:* Hackathon evaluators immediately penalize deceptive demos. Transparent failover is a recognized mark of production-grade engineering.

---

## 3. The "Invisible Vulnerable" & Uncertainty Trade-offs

### What We Chose: Sector-to-Incident Synthesis for Coverage Blind Spots
- **Choice:** When high-hazard sectors experience zero incoming communications past a threshold during rising floodwaters, the system automatically creates a synthetic incident (`reporter_type = 'system_blind_spot'`) with an enforced **score $\ge 60.0$ (High)**, routing it directly into the standard triage queue for a Physical Welfare Recon / Field Sweep dispatch.
- **Why:**
  - In real disasters, **silence is an anomaly of maximum danger** (cell towers washed away, power grids drowned).
  - Synthesizing dead zones into the standard incident queue avoids creating a disjointed secondary workflow. Coordinators use one unified screen to dispatch boats for both direct 911 calls and silent sectors.
  - Enforcing a minimum score of 60 ensures it ranks above minor confirmed complaints while avoiding auto-Critical (since no specific human is confirmed yet).
- **What We Left Out:** Fabricating synthetic individual names or phone numbers inside dead zones.
  - *Rationale:* Hallucinating fake victims inside a black hole violates emergency safety standards. Blind spots are strictly geographical entities requiring human ground reconnaissance.

### What We Chose: Renormalizing Unknown Factors Instead of Setting to Zero
- **Choice:** When a report lacks certain factor data (e.g., headcount unknown), the score is computed over known factors with weights renormalized:
  $$\text{Score} = 100 \times \frac{\sum_{i \in \text{known}} \left(w_i \cdot \frac{\text{factor}_i}{5}\right)}{\sum_{i \in \text{known}} w_i}$$
- **Why:** A caller in chest-deep water should never be penalized with a lower score simply because they were too panicked to report how many people were in the room. Low confidence triggers an Uncertainty Radar review flag, never deprioritizing the victim.

### What We Chose: Deterministic Opportunity Cost & Competing Priority Warnings
- **Choice:** Calculating and displaying an explicit, auditable trade-off card whenever a coordinator prepares to assign a scarce asset (*"Assigning Shallow Jet-Boat 01 leaves 0 shallow-draft assets in Sector 2; Incident NG-104 [Score 56.5] will incur an estimated +35 min delay"*).
- **Why:**
  - Emergency coordination is fundamentally about **competing priorities under extreme resource scarcity**.
  - Provides commanders with the true cost of their decision before they hit "Approve".
  - Strictly deterministic math: checks asset availability in the sector and computes queue turnaround time heuristics.

---

## 4. Scope Tiers: What We Cut and Why (Tier 3 Non-Goals)

To avoid scope creep and ensure timely delivery before the 10:00 PM cutoff on 18 October 2026, the following features were deliberately cut from the hackathon scope:

1. **Complex What-If Scenario Sandbox:**
   - *Why Cut:* Rebuilding an interactive branch-prediction routing engine would consume 15+ hours of development time. The 4-step Timeline Scrubber ($T-0, T+3, T+6, T+12$) provides 100% of the dynamic scenario evaluation value with zero fragility.
2. **Automated Duplicate Merging:**
   - *Why Cut:* Automatically deleting or merging disaster reports based on algorithmic string similarity risks deleting distinct victims living on the same street. Flagging potential duplicates for human review is safer and operationally correct.
3. **User Authentication & Multi-Role Permissions:**
   - *Why Cut:* Mandatory login screens frustrate evaluators and risk broken authentication during live judging. Using a 1-click coordinator persona mode keeps the demo frictionless.
4. **Mandatory External Database (Supabase):**
   - *Why Cut:* Eliminates database cold-starts, connection pooling limits, and migration failures on Vercel.
5. **Local Report Drafts:**
   - *Why Cut:* Redundant with the Tier 2 PWA offline submission queue.
6. **Turn-by-Turn GPS Boat Navigation:**
   - *Why Cut:* Real floodwater navigation requires sonar and local bathymetry; claiming automated boat pathfinding without hydrological depth sensors is unrealistic.
7. **Complex Settings & Admin Configurations:**
   - *Why Cut:* Settings pages distract from the core crisis management workflow and add no evaluation value.
