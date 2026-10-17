# Nigehbaan Operational Crisis Design System

> **Design System Specification: Nigehbaan Tactical Emergency Command System**  
> Built for mission-critical disaster response: high-density, calm neutral charcoal surfaces, authoritative typography, and strict semantic crisis indicators.

---

## 1. Design Philosophy & Aesthetic Principles

1. **Mission-Critical Cockpit:** Designed for coordinators working long shifts under intense pressure. The UI avoids cognitive fatigue by using a near-black operational canvas (`#010102`) with calm charcoal panels (`#0f1011`) and hairline borders (`#23252a`).
2. **Restrained Color Discipline:** The signature Nigehbaan tactical blue (`#5e6ad2`) is used strictly for interactive focus, primary actions, and brand identity—never decoratively.
3. **Semantic Crisis States:** Color is reserved strictly for operational meaning: Critical Red (`#B42318`), Warning Amber (`#92400E`), Blind-Spot Tangerine (`#DB6D28`), and Confirmed Success (`#27a644`).
4. **No Siren Cyberpunk or Flashing Rainbows:** Flashing red sirens, rainbow gradients, and heavy glassmorphism reduce readability and look like a video game. Emergency status is communicated through clean typography, structured tables, crisp badges, and high-density maps.

---

## 2. Color Palette & Token Definitions

### Canvas & Surface Ladder
Hierarchy is communicated through subtle surface elevation, never through drop shadows:
- **`--canvas` (`#010102`):** Base canvas background—near-pure black with a faint tactical blue undertone.
- **`--surface-1` (`#0f1011`):** Primary panel background (incident queue rows, inspector cards, map frame).
- **`--surface-2` (`#141516`):** Elevated elements (active incident highlight, modal backgrounds, hover states).
- **`--surface-3` (`#18191a`):** Nested surfaces (table headers, progress bar tracks, code blocks).
- **`--surface-4` (`#191a1b`):** Top-level floating overlays (tooltips, dropdown menus).

### Hairline Borders
- **`--hairline` (`#23252a`):** Standard 1px structural dividing lines and panel borders.
- **`--hairline-strong` (`#34343a`):** Active card borders and focused container outlines.
- **`--hairline-tertiary` (`#3e3e44`):** Subtle internal separators inside dense components.

### Typography & Ink (WCAG AA Validated on `#010102`)
- **`--ink` (`#f7f8f8`):** Primary text and headlines (Contrast 19.5:1 — Passes WCAG AAA).
- **`--ink-muted` (`#d0d6e0`):** Secondary metadata, labels, and timestamps (Contrast 14.1:1 — Passes WCAG AAA).
- **`--ink-subtle` (`#8a8f98`):** Tertiary helper text and table column titles (Contrast 6.6:1 — Passes WCAG AA).
- **`--ink-tertiary` (`#858a93`):** Quaternary disabled labels and borders (Contrast 4.8:1 — Passes WCAG AA for 4.5:1 normal text).

### Brand & Interactive Accent
- **`--primary` (`#5e6ad2`):** Tactical primary action button, active navigation indicator.
- **`--primary-hover` (`#828fff`):** Hovered state of tactical primary actions.
- **`--primary-focus` (`#5e69d1`):** 2px focus ring on interactive inputs and buttons.

### Crisis Semantic Indicators
- **Critical Red:**
  - Solid: `--semantic-critical: #B42318`
  - Text on Dark: `--semantic-critical-text: #FDA29B`
  - Soft Background: `--semantic-critical-bg: rgba(180, 35, 24, 0.15)`
  - Border: `--semantic-critical-border: #F04438`
  - *Usage:* Score $\ge 75$, life-threatening danger, active drowning, stranded dialysis/oxygen patients.
