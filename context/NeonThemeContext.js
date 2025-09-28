import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

const accentChoices = ['#7FFFD4', '#9F7FFF', '#40E0D0'];

const themePalettes = {
  dark: {
    background: '#01040B',
    surface: '#081125',
    overlay: '#0D1C3A',
    textPrimary: '#F6FAFF',
    textSecondary: 'rgba(176, 208, 255, 0.75)',
    border: 'rgba(126, 255, 244, 0.45)',
    shadow: {
      shadowColor: '#7FFFD4',
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 18 },
      shadowRadius: 32,
      elevation: 16,
    },
    drawer: ['#02050F', '#06102A'],
  },
  light: {
    background: '#EEF6FF',
    surface: '#FFFFFF',
    overlay: '#F3F6FF',
    textPrimary: '#041029',
    textSecondary: 'rgba(14, 45, 86, 0.65)',
    border: 'rgba(102, 126, 255, 0.35)',
    shadow: {
      shadowColor: '#9F7FFF',
      shadowOpacity: 0.22,
      shadowOffset: { width: 0, height: 14 },
      shadowRadius: 26,
      elevation: 12,
    },
    drawer: ['#F1F2FF', '#E5EDFF'],
  },
};

const ThemeContext = createContext(null);

export const NeonThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(Appearance.getColorScheme() ?? 'dark');
  const [accentColor, setAccentColor] = useState(accentChoices[0]);
  const [fontScale, setFontScale] = useState(1);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(
    () => ({
      themeMode,
      themePalette: themePalettes[themeMode] || themePalettes.dark,
      accentColor,
      setAccentColor,
      accentChoices,
      toggleTheme,
      setThemeMode,
      fontScale,
      setFontScale,
    }),
    [accentColor, fontScale, themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useNeonTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useNeonTheme must be used within a NeonThemeProvider');
  }
  return context;
};

export { accentChoices, themePalettes };
