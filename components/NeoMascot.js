import React, { memo, useMemo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '../theme/colors';

const reactionCopy = {
  pulse: 'Neo synced with your command.',
  'module-launch': 'Neo is routing you to the module.',
  'module-engage': 'Neo confirms the engagement.',
  standby: 'Neo is observing the signal.',
};

const NeoMascot = ({ energy, orbit, reaction }) => {
  const translateY = energy.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });
  const scale = energy.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });
  const auraOpacity = energy.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.25, 0.45, 0.75],
  });
  const orbitRotation = orbit.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const label = useMemo(() => {
    if (reaction && reactionCopy[reaction]) {
      return reactionCopy[reaction];
    }

    return reactionCopy.standby;
  }, [reaction]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Animated.View style={[styles.aura, { opacity: auraOpacity }]} />
      <LinearGradient
        colors={[palette.neonAqua, palette.neonPurple]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.body}
      >
        <Text style={styles.symbol}>Neo</Text>
        <Text style={styles.caption}>{label}</Text>
      </LinearGradient>
      <Animated.View style={[styles.orbit, { transform: [{ rotate: orbitRotation }] }]}>
        <View style={styles.orbitNode} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 200,
    alignItems: 'flex-end',
  },
  aura: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    backgroundColor: 'rgba(89, 255, 227, 0.35)',
  },
  body: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
    color: '#04111A',
  },
  caption: {
    marginTop: 8,
    color: 'rgba(10, 18, 30, 0.7)',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  orbit: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default memo(NeoMascot);
