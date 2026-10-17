'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore, selectRankedVisibleIncidents } from '@/store';
import { IncidentCard } from './IncidentCard';
import { PriorityCategory } from '@/types';
import {
  Search,
  Filter,
  X,
  ShieldAlert,
  SlidersHorizontal,
  Flame,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const IncidentQueue: React.FC = () => {
  const incidents = useAppStore((state) => state.incidents);
  const timelinePhase = useAppStore((state) => state.timelinePhase);
  const selectedIncidentId = useAppStore((state) => state.selectedIncidentId);
  const setSelectedIncidentId = useAppStore((state) => state.setSelectedIncidentId);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [uncertaintyFilter, setUncertaintyFilter] = useState<'all' | 'uncertain' | 'unmapped'>('all');

  // Deterministically ranked visible incidents at current timeline phase
  const rankedVisibleIncidents = useMemo(
    () => selectRankedVisibleIncidents(incidents, timelinePhase),
    [incidents, timelinePhase]
  );

  // Apply coordinator filters
  const filteredIncidents = useMemo(() => {
    return rankedVisibleIncidents.filter((incident) => {
      // Sector filter
      if (sectorFilter !== 'all' && incident.sectorId !== sectorFilter) {
        return false;
      }

      // Priority category filter
      if (categoryFilter !== 'all' && incident.category !== categoryFilter) {
        return false;
      }

      // Uncertainty filter
      if (uncertaintyFilter === 'uncertain') {
        const hasFlags = incident.uncertaintyFlags.length > 0;
        const lowConfidence = incident.confidence !== undefined && incident.confidence < 1.0;
        const missingLoc = !incident.coordinates;
        if (!hasFlags && !lowConfidence && !missingLoc) return false;
      } else if (uncertaintyFilter === 'unmapped') {
        if (incident.coordinates !== null) return false;
      }

      // Search query filter (matches code, report text, sector, reporterType)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = incident.code.toLowerCase().includes(q);
        const matchesText = incident.reportText.toLowerCase().includes(q);
        const matchesSector = incident.sectorId.toLowerCase().includes(q);
        const matchesReporter = incident.reporterType.toLowerCase().includes(q);
        const matchesTranslation =
          incident.reportTranslation?.toLowerCase().includes(q) ?? false;

        if (
          !matchesCode &&
          !matchesText &&
          !matchesSector &&
          !matchesReporter &&
          !matchesTranslation
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    rankedVisibleIncidents,
    sectorFilter,
    categoryFilter,
    uncertaintyFilter,
    searchQuery,
  ]);

  const hasActiveFilters =
    sectorFilter !== 'all' ||
    categoryFilter !== 'all' ||
    uncertaintyFilter !== 'all' ||
    searchQuery.trim().length > 0;

  const clearFilters = () => {
    setSearchQuery('');
    setSectorFilter('all');
    setCategoryFilter('all');
    setUncertaintyFilter('all');
  };

  const criticalCount = rankedVisibleIncidents.filter((i) => i.category === 'Critical').length;
  const highCount = rankedVisibleIncidents.filter((i) => i.category === 'High').length;

  return (
    <section className="bg-surface-1 border border-hairline rounded-lg flex flex-col h-full max-h-[850px] overflow-hidden shadow-xl">
      {/* Queue Header */}
      <div className="p-3.5 border-b border-hairline space-y-3 shrink-0 bg-surface-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold tracking-tight text-ink uppercase font-mono">
              Triage Incident Queue
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-3 border border-hairline text-ink-muted">
              {filteredIncidents.length} / {rankedVisibleIncidents.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-semantic-critical/15 border border-semantic-critical-border text-semantic-critical-text flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {criticalCount} Critical
              </span>
            )}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-2 py-0.5 rounded text-[11px] font-mono text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors flex items-center gap-1 border border-transparent hover:border-hairline"
              >
                <X className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code (NG-101), sector, or facts..."
            className="w-full pl-9 pr-8 py-1.5 rounded text-xs font-mono bg-surface-2 border border-hairline focus:border-brand focus:outline-none text-ink placeholder:text-ink-subtle transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tactical Filter Selectors */}
        <div className="grid grid-cols-3 gap-2">
          {/* Sector Select */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-2 py-1.5 rounded text-xs font-mono bg-surface-2 border border-hairline text-ink focus:border-brand focus:outline-none cursor-pointer"
          >
            <option value="all">All Sectors</option>
            <option value="sector-1">Sector 1</option>
            <option value="sector-2">Sector 2</option>
            <option value="sector-3a">Sector 3A</option>
            <option value="sector-4">Sector 4</option>
          </select>

          {/* Category Select */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2 py-1.5 rounded text-xs font-mono bg-surface-2 border border-hairline text-ink focus:border-brand focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical (≥75)</option>
            <option value="High">High (55–74.9)</option>
            <option value="Moderate">Moderate (35–54.9)</option>
            <option value="Low">Low (&lt;35)</option>
          </select>

          {/* Uncertainty Filter */}
          <select
            value={uncertaintyFilter}
            onChange={(e) => setUncertaintyFilter(e.target.value as any)}
            className="px-2 py-1.5 rounded text-xs font-mono bg-surface-2 border border-hairline text-ink focus:border-brand focus:outline-none cursor-pointer"
          >
            <option value="all">All Uncertainty</option>
            <option value="uncertain">Flagged Uncertainty</option>
            <option value="unmapped">Unmapped Location</option>
          </select>
        </div>
      </div>

      {/* Queue Body List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-surface-3">
        {filteredIncidents.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-4 rounded border border-dashed border-hairline bg-surface-2/40">
            <SlidersHorizontal className="w-6 h-6 text-ink-subtle mb-2 opacity-50" />
            <p className="text-xs font-mono font-medium text-ink">
              No matching incidents found
            </p>
            <p className="text-[11px] text-ink-subtle mt-1 max-w-[220px]">
              Try adjusting your sector, category, or search filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 px-2.5 py-1 rounded text-xs font-mono bg-surface-3 hover:bg-surface-4 text-ink border border-hairline transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              isSelected={incident.id === selectedIncidentId}
              onSelect={() => setSelectedIncidentId(incident.id)}
            />
          ))
        )}
      </div>

      {/* Queue Footer Status */}
      <div className="px-3 py-2 border-t border-hairline bg-surface-1 text-[11px] font-mono text-ink-subtle flex items-center justify-between shrink-0">
        <span>Deterministic 3-Tier Sort Active</span>
        <span>Phase: {timelinePhase}</span>
      </div>
    </section>
  );
};
