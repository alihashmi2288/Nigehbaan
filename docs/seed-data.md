# Nigehbaan --- District Alpha Seed Dataset & Timeline Scenario

> **Classification:** `SIMULATED DATA` (Fictional Disaster Scenario).  
> **Geographical Setting:** District Alpha (Modeled loosely on the Malir / Indus flood basin near Karachi, Pakistan). Coordinates and identities are fictional.

---

## 1. Sector Geography & Polygons

District Alpha is partitioned into four operational response sectors:

| Sector ID | Sector Name | Terrain Characteristics | Bounding Coordinates (Approximate Fictional) |
| :--- | :--- | :--- | :--- |
| **`sector-1`** | **Central Command & Urban High-Ground** | Dense paved urban core, elevated ridge, government centers, central hospital. Staging depot. | `[[24.930, 67.110], [24.950, 67.110], [24.950, 67.140], [24.930, 67.140]]` |
| **`sector-2`** | **Gadap Lowland Agriculture** | Alluvial farmland, scattered compounds, single-lane roads. Water 0.8m – 1.4m. | `[[24.950, 67.110], [24.980, 67.110], [24.980, 67.160], [24.950, 67.160]]` |
| **`sector-3a`**| **Riverbank Settlement (*Katchi Abadi*)** | High-density informal settlement along Malir floodway, single-story mud/concrete homes. Extreme flood vulnerability. | `[[24.910, 67.130], [24.935, 67.130], [24.935, 67.170], [24.910, 67.170]]` |
| **`sector-4`** | **Highway Arterial & Coastal Outskirts** | National highway bridge corridor, industrial warehouses, transit relief staging. | `[[24.890, 67.150], [24.910, 67.150], [24.910, 67.190], [24.890, 67.190]]` |

---

## 2. Pre-Disaster Vulnerability Baseline (T-0 Priors)

Data sourced from pre-disaster community health registrations (Lady Health Worker logs & municipal surveys):

1. **Sector 3A (Riverbank Settlement):**
   - Population: ~12,400 residents.
   - Elevation: 1.8m above mean river gauge (submerges first).
   - High Vulnerability Registry: 22 isolated elderly living alone; 47 unaccompanied minors in community center; 89% informal non-reinforced roofs.
   - Telecom: 68% feature phones / 2G; zero satellite backup. Single cell tower (`Tower-Alpha-3`).
2. **Sector 2 (Lowland Agriculture):**
   - High Vulnerability Registry: 6 chronic hemodialysis patients registered with District Clinic (require treatment every 48 hours); 9 bedridden individuals.
3. **Sector 1 (Urban High Ground):**
   - Elevation: 14.5m above river gauge (safe staging zone).

---

## 3. Rescue Resource Inventory (6 Units)

| ID | Callsign | Type | Sector Station | Crew / Seat Cap | Speed (Water/Road) | Turnaround Cycle ($t_{\text{turn}}$) | Status at T-0 |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **`RES-01`** | **Shallow Jet-Boat 01** | `shallow_boat` (Draft <0.3m) | `sector-1` | 6 evacuees | 28 km/h | **35 minutes** | Available |
| **`RES-02`** | **Shallow Jet-Boat 02** | `shallow_boat` (Draft <0.3m) | `sector-2` | 6 evacuees | 28 km/h | **35 minutes** | Available |
| **`RES-03`** | **Heavy Rescue 4x4 Alpha** | `heavy_4x4` (High-snorkel) | `sector-1` | 4 evacuees | 45 km/h | **25 minutes** | Available |
| **`RES-04`** | **Heavy Rescue 4x4 Beta** | `heavy_4x4` (High-snorkel) | `sector-4` | 4 evacuees | 45 km/h | **25 minutes** | Available |
| **`RES-05`** | **Mobile Medical Unit 01** | `mobile_medical` | `sector-1` | 2 ICU stretchers | 40 km/h | **45 minutes** | Available |
| **`RES-06`** | **Physical Recon Patrol 01** | `recon_patrol` (Amphibious) | `sector-1` | 3 scouts | 30 km/h | **30 minutes** | Available |

---

## 4. Destination Shelter Network (3 Facilities)