- **Warning Amber:**
  - Solid: `--semantic-warning: #92400E`
  - Text on Dark: `--semantic-warning-text: #FDB022`
  - Soft Background: `--semantic-warning-bg: rgba(146, 64, 14, 0.15)`
  - Border: `--semantic-warning-border: #D97706`
  - *Usage:* Score $55 - 74.9$, review-needed flags, stale reports (>60m), conflicting road reports.
- **Blind-Spot Tangerine:**
  - Solid: `--semantic-blind-spot: #DB6D28`
  - Text on Dark: `--semantic-blind-spot-text: #F79009`
  - Soft Background: `--semantic-blind-spot-bg: rgba(219, 109, 40, 0.18)`
  - Border: `--semantic-blind-spot-border: #BD561D`
  - *Usage:* Coverage blind spots, telecom tower collapse, silent sector polygons.
- **Success Green:**
  - Solid: `--semantic-success: #27a644`
  - Text on Dark: `--semantic-success-text: #75E0A7`
  - Soft Background: `--semantic-success-bg: rgba(39, 166, 68, 0.15)`
  - Border: `--semantic-success-border: #12B76A`
  - *Usage:* Available resources, approved assignments, resolved incidents.
- **Unknown / Unverified Slate:**
  - Solid: `--semantic-unknown: #475569`
  - Text on Dark: `--semantic-unknown-text: #94A3B8`
  - Soft Background: `--semantic-unknown-bg: rgba(71, 85, 105, 0.20)`
  - *Usage:* Missing factor data, approximate location, offline heuristic extraction badge.

---

## 3. Typography Hierarchy

Default sans: `Inter`, `SF Pro Display`, `-apple-system`, `sans-serif`.  
Monospace: `JetBrains Mono`, `Fira Code`, `monospace` (used for coordinates, codes, scores).

| Token | Size | Weight | Line Height | Tracking | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | 32px | 600 | 1.15 | -0.8px | Main HUD header title |
| `display-md` | 24px | 600 | 1.20 | -0.5px | Inspector incident titles |
| `headline` | 18px | 600 | 1.25 | -0.3px | Panel headers, modal titles |
| `body` | 14px | 400 | 1.50 | 0.0px | Standard operational body text |
| `body-sm` | 13px | 400 | 1.45 | 0.0px | Queue item text, metadata |
| `caption` | 11px | 500 | 1.30 | +0.2px | Priority badges, factor tags, timestamps |
| `mono-code` | 12px | 500 | 1.40 | 0.0px | Coordinates, incident codes (`NG-101`) |

---

## 4. Operational Crisis UI Components

### 1. `incident-row`
- **Location:** Incident queue pane.
- **Layout:** High-density horizontal row (height 48px), 1px `--hairline` bottom border.
- **Surface:** `--surface-1`, transitions to `--surface-2` on hover; left 3px indicator border in semantic priority color when active.
- **Contents:** Incident code (`NG-101`), timestamp, location snippet, reporter badge (`Direct`, `Proxy`, `Blind Spot`), and priority score badge.

### 2. `priority-badge`
- **Format:** Combined numeric score (0–100) and textual category.
- **Variants:**
  - `Critical` ($\ge 75$): Background `rgba(180, 35, 24, 0.18)`, border `1px #F04438`, text `#FDA29B`.
  - `High` ($55 - 74.9$): Background `rgba(146, 64, 14, 0.18)`, border `1px #D97706`, text `#FDB022`.
  - `Moderate` ($35 - 54.9$): Background `rgba(71, 85, 105, 0.20)`, border `1px #64748B`, text `#CBD5E1`.
  - `Low` ($< 35$): Background `rgba(39, 166, 68, 0.15)`, border `1px #12B76A`, text `#75E0A7`.

### 3. `uncertainty-flag-pill`
- **Format:** Capsule badge with warning icon and descriptive text.
- **Examples:** `MISSING LOCATION`, `STALE REPORT (>60m)`, `CONFLICTING ROAD CLAIM`, `COVERAGE BLIND SPOT`.
- **Styling:** Height 22px, padding `2px 8px`, border `1px solid`, uppercase 10px font.

