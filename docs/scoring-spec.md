# Nigehbaan --- Deterministic Triage Scoring Specification

> **Authoritative Specification:** Pure mathematical formulation, factor lookup tables, unknown factor renormalization, uncertainty thresholds, and worked calculation examples.  
> **Invariant:** Triage scores are 100% deterministic TypeScript logic. The LLM must **never** compute scores or assign priority numbers directly.

---

## 1. Mathematical Scoring Formula

Priority is evaluated across 5 distinct operational criteria using Multi-Criteria Decision Analysis (MCDA). Each factor is scored on a normalized **0.0 to 5.0** discrete scale.

The final priority score is mapped to a standard **0.0 to 100.0** scale:

$$\text{Priority Score} = 100 \times \sum_{i=1}^5 \left(w_i \cdot \frac{\text{factor}_i}{5.0}\right)$$

### Factor Weights ($\sum w_i = 1.00$)

| Factor Index ($i$) | Criterion | Weight ($w_i$) | Operational Rationale |
| :---: | :--- | :---: | :--- |
| **1** | **Immediate Threat to Life** | **0.30** | Active drowning, structural collapse, fast current sweep. |
| **2** | **Medical Urgency** | **0.25** | Time-critical conditions (dialysis, oxygen, hemorrhage). |
| **3** | **Evacuation Inability** | **0.20** | Bedridden, wheelchair, unaccompanied child, elderly living alone. |
| **4** | **Environmental Danger** | **0.15** | Water inundation velocity, severed access roads, electrical hazard. |
| **5** | **Population Affected** | **0.10** | Number of human lives at risk at the incident location. |

---

## 2. Priority Categories & Operational Actions

| Category | Score Range | Operational Meaning & Dispatch Protocol |
| :--- | :---: | :--- |
| **Critical** | **$\ge 75.0$** | **Immediate Emergency Dispatch.** Specialized rescue assets (shallow jet-boats, mobile medical units) allocated with top priority. |
| **High** | **$55.0 - 74.9$** | **Urgent Response.** Evacuation and welfare recon within the next operational cycle. Includes blind-spot field sweeps. |
| **Moderate** | **$35.0 - 54.9$** | **Stable Evacuation / Relief.** Non-life-threatening flooding; scheduled for evacuation when urgent queue clears. |
| **Low** | **$< 35.0$** | **Monitoring / Property Inquiry.** Minor puddling, property damage reports with zero injury or entrapment. |

### Deterministic Queue Ordering & Tie-Break Protocol
When ranking incidents in the triage dispatcher queue:
1. **Primary Sort:** Priority Score (descending: highest score ranks first).
2. **Secondary Tie-Break (Confidence Inversion):** If scores are tied within $\pm 0.1$, the incident with **lower Information Confidence** ($C = \sum_{\text{known}} w_i$) is placed higher to immediately surface high-uncertainty risks for human review.
3. **Tertiary Tie-Break (FIFO / Seniority):** If both score and confidence are identical, the incident with the **earlier report timestamp** ranks first.

---

## 3. Factor Lookup Tables (0.0 to 5.0 Scale)

### Factor 1: Immediate Threat to Life ($w_1 = 0.30$)

| Extracted Condition / Fact | Score ($f_1$) | Description / Examples |
| :--- | :---: | :--- |
| `none` | **0.0** | No imminent danger reported; standing on dry floor. |
| `potential` | **1.5** | Water approaching porch; slow rise; stable structure. |
| `moderate_threat` | **3.0** | Water inside living quarters (waist height); structure holding. |
| `severe_threat` | **4.0** | Fast-flowing water outside; walls cracking; nightfall approaching. |
| `imminent_drowning` / `collapse` | **5.0** | People swept away, clinging to trees, perched on submerging roof. |

### Factor 2: Medical Urgency ($w_2 = 0.25$)

| Extracted Condition / Fact | Score ($f_2$) | Description / Examples |
| :--- | :---: | :--- |
| `none` | **0.0** | No injuries or chronic medical dependencies reported. |
| `minor_injury` | **1.0** | Minor lacerations, abrasions, mild hypothermia. |
| `chronic_managed` | **2.5** | Hypertension, mild asthma (inhaler on hand), stable diabetes. |
| `urgent_medical` | **3.5** | High fever in infant, fractured bone, open wound needing dressing. |
| `time_critical_dependency` | **5.0** | Scheduled hemodialysis missed/due, oxygen concentrator without power, active severe hemorrhage, unconsciousness. |

