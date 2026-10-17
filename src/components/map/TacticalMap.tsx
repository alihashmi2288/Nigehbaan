'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import {
  DISTRICT_ALPHA_CENTER,
  DISTRICT_ALPHA_ZOOM,
  CARTO_DARK_MATTER_URL,
  CARTO_ATTRIBUTION,
  partitionIncidentsByCoordinates,
} from './mapUtils';
import { SectorPolygonLayer } from './SectorPolygonLayer';
import { IncidentMarkerLayer } from './IncidentMarkerLayer';
import { ResourceStationLayer } from './ResourceStationLayer';
import { ShelterMarkerLayer } from './ShelterMarkerLayer';
import { useAppStore, selectVisibleIncidents } from '@/store';
import {
  Layers,
  ShieldAlert,
  Ambulance,
  Building2,
  AlertTriangle,
  Compass,
  MapPinOff,
} from 'lucide-react';

export const TacticalMap: React.FC = () => {
  const incidents = useAppStore((state) => state.incidents);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const setSelectedIncidentId = useAppStore((state) => state.setSelectedIncidentId);

  // Layer visibility state
  const [showSectors, setShowSectors] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showShelters, setShowShelters] = useState(true);

  // Check unmapped incidents (NG-112)
  const visibleIncidents = selectVisibleIncidents(incidents, timelinePhase);
  const { unmapped } = partitionIncidentsByCoordinates(visibleIncidents);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-hairline bg-canvas">
      {/* Leaflet Map Container */}
      <MapContainer
        center={DISTRICT_ALPHA_CENTER}
        zoom={DISTRICT_ALPHA_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[500px] z-0"
      >
        <TileLayer url={CARTO_DARK_MATTER_URL} attribution={CARTO_ATTRIBUTION} maxZoom={19} />

        {showSectors && <SectorPolygonLayer />}
        {showIncidents && <IncidentMarkerLayer />}
        {showResources && <ResourceStationLayer />}
        {showShelters && <ShelterMarkerLayer />}
      </MapContainer>

      {/* Top-Right Tactical Layer Controls HUD */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <div className="bg-surface-1/95 border border-hairline-strong rounded-lg p-2.5 shadow-2xl backdrop-blur-md text-ink">
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-hairline text-xs font-mono font-semibold text-ink-muted">
            <Layers className="w-3.5 h-3.5 text-brand" />
            <span>TACTICAL LAYERS</span>
          </div>

          <div className="flex flex-col gap-1.5 text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer hover:text-ink transition-colors text-ink-muted">
              <input
                type="checkbox"
                checked={showSectors}
                onChange={(e) => setShowSectors(e.target.checked)}
                className="rounded border-hairline-strong bg-surface-2 text-brand focus:ring-brand focus:ring-offset-0 w-3.5 h-3.5"
              />
              <span>Sectors (4)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-ink transition-colors text-ink-muted">
              <input
                type="checkbox"
                checked={showIncidents}
                onChange={(e) => setShowIncidents(e.target.checked)}
                className="rounded border-hairline-strong bg-surface-2 text-brand focus:ring-brand focus:ring-offset-0 w-3.5 h-3.5"
              />
              <span className="flex items-center gap-1.5">
                <span>Incidents</span>
                <span className="text-[10px] px-1 rounded bg-semantic-critical/20 text-semantic-critical-text font-bold">
                  {visibleIncidents.length}
                </span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-ink transition-colors text-ink-muted">
              <input
                type="checkbox"
                checked={showResources}
                onChange={(e) => setShowResources(e.target.checked)}
                className="rounded border-hairline-strong bg-surface-2 text-brand focus:ring-brand focus:ring-offset-0 w-3.5 h-3.5"
              />
              <span>Rescue Assets (6)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-ink transition-colors text-ink-muted">
              <input
                type="checkbox"
                checked={showShelters}
                onChange={(e) => setShowShelters(e.target.checked)}
                className="rounded border-hairline-strong bg-surface-2 text-brand focus:ring-brand focus:ring-offset-0 w-3.5 h-3.5"
              />
              <span>Relief Shelters (3)</span>
            </label>
          </div>
        </div>

        {/* Unmapped Incidents Alert Badge (e.g. NG-112) */}
        {unmapped.length > 0 && (
          <div className="bg-surface-1/95 border border-semantic-warning-border/80 rounded-lg p-2.5 shadow-2xl backdrop-blur-md text-ink flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-semantic-warning-text text-xs font-mono font-bold">
              <MapPinOff className="w-3.5 h-3.5 shrink-0" />
              <span>UNMAPPED ({unmapped.length})</span>
            </div>
            <p className="text-[11px] text-ink-muted leading-tight">
              Reports missing exact GPS coordinates.
            </p>
            <div className="flex flex-col gap-1 pt-1">
              {unmapped.map((inc) => (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className="w-full py-1 px-2 rounded bg-semantic-warning/15 hover:bg-semantic-warning/25 border border-semantic-warning-border text-semantic-warning-text text-[11px] font-mono font-semibold transition-colors flex items-center justify-between text-left"
                >
                  <span>{inc.code}</span>
                  <span className="text-[10px] opacity-80">{inc.sectorId}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom-Left Tactical Coordinates HUD */}
      <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
        <div className="bg-surface-1/90 border border-hairline rounded-md px-2.5 py-1.5 shadow-lg backdrop-blur-sm flex items-center gap-3 text-[11px] font-mono text-ink-subtle">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand" />
            <span className="text-ink">DISTRICT ALPHA</span>
          </div>
          <span className="border-l border-hairline pl-3">24.935° N, 67.145° E</span>
          <span className="border-l border-hairline pl-3 uppercase">PHASE: {timelinePhase}</span>
        </div>
      </div>
    </div>
  );
};
