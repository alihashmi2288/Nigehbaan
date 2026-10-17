/**
 * Nigehbaan PWA Offline Submission Queue
 * Intercepts incident reports when offline, queues them in localStorage,
 * and auto-synchronizes to the active dashboard store when reconnected.
 */

import { IncidentFactors, PhoneAccessStatus, ReporterType } from '@/types';

export const OFFLINE_QUEUE_STORAGE_KEY = 'nigehbaan_offline_queue';
export const OFFLINE_QUEUED_MESSAGE = 'Report queued locally (offline mode)';

export interface QueuedSubmission {
  id: string;
  timestamp: string;
  reportText: string;
  sectorId: string;
  reporterType: ReporterType;
  phoneAccess: PhoneAccessStatus;
  factors: IncidentFactors;
  reportTranslation?: string | null;
  coordinates: [number, number] | null;
  status: 'pending' | 'synced';
}

export interface SyncResult {
  syncedCount: number;
  failedCount: number;
  syncedIds: string[];
}

/**
 * Checks whether the client currently has network connectivity.
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true;
  }
  return navigator.onLine;
}

const memoryStorage = new Map<string, string>();

function getStorageItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  }
  return memoryStorage.get(key) ?? null;
}

function setStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch {
      memoryStorage.set(key, value);
      return;
    }
  }
  memoryStorage.set(key, value);
}

/**
 * Retrieves all queued offline submissions from storage.
 */
export function getOfflineQueue(): QueuedSubmission[] {
  try {
    const raw = getStorageItem(OFFLINE_QUEUE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[OfflineQueue] Error reading from storage:', err);
    return [];
  }
}

/**
 * Persists the offline submission queue to storage and dispatches change event.
 */
function saveOfflineQueue(queue: QueuedSubmission[]): void {
  try {
    setStorageItem(OFFLINE_QUEUE_STORAGE_KEY, JSON.stringify(queue));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nigehbaan_offline_queue_changed', { detail: queue }));
    }
  } catch (err) {
    console.warn('[OfflineQueue] Error saving to storage:', err);
  }
}

/**
 * Enqueues an incident submission locally when network is offline.
 */
export function enqueueOfflineSubmission(
  submission: Omit<QueuedSubmission, 'id' | 'timestamp' | 'status'>
): QueuedSubmission {
  const queue = getOfflineQueue();
  const newEntry: QueuedSubmission = {
    ...submission,
    id: `OFFLINE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  queue.push(newEntry);
  saveOfflineQueue(queue);
  console.log('[OfflineQueue] Enqueued report:', newEntry.id, OFFLINE_QUEUED_MESSAGE);
  return newEntry;
}

/**
 * Removes a specific submission from the offline queue.
 */
export function removeOfflineSubmission(id: string): void {
  const queue = getOfflineQueue();
  const filtered = queue.filter((item) => item.id !== id);
  saveOfflineQueue(filtered);
}

/**
 * Clears all pending offline submissions.
 */
export function clearOfflineQueue(): void {
  saveOfflineQueue([]);
}

/**
 * Drains and synchronizes all pending offline reports into the live application store.
 */
export function syncOfflineQueue(
  submitHandler: (submission: QueuedSubmission) => any
): SyncResult {
  const queue = getOfflineQueue();
  const pending = queue.filter((item) => item.status === 'pending');

  if (pending.length === 0) {
    return { syncedCount: 0, failedCount: 0, syncedIds: [] };
  }

  const syncedIds: string[] = [];
  let failedCount = 0;

  for (const item of pending) {
    try {
      submitHandler(item);
      syncedIds.push(item.id);
    } catch (err) {
      console.error('[OfflineQueue] Failed to sync item:', item.id, err);
      failedCount++;
    }
  }

  // Remove successfully synced items from queue
  const remaining = queue.filter((item) => !syncedIds.includes(item.id));
  saveOfflineQueue(remaining);

  return {
    syncedCount: syncedIds.length,
    failedCount,
    syncedIds,
  };
}

/**
 * Subscribes to browser online/offline network status changes.
 */
export function subscribeOnlineStatus(callback: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Subscribes to changes in the offline queue (e.g. enqueuing or syncing).
 */
export function subscribeOfflineQueue(callback: (queue: QueuedSubmission[]) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleCustomEvent = (event: Event) => {
    const custom = event as CustomEvent<QueuedSubmission[]>;
    callback(custom.detail || getOfflineQueue());
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === OFFLINE_QUEUE_STORAGE_KEY) {
      callback(getOfflineQueue());
    }
  };

  window.addEventListener('nigehbaan_offline_queue_changed', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener('nigehbaan_offline_queue_changed', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
