'use client';

import React, { useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { useAppStore } from '@/store';

interface ResetButtonProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * 1-Click Simulation Reset Button.
 * Conforms to Invariant 8 and Acceptance Test 1.9:
 * Restores pristine baseline District Alpha seed data in localStorage (<10ms),
 * clears all dirty assignments, and returns the timeline to T-0 Early Warning.
 */
export function ResetButton({ className = '', showLabel = true }: ResetButtonProps) {
  const resetSimulation = useAppStore((state) => state.resetSimulation);
  const [justReset, setJustReset] = useState(false);

  const handleReset = () => {
    resetSimulation();
    setJustReset(true);
    setTimeout(() => {
      setJustReset(false);
    }, 1800);
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      aria-label="Reset simulation to pristine District Alpha baseline"
      title="1-Click Simulation Reset (Restores baseline at T-0)"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 focus:ring-offset-canvas cursor-pointer select-none ${
        justReset
          ? 'bg-semantic-success/15 border-semantic-success text-semantic-success-text'
          : 'bg-surface-2 hover:bg-surface-3 border-hairline hover:border-hairline-strong text-ink-muted hover:text-ink'
      } ${className}`}
    >
      {justReset ? (
        <>
          <Check className="w-3.5 h-3.5 text-semantic-success animate-in zoom-in-50 duration-150" />
          {showLabel && <span>Reset to T-0 (Baseline)</span>}
        </>
      ) : (
        <>
          <RotateCcw className="w-3.5 h-3.5 text-ink-muted group-hover:rotate-45 transition-transform" />
          {showLabel && <span>Reset Simulation</span>}
        </>
      )}
    </button>
  );
}
