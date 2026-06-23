/**
 * Design tokens — the single source of truth for the visual language.
 * Semantic tokens (theme.color.text) are resolved from primitives per color-scheme,
 * so components never reference raw hex values.
 */
export const primitives = {
  ink900: '#0B0E14', ink800: '#11151F', ink700: '#1A2030', ink600: '#252C42',
  slate400: '#8A93A6', slate200: '#C9D1E0', white: '#FFFFFF',
  aurora: '#6E8BFF', auroraDeep: '#4F66E0', mint: '#3DDC97', coral: '#FF6B6B', amber: '#F5A623',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 } as const;
export const font = {
  family: { regular: 'System', mono: 'Menlo' },
  size: { xs: 12, sm: 14, md: 16, lg: 20, xl: 28, display: 40 },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
} as const;

export type ColorScheme = 'light' | 'dark';

export const palette = {
  dark: {
    bg: primitives.ink900, surface: primitives.ink800, surfaceAlt: primitives.ink700,
    border: primitives.ink600, text: primitives.white, textMuted: primitives.slate400,
    brand: primitives.aurora, positive: primitives.mint, negative: primitives.coral, warning: primitives.amber,
  },
  light: {
    bg: '#F5F7FB', surface: primitives.white, surfaceAlt: '#EEF1F8',
    border: '#E2E7F1', text: primitives.ink900, textMuted: '#5B6477',
    brand: primitives.auroraDeep, positive: '#1FB07A', negative: '#E04848', warning: '#C9831A',
  },
} as const satisfies Record<ColorScheme, Record<string, string>>;
