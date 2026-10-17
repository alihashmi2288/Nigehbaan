'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { FactorBreakdownCard } from './FactorBreakdownCard';
import { ExplainabilityCard } from './ExplainabilityCard';
import { formatTimestamp, getCategoryBadgeStyles } from '../queue/IncidentCard';
import { ConflictModal } from '../uncertainty/ConflictModal';
import { AssignmentModal } from '../dispatch/AssignmentModal';
import { StagingAlertBadge } from '../timeline/StagingAlertBadge';
import {
  X,
  ShieldAlert,
  Flame,
  Radio,
  Clock,
  MapPin,
  Phone,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Send,
  RotateCcw,
  Languages,
  EyeOff,
  Crosshair,
  Building2,
  Truck,
} from 'lucide-react';

export const IncidentInspector: React.FC = () => {
  const selectedIncidentId = useAppStore((state) => state.selectedIncidentId);
  const setSelectedIncidentId = useAppStore((state) => state.setSelectedIncidentId);
  const incidents = useAppStore((state) => state.incidents);
  const resources = useAppStore((state) => state.resources);
  const shelters = useAppStore((state) => state.shelters);
  const assignResource = useAppStore((state) => state.assignResource);
  const unassignResource = useAppStore((state) => state.unassignResource);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const incident = incidents.find((i) => i.id === selectedIncidentId);

  // Available resources for dispatch
  const availableResources = resources.filter((r) => r.status === 'available');

  // Currently assigned resource (if any)
  const assignedResource = incident?.assignedResourceId
    ? resources.find((r) => r.id === incident.assignedResourceId)
    : null;

  // Matched shelter (if targetShelter specified)
  const matchedShelter = incident?.targetShelter
    ? shelters.find((s) => s.id === incident.targetShelter)
    : null;

  const handleUnassign = () => {
    if (!incident) return;
    unassignResource(incident.id);
  };

  if (!incident) {
    return (
      <aside className="bg-surface-1 border border-hairline rounded-lg p-6 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
        <div className="w-12 h-12 rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-ink-subtle mb-3">
          <Crosshair className="w-6 h-6 opacity-60 text-brand" />
        </div>
        <h3 className="text-sm font-mono font-bold text-ink uppercase tracking-tight">
          No Incident Selected
        </h3>
        <p className="text-xs text-ink-muted mt-1.5 max-w-[280px] leading-relaxed">
          Select an incident card from the Triage Queue or click an incident marker on the Tactical GIS Map to inspect its MCDA factor breakdown, auditable rationale, and dispatch controls.
        </p>
      </aside>
    );
  }

  const badgeStyles = getCategoryBadgeStyles(incident.category);
  const scoreVal =
    incident.score !== undefined
      ? incident.score.toFixed(1)
      : incident.expectedScore !== undefined
      ? incident.expectedScore.toFixed(1)
      : '—';

  const isAssigned = !!incident.assignedResourceId;

  return (
    <aside className="bg-surface-1 border border-hairline rounded-lg flex flex-col h-full max-h-[850px] overflow-hidden shadow-xl">
      {/* Inspector Header */}
      <div className="p-4 border-b border-hairline bg-surface-1 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg text-ink tracking-tight">
              {incident.code}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-surface-3 border border-hairline text-ink-muted">
              {incident.sectorId.replace('-', ' ').toUpperCase()}
            </span>
            <span className="text-xs font-mono text-ink-subtle">
              Phase: {incident.phaseArrival}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Priority Score Badge */}
            <div
              className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-tight flex items-center gap-1.5"
              style={{
                backgroundColor: badgeStyles.bg,
                color: badgeStyles.text,
                border: `1px solid ${badgeStyles.border}`,
              }}
            >
              {incident.category === 'Critical' && (
                <span className="w-1.5 h-1.5 rounded-full bg-semantic-critical-border animate-ping" />
              )}
              <span>{incident.category}</span>
              <span>{scoreVal} / 100</span>
            </div>

            {/* Close Inspector Button */}
            <button
              type="button"
              onClick={() => setSelectedIncidentId(null)}
              className="p-1.5 rounded hover:bg-surface-2 text-ink-subtle hover:text-ink transition-colors border border-transparent hover:border-hairline"
              title="Close Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timestamp and Geo Location Strip */}
        <div className="flex items-center justify-between text-xs font-mono text-ink-subtle pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Reported: {formatTimestamp(incident.timestamp)}
          </span>

          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand" />
            {incident.coordinates ? (
              <span>
                Coordinates: {incident.coordinates[0].toFixed(4)}, {incident.coordinates[1].toFixed(4)}
              </span>
            ) : (
              <span className="text-semantic-warning-text font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unmapped Location
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-surface-3">
        {/* Coordinator Dispatch Bar (Invariant 5: No Autonomous Dispatch) */}
        <div className="bg-surface-2 border border-hairline rounded-lg p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-ink-subtle font-semibold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-brand" />
              Coordinator Dispatch Control
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                isAssigned
                  ? 'bg-semantic-success/15 border border-semantic-success-border text-semantic-success-text'
                  : 'bg-surface-3 border border-hairline text-ink-muted'
              }`}
            >
              {isAssigned ? 'DISPATCH APPROVED' : 'PENDING ASSIGNMENT'}
            </span>
          </div>

          {isAssigned && assignedResource ? (
            <div className="flex items-center justify-between p-2.5 rounded bg-surface-1 border border-hairline">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-ink">
                  {assignedResource.callsign} ({assignedResource.type.replace('_', ' ')})
                </span>
                <span className="text-[11px] font-mono text-ink-subtle block">
                  Capacity: {assignedResource.seatCapacity} persons • Station: {assignedResource.stationSector}
                </span>
              </div>

              <button
                type="button"
                onClick={handleUnassign}
                className="px-2.5 py-1 rounded text-xs font-mono text-semantic-critical-text bg-semantic-critical/15 hover:bg-semantic-critical/25 border border-semantic-critical-border transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Unassign
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded bg-surface-1 border border-hairline">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold text-ink">
                    Resource Allocation Gate
                  </span>
                  <span className="text-[11px] font-mono text-ink-subtle block">
                    {availableResources.length} rescue asset(s) active in system
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="assign-resource-button"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-3.5 py-1.5 rounded text-xs font-mono font-bold text-white bg-brand hover:bg-brand-hover transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Assign Resource
                </button>
              </div>

              {availableResources.length === 0 && (
                <p className="text-[11px] font-mono text-semantic-warning-text flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  All rescue resources currently deployed. Turnaround queue applies.
                </p>
              )}
            </div>
          )}

          {/* Matched Shelter Staging Facility */}
          {matchedShelter && (
            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-hairline text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand" />
                Staging Shelter: {matchedShelter.name}
              </span>
              <span className="text-[11px] text-ink-subtle">
                Capacity: {matchedShelter.capacityCurrent}/{matchedShelter.capacityTotal} (
                {Math.round((matchedShelter.capacityCurrent / matchedShelter.capacityTotal) * 100)}%)
              </span>
            </div>
          )}
        </div>

        {/* Proactive Pre-Disaster Staging Alert (Milestone 10: Task T10.2 & Test 2.2) */}
        <StagingAlertBadge sectorId={incident.sectorId} />

        {/* Distress Report & Citizen Ground Truth */}
        <div className="bg-surface-1 border border-hairline rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <span className="text-xs font-mono font-bold tracking-tight text-ink uppercase">
              Citizen Distress Telemetry
            </span>

            {/* Reporter & Phone Access Badges */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-surface-3 border border-hairline text-ink-muted">
                {incident.reporterType.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-3 border border-hairline text-ink-muted">
                {incident.phoneAccess.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Honest AI / Heuristic Extraction Provenance Badge (Invariant 7 & Test 1.8) */}
          {incident.provenanceBadge && (
            <div
              className={`px-2.5 py-1.5 rounded text-[11px] font-mono flex items-center gap-2 border ${
                incident.isAI
                  ? 'bg-brand/15 text-brand border-brand/30 font-semibold'
                  : 'bg-surface-3 text-semantic-unknown-text border-hairline'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  incident.isAI ? 'bg-brand' : 'bg-semantic-unknown'
                }`}
              />
              <span>{incident.provenanceBadge}</span>
            </div>
          )}

          {/* Primary Text */}
          <div className="p-3 rounded bg-surface-2 border border-hairline">
            <p className="text-xs text-ink leading-relaxed font-sans">
              {incident.reportText}
            </p>
          </div>

          {/* Bilingual Urdu / Translation View if available */}
          {incident.reportTranslation && (
            <div className="p-3 rounded bg-surface-2 border border-hairline space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-ink-subtle flex items-center gap-1">
                <Languages className="w-3 h-3 text-brand" />
                English Verified Translation
              </span>
              <p className="text-xs text-ink-muted leading-relaxed font-sans">
                {incident.reportTranslation}
              </p>
            </div>
          )}
        </div>

        {/* Uncertainty Radar Flags */}
        {incident.uncertaintyFlags.length > 0 && (
          <div className="bg-semantic-warning/10 border border-semantic-warning-border/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-semantic-warning-text uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Active Uncertainty Radar Flags
              </span>
              {incident.uncertaintyFlags.includes('CONFLICTING_REPORT') && (
                <button
                  type="button"
                  onClick={() => setIsConflictModalOpen(true)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-semantic-warning text-white hover:bg-semantic-warning-border transition-colors flex items-center gap-1"
                >
                  <span>Compare Reports</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {incident.uncertaintyFlags.map((flag) => (
                <span
                  key={flag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-surface-1 border border-semantic-warning-border text-semantic-warning-text"
                >
                  {flag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Conflict Modal for Conflicting Reports */}
        <ConflictModal
          isOpen={isConflictModalOpen}
          onClose={() => setIsConflictModalOpen(false)}
          incidentA={incident.code === 'NG-109' ? incidents.find((i) => i.code === 'NG-108') : incident}
          incidentB={incident.code === 'NG-108' ? incidents.find((i) => i.code === 'NG-109') : incident}
        />

        {/* Human Coordinator Resource Assignment Modal (Task T7.2, T7.3) */}
        <AssignmentModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          incident={incident}
        />

        {/* MCDA Factor Breakdown Card (Task T4.2) */}
        <FactorBreakdownCard incident={incident} />

        {/* Explainability Rationale Card (Task T4.3) */}
        <ExplainabilityCard incident={incident} />
      </div>
    </aside>
  );
};
