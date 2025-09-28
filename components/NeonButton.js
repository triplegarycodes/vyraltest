import React, { memo, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '../theme/colors';

const NeonButton = ({ label, onPress, icon }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: 6,
    }).start();
  };

  const content = useMemo(
    () => (
      <LinearGradient
        colors={[palette.neonAqua, palette.neonPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text style={styles.text}>{label}</Text>
        </View>
      </LinearGradient>
    ),
    [icon, label],
  );

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} style={styles.pressable}>
      <Animated.View style={[styles.shadowWrap, { transform: [{ scale }] }]}>{content}</Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 18,
  },
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#0C101A',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  icon: {
    marginRight: 10,
  },
});

export default memo(NeonButton);
