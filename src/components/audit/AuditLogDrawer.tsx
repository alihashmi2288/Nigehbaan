'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  History,
  Shield,
  Filter,
  Search,
  CheckCircle2,
  Radio,
  Clock,
  RotateCcw,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { AuditLogEntry } from '@/types';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ isOpen, onClose }) => {
  const activityLogs = useAppStore((state) => state.activityLogs);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      if (filterAction !== 'ALL' && log.action !== filterAction) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDetails = log.details.toLowerCase().includes(query);
        const matchesAction = log.action.toLowerCase().includes(query);
        const matchesIncident = log.incidentId?.toLowerCase().includes(query);
        const matchesResource = log.resourceId?.toLowerCase().includes(query);
        return matchesDetails || matchesAction || matchesIncident || matchesResource;
      }
      return true;
    });
  }, [activityLogs, filterAction, searchQuery]);

  if (!isOpen) return null;

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case 'COORDINATOR_ASSIGN':
        return 'bg-brand/15 text-brand border-brand/30';
      case 'COORDINATOR_UNASSIGN':
        return 'bg-semantic-critical/15 text-semantic-critical-text border-semantic-critical-border';
      case 'BLIND_SPOT_SYNTHESIS':
        return 'bg-semantic-blind-spot/15 text-semantic-blind-spot-text border-semantic-blind-spot-border';
      case 'TIMELINE_PHASE_ADVANCED':
        return 'bg-surface-3 text-ink-muted border-hairline';
      case 'INCIDENT_REPORTED':
        return 'bg-semantic-success/15 text-semantic-success-text border-semantic-success-border';
      case 'SIMULATION_RESET':
        return 'bg-semantic-warning/15 text-semantic-warning-text border-semantic-warning-border';
      default:
        return 'bg-surface-3 text-ink-subtle border-hairline';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'COORDINATOR_ASSIGN':
        return <CheckCircle2 className="w-3 h-3 text-brand" />;
      case 'COORDINATOR_UNASSIGN':
        return <RotateCcw className="w-3 h-3 text-semantic-critical-text" />;
      case 'BLIND_SPOT_SYNTHESIS':
        return <Radio className="w-3 h-3 text-semantic-blind-spot-text animate-pulse" />;
      case 'TIMELINE_PHASE_ADVANCED':
        return <Clock className="w-3 h-3 text-ink-muted" />;
      case 'INCIDENT_REPORTED':
        return <PlusCircle className="w-3 h-3 text-semantic-success-text" />;
      case 'SIMULATION_RESET':
        return <RotateCcw className="w-3 h-3 text-semantic-warning-text" />;
      default:
        return <FileText className="w-3 h-3 text-ink-subtle" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-drawer-title"
      data-testid="audit-log-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-surface-1 border-l border-hairline h-full flex flex-col shadow-2xl z-10 font-sans">
        {/* Header */}
        <div className="px-5 py-4 border-b border-hairline bg-surface-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 id="audit-drawer-title" className="text-sm font-mono font-bold text-ink">
                Operational Activity Audit Log
              </h2>
              <span className="text-[11px] font-mono text-ink-subtle">
                Immutable chronological log of coordinator dispatches, timeline events, and blind spots
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-ink-muted hover:text-ink hover:bg-surface-3 transition-colors"
            aria-label="Close audit log"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-hairline bg-surface-2/50 space-y-3 font-mono text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs by keyword, incident code (e.g. NG-101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded bg-surface-1 border border-hairline text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {[
              { id: 'ALL', label: 'All Records' },
              { id: 'COORDINATOR_ASSIGN', label: 'Dispatches' },
              { id: 'BLIND_SPOT_SYNTHESIS', label: 'Blind Spots' },
              { id: 'TIMELINE_PHASE_ADVANCED', label: 'Timeline' },
              { id: 'INCIDENT_REPORTED', label: 'Intakes' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterAction(btn.id)}
                className={`px-2.5 py-1 rounded transition-colors border ${
                  filterAction === btn.id
                    ? 'bg-brand/20 border-brand text-brand font-bold'
                    : 'bg-surface-1 border-hairline text-ink-muted hover:text-ink'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono text-xs scrollbar-thin scrollbar-thumb-surface-3">
          {filteredLogs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-ink-subtle gap-2">
              <FileText className="w-8 h-8 opacity-40" />
              <span>No activity log entries match the current filter.</span>
            </div>
          ) : (
            filteredLogs.map((entry) => {
              const formattedTime = new Date(entry.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  data-testid="audit-log-entry"
                  className="bg-surface-2 border border-hairline rounded-lg p-3 space-y-1.5 hover:border-hairline-strong transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getActionBadgeStyle(
                        entry.action
                      )}`}
                    >
                      {getActionIcon(entry.action)}
                      {entry.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-ink-subtle">{formattedTime}</span>
                  </div>

                  <p className="text-ink leading-relaxed break-words text-[11px]">
                    {entry.details}
                  </p>

                  {(entry.incidentId || entry.resourceId) && (
                    <div className="pt-1.5 border-t border-hairline flex items-center gap-3 text-[10px] text-ink-subtle">
                      {entry.incidentId && (
                        <span>
                          Incident Ref: <strong className="text-ink">{entry.incidentId}</strong>
                        </span>
                      )}
                      {entry.resourceId && (
                        <span>
                          Resource Ref: <strong className="text-ink">{entry.resourceId}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-hairline bg-surface-2 flex items-center justify-between text-[11px] font-mono text-ink-subtle">
          <span>Total Records: {activityLogs.length}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-surface-1 border border-hairline hover:bg-surface-3 text-ink transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
