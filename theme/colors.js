export const palette = {
  backgroundDeep: '#02040A',
  backgroundAlt: '#050712',
  surfacePrimary: 'rgba(12, 18, 32, 0.92)',
  surfaceElevated: 'rgba(20, 27, 46, 0.9)',
  neonAqua: '#57FFE7',
  neonPurple: '#9D6BFF',
  neonPink: '#FF5FD1',
  textPrimary: '#EAF9FF',
  textSecondary: 'rgba(170, 205, 255, 0.75)',
  divider: 'rgba(74, 107, 153, 0.45)',
};

export const gradients = {
  appShell: ['#02040A', '#040713', '#02040A'],
  drawer: ['#05070D', '#090F1C'],
  homeBackdrop: ['#060815', '#040713', '#02040A'],
  moduleBackdrop: ['#040610', '#050817'],
  cardSurface: ['rgba(18, 26, 44, 0.95)', 'rgba(10, 16, 32, 0.92)'],
};

export const shadows = {
  heavy: {
    shadowColor: '#43FFE0',
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 18,
  },
  medium: {
    shadowColor: '#517CFF',
    shadowOpacity: 0.32,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 14,
  },
};

export const typography = {
  heading: {
    fontWeight: '700',
    letterSpacing: 1,
    color: palette.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 0.5,
    color: palette.textSecondary,
  },
};

export default {
  palette,
  gradients,
  shadows,
  typography,
};
