import React from 'react';
import NextLink from 'next/link';
import { Radio, Github, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export function LinearFooter() {
  return (
    <footer className="w-full border-t border-hairline bg-canvas text-ink-subtle text-[12px] leading-[1.4] py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[6px] border border-hairline-strong bg-surface-1 flex items-center justify-center text-brand">
              <Radio className="w-3 h-3 text-brand" />
            </div>
            <span className="text-[14px] font-semibold text-ink tracking-tight font-sans">
              Nigehbaan <span className="text-[12px] text-ink-muted font-normal" dir="rtl">(نگہبان)</span>
            </span>
          </div>
          <p className="text-ink-subtle text-[13px] leading-[1.5]">
            Autonomous tactical disaster triage and emergency coordination for flood crises in Pakistan. Finding the people the system can&apos;t hear.
          </p>
          <div className="pt-2 text-[11px] text-ink-tertiary">
            Built for CODE//CONNECT&apos;26 • Problem 01
          </div>
        </div>

        {/* Platform Links */}
        <div className="space-y-2.5">
          <h4 className="text-[13px] font-medium text-ink tracking-tight uppercase tracking-wider text-[11px] text-ink-muted">
            Platform
          </h4>
          <ul className="space-y-1.5 text-[13px]">
            <li>
              <NextLink href="/" className="hover:text-ink transition-colors">
                Product Overview
              </NextLink>
            </li>
            <li>
              <NextLink href="/guide" className="hover:text-ink transition-colors">
                Platform Guide & Evaluator Blueprint
              </NextLink>
            </li>
            <li>
              <NextLink href="/dashboard" className="hover:text-ink transition-colors">
                Command Cockpit (HUD)
              </NextLink>
            </li>
            <li>
              <NextLink href="/incidents/new" className="hover:text-ink transition-colors">
                Citizen Distress Intake
              </NextLink>
            </li>
          </ul>
        </div>

        {/* Engineering Standards */}
        <div className="space-y-2.5">
          <h4 className="text-[13px] font-medium text-ink tracking-tight uppercase tracking-wider text-[11px] text-ink-muted">
            Safety & Standards
          </h4>
          <ul className="space-y-1.5 text-[13px]">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              <span>Deterministic 0–100 MCDA</span>
            </li>
            <li>Zero LLM Priority Guesswork</li>
            <li>Uncertainty Renormalization</li>
            <li>Human Coordinator Approval Gate</li>
            <li>Offline PWA Local Queue Sync</li>
          </ul>
        </div>

        {/* Team & University */}
        <div className="space-y-2.5">
          <h4 className="text-[13px] font-medium text-ink tracking-tight uppercase tracking-wider text-[11px] text-ink-muted">
            Team Byte Alpha&apos;s
          </h4>
          <ul className="space-y-1.5 text-[13px]">
            <li>
              <span className="text-ink">Syed Ali Hashmi</span>
              <span className="text-ink-tertiary ml-1.5 text-[11px]">EB-24210106108 (BSSE)</span>
            </li>
            <li>
              <span className="text-ink">Syed Umer Hashmi</span>
              <span className="text-ink-tertiary ml-1.5 text-[11px]">EB-25210006105 (BSCS)</span>
            </li>
            <li className="text-ink-tertiary text-[11px] pt-1">
              UBIT, University of Karachi
            </li>
            <li className="pt-2">
              <a
                href="https://github.com/alihashmi2288/Nigehbaan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors text-[12px]"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-hairline flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-tertiary gap-4">
        <div>
          © 2026 Nigehbaan (نگہبان). All telemetry and incident feeds are simulated for disaster drills.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-brand fill-brand" />
          <span>for flood resilience in Pakistan</span>
        </div>
      </div>
    </footer>
  );
}
