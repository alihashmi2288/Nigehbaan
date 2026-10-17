'use client';

import React, { useEffect, useRef } from 'react';
import { Incident } from '@/types';
import {
  AlertTriangle,
  X,
  MapPin,
  Clock,
  Phone,
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Radio,
} from 'lucide-react';
import { formatTimestamp, getCategoryBadgeStyles } from '../queue/IncidentCard';
import { useAppStore } from '@/store';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentA?: Incident | null;
  incidentB?: Incident | null;
  landmarkName?: string;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  onClose,
  incidentA,
  incidentB,
  landmarkName = 'Main Highway Bridge',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const setSelectedIncidentId = useAppStore((state) => state.setSelectedIncidentId);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Fallback to default conflict pair NG-108 and NG-109 if not explicitly passed
  const incA =
    incidentA ??
    useAppStore.getState().incidents.find((i) => i.code === 'NG-108') ??
    null;
  const incB =
    incidentB ??
    useAppStore.getState().incidents.find((i) => i.code === 'NG-109') ??
    null;

  const handleInspect = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    onClose();
  };

  const badgeA = incA ? getCategoryBadgeStyles(incA.category) : null;
  const badgeB = incB ? getCategoryBadgeStyles(incB.category) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-surface-1 border border-semantic-warning-border/80 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden focus:outline-none"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-hairline bg-surface-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-semantic-warning/20 border border-semantic-warning-border flex items-center justify-center text-semantic-warning-text">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-semantic-warning-text">
                  Uncertainty Radar // Conflict Resolution Gate
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-3 border border-hairline text-ink-muted">
                  Test 1.7
                </span>
              </div>
              <h2
                id="conflict-modal-title"
                className="text-base font-bold text-ink font-mono tracking-tight"
              >
                Disputed Landmark: {landmarkName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded border border-hairline hover:border-hairline-strong bg-surface-3 text-ink-muted hover:text-ink flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Mandatory Non-Negotiable Human Gate Warning Banner (Invariant 5) */}
          <div className="p-4 rounded-lg bg-semantic-warning/15 border border-semantic-warning-border text-xs space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-semantic-warning-text text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Human Coordinator Judgment Required (Invariant 5)</span>
            </div>
            <p className="text-ink-muted leading-relaxed">
              Conflicting field reports are preserved side-by-side. The automated system{' '}
              <strong className="text-ink font-semibold">
                NEVER auto-merges, suppresses, or deletes
              </strong>{' '}
              conflicting reports. Do not deploy heavy rescue assets or route ambulances across
              disputed landmarks without physical reconnaissance verification.
            </p>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Card: Incident A (e.g. NG-108) */}
            <div className="p-4 rounded-lg bg-surface-2 border border-hairline flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-ink">
                      {incA?.code ?? 'NG-108'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3 border border-hairline text-ink-muted">
                      {incA?.sectorId ?? 'sector-4'}
                    </span>
                  </div>
                  {badgeA && incA && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase"
                      style={{
                        backgroundColor: badgeA.bg,
                        color: badgeA.text,
                        border: `1px solid ${badgeA.border}`,
                      }}
                    >
                      {incA.category} {incA.score?.toFixed(1) ?? '11.0'}
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1.5 text-ink-muted font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-ink-subtle" />
                    <span>Reported: {incA ? formatTimestamp(incA.timestamp) : '10:14 PKT'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-ink-subtle" />
                    <span>Citizen Hotline (has phone)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ink-subtle" />
                    <span>
                      {incA?.coordinates
                        ? `${incA.coordinates[0]}, ${incA.coordinates[1]}`
                        : '24.9700, 67.1800'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded bg-surface-1 border border-semantic-success-border/40 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-semantic-success-text font-bold block">
                    Claim: Road Passable / Open
                  </span>
                  <p className="text-xs text-ink leading-relaxed">
                    &quot;{incA?.reportText ?? 'Main Highway Bridge is completely open and safe to cross.'}&quot;
                  </p>
                </div>
              </div>

              {incA && (
                <button
                  type="button"
                  onClick={() => handleInspect(incA.id)}
                  className="w-full py-2 px-3 rounded text-xs font-mono font-semibold bg-surface-3 hover:bg-surface-4 border border-hairline text-ink flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-brand" />
                  <span>Inspect {incA.code} in Command Panel</span>
                </button>
              )}
            </div>

            {/* Right Card: Incident B (e.g. NG-109) */}
            <div className="p-4 rounded-lg bg-surface-2 border border-hairline flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-ink">
                      {incB?.code ?? 'NG-109'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3 border border-hairline text-ink-muted">
                      {incB?.sectorId ?? 'sector-4'}
                    </span>
                  </div>
                  {badgeB && incB && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase"
                      style={{
                        backgroundColor: badgeB.bg,
                        color: badgeB.text,
                        border: `1px solid ${badgeB.border}`,
                      }}
                    >
                      {incB.category} {incB.score?.toFixed(1) ?? '50.0'}
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1.5 text-ink-muted font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-ink-subtle" />
                    <span>Reported: {incB ? formatTimestamp(incB.timestamp) : '10:22 PKT'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-ink-subtle" />
                    <span>Citizen Hotline (has phone)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ink-subtle" />
                    <span>
                      {incB?.coordinates
                        ? `${incB.coordinates[0]}, ${incB.coordinates[1]}`
                        : '24.9705, 67.1810'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded bg-surface-1 border border-semantic-critical-border/40 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-semantic-critical-text font-bold block">
                    Claim: Road Washed Out / Hazard
                  </span>
                  <p className="text-xs text-ink leading-relaxed">
                    &quot;{incB?.reportText ?? 'Warning: Main Highway Bridge washed out, 3 cars stalled in flood water!'}&quot;
                  </p>
                </div>
              </div>

              {incB && (
                <button
                  type="button"
                  onClick={() => handleInspect(incB.id)}
                  className="w-full py-2 px-3 rounded text-xs font-mono font-semibold bg-surface-3 hover:bg-surface-4 border border-hairline text-ink flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-brand" />
                  <span>Inspect {incB.code} in Command Panel</span>
                </button>
              )}
            </div>
          </div>

          {/* Operational Recommended Action */}
          <div className="p-3.5 rounded-lg bg-surface-2 border border-hairline flex items-start gap-3">
            <Radio className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-mono font-bold text-ink uppercase">
                Recommended Operational Action
              </span>
              <p className="text-ink-muted leading-relaxed">
                Dispatch <strong className="text-ink">Physical Recon Patrol 01 (RES-06)</strong> to
                Highway Bridge coordinates (<span className="font-mono text-ink">24.970, 67.180</span>
                ) to confirm structural integrity before updating route status.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-hairline bg-surface-2 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-ink-subtle">
            Both records preserved indefinitely in state store
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-mono font-bold bg-brand hover:bg-brand-hover text-white transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
