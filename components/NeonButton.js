import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useNeonTheme } from '../context/NeonThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NeonButton = ({ label, onPress, icon, active, style }) => {
  const { accentColor, themePalette } = useNeonTheme();

  const iconElement = React.isValidElement(icon)
    ? React.cloneElement(icon, {
        style: [styles.icon, icon.props?.style],
      })
    : null;

  return (
    <AnimatedPressable
      entering={FadeIn.duration(220)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        themePalette.shadow,
        style,
        {
          borderColor: active ? accentColor : accentColor + '55',
          backgroundColor: active ? accentColor + '1A' : 'transparent',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <LinearGradient
        colors={[accentColor + '55', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.content}>
        {iconElement}
        <Text style={[styles.label, { color: themePalette.textPrimary }]}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.75,
  },
  icon: {
    marginRight: 12,
  },
});

export default NeonButton;
