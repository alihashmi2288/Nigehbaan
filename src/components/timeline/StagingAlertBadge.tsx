'use client';

import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  ChevronRight,
  Shield,
  Users,
  Anchor,
  Clock,
  Info,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { getStagingRecommendations, getSectorStagingRecommendation } from '@/lib/simulation/stagingAdvisor';

interface StagingAlertBadgeProps {
  sectorId?: string;
  className?: string;
}

export const StagingAlertBadge: React.FC<StagingAlertBadgeProps> = ({
  sectorId,
  className = '',
}) => {
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const resources = useAppStore((state) => state.resources);
  const sectors = useAppStore((state) => state.sectors);

  const [isExpanded, setIsExpanded] = useState(false);

  // Staging recommendations are only active at T-0 Early Warning
  if (timelinePhase !== 'T0') {
    return null;
  }

  const recommendation = sectorId
    ? getSectorStagingRecommendation(sectorId, timelinePhase)
    : getStagingRecommendations(timelinePhase, resources, sectors)[0] ?? null;

  if (!recommendation) {
    return null;
  }

  return (
    <div
      data-testid="pre-position-pill"
      className={`rounded-lg border border-brand/40 bg-gradient-to-r from-brand/15 via-surface-2 to-surface-2 p-2.5 sm:p-3 font-mono shadow-md ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-brand/20 border border-brand/50 flex items-center justify-center text-brand shrink-0 mt-0.5 sm:mt-0">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand text-white shadow-sm">
                {recommendation.badgeText}
              </span>
              <span className="text-[11px] font-bold text-ink">
                {recommendation.actionText}
              </span>
            </div>

            <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
              <strong className="text-ink-subtle font-mono text-[10px] uppercase mr-1">
                Rationale:
              </strong>
              {recommendation.rationale}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-end sm:self-center px-2 py-1 rounded text-[10px] font-mono font-semibold bg-surface-3 hover:bg-surface-4 text-ink hover:text-white border border-hairline transition-colors flex items-center gap-1 shrink-0"
        >
          <Info className="w-3 h-3 text-brand" />
          <span>{isExpanded ? 'Hide Priors' : 'Sector 3A Priors'}</span>
          <ChevronRight
            className={`w-3 h-3 text-ink-subtle transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </button>
      </div>

      {/* Expanded Pre-Disaster Registry Priors Panel */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-hairline/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-ink-subtle">
          <div className="p-2 rounded bg-surface-1 border border-hairline flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-semantic-warning-text" />
            <div>
              <span className="text-ink font-bold block">
                {recommendation.details.isolatedElderlyCount} Isolated Elderly
              </span>
              <span>Living alone in single-story mud dwellings</span>
            </div>
          </div>

          <div className="p-2 rounded bg-surface-1 border border-hairline flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-semantic-critical-text" />
            <div>
              <span className="text-ink font-bold block">Arterial Cut at T+3</span>
              <span>Submersion elevation 1.8m above datum</span>
            </div>
          </div>

          <div className="p-2 rounded bg-surface-1 border border-hairline flex items-center gap-2">
            <Anchor className="w-3.5 h-3.5 text-brand" />
            <div>
              <span className="text-ink font-bold block">High Ground Depot Alpha</span>
              <span>Safe pre-positioning staging depot</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
