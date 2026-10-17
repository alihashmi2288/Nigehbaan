'use client';

import React, { useEffect } from 'react';
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
} from 'lucide-react';
import { ResetButton } from '@/components/layout';
import { MapWrapper } from '@/components/map';
import { IncidentQueue } from '@/components/queue';
import { IncidentInspector } from '@/components/inspector';
import { useAppStore, selectVisibleIncidents } from '@/store';
import { TimelinePhaseId } from '@/types';

export default function Home() {
  const isHydrated = useAppStore((state) => state.isHydrated);
  const setHydrated = useAppStore((state) => state.setHydrated);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const setTimelinePhase = useAppStore((state) => state.setTimelinePhase);
  const scenario = useAppStore((state) => state.scenario);
  const incidents = useAppStore((state) => state.incidents);
  const resources = useAppStore((state) => state.resources);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  const visibleIncidents = selectVisibleIncidents(incidents, timelinePhase);
  const criticalCount = visibleIncidents.filter((i) => i.category === 'Critical').length;
  const availableResources = resources.filter((r) => r.status === 'available').length;
  const isSector3ABlindSpot = timelinePhase === 'T6' || timelinePhase === 'T12';

  const phases: { id: TimelinePhaseId; label: string; clock: string }[] = [
    { id: 'T0', label: 'T-0 Early Warning', clock: '04:30' },
    { id: 'T3', label: 'T+3 Flood Surge', clock: '07:30' },
    { id: 'T6', label: 'T+6 Grid Blackout', clock: '10:30' },
    { id: 'T12', label: 'T+12 Peak Crisis', clock: '16:30' },
  ];

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
          <ResetButton />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-ping" />
            LIVE PIPELINE
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-brand">
            <Terminal className="w-3.5 h-3.5" />
            Milestone 4: Triage Cockpit Active
          </span>
        </div>
      </header>

      {/* Main Operational Container */}
      <div className="flex-1 p-4 lg:p-6 w-full max-w-[1720px] mx-auto flex flex-col gap-5">
        {/* Disaster Timeline Scrubber & Phase Controller */}
        <section className="bg-surface-1 border border-hairline rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-brand/15 text-brand border border-brand/30 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Scenario Wall Clock Controller
              </span>
              <span className="text-xs text-ink-subtle font-mono">
                {scenario.name}
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              Advance timeline to trigger dynamic disaster phases, cell tower collapse, and blind-spot synthesis.
            </p>
          </div>

          {/* Phase Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {phases.map((p) => {
              const isActive = timelinePhase === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTimelinePhase(p.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-brand text-white border-brand shadow-md font-bold'
                      : 'bg-surface-2 hover:bg-surface-3 text-ink-muted border-hairline'
                  }`}
                >
                  {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  <span>{p.label}</span>
                  <span className="text-[10px] opacity-75">({p.clock})</span>
                </button>
              );
            })}
          </div>
        </section>

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