### Factor 3: Evacuation Inability / Vulnerability ($w_3 = 0.20$)

| Extracted Condition / Fact | Score ($f_3$) | Description / Examples |
| :--- | :---: | :--- |
| `independent_adults` | **0.0** | Healthy, able-bodied adults capable of walking to high ground. |
| `minor_impairment` | **1.5** | Elderly with cane, adult with luggage, mild anxiety. |
| `vulnerable_group` | **3.0** | Isolated elderly resident living alone, pregnant woman (<36 weeks). |
| `high_vulnerability` | **4.0** | Unaccompanied children, advanced pregnancy (term), no-phone status. |
| `completely_immobile` | **5.0** | Paralyzed, bedridden, quadriplegic, incubator infant. |

### Factor 4: Environmental Danger & Inundation ($w_4 = 0.15$)

| Flood Water Level / Current | Score ($f_4$) | Terrain Obstacle Description |
| :--- | :---: | :--- |
| `dry` / `ankle_deep` (<0.2m) | **0.5** | Roads passable by standard vehicles. |
| `knee_deep` (0.2m – 0.6m) | **2.0** | Standard cars stalled; passable only by heavy 4x4. |
| `waist_deep` (0.6m – 1.2m) | **3.5** | 4x4 vehicles prohibited; requires shallow-draft boat. |
| `chest_deep` (1.2m – 1.8m) | **4.5** | High water velocity; submerged obstacles, fallen live wires. |
| `submerged_roof` (>1.8m) | **5.0** | Arterial roads fully cut; accessible only by boat/air. |

### Factor 5: Population Affected ($w_5 = 0.10$)

| Headcount Bucket | Score ($f_5$) | Weighting Justification |
| :--- | :---: | :--- |
| `1 person` | **1.0** | Single individual. |
| `2 – 4 people` | **2.5** | Nuclear family or small household. |
| `5 – 9 people` | **4.0** | Extended joint family or small compound. |
| `10+ people` / `institutional` | **5.0** | Large group, school, orphanage, or neighborhood cluster. |

---

## 4. Unknown Handling & Weight Renormalization (D2)

> **Core Rule:** An unknown factor is **NEVER treated as zero**. Setting missing values to zero unfairly deprioritizes panicking victims who forgot to specify non-critical fields.

When $k$ factors are known ($k < 5$) and $5 - k$ factors are unknown (`null`):

$$\text{Renormalized Score} = 100 \times \frac{\sum_{i \in \text{known}} \left(w_i \cdot \frac{\text{factor}_i}{5.0}\right)}{\sum_{i \in \text{known}} w_i}$$

### Information Confidence Metric
The system maintains a separate **Confidence Metric ($C \in [0.0, 1.0]$)**:
$$C = \sum_{i \in \text{known}} w_i$$
- **UI Presentation:** The UI explicitly displays:  
  `[Score: 78.4 / 100 — Critical] • Confidence: 65% (1 of 5 factors unknown)`
- **Safety Invariant:** Low confidence triggers an **Uncertainty Radar Flag** for verification; it **never** lowers incident urgency.

---

## 5. Vulnerability Floors & Blind-Spot Rules (D3)

### A. Community Proxy & No-Phone Floor
If a report indicates the victim has no cellular phone access (`communication_status == 'no_phone'`):
$$\text{Evacuation Inability } (f_3) = \max(f_3, 4.0)$$
*Rationale:* Without phone access, the victim cannot call for updates or coordinate evacuation if floodwaters rise further.

### B. Sector Blind-Spot Floor
When a monitored geographical sector exhibits **zero incoming communications past the threshold duration (e.g. 90 minutes)** while flood hazard levels are rising, the system synthesizes a `system_blind_spot` incident:
- $\text{Life Threat } (f_1) = 2.5$ *(Presumed moderate hazard)*
- $\text{Medical Urgency } (f_2) = \text{unknown (omitted / renormalized)}$
- $\text{Evacuation Inability } (f_3) = 4.0$ *(Enforced infrastructure cutoff floor)*
- $\text{Environmental Danger } (f_4) = \text{Sector Flood Level } (4.0 - 5.0)$
- $\text{Population } (f_5) = \text{Sector Density Prior } (3.5)$
- **Enforced Score Floor:**
  $$\text{Priority Score} = \max(\text{Calculated Score}, 60.0)$$
- **Enforced Category:** **High** (Labeled *"Physical Welfare Recon / Field Sweep"*)
- **Operational Constraint:** A blind spot is **never auto-Critical** (since no specific casualty is confirmed), but is strictly guaranteed to rank above confirmed Moderate incidents.

