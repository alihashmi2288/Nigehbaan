'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Send,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Truck,
  Shield,
  Layers,
  Info,
} from 'lucide-react';
import { Incident, Resource } from '@/types';
import { useAppStore, selectVisibleIncidents } from '@/store';
import { calculateOpportunityCost, formatSectorDisplay } from '@/lib/resources';
import { OpportunityCostWarningCard } from './OpportunityCostWarningCard';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const resources = useAppStore((state) => state.resources);
  const incidents = useAppStore((state) => state.incidents);
  const shelters = useAppStore((state) => state.shelters);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const assignResource = useAppStore((state) => state.assignResource);

  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [showAllSectors, setShowAllSectors] = useState<boolean>(false);

  // Reset selected resource whenever modal opens with a new incident
  useEffect(() => {
    if (isOpen && incident) {
      // Pre-select matching candidate if available in same sector
      const availableInSector = resources.filter(
        (r) =>
          r.status === 'available' &&
          r.stationSector.toLowerCase() === incident.sectorId.toLowerCase() &&
          (incident.targetResource ? r.type === incident.targetResource : true)
      );
      if (availableInSector.length > 0) {
        setSelectedResourceId(availableInSector[0].id);
      } else {
        setSelectedResourceId('');
      }
      setShowAllSectors(false);
    } else {
      setSelectedResourceId('');
    }
  }, [isOpen, incident, resources]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // All available resources
  const availableResources = useMemo(
    () => resources.filter((r) => r.status === 'available'),
    [resources]
  );

  // Candidate resources: filtered by sector unless toggled to show all
  const candidateResources = useMemo(() => {
    if (!incident) return [];
    if (showAllSectors) return availableResources;
    const inSector = availableResources.filter(
      (r) => r.stationSector.toLowerCase() === incident.sectorId.toLowerCase()
    );
    return inSector.length > 0 ? inSector : availableResources;
  }, [incident, availableResources, showAllSectors]);

  const selectedResource = useMemo(
    () => resources.find((r) => r.id === selectedResourceId) ?? null,
    [resources, selectedResourceId]
  );

  // Opportunity cost calculation for selected candidate
  const costResult = useMemo(() => {
    if (!incident || !selectedResource) return null;
    return calculateOpportunityCost(
      selectedResource,
      incident,
      availableResources,
      incidents
    );
  }, [incident, selectedResource, availableResources, incidents]);

  // Matched shelter lookup
  const matchedShelter = useMemo(() => {
    if (!incident?.targetShelter) return null;
    return shelters.find((s) => s.id === incident.targetShelter) ?? null;
  }, [incident, shelters]);

  if (!isOpen || !incident) return null;

  const handleApprove = () => {
    if (!selectedResourceId) return;
    const success = assignResource(incident.id, selectedResourceId);
    if (success) {
      onClose();
    }
  };

  const sectorLabel = formatSectorDisplay(incident.sectorId);
  const scoreDisplay = (incident.score ?? incident.expectedScore ?? 0).toFixed(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-modal-title"
      data-testid="assignment-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-surface-1 border border-hairline rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-5 py-4 border-b border-hairline bg-surface-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 id="assignment-modal-title" className="text-sm font-mono font-bold text-ink">
                Human Coordinator Dispatch Gate
              </h2>
              <span className="text-[11px] font-mono text-ink-subtle">
                Invariant 5: Explicit human coordinator approval required before asset assignment
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-ink-muted hover:text-ink hover:bg-surface-3 transition-colors"
            aria-label="Close dispatch modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs scrollbar-thin scrollbar-thumb-surface-3">
          {/* Target Incident Summary Card */}
          <div className="bg-surface-2 border border-hairline rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-ink">{incident.code}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    incident.category === 'Critical'
                      ? 'bg-semantic-critical/20 text-semantic-critical-text border border-semantic-critical-border'
                      : incident.category === 'High'
                      ? 'bg-semantic-warning/20 text-semantic-warning-text border border-semantic-warning-border'
                      : 'bg-surface-3 text-ink-muted border border-hairline'
                  }`}
                >
                  {incident.category} ({scoreDisplay})
                </span>
                <span className="text-[11px] text-ink-subtle">Station: {sectorLabel}</span>
              </div>
              {incident.targetResource && (
                <span className="text-[10px] uppercase tracking-wider text-brand bg-brand/10 border border-brand/30 px-2 py-0.5 rounded">
                  Requires: {incident.targetResource.replace('_', ' ')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2 italic">
              &quot;{incident.reportTranslation || incident.reportText}&quot;
            </p>
          </div>

          {/* Candidate Resource Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="resource-select" className="text-[11px] uppercase tracking-wider text-ink-subtle font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand" />
                Select Candidate Rescue Resource ({candidateResources.length} Available)
              </label>
              {availableResources.length > candidateResources.length && (
                <button
                  type="button"
                  onClick={() => setShowAllSectors(!showAllSectors)}
                  className="text-[10px] text-brand hover:underline"
                >
                  {showAllSectors ? 'Show Sector Only' : 'Show All Sectors'}
                </button>
              )}
            </div>

            {candidateResources.length === 0 ? (
              <div className="p-3 bg-semantic-critical/10 border border-semantic-critical-border rounded-lg text-semantic-critical-text text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Zero rescue assets currently available in {sectorLabel}. All assets deployed.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {candidateResources.map((res) => {
                  const isSelected = res.id === selectedResourceId;
                  const inSameSector =
                    res.stationSector.toLowerCase() === incident.sectorId.toLowerCase();
                  return (
                    <button
                      key={res.id}
                      type="button"
                      data-testid={`resource-candidate-${res.id}`}
                      onClick={() => setSelectedResourceId(res.id)}
                      className={`text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand/15 border-brand text-ink shadow-sm ring-1 ring-brand'
                          : 'bg-surface-2 border-hairline text-ink-muted hover:bg-surface-3 hover:text-ink'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink">{res.callsign}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-3 border border-hairline text-ink-subtle uppercase">
                            {res.type.replace('_', ' ')}
                          </span>
                          {!inSameSector && (
                            <span className="text-[10px] text-semantic-warning-text bg-semantic-warning/10 px-1 rounded">
                              Cross-Sector: {formatSectorDisplay(res.stationSector)}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-subtle">
                          Capacity: {res.seatCapacity} persons • Speed: {res.speedKmH} km/h • Turnaround: {res.turnaroundMinutes} min
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-brand" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-hairline" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Opportunity Cost Warning Card (Test 1.5) */}
          {selectedResource && costResult && (
            <OpportunityCostWarningCard
              costResult={costResult}
              candidateResource={selectedResource}
              targetIncident={incident}
              matchedShelterName={matchedShelter?.name}
              matchedShelterDetails={
                matchedShelter
                  ? `${matchedShelter.capabilities.join(', ')} • ${Math.round(
                      (matchedShelter.capacityCurrent / matchedShelter.capacityTotal) * 100
                    )}% capacity`
                  : undefined
              }
            />
          )}

          {/* Human Responsibility Notice */}
          <div className="p-2.5 rounded bg-surface-2/80 border border-hairline text-[11px] text-ink-subtle flex items-start gap-2">
            <Info className="w-4 h-4 text-ink-muted mt-0.5 shrink-0" />
            <span>
              By approving this dispatch, you confirm operational authorization. The asset will be locked from other incident queues and an immutable audit log entry will be created.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-hairline bg-surface-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-mono text-ink-muted hover:text-ink hover:bg-surface-3 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            data-testid="approve-assignment-button"
            disabled={!selectedResourceId}
            onClick={handleApprove}
            className="px-4 py-2 rounded text-xs font-mono font-bold text-white bg-brand hover:bg-brand-hover disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 shadow-md shadow-brand/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Approve Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
