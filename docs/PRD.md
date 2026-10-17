# Nigehbaan --- Product Requirements Document (PRD)

**Project:** Nigehbaan\
**Event:** CODE//CONNECT'26 --- Vibe Coding Hackathon\
**Chosen problem:** Problem 01 --- Disaster Response\
**Document status:** Hackathon MVP scope\
**Version:** 1.0\
**Primary tagline:** *Clear priorities. Coordinated response.*

------------------------------------------------------------------------

## 1. Executive summary

Nigehbaan is an AI-assisted disaster-response coordination prototype for
flood emergencies. It helps an emergency coordinator turn scattered,
unstructured reports into structured incidents, understand which reports
may need urgent attention, identify missing or conflicting information,
and recommend suitable resource assignments.

The MVP will demonstrate a complete workflow using clearly labelled
fictional data: submit a report, extract its details, assess priority
using transparent deterministic rules, review uncertainty, recommend a
resource, approve an assignment, and see the dashboard update when
conditions change.

Nigehbaan is a **decision-support prototype**, not an autonomous
emergency-dispatch system. A human coordinator remains responsible for
consequential decisions.

## 2. Problem statement

During floods and other disasters, warnings and reports may be
incomplete, late, duplicated, inaccurate, or unavailable because of
connectivity failures. Some residents---such as elderly people, people
with disabilities, people living alone, and people unable to evacuate
independently---may be especially vulnerable. Rescue teams, vehicles,
shelters, and supplies are limited.

Coordinators need a clearer way to organize incoming reports, assess
urgency, understand uncertainty, and coordinate available resources.

## 3. Product vision

Help responders build a clearer operational picture from imperfect
information and make more transparent, reviewable coordination
decisions.

### Product promise

> Turn scattered emergency reports into explainable priorities and
> actionable resource recommendations.

### What success looks like

A judge or user can submit a report and follow the complete journey from
raw text to structured incident, priority explanation, uncertainty
review, resource recommendation, human approval, and status update
without relying on slides or hidden manual steps.

## 4. Target users

### Primary user: Emergency coordination officer

Needs to review multiple incidents, compare urgency, check uncertain
information, and coordinate limited resources from one dashboard.

### Secondary user: Volunteer or community reporter (including Community Proxy Reporter)

Needs a simple way to submit an emergency report without knowing
technical incident categories or completing every field. Also acts as a
Community Proxy Reporter submitting on behalf of vulnerable neighbors,
family members, or residents who lack phones or connectivity.

### Demo-only stakeholder: Evaluator

Needs to understand the problem, see the product work live, inspect how
decisions are made, and understand limitations.

## 5. Scope

### In scope for the MVP

1.  Coordinator operations dashboard.
2.  Simple emergency-report submission form.
3.  AI-assisted extraction of structured facts from report text.
4.  Preservation of the original report and distinction between reported
    facts, extracted fields, and unknown information.
5.  Deterministic, explainable incident-priority scoring.
6.  Incident queue with filters and status indicators.
7.  Interactive map using clearly labelled simulated coordinates.
8.  Resource inventory and suitability-aware assignment recommendations.
9.  Human approval/override of assignments.
10. Uncertainty Radar for missing, stale, conflicting, and potential
    duplicate reports.
11. A limited What-If scenario for a road closure or unavailable
    resource, if the core workflow is stable.
12. Seeded flood simulation for a repeatable live demo.
13. Error states and graceful handling when the AI provider is
    unavailable.
14. Basic audit/activity log for important coordinator actions.
15. Dual-mode intake: Direct self-reporting and Community Proxy intake
    (tracking subject phone accessibility).
16. Sector Blind-Spot detection for zero-report / communications-down
    hazard areas.
17. Bilingual (Urdu / English) Voice & Audio Distress Ingestion & Transcription
    with audio visualizer waveform, designed specifically for low-literacy,
    elderly, or panicking victims unable to navigate text forms.
18. Interactive Disaster Timeline Scrubber (T-0 to T-12) simulation progression
    enabling operators to observe flooding surge, communication tower collapses,
    and evolving blind spots dynamically.
19. Explainable AI Rationale Cards providing transparent, human-auditable
    justifications alongside deterministic priority scores.

### Explicitly out of scope

