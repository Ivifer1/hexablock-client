export const SPACING = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
  touchTargetMin: 44,
} as const;

export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const BORDER_WIDTH = {
  thin: 1,
  thick: 2,
  chunky: 3,
} as const;

/** Soft-press and selection motion (ms). Skip non-essential motion when reduced-motion is on. */
export const MOTION = {
  pressMs: 160,
  selectionMs: 280,
} as const;

export const TYPOGRAPHY = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  title1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  title2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700' as const,
  },
} as const;

export const LIGHT_THEME = {
  bg: '#F6F4ED',
  surface: '#FFFFFF',
  centerSurface: '#151821',
  surfaceSubdued: '#EAE6DB',
  surfaceHover: '#DFD9CC',

  textPrimary: '#1E2229',
  textSecondary: '#636A79',
  textTertiary: '#989EAC',
  textInverse: '#FFFFFF',

  borderDefault: '#DFD9CC',
  borderStrong: '#BEB6A4',

  primary: '#0891B2',
  primaryHover: '#0E7490',
  primaryFg: '#FFFFFF',

  success: '#16A34A',
  danger: '#DC2626',
  warning: '#D97706',

  shadowLow: {
    shadowColor: '#1E2229',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#1E2229',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  shadowGlowPrimary: {
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 5,
  },
  /** Soft-UI emboss for interactive surfaces on cream backgrounds. */
  shadowSoftUp: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 0,
  },
} as const;

export const DARK_THEME = {
  bg: '#151821',
  surface: '#222634',
  centerSurface: '#151821',
  surfaceSubdued: '#2C3144',
  surfaceHover: '#373D54',

  textPrimary: '#F3F5F9',
  textSecondary: '#8E96AA',
  textTertiary: '#656D82',
  textInverse: '#151821',

  borderDefault: '#2F354A',
  borderStrong: '#444C68',

  primary: '#0891B2',
  primaryHover: '#22D3EE',
  primaryFg: '#FFFFFF',

  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',

  shadowLow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 6,
  },
  shadowGlowPrimary: {
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 5,
  },
  shadowSoftUp: {
    shadowColor: '#3A4158',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 0,
  },
} as const;

export type Theme = typeof LIGHT_THEME | typeof DARK_THEME;
