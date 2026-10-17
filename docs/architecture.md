# Nigehbaan --- Architecture

**Status:** Proposed MVP architecture\
**Principle:** Build the smallest reliable end-to-end workflow within
the 36-hour hackathon.

------------------------------------------------------------------------

## 1. Architecture goals

1.  Keep frontend and backend in one repository.
2.  Make report intake resilient to AI provider failure.
3.  Keep priority scoring deterministic and testable.
4.  Require human approval for resource assignment.
5.  Keep the demo repeatable using seeded fictional data.
6.  Avoid complex infrastructure that does not improve the core
    workflow.

## 2. Proposed stack

  -----------------------------------------------------------------------
  Layer                   Choice                  Use
  ----------------------- ----------------------- -----------------------
  Web application         Next.js App Router +    Pages and server-side
                          TypeScript              routes

  Styling                 Tailwind CSS +          Consistent, accessible
                          shadcn/ui               components

  Icons                   lucide-react            UI icons

  Data Store              In-Memory / Local       Zero-dependency resilient
                          Storage Repository      state for Vercel demo;
                          (Primary) + Supabase    instant, pre-warmed,
                          PostgreSQL adapter      100% reliable uptime

  Audio / Voice           Web Audio API + Audio   Playback, waveform,
                          Visualizer + Bilingual  and Urdu/English speech
                          Speech Adapter          transcription for voice

  Authentication          Demo mode / Session     Coordinator access;
                          only if needed          demo mode is standard
                                                  for the MVP

  AI                      LLM API adapter         Extract structured
                          (Gemini) with instant   incident details and
                          heuristic fallback      explainability rationale

  Validation              Zod                     Validate request
                                                  payloads and AI output

  Map                     Leaflet + React Leaflet Incident/resource
                                                  markers using simulated
                                                  coordinates

  Charts                  Recharts only where     Small operational
                          useful                  summaries

  Deployment              Vercel                  Public demo

  Source control          GitHub                  Code, commits,
                                                  submission repository
  -----------------------------------------------------------------------

Use current stable package versions compatible with the environment. Do
not spend hackathon time migrating versions without a concrete blocker.

## 3. High-level system flow

``` text
Citizen Report Form  OR  Voice Call Hotline (Urdu/English)  OR  Proxy Intake
            |                           |                           |
            +---------------------------+---------------------------+
                                        |
                                        v
                               POST /api/incidents
                                        |
                                        +----> Validate input (Zod)
                                        |
                                        +----> Save original report / audio first
                                        |
                                        +----> AI extraction & transcription service
                                        |           |
                                        |           +----> Validate structured result
                                        |           +----> On failure, keep report & mark review needed
                                        |
                                        v
                                 Incident record
                                        |
                                        +----> Deterministic priority engine (MCDA 5-factor)
                                        |           |
                                        |           +----> Enforce vulnerability floor (4.0/5.0)
                                        |           +----> Generate explainable audit rationale
                                        |
                                        +----> Uncertainty detection & Sector Blind-Spot Monitor
                                        |           |
                                        |           +----> Synthesize system_blind_spot incidents
                                        |
                                        v
                            Coordinator Dashboard + Map
                                        ^
                                        | (Driven by Timeline Scrubber: T-0, T-3, T-6, T-12)
                                        v
                          Resource recommendation service
                                        |
                                        v
                          Human approves / edits / rejects
                                        |
                                        v
                       Assignment + activity log + UI update
```

## 4. Application areas and routes

Suggested route map:

``` text
/
  -> Redirect to /dashboard or show a small project entry screen

/dashboard
  -> Main operations overview: incident queue, map, resource summary

/incidents
  -> Filterable incident list

/incidents/new
  -> Public/simple report form

/incidents/[id]
  -> Incident details, priority explanation, uncertainty flags, actions

/resources
  -> Resource inventory and assignments

/uncertainty
  -> Uncertainty Radar: missing, stale, conflicting, potential duplicates, and sector blind-spot telemetry

/simulation
  -> Start/reset demo scenario and inspect event progression

/settings
  -> Demo/data controls only if needed; do not build extensive settings
```

