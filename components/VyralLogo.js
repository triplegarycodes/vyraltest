import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, shadows } from '../theme/colors';

const VyralLogo = () => (
  <View style={styles.wrapper}>
    <LinearGradient colors={[palette.backgroundAlt, '#070A18']} style={styles.logoBackground}>
      <LinearGradient
        colors={[palette.neonAqua, palette.neonPurple]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.icon}
      >
        <Text style={styles.symbol}>⚡</Text>
      </LinearGradient>
    </LinearGradient>
    <Text style={styles.title}>Vyral</Text>
    <Text style={styles.subtitle}>Neon Synergy Platform</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  logoBackground: {
    width: 160,
    height: 160,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.heavy,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5BFF',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
  },
  symbol: {
    fontSize: 68,
    color: '#0E1422',
  },
  title: {
    marginTop: 24,
    fontSize: 38,
    color: palette.textPrimary,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  subtitle: {
    marginTop: 8,
    color: palette.textSecondary,
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default React.memo(VyralLogo);
