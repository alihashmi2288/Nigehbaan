'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  AlertCircle,
  Sparkles,
  Bot,
  Cpu,
  MapPin,
  Send,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { CommunityProxyToggle } from './CommunityProxyToggle';
import {
  ExtractedFacts,
  ExtractionResult,
  PhoneAccessStatus,
  ReporterType,
  IncidentFactors,
} from '@/types';
import { useAppStore } from '@/store';
import { extractFactsWithHeuristics, OFFLINE_FALLBACK_BADGE } from '@/lib/ai/heuristicExtractor';
import { calculatePriorityScore } from '@/lib/triage/scoringEngine';

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SamplePreset {
  label: string;
  badge: string;
  text: string;
  sector: string;
  phone: PhoneAccessStatus;
  isProxy: boolean;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    label: 'Dialysis Emergency (NG-101)',
    badge: 'Critical 86.5',
    text: 'My father Syed Iqbal is on hemodialysis. Water is chest-deep inside our house. Generator submerged. Need boat immediately.',
    sector: 'sector-2',
    phone: 'has_phone',
    isProxy: false,
  },
  {
    label: 'Urdu Family on Roof (NG-102)',
    badge: 'Critical 81.0',
    text: 'چھت پر بیٹھے ہیں پانی بڑھ رہا ہے۔ دو چھوٹے بچے ساتھ ہیں چھت سے آوازیں آ رہی ہیں۔',
    sector: 'sector-3a',
    phone: 'has_phone',
    isProxy: false,
  },
  {
    label: 'No-Phone Proxy (NG-104)',
    badge: 'High 56.5',
    text: 'Reporting for neighbor: Auntie Khadija lives alone at House 14. She has no phone, water waist-deep, cannot walk.',
    sector: 'sector-2',
    phone: 'no_phone',
    isProxy: true,
  },
  {
    label: 'Factory Workers (NG-105)',
    badge: 'Moderate 39.5',
    text: 'Industrial area junction flooded. 14 factory workers stranded on container roof. No injuries, food running out.',
    sector: 'sector-4',
    phone: 'has_phone',
    isProxy: false,
  },
];

