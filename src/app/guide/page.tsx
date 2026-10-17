'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Terminal,
  Cpu,
  Clock,
  Layers,
  Radio,
  ShieldAlert,
  Flame,
  AlertTriangle,
  Waves,
  Sliders,
  PhoneCall,
  WifiOff,
  Building2,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { LinearNav, LinearFooter } from '@/components/layout';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-brand selection:text-white">
      {/* Linear Sticky Header */}
      <LinearNav currentRoute="guide" />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 flex flex-col gap-16">
        {/* ================================================================= */}
        {/* HEADER                                                            */}
        {/* ================================================================= */}
        <section className="text-center sm:text-left border-b border-hairline pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-hairline text-[13px] font-medium tracking-[0.4px] text-ink-muted mb-5">
            <BookOpen className="w-3.5 h-3.5 text-brand" />
            <span>OPERATIONAL PROTOCOL &amp; EVALUATOR BLUEPRINT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold leading-[1.1] tracking-[-1.8px] text-ink mb-4">
            Platform Guide &amp; Technical Dossier
          </h1>

          <p className="text-base sm:text-lg font-normal leading-[1.5] text-ink-muted max-w-3xl">
            A step-by-step handbook for hackathon judges, disaster coordinators, and field responders. Understand how Nigehbaan calculates deterministic priorities, synthesizes silent sector blind spots, and routes evacuees during catastrophic flood emergencies.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <NextLink
              href="/dashboard"
              className="px-4 py-2 text-[14px] font-medium text-white bg-brand hover:bg-brand-hover active:bg-brand-focus rounded-[8px] transition-colors flex items-center gap-2"
            >
              <span>Launch Live Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>

            <NextLink
              href="/"
              className="px-4 py-2 text-[14px] font-medium text-ink bg-surface-1 border border-hairline hover:bg-surface-2 rounded-[8px] transition-colors"
            >
              <span>Product Overview</span>
            </NextLink>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 1: 3-MINUTE EVALUATOR QUICKSTART                          */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div>
            <span className="text-[12px] font-mono uppercase tracking-[0.4px] text-brand block mb-1">
              Section 01 // Judging &amp; Demonstration
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.6px] text-ink">
              3-Minute Evaluator Quickstart
            </h2>
            <p className="text-sm text-ink-subtle mt-1">
              Follow these 6 chronological steps inside the Command Cockpit to verify all core capabilities in under 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand">STEP 1 • 0:00 – 0:30</span>
                <span className="text-[11px] font-mono text-ink-subtle">Phase T-0</span>
              </div>
              <h3 className="text-base font-medium text-ink">Inspect Baseline Command HUD</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Launch the Cockpit. Observe the dark GIS map centered on District Alpha (`24.935, 67.145`). Notice the persistent `SIMULATED DATA` badge, live telemetry counters, and Sector 3A proactive staging alert.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-semantic-critical-text">STEP 2 • 0:30 – 1:00</span>
                <span className="text-[11px] font-mono text-ink-subtle">Phase T+3</span>
              </div>
              <h3 className="text-base font-medium text-ink">Inspect Critical Case NG-101</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Advance the scrubber to <span className="text-ink font-mono font-medium">T+3 Flood Surge</span>. Click top-ranked incident <span className="text-semantic-critical-text font-mono font-medium">NG-101</span> (Score 86.5 — Critical). Inspect the Explainability Card and the 5-factor mathematical progress meters.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-semantic-blind-spot-text">STEP 3 • 1:00 – 1:30</span>
                <span className="text-[11px] font-mono text-ink-subtle">Phase T+6</span>
              </div>
              <h3 className="text-base font-medium text-ink">Trigger Sector 3A Blind Spot</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Advance scrubber to <span className="text-ink font-mono font-medium">T+6 Grid Blackout</span>. Tower-Alpha-3 collapses and Sector 3A goes silent for 110m. Watch Nigehbaan automatically synthesize <span className="text-semantic-blind-spot-text font-mono font-medium">NG-103</span> (Score 68.7, High) for field sweep recon.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-semantic-warning-text">STEP 4 • 1:30 – 2:00</span>
                <span className="text-[11px] font-mono text-ink-subtle">Opportunity Cost</span>
              </div>
              <h3 className="text-base font-medium text-ink">Test Opportunity Cost Warning</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Select NG-101 $\to$ Click <span className="text-ink font-medium">&quot;Assign Resource&quot;</span> $\to$ Select <span className="text-ink font-medium">Shallow Jet-Boat 01</span>. The modal alerts: *Leaves 0 boats in Sector 2; +35 min delay for NG-104*. Click <span className="text-brand font-medium">&quot;Approve Assignment&quot;</span>.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-semantic-critical-text">STEP 5 • 2:00 – 2:30</span>
                <span className="text-[11px] font-mono text-ink-subtle">Voice &amp; Offline PWA</span>
              </div>
              <h3 className="text-base font-medium text-ink">Test Voice Hotline &amp; Offline Queue</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Click <span className="text-semantic-critical-text font-medium">&quot;Voice Hotline&quot;</span> in the header to view the real-time Web Audio waveform and bilingual Urdu RTL + English translation. Toggle browser offline mode to see reports queue locally with instant heuristic extraction.
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand">STEP 6 • 2:30 – 3:00</span>
                <span className="text-[11px] font-mono text-ink-subtle">Phase T+12 &amp; Reset</span>
              </div>
              <h3 className="text-base font-medium text-ink">FCFS Retrospective &amp; 1-Click Reset</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Advance to <span className="text-ink font-mono font-medium">T+12 Peak Crisis</span> $\to$ Click <span className="text-brand font-medium">&quot;FCFS Analysis&quot;</span> to review the -97% critical latency reduction and 4 casualties prevented. Then click <span className="text-ink font-medium">&quot;Reset Simulation&quot;</span> to restore baseline state in &lt;10ms.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 2: MATHEMATICAL TRIAGE FORMULA                            */}
        {/* ================================================================= */}
        <section className="space-y-6 border-t border-hairline pt-12">
          <div>
            <span className="text-[12px] font-mono uppercase tracking-[0.4px] text-brand block mb-1">
              Section 02 // Mathematical Spec
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.6px] text-ink">
              Deterministic 5-Factor MCDA Engine
            </h2>
            <p className="text-sm text-ink-subtle mt-1">
              Priority scores are 100% deterministic arithmetic in TypeScript (`src/lib/triage/scoringEngine.ts`). The LLM never computes scores.
            </p>
          </div>

          {/* Formula Display Box */}
          <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline space-y-4">
            <div className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              Authoritative MCDA Equation with Weight Renormalization
            </div>

            <div className="p-4 rounded-[8px] bg-surface-2 border border-hairline font-mono text-sm sm:text-base text-ink overflow-x-auto text-center">
              Score = 100 × [ Σ (wᵢ · fᵢ / 5.0) ] / Σ wᵢ
            </div>

            <p className="text-[13px] text-ink-subtle leading-[1.5]">
              Where each factor <span className="text-ink font-mono">fᵢ ∈ [0.0, 5.0]</span> is evaluated against known empirical evidence. When factor data is missing, the denominator sums strictly across known weights. <strong className="text-ink font-medium">Missing data never penalizes the victim with a zero.</strong>
            </p>
          </div>

          {/* Factor Table */}
          <div className="border border-hairline rounded-[12px] overflow-hidden bg-surface-1">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-surface-2 border-b border-hairline text-ink-muted font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Factor</th>
                  <th className="p-3.5">Weight (wᵢ)</th>
                  <th className="p-3.5">Scale (0.0 to 5.0)</th>
                  <th className="p-3.5 hidden sm:table-cell">Key Operational Indicators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-ink-subtle">
                <tr>
                  <td className="p-3.5 font-medium text-ink">f₁: Immediate Life Threat</td>
                  <td className="p-3.5 font-mono text-brand font-bold">0.30</td>
                  <td className="p-3.5 font-mono">0.0 – 5.0</td>
                  <td className="p-3.5 hidden sm:table-cell">Drowning, swept by current, roof submerging (&gt;1.5m water)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-ink">f₂: Medical Urgency</td>
                  <td className="p-3.5 font-mono text-brand font-bold">0.25</td>
                  <td className="p-3.5 font-mono">0.0 – 5.0</td>
                  <td className="p-3.5 hidden sm:table-cell">Missed hemodialysis, ventilator failure, severe hemorrhage</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-ink">f₃: Evacuation Inability</td>
                  <td className="p-3.5 font-mono text-brand font-bold">0.20</td>
                  <td className="p-3.5 font-mono">0.0 – 5.0</td>
                  <td className="p-3.5 hidden sm:table-cell">Non-ambulatory elderly, infants, dead phone (`no_phone` enforces ≥4.0)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-ink">f₄: Environmental Danger</td>
                  <td className="p-3.5 font-mono text-brand font-bold">0.15</td>
                  <td className="p-3.5 font-mono">0.0 – 5.0</td>
                  <td className="p-3.5 hidden sm:table-cell">River water gauge rising, mudslide corridor, live downed cables</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-ink">f₅: Population Exposed</td>
                  <td className="p-3.5 font-mono text-brand font-bold">0.10</td>
                  <td className="p-3.5 font-mono">0.0 – 5.0</td>
                  <td className="p-3.5 hidden sm:table-cell">Headcount: 1–2 (1.0), 3–10 (2.5), 11–50 (4.0), &gt;50 (5.0)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 3: DISTRICT ALPHA SCENARIO & CLOCK                        */}
        {/* ================================================================= */}
        <section className="space-y-6 border-t border-hairline pt-12">
          <div>
            <span className="text-[12px] font-mono uppercase tracking-[0.4px] text-brand block mb-1">
              Section 03 // Scenario Context
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.6px] text-ink">
              District Alpha Telemetry Chronology
            </h2>
            <p className="text-sm text-ink-subtle mt-1">
              The standardized benchmark scenario simulating 12 hours of catastrophic river surge progression in District Alpha.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-[8px] bg-surface-1 border border-hairline space-y-1.5">
              <span className="text-xs font-mono font-bold text-semantic-success-text">T-0 • 04:30</span>
              <div className="text-sm font-medium text-ink">Early Warning</div>
              <p className="text-[12px] text-ink-subtle">
                Flood gauge 0.6m. Pre-disaster baseline. Staging advisor recommends pre-positioning Jet-Boat 01 for Sector 3A.
              </p>
            </div>

            <div className="p-4 rounded-[8px] bg-surface-1 border border-hairline space-y-1.5">
              <span className="text-xs font-mono font-bold text-semantic-warning-text">T+3 • 07:30</span>
              <div className="text-sm font-medium text-ink">Flood Surge</div>
              <p className="text-[12px] text-ink-subtle">
                Gauge reaches 1.3m. Arterial road cut off. Dialysis emergency NG-101 (Score 86.5) appears in Sector 2.
              </p>
            </div>

            <div className="p-4 rounded-[8px] bg-surface-1 border border-hairline space-y-1.5">
              <span className="text-xs font-mono font-bold text-semantic-blind-spot-text">T+6 • 10:30</span>
              <div className="text-sm font-medium text-ink">Grid Blackout</div>
              <p className="text-[12px] text-ink-subtle">
                Tower-Alpha-3 collapses at 08:55. Gauge hits 1.9m. Silence reaches 110m. Synthetic incident NG-103 generated.
              </p>
            </div>

            <div className="p-4 rounded-[8px] bg-surface-1 border border-hairline space-y-1.5">
              <span className="text-xs font-mono font-bold text-semantic-critical-text">T+12 • 16:30</span>
              <div className="text-sm font-medium text-ink">Peak Crisis</div>
              <p className="text-[12px] text-ink-subtle">
                Gauge at 2.4m. SHL-03 loses generator (97% capacity). All 12 incidents active. FCFS retrospective unlock.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* CLOSING LAUNCH CTA                                                */}
        {/* ================================================================= */}
        <section className="p-8 sm:p-10 rounded-[16px] bg-surface-1 border border-hairline text-center space-y-4 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
          <h2 className="text-xl sm:text-3xl font-semibold tracking-[-0.6px] text-ink">
            Experience the Operational Command Cockpit
          </h2>
          <p className="text-sm text-ink-muted max-w-lg mx-auto">
            Interact with live Leaflet map polygons, test resource assignments, view real-time Urdu waveforms, and verify the offline PWA queue.
          </p>
          <div className="pt-2">
            <NextLink
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-white bg-brand hover:bg-brand-hover active:bg-brand-focus rounded-[8px] transition-colors"
            >
              <span>Launch Command Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>
        </section>
      </main>

      {/* Linear Footer */}
      <LinearFooter />
    </div>
  );
}
