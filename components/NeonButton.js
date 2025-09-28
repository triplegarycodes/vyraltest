import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const NeonButton = ({ label, onPress }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.shadowWrap}>
    <LinearGradient colors={['#3FFFD7', '#8A4DFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      <Text style={styles.text}>{label}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: 18,
    shadowColor: '#3FFFD7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  gradient: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  text: {
    color: '#0C101A',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default NeonButton;