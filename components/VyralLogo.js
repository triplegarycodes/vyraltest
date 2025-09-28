import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const VyralLogo = () => (
  <View style={styles.wrapper}>
    <LinearGradient colors={['#1B2235', '#080A12']} style={styles.logoBackground}>
      <LinearGradient
        colors={['#46FFE3', '#7F5BFF']}
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
    shadowColor: '#3CF9E3',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 40,
    elevation: 20,
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
    color: '#E6F7FF',
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(164, 200, 255, 0.7)',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default VyralLogo;