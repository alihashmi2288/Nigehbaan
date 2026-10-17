'use client';

import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { ResetButton } from '@/components/layout';
import { MapWrapper } from '@/components/map';
import { IncidentQueue } from '@/components/queue';
import { IncidentInspector } from '@/components/inspector';
import { IntakeModal } from '@/components/intake';
import { UncertaintyRadarPanel } from '@/components/uncertainty';
import { AuditLogDrawer } from '@/components/audit';
import { TimelineScrubber } from '@/components/timeline';
import { useAppStore, selectVisibleIncidents } from '@/store';
import { TimelinePhaseId } from '@/types';

export default function Home() {
  const isHydrated = useAppStore((state) => state.isHydrated);
  const setHydrated = useAppStore((state) => state.setHydrated);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const simulationClock = useAppStore((state) => state.simulationClock);
  const setTimelinePhase = useAppStore((state) => state.setTimelinePhase);
  const scenario = useAppStore((state) => state.scenario);
  const incidents = useAppStore((state) => state.incidents);
  const resources = useAppStore((state) => state.resources);
  const activityLogs = useAppStore((state) => state.activityLogs);

  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  const visibleIncidents = selectVisibleIncidents(incidents, timelinePhase, simulationClock);
  const criticalCount = visibleIncidents.filter((i) => i.category === 'Critical').length;
  const availableResources = resources.filter((r) => r.status === 'available').length;
  const isSector3ABlindSpot = timelinePhase === 'T6' || timelinePhase === 'T12';

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
            <span className="text-xs text-ink-subtle border-l border-hairline pl-2 ml-1 hidden sm:inline">
              Tactical Emergency Command System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Emergency Intake Button (Task T5.1 & T5.4) */}
          <button
            type="button"
            onClick={() => setIsIntakeModalOpen(true)}
            className="px-3 py-1.5 rounded text-xs font-mono font-bold bg-brand hover:bg-brand-hover text-white flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Emergency Intake</span>
          </button>

          {/* Activity Audit Log Drawer Trigger (Task T7.3) */}
          <button
            type="button"
            data-testid="open-audit-drawer-button"
            onClick={() => setIsAuditModalOpen(true)}
            className="px-3 py-1.5 rounded text-xs font-mono font-semibold bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-ink border border-hairline flex items-center gap-1.5 transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-brand" />
            <span>Audit Log</span>
            {activityLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-surface-3 text-[10px] text-ink-subtle">
                {activityLogs.length}
              </span>
            )}
          </button>

          <ResetButton />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-ping" />
            LIVE PIPELINE
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-brand">
            <Terminal className="w-3.5 h-3.5" />
            Milestone 8: Disaster Timeline Scrubber &amp; Dynamic Telemetry Active
          </span>
        </div>
      </header>

      {/* Emergency Intake Report Modal */}
      <IntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
      />

      {/* Operational Activity Audit Log Drawer (Task T7.3) */}
      <AuditLogDrawer
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Main Operational Container */}
      <div className="flex-1 p-4 lg:p-6 w-full max-w-[1720px] mx-auto flex flex-col gap-5">
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