-   Real emergency dispatch or contact with emergency services.
-   Claims of live flood prediction or satellite analysis without real,
    validated data.
-   Autonomous decisions about who receives rescue.
-   Medical diagnosis or clinically validated triage.
-   Facial recognition, identity tracking, or invasive surveillance.
-   Training a new AI model from scratch.
-   Production-grade national-scale operations, guaranteed offline
    synchronization, or operational routing.
-   Treating generated priority scores as scientifically validated
    emergency standards.

## 6. Main user journeys

### Journey A --- Submit and process an emergency report

1.  Reporter opens the report form.
2.  Reporter enters a natural-language description and any known
    location/details.
3.  System saves the original report before attempting AI extraction.
4.  AI returns a validated structured extraction, or the incident
    remains saved and marked `processing_failed`/`needs_review`.
5.  UI shows extracted fields and explicitly marks unknown or
    unconfirmed details.
6.  Coordinator can edit/correct the extraction.

### Journey B --- Review incident priority

1.  Coordinator opens the incident queue.
2.  Incidents are ordered using deterministic scoring rules and
    tie-breakers.
3.  Coordinator opens an incident.
4.  System displays score, category, contributing factors, source
    details, uncertainty flags, and missing information.
5.  Coordinator may request clarification, mark information verified,
    change status, or proceed to resource review.

### Journey C --- Recommend and approve a resource

1.  Coordinator selects an incident.
2.  System filters resources by availability and capability.
3.  System explains the recommended resource and any known constraints.
4.  Coordinator approves, rejects, or changes the recommendation.
5.  Assignment and activity log update; resource availability changes
    consistently.

### Journey D --- Resolve uncertainty

1.  Uncertainty Radar displays incomplete, stale, contradictory, or
    potentially duplicated reports.
2.  Coordinator opens a flag and reviews its evidence.
3.  Coordinator records a resolution, requests verification, or leaves
    the flag open.
4.  The system does not silently discard or merge reports.

### Journey E --- Run and scrub a multi-phase disaster simulation

1.  Coordinator initiates or scrubs the simulation across key timeline
    phases (`T-0 Early Warning`, `T+3 Flood Surge`, `T+6 Grid Blackout`, `T+12 Peak Crisis`).
2.  Predefined fictional incidents arrive in sequence; water levels rise;
    road cutoffs activate dynamically.
3.  Cellular towers fail at T+6, triggering automated `coverage_blind_spot`
    escalations in the Uncertainty Radar.
4.  A road-closure/resource-shortage event affects a proposed
    assignment.
5.  System flags affected decisions and asks for human review.
6.  Coordinator reviews and approves an alternative or leaves the case
    unresolved.

### Journey F --- Detect and respond to an unreachable blind spot

1.  System monitors incoming report density across predefined geographical
    sectors.
2.  When a high-hazard sector exhibits zero incoming communications past
    a configured threshold duration, the system raises a
    `coverage_blind_spot` uncertainty flag and visualizes the silent
    sector polygon on the map.
3.  The priority engine assigns the sector incident an automatic high
    baseline vulnerability score.
4.  The coordinator opens the blind spot from the map or Uncertainty
    Radar and initiates a physical welfare check / recon sweep dispatch.

### Journey G --- Ingest and process bilingual voice / audio distress calls

1.  A caller or field scout submits a voice distress recording (simulated Urdu or English).
2.  System generates a real-time audio waveform visualizer and plays back the voice signal.
3.  AI speech-to-text service provides dual-language transcription and translation.
4.  Extracted entities (medical urgency, water depth, mobility impairment) are structured
    and fed into the deterministic priority engine and incident queue with visible provenance.
5.  Coordinator inspects the raw audio, transcript, and AI-extracted candidates side-by-side.

