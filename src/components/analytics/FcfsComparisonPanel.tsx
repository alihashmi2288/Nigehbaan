'use client';

import React, { useState } from 'react';
import {
  X,
  TrendingDown,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Radio,
  BarChart3,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Flame,
  Layers,
} from 'lucide-react';
import {
  getFcfsRetrospectiveSummary,
  IncidentComparisonRow,
} from '@/lib/analytics/fcfsComparison';
import { useAppStore } from '@/store';

interface FcfsComparisonPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterMode = 'all' | 'divergence' | 'critical';

export function FcfsComparisonPanel({ isOpen, onClose }: FcfsComparisonPanelProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>('divergence');
  const summary = getFcfsRetrospectiveSummary();
  const timelinePhase = useAppStore((state) => state.timelinePhase);

  if (!isOpen) return null;

  const filteredRows = summary.rows.filter((row) => {
    if (filterMode === 'divergence') {
      return ['NG-107', 'NG-101', 'NG-103', 'NG-102'].includes(row.code);
    }
    if (filterMode === 'critical') {
      return row.category === 'Critical' || row.category === 'High';
    }
    return true;
  });

  return (
    <div
      data-testid="fcfs-comparison-panel"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-canvas/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fcfs-panel-title"
    >
      <div className="bg-surface-1 border border-hairline-strong rounded-xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-surface-2/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="fcfs-panel-title"
                  className="text-sm font-bold text-ink tracking-tight font-mono uppercase"
                >
                  FCFS vs. Nigehbaan Triage Retrospective
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand/20 text-brand border border-brand/30">
                  T+12 PEAK CRISIS
                </span>
                {timelinePhase === 'T12' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-semantic-success/20 text-semantic-success-text border border-semantic-success-border/40 animate-pulse">
                    CURRENT TIMELINE PHASE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink-muted">
                Mathematical proof of life-saving triage efficiency vs. naive ingestion order
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="close-fcfs-panel-button"
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-3 transition-colors"
            aria-label="Close retrospective"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
          {/* Executive Comparative Metric Delta Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Latency Reduction */}
            <div className="p-3.5 rounded-lg bg-surface-2 border border-hairline flex flex-col justify-between gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-ink-subtle">Critical Latency</span>
                <Clock className="w-4 h-4 text-brand" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-semantic-success-text">
                    {summary.avgWaitCriticalNigehbaanMinutes}m
                  </span>
                  <span className="text-xs font-mono text-ink-subtle line-through">
                    {summary.avgWaitCriticalFcfsMinutes}m
                  </span>
                </div>
                <div className="text-[11px] font-mono text-semantic-success-text font-bold">
                  -{summary.latencyReductionPercent}% response delay
                </div>
              </div>
            </div>

            {/* Blackout Detection */}
            <div className="p-3.5 rounded-lg bg-surface-2 border border-hairline flex flex-col justify-between gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-ink-subtle">Dead Zone Coverage</span>
                <Radio className="w-4 h-4 text-semantic-blind-spot-text" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-semantic-blind-spot-text">100%</span>
                  <span className="text-xs font-mono text-ink-subtle line-through">0% FCFS</span>
                </div>
                <div className="text-[11px] font-mono text-semantic-blind-spot-text font-bold">
                  Sector 3A swept (12.4k pop)
                </div>
              </div>
            </div>

            {/* Fleet Utilization Efficiency */}
            <div className="p-3.5 rounded-lg bg-surface-2 border border-hairline flex flex-col justify-between gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-ink-subtle">Misallocated Fleet</span>
                <ShieldCheck className="w-4 h-4 text-semantic-success-text" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-semantic-success-text">0%</span>
                  <span className="text-xs font-mono text-semantic-critical-text line-through">40% FCFS</span>
                </div>
                <div className="text-[11px] font-mono text-semantic-success-text font-bold">
                  Zero boats to property calls
                </div>
              </div>
            </div>

            {/* Preventable Disasters */}
            <div className="p-3.5 rounded-lg bg-surface-2 border border-hairline flex flex-col justify-between gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-ink-subtle">Preventable Deaths</span>
                <AlertTriangle className="w-4 h-4 text-semantic-critical-text" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-semantic-success-text">0</span>
                  <span className="text-xs font-mono text-semantic-critical-text line-through">4 In FCFS</span>
                </div>
                <div className="text-[11px] font-mono text-semantic-success-text font-bold">
                  100% high-risk mitigation
                </div>
              </div>
            </div>
          </section>

          {/* Paradigm Contrast Split View */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Naive FCFS Box */}
            <div className="p-4 rounded-lg bg-semantic-critical/10 border border-semantic-critical-border/40 space-y-2.5">
              <div className="flex items-center gap-2 text-semantic-critical-text font-mono font-bold text-xs uppercase">
                <XCircle className="w-4 h-4" />
                <span>The Fatal Flaw of Naive Ingestion Order (FCFS)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-ink-muted list-disc list-inside">
                <li>
                  <strong className="text-ink">Loudest / Earliest Callers Win:</strong> Basement pump request (NG-107, Score 5.0) at 04:20 locks up Shallow Jet-Boat 01.
                </li>
                <li>
                  <strong className="text-ink">Dialysis Patient Deprioritized:</strong> Critical patient Syed Iqbal (NG-101, Score 86.5) calls at 06:45 but waits 155 minutes in queue.
                </li>
                <li>
                  <strong className="text-ink">Silent Sectors Abandoned:</strong> Sector 3A cell tower collapses; zero calls arrive, so FCFS assigns zero resources to 12,400 people.
                </li>
              </ul>
            </div>

            {/* Nigehbaan Triage Box */}
            <div className="p-4 rounded-lg bg-semantic-success/10 border border-semantic-success-border/40 space-y-2.5">
              <div className="flex items-center gap-2 text-semantic-success-text font-mono font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Nigehbaan Deterministic Need-Weighted Triage</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-ink-muted list-disc list-inside">
                <li>
                  <strong className="text-ink">Immediate Critical Rescue:</strong> NG-101 dispatched within 5 minutes directly to Civil Hospital Annexe (SHL-02 with dialysis).
                </li>
                <li>
                  <strong className="text-ink">Opportunity Cost Awareness:</strong> +35m delay warning prevents assigning the last shallow boat to non-critical calls.
                </li>
                <li>
                  <strong className="text-ink">Synthetic Dead-Zone Sweep:</strong> Synthesizes NG-103 (Score 68.7) at T+6; sends Physical Recon Patrol 01 to sweep 22 isolated elderly.
                </li>
              </ul>
            </div>
          </section>

          {/* Table Filter Controls */}
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand" />
              <span className="font-mono font-bold text-xs uppercase text-ink">
                Incident Chronology &amp; Assignment Latency
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-lg border border-hairline text-xs font-mono">
              <button
                type="button"
                onClick={() => setFilterMode('divergence')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterMode === 'divergence'
                    ? 'bg-brand text-white font-bold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Key Divergence Cases (4)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('critical')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterMode === 'critical'
                    ? 'bg-brand text-white font-bold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Critical &amp; High Only
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterMode === 'all'
                    ? 'bg-brand text-white font-bold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                All Visible ({summary.rows.length})
              </button>
            </div>
          </div>

          {/* Interactive Incident Comparison Table */}
          <div className="border border-hairline rounded-lg overflow-hidden bg-surface-2/40">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-3 border-b border-hairline text-[11px] font-mono text-ink-subtle uppercase">
                  <th className="py-2.5 px-3">Incident</th>
                  <th className="py-2.5 px-3">MCDA Score</th>
                  <th className="py-2.5 px-3">Reported</th>
                  <th className="py-2.5 px-3">FCFS Wait</th>
                  <th className="py-2.5 px-3">Nigehbaan Wait</th>
                  <th className="py-2.5 px-3">Time Saved</th>
                  <th className="py-2.5 px-3">Operational Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-mono text-[11px]">
                {filteredRows.map((row) => {
                  const isCriticalCase = row.category === 'Critical';
                  const isBlindSpot = row.code === 'NG-103';
                  const isPropertyError = row.code === 'NG-107';

                  return (
                    <tr
                      key={row.code}
                      className={`hover:bg-surface-3/50 transition-colors ${
                        isBlindSpot
                          ? 'bg-semantic-blind-spot/10'
                          : isCriticalCase
                          ? 'bg-semantic-critical/5'
                          : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-ink block">{row.code}</span>
                        <span className="text-[10px] text-ink-subtle truncate max-w-[200px] block">
                          {row.description}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            row.category === 'Critical'
                              ? 'bg-semantic-critical/20 text-semantic-critical-text border border-semantic-critical-border/40'
                              : row.category === 'High'
                              ? 'bg-semantic-warning/20 text-semantic-warning-text border border-semantic-warning-border/40'
                              : 'bg-surface-3 text-ink-muted'
                          }`}
                        >
                          {row.score.toFixed(1)} {row.category}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-ink-muted">{row.reportedAt}</td>

                      <td className="py-2.5 px-3">
                        {row.fcfsWaitMinutes === null ? (
                          <span className="text-semantic-critical-text font-bold">NEVER (0%)</span>
                        ) : (
                          <span
                            className={
                              row.fcfsWaitMinutes > 60
                                ? 'text-semantic-critical-text font-bold'
                                : 'text-ink-muted'
                            }
                          >
                            +{row.fcfsWaitMinutes} min
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="text-semantic-success-text font-bold">
                          +{row.nigehbaanWaitMinutes} min
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        {typeof row.minutesSaved === 'number' ? (
                          row.minutesSaved > 0 ? (
                            <span className="text-semantic-success-text font-bold">
                              -{row.minutesSaved} min
                            </span>
                          ) : (
                            <span className="text-ink-subtle">Deferred</span>
                          )
                        ) : (
                          <span className="text-semantic-blind-spot-text font-bold">
                            +100% Coverage
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-[10px] text-ink max-w-[280px]">
                        <span className="block text-ink font-sans">{row.nigehbaanOutcome}</span>
                        <span className="block text-ink-subtle text-[9px] mt-0.5 font-sans">
                          {row.riskReduced}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="px-6 py-3.5 border-t border-hairline bg-surface-2/70 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="text-ink-subtle text-[11px] flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-brand" />
            <span>Deterministic Triage Proof // District Alpha Crisis Scenario</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-surface-3 hover:bg-surface-4 text-ink font-semibold border border-hairline transition-colors"
          >
            Close Retrospective
          </button>
        </div>
      </div>
    </div>
  );
}