| ID | Shelter Name | Sector | Capacity (Total / Current) | Backup Generator | Medical Capability | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **`SHL-01`** | **Government High School Camp** | `sector-1` | 250 / 80 (32%) | **Active (100% fuel)** | Basic First Aid, Maternal Care | Main municipal relief site. High ground. |
| **`SHL-02`** | **District Civil Hospital Annexe** | `sector-1` | 120 / 84 (70%) | **Active (Backup Gen)** | **Dialysis Support, Oxygen, ICU Beds** | Only facility with emergency hemodialysis backup. |
| **`SHL-03`** | **Highway Warehouse Relief Depot** | `sector-4` | 400 / 388 (97%) | **FAILED (Grid blackout)** | Basic First Aid | **Overcrowded (>95%) & No Power. Filtered out.** |

---

## 5. Seeded Incidents Catalog (12 Cases)

| Code | Sector | Source / Mode | Phone Access | Original Report (English / Urdu) | Factors ($f_1..f_5$) | Score | Category | Notes / Uncertainty |
| :--- | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :--- |
| **`NG-101`** | `sector-2` | `citizen` | `has_phone` | *"My father Syed Iqbal is on hemodialysis. Water is chest-deep inside our house. Generator submerged. Need boat immediately."* | `[4.5, 5.0, 4.0, 4.5, 2.5]` | **86.5** | **Critical** | Matched to Jet-Boat 01 + Hospital Annexe. |
| **`NG-102`** | `sector-3a`| `voice_hotline` | `has_phone` | *"چھت پر بیٹھے ہیں پانی بڑھ رہا ہے۔ دو چھوٹے بچے ساتھ ہیں چھت سے آوازیں آ رہی ہیں۔"* *(Sitting on roof, water rising, 2 babies, roof cracking)* | `[5.0, 2.0, 4.5, 5.0, 4.0]` | **81.0** | **Critical** | Audio hotline sample. Imminent collapse. |
| **`NG-103`** | `sector-3a`| `system_blind_spot`| `network_down`| *"[SYNTHESIZED BLIND SPOT] Sector 3A silent >90m. Cell tower offline. Flood gauge 1.9m. Requires immediate welfare check."* | `[2.5, null, 4.0, 4.5, 3.5]` | **68.7** | **High** | Synthesized at $T+6$. Score $\ge 60$ enforced. |
| **`NG-104`** | `sector-2` | `community_proxy`| `no_phone` | *"Reporting for neighbor: Auntie Khadija lives alone at House 14. She has no phone, water waist-deep, cannot walk."* | `[3.0, 2.0, 4.0, 3.5, 1.0]` | **56.5** | **High** | Community proxy; enforced $f_3 \ge 4.0$ floor. |
| **`NG-105`** | `sector-4` | `citizen` | `has_phone` | *"Industrial area junction flooded. 14 factory workers stranded on container roof. No injuries, food running out."* | `[2.5, 0.0, 1.0, 3.5, 5.0]` | **51.5** | **Moderate** | High headcount (14), low medical urgency. |
| **`NG-106`** | `sector-1` | `citizen` | `has_phone` | *"Knee-deep water in street near market. 3 adults at home, dry inside, power cut off. We are okay for now."* | `[1.0, 0.0, 0.0, 2.0, 2.5]` | **41.0** | **Moderate** | Stable situation. |
| **`NG-107`** | `sector-2` | `citizen` | `has_phone` | *"Water entered basement storage. Some furniture damaged. Looking for municipal pump."* | `[0.0, 0.0, 0.0, 1.0, 1.0]` | **14.5** | **Low** | Property only. |
| **`NG-108`** | `sector-4` | `citizen` | `has_phone` | *"Main Highway Bridge is completely open and safe to cross."* (Received 10:14) | `[0.5, 0.0, 0.0, 1.0, 2.5]` | **20.5** | **Low** | **Conflict Flag:** Conflicts with `NG-109`. |
| **`NG-109`** | `sector-4` | `citizen` | `has_phone` | *"Warning: Main Highway Bridge washed out, 3 cars stalled in flood water!"* (Received 10:22) | `[3.5, 1.0, 1.5, 4.0, 3.0]` | **52.5** | **Moderate** | **Conflict Flag:** Contradicts `NG-108`. |
| **`NG-110`** | `sector-2` | `citizen` | `has_phone` | *"Emergency: house surrounded by water near Gadap canal, elderly woman trapped."* (Received 10:10) | `[3.5, 2.0, 4.0, 3.5, 1.0]` | **59.5** | **High** | **Potential Duplicate Flag:** Similar to `NG-104`. |
| **`NG-111`** | `sector-3a`| `citizen` | `network_down`| *"Help! Water rising fast in school compound, 20 children stranded."* (Reported at 09:00, now 10:15) | `[4.0, 1.5, 3.5, 4.0, 5.0]` | **73.5** | **High** | **Stale Report Flag:** Age $>75 \text{ mins}$ without update. |
| **`NG-112`** | `sector-1` | `citizen` | `unknown` | *"Someone screaming for help in dark alley near flood canal, cannot see exact location."* | `[3.0, null, null, 3.0, null]` | **60.0** | **High** | **Missing Location Flag:** Coordinates null; unverified. |

