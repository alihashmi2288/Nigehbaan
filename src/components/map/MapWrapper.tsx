'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Radio } from 'lucide-react';

const TacticalMap = dynamic(
  () => import('./TacticalMap').then((mod) => mod.TacticalMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] rounded-lg border border-hairline bg-surface-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="w-12 h-12 rounded-full border border-brand bg-brand/10 flex items-center justify-center text-brand animate-pulse">
          <Radio className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <div className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
            Initializing GIS Tactical Coordinate Engine
          </div>
          <div className="font-mono text-[11px] text-ink-subtle">
            Loading CartoDB Dark Matter tiles & District Alpha sector polygons...
          </div>
        </div>
      </div>
    ),
  }
);

export const MapWrapper: React.FC = () => {
  return <TacticalMap />;
};
