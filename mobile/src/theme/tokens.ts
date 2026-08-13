/**
 * Design tokens extracted from the Artiva Figma file
 * (Verifix — Verification Screens, file key vK27oIGb5Cteo40AT6Nbxk).
 *
 * There is no shared Figma variables/styles library in this file, so
 * these values were read directly off the screens via get_design_context.
 */

export const colors = {
  // Core brand
  navy: '#151B29',
  navyElevated: '#1E2536',
  orange: '#FF8C00',
  orangeMuted: 'rgba(255, 140, 0, 0.1)',

  // Text (on dark navy screens)
  white: '#FFFFFF',
  textSecondary: '#C1C6D9',
  textMuted: 'rgba(193, 198, 217, 0.6)',

  // Text (on light screens — most of the app)
  textOnLight: '#191C1D',
  textOnLightSecondary: '#564334',
  placeholderOnLight: 'rgba(86, 67, 52, 0.5)',

  // Surfaces (light screens — most flows sit on a light background)
  background: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#E1E3E4',
  divider: '#DDC1AE',

  // Status
  success: '#16A34A',
  successBg: '#DCFCE7',
  error: '#DC2626',
  errorBg: '#FEE2E2',
  warning: '#D97706',
  warningBg: '#FEF3C7',
} as const;

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 32,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