export function IntakeModal({ isOpen, onClose }: IntakeModalProps) {
  const submitIncident = useAppStore((state) => state.submitIncident);
  const setSelectedIncidentId = useAppStore((state) => state.setSelectedIncidentId);

  const [reportText, setReportText] = useState('');
  const [sectorId, setSectorId] = useState('sector-2');
  const [phoneAccess, setPhoneAccess] = useState<PhoneAccessStatus>('has_phone');
  const [isProxy, setIsProxy] = useState(false);
  const [proxyName, setProxyName] = useState('');

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [calculatedPreview, setCalculatedPreview] = useState<{
    score: number;
    category: string;
    noPhoneFloorApplied: boolean;
  } | null>(null);

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReportText('');
      setSectorId('sector-2');
      setPhoneAccess('has_phone');
      setIsProxy(false);
      setProxyName('');
      setExtractionResult(null);
      setCalculatedPreview(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: SamplePreset) => {
    setReportText(preset.text);
    setSectorId(preset.sector);
    setPhoneAccess(preset.phone);
    setIsProxy(preset.isProxy);
    setExtractionResult(null);
    setCalculatedPreview(null);
  };

  const handleRunExtraction = async () => {
    if (!reportText.trim()) return;

    setIsExtracting(true);
    setExtractionResult(null);
    setCalculatedPreview(null);

    const reporterType: ReporterType = isProxy ? 'community_proxy' : 'citizen';

    try {
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText,
          phoneAccess,
          sectorHint: sectorId,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: ExtractionResult = await res.json();
      setExtractionResult(data);

      // Compute deterministic score preview
      const scoring = calculatePriorityScore(data.factors, {
        reporterType,
        phoneAccess,
      });

      setCalculatedPreview({
        score: scoring.score,
        category: scoring.category,
        noPhoneFloorApplied: scoring.appliedFloors.noPhoneFloorApplied,
      });
    } catch {
      // Offline fallback directly in client if fetch fails completely
      const fallback = extractFactsWithHeuristics(reportText, {
        phoneAccess,
        sectorHint: sectorId as any,
      });
      setExtractionResult(fallback);

      const scoring = calculatePriorityScore(fallback.factors, {
        reporterType,
        phoneAccess,
      });

      setCalculatedPreview({
        score: scoring.score,
        category: scoring.category,
        noPhoneFloorApplied: scoring.appliedFloors.noPhoneFloorApplied,
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmitToQueue = () => {
    if (!reportText.trim()) return;

    const reporterType: ReporterType = isProxy ? 'community_proxy' : 'citizen';
    let factors: IncidentFactors | undefined = extractionResult?.factors;

    // If user clicked submit directly without analyzing first, do deterministic extraction now
    let provenanceBadge = extractionResult?.provenanceBadge;
    let isAI = extractionResult?.isAI;

    if (!factors) {
      const fallback = extractFactsWithHeuristics(reportText, {
        phoneAccess,
        sectorHint: sectorId as any,
      });
      factors = fallback.factors;
      provenanceBadge = fallback.provenanceBadge;
      isAI = false;
    }

    const created = submitIncident({
      reportText: reportText.trim(),
      sectorId: (extractionResult?.facts?.sectorHint as string) || sectorId,
      reporterType,
      phoneAccess,
      factors,
      reportTranslation: extractionResult?.facts?.englishTranslation,
      coordinates: null, // Strictly null for citizen text reports per Invariant 2
    });

    // Auto-select in inspector
    setSelectedIncidentId(created.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-modal-title"
    >
      <div className="bg-surface-1 border border-hairline-strong rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between bg-surface-2/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="intake-modal-title"
                className="text-sm font-bold text-ink tracking-tight font-mono uppercase"
              >
                Emergency Intake & Fact Extraction
              </h2>
              <p className="text-[11px] text-ink-muted">
                Multilingual distress report ingestion with honest AI / heuristic extraction
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-3 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Pre-fill Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-subtle uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand" />
                Quick Crisis Test Presets
              </span>
              <span className="text-[10px] text-ink-subtle">Click to autofill sample scenarios</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1.5 text-left rounded bg-surface-2 hover:bg-surface-3 border border-hairline transition-all flex items-center justify-between group"
                >
                  <span className="font-mono text-[11px] text-ink truncate group-hover:text-brand transition-colors">
                    {preset.label}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-surface-1 border border-hairline text-ink-muted shrink-0 ml-1.5">
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Distress Text Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="distress-text" className="font-mono text-[11px] text-ink-subtle uppercase">
                Citizen Distress Message (English, Urdu, or Roman Urdu)
              </label>
              <span className="text-[10px] text-ink-subtle font-mono">{reportText.length} chars</span>
            </div>
            <textarea
              id="distress-text"
              rows={4}
              value={reportText}
              onChange={(e) => {
                setReportText(e.target.value);
                setExtractionResult(null);
                setCalculatedPreview(null);
              }}
              placeholder="e.g. My father Syed Iqbal is on hemodialysis. Water is chest-deep inside our house. Generator submerged. Need boat immediately..."
              className="w-full bg-surface-2 border border-hairline rounded-lg p-3 text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand font-sans leading-relaxed resize-none"
            />
          </div>

          {/* Sector Selector & Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="sector-hint" className="font-mono text-[11px] text-ink-subtle uppercase flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-brand" />
                Reported Sector / Geographic Hint
              </label>
              <select
                id="sector-hint"
                value={sectorId}
                onChange={(e) => setSectorId(e.target.value)}
                className="w-full bg-surface-2 border border-hairline rounded px-2.5 py-2 text-xs text-ink focus:outline-none focus:border-brand"
              >
                <option value="sector-1">Sector 1 --- Saddar / Urban Core</option>
                <option value="sector-2">Sector 2 --- Gadap / Agricultural Corridor</option>
                <option value="sector-3a">Sector 3A --- Malir Riverbank</option>
                <option value="sector-4">Sector 4 --- Port & Highway Lowlands</option>
              </select>
            </div>

            {/* Extraction Trigger Button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRunExtraction}
                disabled={isExtracting || !reportText.trim()}
                className="w-full py-2 px-3 rounded bg-surface-3 hover:bg-surface-4 disabled:opacity-50 text-ink border border-hairline font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand" />
                    <span>Extracting Facts...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-brand" />
                    <span>Extract Structured Facts</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Community Proxy & Phone Connectivity Controls (Task T5.1) */}
          <CommunityProxyToggle
            isProxy={isProxy}
            onProxyChange={setIsProxy}
            phoneAccess={phoneAccess}
            onPhoneAccessChange={setPhoneAccess}
            proxyReporterName={proxyName}
            onProxyReporterNameChange={setProxyName}
          />

          {/* Extraction Preview Card (Task T5.3, T5.4 & Test 1.8) */}
          {extractionResult && (
            <div className="p-3.5 rounded-lg bg-surface-2 border border-hairline space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-ink">
                    Structured Extraction Summary
                  </span>
                </div>

                {/* Honest Provenance Badge (Test 1.8) */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border ${
                    extractionResult.isAI
                      ? 'bg-brand/15 text-brand border-brand/30 font-semibold'
                      : 'bg-surface-3 text-semantic-unknown-text border-hairline font-medium'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      extractionResult.isAI ? 'bg-brand' : 'bg-semantic-unknown'
                    }`}
                  />
                  <span>{extractionResult.provenanceBadge}</span>
                </div>
              </div>

              {/* Extracted Facts Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2 rounded bg-surface-1 border border-hairline">
                  <span className="text-[10px] font-mono uppercase text-ink-subtle block">
                    Incident Type
                  </span>
                  <span className="font-semibold text-ink capitalize">
                    {extractionResult.facts.incidentType.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-2 rounded bg-surface-1 border border-hairline">
                  <span className="text-[10px] font-mono uppercase text-ink-subtle block">
                    Water Inundation
                  </span>
                  <span className="font-semibold text-ink">
                    {extractionResult.facts.waterDepthMeters !== null
                      ? `${extractionResult.facts.waterDepthMeters}m depth`
                      : 'Unknown / Not stated'}
                  </span>
                </div>

                <div className="p-2 rounded bg-surface-1 border border-hairline">
                  <span className="text-[10px] font-mono uppercase text-ink-subtle block">
                    Medical Urgency
                  </span>
                  <span className="font-semibold text-semantic-critical-text capitalize">
                    {extractionResult.facts.medicalUrgencyLevel || 'None'}
                  </span>
                </div>

                <div className="p-2 rounded bg-surface-1 border border-hairline">
                  <span className="text-[10px] font-mono uppercase text-ink-subtle block">
                    Mobility Level
                  </span>
                  <span className="font-semibold text-ink capitalize">
                    {extractionResult.facts.evacuationMobilityLevel?.replace('_', ' ') || 'Independent'}
                  </span>
                </div>

                <div className="p-2 rounded bg-surface-1 border border-hairline">
                  <span className="text-[10px] font-mono uppercase text-ink-subtle block">
                    People Affected
                  </span>
                  <span className="font-semibold text-ink">
                    {extractionResult.facts.peopleAffected !== null
                      ? `${extractionResult.facts.peopleAffected} persons`
                      : 'Unknown'}
                  </span>
                </div>

                <div className="p-2 rounded bg-surface-1 border border-hairline">
                  <span className="text-[10px] font-mono uppercase text-ink-subtle block">
                    Sector Hint
                  </span>
                  <span className="font-semibold text-ink">
                    {extractionResult.facts.sectorHint || sectorId}
                  </span>
                </div>
              </div>

              {/* English Translation (if Urdu) */}
              {extractionResult.facts.englishTranslation && (
                <div className="p-2 rounded bg-surface-1 border border-hairline text-[11px]">
                  <span className="text-[10px] font-mono uppercase text-ink-subtle block">
                    Bilingual Translation
                  </span>
                  <p className="text-ink italic">&quot;{extractionResult.facts.englishTranslation}&quot;</p>
                </div>
              )}

              {/* Real-time Deterministic Priority Preview */}
              {calculatedPreview && (
                <div className="p-2.5 rounded bg-surface-1 border border-hairline flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-ink-subtle block">
                      Deterministic MCDA Score
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-ink">
                        {calculatedPreview.score} / 100
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          calculatedPreview.category === 'Critical'
                            ? 'bg-semantic-critical/20 text-semantic-critical-text border border-semantic-critical-border/40'
                            : calculatedPreview.category === 'High'
                            ? 'bg-semantic-warning/20 text-semantic-warning-text border border-semantic-warning-border/40'
                            : 'bg-surface-3 text-ink-muted'
                        }`}
                      >
                        {calculatedPreview.category}
                      </span>
                    </div>
                  </div>

                  {calculatedPreview.noPhoneFloorApplied && (
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-semantic-warning/20 text-semantic-warning-text border border-semantic-warning-border/40">
                      NO-PHONE FLOOR APPLIED
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-hairline bg-surface-2/60 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-mono text-ink-muted hover:text-ink hover:bg-surface-3 transition-colors border border-hairline"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmitToQueue}
            disabled={!reportText.trim()}
            className="px-4 py-2 rounded bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Commit to Triage Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
