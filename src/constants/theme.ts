export const Colors = {
  // Primary calming palette - soft purples and blues
  primary: '#8B7FD8',
  primaryLight: '#B8AEF0',
  primaryDark: '#6B5FC2',

  // Secondary - soft teals and greens
  secondary: '#7EC8B8',
  secondaryLight: '#A8E6D7',
  secondaryDark: '#5BA895',

  // Neutrals - warm grays for a soft feel
  background: '#F8F7FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FEFEFF',

  // Text colors
  text: '#2D2836',
  textSecondary: '#7B7486',
  textTertiary: '#ADA4B8',

  // Accent colors
  accent: '#E8A5C5',
  accentLight: '#F4D0E1',

  // Functional colors
  success: '#7EC8B8',
  warning: '#F5C98D',
  error: '#E89B9B',

  // Gradients
  gradientStart: '#B8AEF0',
  gradientEnd: '#E8A5C5',

  // Shadows
  shadow: 'rgba(139, 127, 216, 0.15)',
};

export const Typography = {
  // Font families (using system fonts for now)
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 9999,
};

export const Shadows = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
