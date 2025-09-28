import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNeonTheme } from '../context/NeonThemeContext';

const NeonCard = ({ style, accent, children }) => {
  const { accentColor, themePalette } = useNeonTheme();

  return (
    <LinearGradient
      colors={[themePalette.surface, themePalette.overlay]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, themePalette.shadow, { borderColor: (accent || accentColor) + '55' }, style]}
    >
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 1,
    marginBottom: 18,
  },
  inner: {
    borderRadius: 18,
    padding: 20,
  },
});

export default NeonCard;