For the hackathon, the most important views are `/dashboard`,
`/incidents/new`, `/incidents/[id]`, `/resources`, and the simulation
controls. Avoid building a complex marketing site unless the core
product is already complete.

## 5. Suggested folder structure

``` text
nigehbaan/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── incidents/page.tsx
│   │   ├── incidents/new/page.tsx
│   │   ├── incidents/[id]/page.tsx
│   │   ├── resources/page.tsx
│   │   ├── uncertainty/page.tsx
│   │   └── simulation/page.tsx
│   ├── api/
│   │   ├── incidents/route.ts
│   │   ├── incidents/[id]/route.ts
│   │   ├── incidents/[id]/assign/route.ts
│   │   ├── resources/route.ts
│   │   ├── uncertainty/route.ts
│   │   ├── sectors/blind-spots/route.ts
│   │   └── simulation/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── incidents/
│   ├── resources/
│   ├── uncertainty/
│   ├── maps/
│   └── ui/
├── lib/
│   ├── ai/
│   │   ├── provider.ts
│   │   ├── extract-incident.ts
│   │   └── schemas.ts
│   ├── db/
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── incidents/
│   │   ├── priority.ts
│   │   ├── duplicate-check.ts
│   │   ├── uncertainty.ts
│   │   └── validation.ts
│   ├── resources/
│   │   ├── recommend.ts
│   │   └── assignments.ts
│   ├── simulation/
│   │   ├── scenarios.ts
│   │   └── runner.ts
│   ├── audit/
│   │   └── log.ts
│   └── utils.ts
├── types/
│   ├── incident.ts
│   ├── resource.ts
│   ├── assignment.ts
│   └── sector.ts
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
│   ├── priority.test.ts
│   ├── uncertainty.test.ts
│   └── resource-recommendation.test.ts
├── .env.example
├── AGENTS.md
├── DESIGN.md
├── README.md
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── trade-offs.md
│   ├── rules.md
│   └── memory.md
```

This is a target structure, not a reason to create empty files for every
item immediately. Add folders as implementation reaches each phase.

## 6. Data model

Use UUID primary keys and timestamps. Exact SQL types can be finalized
during implementation.

### `incidents`

-   `id`
-   `incident_code` (human-readable, e.g. `NG-104`)
-   `original_report` (required)
-   `incident_type`
-   `status` (`new`, `needs_review`, `verified`, `assigned`,
    `in_progress`, `resolved`, `closed`)
-   `latitude`, `longitude` (nullable)
-   `location_text` (nullable)
-   `location_status` (`confirmed`, `approximate`, `missing`,
    `unverified`)
-   `people_affected` (nullable integer)
-   `medical_urgency` (nullable structured value)
-   `vulnerability_notes` (nullable)
-   `hazards` (JSONB or normalized fields)
-   `extracted_fields` (JSONB)
-   `extraction_status` (`pending`, `succeeded`, `failed`, `manual`)
-   `priority_score` (numeric, nullable until assessed)
-   `priority_category`
-   `factor_scores` (JSONB)
-   `information_confidence` (separate from priority; nullable)
-   `reporter_type` (`self`, `community_volunteer`, `field_worker`, `radio_relay`, `system_blind_spot`)
-   `communication_status` (`has_phone`, `no_phone`, `network_down`, `unknown`)
-   `proxy_reporter_name` (nullable)
-   `proxy_reporter_contact` (nullable)
-   `sector_id` (nullable UUID, references `sectors.id`)
-   `is_simulated` (boolean)
-   `reported_at`, `created_at`, `updated_at`

### `resources`

-   `id`
-   `name`
-   `resource_type` (`rescue_team`, `boat`, `ambulance`, `supply_kit`,
    `shelter_capacity`, etc.)
-   `capabilities` (JSONB or array)
-   `status` (`available`, `assigned`, `unavailable`, `maintenance`)
-   `latitude`, `longitude` (nullable)
-   `current_assignment_id` (nullable if circular reference is avoided)
-   `is_simulated`
-   `updated_at`

