# Nigehbaan --- Agent Rules, Engineering Standards, and Milestones

This file is the implementation contract for any AI coding agent or team
member working on Nigehbaan. Read it before making changes.

------------------------------------------------------------------------

## 1. Product rules

1.  Build Nigehbaan for **Problem 01 --- Disaster Response**, with flood
    response as the initial demo scenario.
2.  Optimize for a complete working prototype within the hackathon's
    36-hour window.
3.  The primary experience is the emergency coordinator dashboard. The
    report form is a lightweight supporting workflow.
4.  The core differentiator is the **Uncertainty Radar**.
5.  A limited What-If scenario is secondary; do not sacrifice core
    reliability to implement it.
6.  Use fictional, clearly labelled simulation data unless a source is
    genuinely connected and verified.
7.  Every feature must support incident intake, transparent
    prioritization, uncertainty review, resource coordination, or the
    live demonstration.
8.  Do not add features just because they are easy for an LLM to
    generate.

## 2. Design and UI rules

1.  Read `DESIGN.md` before implementing or changing UI.
2.  Implement the Nigehbaan operational design system defined in `DESIGN.md`
    with restrained, high-density layouts and consistent crisis tokens.
3.  Use shared components and design tokens; do not hard-code arbitrary
    colors and spacing throughout the application.
4.  Avoid generic AI-dashboard patterns: excessive gradients, decorative
    charts, giant empty hero sections, unnecessary glassmorphism, and
    cards for every small datum.
5.  Prefer clear hierarchy, compact but readable incident rows,
    meaningful status labels, and direct actions.
6.  Never communicate status through color alone; include text/icons.
7.  Ensure keyboard focus, form labels, visible error messages, adequate
    contrast, and responsive report intake.
8.  The dashboard should remain useful with no incidents, loading data,
    or failed API requests.
9.  Always show a persistent label such as `SIMULATED DATA` while the
    demo dataset is active.
10. Avoid fake "live" indicators, fake AI confidence claims, fabricated
    metrics, or unsubstantiated impact claims.

## 3. AI boundaries and safety rules

1.  The LLM may extract and summarize information from reports. It must
    not make the final emergency priority decision.
2.  Priority is calculated by deterministic, documented code.
3.  Never allow the LLM to invent precise coordinates, addresses,
    injuries, number of people, route status, or resource availability.
4.  Missing values must remain `null`/unknown and be visibly labelled.
5.  Preserve the original report. Show extracted values as candidates
    until reviewed where appropriate.
6.  Keep **urgency**, **information confidence**, and **verification
    status** separate.
7.  Low confidence must not automatically mean low priority.
8.  Potential duplicates and conflicting claims are flags for human
    review; never silently merge or delete reports.
9.  Resource recommendations must not dispatch real responders. A human
    must approve the simulated assignment.
10. Do not claim that priority scores are clinically, legally, or
    operationally validated.
11. Do not generate medical diagnoses or present the app as a substitute
    for trained emergency personnel.
12. Do not include real sensitive personal information in seeded data,
    logs, screenshots, or the demo.
13. Avoid storing more personal information than the prototype requires.
14. If an AI output cannot be validated, mark extraction as failed/needs
    review and allow manual handling.
15. The AI must NEVER guess or fabricate phone numbers, identities, or
    exact headcounts inside a blind spot. Blind spots are strictly
    geographical/sector entities, not fabricated people.
16. All emergency audio samples must be strictly simulated/fictional assets
    or synthesized voice; never use real individuals' actual distress calls.
17. Voice speech-to-text models must preserve transcription provenance and
    visibly mark low-confidence audio translations.
18. Opportunity Cost calculations must be 100% deterministic mathematical heuristics (asset availability count and turnaround queue delay). The LLM must NEVER generate opportunity cost estimates, delay minutes, or trade-off decisions.
19. Shelter capacity matching must be evaluated via deterministic state counters (bed capacity, backup power, clinical capability). Evacuees must never be assigned to shelters marked >95% full or suffering grid/generator failure.
20. Pre-disaster vulnerability baselines (LHW logs, dialysis registries) are treated as operational staging priors at T-0, not individual surveillance.

## 4. Data and decision rules

1.  Original report text and report timestamps are required.
2.  Location may be `confirmed`, `approximate`, `missing`, or
    `unverified`.
3.  Never infer coordinates from vague text without a trusted
    geocoding/user-selection step.
4.  Keep resource states consistent: a resource with an active approved
    assignment cannot also be `available`.
5.  A proposed assignment is not an approved assignment.
6.  Only update resource availability after an explicit
    assignment/status action.
7.  Record assignment approvals, overrides, verification changes, and
    resolutions in the activity log.
8.  For conflicting facts, show both claims, timestamps, and
    source/report references.
9.  For stale information, show its age and the threshold used to flag
    it.
