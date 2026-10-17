'use client';

import React, { useMemo } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ZapOff,
  Activity,
  HeartPulse,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Incident, Shelter } from '@/types';
import { matchShelterForIncident } from '@/lib/shelters';
import { formatSectorDisplay } from '@/lib/resources';

interface ShelterMatchCardProps {
  incident: Incident;
  shelters: Shelter[];
  selectedShelterId: string;
  onSelectShelter: (shelterId: string) => void;
}

export const ShelterMatchCard: React.FC<ShelterMatchCardProps> = ({
  incident,
  shelters,
  selectedShelterId,
  onSelectShelter,
}) => {
  const matchResult = useMemo(
    () => matchShelterForIncident(incident, shelters),
    [incident, shelters]
  );

  const { recommendedShelter, candidates, requiredCapabilities, rationale } = matchResult;

  const eligibleCandidates = useMemo(
    () => candidates.filter((c) => c.isEligible),
    [candidates]
  );

  const filteredCandidates = useMemo(
    () => candidates.filter((c) => !c.isEligible),
    [candidates]
  );

  return (
    <div
      data-testid="shelter-match-card"
      className="bg-surface-2 border border-hairline rounded-lg p-3.5 space-y-3 font-mono text-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand" />
          <span className="font-bold text-ink uppercase tracking-tight">
            Destination Shelter Allocation
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-surface-3 border border-hairline text-ink-subtle">
            {eligibleCandidates.length} Eligible • {filteredCandidates.length} Excluded
          </span>
        </div>
      </div>

      {/* Required Medical Capabilities Bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] text-ink-subtle uppercase flex items-center gap-1">
          <HeartPulse className="w-3 h-3 text-brand" />
          Required Capabilities:
        </span>
        {requiredCapabilities.map((cap) => (
          <span
            key={cap}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand/15 text-brand border border-brand/30"
          >
            {cap}
          </span>
        ))}
      </div>

      {/* Auditable Rationale */}
      <div className="p-2 rounded bg-surface-1 border border-hairline text-[11px] text-ink-muted leading-relaxed flex items-start gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
        <span>{rationale}</span>
      </div>

      {/* Candidate Shelter Selection List */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider text-ink-subtle font-bold block">
          Candidate Facilities ({eligibleCandidates.length})
        </span>

        <div className="space-y-2">
          {eligibleCandidates.map((cand) => {
            const isSelected = cand.shelter.id === selectedShelterId;
            const isRec = cand.shelter.id === recommendedShelter?.id;

            return (
              <button
                key={cand.shelter.id}
                type="button"
                data-testid={`shelter-candidate-${cand.shelter.id}`}
                onClick={() => onSelectShelter(cand.shelter.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-brand/15 border-brand text-ink shadow-sm ring-1 ring-brand'
                    : 'bg-surface-1 border-hairline text-ink-muted hover:bg-surface-3 hover:text-ink'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-ink">{cand.shelter.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-3 border border-hairline text-ink-subtle uppercase">
                      {formatSectorDisplay(cand.shelter.sectorId)}
                    </span>
                    {isRec && (
                      <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-semantic-success/20 text-semantic-success-text border border-semantic-success-border">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-brand" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-hairline" />
                    )}
                  </div>
                </div>

                {/* Capacity and Power Telemetry */}
                <div className="flex items-center justify-between text-[11px] text-ink-subtle">
                  <div className="flex items-center gap-3">
                    <span>
                      Occupancy: {cand.shelter.capacityOccupied ?? cand.shelter.capacityCurrent}/
                      {cand.shelter.capacityTotal} ({cand.occupancyPercentage}%)
                    </span>
                    <span className="flex items-center gap-1">
                      {cand.shelter.backupGenerator ? (
                        <span className="text-semantic-success-text flex items-center gap-0.5">
                          <Zap className="w-3 h-3" />
                          Backup Power Online
                        </span>
                      ) : (
                        <span className="text-semantic-critical-text flex items-center gap-0.5">
                          <ZapOff className="w-3 h-3" />
                          No Generator
                        </span>
                      )}
                    </span>
                  </div>

                  {cand.deprioritizationReason && (
                    <span className="text-semantic-warning-text text-[10px]">
                      {cand.deprioritizationReason}
                    </span>
                  )}
                </div>

                {/* Capabilities pills */}
                <div className="flex flex-wrap items-center gap-1">
                  {cand.shelter.capabilities.map((cap) => {
                    const isMatched = cand.matchingCapabilities.includes(cap);
                    return (
                      <span
                        key={cap}
                        className={`text-[9px] px-1.5 py-0.5 rounded border ${
                          isMatched
                            ? 'bg-semantic-success/15 text-semantic-success-text border-semantic-success-border font-bold'
                            : 'bg-surface-2 text-ink-subtle border-hairline'
                        }`}
                      >
                        {cap}
                      </span>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Out Shelters (Test 2.1: SHL-03 filtered out) */}
      {filteredCandidates.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] uppercase tracking-wider text-semantic-critical-text font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-semantic-critical" />
            Excluded Facilities ({filteredCandidates.length})
          </span>

          <div className="space-y-1">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.shelter.id}
                data-testid={`shelter-excluded-${cand.shelter.id}`}
                className="p-2 rounded bg-semantic-critical/10 border border-semantic-critical-border/40 text-[10px] text-ink-muted flex items-start justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-ink">{cand.shelter.name}</span>
                  <span className="text-ink-subtle ml-1.5">
                    ({cand.occupancyPercentage}% capacity • {cand.shelter.backupGenerator ? 'Generator' : 'Grid Blackout'})
                  </span>
                  <p className="text-semantic-critical-text mt-0.5 font-medium">
                    Filtered Out: {cand.exclusionReason}
                  </p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-semantic-critical/20 text-semantic-critical-text border border-semantic-critical-border uppercase text-[9px] font-bold shrink-0">
                  Ineligible
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
