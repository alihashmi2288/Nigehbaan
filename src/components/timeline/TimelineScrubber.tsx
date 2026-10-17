'use client';

import React from 'react';
import {
  Clock,
  Waves,
  AlertTriangle,
  Radio,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { useAppStore, PHASE_ORDER } from '@/store';
import { TimelinePhaseId } from '@/types';
import { StagingAlertBadge } from './StagingAlertBadge';

interface PhaseMeta {
  id: TimelinePhaseId;
  label: string;
  shortLabel: string;
  timeString: string;
  riverGauge: number;
  hazardLevel: 'Normal' | 'High' | 'Severe' | 'Catastrophic';
  summary: string;
}

const PHASES_CONFIG: PhaseMeta[] = [
  {
    id: 'T0',
    label: 'T-0 Early Warning',
    shortLabel: 'T-0',
    timeString: '04:30 PKT',
    riverGauge: 0.6,
    hazardLevel: 'Normal',
    summary: 'Monsoon surge inbound. All 4 cell towers online. Arterial roads open.',
  },
  {
    id: 'T3',
    label: 'T+3 Flood Surge',
    shortLabel: 'T+3',
    timeString: '07:30 PKT',
    riverGauge: 1.3,
    hazardLevel: 'High',
    summary: 'Sector 2 lowlands waist-deep. Culverts submerged. Gadap Link Road closed.',
  },
  {
    id: 'T6',
    label: 'T+6 Grid Blackout',
    shortLabel: 'T+6',
    timeString: '10:30 PKT',
    riverGauge: 1.9,
    hazardLevel: 'Severe',
    summary: 'Tower-Alpha-3 collapsed (08:55). Sector 3A silent >90m. Blind spot synthesized.',
  },
  {
    id: 'T12',
    label: 'T+12 Peak Crisis',
    shortLabel: 'T+12',
    timeString: '16:30 PKT',
    riverGauge: 2.4,
    hazardLevel: 'Catastrophic',
    summary: 'Sectors 2 & 3A inundated. Shelter 03 breaches 97% and loses power generator.',
  },
];

export function TimelineScrubber() {
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const simulationClock = useAppStore((state) => state.simulationClock);
  const setTimelinePhase = useAppStore((state) => state.setTimelinePhase);
  const scenario = useAppStore((state) => state.scenario);

  const currentPhaseIndex = PHASE_ORDER[timelinePhase] ?? 0;
  const currentPhaseConfig = PHASES_CONFIG[currentPhaseIndex] ?? PHASES_CONFIG[0];

  const handleStepPrev = () => {
    if (currentPhaseIndex > 0) {
      const prevPhase = PHASES_CONFIG[currentPhaseIndex - 1];
      setTimelinePhase(prevPhase.id);
    }
  };

  const handleStepNext = () => {
    if (currentPhaseIndex < PHASES_CONFIG.length - 1) {
      const nextPhase = PHASES_CONFIG[currentPhaseIndex + 1];
      setTimelinePhase(nextPhase.id);
    }
  };

  // Color mapping for hazard levels adhering to DESIGN.md
  const getHazardBadge = (level: PhaseMeta['hazardLevel']) => {
    switch (level) {
      case 'Normal':
        return {
          bg: 'bg-semantic-success/15 border-semantic-success/30 text-semantic-success-text',
          dot: 'bg-semantic-success',
          icon: CheckCircle2,
        };
      case 'High':
        return {
          bg: 'bg-semantic-warning/15 border-semantic-warning-border text-semantic-warning-text',
          dot: 'bg-semantic-warning',
          icon: AlertTriangle,
        };
      case 'Severe':
        return {
          bg: 'bg-semantic-blind-spot/15 border-semantic-blind-spot-border text-semantic-blind-spot-text',
          dot: 'bg-semantic-blind-spot',
          icon: Radio,
        };
      case 'Catastrophic':
        return {
          bg: 'bg-semantic-critical/15 border-semantic-critical-border text-semantic-critical-text',
          dot: 'bg-semantic-critical',
          icon: Flame,
        };
    }
  };

  const activeHazard = getHazardBadge(currentPhaseConfig.hazardLevel);
  const HazardIcon = activeHazard.icon;

  // Calculate track progress percentage: 0 -> 0%, 1 -> 33.3%, 2 -> 66.6%, 3 -> 100%
  const progressPercent = (currentPhaseIndex / (PHASES_CONFIG.length - 1)) * 100;

  return (
    <section
      data-testid="timeline-scrubber"
      aria-label="Disaster Timeline Controller"
      className="bg-surface-1 border border-hairline rounded-lg p-3.5 flex flex-col gap-3.5 shadow-md"
    >
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2.5 border-b border-hairline">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider bg-brand/15 text-brand border border-brand/30 flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Scenario Wall Clock</span>
          </span>
          <span className="text-sm font-mono font-bold text-ink" data-testid="timeline-clock-display">
            {currentPhaseConfig.timeString}
          </span>
          <span className="text-xs text-ink-subtle font-mono hidden md:inline">
            (18 Oct 2026 // {scenario.name})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* River Gauge Level */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-hairline text-xs font-mono">
            <Waves className="w-3.5 h-3.5 text-brand" />
            <span className="text-ink-subtle uppercase text-[10px]">River Gauge:</span>
            <span className="font-bold text-ink">{currentPhaseConfig.riverGauge.toFixed(1)}m</span>
          </div>

          {/* Hazard Level Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-bold ${activeHazard.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${activeHazard.dot} animate-pulse`} />
            <HazardIcon className="w-3.5 h-3.5" />
            <span>{currentPhaseConfig.hazardLevel}</span>
          </div>

          {/* Step Controls */}
          <div className="flex items-center gap-1 pl-1 border-l border-hairline">
            <button
              type="button"
              onClick={handleStepPrev}
              disabled={currentPhaseIndex === 0}
              aria-label="Step backward in timeline"
              title="Step backward (Previous phase)"
              className="p-1 rounded bg-surface-2 hover:bg-surface-3 disabled:opacity-40 disabled:cursor-not-allowed border border-hairline text-ink-muted hover:text-ink transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleStepNext}
              disabled={currentPhaseIndex === PHASES_CONFIG.length - 1}
              aria-label="Step forward in timeline"
              title="Step forward (Next phase)"
              className="p-1 rounded bg-surface-2 hover:bg-surface-3 disabled:opacity-40 disabled:cursor-not-allowed border border-hairline text-ink-muted hover:text-ink transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4-Phase Interactive Progress Scrubber Track */}
      <div className="relative pt-2 pb-1">
        {/* Connecting track line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-surface-3 rounded-full -translate-y-1/2 z-0">
          <div
            className="h-full bg-brand transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Phase Nodes */}
        <div className="relative z-10 grid grid-cols-4 gap-2 text-center" role="tablist">
          {PHASES_CONFIG.map((phase, idx) => {
            const isActive = timelinePhase === phase.id;
            const isPast = idx < currentPhaseIndex;
            const testId = `timeline-phase-${phase.id.toLowerCase()}`;

            return (
              <button
                key={phase.id}
                type="button"
                role="tab"
                id={`tab-${phase.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${phase.id}`}
                data-testid={testId}
                onClick={() => setTimelinePhase(phase.id)}
                className={`group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface-1 rounded-lg p-1.5 transition-all ${
                  isActive
                    ? 'scale-[1.02]'
                    : 'opacity-85 hover:opacity-100'
                }`}
              >
                {/* Node indicator glyph */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand border-white text-white shadow-lg ring-4 ring-brand/30'
                      : isPast
                      ? 'bg-surface-2 border-brand text-brand hover:bg-surface-3'
                      : 'bg-surface-2 border-hairline-strong text-ink-subtle hover:text-ink hover:border-ink-subtle'
                  }`}
                >
                  {isActive ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Node Text Metadata */}
                <div className="mt-2 flex flex-col items-center">
                  <span
                    className={`text-xs font-mono tracking-tight font-bold transition-colors ${
                      isActive ? 'text-brand' : 'text-ink-muted group-hover:text-ink'
                    }`}
                  >
                    {phase.shortLabel}
                  </span>
                  <span className="text-[11px] font-sans font-medium text-ink-subtle hidden sm:inline">
                    {phase.label.replace(/^T[+-]\d+\s+/, '')}
                  </span>
                  <span
                    className={`text-[10px] font-mono mt-0.5 ${
                      isActive ? 'text-brand-hover font-semibold' : 'text-ink-subtle'
                    }`}
                  >
                    {phase.timeString}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase Telemetry Banner */}
      <div className="bg-surface-2 border border-hairline rounded px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand shrink-0" />
          <span className="text-ink-muted">
            <strong className="text-ink font-semibold">{currentPhaseConfig.label}:</strong>{' '}
            {currentPhaseConfig.summary}
          </span>
        </div>

        {/* Phase transition callout badges */}
        {timelinePhase === 'T6' && (
          <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-mono bg-semantic-blind-spot/15 border border-semantic-blind-spot-border text-semantic-blind-spot-text font-semibold flex items-center gap-1 animate-pulse">
            <Radio className="w-3 h-3" />
            Tower-Alpha-3 Offline // Blind Spot Active
          </span>
        )}
        {timelinePhase === 'T12' && (
          <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-mono bg-semantic-critical/15 border border-semantic-critical-border text-semantic-critical-text font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            SHL-03 Generator Lost // 97% Breached
          </span>
        )}
      </div>

      {/* Proactive Pre-Disaster Staging Alert Badge (Milestone 10: Task T10.2 & Test 2.2) */}
      <StagingAlertBadge />
    </section>
  );
}