10. The priority algorithm must be deterministic and unit-tested against
    predefined scenarios.
11. The prototype's priority weights and thresholds are assumptions;
    document them and avoid representing them as official emergency
    triage guidance.
12. Unknown factors must not silently become zero-risk factors. Handle
    unknowns explicitly and show the limitation.
13. An incident marked as `coverage_blind_spot` or `no_phone` must receive
    an automatic vulnerability floor boost ($4.0 / 5.0$) in the scoring
    engine.
14. Blind-spot actions must be categorized as 'Physical Welfare Recon /
    Field Sweep' until boots on the ground confirm the situation.
15. When a sector triggers a `coverage_blind_spot`, the system automatically
    creates a linked incident with `reporter_type = 'system_blind_spot'` and
    `sector_id` populated, ensuring it is tracked through the standard
    incident queue and assignment workflow without creating an isolated
    subsystem.
16. Audio intake records must store audio duration, waveform data,
    original language, and transcription timestamp alongside the structured incident.
17. Timeline progression events must execute deterministically; scrubbing
    backwards or pressing Reset must completely restore pristine baseline state.
18. Opportunity Cost Warnings must compute remaining assets in the sector and delay penalties (Delta t) to the next queued incident before confirmation dialog closes.
19. Two-stage resource recommendations must validate destination shelter occupancy and clinical readiness (e.g. dialysis capability) before proposing assignment.
20. At T-0 Early Warning, hydrological forecasts must map to pre-disaster vulnerability baselines to suggest staging before flood surges at T+3.

## 5. Error handling

### API and database

-   Validate all incoming payloads on the server.
-   Return useful, consistent error messages without stack traces or
    secrets.
-   Handle empty results, missing records, duplicate submissions, and
    database failures.
-   Do not show a successful submission state until the report has
    actually been saved.
-   If a write fails, clearly say that the report was not received by
    the server and provide a retry path.

### LLM provider

-   Set a reasonable request timeout.
-   Validate output against a schema.
-   If the provider fails, preserve the saved report and mark extraction
    as `failed` or `needs_review`.
-   Do not fabricate a successful AI result as a fallback.
-   Do not repeatedly retry in a loop; at most one controlled retry if
    appropriate.
-   Never expose provider keys in browser bundles, error messages, logs,
    or commits.

### Maps and external services

-   If map tiles or geocoding are unavailable, keep the incident list
    usable.
-   Never invent a route or claim a road is safe based only on map
    display.
-   Respect the service's usage terms and avoid excessive tile/geocoding
    requests.
-   If coordinates are missing, show an unlocated incident state instead
    of placing a false marker.

### UI states

Every main page should account for: - Loading. - Empty state. - Error
state. - Success/confirmation. - Partial data. - Stale data where
relevant. - Mobile layout for report intake.

## 6. Code quality rules

1.  Use TypeScript; avoid `any` unless a documented integration
    limitation requires it.
2.  Keep business logic out of large React components.
3.  Put priority logic, validation, duplicate checks, and resource
    recommendations in testable modules.
4.  Reuse components and tokens instead of duplicating styles.
5.  Use server-side routes for secrets and privileged operations.
6.  Do not add libraries without a concrete requirement.
7.  Prefer installed framework conventions over custom infrastructure.
8.  Avoid premature abstractions and over-engineering.
9.  Keep functions small and names descriptive.
10. Remove unused code, debug logs, dead routes, and placeholder buttons
    before submission.
11. Every visible button must work or be clearly disabled with an
    explanation.
12. Do not claim a feature is complete until it has been manually
    tested.
13. Run lint/type-check/build commands available in the project before
    final deployment.
14. Add tests for priority scoring, resource availability rules, and
    uncertainty detection.

## 7. Git and hackathon rules

1.  Commit in small, meaningful milestones and push frequently.
2.  Never manipulate timestamps or rewrite history to conceal late work.
3.  The provided hackathon instructions say **any Git commit after 10:00
    PM on 18 October 2026 causes disqualification**.
4.  Freeze code changes early enough to test the deployment and
    repository.
5.  Confirm the exact event rules with organizers if any ambiguity
    exists.
6.  Only registered team members may participate in development; do not
    share the implementation with other competing teams.
7.  Do not submit copied or unauthorized existing code.
8.  Include the required project description, features, technology list,
    AI usage disclosure, live URL, repository, team details, and demo
    instructions.
9.  The uploaded instructions include an "AI tools & development"
    section heading but the supplied extracted text does not contain its
    detailed allowed/prohibited tool rules. Confirm the complete policy
    with organizers; do not assume a particular coding agent, API, or
    workflow is permitted.
10. Verify the live link and GitHub repository are accessible before the
    deadline.

## 8. Phase plan

### Phase 0 --- Bootstrap and visual shell (target: hours 0--3)