### `assignments`

-   `id`
-   `incident_id`
-   `resource_id`
-   `status` (`proposed`, `approved`, `in_progress`, `completed`,
    `cancelled`)
-   `recommendation_reason`
-   `constraints` (JSONB)
-   `approved_by` (nullable in demo)
-   `approved_at`
-   `created_at`, `updated_at`

### `uncertainty_flags`

-   `id`
-   `incident_id` (nullable UUID when originating from sector silence)
-   `sector_id` (nullable UUID, references `sectors.id`)
-   `flag_type` (`missing_info`, `conflict`, `stale`,
    `possible_duplicate`, `location_unverified`, `coverage_blind_spot`)
-   `severity`
-   `description`
-   `evidence` (JSONB; store the relevant fields/report references, not
    unnecessary private data)
-   `status` (`open`, `under_review`, `resolved`, `dismissed`)
-   `resolution_note`
-   `created_at`, `updated_at`

### `sectors`

-   `id` (UUID)
-   `sector_name` (e.g. `Sector 3A - Riverbank`)
-   `polygon_coordinates` (JSONB lat/lng array)
-   `risk_level` (`low`, `moderate`, `high`, `critical`)
-   `last_report_at` (timestamp, nullable)
-   `infrastructure_status` (`normal`, `cellular_down`, `power_outage`, `isolated`)
-   `silent_duration_minutes` (integer)
-   `suggested_action` (e.g. `dispatch_physical_welfare_check`)
-   `is_simulated` (boolean)
-   `created_at`, `updated_at`

### `activity_log`

-   `id`
-   `actor_type` (`coordinator`, `system`, `simulation`)
-   `actor_label`
-   `action`
-   `entity_type`
-   `entity_id`
-   `summary`
-   `metadata` (JSONB; never include API keys or secrets)
-   `created_at`

### Demo scenario

For the MVP, use seeded data with `is_simulated = true`. Do not mix demo
data and real reports without a clear visible distinction.

## 7. Service boundaries

### AI extraction service

Input: original report and optional user-provided form fields.\
Output: schema-validated candidate facts, missing fields, and
uncertainty notes.\
Must not: assign the final priority, invent a precise location, diagnose
a person, or make dispatch decisions.

### Priority service

Input: verified/available incident factors and configured weights.\
Output: deterministic score, category, and factor-by-factor
explanation.\
Enforces vulnerability score baseline (minimum 4.0/5.0) for no-phone
households and system blind spots.\
Must not: hide missing factors or treat confidence as urgency.

### Uncertainty service

Input: incident data, timestamps, related reports, route/resource
facts, sector telemetry.\
Output: flags for human review and sector-linked system incidents.\
Monitors sector telemetry and raises `coverage_blind_spot` flags when
hazard zones have no communications traffic for a configured threshold
duration. Upon escalation, automatically generates a synthetic incident
record with `reporter_type: 'system_blind_spot'` linked to `sector_id`,
allowing dead zones to seamlessly enter the standard incident queue,
deterministic priority engine, and resource recommendation workflow.\
Must not: silently delete/merge reports or declare uncertain claims
false.

### Resource recommendation service

Input: incident requirements, available resource capabilities,
assignment status, known constraints.\
Output: ranked compatible candidates and reasons.\
Must not: perform real dispatch or mark a resource assigned until a
human approves.

### Simulation service

Input: scenario ID and event index or timeline phase (`T0`, `T3`, `T6`, `T12`).\
Output: deterministic changes to simulated records, sector statuses, and activity log.\
Must not: modify real data or hide that events are simulated.

### Bilingual voice intake & transcription service

Input: raw or simulated audio recording / speech stream (Urdu or English).\
Output: dual-language transcript, translation, detected vocal urgency cues, confidence score.\
Must not: invent callers or fabricate transcripts without source audio.

### Explainable rationale service

Input: incident factor scores, baseline elevation, flood speed, mobility notes.\
Output: human-auditable transparent rationale bullets explaining the priority ranking.\
Must not: override deterministic math with non-deterministic text.

## 8. API design

