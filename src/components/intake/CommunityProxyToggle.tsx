'use client';

import React from 'react';
import { Users, PhoneOff, Phone, SignalZero, ShieldAlert, Check } from 'lucide-react';
import { PhoneAccessStatus, ReporterType } from '@/types';

interface CommunityProxyToggleProps {
  isProxy: boolean;
  onProxyChange: (isProxy: boolean) => void;
  phoneAccess: PhoneAccessStatus;
  onPhoneAccessChange: (status: PhoneAccessStatus) => void;
  proxyReporterName?: string;
  onProxyReporterNameChange?: (name: string) => void;
}

export function CommunityProxyToggle({
  isProxy,
  onProxyChange,
  phoneAccess,
  onPhoneAccessChange,
  proxyReporterName = '',
  onProxyReporterNameChange,
}: CommunityProxyToggleProps) {
  return (
    <div className="space-y-3.5 bg-surface-2 border border-hairline rounded-lg p-3.5">
      {/* Community Proxy Switch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded border flex items-center justify-center transition-colors ${
              isProxy
                ? 'bg-brand/20 border-brand text-brand'
                : 'bg-surface-3 border-hairline text-ink-muted'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-ink flex items-center gap-2">
              Community Proxy Report
              {isProxy && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-brand/20 text-brand border border-brand/30">
                  PROXY ACTIVE
                </span>
              )}
            </div>
            <p className="text-[11px] text-ink-muted">
              Reporting on behalf of a trapped neighbor, elder, or relative
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isProxy}
          onClick={() => onProxyChange(!isProxy)}
          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface-1 ${
            isProxy ? 'bg-brand' : 'bg-surface-4'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isProxy ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Proxy Name Input (Conditional) */}
      {isProxy && onProxyReporterNameChange && (
        <div className="pt-1 space-y-1">
          <label className="text-[11px] font-mono text-ink-subtle uppercase block">
            Proxy Reporter Identification (Optional)
          </label>
          <input
            type="text"
            value={proxyReporterName}
            onChange={(e) => onProxyReporterNameChange(e.target.value)}
            placeholder="e.g. Neighbor, Community Volunteer, Local Elder"
            className="w-full bg-surface-1 border border-hairline rounded px-2.5 py-1.5 text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-brand"
          />
        </div>
      )}

      {/* Phone Access Status Selector */}
      <div className="space-y-1.5 pt-1 border-t border-hairline">
        <label className="text-[11px] font-mono text-ink-subtle uppercase block">
          Victim Cellular Connectivity Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Has Phone */}
          <button
            type="button"
            onClick={() => onPhoneAccessChange('has_phone')}
            className={`px-2 py-2 rounded text-xs font-mono flex flex-col items-center gap-1 border transition-all ${
              phoneAccess === 'has_phone'
                ? 'bg-surface-3 text-semantic-success-text border-semantic-success-border font-bold'
                : 'bg-surface-1 hover:bg-surface-3 text-ink-muted border-hairline'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="text-[10px]">Has Phone</span>
          </button>

          {/* No Phone */}
          <button
            type="button"
            onClick={() => onPhoneAccessChange('no_phone')}
            className={`px-2 py-2 rounded text-xs font-mono flex flex-col items-center gap-1 border transition-all ${
              phoneAccess === 'no_phone'
                ? 'bg-semantic-warning/20 text-semantic-warning-text border-semantic-warning-border font-bold shadow-sm'
                : 'bg-surface-1 hover:bg-surface-3 text-ink-muted border-hairline'
            }`}
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="text-[10px]">No Phone</span>
          </button>

          {/* Network Down */}
          <button
            type="button"
            onClick={() => onPhoneAccessChange('network_down')}
            className={`px-2 py-2 rounded text-xs font-mono flex flex-col items-center gap-1 border transition-all ${
              phoneAccess === 'network_down'
                ? 'bg-semantic-blind-spot/20 text-semantic-blind-spot-text border-semantic-blind-spot-border font-bold'
                : 'bg-surface-1 hover:bg-surface-3 text-ink-muted border-hairline'
            }`}
          >
            <SignalZero className="w-3.5 h-3.5" />
            <span className="text-[10px]">Network Down</span>
          </button>
        </div>
      </div>

      {/* Invariant 3 & Acceptance Test 1.3: No-Phone Floor Alert Banner */}
      {phoneAccess === 'no_phone' && (
        <div className="p-2.5 rounded bg-semantic-warning/10 border border-semantic-warning-border/40 text-semantic-warning-text flex items-start gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-semantic-warning" />
          <div className="space-y-0.5">
            <span className="font-bold font-mono text-[11px] block">
              INVARIANT 3: VULNERABILITY FLOOR ENFORCED
            </span>
            <p className="text-[11px] opacity-90 leading-relaxed">
              Because victim lacks phone access, Evacuation Inability is locked at{' '}
              <strong className="underline">f₃ ≥ 4.0</strong>. Score floor guarantees priority
              even if other details are sparse.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