-   Initialize Next.js/TypeScript project.
-   Add Tailwind and component library.
-   Read `DESIGN.md`.
-   Build app shell, navigation, and dashboard layout using seeded
    static data.
-   Acceptance: dashboard renders cleanly; no broken routes; responsive
    report entry point exists.

### Phase 1 --- Data model and incident intake (target: hours 3--7)

-   Define incident/resource/sector types and Zod schemas.
-   Build report form supporting direct self-reporting and Community Proxy
    intake (with subject phone accessibility selector).
-   Persist the original report before AI processing.
-   Add seeded/demo data and status handling.
-   Acceptance: a report can be created (direct or proxy) and is visible
    even if AI is disabled.

### Phase 2 --- AI extraction (target: hours 7--11)

-   Implement server-only provider adapter.
-   Extract structured fields.
-   Validate output and retain unknowns.
-   Add failure fallback and manual-review state.
-   Acceptance: complete, partial, and failed extraction cases work.

### Phase 3 --- Priority engine and incident details (target: hours 11--15)

-   Implement deterministic scoring and explanations.
-   Enforce vulnerability floor for no-phone and blind-spot incidents.
-   Build incident detail page and queue sorting/filtering.
-   Add unit tests for scoring.
-   Acceptance: same inputs yield same score; factor explanations are
    visible; vulnerability floor is enforced; uncertainty is not
    confused with urgency.

### Phase 4 --- Map and resources (target: hours 15--21)

-   Add Leaflet map, simulated markers, and sector polygon layer with
    dashed blind-spot borders.
-   Build resource inventory and recommendation rules (including
    Physical Welfare Recon patrols).
-   Add human approval and assignment consistency.
-   Acceptance: selecting an incident connects to its marker; clicking a
    blind spot opens Welfare Patrol Dispatch; unavailable resources
    cannot be assigned.

### Phase 5 --- Uncertainty Radar (target: hours 21--25)

-   Flag missing location, stale information, conflicts, potential
    duplicates, and unreachable coverage blind spots.
-   Build review/resolve actions and audit log.
-   Acceptance: seeded uncertainty cases and blind-spot escalations are
    visible and can be reviewed without silent merging/deletion.

### Phase 6 --- Demo simulation (target: hours 25--28)

-   Add start/next/reset controls.
-   Apply deterministic events to the simulated dataset.
-   Add limited What-If behavior only if core features are stable.
-   Acceptance: scenario can be replayed from a clean state and tells
    the intended story.

### Phase 7 --- Hardening and deployment (target: hours 28--32)

-   Test all critical journeys.
-   Fix build/type/lint issues.
-   Verify environment variables and public deployment.
-   Add loading/empty/error states.
-   Acceptance: public demo works and fallback data is ready.

### Phase 8 --- Submission and demo freeze (target: hours 32--36)

-   Prepare a short demo script and reset the simulation.
-   Verify the live link and repository.
-   Finish required submission information and AI usage disclosure.
-   Freeze commits before the hard deadline.
-   Acceptance: no unresolved blocker prevents the demo; final
    repository is accessible before cutoff.

The schedule is a planning guide, not permission to defer deployment
until the final hours. Deploy an early skeleton as soon as possible.

## 9. Definition of done for every phase

A phase is not done merely because the code was generated. It is done
when: - The feature works in the browser. - Empty/loading/error states
are considered. - The code passes relevant checks. - At least one
realistic test scenario passes. - The UI follows `DESIGN.md`. - The
agent summarizes files changed, tests run, known issues, and the next
phase.

## 10. Required coding-agent workflow

At the start of every coding session: 1. Read `PRD.md`,
`architecture.md`, `rules.md`, `DESIGN.md`, and `memory.md`. 2. Inspect
the actual repository before modifying it. 3. Identify the current phase
and the smallest next task. 4. Implement only that task and its
necessary dependencies. 5. Run checks and manually verify the browser
flow. 6. Update `memory.md` with decisions, completed work, changed
files, commands, test results, and blockers. 7. Do not rewrite unrelated
parts of the application without a reason. 8. Do not proceed to a new
phase if the current phase's acceptance criteria are failing, unless the
team explicitly accepts the limitation.

## 11. Final pre-submission checklist

-   [ ] Public app URL opens.
-   [ ] Demo data is clearly labelled.
-   [ ] Report intake works.
-   [ ] AI failure does not lose the report.
-   [ ] Priority explanations are visible.
-   [ ] Missing/conflicting/duplicate reports are flagged.
-   [ ] Resource availability remains consistent.
-   [ ] Assignment requires human approval.
-   [ ] Simulation can be reset and replayed.
-   [ ] No secrets are committed.
-   [ ] No broken or fake buttons remain.
-   [ ] Repository history is real and accessible.
-   [ ] Required submission details are prepared.
-   [ ] Final commit occurs before the stated deadline.