---

## 6. Disaster Timeline Event Table (T-0 to T-12)

| Timeline Phase | Environmental Flood Level | Infrastructure & Telemetry Events | Newly Arrived Incidents | Expected Queue Rankings (Top 3) |
| :--- | :--- | :--- | :--- | :--- |
| **`T-0 Early Warning`** | River gauge: 0.6m (Normal). Weather alert: Heavy monsoon surge inbound within 6h. | All 4 cell towers operational. All arterial roads dry and open. All shelters active. | Static Baseline loaded: LHW reports, `NG-106`, `NG-107`. | 1. `NG-106` (Moderate, 41.0)<br>2. `NG-107` (Low, 14.5)<br>*(Proactive Staging Alert for Jet-Boat 01)* |
| **`T+3 Flood Surge`** | River gauge: 1.3m (High). Sector 2 lowlands water waist-deep (0.8m). | Low-lying culverts submerged. Gadap Link Road closed to standard cars. | `NG-101` (Dialysis, 86.5), `NG-104` (Proxy Elderly, 56.5), `NG-111` (School, 73.5). | 1. **`NG-101`** (Critical, 86.5)<br>2. **`NG-111`** (High, 73.5)<br>3. **`NG-104`** (High, 56.5) |
| **`T+6 Grid Blackout`** | River gauge: 1.9m (Severe). Sector 3A water chest-deep (1.5m). | **`Tower-Alpha-3` collapses.** Sector 3A goes completely silent (>90m). Highway bridge reports conflict. | `NG-102` (Voice Call, 81.0), **`NG-103` (Blind Spot Synthesized, 68.7)**, `NG-108`, `NG-109`. | 1. **`NG-101`** (Critical, 86.5)<br>2. **`NG-102`** (Critical, 81.0)<br>3. **`NG-103`** (Blind Spot Sweep, 68.7) |
| **`T+12 Peak Crisis`** | River gauge: 2.4m (Catastrophic). Sector 2 & 3A fully inundated. | Shelter 03 breaches 97% and loses generator. Shallow boats fully committed. Acute opportunity costs. | `NG-105` (Workers, 51.5), `NG-112` (Missing Loc, 60.0). | 1. **`NG-101`** (Assigned)<br>2. **`NG-102`** (Assigned)<br>3. **`NG-103`** (In Progress)<br>4. **`NG-112`** (High, 60.0) |

---

## 7. Opportunity Cost Calculator & Worked Example

### Mathematical Model
When assigning a scarce asset $R$ of type $k$ in Sector $S$:
1. **Asset Depletion Warning:** Count remaining unassigned assets of type $k$ in Sector $S$. If remaining $= 0$, flag acute scarcity.
2. **Turnaround Delay Penalty ($\Delta t$):**
   $$\Delta t = t_{\text{transit}}(R \to \text{Incident}_1) + t_{\text{evacuate}} + t_{\text{transit}}(\text{Incident}_1 \to \text{Shelter}) + t_{\text{transit}}(\text{Shelter} \to \text{Incident}_2)$$
   For District Alpha, the baseline cycle time for a shallow jet-boat is **35 minutes**.

### Worked Example Producing "+35 min Delay Warning"
- **Incident Under Review:** `NG-101` (Critical Dialysis, Score 86.5, Sector 2).
- **Candidate Resource:** `RES-01` (Shallow Jet-Boat 01).
- **Next Queued Incident in Queue Needing Shallow Boat:** `NG-104` (Score 56.5, High, Sector 2).
- **Calculated Consequence:**
  - Assigning `RES-01` leaves **0** shallow-draft boats stationed in Sector 2.
  - Next queued incident `NG-104` cannot receive an immediate dispatch and must wait for `RES-01` to complete its cycle.
  - Estimated queue delay: **+35 minutes**.
- **UI Warning Card Output:**
  > ⚠️ **Opportunity Cost Alert:**  
  > Committing **Shallow Jet-Boat 01** to `NG-101` leaves **0** shallow-draft assets available in Sector 2.  
  > Queued Incident **`NG-104` [Score 56.5 — High]** will incur an estimated **+35 min delay**.  
  > Matched Destination: **District Civil Hospital Annexe** (Dialysis Ready • 70% capacity).
