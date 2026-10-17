'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  HardDriveDownload,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  isOnline,
  getOfflineQueue,
  subscribeOnlineStatus,
  subscribeOfflineQueue,
  syncOfflineQueue,
  QueuedSubmission,
  registerServiceWorker,
} from '@/lib/pwa';
import { useAppStore } from '@/store';

interface PwaOfflineBannerProps {
  compact?: boolean;
}

export function PwaOfflineBanner({ compact = false }: PwaOfflineBannerProps) {
  const [online, setOnline] = useState<boolean>(true);
  const [queue, setQueue] = useState<QueuedSubmission[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  const submitIncident = useAppStore((state) => state.submitIncident);

  const handleSync = useCallback(() => {
    const currentQueue = getOfflineQueue();
    if (currentQueue.length === 0) return;

    setIsSyncing(true);
    setLastSyncResult(null);

    try {
      const result = syncOfflineQueue((submission) => {
        submitIncident({
          reportText: submission.reportText,
          sectorId: submission.sectorId,
          reporterType: submission.reporterType,
          phoneAccess: submission.phoneAccess,
          factors: submission.factors,
          reportTranslation: submission.reportTranslation,
          coordinates: submission.coordinates,
        });
      });

      if (result.syncedCount > 0) {
        setLastSyncResult(`Synced ${result.syncedCount} report${result.syncedCount > 1 ? 's' : ''}`);
        setTimeout(() => setLastSyncResult(null), 4000);
      }
    } finally {
      setIsSyncing(false);
      setQueue(getOfflineQueue());
    }
  }, [submitIncident]);

  // Initialize service worker & online/offline listeners
  useEffect(() => {
    registerServiceWorker();

    setOnline(isOnline());
    setQueue(getOfflineQueue());

    const unsubOnline = subscribeOnlineStatus((newOnline) => {
      setOnline(newOnline);
      if (newOnline) {
        // Auto-sync when transitioning from offline to online
        handleSync();
      }
    });

    const unsubQueue = subscribeOfflineQueue((newQueue) => {
      setQueue(newQueue);
    });

    return () => {
      unsubOnline();
      unsubQueue();
    };
  }, [handleSync]);

  // If online and no queued items and no sync message, render nothing or compact status
  if (online && queue.length === 0 && !lastSyncResult) {
    if (compact) return null;
    return (
      <div
        data-testid="pwa-status-online"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-surface-2 border border-hairline text-semantic-success-text"
      >
        <Wifi className="w-3.5 h-3.5" />
        <span>PWA ONLINE</span>
      </div>
    );
  }

  return (
    <div
      data-testid="pwa-offline-banner"
      className={`rounded-lg border transition-all flex items-center justify-between gap-3 text-xs font-mono ${
        !online
          ? 'bg-semantic-warning/15 border-semantic-warning-border text-semantic-warning-text p-2.5 sm:px-4'
          : 'bg-surface-2 border-brand/40 text-ink p-2 sm:px-3'
      }`}
    >
      <div className="flex items-center gap-2">
        {!online ? (
          <WifiOff className="w-4 h-4 text-semantic-warning animate-pulse shrink-0" />
        ) : lastSyncResult ? (
          <CheckCircle2 className="w-4 h-4 text-semantic-success-text shrink-0" />
        ) : (
          <HardDriveDownload className="w-4 h-4 text-brand shrink-0" />
        )}

        <div>
          <span className="font-bold uppercase tracking-wider block sm:inline mr-2">
            {!online ? 'OFFLINE FIELD MODE' : 'CONNECTION RESTORED'}
          </span>
          <span className="text-[11px] text-ink-muted">
            {!online
              ? queue.length > 0
                ? `${queue.length} report${queue.length > 1 ? 's' : ''} queued locally in storage`
                : 'Submissions will queue locally until reconnected'
              : lastSyncResult || `${queue.length} pending reports`}
          </span>
        </div>
      </div>

      {queue.length > 0 && online && (
        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="px-2.5 py-1 rounded bg-brand hover:bg-brand-hover text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Sync Now ({queue.length})</span>
        </button>
      )}
    </div>
  );
}
