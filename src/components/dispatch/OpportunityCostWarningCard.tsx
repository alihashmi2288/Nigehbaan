'use client';

import React from 'react';
import { AlertTriangle, Clock, ArrowRight, Building2, ShieldAlert } from 'lucide-react';
import { OpportunityCostResult } from '@/lib/resources';
import { Resource, Incident } from '@/types';

interface OpportunityCostWarningCardProps {
  costResult: OpportunityCostResult;
  candidateResource: Resource;
  targetIncident: Incident;
  matchedShelterName?: string;
  matchedShelterDetails?: string;
}

/**
 * Opportunity Cost Warning Card (Tasks T7.2, Test 1.5)
 * Renders tactical warning card when asset assignment creates sector scarcity
 * or turnaround delay penalties for subsequent queued incidents.
 */
export const OpportunityCostWarningCard: React.FC<OpportunityCostWarningCardProps> = ({
  costResult,
  candidateResource,
  targetIncident,
  matchedShelterName,
  matchedShelterDetails,
}) => {
  if (!costResult.hasScarcity) {
    return (
      <div
        data-testid="opportunity-cost-safe"
        className="rounded-lg p-3 bg-surface-2 border border-hairline text-ink-muted text-xs font-mono space-y-1"
      >
        <div className="flex items-center gap-1.5 text-semantic-success-text font-bold">
          <span className="w-2 h-2 rounded-full bg-semantic-success" />
          No Scarcity Penalty
        </div>
        <p className="text-[11px] text-ink-subtle">
          {costResult.consequenceText}. Immediate response capacity remains.
        </p>
      </div>
    );
  }

  const affected = costResult.affectedIncident;

  return (
    <div
      data-testid="opportunity-cost-warning"
      className="bg-semantic-warning/15 border border-semantic-warning-border rounded-lg p-3.5 space-y-3 font-mono"
    >
      {/* Alert Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-semantic-warning-text animate-pulse" />
          <span className="text-xs font-bold text-semantic-warning-text uppercase tracking-wide">
            Opportunity Cost Alert
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-semantic-warning/25 text-semantic-warning-text border border-semantic-warning-border flex items-center gap-1">
          <Clock className="w-3 h-3" />+{costResult.delayMinutes} min delay
        </span>
      </div>

      {/* Main Consequence Callout */}
      <div className="text-xs text-ink space-y-1.5 leading-relaxed bg-surface-1/60 p-2.5 rounded border border-hairline">
        <p>
          Committing <strong className="text-ink font-bold">{candidateResource.callsign}</strong> to{' '}
          <strong className="text-ink font-bold">{targetIncident.code}</strong> {costResult.consequenceText.toLowerCase().includes('leaves') ? costResult.consequenceText.toLowerCase() : `leaves 0 ${costResult.warningLabel}`}.
        </p>

        {affected ? (
          <p className="text-semantic-warning-text font-semibold flex items-start gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              Queued Incident <strong className="text-ink">{affected.code}</strong> [Score{' '}
              {(affected.score ?? affected.expectedScore ?? 0).toFixed(1)} — {affected.category}] will incur an estimated{' '}
              <strong className="text-semantic-warning-text underline decoration-semantic-warning-border">
                +{costResult.delayMinutes} min delay
              </strong>.
            </span>
          </p>
        ) : (
          <p className="text-semantic-warning-text font-semibold flex items-start gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              Subsequent queued incidents will incur an estimated +{costResult.delayMinutes} min turnaround delay.
            </span>
          </p>
        )}
      </div>

      {/* Matched Shelter Destination */}
      {matchedShelterName && (
        <div className="pt-2 border-t border-semantic-warning-border/40 text-[11px] text-ink-muted flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-brand" />
            <span>Matched Destination: <strong className="text-ink">{matchedShelterName}</strong></span>
          </span>
          {matchedShelterDetails && (
            <span className="text-[10px] text-ink-subtle">({matchedShelterDetails})</span>
          )}
        </div>
      )}
    </div>
  );
};