Recommended minimal routes:

  -----------------------------------------------------------------------
  Method + route                      Purpose
  ----------------------------------- -----------------------------------
  `POST /api/incidents`               Save report, attempt extraction,
                                      calculate initial assessment

  `POST /api/incidents/audio`         Ingest simulated/real voice call,
                                      return transcription and entity candidates

  `GET /api/incidents`                List/filter incidents

  `GET /api/incidents/:id`            Retrieve incident and flags

  `PATCH /api/incidents/:id`          Coordinator
                                      edits/status/verification

  `GET /api/resources`                List resources and availability

  `POST /api/incidents/:id/assign`    Create recommendation or approve
                                      assignment, depending on explicit
                                      action

  `GET /api/uncertainty`              List open uncertainty flags

  `PATCH /api/uncertainty/:id`        Update review status/resolution

  `GET /api/sectors/blind-spots`      Returns spatial telemetry for silent
                                      and offline map sectors

  `POST /api/simulation/start`        Reset/load the fictional scenario

  `POST /api/simulation/next`         Apply the next deterministic event

  `POST /api/simulation/timeline`     Scrub scenario state to target phase
                                      (`T0`, `T3`, `T6`, `T12`)

  `POST /api/simulation/reset`        Restore the baseline demo dataset
  -----------------------------------------------------------------------

Use explicit action names for proposal vs approval; do not let one
ambiguous endpoint both recommend and dispatch.

## 9. AI extraction contract

The model should return JSON matching a schema similar to:

``` json
{
  "incidentType": "flood_rescue",
  "locationText": "near the main market",
  "latitude": null,
  "longitude": null,
  "locationStatus": "unverified",
  "peopleAffected": 6,
  "immediateHazards": ["water rising"],
  "medicalUrgency": "reported_injury",
  "mobilityConcerns": ["elderly person unable to walk"],
  "missingInformation": ["exact address"],
  "uncertainClaims": ["water is rising rapidly"],
  "evidenceQuotes": [
    "Water is rising rapidly",
    "one person is injured"
  ]
}
```

The model must not fabricate coordinates. Coordinates may only come from
a user selection, trusted geocoding result, or seeded simulation.
Validate enum values and bounds with Zod. If output is invalid, retry at
most once if time/cost permits, then mark for manual review.

## 10. Deployment and environment

Expected environment variables (names can change to match the selected
provider): - `NEXT_PUBLIC_SUPABASE_URL` -
`NEXT_PUBLIC_SUPABASE_ANON_KEY` - `SUPABASE_SERVICE_ROLE_KEY`
(server-only; never expose in client) - `LLM_API_KEY` (server-only) -
`LLM_MODEL` (optional) - `NEXT_PUBLIC_APP_MODE=demo`

Create `.env.example` with placeholders only. Never commit `.env.local`
or real credentials. The frontend must not receive server-only keys.

## 11. Fallback architecture

If database setup or external APIs consume too much time: 1. Keep the
service interfaces. 2. Use a local in-memory or seeded demo repository
only for a clearly labelled local demo. 3. Ensure the deployed version
has a deterministic fallback scenario. 4. Never pretend local in-memory
changes persist across server restarts. 5. Prefer the smallest
end-to-end implementation over half-finished infrastructure.

## 12. Architecture decisions

-   **One repository:** reduces coordination and deployment overhead.
-   **AI only for extraction and summarization:** keeps safety-critical
    scoring explainable.
-   **Deterministic scoring:** repeatable tests and understandable
    decisions.
-   **Human approval:** prevents the prototype from claiming autonomous
    emergency dispatch.
-   **Simulated data:** makes the demo reliable without pretending to
    have live disaster feeds.
-   **Simple resource rules:** enough to demonstrate constraints without
    building a complex optimizer.
-   **Sector-to-incident synthesis:** Dead-zone sector escalations generate
    a linked synthetic incident record (`reporter_type: 'system_blind_spot'`)
    rather than requiring a parallel dispatch system. This leverages the
    existing incident queue, priority scoring engine, and recommendation
    pipeline uniformly.
