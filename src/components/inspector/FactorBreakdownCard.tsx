'use client';

import React from 'react';
import { Incident, IncidentFactors } from '@/types';
import { FACTOR_WEIGHTS } from '@/lib/triage/scoringEngine';
import {
  ShieldAlert,
  HeartPulse,
  Accessibility,
  Waves,
  Users,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Calculator,
} from 'lucide-react';

interface FactorBreakdownCardProps {
  incident: Incident;
}

interface FactorMeta {
  index: number;
  label: string;
  weight: number;
  icon: React.ReactNode;
  description: string;
}

const FACTORS_META: FactorMeta[] = [
  {
    index: 0,
    label: 'Immediate Threat to Life',
    weight: FACTOR_WEIGHTS[0],
    icon: <ShieldAlert className="w-3.5 h-3.5 text-semantic-critical-text" />,
    description: 'Drowning risk, fast water current, structural collapse',
  },
  {
    index: 1,
    label: 'Medical Urgency',
    weight: FACTOR_WEIGHTS[1],
    icon: <HeartPulse className="w-3.5 h-3.5 text-semantic-critical-text" />,
    description: 'Hemodialysis, oxygen dependency, trauma, hemorrhage',
  },
  {
    index: 2,
    label: 'Evacuation Inability',
    weight: FACTOR_WEIGHTS[2],
    icon: <Accessibility className="w-3.5 h-3.5 text-semantic-warning-text" />,
    description: 'Bedridden, elderly alone, unaccompanied children, no phone',
  },
  {
    index: 3,
    label: 'Environmental Danger',
    weight: FACTOR_WEIGHTS[3],
    icon: <Waves className="w-3.5 h-3.5 text-brand" />,
    description: 'Flood depth, water velocity, severed road access',
  },
  {
    index: 4,
    label: 'Population Affected',
    weight: FACTOR_WEIGHTS[4],
    icon: <Users className="w-3.5 h-3.5 text-semantic-success-text" />,
    description: 'Headcount of trapped or at-risk individuals',
  },
];

export const FactorBreakdownCard: React.FC<FactorBreakdownCardProps> = ({ incident }) => {
  const factors: IncidentFactors = incident.factors;

  // Compute known factors and weight sum
  let knownWeightSum = 0;
  let knownCount = 0;
  const factorRows = FACTORS_META.map((meta) => {
    const rawVal = factors[meta.index];
    const isKnown = rawVal !== null;
    if (isKnown) {
      knownCount += 1;
      knownWeightSum += meta.weight;
    }
    return {
      ...meta,
      value: rawVal,
      isKnown,
    };
  });

  const confidencePercent = Math.round(knownWeightSum * 100);
  const unknownCount = 5 - knownCount;

  // Build arithmetic formula string
  const formulaTerms = factorRows
    .filter((f) => f.isKnown)
    .map((f) => `(${f.weight.toFixed(2)} × ${f.value!.toFixed(1)})`)
    .join(' + ');

  const formulaDenominator = knownWeightSum.toFixed(2);
  const finalScoreStr =
    incident.score !== undefined
      ? incident.score.toFixed(1)
      : incident.expectedScore !== undefined
      ? incident.expectedScore.toFixed(1)
      : '0.0';

  return (
    <div className="bg-surface-1 border border-hairline rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-brand" />
          <h3 className="text-xs font-mono font-bold tracking-tight text-ink uppercase">
            MCDA 5-Factor Mathematical Breakdown
          </h3>
        </div>

        {/* Confidence Badge */}
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1.5 border ${
            confidencePercent === 100
              ? 'bg-semantic-success/15 border-semantic-success-border text-semantic-success-text'
              : 'bg-semantic-warning/15 border-semantic-warning-border text-semantic-warning-text'
          }`}
        >
          {confidencePercent === 100 ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          Confidence: {confidencePercent}% ({knownCount}/5 known)
        </span>
      </div>

      {/* Mathematical Substitution Formula */}
      <div className="bg-surface-2 border border-hairline rounded p-2.5 font-mono text-[11px] text-ink-muted space-y-1">
        <div className="text-[10px] uppercase text-ink-subtle tracking-wider flex items-center justify-between">
          <span>Formula: 100 × [ Σ (wᵢ · fᵢ / 5.0) ] / Σ wᵢ</span>
          <span className="text-brand font-semibold">100% Deterministic</span>
        </div>
        <div className="text-ink break-all font-semibold leading-relaxed">
          100 × [ ({formulaTerms}) / 5.0 ] / {formulaDenominator} ={' '}
          <span className="text-brand text-xs font-bold">{finalScoreStr}</span>
        </div>
      </div>

      {/* Renormalization Alert Banner if any unknown */}
      {unknownCount > 0 && (
        <div className="p-2.5 rounded bg-semantic-warning/10 border border-semantic-warning-border/40 text-semantic-warning-text text-xs font-mono flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-semantic-warning-text" />
          <div className="space-y-0.5">
            <span className="font-bold">
              {unknownCount} of 5 factors unknown — weights renormalized across known criteria.
            </span>
            <p className="text-[11px] text-ink-muted">
              Safety Invariant: Missing telemetry is treated as unverified, never zero. Priority reflects verified crisis severity.
            </p>
          </div>
        </div>
      )}

      {/* 5 Factor Progress Bars */}
      <div className="space-y-3">
        {factorRows.map((row) => {
          const isKnown = row.isKnown;
          const score = row.value ?? 0;
          const pct = isKnown ? Math.min(100, Math.max(0, (score / 5.0) * 100)) : 0;
          
          // Contribution points: (w_i * f_i / 5.0) / sum_known_w * 100
          const pointsContribution = isKnown && knownWeightSum > 0
            ? ((row.weight * (score / 5.0)) / knownWeightSum) * 100
            : 0;

          // Color for progress fill
          let barColor = 'bg-semantic-success';
          if (score >= 4.0) {
            barColor = 'bg-semantic-critical';
          } else if (score >= 3.0) {
            barColor = 'bg-semantic-warning';
          } else if (score >= 1.5) {
            barColor = 'bg-brand';
          }

          return (
            <div key={row.index} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  {row.icon}
                  <span className="font-semibold text-ink">{row.label}</span>
                  <span className="text-[10px] text-ink-subtle">(w={row.weight.toFixed(2)})</span>
                </div>

                <div className="flex items-center gap-2">
                  {isKnown ? (
                    <>
                      <span className="font-bold text-ink">
                        {score.toFixed(1)} <span className="text-ink-subtle text-[10px]">/ 5.0</span>
                      </span>
                      <span className="text-[10px] text-brand bg-brand/10 border border-brand/20 px-1.5 py-0.2 rounded font-semibold">
                        +{pointsContribution.toFixed(1)} pts
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded border border-dashed border-hairline-strong text-semantic-unknown-text bg-surface-3">
                      Unknown — weight renormalized
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar track */}
              <div
                className={`w-full h-2 rounded overflow-hidden bg-surface-3 border ${
                  isKnown ? 'border-hairline' : 'border-dashed border-hairline-strong'
                }`}
              >
                {isKnown ? (
                  <div
                    className={`h-full ${barColor} transition-all duration-300 rounded-sm`}
                    style={{ width: `${pct}%` }}
                  />
                ) : (
                  <div className="h-full w-full bg-semantic-unknown/20" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
