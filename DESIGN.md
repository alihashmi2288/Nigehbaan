---
version: alpha
name: Nigehbaan-design-system
description: "A near-black product-focused operational crisis canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray text (#f7f8f8), and the signature Nigehbaan tactical blue (#5e6ad2) used as the single chromatic accent. The system reads as mission-critical software-craft documentation: dense, technical, and quietly authoritative. Display type is set in Nigehbaan Display sans (SF Pro Display / Inter fallback) at 500–700 with measured negative tracking. Cards live as charcoal panels (#0f1011) with hairline borders. The accent tactical blue appears on the brand mark, focus rings, and a few intentional CTAs — never decoratively. Page rhythm leans on tactical operations UI panels, interactive GIS maps, and situational metrics rather than atmospheric color."

colors:
  primary: "#5e6ad2"
  on-primary: "#ffffff"
  primary-hover: "#828fff"
  primary-focus: "#5e69d1"
  ink: "#f7f8f8"
  ink-muted: "#d0d6e0"
  ink-subtle: "#8a8f98"
  ink-tertiary: "#62666d"
  canvas: "#010102"
  surface-1: "#0f1011"
  surface-2: "#141516"
  surface-3: "#18191a"
  surface-4: "#191a1b"
  hairline: "#23252a"
  hairline-strong: "#34343a"
  hairline-tertiary: "#3e3e44"
  inverse-canvas: "#ffffff"
  inverse-surface-1: "#f5f6f6"
  inverse-surface-2: "#f6f7f7"
  inverse-ink: "#000000"
  brand-secure: "#7a7fad"
  semantic-success: "#27a644"
  semantic-success-soft: "#DCFCE7"
  semantic-critical: "#B42318"
  semantic-critical-soft: "#FEE4E2"
  semantic-warning: "#92400E"
  semantic-warning-soft: "#FEF3C7"
  semantic-blind-spot: "#DB6D28"
  semantic-blind-spot-soft: "rgba(219, 109, 40, 0.18)"
  semantic-blind-spot-border: "#BD561D"
  semantic-unknown: "#475569"
  semantic-unknown-soft: "#E2E8F0"
  semantic-overlay: "#000000"

typography:
  display-xl:
    fontFamily: Nigehbaan Display
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -3.0px
  display-lg:
    fontFamily: Nigehbaan Display
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.8px
  display-md:
    fontFamily: Nigehbaan Display
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -1.0px
  headline:
    fontFamily: Nigehbaan Display
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.6px
  card-title:
    fontFamily: Nigehbaan Display
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.4px
  subhead:
    fontFamily: Nigehbaan Display
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.2px
  body-lg:
    fontFamily: Nigehbaan Text
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.1px
  body:
    fontFamily: Nigehbaan Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.05px
  body-sm:
    fontFamily: Nigehbaan Text
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: Nigehbaan Text
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  button:
    fontFamily: Nigehbaan Text
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: Nigehbaan Text
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.4px
  mono:
    fontFamily: Nigehbaan Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-primary-pressed:
    backgroundColor: "{colors.primary-focus}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-inverse:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  pricing-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card-featured:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-screenshot-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  testimonial-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  customer-logo-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 16px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  pricing-tab-selected:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  cta-banner:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: 48px
  changelog-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 24px 0
  status-badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
  incident-row:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  priority-badge:
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 2px 6px
  uncertainty-flag-pill:
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  voice-distress-player:
    backgroundColor: "{colors.surface-1}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 16px
  timeline-scrubber:
    backgroundColor: "{colors.surface-1}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 12px 20px
  explainability-card:
    backgroundColor: "{colors.surface-1}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 20px
---

## Overview

Nigehbaan's operational crisis canvas is the deepest dark surface in this collection — `{colors.canvas}` is #010102, essentially pure black with a faint blue tint. On top sits a four-step surface ladder (`{colors.surface-1}` through `{colors.surface-4}`) for cards, panels, and lifted tiles, with hairline borders running from `{colors.hairline}` (#23252a) up through `{colors.hairline-strong}` and `{colors.hairline-tertiary}`. Light gray text (`{colors.ink}` #f7f8f8) carries the body and headlines.

