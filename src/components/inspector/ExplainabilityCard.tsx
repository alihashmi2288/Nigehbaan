'use client';

import React from 'react';
import { Incident } from '@/types';
import { generateExplainabilityRationale } from '@/lib/triage/explainabilityGenerator';
import {
  FileText,
  CheckCircle,
  Lightbulb,
  Sparkles,
  Quote,
  ShieldCheck,
} from 'lucide-react';

interface ExplainabilityCardProps {
  incident: Incident;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ incident }) => {
  const rationale = generateExplainabilityRationale(incident);

  return (
    <div className="bg-surface-1 border border-hairline rounded-lg p-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-brand" />
          <h3 className="text-xs font-mono font-bold tracking-tight text-ink uppercase">
            Auditable Triage Rationale
          </h3>
        </div>

        {/* Provenance Honesty Badge (Invariant 7) */}
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3 border border-hairline text-ink-muted flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-brand" />
          Deterministic Rule Engine
        </span>
      </div>

      {/* Primary Urgency Driver Capsule */}
      <div className="flex items-center gap-2 p-2 rounded bg-surface-2 border border-hairline text-xs font-mono">
        <span className="text-[10px] uppercase text-ink-subtle shrink-0">Primary Driver:</span>
        <span className="font-semibold text-ink truncate">{rationale.primaryDriver}</span>
      </div>

      {/* Rationale Bullet Points */}
      <div className="space-y-2">
        {rationale.bullets.map((bullet, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 text-xs text-ink-muted leading-relaxed"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
            <p className="font-sans">{bullet}</p>
          </div>
        ))}
      </div>

      {/* Quoted Evidence / Provenance Translation */}
      {incident.reportTranslation && (
        <div className="mt-3 pt-3 border-t border-hairline space-y-1">
          <span className="text-[10px] font-mono uppercase text-ink-subtle flex items-center gap-1">
            <Quote className="w-2.5 h-2.5" />
            Extracted Citizen Ground-Truth Evidence
          </span>
          <blockquote className="p-2.5 rounded bg-surface-2 border-l-2 border-brand font-mono text-[11px] text-ink-muted italic">
            &ldquo;{incident.reportTranslation}&rdquo;
          </blockquote>
        </div>
      )}
    </div>
  );
};
