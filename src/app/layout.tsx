import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nigehbaan (نگہبان) --- Tactical Disaster Triage',
  description:
    'Nigehbaan is an AI-assisted disaster coordination platform that finds the invisible victims of floods. When high-hazard sectors experience cellular tower collapse, its Uncertainty Radar detects the silence and synthesizes high-priority welfare recon incidents. Triage is governed by an auditable, deterministic 0–100 mathematical engine that never penalizes missing data, paired with natural-language explainability cards and deterministic opportunity-cost warnings before human dispatch approval.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-ink antialiased selection:bg-brand selection:text-white">
        {children}
      </body>
    </html>
  );
}
