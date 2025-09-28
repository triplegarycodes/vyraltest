import React, { useMemo } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { accentChoices, useNeonTheme } from '../context/NeonThemeContext';

const FONT_RANGE = { min: 0.85, max: 1.25 };
const SLIDER_WIDTH = 240;
const KNOB_SIZE = 28;

const SettingsScreen = () => {
  const { themePalette, accentColor, setAccentColor, themeMode, toggleTheme, fontScale, setFontScale } = useNeonTheme();

  const ratio = useSharedValue((fontScale - FONT_RANGE.min) / (FONT_RANGE.max - FONT_RANGE.min));
  const sliderRange = SLIDER_WIDTH - KNOB_SIZE;

  React.useEffect(() => {
    ratio.value = withTiming((fontScale - FONT_RANGE.min) / (FONT_RANGE.max - FONT_RANGE.min), { duration: 200 });
  }, [fontScale, ratio]);

  const updateScale = React.useCallback(
    (nextRatio) => {
      const clamped = Math.max(0, Math.min(1, nextRatio));
      const newScale = FONT_RANGE.min + clamped * (FONT_RANGE.max - FONT_RANGE.min);
      setFontScale(Number(newScale.toFixed(2)));
    },
    [setFontScale]
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((event) => {
          const nextRatio = ratio.value + event.translationX / sliderRange;
          const clamped = Math.max(0, Math.min(1, nextRatio));
          ratio.value = clamped;
          updateScale(clamped);
        }),
    [ratio, sliderRange, updateScale]
  );

  const tap = useMemo(
    () =>
      Gesture.Tap().onEnd((event) => {
        const x = event.x - KNOB_SIZE / 2;
        const clamped = Math.max(0, Math.min(1, x / sliderRange));
        ratio.value = withTiming(clamped, { duration: 180 });
        updateScale(clamped);
      }),
    [ratio, sliderRange, updateScale]
  );

  const composedGesture = Gesture.Simultaneous(pan, tap);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ratio.value * sliderRange }],
  }));

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="options" size={26} color={accentColor} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Settings</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Tune the glow across your network.</Text>
      <NeonCard>
        <View style={styles.toggleRow}>
          <View>
            <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Dark mode</Text>
            <Text style={[styles.cardDescription, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>Switch UI polarity.</Text>
          </View>
          <Switch value={themeMode === 'dark'} onValueChange={toggleTheme} trackColor={{ true: accentColor, false: '#889' }} />
        </View>
      </NeonCard>
      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Accent color</Text>
        <Text style={[styles.cardDescription, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>Select your signal hue.</Text>
        <View style={styles.swatchRow}>
          {accentChoices.map((choice) => (
            <NeonButton
              key={choice}
              label={choice.toUpperCase()}
              onPress={() => setAccentColor(choice)}
              active={accentColor === choice}
              icon={<Ionicons name="color-palette" size={18} color={themePalette.textPrimary} />}
            />
          ))}
        </View>
      </NeonCard>
      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Font scale</Text>
        <Text style={[styles.cardDescription, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>Drag to adjust readability.</Text>
        <GestureDetector gesture={composedGesture}>
          <View style={[styles.sliderTrack, { borderColor: accentColor }]}>            
            <Animated.View style={[styles.sliderKnob, { backgroundColor: accentColor }, knobStyle]} />
          </View>
        </GestureDetector>
        <Text style={[styles.scaleValue, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>Current scale: {fontScale.toFixed(2)}</Text>
      </NeonCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    lineHeight: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardDescription: {
    marginTop: 4,
    lineHeight: 18,
  },
  swatchRow: {
    marginTop: 12,
    gap: 12,
  },
  sliderTrack: {
    marginTop: 16,
    borderWidth: 1.5,
    borderRadius: 20,
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 8,
    width: SLIDER_WIDTH,
  },
  sliderKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
  },
  scaleValue: {
    marginTop: 12,
    textAlign: 'right',
  },
});

export default SettingsScreen;