## 7. Functional requirements

  ----------------------------------------------------------------------------
  ID                Requirement       Priority          Acceptance condition
  ----------------- ----------------- ----------------- ----------------------
  FR-01             Create an         Must              Original text and
                    incident from a                     creation time are
                    report                              saved and shown

  FR-02             Extract           Must              Validated output fills
                    structured report                   supported fields;
                    details with AI                     unsupported facts
                                                        remain unknown

  FR-03             Work when AI      Must              Report remains saved
                    extraction fails                    and can be reviewed
                                                        manually

  FR-04             Calculate a       Must              Same inputs produce
                    deterministic                       same score; factors
                    priority score                      and formula are
                                                        visible

  FR-05             Show an           Must              User can see category,
                    explainable                         status, location
                    incident queue                      quality, and priority

  FR-06             Display incidents Must              Selecting a map marker
                    on an interactive                   and incident row opens
                    map                                 the same incident

  FR-07             Manage resource   Must              Availability,
                    inventory                           capability, and
                                                        assignment status are
                                                        visible

  FR-08             Recommend         Must              Assigned/unavailable
                    compatible                          resources are
                    resources                           excluded; reason is
                                                        shown

  FR-09             Require human     Must              No recommendation
                    approval for                        changes to an
                    assignment                          assignment without
                                                        coordinator action

  FR-10             Detect missing    Must              Missing location or
                    required                            other configured
                    information                         fields produce a
                                                        review flag

  FR-11             Flag potential    Must              Likely duplicates are
                    duplicate reports                   flagged for review,
                                                        never silently merged

  FR-12             Surface           Must              Contradictory
                    conflicting                         road/incident
                    reports                             information is visible
                                                        with timestamps/source
                                                        text

  FR-13             Record important  Must              Assignment, status
                    actions                             changes, overrides,
                                                        and verification
                                                        actions create log
                                                        entries

  FR-14             Run repeatable    Must              One action loads/plays
                    flood simulation                    a known scenario and
                                                        updates the UI

  FR-15             What-If planning  Should            Road closure or
                                                        resource
                                                        unavailability flags
                                                        affected assignments

  FR-16             Save a report     Could             Only if core
                    draft locally                       functionality is
                                                        complete; clearly
                                                        distinguish local
                                                        draft from server
                                                        receipt

  FR-17             Authentication    Could             Add only if it does
                                                        not jeopardize the
                                                        demo; otherwise use a
                                                        clearly labelled demo
                                                        mode

  FR-18             Sector Blind-Spot Must              System evaluates
                    Detection                           monitored geographical
                                                        sectors and flags areas
                                                        with zero reports or
                                                        confirmed cellular
                                                        outages as
                                                        coverage_blind_spot
                                                        incidents requiring
                                                        manual field sweeps /
                                                        welfare checks

  FR-19             Community Proxy   Must              Report intake supports
                    Reporting                           filing on behalf of
                                                        others and records
                                                        whether the affected
                                                        subject has phone
                                                        access

  FR-20             Bilingual Voice   Must              System supports voice
                    Distress Intake                     distress playback,
                    & Transcription                     interactive audio waveform,
                                                        and bilingual Urdu/English
                                                        speech transcription

  FR-21             Interactive       Must              Scrubber control advances
                    Disaster Timeline                   disaster scenario across
                    Scrubber                            T-0, T-3, T-6, and T-12,
                                                        updating water levels, road
                                                        cutoffs, and blind spots

  FR-22             Explainable AI    Must              Every incident score is
                    Rationale Cards                     accompanied by a transparent
                                                        human-auditable summary of
                                                        why it was prioritized
  ----------------------------------------------------------------------------

## 8. Priority model

The prototype will use deterministic rules, not an LLM-generated final
score. Proposed factor weights are initial engineering assumptions for
demonstration and **are not clinically or operationally validated**.

  Factor                                         Initial weight
  -------------------------------------------- ----------------
  Immediate threat to life                                  30%
  Medical urgency                                           25%
  Vulnerability / inability to self-evacuate                20%
  Environmental danger / time sensitivity                   15%
  Number of people potentially affected                     10%
  **Total**                                            **100%**

Each factor may be represented on a documented 0--5 scale. Weighted
score: `sum((factor_score / 5) * weight)` producing 0--100.

Requirements: - Explain the contribution of each factor. - Preserve
unknown values as unknown; do not silently treat missing data as zero
risk. - Vulnerability baseline floor: If `communication_status == 'no_phone'`
or `reporter_type == 'system_blind_spot'`, the vulnerability factor receives
an automatic minimum baseline score of `4.0 / 5.0` (guaranteeing at least a
16-point contribution to total priority). - Display information confidence
separately from incident urgency. - Low confidence must trigger review, not
automatically deprioritize an incident. - Use transparent, configurable
categories such as Critical / High / Moderate / Low; thresholds must be
documented and tested. - Human coordinator can override a recommendation,
with a reason recorded. - Include a disclaimer that this is a demonstration
scoring model, not validated emergency triage.

