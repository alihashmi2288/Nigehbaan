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
  ShieldCheck,
  HelpCircle,
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
            <span>HOW IT WORKS // JUDGE &amp; OPERATOR BLUEPRINT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold leading-[1.1] tracking-[-1.8px] text-ink mb-4">
            Platform Guide &amp; How to Use
          </h1>

          <p className="text-base sm:text-lg font-normal leading-[1.5] text-ink-muted max-w-3xl">
            A plain-language guide for hackathon judges and emergency teams. Learn how Nigehbaan calculates fair priority scores without AI hallucinations, how it spots silent blackout neighborhoods, and how to test the platform in 3 minutes.
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
              <span>Back to Overview</span>
            </NextLink>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 1: 3-MINUTE EVALUATOR QUICKSTART                          */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div>
            <span className="text-[12px] font-mono uppercase tracking-[0.4px] text-brand block mb-1">
              Section 01 // Interactive Walkthrough
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.6px] text-ink">
              The 3-Minute Quickstart (What to Click)
            </h2>
            <p className="text-sm text-ink-subtle mt-1">
              Follow these 6 simple steps in the Command Cockpit to see all the breakthroughs in action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand">STEP 1 • 0:00 – 0:30</span>
                <span className="text-[11px] font-mono text-ink-subtle">Baseline (T-0)</span>
              </div>
              <h3 className="text-base font-medium text-ink">Open the Flood Map at T-0</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Launch the Cockpit. Look at the interactive dark GIS map showing District Alpha. You will see 4 flood sectors, rescue boat depots, and emergency shelters with live capacity gauges.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-semantic-critical-text">STEP 2 • 0:30 – 1:00</span>
                <span className="text-[11px] font-mono text-ink-subtle">Advance to T+3</span>
              </div>
              <h3 className="text-base font-medium text-ink">Inspect Critical Case NG-101</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Click <span className="text-ink font-mono font-medium">T+3</span> on the timeline bar. The top emergency is <span className="text-semantic-critical-text font-mono font-medium">NG-101</span> (Score 86.5 — Critical): a dialysis patient trapped in deep water. Click the card to see the 5-factor math card explaining exactly why it is ranked #1.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-semantic-blind-spot-text">STEP 3 • 1:00 – 1:30</span>
                <span className="text-[11px] font-mono text-ink-subtle">Advance to T+6</span>
              </div>
              <h3 className="text-base font-medium text-ink">Watch the Silent Sector Trigger</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Click <span className="text-ink font-mono font-medium">T+6</span> on the timeline. Tower-Alpha-3 collapses and Sector 3A goes totally silent for 110 minutes. Nigehbaan spots the silence and automatically generates <span className="text-semantic-blind-spot-text font-mono font-medium">NG-103</span> (Score 68.7, High Priority) so boats are sent immediately.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-semantic-warning-text">STEP 4 • 1:30 – 2:00</span>
                <span className="text-[11px] font-mono text-ink-subtle">Smart Resource Warning</span>
              </div>
              <h3 className="text-base font-medium text-ink">Send a Boat &amp; See the Warning</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Click NG-101 $\to$ Click <span className="text-ink font-medium">&quot;Assign Resource&quot;</span> $\to$ Select <span className="text-ink font-medium">Shallow Jet-Boat 01</span>. The modal warns: *&quot;Sending this leaves 0 boats in Sector 2; the next patient NG-104 will wait +35 minutes longer.&quot;* A human must click to approve.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-semantic-critical-text">STEP 5 • 2:00 – 2:30</span>
                <span className="text-[11px] font-mono text-ink-subtle">Voice &amp; Offline Mode</span>
              </div>
              <h3 className="text-base font-medium text-ink">Play the Urdu Voice Call &amp; Test Offline</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Click <span className="text-semantic-critical-text font-medium">&quot;Voice Hotline&quot;</span> in the header to play real simulated audio with animated soundwaves and Urdu/English subtitles. Then toggle browser offline mode: reports queue locally and auto-upload when reconnected.
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline relative space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand">STEP 6 • 2:30 – 3:00</span>
                <span className="text-[11px] font-mono text-ink-subtle">Advance to T+12 &amp; Reset</span>
              </div>
              <h3 className="text-base font-medium text-ink">View Lives Saved &amp; 1-Click Reset</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                Click <span className="text-ink font-mono font-medium">T+12</span> $\to$ Click <span className="text-brand font-medium">&quot;FCFS Analysis&quot;</span> to see how Nigehbaan cut critical wait time by 97% and saved 4 lives. Then click <span className="text-ink font-medium">&quot;Reset Simulation&quot;</span> in the top bar to instantly restore the pristine baseline.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 2: HOW THE PRIORITY FORMULA WORKS                         */}
        {/* ================================================================= */}
        <section className="space-y-6 border-t border-hairline pt-12">
          <div>
            <span className="text-[12px] font-mono uppercase tracking-[0.4px] text-brand block mb-1">
              Section 02 // The Mathematics
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.6px] text-ink">
              How the Priority Score (0–100) is Calculated
            </h2>
            <p className="text-sm text-ink-subtle mt-1">
              In simple terms: we score emergencies like a fair report card across 5 factors, using pure math. The AI is never allowed to guess numbers.
            </p>
          </div>

          {/* Plain English Analogy Box */}
          <div className="p-5 rounded-[12px] bg-surface-2 border border-brand/40 space-y-2">
            <div className="flex items-center gap-2 text-brand font-medium text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>How Missing Information is Handled (In Plain English)</span>
            </div>
            <p className="text-xs sm:text-[13px] text-ink-muted leading-[1.6]">
              If someone&apos;s phone died mid-call and we only know their water depth (1.5m) but not their medical history, <strong>we do not give them a zero for medical</strong>. Giving a zero would push them to the bottom of the queue. Instead, we calculate their score purely based on the flood danger we know for sure. Missing information raises an <span className="text-brand font-mono font-semibold">Uncertainty Flag</span> to get verified, but it never deprioritizes the victim.
            </p>
          </div>

          {/* The Formula */}
          <div className="p-6 rounded-[12px] bg-surface-1 border border-hairline space-y-3">
            <div className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              The 5-Factor Mathematical Formula
            </div>

            <div className="p-3.5 rounded-[8px] bg-surface-2 border border-hairline font-mono text-sm sm:text-base text-ink overflow-x-auto text-center">
              Score = 100 × [ (0.30 · f₁) + (0.25 · f₂) + (0.20 · f₃) + (0.15 · f₄) + (0.10 · f₅) ] / 5.0
            </div>
          </div>

          {/* 5 Factors Table */}
          <div className="border border-hairline rounded-[12px] overflow-hidden bg-surface-1">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-surface-2 border-b border-hairline text-ink-muted font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Factor</th>
                  <th className="p-3.5">Importance</th>
                  <th className="p-3.5">What We Look For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-ink-subtle">
                <tr>
                  <td className="p-3.5 font-medium text-ink">1. Life Threat (f₁)</td>
                  <td className="p-3.5 font-mono text-brand font-bold">30% of Score</td>
                  <td className="p-3.5">Drowning, strong current, water above chest level (&gt;1.5m), roof collapsing</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-ink">2. Medical Urgency (f₂)</td>
                  <td className="p-3.5 font-mono text-brand font-bold">25% of Score</td>
                  <td className="p-3.5">Missed hemodialysis, heart attack, insulin or ventilator outage, severe bleeding</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-ink">3. Escape Inability (f₃)</td>
                  <td className="p-3.5 font-mono text-brand font-bold">20% of Score</td>
                  <td className="p-3.5">Bedridden elderly, infants, paralyzed, or broken phone (dead phone enforces ≥4.0)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-ink">4. Flood Danger (f₄)</td>
                  <td className="p-3.5 font-mono text-brand font-bold">15% of Score</td>
                  <td className="p-3.5">River gauge rising rapidly, mudslides, live submerged electrical wires</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-ink">5. Number of People (f₅)</td>
                  <td className="p-3.5 font-mono text-brand font-bold">10% of Score</td>
                  <td className="p-3.5">Headcount trapped: 1–2 people, 3–10 family members, 11–50 group, 50+ community</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 3: 3 GOLDEN SAFETY RULES                                  */}
        {/* ================================================================= */}
        <section className="space-y-6 border-t border-hairline pt-12">
          <div>
            <span className="text-[12px] font-mono uppercase tracking-[0.4px] text-brand block mb-1">
              Section 03 // Safety &amp; Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.6px] text-ink">
              Our 3 Golden Safety Rules
            </h2>
            <p className="text-sm text-ink-subtle mt-1">
              Why emergency coordinators and government agencies can trust Nigehbaan in a real crisis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline space-y-2">
              <div className="w-7 h-7 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-brand mb-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium text-ink">1. Zero AI Guesswork</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                AI is only used to extract text and transcribe voice. Priority scores are calculated by verified math. The AI is never allowed to invent or alter a score.
              </p>
            </div>

            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline space-y-2">
              <div className="w-7 h-7 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-brand mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium text-ink">2. Humans Always Approve</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                The software recommends resources and warns of delays, but it never dispatches a boat on its own. A human commander must click &quot;Approve Assignment&quot;.
              </p>
            </div>

            <div className="p-5 rounded-[12px] bg-surface-1 border border-hairline space-y-2">
              <div className="w-7 h-7 rounded-[6px] bg-surface-2 border border-hairline flex items-center justify-center text-brand mb-1">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium text-ink">3. Honest Offline Fallbacks</h3>
              <p className="text-[13px] text-ink-subtle leading-[1.5]">
                If the internet goes down or the Gemini API is unreachable, we never fake AI responses. We explicitly label the output: <span className="text-ink font-mono text-xs">&quot;Offline heuristic extraction (not AI)&quot;</span>.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* CLOSING LAUNCH CTA                                                */}
        {/* ================================================================= */}
        <section className="p-8 sm:p-10 rounded-[16px] bg-surface-1 border border-hairline text-center space-y-4 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
          <h2 className="text-xl sm:text-3xl font-semibold tracking-[-0.6px] text-ink">
            Ready to test the live disaster command center?
          </h2>
          <p className="text-sm text-ink-muted max-w-lg mx-auto">
            Open the Command Cockpit to interact with live flood maps, advance the timeline scrubber, listen to Urdu voice calls, and test the offline queue.
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
