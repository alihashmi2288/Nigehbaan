import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          4: 'var(--surface-4)',
        },
        hairline: {
          DEFAULT: 'var(--hairline)',
          strong: 'var(--hairline-strong)',
          tertiary: 'var(--hairline-tertiary)',
        },
        brand: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          focus: 'var(--primary-focus)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          subtle: 'var(--ink-subtle)',
          tertiary: 'var(--ink-tertiary)',
        },
        semantic: {
          critical: {
            DEFAULT: 'var(--semantic-critical)',
            text: 'var(--semantic-critical-text)',
            border: 'var(--semantic-critical-border)',
            bg: 'var(--semantic-critical-bg)',
          },
          warning: {
            DEFAULT: 'var(--semantic-warning)',
            text: 'var(--semantic-warning-text)',
            border: 'var(--semantic-warning-border)',
            bg: 'var(--semantic-warning-bg)',
          },
          'blind-spot': {
            DEFAULT: 'var(--semantic-blind-spot)',
            text: 'var(--semantic-blind-spot-text)',
            border: 'var(--semantic-blind-spot-border)',
            bg: 'var(--semantic-blind-spot-bg)',
          },
          success: {
            DEFAULT: 'var(--semantic-success)',
            text: 'var(--semantic-success-text)',
            border: 'var(--semantic-success-border)',
            bg: 'var(--semantic-success-bg)',
          },
          unknown: {
            DEFAULT: 'var(--semantic-unknown)',
            text: 'var(--semantic-unknown-text)',
            bg: 'var(--semantic-unknown-bg)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
