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

              {/* 3 Live Preview Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Critical Patient */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-hairline space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-semantic-critical-text">
                      NG-101 • SCORE 86.5
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-semantic-critical/20 text-semantic-critical-text border border-semantic-critical-border">
                      CRITICAL #1
                    </span>
                  </div>
                  <p className="text-xs text-ink font-medium">Dialysis patient trapped in chest-deep water</p>
                  <p className="text-[11px] text-ink-subtle leading-[1.4]">
                    Prioritized automatically: missed medical treatment + high flood depth.
                  </p>
                </div>

                {/* 2. Silent Blackout Area */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-semantic-blind-spot-border/50 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-semantic-blind-spot-text">
                      NG-103 • SCORE 68.7
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-semantic-blind-spot/20 text-semantic-blind-spot-text border border-semantic-blind-spot-border">
                      AUTO SEARCH SWEEP
                    </span>
                  </div>
                  <p className="text-xs text-ink font-medium">Sector 3A Total Blackout (Tower Collapsed)</p>
                  <p className="text-[11px] text-ink-subtle leading-[1.4]">
                    Zero calls for 110 mins while water is rising $\to$ system deploys search boat.
                  </p>
                </div>

                {/* 3. Resource Warning */}
                <div className="p-3.5 rounded-[8px] bg-surface-2 border border-hairline space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-semantic-warning-text">
                      SMART WARNING
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-surface-3 text-ink-muted">
                      +35 MIN DELAY
                    </span>
                  </div>
                  <p className="text-xs text-ink font-medium">Warning before committing the last shallow boat</p>
                  <p className="text-[11px] text-ink-subtle leading-[1.4]">
                    Alerts dispatcher that downstream emergency NG-104 will wait 35 min longer.
                  </p>
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
