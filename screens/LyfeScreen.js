import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';

const initialLessons = [
  { id: 1, title: 'Signal Safety Check', description: 'Practice active consent language in every thread.', xp: 90, complete: true },
  { id: 2, title: 'Empathy Boost', description: 'Role-play a scenario with a trusted ally.', xp: 120, complete: false },
  { id: 3, title: 'Boundaries Broadcast', description: 'Create a shareable boundary statement.', xp: 150, complete: false },
];

const LyfeScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const [lessons, setLessons] = useState(initialLessons);

  const progress = useMemo(() => {
    const completedXp = lessons.filter((lesson) => lesson.complete).reduce((acc, lesson) => acc + lesson.xp, 0);
    const totalXp = lessons.reduce((acc, lesson) => acc + lesson.xp, 0);
    return totalXp === 0 ? 0 : completedXp / totalXp;
  }, [lessons]);

  const xpTotal = lessons.reduce((acc, lesson) => acc + (lesson.complete ? lesson.xp : 0), 0);

  const progressValue = useSharedValue(progress);

  useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 420 });
  }, [progress, progressValue]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, Math.max(12, progressValue.value * 100))}%`,
  }));

  const toggleLesson = (id) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id
          ? {
              ...lesson,
              complete: !lesson.complete,
            }
          : lesson
      )
    );
  };

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="stats-chart" color={accentColor} size={26} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Lyfe Progress</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Power up your wellness quests and cash in XP.</Text>
      <NeonCard>
        <Text style={[styles.progressLabel, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>Mission completion</Text>
        <View style={[styles.progressTrack, { backgroundColor: accentColor + '20' }]}> 
          <Animated.View style={[styles.progressFill, { backgroundColor: accentColor }, progressStyle]} />
        </View>
        <Text style={[styles.progressValue, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>XP synced: {xpTotal}</Text>
      </NeonCard>
      {lessons.map((lesson) => (
        <Animated.View key={lesson.id} entering={FadeInDown.delay(lesson.id * 40)}>
          <NeonCard accent={lesson.complete ? accentColor : undefined}>
            <View style={styles.lessonHeader}>
              <View>
                <Text style={[styles.lessonTitle, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{lesson.title}</Text>
                <Text style={[styles.lessonDescription, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
                  {lesson.description}
                </Text>
              </View>
              <View style={styles.xpTag}>
                <Ionicons name="flash" color={accentColor} size={16} style={styles.xpIcon} />
                <Text style={[styles.xpText, { color: themePalette.textPrimary, fontSize: 13 * fontScale }]}>{lesson.xp} XP</Text>
              </View>
            </View>
            <NeonButton
              label={lesson.complete ? 'Mark as in progress' : 'Mark complete'}
              active={lesson.complete}
              onPress={() => toggleLesson(lesson.id)}
              icon={<Ionicons name={lesson.complete ? 'checkmark-done' : 'play'} size={18} color={themePalette.textPrimary} />}
              style={styles.lessonButton}
            />
          </NeonCard>
        </Animated.View>
      ))}
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
  progressLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressTrack: {
    height: 12,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 12,
  },
  progressValue: {
    fontWeight: '600',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  xpTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  lessonTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lessonDescription: {
    marginTop: 4,
    lineHeight: 20,
  },
  xpText: {
    fontWeight: '600',
  },
  xpIcon: {
    marginRight: 6,
  },
  lessonButton: {
    marginTop: 4,
  },
});

export default LyfeScreen;
