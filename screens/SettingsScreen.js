import React, { useCallback, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { accentChoices, useNeonTheme } from '../context/NeonThemeContext';
import { useVyralData } from '../context/VyralDataContext';

const FONT_RANGE = { min: 0.85, max: 1.25 };
const SLIDER_WIDTH = 240;
const KNOB_SIZE = 28;

const SettingsScreen = () => {
  const { themePalette, accentColor, setAccentColor, themeMode, toggleTheme, fontScale, setFontScale } = useNeonTheme();
  const { xp, lessons, zonePosts, collaborationThreads, users, stryke } = useVyralData();
  const completedLessons = useMemo(() => lessons.filter((lesson) => lesson.status === 'completed').length, [lessons]);
  const friendCount = useMemo(() => users.filter((user) => user.isFriend).length, [users]);

  const ratio = useSharedValue((fontScale - FONT_RANGE.min) / (FONT_RANGE.max - FONT_RANGE.min));
  const sliderRange = SLIDER_WIDTH - KNOB_SIZE;

  useEffect(() => {
    ratio.value = withTiming((fontScale - FONT_RANGE.min) / (FONT_RANGE.max - FONT_RANGE.min), { duration: 200 });
  }, [fontScale, ratio]);

  const updateScale = useCallback(
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
        <Ionicons name="options" size={26} color={accentColor} style={styles.headerIcon} />
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
          {accentChoices.map((choice, index) => (
            <NeonButton
              key={choice}
              label={choice.toUpperCase()}
              onPress={() => setAccentColor(choice)}
              active={accentColor === choice}
              icon={<Ionicons name="color-palette" size={18} color={themePalette.textPrimary} />}
              style={[styles.swatchButton, index === accentChoices.length - 1 && styles.lastSwatch]}
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
      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Vyral analytics</Text>
        <Text style={[styles.cardDescription, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>Quick snapshot of your neon impact.</Text>
        <View style={styles.analyticsRow}>
          <View style={[styles.metricCard, { borderColor: accentColor + '44' }]}>
            <Ionicons name="flash" size={18} color={accentColor} style={styles.metricIcon} />
            <Text style={[styles.metricValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{xp}</Text>
            <Text style={[styles.metricLabel, { color: themePalette.textSecondary, fontSize: 11.5 * fontScale }]}>Total XP</Text>
          </View>
          <View style={[styles.metricCard, { borderColor: accentColor + '44' }]}>
            <Ionicons name="book" size={18} color={accentColor} style={styles.metricIcon} />
            <Text style={[styles.metricValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{completedLessons}</Text>
            <Text style={[styles.metricLabel, { color: themePalette.textSecondary, fontSize: 11.5 * fontScale }]}>Lessons done</Text>
          </View>
          <View style={[styles.metricCard, { borderColor: accentColor + '44' }]}>
            <Ionicons name="people" size={18} color={accentColor} style={styles.metricIcon} />
            <Text style={[styles.metricValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{friendCount}</Text>
            <Text style={[styles.metricLabel, { color: themePalette.textSecondary, fontSize: 11.5 * fontScale }]}>Crew allies</Text>
          </View>
        </View>
        <View style={styles.analyticsRow}>
          <View style={[styles.metricCard, { borderColor: accentColor + '44' }]}>
            <Ionicons name="chatbubbles" size={18} color={accentColor} style={styles.metricIcon} />
            <Text style={[styles.metricValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{zonePosts.length}</Text>
            <Text style={[styles.metricLabel, { color: themePalette.textSecondary, fontSize: 11.5 * fontScale }]}>Zone posts</Text>
          </View>
          <View style={[styles.metricCard, { borderColor: accentColor + '44' }]}>
            <Ionicons name="layers" size={18} color={accentColor} style={styles.metricIcon} />
            <Text style={[styles.metricValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{collaborationThreads.length}</Text>
            <Text style={[styles.metricLabel, { color: themePalette.textSecondary, fontSize: 11.5 * fontScale }]}>Projects</Text>
          </View>
          <View style={[styles.metricCard, { borderColor: accentColor + '44' }]}>
            <Ionicons name="shield-checkmark" size={18} color={accentColor} style={styles.metricIcon} />
            <Text style={[styles.metricValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{stryke.stats.trust}</Text>
            <Text style={[styles.metricLabel, { color: themePalette.textSecondary, fontSize: 11.5 * fontScale }]}>Trust score</Text>
          </View>
        </View>
      </NeonCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 12,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    lineHeight: 20,
    marginBottom: 18,
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
  },
  swatchButton: {
    marginBottom: 12,
  },
  lastSwatch: {
    marginBottom: 0,
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
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  metricIcon: {
    marginBottom: 6,
  },
  metricValue: {
    fontWeight: '700',
  },
  metricLabel: {
    letterSpacing: 0.4,
  },
});

export default SettingsScreen;
