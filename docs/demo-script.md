# Nigehbaan --- Live Demo & Pitch Script

> **Event:** CODE//CONNECT'26 (Problem 01: Disaster Response & Emergency Coordination)  
> **Team Name:** Byte Alpha's  
> **Core Headline:** *"Nigehbaan finds the people the system can't hear."*

---

## 1. 90-Second Rapid Pitch Script

*(Target time: 1 minute 30 seconds — ideal for quick judging rounds or stage presentations)*

> "Respected judges, during catastrophic floods in Pakistan, emergency queues fail because of one fundamental flaw: they only prioritize who shouts loudest with a smartphone.
>
> Meanwhile, the most vulnerable—elderly residents living alone, low-income informal settlements along riverbanks, and people whose cell towers have washed away—become completely invisible.
>
> We built **Nigehbaan (نگہبان)** to solve Problem 01: finding who needs help most.
>
> Nigehbaan introduces three major tactical breakthroughs:
> 1. **The Uncertainty Radar:** When an entire sector goes dark during rising floodwaters, our system doesn't wait for calls. It detects the silence and automatically synthesizes a high-priority incident for an immediate physical welfare recon sweep.
> 2. **Deterministic, Auditable Triage:** Lives cannot depend on an LLM hallucinating a priority score. Our scoring is 100% deterministic multi-criteria math, producing an explainable 0 to 100 score where missing data never penalizes the victim.
> 3. **Tactical Opportunity Cost Warnings:** Before a commander dispatches a scarce shallow-draft boat, Nigehbaan warns them: *'Assigning this boat leaves 0 boats in Sector 2, delaying the next queued dialysis patient by +35 minutes.'*
>
> Nigehbaan ensures that in the chaos of disaster, no human life is left invisible."

---

## 2. 3-Minute Walkthrough Script (Exact Click-by-Click)

### Step 1: Tactical HUD Overview (0:00 – 0:30)
- **Click:** Load `https://nigehbaan.vercel.app` (or local demo).
- **Say:**
  > "Welcome to the Nigehbaan Tactical Command Center. We are looking at District Alpha during a major monsoon flood. Notice our high-density crisis layout: on the left is our priority queue, in the center our tactical GIS map, and on top our disaster timeline scrubber. All data is clearly labelled simulated."

### Step 2: Disaster Timeline & Blind-Spot Synthesis (0:30 – 1:15)
- **Click:** Click on **`T+6 Grid Blackout`** on the top timeline scrubber.
- **Say:**
  > "Let's advance the scenario to T+6 hours. The Malir flood surge has breached the banks, and telemetry reports that Tower-Alpha-3 in Sector 3A has collapsed.
  >
  > Look at the Uncertainty Radar: while ordinary systems would show zero calls for Sector 3A, Nigehbaan flags a `coverage_blind_spot`. It immediately synthesizes Incident NG-103 with an enforced score of 68.7—High Priority—labeled 'Physical Welfare Recon / Field Sweep'. It highlights the silent riverbank sector in tangerine on the map, prompting coordinators to deploy an amphibious recon patrol before it's too late."

### Step 3: Explainable Triage & Mathematical Breakdown (1:15 – 1:50)
- **Click:** In the priority queue, click on **`NG-101`** (Critical Dialysis Patient, Score 86.5).
- **Say:**
  > "Now let's inspect our top-priority incident, NG-101. A citizen reported chest-deep water with an elderly father on hemodialysis.
  >
  > Notice our Explainability Card: this score of 86.5 is NOT an LLM guess. It is computed via our deterministic 5-factor mathematical formula. You can see the exact breakdown: Life Threat 4.5, Medical Urgency 5.0, Evacuation Inability 4.0. Furthermore, if any factor were missing, our algorithm would renormalize weights instead of penalizing the caller with a zero."

### Step 4: Opportunity Cost & Human Dispatch Approval (1:50 – 2:30)
- **Click:** In the inspector pane, click **"Assign Resource"** $\to$ select **`RES-01 (Shallow Jet-Boat 01)`**.
- **Say:**
  > "When we prepare to dispatch Shallow Jet-Boat 01, Nigehbaan doesn't just execute blindly. It displays an explicit **Opportunity Cost Warning Card**.
  >
  > It warns the commander: *'Committing this boat leaves 0 shallow-draft assets in Sector 2, causing an estimated +35 minute delay for queued Incident NG-104.'* It also cross-references destination shelters, auto-matching the District Civil Hospital because it has active dialysis backup and filtering out overcrowded shelters.
  >
  > We click **Approve Assignment**. The boat is committed, and an immutable log entry is generated."

### Step 5: Live Ingestion & Honest Fallback (2:30 – 2:50)
- **Click:** Click **"+ New Report"** $\to$ paste a quick scenario or toggle Community Proxy mode $\to$ submit.
- **Say:**
  > "Finally, our intake supports direct reporting and community proxy filing for neighbors without phones. If our Gemini API key is offline, Nigehbaan immediately executes our rule-based extractor and transparently labels it *'Offline heuristic extraction (not AI)'*—zero downtime, zero deception."

### Step 6: 1-Click Reset (2:50 – 3:00)
- **Click:** Click the **"Reset Simulation"** button in the top navigation.
- **Say:**
  > "And with a single click on 'Reset Simulation', the entire local scenario restores to its pristine baseline in under 5 milliseconds. Thank you, judges."

---

## 3. "If Something Breaks" Contingency Fallback Plan

| Potential Failure Point | Root Cause During Demo | Instant Fix / Fallback Action | What to Say to Judges |
| :--- | :--- | :--- | :--- |
| **Gemini API Call Times Out or Fails** | Rate limit, invalid key, or network drop. | The app automatically engages `heuristicExtractor.ts` and renders the *"Offline heuristic extraction (not AI)"* badge. | *"Our resilient architecture automatically failed over to our offline heuristic parser without dropping the citizen's report."* |
| **Corrupted Browser State / Messed-up Queue** | Accidental double-clicks or browser cache glitch. | Click the **"Reset Simulation"** button in the top navigation bar. | *"Let's reset to the baseline scenario using our 1-click state restore."* |
| **Internet Disconnects During Presentation** | Venue Wi-Fi outage. | The app runs 100% locally on `localhost` or cached PWA state with local client store. | *"Nigehbaan is designed offline-first: our entire triage engine and GIS map run completely client-side even if internet connectivity drops."* |
| **Audio File Doesn't Play** | Browser autoplay policy / audio mute. | Click the play button directly, or point to the pre-rendered scripted transcript box. | *"The waveform visualizer displays the simulated audio profile, accompanied by our verified speech-to-text transcript."* |
