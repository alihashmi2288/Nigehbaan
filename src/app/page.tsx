'use client';

import React, { useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Terminal,
  Compass,
  AlertTriangle,
  Clock,
  Waves,
  MapPin,
  Flame,
} from 'lucide-react';
import { ResetButton } from '@/components/layout';
import { MapWrapper } from '@/components/map';
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
  const shelters = useAppStore((state) => state.shelters);
  const selectedIncidentId = useAppStore((state) => state.selectedIncidentId);

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
            <span className="text-xs text-ink-subtle border-l border-hairline pl-2 ml-1">
              Tactical Emergency Command System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ResetButton />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-ping" />
            LIVE PIPELINE READY
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-brand">
            <Terminal className="w-3.5 h-3.5" />
            Milestone 3: GIS Tactical Map Active
          </span>
        </div>
      </header>

      {/* Main Operational Container */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* Disaster Timeline Scrubber & Phase Controller */}
        <section className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
              Advance timeline to test dynamic disaster phases, cell tower collapse, and blind-spot synthesis.
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

        {/* Tactical GIS Command Map Frame */}
        <section className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-semibold tracking-tight text-ink uppercase font-mono">
                District Alpha Tactical GIS Command Map
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-ink-subtle">
              <span>CartoDB Dark Matter</span>
              <span className="border-l border-hairline pl-3">Centroid: 24.935, 67.145</span>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="w-full h-[540px]">
            <MapWrapper />
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

          {/* High */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">SCORE 55.0 – 74.9</span>
              <AlertTriangle className="w-4 h-4 text-semantic-warning-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-warning-text">
                High
              </div>
              <p className="text-xs text-ink-subtle">
                Vulnerable mobility, stale reports (&gt;60m), proxy reports
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-semantic-warning-border bg-semantic-warning/15 text-semantic-warning-text text-center">
              --semantic-warning
            </span>
          </div>

          {/* Blind-Spot */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">FLOOR ENFORCED ≥ 60</span>
              <Radio className="w-4 h-4 text-semantic-blind-spot-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-blind-spot-text">
                Blind Spot
              </div>
              <p className="text-xs text-ink-subtle">
                Coverage silence &gt;90m, cell tower collapse, field recon
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-semantic-blind-spot-border bg-semantic-blind-spot/15 text-semantic-blind-spot-text text-center">
              --semantic-blind-spot
            </span>
          </div>

          {/* Success */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">RESOLVED / CONFIRMED</span>
              <Compass className="w-4 h-4 text-semantic-success-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-success-text">
                Operational
              </div>
              <p className="text-xs text-ink-subtle">
                Available rescue resources, confirmed staging shelters
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-semantic-success-border bg-semantic-success/15 text-semantic-success-text text-center">
              --semantic-success
            </span>
          </div>

          {/* Unknown */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-subtle">WEIGHT RENORMALIZED</span>
              <Compass className="w-4 h-4 text-semantic-unknown-text" />
            </div>
            <div>
              <div className="text-lg font-bold text-semantic-unknown-text">
                Uncertainty
              </div>
              <p className="text-xs text-ink-subtle">
                Missing coordinates, approximate facts, offline fallbacks
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-mono border border-semantic-unknown/30 bg-semantic-unknown/20 text-semantic-unknown-text text-center">
              --semantic-unknown
            </span>
          </div>
        </section>
      </div>

      {/* Tactical HUD Footer */}
      <footer className="h-10 border-t border-hairline bg-surface-1 px-6 flex items-center justify-between text-xs text-ink-subtle font-mono">
        <span>NIGEHBAAN_CORE_REV_0.1 // DISTRICT_ALPHA_GIS</span>
        <span>CODE//CONNECT&apos;26 --- PROBLEM 01</span>
      </footer>
    </main>
  );
}