## 9. Uncertainty Radar requirements

The feature flags: - Missing or unconfirmed location. - Required
information missing. - Conflicting claims (e.g., road reported open and
blocked). - Stale information based on configurable age. - Potential
duplicate reports based on shared location, time window, and text
similarity or simple matching. - Unreachable coverage blind spots
(monitored hazard sectors exhibiting zero incoming reports or confirmed
telecommunication outages).

Each flag must show: - What is uncertain. - Which reports/fields
triggered the flag. - When the information was received. - Operational
decisions potentially affected. - Suggested verification action. -
Current review status.

The system must not automatically delete, merge, or label a
person/report as untrustworthy solely because of an algorithmic match.

## 10. Non-functional requirements

-   **Usability:** Main incident status and recommended next action
    should be understandable at a glance.
-   **Accessibility:** High contrast, keyboard-usable controls, labels
    beyond color alone, readable type, and clear focus states.
-   **Performance:** Common dashboard interactions should feel
    responsive with the seeded demo dataset.
-   **Reliability:** AI failure must not destroy the original report.
-   **Data integrity:** Resource availability and assignment states must
    stay consistent.
-   **Security:** API keys server-side; validate inputs; avoid exposing
    personal details unnecessarily.
-   **Transparency:** Clearly distinguish simulated data, reported
    facts, AI-extracted fields, and system recommendations.
-   **Responsive behavior:** Coordinator dashboard optimized for
    laptop/desktop; report form usable on mobile.
-   **Observability:** Errors are visible to the operator in useful
    language; do not leak secrets or raw sensitive stack traces.

## 11. Demo data and scenario

Use a fictional area named `District Alpha` and clearly label all
incidents, resource locations, road conditions, shelters, and metrics as
simulated.

Suggested scenario events: 1. Family stranded in rising water; exact
location partly missing. 2. Elderly resident unable to self-evacuate. 3.
Multiple houses affected; no immediate injury reported. 4. Two reports
may refer to the same incident. 5. Conflicting reports about a road
being open/blocked. 6. A rescue resource becomes unavailable or a route
restriction is added. 7. Sector 3A (Riverbank settlement) has 0 reports
for 90 minutes while flood water level rises; system flags a
`coverage_blind_spot` and generates a physical welfare check dispatch
recommendation.

No real people's private data or live emergency calls should be used.

## 12. Success metrics for the prototype

These are prototype acceptance measures, not real-world impact claims: -
Complete the report-to-assignment workflow during the demo. - Every
displayed priority has a visible explanation. - All seeded
missing/conflicting/duplicate cases trigger the expected flags. - AI
failure leaves the report accessible for manual review. - Unavailable
resources cannot be assigned. - Human override is possible and logged. -
Demo can be reset and replayed. - A first-time evaluator can understand
the main workflow with minimal verbal explanation.

## 13. Risks and mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  AI invents details                  Structured schema, validation,
                                      original report visible, unknown
                                      values allowed

  Incorrect priority ordering         Transparent rules, scenario tests,
                                      human control, explicit limitations

  False duplicate detection           Flag only; require human
                                      confirmation

  Map data mistaken for live data     Persistent "SIMULATED DATA" label

  API limits/outage                   Save first, fallback to manual
                                      processing and seeded demo

  Scope grows too large               Must/Should/Could priorities;
                                      finish end-to-end flow first

  Deployment fails near deadline      Deploy early, keep seeded
                                      local/demo path, test live URL

  Unclear event AI policy             Confirm detailed AI-tool rules with
                                      organizers before relying on a tool
                                      or service
  -----------------------------------------------------------------------

## 14. Submission readiness

Before the hackathon deadline, prepare: - Team name and registered
member names. - Public working demo URL. - GitHub repository with commit
history. - Brief product description. - Key features. - Tools and
technologies. - AI usage disclosure. - Demo instructions and any
credentials.

The uploaded instructions state that commits after 10:00 PM on 18
October 2026 cause disqualification. Plan the final push and verify
repository accessibility before that cutoff.
