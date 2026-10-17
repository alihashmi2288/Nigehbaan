'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  ArrowRight,
  Radio,
  Flame,
  Clock,
  WifiOff,
  Cpu,
  Building2,
  PhoneCall,
  Layers,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  Target,
  Activity,
  HelpCircle,
  ShieldAlert,
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

          {/* Subhead in Plain English */}
          <p className="text-lg sm:text-xl font-normal leading-[1.45] tracking-[-0.2px] text-ink-muted max-w-2xl mb-10">
            During major floods in Pakistan, emergency queues fail because they only hear whoever shouts loudest on a smartphone. <span className="text-ink font-medium">Nigehbaan (نگہبان)</span> uses transparent math to prioritize real danger, spots silent neighborhoods whose cell towers collapsed, and warns dispatchers before they send out their last rescue boat.
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
              <span>How It Works (Guide)</span>
            </NextLink>
          </div>

          {/* Product Preview Frame */}
          <div className="w-full mt-14 sm:mt-18 relative">
            <div className="w-full bg-surface-1 border border-hairline rounded-[16px] p-4 sm:p-6 text-left relative overflow-hidden shadow-2xl before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
              {/* Window Top Bar */}
              <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
                  <div className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
                  <div className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
                  <span className="text-[12px] font-mono text-ink-subtle ml-2">
                    district_alpha_live_drill // T+6 HOURS INTO FLOOD
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

              {/* Operational Workflow Breadcrumb Header */}
              <div className="mb-3 px-1 flex items-center justify-between text-[11px] font-mono text-ink-subtle uppercase">
                <span>Tactical Operational Pipeline</span>
                <span className="text-brand">Incident → Assessment → Recommendation → Action</span>
              </div>

              {/* 4-Step Coherent Operational Workflow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Step 1: Incident Intake */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-hairline space-y-2 flex flex-col justify-between hover:border-hairline-strong transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle">
                        01. Incident Intake
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-surface-3 text-ink-muted border border-hairline">
                        SECTOR 2
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-ink flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-semantic-critical animate-ping" />
                      NG-101 (Voice / Urdu)
                    </div>
                    <p className="text-[12px] text-ink-muted leading-[1.4]">
                      Dialysis patient trapped in 1.6m rising water; power outage imminent.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-hairline text-[11px] font-mono text-ink-subtle">
                    Channel: Bilingual Hotline
                  </div>
                </div>

                {/* Step 2: Deterministic Assessment */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-hairline space-y-2 flex flex-col justify-between hover:border-hairline-strong transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle">
                        02. Deterministic Score
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-semantic-critical/20 text-semantic-critical-text border border-semantic-critical-border">
                        CRITICAL #1
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-semantic-critical-text">
                      SCORE 86.5 / 100
                    </div>
                    <p className="text-[12px] text-ink-muted leading-[1.4]">
                      MCDA 5-factor formula: Life Threat 4.5, Medical 5.0. Missing data renormalized.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-hairline text-[11px] font-mono text-brand">
                    Audit: 100% Deterministic
                  </div>
                </div>

                {/* Step 3: Tactical Recommendation */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-hairline space-y-2 flex flex-col justify-between hover:border-hairline-strong transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle">
                        03. Scarcity Match
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-surface-3 text-semantic-success-text border border-semantic-success-border/30">
                        MATCHED
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-ink">
                      Shallow Jet-Boat 01
                    </div>
                    <p className="text-[12px] text-ink-muted leading-[1.4]">
                      Paired with Civil Hospital Annexe (backup generator &amp; dialysis verified).
                    </p>
                  </div>
                  <div className="pt-2 border-t border-hairline text-[11px] font-mono text-semantic-success-text">
                    Capability Shelter Validated
                  </div>
                </div>

                {/* Step 4: Coordinator Action */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-brand/40 space-y-2 flex flex-col justify-between relative overflow-hidden shadow-[0_0_12px_rgba(94,106,210,0.15)]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand">
                        04. Human Dispatch
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-brand text-white">
                        ACTION GATE
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-semantic-warning-text flex items-center gap-1">
                      ⚠️ Trade-Off: +35m Delay
                    </div>
                    <p className="text-[12px] text-ink-muted leading-[1.4]">
                      Warns leaves 0 boats in Sector 2. Coordinator clicks to approve assignment.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-hairline text-[11px] font-mono text-ink-subtle">
                    Invariant: No Auto-Dispatch
                  </div>
                </div>
              </div>

              {/* Bottom Quick Launch Link */}
              <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs font-mono text-ink-subtle">
                <span>12 Real Scenarios • 6 Rescue Assets • 3 Shelters • 4 Flood Sectors</span>
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
        {/* PROBLEM 01 CHALLENGE ALIGNMENT                                    */}
        {/* ================================================================= */}
        <section className="py-20 sm:py-24 border-t border-hairline bg-surface-1/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
            {/* Header & Core Challenge Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-hairline text-[12px] font-mono tracking-[0.4px] text-brand">
                <Target className="w-3.5 h-3.5 text-brand" />
                <span>PROBLEM 01 // DISASTER RESPONSE &amp; EMERGENCY COORDINATION</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-semibold leading-[1.1] tracking-[-1.5px] text-ink">
                Finding who needs help most.
              </h2>
              <div className="p-4 sm:p-5 rounded-[12px] bg-surface-1 border border-brand/30 text-left relative overflow-hidden mt-6 shadow-lg">
                <span className="text-[11px] font-mono uppercase text-brand font-semibold block mb-1">
                  The Core Hackathon Challenge
                </span>
                <p className="text-sm sm:text-base text-ink font-medium leading-[1.5]">
                  &ldquo;How can technology identify who needs help most and coordinate available resources to reach them before the situation becomes critical?&rdquo;
                </p>
                <p className="text-xs sm:text-[13px] text-ink-subtle mt-2 leading-[1.5]">
                  During floods and extreme emergencies, warnings fail to reach isolated elderly residents, low-income zones, and people with disabilities. At the same time, rescue teams and boats are strictly finite. Below is how Nigehbaan systematically solves each mandate of the challenge.
                </p>
              </div>
            </div>

            {/* PART 1: 3 KEY QUESTIONS TO THINK ABOUT */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <div>
                  <span className="text-xs font-mono text-brand uppercase tracking-wider block">
                    01 // Critical Dilemmas
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight">
                    Key Questions &amp; How Nigehbaan Answers Them
                  </h3>
                </div>
                <span className="text-xs font-mono text-ink-subtle hidden sm:inline">
                  3 Mandates Evaluated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Q1 */}
                <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent hover:border-hairline-strong transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-brand font-semibold">QUESTION 01</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-2 border border-hairline text-[10px] font-mono text-ink-subtle">
                        Vulnerability Signals
                      </span>
                    </div>
                    <h4 className="text-[18px] font-medium text-ink leading-snug">
                      Who is most at risk?
                    </h4>
                    <p className="text-[13px] text-ink-subtle leading-[1.5]">
                      <strong className="text-ink">Prompt:</strong> Vulnerability depends on location, age, health, mobility, and communications. How to find people when warnings do not reach everyone?
                    </p>
                    <div className="p-3 rounded-[8px] bg-surface-2 border border-hairline text-xs text-ink-muted leading-[1.5] space-y-1">
                      <div className="font-semibold text-brand font-mono text-[11px]">NIGEHBAAN&apos;S SOLUTION:</div>
                      <div>Evaluates a 5-factor physical vulnerability matrix ($&gt;1.5$m water, bedridden mobility, dialysis/ventilator dependence) rather than smartphone loudness. If a phone is dead, an evacuation inability floor of $\ge 4.0$ is automatically enforced.</div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-hairline text-[11px] font-mono text-ink-subtle flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand" />
                    <span>5-Factor Deterministic Assessment</span>
                  </div>
                </div>

                {/* Q2 */}
                <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent hover:border-hairline-strong transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-brand font-semibold">QUESTION 02</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-2 border border-hairline text-[10px] font-mono text-ink-subtle">
                        Prioritization &amp; Trust
                      </span>
                    </div>
                    <h4 className="text-[18px] font-medium text-ink leading-snug">
                      Who gets help first?
                    </h4>
                    <p className="text-[13px] text-ink-subtle leading-[1.5]">
                      <strong className="text-ink">Prompt:</strong> Supplies and boats are finite. The system must match scarce resources to the greatest need and justify priority in a way responders trust.
                    </p>
                    <div className="p-3 rounded-[8px] bg-surface-2 border border-hairline text-xs text-ink-muted leading-[1.5] space-y-1">
                      <div className="font-semibold text-brand font-mono text-[11px]">NIGEHBAAN&apos;S SOLUTION:</div>
                      <div>100% deterministic mathematical scoring (0–100) using MCDA formulas—the AI is never allowed to invent or alter a score. Every recommendation displays an opportunity-cost delay warning before human dispatch.</div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-hairline text-[11px] font-mono text-ink-subtle flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-semantic-success-text" />
                    <span>Auditable Math • Human-in-the-Loop</span>
                  </div>
                </div>

                {/* Q3 */}
                <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent hover:border-hairline-strong transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-brand font-semibold">QUESTION 03</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-2 border border-hairline text-[10px] font-mono text-ink-subtle">
                        Proactive Staging
                      </span>
                    </div>
                    <h4 className="text-[18px] font-medium text-ink leading-snug">
                      How early can you act?
                    </h4>
                    <p className="text-[13px] text-ink-subtle leading-[1.5]">
                      <strong className="text-ink">Prompt:</strong> Help is most effective before situations turn critical. Think about early signals, forecasts, crowd reports, and pre-positioning.
                    </p>
                    <div className="p-3 rounded-[8px] bg-surface-2 border border-hairline text-xs text-ink-muted leading-[1.5] space-y-1">
                      <div className="font-semibold text-brand font-mono text-[11px]">NIGEHBAAN&apos;S SOLUTION:</div>
                      <div>Pre-positions shallow-water jet boats and mobile medical units at **T-0 Baseline** based on river hydrograph elevation models—staging resources hours before dikes breach instead of reacting to panicked calls.</div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-hairline text-[11px] font-mono text-ink-subtle flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand" />
                    <span>T-0 Pre-Disaster Staging</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PART 2: WHO IS AFFECTED */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <div>
                  <span className="text-xs font-mono text-brand uppercase tracking-wider block">
                    02 // Stakeholder Matrix
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight">
                    Who Is Affected &amp; How Nigehbaan Serves Them
                  </h3>
                </div>
                <span className="text-xs font-mono text-ink-subtle hidden sm:inline">
                  4 Core Populations Protected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Persona 1 */}
                <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline space-y-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-brand">
                    <Radio className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-medium text-ink">Low-Lying Residents</h4>
                  <p className="text-xs text-ink-subtle leading-[1.5]">
                    Monitored via GIS flood polygons and autonomous blind-spot detectors. If cell towers collapse, search sweeps are synthesized automatically.
                  </p>
                </div>

                {/* Persona 2 */}
                <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline space-y-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-critical-text">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-medium text-ink">Elderly &amp; Disabled</h4>
                  <p className="text-xs text-ink-subtle leading-[1.5]">
                    Bedridden and dialysis patients cannot self-evacuate. They receive prioritized medical weighting and guaranteed evacuation factor floors ($\ge 4.0$).
                  </p>
                </div>

                {/* Persona 3 */}
                <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline space-y-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-warning-text">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-medium text-ink">Rescue Responders</h4>
                  <p className="text-xs text-ink-subtle leading-[1.5]">
                    Protected against fatigue and boat depletion. The cockpit displays queue turnaround delays (+35m penalty) before committing specialized assets.
                  </p>
                </div>

                {/* Persona 4 */}
                <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline space-y-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-success-text">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-medium text-ink">Shelter Managers</h4>
                  <p className="text-xs text-ink-subtle leading-[1.5]">
                    Live capacity telemetry and capability-based pairing routes oxygen/dialysis evacuees strictly to generator-backed hospitals, preventing overcrowding.
                  </p>
                </div>
              </div>
            </div>

            {/* PART 3: WHERE IT GETS HARD */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <div>
                  <span className="text-xs font-mono text-brand uppercase tracking-wider block">
                    03 // Real-World Stress Points
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight">
                    &ldquo;Where It Gets Hard&rdquo; — Tackling the 3 Toughest Edge Cases
                  </h3>
                </div>
                <span className="text-xs font-mono text-ink-subtle hidden sm:inline">
                  Zero Assumptions • Resilient Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Hard 1: Incomplete Information */}
                <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-semantic-unknown-text font-bold">EDGE CASE 01</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-2 text-[10px] font-mono text-ink-subtle border border-hairline">
                      Missing Data
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-ink">Incomplete Information</h4>
                  <p className="text-xs text-ink-subtle leading-[1.5]">
                    <strong className="text-ink">The Reality:</strong> Reports are late, duplicated, inaccurate, or missing details because phones die mid-call.
                  </p>
                  <div className="p-3 rounded-[8px] bg-surface-2 border border-hairline text-xs text-ink-muted leading-[1.5]">
                    <span className="text-brand font-mono font-semibold block mb-0.5">WEIGHT RENORMALIZATION:</span>
                    When factor data is missing, weights renormalize across known factors. Missing information flags uncertainty for verification; it <strong>never</strong> lowers a victim&apos;s score.
                  </div>
                </div>

                {/* Hard 2: Competing Priorities */}
                <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-semantic-warning-text font-bold">EDGE CASE 02</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-2 text-[10px] font-mono text-ink-subtle border border-hairline">
                      Resource Contention
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-ink">Competing Priorities</h4>
                  <p className="text-xs text-ink-subtle leading-[1.5]">
                    <strong className="text-ink">The Reality:</strong> A medical emergency, a stranded family, and a flooded school all demand the same single boat.
                  </p>
                  <div className="p-3 rounded-[8px] bg-surface-2 border border-hairline text-xs text-ink-muted leading-[1.5]">
                    <span className="text-brand font-mono font-semibold block mb-0.5">OPPORTUNITY COST ENGINE:</span>
                    Calculates scarcity impact before dispatch. If assigning an asset to a stranded group leaves zero boats and delays a dying patient by +35 min, the system explicitly warns the coordinator.
                  </div>
                </div>

                {/* Hard 3: Connectivity Failure */}
                <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-semantic-blind-spot-text font-bold">EDGE CASE 03</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-2 text-[10px] font-mono text-ink-subtle border border-hairline">
                      Infrastructure Outage
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-ink">Connectivity Failure</h4>
                  <p className="text-xs text-ink-subtle leading-[1.5]">
                    <strong className="text-ink">The Reality:</strong> Cellular towers collapse, fiber lines snap, and batteries die precisely when help is needed.
                  </p>
                  <div className="p-3 rounded-[8px] bg-surface-2 border border-hairline text-xs text-ink-muted leading-[1.5]">
                    <span className="text-brand font-mono font-semibold block mb-0.5">SILENT BLIND-SPOT SWEEP &amp; PWA:</span>
                    Sectors silent for &gt;90m during rising water auto-synthesize a recon sweep with an enforced floor $\ge 60.0$. Responders in boats use offline PWA queues that auto-sync upon reconnection.
                  </div>
                </div>
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
                The Real-World Problem We Are Solving
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold leading-[1.15] tracking-[-1.0px] text-ink">
                Why traditional flood queues fail the people who need help most
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Problem 1 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-9 h-9 rounded-[8px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-critical-text mb-5">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-[18px] font-medium leading-[1.25] tracking-[-0.4px] text-ink mb-2">
                  The Loudest Smartphone Wins
                </h3>
                <p className="text-[14px] leading-[1.5] text-ink-subtle">
                  Traditional call centers answer whoever calls first or gets attention on social media. A flooded commercial shop gets a rescue boat in 10 minutes, while an elderly resident with a dead battery drowns in silence.
                </p>
              </div>

              {/* Problem 2 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-9 h-9 rounded-[8px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-blind-spot-text mb-5">
                  <WifiOff className="w-4 h-4" />
                </div>
                <h3 className="text-[18px] font-medium leading-[1.25] tracking-[-0.4px] text-ink mb-2">
                  Dead Cell Phone Blackouts
                </h3>
                <p className="text-[14px] leading-[1.5] text-ink-subtle">
                  When riverbank cell towers collapse, incoming calls stop completely. Old systems assume zero calls means &quot;everyone is safe&quot;—completely abandoning the hardest-hit neighborhoods.
                </p>
              </div>

              {/* Problem 3 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-9 h-9 rounded-[8px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-warning-text mb-5">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-[18px] font-medium leading-[1.25] tracking-[-0.4px] text-ink mb-2">
                  Sending the Last Boat Blindly
                </h3>
                <p className="text-[14px] leading-[1.5] text-ink-subtle">
                  Dispatchers send out specialized rescue boats without seeing what happens next. Committing the only shallow-water boat to a minor task causes lethal 35-minute delays when the next dying patient calls.
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
                The 6 Breakthrough Features
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold leading-[1.15] tracking-[-1.0px] text-ink">
                How Nigehbaan solves these problems
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-brand mb-4">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-1">
                  Math-Based Priority Score (0–100)
                </h3>
                <div className="text-[11px] font-mono text-brand mb-2.5">
                  Formula-Driven • Zero AI Hallucinations
                </div>
                <p className="text-[13px] text-ink-subtle leading-[1.5]">
                  Lives cannot depend on an AI guessing a number. We use a transparent 5-factor mathematical formula. If information is missing because a phone died, the system adjusts weights to protect the victim—never giving them a zero.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-blind-spot-text mb-4">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-1">
                  Silent Neighborhood Alerts
                </h3>
                <div className="text-[11px] font-mono text-semantic-blind-spot-text mb-2.5">
                  Automatic Detection • Enforced Floor ≥ 60.0
                </div>
                <p className="text-[13px] text-ink-subtle leading-[1.5]">
                  When floodwaters rise and a sector goes completely silent for 90+ minutes, Nigehbaan doesn&apos;t wait for phone calls that can never come. It automatically generates a high-priority search-and-rescue sweep.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-warning-text mb-4">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-1">
                  Smart Resource Warnings
                </h3>
                <div className="text-[11px] font-mono text-semantic-warning-text mb-2.5">
                  Queue Delay Alert • Human Approval Only
                </div>
                <p className="text-[13px] text-ink-subtle leading-[1.5]">
                  Before a commander sends out a scarce shallow boat, Nigehbaan warns them: &quot;Sending this boat leaves 0 boats in Sector 2, delaying the next dialysis patient by +35 minutes.&quot; A human must click to approve.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-brand mb-4">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-1">
                  Hospital &amp; Shelter Matching
                </h3>
                <div className="text-[11px] font-mono text-semantic-success-text mb-2.5">
                  Power &amp; Dialysis Unit Verification
                </div>
                <p className="text-[13px] text-ink-subtle leading-[1.5]">
                  Matches evacuees to the right care. Dialysis patients are routed specifically to Civil Hospital Annexe with emergency generators, while flooded or overcrowded shelters are automatically excluded.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-critical-text mb-4">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-1">
                  Urdu Voice Emergency Calls
                </h3>
                <div className="text-[11px] font-mono text-ink-muted mb-2.5">
                  Live Soundwaves • Urdu &amp; English Subtitles
                </div>
                <p className="text-[13px] text-ink-subtle leading-[1.5]">
                  For panicking callers who cannot type. The platform plays the audio with live animated soundwaves, transcribes spoken Urdu, and displays English translations with verified provenance badges.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline relative overflow-hidden transition-all hover:border-hairline-strong before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
                <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-semantic-success-text mb-4">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-ink mb-1">
                  Works Offline Without Internet
                </h3>
                <div className="text-[11px] font-mono text-semantic-success-text mb-2.5">
                  Installable App • Local Queue Sync
                </div>
                <p className="text-[13px] text-ink-subtle leading-[1.5]">
                  Rescue workers in boats can log reports in dead zones with zero cell service. Everything saves safely on their phone and automatically uploads to the command dashboard the second signal returns.
                </p>
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
                Proven Impact // 12-Hour Disaster Drill Results
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold leading-[1.15] tracking-[-1.0px] text-ink">
                Old First-Come Queues vs. Nigehbaan
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Stat 1 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline text-center">
                <div className="text-3xl sm:text-5xl font-mono font-bold text-semantic-success-text mb-1">
                  -97%
                </div>
                <div className="text-xs uppercase font-mono text-ink-subtle">
                  Critical Wait Time
                </div>
                <p className="text-[12px] text-ink-tertiary mt-2">
                  From 212 min down to 7 min
                </p>
              </div>

              {/* Stat 2 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline text-center">
                <div className="text-3xl sm:text-5xl font-mono font-bold text-semantic-success-text mb-1">
                  0
                </div>
                <div className="text-xs uppercase font-mono text-ink-subtle">
                  Boats Misallocated
                </div>
                <p className="text-[12px] text-ink-tertiary mt-2">
                  Zero boats wasted on minor tasks
                </p>
              </div>

              {/* Stat 3 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline text-center">
                <div className="text-3xl sm:text-5xl font-mono font-bold text-brand mb-1">
                  100%
                </div>
                <div className="text-xs uppercase font-mono text-ink-subtle">
                  Silent Blackouts Checked
                </div>
                <p className="text-[12px] text-ink-tertiary mt-2">
                  Search boats deployed in 5 min
                </p>
              </div>

              {/* Stat 4 */}
              <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline text-center">
                <div className="text-3xl sm:text-5xl font-mono font-bold text-semantic-critical-text mb-1">
                  4
                </div>
                <div className="text-xs uppercase font-mono text-ink-subtle">
                  Lives Directly Saved
                </div>
                <p className="text-[12px] text-ink-tertiary mt-2">
                  Fatalities under old queues averted
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
              See how smart emergency dispatch saves lives in real time.
            </h2>
            <p className="text-sm sm:text-base text-ink-muted max-w-lg mx-auto mb-8">
              Open the interactive disaster command simulation. Advance the flood timeline, dispatch boats, listen to voice calls, and verify the math.
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
                <span>Read the 3-Minute Guide</span>
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
