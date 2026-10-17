'use client';

import React from 'react';
import { Incident } from '@/types';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Radio,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface IncidentCardProps {
  incident: Incident;
  isSelected: boolean;
  onSelect: () => void;
}

export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' PKT';
  } catch {
    return isoString;
  }
}

export function getCategoryBadgeStyles(category: Incident['category']): {
  bg: string;
  text: string;
  border: string;
  solid: string;
} {
  switch (category) {
    case 'Critical':
      return {
        bg: 'rgba(180, 35, 24, 0.18)',
        text: '#FDA29B',
        border: '#F04438',
        solid: '#B42318',
      };
    case 'High':
      return {
        bg: 'rgba(146, 64, 14, 0.18)',
        text: '#FDB022',
        border: '#D97706',
        solid: '#92400E',
      };
    case 'Moderate':
      return {
        bg: 'rgba(71, 85, 105, 0.20)',
        text: '#CBD5E1',
        border: '#64748B',
        solid: '#475569',
      };
    case 'Low':
    default:
      return {
        bg: 'rgba(39, 166, 68, 0.15)',
        text: '#75E0A7',
        border: '#12B76A',
        solid: '#27a644',
      };
  }
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  isSelected,
  onSelect,
}) => {
  const badgeStyles = getCategoryBadgeStyles(incident.category);
  const scoreVal =
    incident.score !== undefined
      ? incident.score.toFixed(1)
      : incident.expectedScore !== undefined
      ? incident.expectedScore.toFixed(1)
      : '—';

  const isAssigned = incident.status === 'assigned' || !!incident.assignedResourceId;
  const isBlindSpot = incident.reporterType === 'system_blind_spot';
  const hasNoPhone = incident.phoneAccess === 'no_phone';
  const isMissingLocation = !incident.coordinates;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      className={`relative w-full rounded-md p-3.5 transition-all cursor-pointer text-left select-none border ${
        isSelected
          ? 'bg-surface-2 border-brand shadow-[0_0_0_1px_#5e6ad2,0_4px_16px_rgba(94,106,210,0.25)]'
          : 'bg-surface-1 hover:bg-surface-2 border-hairline hover:border-hairline-strong'
      }`}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: badgeStyles.solid,
      }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-sm tracking-tight text-ink">
            {incident.code}
          </span>

          {/* Sector Badge */}
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3 border border-hairline text-ink-muted">
            {incident.sectorId.replace('-', ' ').toUpperCase()}
          </span>

          {/* Reporter Type Pill */}
          {isBlindSpot ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-semantic-blind-spot/15 border border-semantic-blind-spot-border text-semantic-blind-spot-text flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              Blind Spot
            </span>
          ) : incident.reporterType === 'community_proxy' ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3 border border-hairline text-ink-subtle flex items-center gap-1">
              <UserCheck className="w-2.5 h-2.5" />
              Proxy
            </span>
          ) : incident.reporterType === 'voice_hotline' ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3 border border-hairline text-ink-subtle flex items-center gap-1">
              <Phone className="w-2.5 h-2.5" />
              Voice
            </span>
          ) : null}

          {/* Assignment Status Pill */}
          {isAssigned && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-semantic-success/15 border border-semantic-success-border text-semantic-success-text flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Assigned
            </span>
          )}
        </div>

        {/* Priority Score & Category Badge */}
        <div
          className="px-2 py-0.5 rounded text-xs font-mono font-bold tracking-tight uppercase flex items-center gap-1.5 shrink-0"
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
          <span className="font-mono opacity-90">{scoreVal}</span>
        </div>
      </div>

      {/* Headline / Distress Report Snippet */}
      <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-2.5">
        {incident.reportText}
      </p>

      {/* Uncertainty & Provenance Flags */}
      {(incident.uncertaintyFlags.length > 0 || isMissingLocation || hasNoPhone) && (
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {isMissingLocation && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-semantic-warning/15 border border-semantic-warning-border text-semantic-warning-text flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" />
              Missing Location
            </span>
          )}
          {hasNoPhone && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3 border border-hairline text-ink-subtle flex items-center gap-1">
              <Phone className="w-2.5 h-2.5 text-semantic-warning-text" />
              No Phone (Floor 4.0)
            </span>
          )}
          {incident.uncertaintyFlags
            .filter((f) => f !== 'MISSING_LOCATION')
            .map((flag) => (
              <span
                key={flag}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3 border border-hairline text-ink-subtle flex items-center gap-1"
              >
                <HelpCircle className="w-2.5 h-2.5 text-ink-muted" />
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
        </div>
      )}

      {/* Card Footer: Timestamp & Metadata */}
      <div className="flex items-center justify-between text-[11px] font-mono text-ink-subtle pt-2 border-t border-hairline">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-ink-subtle" />
          {formatTimestamp(incident.timestamp)}
        </span>

        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-ink-subtle" />
          {incident.coordinates ? (
            <span>
              {incident.coordinates[0].toFixed(3)}, {incident.coordinates[1].toFixed(3)}
            </span>
          ) : (
            <span className="text-semantic-warning-text font-semibold">Unmapped</span>
          )}
        </span>
      </div>
    </div>
  );
};
