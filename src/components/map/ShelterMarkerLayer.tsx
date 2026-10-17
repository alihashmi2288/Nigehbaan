'use client';

import React from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store';
import { SHELTER_COORDINATES, getShelterOccupancy } from './mapUtils';
import { Shelter } from '@/types';
import { Building2, Zap, ZapOff, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ShelterMarkerLayer: React.FC = () => {
  const shelters = useAppStore((state) => state.shelters);

  const createShelterIcon = (shelter: Shelter) => {
    const occupancy = getShelterOccupancy(shelter);
    const borderColor = occupancy.statusBadgeColor;

    return L.divIcon({
      className: 'tactical-shelter-marker-icon',
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
      html: `
        <div style="
          position: relative;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #141516;
          border: 1.5px solid ${borderColor};
          box-shadow: 0 3px 10px rgba(0,0,0,0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${borderColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"/>
            <path d="M19 21v-4"/>
            <path d="M19 13V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/>
            <path d="M9 7h1"/>
            <path d="M9 11h1"/>
            <path d="M9 15h1"/>
            <path d="M14 7h1"/>
            <path d="M14 11h1"/>
            <path d="M14 15h1"/>
          </svg>
          <span style="
            font-size: 8px;
            font-family: monospace;
            font-weight: 700;
            color: ${borderColor};
            line-height: 1;
            margin-top: 1px;
          ">${occupancy.percentage}%</span>
        </div>
      `,
    });
  };

  return (
    <>
      {shelters.map((shelter) => {
        const coords = SHELTER_COORDINATES[shelter.id];
        if (!coords) return null;

        const occupancy = getShelterOccupancy(shelter);
        const icon = createShelterIcon(shelter);

        return (
          <Marker key={shelter.id} position={coords} icon={icon}>
            <Tooltip
              direction="top"
              offset={[0, -16]}
              className="tactical-shelter-tooltip"
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold text-ink text-xs">{shelter.name}</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight"
                  style={{
                    backgroundColor: `${occupancy.statusBadgeColor}20`,
                    color: occupancy.statusBadgeColor,
                    border: `1px solid ${occupancy.statusBadgeColor}60`,
                  }}
                >
                  {occupancy.percentage}% Cap
                </span>
              </div>
            </Tooltip>

            <Popup className="tactical-shelter-popup">
              <div className="p-3 text-ink font-sans space-y-2.5 min-w-[240px]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-hairline pb-2">
                  <div className="font-bold text-sm text-ink">{shelter.name}</div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-2 border border-hairline text-ink-muted">
                    {shelter.id}
                  </span>
                </div>

                {/* Capacity Gauge */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-subtle">Capacity:</span>
                    <span className="font-semibold text-ink">
                      {shelter.capacityCurrent} / {shelter.capacityTotal} ({occupancy.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden border border-hairline">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(occupancy.percentage, 100)}%`,
                        backgroundColor: occupancy.statusBadgeColor,
                      }}
                    />
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded bg-surface-2 border border-hairline">
                    <div className="flex items-center gap-1.5">
                      {shelter.backupGenerator ? (
                        <Zap className="w-3.5 h-3.5 text-semantic-success-text" />
                      ) : (
                        <ZapOff className="w-3.5 h-3.5 text-semantic-critical-text" />
                      )}
                      <span className="text-ink-muted text-[11px]">Power:</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                        shelter.backupGenerator
                          ? 'bg-semantic-success/15 text-semantic-success-text border border-semantic-success-border'
                          : 'bg-semantic-critical/15 text-semantic-critical-text border border-semantic-critical-border'
                      }`}
                    >
                      {shelter.backupGenerator ? 'Gen Active' : 'Grid Blackout'}
                    </span>
                  </div>

                  {/* Capabilities */}
                  <div className="p-2 rounded bg-surface-2 border border-hairline space-y-1">
                    <span className="text-[10px] text-ink-subtle block font-mono uppercase">
                      Medical & Support Capabilities
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {shelter.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-3 border border-hairline text-ink-muted"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
