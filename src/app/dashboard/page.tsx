'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Radio,
  Terminal,
  Clock,
  Waves,
  ShieldAlert,
  Flame,
  AlertTriangle,
  MapPin,
  Sliders,
  PlusCircle,
  History,
  PhoneCall,
  BarChart3,
  BookOpen,
  ArrowLeft,
  Crosshair,
  ArrowRight,
  Compass,
  X,
} from 'lucide-react';
import { ResetButton } from '@/components/layout';
import { MapWrapper } from '@/components/map';
import { IncidentQueue } from '@/components/queue';
import { IncidentInspector } from '@/components/inspector';
import { IntakeModal } from '@/components/intake';
import { VoiceDistressPlayer } from '@/components/voice';
import { UncertaintyRadarPanel } from '@/components/uncertainty';
import { AuditLogDrawer } from '@/components/audit';
import { TimelineScrubber } from '@/components/timeline';
import { FcfsComparisonPanel } from '@/components/analytics';
import { PwaOfflineBanner } from '@/components/pwa';
import { useAppStore, selectVisibleIncidents, selectRankedVisibleIncidents } from '@/store';
import { TimelinePhaseId } from '@/types';

export default function DashboardPage() {
  const isHydrated = useAppStore((state) => state.isHydrated);
  const setHydrated = useAppStore((state) => state.setHydrated);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const simulationClock = useAppStore((state) => state.simulationClock);
  const setTimelinePhase = useAppStore((state) => state.setTimelinePhase);
  const scenario = useAppStore((state) => state.scenario);
  const incidents = useAppStore((state) => state.incidents);
  const resources = useAppStore((state) => state.resources);
  const activityLogs = useAppStore((state) => state.activityLogs);
  const setSelectedIncidentId = useAppStore((state) => state.setSelectedIncidentId);

  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isVoiceHotlineOpen, setIsVoiceHotlineOpen] = useState(false);
  const [isFcfsModalOpen, setIsFcfsModalOpen] = useState(false);
  const [isBriefingVisible, setIsBriefingVisible] = useState(true);

  useEffect(() => {
    setHydrated(true);
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('nigehbaan_briefing_dismissed');
      if (dismissed === 'true') {
        setIsBriefingVisible(false);
      }
    }
  }, [setHydrated]);

  const visibleIncidents = selectVisibleIncidents(incidents, timelinePhase, simulationClock);
  const rankedVisible = selectRankedVisibleIncidents(incidents, timelinePhase, simulationClock);
  const topIncident = rankedVisible.length > 0 ? rankedVisible[0] : null;
  const topUnassignedIncident = rankedVisible.find(
    (i) => !i.assignedResourceId && i.status !== 'assigned'
  );
  const targetIncident = topUnassignedIncident ?? topIncident;

  const criticalCount = visibleIncidents.filter((i) => i.category === 'Critical').length;
  const availableResources = resources.filter((r) => r.status === 'available').length;
  const isSector3ABlindSpot = timelinePhase === 'T6' || timelinePhase === 'T12';

  return (
    <main className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      {/* Tactical HUD Header */}
      <header className="h-14 border-b border-hairline bg-surface-1 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <NextLink
            href="/"
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
            title="Return to Product Overview"
          >
            <div className="w-8 h-8 rounded-[6px] border border-brand bg-brand/10 flex items-center justify-center text-brand">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold tracking-tight text-lg text-ink font-mono">
                NIGEHBAAN
              </span>
              <span className="text-xs text-ink-muted font-medium" dir="rtl">
                (نگہبان)
              </span>
            </div>
          </NextLink>

          {/* Quick Nav: Overview & Platform Guide */}
          <div className="hidden md:flex items-center gap-2 border-l border-hairline pl-3 ml-1">
            <NextLink
              href="/"
              className="px-2.5 py-1.5 rounded-[6px] text-xs font-mono font-medium bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-ink border border-hairline flex items-center gap-1.5 transition-all shadow-sm group"
              title="Return to Product Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-ink-subtle group-hover:-translate-x-0.5 transition-transform" />
              <span>Overview</span>
            </NextLink>

            <NextLink
              href="/guide"
              className="px-2.5 py-1.5 rounded-[6px] text-xs font-mono font-medium bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-ink border border-hairline flex items-center gap-1.5 transition-all shadow-sm"
              title="Open Platform Guide & Operator Blueprint"
            >
              <BookOpen className="w-3.5 h-3.5 text-brand" />
              <span>Platform Guide</span>
            </NextLink>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bilingual Voice Distress Hotline (Milestone 11 / Acceptance Test 2.3) */}
          <button
            type="button"
            data-testid="open-voice-hotline-button"
            onClick={() => setIsVoiceHotlineOpen(true)}
            className="px-3 py-1.5 rounded-[6px] text-xs font-mono font-bold bg-semantic-critical/20 hover:bg-semantic-critical/30 text-semantic-critical-text border border-semantic-critical-border flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Voice Hotline</span>
            <span className="sm:hidden">Voice</span>
          </button>

          {/* Emergency Intake Button (Task T5.1 & T5.4) */}
          <button
            type="button"
            onClick={() => setIsIntakeModalOpen(true)}
            className="px-3 py-1.5 rounded-[6px] text-xs font-mono font-bold bg-brand hover:bg-brand-hover text-white flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Emergency Intake</span>
            <span className="sm:hidden">Intake</span>
          </button>

          {/* Activity Audit Log Drawer Trigger (Task T7.3) */}
          <button
            type="button"
            data-testid="open-audit-drawer-button"
            onClick={() => setIsAuditModalOpen(true)}
            className="px-3 py-1.5 rounded-[6px] text-xs font-mono font-semibold bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-ink border border-hairline flex items-center gap-1.5 transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-brand" />
            <span className="hidden sm:inline">Audit Log</span>
            {activityLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-surface-3 text-[10px] text-ink-subtle">
                {activityLogs.length}
              </span>
            )}
          </button>

          {/* FCFS vs. Nigehbaan Retrospective Panel Trigger (Task T12.2) */}
          <button
            type="button"
            data-testid="open-fcfs-comparison-button"
            onClick={() => setIsFcfsModalOpen(true)}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              timelinePhase === 'T12'
                ? 'bg-brand text-white border border-brand ring-2 ring-brand/30 animate-pulse'
                : 'bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-ink border border-hairline'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-brand" />
            <span className="hidden sm:inline">FCFS Analysis</span>
            <span className="sm:hidden">FCFS</span>
            {timelinePhase === 'T12' && (
              <span className="px-1.5 py-0.2 rounded bg-white text-brand text-[9px] font-bold">
                T+12
              </span>
            )}
          </button>

          <ResetButton />

          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-mono bg-surface-2 border border-hairline text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-ping" />
            LIVE PIPELINE
          </span>
        </div>
      </header>

      {/* Emergency Intake Report Modal */}
      <IntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
      />

      {/* Voice Distress Hotline Modal (Milestone 11 / Acceptance Test 2.3) */}
      <VoiceDistressPlayer
        isOpen={isVoiceHotlineOpen}
        onClose={() => setIsVoiceHotlineOpen(false)}
      />

      {/* Operational Activity Audit Log Drawer (Task T7.3) */}
      <AuditLogDrawer
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* FCFS vs Nigehbaan Retrospective Dashboard Panel (Task T12.2) */}
      <FcfsComparisonPanel
        isOpen={isFcfsModalOpen}
        onClose={() => setIsFcfsModalOpen(false)}
      />

      {/* Main Operational Container */}
      <div className="flex-1 p-4 lg:p-6 w-full max-w-[1720px] mx-auto flex flex-col gap-5">
        {/* PWA Offline Synchronization Ribbon (Task T12.1) */}
        <PwaOfflineBanner />

        {/* First-Time Coordinator Briefing Ribbon (Recommendation 4) */}
        {isBriefingVisible && (
          <div className="bg-surface-1 border border-brand/35 rounded-lg p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-brand">
            <div className="flex items-center gap-2.5 text-ink">
              <div className="w-6 h-6 rounded bg-brand/10 border border-brand/30 flex items-center justify-center text-brand shrink-0">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <p className="font-sans text-ink-muted leading-relaxed">
                <strong className="text-ink font-semibold mr-1 font-mono uppercase text-[11px]">Coordinator Briefing:</strong>
                You are managing the District Alpha flood drill. Click any incident in the left queue to inspect its transparent math score, or advance the timeline to <strong className="text-brand font-mono">T+6</strong> to trigger the silent cell tower blackout.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <NextLink
                href="/guide"
                className="px-2.5 py-1 rounded-[6px] bg-surface-2 hover:bg-surface-3 text-ink hover:text-white border border-hairline font-mono text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                <BookOpen className="w-3 h-3 text-brand" />
                <span>2-Min Guide</span>
              </NextLink>
              <button
                type="button"
                onClick={() => {
                  setIsBriefingVisible(false);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('nigehbaan_briefing_dismissed', 'true');
                  }
                }}
                className="p-1 rounded hover:bg-surface-2 text-ink-subtle hover:text-ink transition-colors"
                title="Dismiss briefing"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Disaster Timeline Scrubber & Phase Controller (Task T8.1 & T8.2) */}
        <TimelineScrubber />

        {/* Tactical Telemetry Ribbon */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-surface-1 border border-hairline flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-subtle block">Visible Incidents</span>
              <span className="text-xl font-mono font-bold text-ink">{visibleIncidents.length}</span>
            </div>
            <ShieldAlert className="w-5 h-5 text-brand" />
          </div>

          <div className="p-3 rounded-lg bg-surface-1 border border-hairline flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-subtle block">Critical Cases</span>
              <span className="text-xl font-mono font-bold text-semantic-critical-text">{criticalCount}</span>
            </div>
            <Flame className="w-5 h-5 text-semantic-critical-text" />
          </div>

          <div className="p-3 rounded-lg bg-surface-1 border border-hairline flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-subtle block">Available Assets</span>
              <span className="text-xl font-mono font-bold text-semantic-success-text">
                {availableResources} / {resources.length}
              </span>
            </div>
            <Waves className="w-5 h-5 text-semantic-success-text" />
          </div>

          <div
            className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
              isSector3ABlindSpot
                ? 'bg-semantic-blind-spot/15 border-semantic-blind-spot-border text-semantic-blind-spot-text'
                : 'bg-surface-1 border-hairline text-ink-muted'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-subtle block">Coverage Radar</span>
              <span className="text-xs font-mono font-bold">
                {isSector3ABlindSpot ? 'SECTOR 3A SILENT' : 'ALL TOWERS ONLINE'}
              </span>
            </div>
            {isSector3ABlindSpot ? (
              <AlertTriangle className="w-5 h-5 text-semantic-blind-spot animate-bounce" />
            ) : (
              <Radio className="w-5 h-5 text-semantic-success-text" />
            )}
          </div>
        </section>

        {/* Tactical Uncertainty Radar Panel (Milestone 6: Tasks T6.1 & T6.3) */}
        <UncertaintyRadarPanel />

        {/* Tactical Operational Situational Awareness & Recommended Action Bar (Task 2) */}
        <section className="bg-surface-1 border border-hairline rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-brand">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-surface-2 border border-hairline flex items-center justify-center text-brand shrink-0">
              <Crosshair className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand">
                  Recommended Coordinator Next Action
                </span>
                {topIncident && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-surface-3 border border-hairline text-ink-muted">
                    TOP QUEUE: {topIncident.code} ({topIncident.category} • {(topIncident.score ?? topIncident.expectedScore ?? 0).toFixed(1)})
                  </span>
                )}
                {isSector3ABlindSpot && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-semantic-blind-spot/15 border border-semantic-blind-spot-border text-semantic-blind-spot-text flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 animate-pulse" />
                    SECTOR 3A SILENT (110m)
                  </span>
                )}
              </div>
              <p className="text-xs text-ink font-medium leading-relaxed font-sans">
                {targetIncident
                  ? !targetIncident.assignedResourceId && targetIncident.status !== 'assigned'
                    ? `Assign specialized rescue asset to ${targetIncident.code} in ${targetIncident.sectorId.replace('-', ' ').toUpperCase()} (${targetIncident.category} priority — ${targetIncident.reportText.slice(0, 80)}...)`
                    : `Active dispatch assigned for ${targetIncident.code}. Monitoring downstream sectors for escalation.`
                  : 'All sectors nominal. Advance disaster timeline to drill crisis escalation.'}
              </p>
            </div>
          </div>

          {targetIncident && (
            <button
              type="button"
              onClick={() => setSelectedIncidentId(targetIncident.id)}
              className="px-3.5 py-1.5 rounded-[6px] text-xs font-mono font-bold text-white bg-brand hover:bg-brand-hover active:bg-brand-focus transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>Inspect {targetIncident.code}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </section>

        {/* Tactical 3-Panel Operations Command Cockpit (Milestone 4 Integration) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Panel: Triage Incident Queue (Task T4.1) */}
          <div className="lg:col-span-4 xl:col-span-3 h-[780px]">
            <IncidentQueue />
          </div>

          {/* Center Panel: Tactical GIS Command Map (Milestone 3) */}
          <div className="lg:col-span-8 xl:col-span-5 h-[780px] bg-surface-1 border border-hairline rounded-lg p-3.5 flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-hairline pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand" />
                <h2 className="text-sm font-semibold tracking-tight text-ink uppercase font-mono">
                  District Alpha Tactical GIS
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-ink-subtle">
                <span className="hidden sm:inline">CartoDB Dark Matter</span>
                <span className="border-l border-hairline pl-3">24.935, 67.145</span>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="flex-1 w-full rounded overflow-hidden">
              <MapWrapper />
            </div>
          </div>

          {/* Right Panel: Incident Detail Inspector & Factor Breakdown (Task T4.2 & T4.3) */}
          <div className="lg:col-span-12 xl:col-span-4 h-[780px]">
            <IncidentInspector />
          </div>
        </div>

        {/* Tactical Semantic Reference Matrix */}
        <section id="tokens" className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Critical */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-subtle">SCORE ≥ 75.0</span>
              <ShieldAlert className="w-4 h-4 text-semantic-critical-text" />
            </div>
            <div>
              <div className="text-sm font-bold text-semantic-critical-text">Critical</div>
              <p className="text-[11px] text-ink-subtle">
                Active life threat, drowning, oxygen / dialysis outage
              </p>
            </div>
          </div>

          {/* High */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-subtle">SCORE 55.0 – 74.9</span>
              <AlertTriangle className="w-4 h-4 text-semantic-warning-text" />
            </div>
            <div>
              <div className="text-sm font-bold text-semantic-warning-text">High</div>
              <p className="text-[11px] text-ink-subtle">
                Vulnerable mobility, stale reports (&gt;60m), proxy reports
              </p>
            </div>
          </div>

          {/* Blind-Spot */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-subtle">FLOOR ENFORCED ≥ 60</span>
              <Radio className="w-4 h-4 text-semantic-blind-spot-text" />
            </div>
            <div>
              <div className="text-sm font-bold text-semantic-blind-spot-text">Blind Spot</div>
              <p className="text-[11px] text-ink-subtle">
                Coverage silence &gt;90m, cell tower collapse, field recon
              </p>
            </div>
          </div>

          {/* Operational */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-subtle">RESOLVED / CONFIRMED</span>
              <Waves className="w-4 h-4 text-semantic-success-text" />
            </div>
            <div>
              <div className="text-sm font-bold text-semantic-success-text">Operational</div>
              <p className="text-[11px] text-ink-subtle">
                Available rescue resources, confirmed staging shelters
              </p>
            </div>
          </div>

          {/* Uncertainty */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-subtle">WEIGHT RENORMALIZED</span>
              <Sliders className="w-4 h-4 text-semantic-unknown-text" />
            </div>
            <div>
              <div className="text-sm font-bold text-semantic-unknown-text">Uncertainty</div>
              <p className="text-[11px] text-ink-subtle">
                Missing coordinates, approximate facts, offline fallbacks
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Tactical HUD Footer */}
      <footer className="h-10 border-t border-hairline bg-surface-1 px-6 flex items-center justify-between text-xs text-ink-subtle font-mono">
        <span>NIGEHBAAN_CORE_REV_0.1 // OPERATIONAL_TRIAGE_COCKPIT</span>
        <span>CODE//CONNECT&apos;26 --- PROBLEM 01</span>
      </footer>
    </main>
  );
}
