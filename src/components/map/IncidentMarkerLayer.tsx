'use client';

import React, { useMemo } from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore, selectVisibleIncidents } from '@/store';
import { partitionIncidentsByCoordinates, getPrioritySemanticColors } from './mapUtils';
import { Incident } from '@/types';
import { ShieldAlert, Phone, AlertCircle, MapPin, Eye } from 'lucide-react';

export const IncidentMarkerLayer: React.FC = () => {
  const incidents = useAppStore((state) => state.incidents);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const selectedIncidentId = useAppStore((state) => state.selectedIncidentId);
  const setSelectedIncidentId = useAppStore((state) => state.setSelectedIncidentId);

  // Filter to incidents visible at current phase
  const visibleIncidents = useMemo(
    () => selectVisibleIncidents(incidents, timelinePhase),
    [incidents, timelinePhase]
  );

  // Partition by coordinates (NG-112 has null coordinates)
  const { mapped } = useMemo(
    () => partitionIncidentsByCoordinates(visibleIncidents),
    [visibleIncidents]
  );

  // Create memoized Leaflet divIcon
  const createIncidentIcon = (incident: Incident, isSelected: boolean) => {
    const isCritical = incident.category === 'Critical';
    const colors = getPrioritySemanticColors(incident.category);
    const scoreVal =
      incident.score !== undefined
        ? incident.score.toFixed(0)
        : incident.expectedScore !== undefined
        ? incident.expectedScore.toFixed(0)
        : '—';

    const pulseHtml = isCritical ? `<div class="marker-critical-pulse"></div>` : '';
    const borderColor = isSelected ? '#5e6ad2' : colors.solid;
    const boxShadow = isSelected
      ? '0 0 0 2px #5e6ad2, 0 4px 14px rgba(94, 106, 210, 0.6)'
      : '0 2px 8px rgba(0,0,0,0.7)';

    return L.divIcon({
      className: 'tactical-incident-marker-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          ${pulseHtml}
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            background-color: #0f1011;
            border: 2px solid ${borderColor};
            box-shadow: ${boxShadow};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${colors.text};
            font-family: monospace;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            z-index: ${isSelected ? 50 : isCritical ? 40 : 20};
          ">
            ${scoreVal}
          </div>
        </div>
      `,
    });
  };

  return (
    <>
      {mapped.map((incident) => {
        const isSelected = incident.id === selectedIncidentId;
        const icon = createIncidentIcon(incident, isSelected);
        const colors = getPrioritySemanticColors(incident.category);

        return (
          <Marker
            key={incident.id}
            position={incident.coordinates}
            icon={icon}
            eventHandlers={{
              click: () => {
                setSelectedIncidentId(incident.id);
              },
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -16]}
              className="tactical-incident-tooltip bg-surface-1/95 border border-hairline-strong text-ink text-xs font-mono px-2.5 py-1 rounded shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">{incident.code}</span>
                <span
                  className="px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase"
                  style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  {incident.category} ({incident.score ?? incident.expectedScore})
                </span>
              </div>
            </Tooltip>

            <Popup className="tactical-incident-popup">
              <div className="p-3 text-ink font-sans space-y-2.5 min-w-[240px] max-w-[280px]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-hairline pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sm text-ink">{incident.code}</span>
                    <span className="text-[10px] font-mono text-ink-subtle">[{incident.sectorId}]</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold"
                    style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                  >
                    {incident.category} • {incident.score ?? incident.expectedScore}
                  </span>
                </div>

                {/* Report Text */}
                <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">
                  {incident.reportText}
                </p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-surface-2 border border-hairline text-ink-muted flex items-center gap-1">
                    <Phone className="w-3 h-3 text-ink-subtle" />
                    {incident.phoneAccess}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-2 border border-hairline text-ink-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand" />
                    {incident.coordinates[0].toFixed(3)}, {incident.coordinates[1].toFixed(3)}
                  </span>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className="w-full py-1.5 px-3 rounded text-xs font-medium font-mono bg-brand hover:bg-brand-hover text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Select In Queue
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
