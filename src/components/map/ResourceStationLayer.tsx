'use client';

import React from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store';
import { RESOURCE_STATION_COORDINATES } from './mapUtils';
import { Resource, ResourceType } from '@/types';
import { Anchor, Truck, HeartPulse, Compass, Clock, Users, Gauge } from 'lucide-react';

export const ResourceStationLayer: React.FC = () => {
  const resources = useAppStore((state) => state.resources);

  // Helper for vehicle SVG icon glyph
  const getResourceIconGlyph = (type: ResourceType): string => {
    switch (type) {
      case 'shallow_boat':
        // Boat icon
        return `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
            <path d="M12 10v4"/>
          </svg>
        `;
      case 'heavy_4x4':
        // High-clearance truck icon
        return `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
        `;
      case 'mobile_medical':
        // Medical cross icon
        return `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/>
          </svg>
        `;
      case 'recon_patrol':
      default:
        // Recon compass icon
        return `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        `;
    }
  };

  const createResourceIcon = (resource: Resource) => {
    const isAvailable = resource.status === 'available';
    const statusColor = isAvailable ? '#27a644' : '#92400E';
    const statusText = isAvailable ? '#75E0A7' : '#FDB022';
    const glyph = getResourceIconGlyph(resource.type);

    return L.divIcon({
      className: 'tactical-resource-marker-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -16],
      html: `
        <div style="
          position: relative;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          background: #141516;
          border: 1.5px solid ${statusColor};
          box-shadow: 0 2px 8px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${statusText};
          cursor: pointer;
        ">
          ${glyph}
          <span style="
            position: absolute;
            top: -3px;
            right: -3px;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            background: ${statusColor};
            border: 1.5px solid #010102;
          "></span>
        </div>
      `,
    });
  };

  return (
    <>
      {resources.map((resource) => {
        const coords = RESOURCE_STATION_COORDINATES[resource.id];
        if (!coords) return null;

        const isAvailable = resource.status === 'available';
        const icon = createResourceIcon(resource);

        return (
          <Marker key={resource.id} position={coords} icon={icon}>
            <Tooltip
              direction="top"
              offset={[0, -14]}
              className="tactical-resource-tooltip bg-surface-1/95 border border-hairline text-ink text-xs font-mono px-2 py-1 rounded shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-ink">{resource.callsign}</span>
                <span
                  className={`px-1 rounded text-[10px] uppercase font-semibold ${
                    isAvailable
                      ? 'bg-semantic-success/20 text-semantic-success-text'
                      : 'bg-semantic-warning/20 text-semantic-warning-text'
                  }`}
                >
                  {resource.status}
                </span>
              </div>
            </Tooltip>

            <Popup className="tactical-resource-popup">
              <div className="p-3 text-ink font-sans space-y-2.5 min-w-[220px]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-hairline pb-2">
                  <div className="font-bold text-sm text-ink">{resource.callsign}</div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      isAvailable
                        ? 'bg-semantic-success/20 text-semantic-success-text border border-semantic-success-border'
                        : 'bg-semantic-warning/20 text-semantic-warning-text border border-semantic-warning-border'
                    }`}
                  >
                    {resource.status}
                  </span>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-surface-2 border border-hairline">
                    <span className="text-[10px] text-ink-subtle block font-mono">SECTOR</span>
                    <span className="font-mono font-semibold text-ink">{resource.stationSector}</span>
                  </div>
                  <div className="p-2 rounded bg-surface-2 border border-hairline">
                    <span className="text-[10px] text-ink-subtle block font-mono">CYCLE TIME</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-ink">
                      <Clock className="w-3 h-3 text-brand" />
                      <span>{resource.turnaroundMinutes} min</span>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-surface-2 border border-hairline">
                    <span className="text-[10px] text-ink-subtle block font-mono">CAPACITY</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-ink">
                      <Users className="w-3 h-3 text-ink-subtle" />
                      <span>{resource.seatCapacity} seats</span>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-surface-2 border border-hairline">
                    <span className="text-[10px] text-ink-subtle block font-mono">SPEED</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-ink">
                      <Gauge className="w-3 h-3 text-ink-subtle" />
                      <span>{resource.speedKmH} km/h</span>
                    </div>
                  </div>
                </div>

                {resource.assignedIncidentId && (
                  <div className="p-2 rounded bg-brand/10 border border-brand/30 text-xs font-mono text-brand flex items-center justify-between">
                    <span>ASSIGNED TO:</span>
                    <span className="font-bold">{resource.assignedIncidentId}</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