---

## 6. Uncertainty Radar Detection Rules

| Uncertainty Flag | Trigger Condition | Operational Action |
| :--- | :--- | :--- |
| **`MISSING_LOCATION`** | `locationStatus == 'missing'` or coordinates and text unlocatable. | Prompts coordinator for cross-referencing or phone callback. |
| **`STALE_REPORT`** | Incident age $> 60 \text{ minutes}$ without a status update or assignment. | Prompts welfare check / verification call to ensure status hasn't deteriorated. |
| **`CONFLICTING_REPORT`** | Two reports within same sector/corridor report contradictory route status (e.g. "Main Bridge Open" vs "Main Bridge Washed Out"). | Displays side-by-side comparison; marks route `unverified` on tactical map. |
| **`POTENTIAL_DUPLICATE`** | Same sector + within 30 minutes + text similarity score $\ge 0.75$ or identical phone number. | Flags for manual review. **Never auto-merge or delete.** |
| **`COVERAGE_BLIND_SPOT`** | Sector communications blackout $> 90 \text{ minutes}$ with active flood surge. | Synthesizes welfare sweep incident with minimum score of 60.0. |

---

## 7. Worked Calculation Examples

### Example 1: Critical — Stranded Dialysis Patient (Incident #1)
- **Input Text:** *"My father is on hemodialysis, machine is flooded, water chest high, Sector 2."*
- **Factor Scores:**
  - $f_1 \text{ (Life Threat)} = 4.5$ (Chest-deep water, rising fast)
  - $f_2 \text{ (Medical Urgency)} = 5.0$ (Dialysis dependency)
  - $f_3 \text{ (Evacuation Inability)} = 4.0$ (Elderly, cannot walk through surge)
  - $f_4 \text{ (Environmental Danger)} = 4.5$ (Chest-deep floodwater)
  - $f_5 \text{ (Population)} = 2.5$ (Father + caller = 2 people)
- **Calculation:**
  $$\text{Score} = 100 \times \left(0.30 \times \frac{4.5}{5} + 0.25 \times \frac{5.0}{5} + 0.20 \times \frac{4.0}{5} + 0.15 \times \frac{4.5}{5} + 0.10 \times \frac{2.5}{5}\right)$$
  $$\text{Score} = 100 \times (0.270 + 0.250 + 0.160 + 0.135 + 0.050) = 100 \times 0.865 = \mathbf{86.5}$$
- **Result:** **86.5 / 100 (Critical)** • Confidence: 100% • Match: Shallow Jet-Boat + Dialysis Shelter.

---

### Example 2: Critical — Trapped Infants on Collapsing Roof (Incident #2)
- **Input Text:** *"Water reached roof level. 6 people including two infants, roof cracking."*
- **Factor Scores:**
  - $f_1 = 5.0$ (Imminent structural collapse, roof level)
  - $f_2 = 2.0$ (Infants at risk of severe hypothermia)
  - $f_3 = 4.5$ (Infants cannot self-evacuate)
  - $f_4 = 5.0$ (Structural failure imminent, submerged area)
  - $f_5 = 4.0$ (6 people)
- **Calculation:**
  $$\text{Score} = 100 \times \left(0.30 \times \frac{5.0}{5} + 0.25 \times \frac{2.0}{5} + 0.20 \times \frac{4.5}{5} + 0.15 \times \frac{5.0}{5} + 0.10 \times \frac{4.0}{5}\right)$$
  $$\text{Score} = 100 \times (0.300 + 0.100 + 0.180 + 0.150 + 0.080) = 100 \times 0.810 = \mathbf{81.0}$$
- **Result:** **81.0 / 100 (Critical)** • Confidence: 100%.

---

### Example 3: Blind Spot Synthesis — Sector 3A Riverbank (Incident #3)
- **Telemetry Input:** Sector 3A silent for 90 minutes at $T+6$; river flood gauge at 1.9m (critical).
- **Factor Scores:**
  - $f_1 = 2.5$ (Presumed moderate life threat due to inundation)
  - $f_2 = \text{null}$ (Unknown medical condition)
  - $f_3 = 4.0$ (Enforced blind-spot infrastructure cutoff floor)
  - $f_4 = 4.5$ (Sector flood level 1.9m)
  - $f_5 = 3.5$ (Sector population density prior)
