import React from 'react';
import {
  ShieldAlert,
  Radio,
  Activity,
  Layers,
  Terminal,
  Compass,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      {/* Tactical HUD Header */}
      <header className="h-14 border-b border-hairline bg-surface-1 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-brand bg-brand/10 flex items-center justify-center text-brand">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold tracking-tight text-lg text-ink font-mono">
              NIGEHBAAN
            </span>
            <span className="text-xs text-ink-muted font-medium" dir="rtl">
              (نگہبان)
            </span>
            <span className="text-xs text-ink-subtle border-l border-hairline pl-2 ml-1">
              Tactical Emergency Command System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-ping" />
            LIVE PIPELINE READY
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-brand">
            <Terminal className="w-3.5 h-3.5" />
            Milestone 0: Skeleton Active
          </span>
        </div>
      </header>

      {/* Main Operational Container */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* Banner Card */}
        <section className="bg-surface-1 border border-hairline rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-brand/15 text-brand border border-brand/30">
                Operational Status: Ready
              </span>
              <span className="text-xs text-ink-subtle font-mono">
                SIMULATED DATA ONLY
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-ink">
              Tactical Disaster Triage & Uncertainty Radar
            </h1>
            <p className="text-sm text-ink-muted max-w-2xl">
              Nigehbaan finds the people the system cannot hear. 5-factor deterministic MCDA triage engine, coverage blind-spot detection, and auditable resource allocation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#tokens"
              className="px-4 py-2 text-xs font-medium bg-brand hover:bg-brand-hover text-white rounded transition-colors focus:ring-2 focus:ring-brand-focus focus:outline-none"
            >
              Inspect Design Tokens
            </a>
          </div>
        </section>

        {/* Tactical Semantic Indicator Matrix */}
        <section id="tokens" className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Critical */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">SCORE ≥ 75.0</span>
              <ShieldAlert className="w-4 h-4 text-semantic-critical-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-critical-text">
                Critical
              </div>
              <p className="text-xs text-ink-subtle">
                Active life threat, drowning, oxygen / dialysis outage
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-semantic-critical-border bg-semantic-critical/15 text-semantic-critical-text text-center">
              --semantic-critical
            </span>
          </div>

          {/* High / Warning */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">55.0 – 74.9</span>
              <AlertTriangle className="w-4 h-4 text-semantic-warning-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-warning-text">
                High / Warning
              </div>
              <p className="text-xs text-ink-subtle">
                Rising waters, stale reports &gt;60m, road collapse
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-semantic-warning-border bg-semantic-warning/15 text-semantic-warning-text text-center">
              --semantic-warning
            </span>
          </div>

          {/* Blind-Spot */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">FLOOR ≥ 60.0</span>
              <Activity className="w-4 h-4 text-semantic-blind-spot-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-blind-spot-text">
                Blind-Spot
              </div>
              <p className="text-xs text-ink-subtle">
                Telecom silence recon, physical welfare sweep
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-semantic-blind-spot-border bg-semantic-blind-spot/18 text-semantic-blind-spot-text text-center">
              --semantic-blind-spot
            </span>
          </div>

          {/* Moderate / Low / Success */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">&lt; 35.0</span>
              <CheckCircle2 className="w-4 h-4 text-semantic-success-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-success-text">
                Success / Resolved
              </div>
              <p className="text-xs text-ink-subtle">
                Available resources, approved assignments, resolved
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-semantic-success-border bg-semantic-success/15 text-semantic-success-text text-center">
              --semantic-success
            </span>
          </div>

          {/* Unknown / Slate */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">RENORMALIZED</span>
              <HelpCircle className="w-4 h-4 text-semantic-unknown-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-unknown-text">
                Unknown Slate
              </div>
              <p className="text-xs text-ink-subtle">
                Missing factor data, heuristic offline badge
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-hairline bg-semantic-unknown/20 text-semantic-unknown-text text-center">
              --semantic-unknown
            </span>
          </div>
        </section>

        {/* Milestone Verification Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-brand">
              <Layers className="w-4 h-4" />
              <span>CANVAS & SURFACES</span>
            </div>
            <div className="space-y-1.5 text-xs text-ink-muted">
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Base Canvas</span>
                <code className="text-ink font-mono">#010102</code>
              </div>
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Primary Panel Surface</span>
                <code className="text-ink font-mono">#0f1011</code>
              </div>
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Elevated Surface</span>
                <code className="text-ink font-mono">#141516</code>
              </div>
              <div className="flex justify-between">
                <span>Hairline Border</span>
                <code className="text-ink font-mono">#23252a</code>
              </div>
            </div>
          </div>

          <div className="bg-surface-1 border border-hairline rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-brand">
              <Compass className="w-4 h-4" />
              <span>MCDA MATHEMATICAL SCORING</span>
            </div>
            <div className="space-y-1.5 text-xs text-ink-muted">
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Life Threat (w1)</span>
                <code className="text-ink font-mono">30% (0.30)</code>
              </div>
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Medical Urgency (w2)</span>
                <code className="text-ink font-mono">25% (0.25)</code>
              </div>
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Evac Inability (w3)</span>
                <code className="text-ink font-mono">20% (0.20)</code>
              </div>
              <div className="flex justify-between">
                <span>Env Danger (w4) / Pop (w5)</span>
                <code className="text-ink font-mono">15% / 10%</code>
              </div>
            </div>
          </div>

          <div className="bg-surface-1 border border-hairline rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-brand">
              <Terminal className="w-4 h-4" />
              <span>TEST SUITE & RUNNER</span>
            </div>
            <div className="space-y-1.5 text-xs text-ink-muted">
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Runner</span>
                <code className="text-ink font-mono">Vitest (Node Env)</code>
              </div>
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Sanity Test</span>
                <code className="text-semantic-success-text font-mono">Passing</code>
              </div>
              <div className="flex justify-between border-b border-hairline-tertiary pb-1">
                <span>Seed Verifier</span>
                <code className="text-semantic-success-text font-mono">12/12 Seed Match</code>
              </div>
              <div className="flex justify-between">
                <span>Next.js App Router</span>
                <code className="text-ink font-mono">TypeScript Strict</code>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Tactical HUD Footer */}
      <footer className="h-10 border-t border-hairline bg-surface-1 px-6 flex items-center justify-between text-xs text-ink-subtle font-mono">
        <span>NIGEHBAAN_CORE_REV_0.1 // DISTRICT_ALPHA</span>
        <span>CODE//CONNECT&apos;26 --- PROBLEM 01</span>
      </footer>
    </main>
  );
}