The single chromatic accent is **Nigehbaan tactical blue** `{colors.primary}` (#5e6ad2) — used on the brand mark, focus rings, and the primary CTA button. A lighter hover state (`{colors.primary-hover}` #828fff) and a focus-tinted variant (`{colors.primary-focus}` #5e69d1) extend the same hue. Nigehbaan reserves semantic colors strictly for crisis and operational states: `{colors.semantic-success}` (#27a644) for confirmed/available states, while dedicated crisis tokens carry emergency priority ratings.

Display type runs Nigehbaan's custom sans (with `SF Pro Display` / `Inter` fallback) at weight 500–700 with negative letter-spacing scaling from -3.0px at 80px down to 0 at body. The body family is Nigehbaan's text cut, and a Nigehbaan Mono is reserved for coordinates, technical metrics, and code snippets in operational screenshots.

The page rhythm is **dense operations dashboards** — Nigehbaan leads with high-fidelity captures of the tactical mission UI (incident queue, GIS map, triage inspector) framed in `{colors.surface-1}` panels with `{rounded.xl}` 16px corners. The chrome is intentionally minimal so the operational tools can do the heavy lifting.

**Key Characteristics:**
- **Dark-canvas operational system** — `{colors.canvas}` (#010102) is the deepest dark in this collection.
- **Tactical-blue brand accent** (`{colors.primary}` #5e6ad2) — used scarcely on brand mark, focus, and the primary CTA.
- Four-step surface ladder (canvas → surface-1 → surface-2 → surface-3 → surface-4) carries hierarchy without shadow.
- Display tracking pulls aggressively negative (-3.0px at 80px); body holds at -0.05px.
- Cards use `{rounded.lg}` 12px corners with 1px hairline borders — never pill, rarely 16px.
- **Operational UI panels** dominate the view. The chrome is an authoritative frame for crisis coordination.
- No second chromatic color on marketing chrome. No atmospheric gradients. No spotlight cards.

## Colors

> Design System Specification: Nigehbaan Operational Crisis Command System.

### Brand & Accent
- **Tactical Blue** ({colors.primary}): The signature Nigehbaan accent — primary CTA, brand mark, link emphasis.
- **Tactical Hover** ({colors.primary-hover}): Lighter tint (#828fff) — hovered state of the primary CTA.
- **Tactical Focus** ({colors.primary-focus}): Focus-ring tint (#5e69d1) — focused inputs, focused buttons.
- **Brand Shield** ({colors.brand-secure}): Muted slate-blue (#7a7fad) — used in secure operational surfaces.

### Surface
- **Canvas** ({colors.canvas}): Default page background — #010102, near-pure black with a faint blue tint.
- **Surface 1** ({colors.surface-1}): One step above canvas — feature cards, pricing cards, product screenshot panels.
- **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, hovered cards.
- **Surface 3** ({colors.surface-3}): Three steps above — line-tertiary backgrounds, sub-nav.
- **Surface 4** ({colors.surface-4}): Four steps above — bg-level-3, deepest lifted surface.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px borders — input focus rings.
- **Hairline Tertiary** ({colors.hairline-tertiary}): Tertiary borders for nested surfaces.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — surface of the inverse pill CTA on a small set of section openers.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step above inverse canvas.
- **Inverse Surface 2** ({colors.inverse-surface-2}): Two steps above inverse canvas.

### Text
- **Ink** ({colors.ink}): All headlines and emphasized body type — light gray #f7f8f8.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #d0d6e0 — meta info on hero panels.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #8a8f98 — deselected pricing tabs, footer columns.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary at #62666d — disabled, footnotes.

### Semantic & Crisis State Colors

- **Critical Red** (`{colors.semantic-critical}` #B42318 / `{colors.semantic-critical-soft}` #FEE4E2): Reserved strictly for critical, life-threatening incidents (e.g. rising floodwater, medical fragility, trapped infants). Never used decoratively.
- **Warning Amber** (`{colors.semantic-warning}` #92400E / `{colors.semantic-warning-soft}` #FEF3C7): Review-needed states, conflicting claims, and stale reports (>60m).
- **Blind-Spot Tangerine** (`{colors.semantic-blind-spot}` #DB6D28 / `{colors.semantic-blind-spot-soft}` rgba(219, 109, 40, 0.18) / `{colors.semantic-blind-spot-border}` #BD561D): Reserved strictly for coverage blind spots, dead-zone perimeter alerts, and uncontacted sector polygons on the map.
- **Success Green** (`{colors.semantic-success}` #27a644 / #166534 / `{colors.semantic-success-soft}` #DCFCE7): Available resources, approved assignments, and confirmed/resolved incidents.
- **Unknown Neutral** (`{colors.semantic-unknown}` #475569 / `{colors.semantic-unknown-soft}` #E2E8F0): Missing or unverified information. Must always be accompanied by an explicit text label.
- **Overlay** (`{colors.semantic-overlay}` #000000): Pure black overlay scrim for modals and emergency drawers.

#### Color Rules for Emergency Response
- Never communicate status through color alone; always pair with explicit text badges or icons.
- Avoid decorative gradients, neon glows, or flashing siren animations that cause visual fatigue.

## Typography

### Font Family

- **Nigehbaan Display** — Nigehbaan's custom display sans; fallback `SF Pro Display, Inter, -apple-system, system-ui, Segoe UI, Roboto`. Carries display-xl through subhead.
- **Nigehbaan Text** — Nigehbaan's custom text sans (a slightly different cut tuned for body sizes); same fallback stack. Carries body sizes, button labels, captions.
- **Nigehbaan Mono** — Nigehbaan's custom mono; fallback `ui-monospace, SF Mono, Menlo, JetBrains Mono`. Used for coordinates, technical metrics, and code snippets.

The interface treats Display and Text as one continuous voice; the family change is silent.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 600 | 1.05 | -3.0px | Largest hero headline |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.8px | Section opener headlines |
| `{typography.display-md}` | 40px | 600 | 1.15 | -1.0px | Sub-section headlines |
| `{typography.headline}` | 28px | 600 | 1.20 | -0.6px | Pricing tier titles, CTA banner heading |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.4px | Feature card title |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | Lead body, intro paragraphs |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | -0.05px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Card body, footer columns |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | Captions, meta, status |
| `{typography.button}` | 14px | 500 | 1.20 | 0 | All button labels |
| `{typography.eyebrow}` | 13px | 500 | 1.30 | 0.4px | Section eyebrow (slight positive tracking) |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | Nigehbaan Mono for telemetry and data |

### Principles

- **Aggressive negative tracking on display** (-3.0px at 80px ≈ 4% of size).
- **Single voice from display to body.** Display-xl at 600 → body at 400 — same family, narrower weights.
- **Eyebrow uses positive tracking** (+0.4px) — contrast against the negative-tracked display marks the eyebrow as taxonomy.
- **Mono for telemetry and data contexts.** Nigehbaan Mono lives inside coordinates, incident codes, and technical telemetry.

### Note on Font Substitutes

For cross-platform implementation, **Inter** at weight 500 / 600 / 700 is the recommended primary sans font. **Geist Sans** and **SF Pro Display** are also viable. For mono, **JetBrains Mono** or **Geist Mono** at weight 400 closely approximates Nigehbaan Mono.

## Layout

### Spacing System

- **Base unit**: 4px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on feature/pricing cards; `{spacing.xl}` 32px on testimonial cards; `{spacing.xxl}` 48px on CTA banners.
- Pill button padding: 8px vertical · 14px horizontal — Nigehbaan's compact button spec.
- Form input padding: 8px vertical · 12px horizontal.

### Grid & Container

- Max content width sits around 1280px.
- Card grids are 3-up at desktop, 2-up at tablet, 1-up at mobile.
- Pricing tier grid is 3-up; comparison strip below shows checkmarks per tier.
- Operations UI panels span full content width — they're the protagonist.

### Whitespace Philosophy

The dark canvas IS the whitespace. Sections separate by lift onto surface-1 panels, not by gaps in white. Within a panel, generous `{spacing.lg}` 24px gaps between content blocks; `{spacing.section}` 96px between sections.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer |
| 1 (charcoal lift) | `{colors.surface-1}` background on canvas, 1px `{colors.hairline}` | Default cards, product panels |
| 2 (surface-2 lift) | `{colors.surface-2}` background, 1px `{colors.hairline-strong}` | Featured pricing card, hovered cards |
| 3 (surface-3 lift) | `{colors.surface-3}` background | Sub-nav, dropdown menus |
| 4 (focus ring) | 2px `{colors.primary-focus}` outline at 50% opacity | Focused input, focused button |

Nigehbaan's depth is carried by surface ladder + hairline borders. The system resists drop shadows on dark almost entirely.

### Decorative Depth

- **Operational UI screenshots & maps** dominate as visual depth.
- **No atmospheric gradients, no spotlight cards.**
- **Subtle white edge highlight** on the top edge of lifted panels — gives the dark surface a faint "pixel rendered" feel.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, status badges |
| `{rounded.sm}` | 6px | Inline tags |
| `{rounded.md}` | 8px | All buttons, form inputs |
| `{rounded.lg}` | 12px | Pricing cards, feature cards, testimonial cards |
| `{rounded.xl}` | 16px | Product screenshot panels, map containers |
| `{rounded.xxl}` | 24px | Oversized CTA banners (rare) |
| `{rounded.pill}` | 9999px | Pricing tab toggles, status pills |
| `{rounded.full}` | 9999px | Avatar circles |

### Photography & Illustration Geometry

- Operational UI panels dominate; they sit in `{rounded.xl}` 16px tiles with `{spacing.lg}` 24px outer padding.
- Customer/Partner logo tiles render at small sizes (~24px logo height) on `{colors.canvas}` with no border.
- Avatar circles in testimonial cards use `{rounded.full}` at 32–40px sizes.

## Components

### Buttons

**`button-primary`** — Tactical Blue CTA. The default primary CTA across all pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`.
- Pressed state lives in `button-primary-pressed` (background shifts to `{colors.primary-focus}`).
- Hover state lives in `button-primary-hover` (background shifts to `{colors.primary-hover}` lighter tint).

**`button-secondary`** — Charcoal button. Used for secondary CTAs ("Sign in", "Read documentation").
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`. 1px `{colors.hairline}` border.

**`button-tertiary`** — Plain text button.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 8px 14px.

**`button-inverse`** — White-on-dark inverse CTA.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 8px 14px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — Pill-toggle on `/pricing`.
- Default: `{colors.canvas}` background, `{colors.ink-subtle}` text, rounded `{rounded.pill}`, padding 6px 14px.
- Selected: `{colors.surface-2}` background, `{colors.ink}` text — selected = surface lift.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px. 1px `{colors.hairline}` border.

**`pricing-card-featured`** — Recommended tier — surface lift to surface-2.
- Background `{colors.surface-2}`, otherwise identical structure.

**`feature-card`** — Generic feature highlight tile.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-screenshot-card`** — The dominant card type — frames a high-fidelity Nigehbaan operations dashboard or GIS map interface.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 24px.

**`testimonial-card`** — Responder or coordinator quote with avatar + name + role.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-lg}`, rounded `{rounded.lg}`, padding 32px.

**`customer-logo-tile`** — Small tile in the partner marquee.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, rounded `{rounded.xs}`, padding 16px.

**`cta-banner`** — Closing CTA panel near page bottom.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.headline}`, rounded `{rounded.lg}`, padding 48px.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on `/contact/sales` and intake overlays.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 8px 12px.
- Focused state retains the same surface; the focus ring is a 2px `{colors.primary-focus}` outline at 50% opacity.

### Status & Build Page

**`changelog-row`** — Each row in `/build` (changelog page) listing version, date, and changes.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xs}`, padding 24px 0. 1px `{colors.hairline}` bottom rule.

**`status-badge`** — Small status pill.
- Background `{colors.surface-2}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 2px 8px.

### Navigation

**`top-nav`** — Sticky dark bar with the Nigehbaan wordmark left, primary navigation links centered, and active crisis telemetry controls right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.

### Crisis Coordination Components

**`incident-row`** — Compact row for the live operations triage queue.
- Background `{colors.surface-1}`, hover `{colors.surface-2}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding 10px 14px.
- Displays incident code, concise description, priority badge, location quality status, last update, and review state.
- Deterministic sorting; selecting row synchronizes map marker and detail inspector.

**`priority-badge`** — Operational triage indicator.
- Critical: `{colors.semantic-critical}` text on `{colors.semantic-critical-soft}` background.
- Warning: `{colors.semantic-warning}` text on `{colors.semantic-warning-soft}` background.
- Success: `{colors.semantic-success}` text on `{colors.semantic-success-soft}` background.
- Typography `{typography.caption}`, rounded `{rounded.xs}`, padding 2px 6px.
- Always accompanied by text (`CRITICAL`, `HIGH`, `MODERATE`, `LOW`).

**`uncertainty-flag-pill`** — Review indicator for incomplete, contradictory, or unverified reports.
- Typography `{typography.caption}`, rounded `{rounded.pill}`, padding 2px 8px.
- Labels: `LOCATION MISSING`, `CONFLICT`, `STALE REPORT`, `POSSIBLE DUPLICATE`, `COVERAGE BLIND SPOT`.
- Clicking opens underlying evidence drawer without altering urgency score.

**`voice-distress-player`** — Integrated voice hotline audio player & visualizer.
- Background `{colors.surface-1}`, 1px `{colors.hairline}` border, rounded `{rounded.lg}`, padding 16px.
- Features neutral waveform visualization bars (`{colors.primary}` / `{colors.hairline}`), playback controls, dual-language transcript pills (`Urdu`, `English`), and audio provenance tag (`simulated_ivr_call`).

**`timeline-scrubber`** — Docked disaster progression controller.
- Background `{colors.surface-1}`, 1px `{colors.hairline}` border, rounded `{rounded.lg}`, padding 12px 20px.
- Features phase step nodes (`T-0 Early Warning`, `T+3 Flood Surge`, `T+6 Grid Blackout`, `T+12 Peak Crisis`) and an instant "Reset Scenario" control.

**`explainability-card`** — Human-auditable triage inspector.
- Background `{colors.surface-1}`, 1px `{colors.hairline}` border, rounded `{rounded.lg}`, padding 20px.
- Displays deterministic 5-factor mathematical weighting breakdown alongside natural-language audit bullet points.

**`tactical-map`** — Interactive GIS operations map.
- Embedded container with 1px `{colors.hairline}` border, rounded `{rounded.xl}`.
- Uncontacted dead zones rendered as semi-transparent polygons (`{colors.semantic-blind-spot-soft}`) with dashed borders (`{colors.semantic-blind-spot-border}`).
- Unlocated incidents listed in a dedicated drawer rather than plotted at fabricated coordinates.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` with the Nigehbaan wordmark left.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, padding 64px 32px.

## Do's and Don'ts

### Do

- Reserve `{colors.canvas}` (#010102) as the system's anchor surface — the faint blue tint is intentional.
- Use `{colors.primary}` tactical blue ONLY for: brand mark, primary CTA, focus ring, link emphasis.
- Use the four-step surface ladder for hierarchy. Avoid skipping levels.
- Pair display weight 600 with body weight 400 — Nigehbaan avoids 700+ heavy display weights in favor of clean legibility.
- Apply negative letter-spacing aggressively on display.
- Use operational UI panels and maps as the protagonist of every section.
- Compose CTAs as `{rounded.md}` 8px corners.

### Don't

- Don't ship a light-mode marketing page.
- Don't use tactical blue as a section background or card fill.
- Don't introduce arbitrary chromatic accents (pink, lime) on the main dark canvas.
- Don't add atmospheric gradients or spotlight cards.
- Don't pill-round CTAs.
- Don't use `#000000` true black as the canvas.
- Don't combine multiple bright accents without semantic meaning.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Card grid 3-up maintained |
| Tablet | 1024px | Card grid 3-up → 2-up |
| Mobile-Lg | 768px | Pricing comparison becomes accordion; nav hamburger |
| Mobile | 480px | Single-column; display-xl scales 80px → ~36px |

### Touch Targets

- CTAs hold ≥40px tap height across viewports.
- Pricing tab pills hold ≥36px tap height; touch viewports grow to ≥44px.
- Form inputs hold ≥44px tap target on touch.

### Collapsing Strategy

- **Top nav**: links collapse to hamburger below 768px.
- **Card grids**: 3-up → 2-up at 1024px → 1-up below 768px.
- **Pricing comparison**: per-tier accordion below 768px.
- **Display type**: `{typography.display-xl}` 80px scales toward `{typography.display-md}` 40px on mobile.

### Image Behavior

- Operational UI panels maintain aspect ratio and never crop.
- Partner logos in the marquee may collapse from 6-up to 3-up below 768px.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a section, decide first which surface lift it lives on.
3. Default body to `{typography.body}` at weight 400.
4. Add new variants as separate component entries.
5. Treat tactical blue as scarce: brand mark, primary CTA, focus, link emphasis.
6. Lead every section with an operational UI panel or map.

## Known Gaps

- The four-step surface ladder values establish Nigehbaan's canonical high-density surface specification.
- Form-field error and validation styling is not visible on the inspected pages.
- Light mode is not documented because the system uses an authoritative dark operational palette.
- Nigehbaan's operational dashboard utilizes dedicated semantic emergency status tags (Critical Red, Warning Amber, Tangerine Blind-Spot, and Success Green) for triage priorities and resource availability.
- The custom display, text, and mono families use standard cross-platform typefaces (Inter and JetBrains Mono).
