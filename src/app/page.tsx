'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  ArrowRight,
  Radio,
  ShieldAlert,
  Flame,
  AlertTriangle,
  Waves,
  Sliders,
  CheckCircle2,
  Terminal,
  Cpu,
  PhoneCall,
  WifiOff,
  BarChart3,
  Building2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { LinearNav, LinearFooter } from '@/components/layout';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-brand selection:text-white">
      {/* Linear Sticky Header */}
      <LinearNav currentRoute="home" />

      {/* Main Marketing Canvas */}
      <main className="flex-1 w-full flex flex-col">
        {/* ================================================================= */}
        {/* HERO SECTION                                                      */}
        {/* ================================================================= */}
        <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-hairline text-[13px] font-medium tracking-[0.4px] text-ink-muted mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span>CODE//CONNECT&apos;26 • PROBLEM 01: DISASTER RESPONSE</span>
          </div>

          {/* Display-XL Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-semibold leading-[1.05] tracking-[-3.0px] text-ink max-w-4xl mb-6">
            Finding the people the system can&apos;t hear.
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl font-normal leading-[1.45] tracking-[-0.2px] text-ink-muted max-w-2xl mb-10">
            During catastrophic floods in Pakistan, emergency queues fail by prioritizing who shouts loudest with a smartphone. <span className="text-ink font-medium">Nigehbaan (نگہبان)</span> is the autonomous tactical triage platform that detects silent blackout sectors, renormalizes incomplete data, and calculates opportunity costs before human dispatch.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <NextLink
              href="/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 text-[14px] font-medium text-white bg-brand hover:bg-brand-hover active:bg-brand-focus rounded-[8px] transition-colors flex items-center justify-center gap-2 shadow-none group"
            >
              <span>Launch Command Cockpit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </NextLink>

            <NextLink
              href="/guide"
              className="w-full sm:w-auto px-5 py-2.5 text-[14px] font-medium text-ink bg-surface-1 border border-hairline hover:bg-surface-2 hover:border-hairline-strong rounded-[8px] transition-all flex items-center justify-center gap-2"
            >
              <span>Platform Guide &amp; Blueprint</span>
            </NextLink>
          </div>

          {/* Product Screenshot / Interactive Preview Frame */}
          <div className="w-full mt-14 sm:mt-18 relative">
            <div className="w-full bg-surface-1 border border-hairline rounded-[16px] p-4 sm:p-6 text-left relative overflow-hidden shadow-2xl before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
              {/* Mock Window Top Bar */}
              <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
                  <div className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
                  <div className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
                  <span className="text-[12px] font-mono text-ink-subtle ml-2">
                    district_alpha_tactical_hud // T+6 GRID BLACKOUT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[4px] bg-semantic-blind-spot/15 border border-semantic-blind-spot-border text-semantic-blind-spot-text text-[11px] font-mono">
                    SECTOR 3A SILENT (110m)
                  </span>
                  <span className="px-2 py-0.5 rounded-[4px] bg-brand/10 border border-brand/30 text-brand text-[11px] font-mono">
                    SIMULATED DRILL
                  </span>
                </div>
              </div>

              {/* Mock Content Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Dialysis Card */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-hairline space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-semantic-critical-text">
                      NG-101 • SCORE 86.5
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-semantic-critical/20 text-semantic-critical-text border border-semantic-critical-border">
                      CRITICAL
                    </span>
                  </div>
                  <p className="text-xs text-ink font-medium">Hemodialysis patient trapped in chest-deep current</p>
                  <div className="text-[11px] font-mono text-ink-subtle">
                    LifeThreat 4.5 • MedUrg 5.0 • EvacInab 4.0
                  </div>
                </div>

                {/* Blind-Spot Synthesis Card */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-semantic-blind-spot-border/50 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-semantic-blind-spot-text">
                      NG-103 • SCORE 68.7
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-semantic-blind-spot/20 text-semantic-blind-spot-text border border-semantic-blind-spot-border">
                      SYNTHETIC RECON
                    </span>
                  </div>
                  <p className="text-xs text-ink font-medium">Sector 3A Total Blackout (Tower-Alpha-3 Collapse)</p>
                  <div className="text-[11px] font-mono text-ink-subtle">
                    Silence 110m ≥ 90m • Gauge 1.9m • Floor ≥ 60.0
                  </div>
                </div>

                {/* Opportunity Cost Alert */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-hairline space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-semantic-warning-text">
                      OPPORTUNITY COST
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-surface-3 text-ink-muted">
                      +35 MIN PENALTY
                    </span>
                  </div>
                  <p className="text-xs text-ink font-medium">Assigning Jet-Boat 01 leaves 0 shallow craft in Sector 2</p>
                  <div className="text-[11px] font-mono text-ink-subtle">
                    Queued NG-104 [Score 56.5] turnaround delay
                  </div>
                </div>
              </div>

              {/* Bottom Quick Launch Link */}
              <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs font-mono text-ink-subtle">
                <span>12 Seed Incidents • 6 Assets • 3 Shelters • 4 Sectors</span>
                <NextLink
                  href="/dashboard"
                  className="text-brand hover:text-brand-hover inline-flex items-center gap-1 font-semibold"
                >
                  <span>Open Full Cockpit View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </NextLink>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* THE INVISIBLE CRISIS: WHY STANDARD DISASTER SOFTWARE FAILS         */}
        {/* ================================================================= */}
        <section className="py-20 sm:py-24 border-t border-hairline bg-canvas">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[13px] font-medium tracking-[0.4px] text-ink-subtle uppercase font-mono block mb-2">
                Problem 01 // The Real-World Breakdown
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold leading-[1.15] tracking-[-1.0px] text-ink">
                Why flood queues fail the most vulnerable
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Problem 1 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-9 h-9 rounded-[8px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-critical-text mb-5">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-[18px] font-medium leading-[1.25] tracking-[-0.4px] text-ink mb-2">
                  Loudest Smartphone Bias
                </h3>
                <p className="text-[14px] leading-[1.5] text-ink-subtle">
                  Standard dispatch algorithms process calls chronologically or by viral media volume. A flooded commercial basement gets a jet-boat in 10 minutes while a dialysis patient with a dead phone drowned in silence.
                </p>
              </div>

              {/* Problem 2 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-9 h-9 rounded-[8px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-blind-spot-text mb-5">
                  <WifiOff className="w-4 h-4" />
                </div>
                <h3 className="text-[18px] font-medium leading-[1.25] tracking-[-0.4px] text-ink mb-2">
                  The Cellular Black Hole
                </h3>
                <p className="text-[14px] leading-[1.5] text-ink-subtle">
                  When riverbank cell towers collapse, incoming call volume drops to zero. Naive dispatchers mistakenly interpret zero calls as &quot;no emergency&quot; in the very sectors facing the highest surge inundation.
                </p>
              </div>

              {/* Problem 3 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-9 h-9 rounded-[8px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-warning-text mb-5">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-[18px] font-medium leading-[1.25] tracking-[-0.4px] text-ink mb-2">
                  Blind Asset Scarcity
                </h3>
                <p className="text-[14px] leading-[1.5] text-ink-subtle">
                  Coordinators commit specialized shallow-draft rescue boats to isolated tasks without knowing that downstream queues will incur fatal +35 minute turnaround penalties when the next critical case appears.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* THE 6 TACTICAL BREAKTHROUGHS                                      */}
        {/* ================================================================= */}
        <section className="py-20 sm:py-24 border-t border-hairline bg-surface-1/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[13px] font-medium tracking-[0.4px] text-brand uppercase font-mono block mb-2">
                Engineering Innovations // 100% Deterministic
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold leading-[1.15] tracking-[-1.0px] text-ink">
                Built for mission-critical disaster command
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-brand mb-4">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-2">
                  Deterministic 0–100 MCDA
                </h3>
                <p className="text-[13px] text-ink-subtle leading-[1.5] mb-3">
                  Scores are calculated by mathematical multi-criteria arithmetic, never by an LLM. Missing data renormalizes weights so callers with broken phones are never penalized with zeroes.
                </p>
                <div className="px-2.5 py-1 rounded-[4px] bg-surface-2 border border-hairline text-[11px] font-mono text-ink-muted">
                  Score = 100 × [ Σ (wᵢ · fᵢ / 5) ] / Σ wᵢ
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-blind-spot-text mb-4">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-2">
                  Sector Blind-Spot Engine
                </h3>
                <p className="text-[13px] text-ink-subtle leading-[1.5] mb-3">
                  When a sector goes silent for ≥90 minutes during rising water gauges, Nigehbaan automatically synthesizes a high-priority recon sweep incident with an enforced minimum floor of 60.0.
                </p>
                <div className="px-2.5 py-1 rounded-[4px] bg-semantic-blind-spot/15 border border-semantic-blind-spot-border text-[11px] font-mono text-semantic-blind-spot-text">
                  Synthetic NG-103 • Recon Floor ≥ 60.0
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-warning-text mb-4">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-2">
                  Tactical Opportunity Cost
                </h3>
                <p className="text-[13px] text-ink-subtle leading-[1.5] mb-3">
                  Before a scarce jet-boat is assigned, the system warns coordinators of downstream delays (+35 min). Autonomous dispatch is strictly blocked: human approval is mandatory.
                </p>
                <div className="px-2.5 py-1 rounded-[4px] bg-surface-2 border border-hairline text-[11px] font-mono text-semantic-warning-text">
                  Leaves 0 boats in sector • +35 min delay
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-brand mb-4">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-2">
                  Medical Shelter Matching
                </h3>
                <p className="text-[13px] text-ink-subtle leading-[1.5] mb-3">
                  Routes dialysis evacuees specifically to facilities with active backup power (Civil Hospital Annexe), while auto-excluding facilities with blackout or 97% capacity breach.
                </p>
                <div className="px-2.5 py-1 rounded-[4px] bg-surface-2 border border-hairline text-[11px] font-mono text-semantic-success-text">
                  Routes NG-101 to SHL-02 • Excludes SHL-03
                </div>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-critical-text mb-4">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-2">
                  Bilingual Voice Hotline
                </h3>
                <p className="text-[13px] text-ink-subtle leading-[1.5] mb-3">
                  Real-time HTML5 Canvas Web Audio waveform player renders incoming Urdu calls with synchronized Nastaliq Urdu (RTL) alongside English translations and honest provenance badges.
                </p>
                <div className="px-2.5 py-1 rounded-[4px] bg-surface-2 border border-hairline text-[11px] font-mono text-ink-muted">
                  Web Audio Canvas • Urdu RTL + English
                </div>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-success-text mb-4">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-2">
                  Installable PWA &amp; Offline Queue
                </h3>
                <p className="text-[13px] text-ink-subtle leading-[1.5] mb-3">
                  Service Worker caches shell routes for full offline operations. Submissions in dead zones queue locally in localStorage and automatically drain to the command dashboard on reconnect.
                </p>
                <div className="px-2.5 py-1 rounded-[4px] bg-surface-2 border border-hairline text-[11px] font-mono text-semantic-success-text">
                  PWA Manifest • LocalStorage Sync
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* RETROSPECTIVE FCFS IMPACT METRICS                                 */}
        {/* ================================================================= */}
        <section className="py-20 sm:py-24 border-t border-hairline bg-canvas">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[13px] font-medium tracking-[0.4px] text-semantic-success-text uppercase font-mono block mb-2">
                Simulated Disaster Drill // T+12 Retrospective
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold leading-[1.15] tracking-[-1.0px] text-ink">
                Nigehbaan vs. Naive Arrival Queue
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Stat 1 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline text-center">
                <div className="text-3xl sm:text-5xl font-mono font-bold text-semantic-success-text mb-1">
                  -97%
                </div>
                <div className="text-xs uppercase font-mono text-ink-subtle">
                  Critical Dispatch Latency
                </div>
                <p className="text-[12px] text-ink-tertiary mt-2">
                  From 212 min down to 7 min
                </p>
              </div>

              {/* Stat 2 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline text-center">
                <div className="text-3xl sm:text-5xl font-mono font-bold text-semantic-success-text mb-1">
                  0%
                </div>
                <div className="text-xs uppercase font-mono text-ink-subtle">
                  Fleet Misallocation
                </div>
                <p className="text-[12px] text-ink-tertiary mt-2">
                  Down from 40% under FCFS
                </p>
              </div>

              {/* Stat 3 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline text-center">
                <div className="text-3xl sm:text-5xl font-mono font-bold text-brand mb-1">
                  100%
                </div>
                <div className="text-xs uppercase font-mono text-ink-subtle">
                  Silent Sector Coverage
                </div>
                <p className="text-[12px] text-ink-tertiary mt-2">
                  Sector 3A recon in 5 minutes
                </p>
              </div>

              {/* Stat 4 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline text-center">
                <div className="text-3xl sm:text-5xl font-mono font-bold text-semantic-critical-text mb-1">
                  4
                </div>
                <div className="text-xs uppercase font-mono text-ink-subtle">
                  Preventable Casualties Saved
                </div>
                <p className="text-[12px] text-ink-tertiary mt-2">
                  Fatalities under FCFS averted
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* CLOSING CTA BANNER                                                */}
        {/* ================================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <div className="p-8 sm:p-12 rounded-[16px] bg-surface-1 border border-hairline text-center relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
            <h2 className="text-2xl sm:text-4xl font-semibold leading-[1.2] tracking-[-1.0px] text-ink mb-4 max-w-xl mx-auto">
              Ready to test the live disaster coordination cockpit?
            </h2>
            <p className="text-sm sm:text-base text-ink-muted max-w-lg mx-auto mb-8">
              Explore live CartoDB Dark Matter GIS mapping, advance the multi-phase timeline scrubber, and inspect deterministic explainability cards.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <NextLink
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 text-[14px] font-medium text-white bg-brand hover:bg-brand-hover active:bg-brand-focus rounded-[8px] transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Command Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </NextLink>

              <NextLink
                href="/guide"
                className="w-full sm:w-auto px-6 py-3 text-[14px] font-medium text-ink bg-surface-2 border border-hairline hover:bg-surface-3 rounded-[8px] transition-all flex items-center justify-center gap-2"
              >
                <span>View Evaluator Blueprint</span>
              </NextLink>
            </div>
          </div>
        </section>
      </main>

      {/* Linear Footer */}
      <LinearFooter />
    </div>
  );
}