- **Renormalization (Weights Known: $0.30 + 0.20 + 0.15 + 0.10 = 0.75$):**
  $$\text{Known Sum} = 0.30 \times \frac{2.5}{5} + 0.20 \times \frac{4.0}{5} + 0.15 \times \frac{4.5}{5} + 0.10 \times \frac{3.5}{5}$$
  $$\text{Known Sum} = 0.150 + 0.160 + 0.135 + 0.070 = 0.515$$
  $$\text{Renormalized Score} = 100 \times \frac{0.515}{0.75} = \mathbf{68.7}$$
  $$\text{Enforced Floor: } \max(68.7, 60.0) = \mathbf{68.7}$$
- **Result:** **68.7 / 100 (High)** • Labeled: *"Physical Welfare Recon / Field Sweep"* • Confidence: 75% (1 unknown).  
  *Operational Ranking: Ranks below Critical dialysis case (86.5) but above Moderate confirmed incident (39.5).*

---

### Example 4: High — Community Proxy for Isolated Elderly Resident (Incident #4)
- **Input Text:** *"Neighbor reporting: Auntie Khadija lives alone at House 14. She has no phone, water waist-deep."*
- **Factor Scores:**
  - $f_1 = 3.0$ (Waist-deep water inside house)
  - $f_2 = 2.0$ (Mild mobility and arthritis reported)
  - $f_3 = 4.0$ (Enforced No-Phone floor: living alone, cannot call)
  - $f_4 = 3.5$ (Waist-deep street flooding)
  - $f_5 = 1.0$ (1 person)
- **Calculation:**
  $$\text{Score} = 100 \times \left(0.30 \times \frac{3.0}{5} + 0.25 \times \frac{2.0}{5} + 0.20 \times \frac{4.0}{5} + 0.15 \times \frac{3.5}{5} + 0.10 \times \frac{1.0}{5}\right)$$
  $$\text{Score} = 100 \times (0.180 + 0.100 + 0.160 + 0.105 + 0.020) = 100 \times 0.565 = \mathbf{56.5}$$
- **Result:** **56.5 / 100 (High)** • Confidence: 100% • Proxy Flag: `no_phone`.

---

### Example 5: Moderate — Stranded Factory Workers (Incident #5 / NG-105)
- **Input Text:** *"Industrial area junction flooded. 14 factory workers stranded on container roof. No injuries, food running out."*
- **Factor Scores:**
  - $f_1 = 2.5$ (Water rising around container; stable roof)
  - $f_2 = 0.0$ (No medical conditions)
  - $f_3 = 1.0$ (Able-bodied adults, safe on high container)
  - $f_4 = 3.5$ (Flooded junction, deep water surrounds)
  - $f_5 = 5.0$ (14 people stranded; institutional/large group)
- **Calculation:**
  $$\text{Score} = 100 \times \left(0.30 \times \frac{2.5}{5} + 0.25 \times \frac{0.0}{5} + 0.20 \times \frac{1.0}{5} + 0.15 \times \frac{3.5}{5} + 0.10 \times \frac{5.0}{5}\right)$$
  $$\text{Score} = 100 \times (0.150 + 0.000 + 0.040 + 0.105 + 0.100) = 100 \times 0.395 = \mathbf{39.5}$$
- **Result:** **39.5 / 100 (Moderate)** • Confidence: 100%.

---

### Example 6: Unknown Data — Panicked Caller with Partial Information (Incident #6)
- **Input Text:** *"Help us! Water is up to my chest, current is very fast! [Call dropped]"*
- **Factor Scores:**
  - $f_1 = 4.5$ (Chest-deep water, fast current)
  - $f_2 = \text{null}$ (Unknown medical condition)
  - $f_3 = \text{null}$ (Unknown mobility / age)
  - $f_4 = 4.5$ (Fast flowing chest-deep current)
  - $f_5 = \text{null}$ (Unknown headcount)
- **Renormalization (Known Weights: $w_1 + w_4 = 0.30 + 0.15 = 0.45$):**
  $$\text{Known Sum} = 0.30 \times \frac{4.5}{5} + 0.15 \times \frac{4.5}{5} = 0.270 + 0.135 = 0.405$$
  $$\text{Renormalized Score} = 100 \times \frac{0.405}{0.45} = \mathbf{90.0}$$
- **Result:** **90.0 / 100 (Critical)** • Confidence: 45% (3 of 5 factors unknown) • Uncertainty Flag: `MISSING_FACTORS`.  
  *Safety Audit: The missing data did NOT lower the score to zero; it triggered an urgent review while preserving the life-safety rating.*
