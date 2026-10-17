# Nigehbaan --- Project Memory / Handoff

> This is the living handoff document for the coding agent and team.
> Update it at the end of every meaningful implementation phase and
> before switching chats or tools. Keep it factual: distinguish
> completed work from planned work.

## 1. Project identity

-   **Name:** Nigehbaan
-   **Hackathon:** CODE//CONNECT'26 --- Vibe Coding Hackathon
-   **Chosen problem:** Problem 01 --- Disaster Response
-   **Initial scenario:** Flood emergency in a fictional district
-   **Product type:** AI-assisted emergency coordination
    decision-support prototype
-   **Core promise:** Turn scattered emergency reports into explainable
    priorities and actionable resource recommendations.
-   **Core differentiator:** Uncertainty Radar for missing, stale,
    conflicting, and potential duplicate reports.
-   **Human control:** A coordinator approves assignments; the system
    does not dispatch real services.
-   **Demo data:** Must be clearly labelled simulated.

## 2. Source-of-truth files

Read these before coding: 1. `PRD.md` --- what to build and acceptance
criteria. 2. `architecture.md` --- routes, data model, stack, and
boundaries. 3. `rules.md` --- engineering rules, AI boundaries, error
handling, phases, and deadline. 4. `DESIGN.md` --- Nigehbaan UI
system and operational tokens. 5. `memory.md` --- current
implementation state and handoff.

If these files conflict, stop and document the conflict instead of
silently inventing a decision. The PRD defines product scope; `rules.md`
defines safety and development constraints.

## 3. Current decisions

-   Primary user: emergency coordination officer.
-   Secondary user: citizen/volunteer using a simple report form.
-   Primary interface: operations dashboard with incident queue, map,
    selected incident panel, and resource summary.
-   Core AI task: extract structured facts from original report text.
-   Priority calculation: deterministic, transparent application
    code---not an LLM.
-   Uncertainty: shown separately from urgency.
-   Resource allocation: compatibility-aware recommendation with
    explicit human approval.
-   Data source for demo: seeded fictional incidents/resources.
-   Design system: Nigehbaan operational crisis UI, characterized by
    high-density workflow clarity, calm neutral surfaces, and semantic
    emergency colors.
-   Proposed stack: Next.js App Router + TypeScript +
    Tailwind/shadcn/ui + Leaflet + Vercel.
-   Data store: Primary zero-dependency in-memory / local storage
    repository with pre-warmed scenario data for 100% resilient Vercel
    demo uptime and instant resets, with an optional Supabase PostgreSQL adapter.
-   AI Engine: LLM API adapter (Google Gemini) with automatic heuristic
    fallback so the deployed app functions reliably even without an API key.
-   Bilingual Voice Intake: Audio distress hotline supporting Urdu and
    English voice playback, waveform visualizer, and speech transcription.
-   Disaster Timeline Scrubber: Interactive simulation scrubber (`T-0`, `T-3`,
    `T-6`, `T-12`) driving environmental water levels, road closures, and
    cell tower blackouts dynamically.
-   Explainable Triage: Deterministic 5-factor scoring accompanied by
    human-auditable natural-language audit rationale cards.
-   Unreachable Blind-Spot Escalation & Community Proxy Intake:
    Integrated into the Uncertainty Radar to treat the absence of data in
    high-risk zones as an active emergency. Support proxy intake for
    citizens without phones and automatic sector silence escalation.
-   Sector-to-Incident Synthesis: Sector blind-spot escalations generate
    a synthetic incident (`reporter_type = 'system_blind_spot'`) linked to
    `sector_id`, unifying blind-spot triage, priority scoring, and physical
    welfare patrol dispatch inside the existing incident workflow.

## 4. Current status

**Last updated:** 2026-10-17 14:03 PKT\
**Current phase:** Phase 0 --- Bootstrap and visual shell\
**Team Name:** Byte Alpha's\
**Members:** Syed Ali Hashmi (Team Leader, EB-24210106108, 3rd Year BSSE UBIT), Syed Umer Hashmi (2nd Year BSCS)\
**Repository path/URL:** `https://github.com/alihashmi2288/Nigehbaan.git`\
**Deployment URL:** `https://nigehbaan.vercel.app` (Target Vercel)\
**Database project:** Zero-dependency in-memory reactive repository pre-warmed with Sindh flood scenario\
**AI provider/model:** Google Gemini API (`@google/genai`) with pre-warmed deterministic heuristic fallback\
**Package manager:** npm\
**Current Git branch:** main\
**Last known good commit:** In progress

