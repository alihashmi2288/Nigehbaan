'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { IntakeModal } from '@/components/intake';
import { PwaOfflineBanner } from '@/components/pwa';
import { useRouter } from 'next/navigation';

export default function NewIncidentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-ink-muted hover:text-ink transition-colors px-3 py-1.5 rounded bg-surface-1 border border-hairline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Command Cockpit</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-ink-subtle">
            <ShieldAlert className="w-3.5 h-3.5 text-brand" />
            <span>Direct Incident Intake Portal</span>
          </div>
        </div>

        <PwaOfflineBanner />
      </div>

      <IntakeModal isOpen={true} onClose={() => router.push('/')} />
    </div>
  );
}