### 4. `explainability-card`
- **Container:** Background `--surface-1`, border `1px --hairline`, rounded 8px, padding 16px.
- **Sections:**
  1. Score summary header with mathematical breakdown formula.
  2. 5-Factor horizontal score meters (0–5 rating bar per factor).
  3. "Unknown Factors" indicator (e.g. *"1 of 5 factors unknown — weights renormalized"*).
  4. Natural-language bulleted audit justification generated from facts.

### 5. `opportunity-cost-warning`
- **Container:** Background `rgba(146, 64, 14, 0.12)`, border `1px solid #D97706`, rounded 8px, padding 14px.
- **Layout:** Two-column tactical warning alert displayed inside the assignment modal:
  - Left: Sector asset depletion status (*"Leaves 0 shallow-draft boats in Sector 2"*).
  - Right: Queue delay impact (*"Incident NG-104 [Score 56.5 — High] will incur an estimated +35 min delay"*).

### 6. `shelter-capacity-gauge` (Tier 2)
- **Container:** Background `--surface-2`, border `1px --hairline`, rounded 6px, padding 8px 12px.
- **Progress Bar:** 4px track `--surface-3`, fill `--primary` (<80%), `--semantic-warning` (80–94%), or `--semantic-critical` ($\ge 95\%$ or grid-down).
- **Badges:** `GEN ACTIVE` / `GRID DOWN`, `DIALYSIS READY`.

### 7. `voice-distress-player` (Tier 2)
- **Container:** Background `--surface-1`, border `1px --hairline`, rounded 8px, padding 16px.
- **Contents:** Audio player controls, interactive SVG canvas waveform, dual Urdu transcript (`dir="rtl"`) and English translation, with provenance tag (*"Scripted transcript for simulated call"*).

### 8. `timeline-scrubber`
- **Container:** Integrated top-nav bar.
- **4 Discrete Steps:** `T-0 Early Warning`, `T+3 Flood Surge`, `T+6 Grid Blackout`, `T+12 Peak Crisis`.
- **Active Step:** Highlighted with `--primary` background, white text, and pulse dot indicator.
- **Reset Button:** Adjacent `Reset Simulation` button with undo icon restoring pristine baseline.

### 9. Tactical Form Inputs
- **Text Inputs & Textareas:** Background `--surface-1`, border `1px --hairline`, text `--ink`, placeholder `--ink-subtle`.
- **Focus State:** Border `--primary`, box-shadow `0 0 0 2px rgba(94, 106, 210, 0.25)`.

---

## 5. Accessibility & Inclusivity Specifications (WCAG AA)

1. **Color Contrast Standards:**
   - All body text and metadata achieve $\ge 4.5:1$ contrast against their parent surfaces.
   - Large display text and status icons achieve $\ge 3:1$ contrast.
   - Tertiary ink (`--ink-tertiary`) is maintained at `#858a93` to preserve readability.
2. **Multi-Attribute Status Representation:**
   - **Never communicate status by color alone.** Every badge, marker, or alert must pair color with an explicit textual label and an SVG icon (e.g. Critical includes an alert triangle icon + the word "CRITICAL" + the numeric score "88").
3. **Keyboard Navigation & Focus Management:**
   - All interactive controls (incident rows, map popups, modal buttons, scrubber nodes) must have visible keyboard focus rings (`2px solid #5e6ad2` with `2px offset`).
   - Modal dialogs trap focus and can be dismissed via `Escape`.
4. **Bilingual Urdu & RTL Support:**
   - Urdu text displays inside containers with `dir="rtl"` and appropriate text alignment.
   - Typography line-height for Urdu is expanded to $\ge 1.6$ to prevent diacritic clipping.
   - Fallback font stack includes `Noto Nastaliq Urdu`, `Arial`, `sans-serif`.