### Completed

-   [ ] Project initialized
-   [ ] Dashboard shell
-   [ ] Report intake and save
-   [ ] AI extraction and validation
-   [ ] Deterministic priority engine
-   [ ] Incident detail/queue
-   [ ] Map
-   [ ] Resource recommendations and approval
-   [ ] Uncertainty Radar
-   [ ] Simulation
-   [ ] Deployment
-   [ ] Submission package

### Current blockers

-   None recorded yet.

## 5. Latest implementation session

### Session --- 2026-10-17 14:19 PKT

-   **Phase/task:** Phase 0 --- Team Configuration & Agent Contract Hardening
-   **Implemented:**
    - Updated `AGENTS.md` with explicit Section 2.E ("Mandatory Living Memory & Decision History (`docs/memory.md`)") and strengthened Step 5 in Definition of Done. Every codebase decision, file creation, code edit, refactoring, and library addition must be logged in `docs/memory.md` with rationale and file paths.
    - Configured official team details (`Byte Alpha's`, Syed Ali Hashmi, Syed Umer Hashmi) and repository URL (`https://github.com/alihashmi2288/Nigehbaan.git`) in `README.md` and `docs/memory.md`.
    - Removed redundant `docs/demo-script.md` and `docs/submission.md`.
-   **Files added/changed:**
    - [`AGENTS.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/AGENTS.md)
    - [`README.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/README.md)
    - [`docs/memory.md`](file:///c:/Users/umerh/Desktop/Nigehbaan/docs/memory.md)
-   **Commands run:**
    - `git remote -v`, `git status` (inspected status without committing)
-   **Tests/checks:**
    - Verified all file paths and confirmed exact string replacements.
-   **Manual browser verification:** N/A (Documentation phase)
-   **Known issues:** None.
-   **Environment/deployment changes:**
    - Repository remote set to `https://github.com/alihashmi2288/Nigehbaan.git`.
-   **Decisions made and why:**
    - Hardened AI agent instructions so any agent working on the codebase is contractually obligated to record every decision and codebase change in `docs/memory.md`, ensuring full history preservation across sessions.
-   **Next smallest task:**
    - Phase 0 bootstrap: Initialize Next.js 14/15 App Router project structure with TypeScript, Tailwind CSS (`DESIGN.md` tokens), and Lucide icons.

## 6. Known constraints and risks

-   The hackathon runs for 36 hours.
-   The uploaded instructions say no Git commits after 10:00 PM on 18
    October 2026.
-   The supplied extracted instruction text includes an AI-tools section
    heading but not the detailed allowed/prohibited rules; the team must
    confirm the full policy with organizers.
-   AI may hallucinate; schema validation and manual review are
    required.
-   Priority weights are prototype assumptions, not validated emergency
    triage guidance.
-   Missing/uncertain information must not automatically reduce
    priority.
-   Map markers and scenario events are simulated unless explicitly
    verified otherwise.
-   API outage must not erase the original report.
-   Do not commit secrets or real personal data.

## 7. Agent handoff instructions

When starting a new chat/session: 1. Read all five project documents. 2.
Inspect the current repository and package scripts; do not assume the
code matches this memory. 3. Check `git status`, current branch, and
latest commit. 4. Compare actual implementation against the current
phase acceptance criteria in `rules.md`. 5. Run relevant checks before
making further changes. 6. Continue with the smallest unfinished task.
7. Update this file after implementation; never claim a feature is
complete without testing it. 8. Preserve working functionality and avoid
broad rewrites without a specific reason.

## 8. Demo narrative

Use a repeatable fictional flood scenario: 1. A family is stranded in
rising water; exact location is missing. 2. An elderly resident cannot
self-evacuate. 3. Several houses are affected. 4. Two reports may
describe the same incident. 5. Two reports conflict about road
accessibility. 6. A resource becomes unavailable or a road closure
affects a proposed assignment. 7. Sector 3A (Riverbank settlement) has 0
reports for 90 minutes while flood water level rises; system flags a
`coverage_blind_spot` and generates a physical welfare check dispatch
recommendation.

Show report intake, extracted facts, explainable priority, uncertainty
flags, resource recommendation, human approval, and reassessment. State
clearly that the data and simulation are fictional and that the
prototype is decision support---not a real dispatch service.
