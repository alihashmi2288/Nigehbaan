'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore, selectVisibleIncidents } from '@/store';
import { evaluateUncertaintyRadar, ConflictPair, DuplicatePair } from '@/lib/uncertainty';
import { ConflictModal } from './ConflictModal';
import {
  Radar,
  AlertTriangle,
  MapPinOff,
  ClockAlert,
  ArrowRightLeft,
  Copy,
  Radio,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  Eye,
} from 'lucide-react';
import { Incident } from '@/types';

export const UncertaintyRadarPanel: React.FC = () => {
  const incidents = useAppStore((state) => state.incidents);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const setSelectedIncidentId = useAppStore((state) => state.setSelectedIncidentId);
  const scenario = useAppStore((state) => state.scenario);

  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [activeConflictPair, setActiveConflictPair] = useState<ConflictPair | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Get active wall clock time string for current timeline phase
  const currentWallClock = useMemo(() => {
    const phase = scenario.timelinePhases.find((p) => p.id === timelinePhase);
    return phase?.wallClock ?? new Date().toISOString();
  }, [scenario, timelinePhase]);

  // Visible incidents at current timeline phase
  const visibleIncidents = useMemo(
    () => selectVisibleIncidents(incidents, timelinePhase),
    [incidents, timelinePhase]
  );

  // Evaluate uncertainty flags across visible incidents
  const radarResult = useMemo(
    () => evaluateUncertaintyRadar(visibleIncidents, currentWallClock),
    [visibleIncidents, currentWallClock]
  );

  const handleOpenConflictModal = (pair?: ConflictPair) => {
    if (pair) {
      setActiveConflictPair(pair);
    } else if (radarResult.conflictPairs.length > 0) {
      setActiveConflictPair(radarResult.conflictPairs[0]);
    }
    setIsConflictModalOpen(true);
  };

  const handleSelectIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
  };

  const hasAnyFlags = radarResult.totalFlaggedCount > 0;

  return (
    <>
      <section className="bg-surface-1 border border-hairline rounded-lg overflow-hidden shadow-lg transition-all">
        {/* Panel Header */}
        <div className="px-4 py-3 bg-surface-2 border-b border-hairline flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded border border-semantic-warning-border/50 bg-semantic-warning/15 flex items-center justify-center text-semantic-warning-text">
              <Radar className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs tracking-wider text-ink uppercase">
                  Uncertainty Radar // Anomaly Detection
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-surface-3 border border-hairline text-ink-muted">
                  Invariant 2 &amp; 3
                </span>
              </div>
              <p className="text-[11px] text-ink-subtle">
                Real-time algorithmic flags: unmapped incidents, age degradation, landmark conflicts, and blind spots.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Total Flag Count Badge */}
            <span
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase flex items-center gap-1.5 border ${
                hasAnyFlags
                  ? 'bg-semantic-warning/15 border-semantic-warning-border text-semantic-warning-text'
                  : 'bg-semantic-success/15 border-semantic-success-border text-semantic-success-text'
              }`}
            >
              {hasAnyFlags ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{radarResult.totalFlaggedCount} Flagged Incidents</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-ping" />
                  <span>0 Radar Flags (Nominal)</span>
                </>
              )}
            </span>

            {/* Collapse / Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse Radar Panel' : 'Expand Radar Panel'}
              className="p-1 rounded bg-surface-3 border border-hairline text-ink-subtle hover:text-ink transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Panel Content (Collapsible) */}
        {isExpanded && (
          <div className="p-3.5 space-y-3">
            {/* Quick Status Flag Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs font-mono">
              {/* 1. Missing Location */}
              <button
                type="button"
                onClick={() => {
                  if (radarResult.missingLocationIncidents.length > 0) {
                    handleSelectIncident(radarResult.missingLocationIncidents[0].id);
                  }
                }}
                disabled={radarResult.missingLocationIncidents.length === 0}
                className={`p-2 rounded border text-left flex flex-col justify-between transition-all ${
                  radarResult.summary.missingLocationCount > 0
                    ? 'bg-surface-2 border-semantic-unknown-text/40 hover:border-brand text-ink cursor-pointer'
                    : 'bg-surface-2/40 border-hairline text-ink-tertiary cursor-default opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-ink-subtle uppercase">Missing Loc</span>
                  <MapPinOff className="w-3.5 h-3.5 text-semantic-unknown-text" />
                </div>
                <div className="font-bold text-sm text-semantic-unknown-text">
                  {radarResult.summary.missingLocationCount}
                  {radarResult.missingLocationIncidents.length > 0 && (
                    <span className="text-[10px] ml-1.5 text-ink-subtle font-normal">
                      ({radarResult.missingLocationIncidents.map((i) => i.code).join(', ')})
                    </span>
                  )}
                </div>
              </button>

              {/* 2. Stale Reports (>60m) */}
              <button
                type="button"
                onClick={() => {
                  if (radarResult.staleIncidents.length > 0) {
                    handleSelectIncident(radarResult.staleIncidents[0].id);
                  }
                }}
                disabled={radarResult.staleIncidents.length === 0}
                className={`p-2 rounded border text-left flex flex-col justify-between transition-all ${
                  radarResult.summary.staleCount > 0
                    ? 'bg-surface-2 border-semantic-warning-border hover:border-brand text-ink cursor-pointer'
                    : 'bg-surface-2/40 border-hairline text-ink-tertiary cursor-default opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-ink-subtle uppercase">Stale &gt;60m</span>
                  <ClockAlert className="w-3.5 h-3.5 text-semantic-warning-text" />
                </div>
                <div className="font-bold text-sm text-semantic-warning-text">
                  {radarResult.summary.staleCount}
                  {radarResult.staleIncidents.length > 0 && (
                    <span className="text-[10px] ml-1.5 text-ink-subtle font-normal">
                      ({radarResult.staleIncidents.map((i) => i.code).join(', ')})
                    </span>
                  )}
                </div>
              </button>

              {/* 3. Conflicting Reports */}
              <button
                type="button"
                onClick={() => handleOpenConflictModal()}
                disabled={radarResult.conflictPairs.length === 0}
                className={`p-2 rounded border text-left flex flex-col justify-between transition-all ${
                  radarResult.summary.conflictPairCount > 0
                    ? 'bg-semantic-warning/15 border-semantic-warning-border hover:border-semantic-warning-text text-semantic-warning-text cursor-pointer ring-1 ring-semantic-warning-border/50'
                    : 'bg-surface-2/40 border-hairline text-ink-tertiary cursor-default opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold">Landmark Conflict</span>
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </div>
                <div className="font-bold text-sm">
                  {radarResult.summary.conflictPairCount} Pair
                  <span className="text-[10px] ml-1.5 opacity-80 font-normal">
                    (NG-108/109)
                  </span>
                </div>
              </button>

              {/* 4. Potential Duplicates */}
              <button
                type="button"
                onClick={() => {
                  if (radarResult.duplicatePairs.length > 0) {
                    handleSelectIncident(radarResult.duplicatePairs[0].incidentB.id);
                  }
                }}
                disabled={radarResult.duplicatePairs.length === 0}
                className={`p-2 rounded border text-left flex flex-col justify-between transition-all ${
                  radarResult.summary.duplicatePairCount > 0
                    ? 'bg-surface-2 border-brand/50 hover:border-brand text-ink cursor-pointer'
                    : 'bg-surface-2/40 border-hairline text-ink-tertiary cursor-default opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-ink-subtle uppercase">Potential Dupes</span>
                  <Copy className="w-3.5 h-3.5 text-brand" />
                </div>
                <div className="font-bold text-sm text-brand">
                  {radarResult.summary.duplicatePairCount} Pair
                  {radarResult.duplicatePairs.length > 0 && (
                    <span className="text-[10px] ml-1.5 text-ink-subtle font-normal">
                      (NG-104/110)
                    </span>
                  )}
                </div>
              </button>

              {/* 5. Silent Sector Blind Spot */}
              <button
                type="button"
                onClick={() => {
                  if (radarResult.blindSpotIncidents.length > 0) {
                    handleSelectIncident(radarResult.blindSpotIncidents[0].id);
                  }
                }}
                disabled={radarResult.blindSpotIncidents.length === 0}
                className={`p-2 rounded border text-left flex flex-col justify-between transition-all ${
                  radarResult.summary.blindSpotCount > 0
                    ? 'bg-semantic-blind-spot/15 border-semantic-blind-spot-border hover:border-semantic-blind-spot-text text-semantic-blind-spot-text cursor-pointer ring-1 ring-semantic-blind-spot-border/50'
                    : 'bg-surface-2/40 border-hairline text-ink-tertiary cursor-default opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold">Blind Spot</span>
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="font-bold text-sm">
                  {radarResult.summary.blindSpotCount} Active
                  {radarResult.blindSpotIncidents.length > 0 && (
                    <span className="text-[10px] ml-1.5 opacity-80 font-normal">
                      (Sector 3A)
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Active Landmark Conflict Highlight Banner (if conflict exists) */}
            {radarResult.conflictPairs.length > 0 && (
              <div className="p-3 rounded-lg bg-surface-2 border border-semantic-warning-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ArrowRightLeft className="w-4 h-4 text-semantic-warning-text shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-ink font-mono">
                      Active Landmark Conflict Detected: Main Highway Bridge
                    </span>
                    <p className="text-ink-muted text-[11px]">
                      NG-108 reports bridge is open vs NG-109 reports bridge washed out. Human review required.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenConflictModal(radarResult.conflictPairs[0])}
                  className="px-3 py-1.5 rounded text-xs font-mono font-bold bg-semantic-warning text-white hover:bg-semantic-warning-border flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Compare Reports Side-by-Side</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Side-by-Side Conflict Comparison Modal */}
      <ConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        incidentA={activeConflictPair?.incidentA}
        incidentB={activeConflictPair?.incidentB}
        landmarkName={activeConflictPair?.landmark ?? 'Main Highway Bridge'}
      />
    </>
  );
};
