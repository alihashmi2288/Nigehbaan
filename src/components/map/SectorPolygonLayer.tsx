'use client';

import React from 'react';
import { Polygon, Tooltip, Popup } from 'react-leaflet';
import { useAppStore } from '@/store';
import { getSectorPolygonStyle, isSectorBlindSpot } from './mapUtils';
import { Radio, AlertTriangle, Waves } from 'lucide-react';

export const SectorPolygonLayer: React.FC = () => {
  const sectors = useAppStore((state) => state.sectors);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const incidents = useAppStore((state) => state.incidents);

  return (
    <>
      {sectors.map((sector) => {
        const style = getSectorPolygonStyle(sector, timelinePhase, incidents);
        const isBlindSpot = isSectorBlindSpot(sector, timelinePhase, incidents);

        return (
          <Polygon
            key={sector.id}
            positions={sector.bounds}
            pathOptions={{
              color: style.color,
              weight: style.weight,
              opacity: style.opacity,
              fillColor: style.fillColor,
              fillOpacity: style.fillOpacity,
              dashArray: style.dashArray,
              className: style.className,
            }}
          >
            <Tooltip
              sticky
              direction="center"
              className="tactical-sector-tooltip bg-surface-1/90 border border-hairline text-ink text-xs font-mono px-2 py-1 rounded shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-1.5 font-bold">
                {isBlindSpot && (
                  <span className="w-2 h-2 rounded-full bg-semantic-blind-spot animate-ping" />
                )}
                <span>{sector.name}</span>
                {isBlindSpot && (
                  <span className="text-[10px] text-semantic-blind-spot-text font-mono font-semibold">
                    [BLIND SPOT]
                  </span>
                )}
              </div>
            </Tooltip>

            <Popup className="tactical-sector-popup">
              <div className="p-3 text-ink font-sans space-y-2 min-w-[220px]">
                <div className="flex items-center justify-between border-b border-hairline pb-2">
                  <div className="font-bold text-sm text-ink">{sector.name}</div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-2 border border-hairline text-ink-muted">
                    {sector.id}
                  </span>
                </div>

                {isBlindSpot && (
                  <div className="p-2 rounded bg-semantic-blind-spot/15 border border-semantic-blind-spot-border text-semantic-blind-spot-text text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-bold">COVERAGE BLIND SPOT</div>
                      <div className="text-[11px] opacity-90">Telecom tower down &gt;90m. Recon sweep needed.</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-surface-2 border border-hairline">
                    <span className="text-[10px] text-ink-subtle block uppercase font-mono">Elevation</span>
                    <span className="font-mono font-semibold text-ink">{sector.elevationMeters}m</span>
                  </div>
                  <div className="p-2 rounded bg-surface-2 border border-hairline">
                    <span className="text-[10px] text-ink-subtle block uppercase font-mono">Flood Gauge</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-ink">
                      <Waves className="w-3 h-3 text-brand" />
                      <span>{sector.floodGauge.levelMeters}m</span>
                      <span className="text-[10px] text-ink-subtle uppercase">({sector.floodGauge.trend})</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded bg-surface-2 border border-hairline flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-ink-subtle" />
                    <span className="font-mono text-ink-muted">{sector.cellTower.id}</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                      sector.cellTower.status === 'online'
                        ? 'bg-semantic-success/20 text-semantic-success-text border border-semantic-success-border'
                        : 'bg-semantic-critical/20 text-semantic-critical-text border border-semantic-critical-border'
                    }`}
                  >
                    {sector.cellTower.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </>
  );
};
