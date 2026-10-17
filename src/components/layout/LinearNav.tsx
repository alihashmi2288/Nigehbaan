'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Radio, Menu, X, ArrowRight, ShieldAlert, BookOpen, LayoutDashboard, PlusCircle } from 'lucide-react';

interface LinearNavProps {
  currentRoute?: 'home' | 'guide' | 'dashboard';
}

export function LinearNav({ currentRoute }: LinearNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          <NextLink href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-[6px] border border-hairline-strong bg-surface-1 flex items-center justify-center text-brand group-hover:border-brand/60 transition-colors">
              <Radio className="w-3.5 h-3.5 text-brand animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-semibold text-ink tracking-tight font-sans">
                Nigehbaan
              </span>
              <span className="text-[12px] text-ink-muted font-normal" dir="rtl">
                (نگہبان)
              </span>
            </div>
          </NextLink>

          {/* Operational Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-2 border border-hairline text-[11px] font-mono text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse" />
            <span>District Alpha Live</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-[14px] font-normal">
          <NextLink
            href="/"
            className={`px-3 py-1.5 rounded-[6px] transition-colors ${
              isActive('/')
                ? 'text-ink bg-surface-1 font-medium'
                : 'text-ink-muted hover:text-ink hover:bg-surface-1/50'
            }`}
          >
            Overview
          </NextLink>
          <NextLink
            href="/guide"
            className={`px-3 py-1.5 rounded-[6px] transition-colors ${
              isActive('/guide')
                ? 'text-ink bg-surface-1 font-medium'
                : 'text-ink-muted hover:text-ink hover:bg-surface-1/50'
            }`}
          >
            Platform Guide
          </NextLink>
          <NextLink
            href="/dashboard"
            className={`px-3 py-1.5 rounded-[6px] transition-colors ${
              isActive('/dashboard')
                ? 'text-ink bg-surface-1 font-medium'
                : 'text-ink-muted hover:text-ink hover:bg-surface-1/50'
            }`}
          >
            Command Cockpit
          </NextLink>
          <NextLink
            href="/incidents/new"
            className={`px-3 py-1.5 rounded-[6px] transition-colors ${
              isActive('/incidents/new')
                ? 'text-ink bg-surface-1 font-medium'
                : 'text-ink-muted hover:text-ink hover:bg-surface-1/50'
            }`}
          >
            Citizen Intake
          </NextLink>
        </nav>

        {/* Right CTA Pair */}
        <div className="hidden md:flex items-center gap-2.5">
          <NextLink
            href="/guide"
            className="px-3.5 py-1.5 text-[14px] font-medium text-ink bg-surface-1 border border-hairline rounded-[8px] hover:bg-surface-2 hover:border-hairline-strong transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-ink-subtle" />
            <span>Guide</span>
          </NextLink>
          <NextLink
            href="/dashboard"
            className="px-3.5 py-1.5 text-[14px] font-medium text-white bg-brand hover:bg-brand-hover active:bg-brand-focus rounded-[8px] transition-colors flex items-center gap-1.5 shadow-none"
          >
            <span>Launch Cockpit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NextLink>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <NextLink
            href="/dashboard"
            className="px-3 py-1 text-[13px] font-medium text-white bg-brand rounded-[6px]"
          >
            Cockpit
          </NextLink>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-[6px] bg-surface-1 border border-hairline text-ink-muted hover:text-ink"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-hairline bg-surface-1 px-4 py-4 space-y-2">
          <NextLink
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-[6px] text-[14px] text-ink hover:bg-surface-2"
          >
            Overview
          </NextLink>
          <NextLink
            href="/guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-[6px] text-[14px] text-ink hover:bg-surface-2"
          >
            Platform Guide & Evaluator Blueprint
          </NextLink>
          <NextLink
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-[6px] text-[14px] text-ink hover:bg-surface-2"
          >
            Command Cockpit (Operational HUD)
          </NextLink>
          <NextLink
            href="/incidents/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-[6px] text-[14px] text-ink hover:bg-surface-2"
          >
            Citizen Intake Form
          </NextLink>
        </div>
      )}
    </header>
  );
}
