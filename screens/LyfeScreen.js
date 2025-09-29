import React, { useEffect, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';
import { LESSON_STATUS_MULTIPLIERS, useVyralData } from '../context/VyralDataContext';

const statusLabels = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
};

const nextActionLabel = {
  not_started: 'Begin path',
  in_progress: 'Mark complete',
  completed: 'Reset lesson',
};

const LyfeScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const { lessons, toggleLessonStatus, xp } = useVyralData();

  const grouped = useMemo(() => {
    const catalog = lessons.reduce((acc, lesson) => {
      if (!acc[lesson.category]) {
        acc[lesson.category] = [];
      }
      acc[lesson.category].push(lesson);
      return acc;
    }, {});
    return Object.entries(catalog).map(([category, items]) => ({
      category,
      lessons: items,
    }));
  }, [lessons]);

  const lessonProgress = useMemo(() => {
    const total = lessons.reduce((acc, lesson) => acc + lesson.xp, 0);
    const earned = lessons.reduce(
      (acc, lesson) => acc + Math.round((LESSON_STATUS_MULTIPLIERS[lesson.status] || 0) * lesson.xp),
      0
    );
    return {
      totalXp: total,
      earnedXp: earned,
      ratio: total === 0 ? 0 : earned / total,
    };
  }, [lessons]);

  const progressValue = useSharedValue(lessonProgress.ratio);

  useEffect(() => {
    progressValue.value = withTiming(lessonProgress.ratio, { duration: 420 });
  }, [lessonProgress, progressValue]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.max(10, Math.round(progressValue.value * 100))}%`,
  }));

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="stats-chart" size={26} color={accentColor} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Lyfe Challenges</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Track finance, personal, wellness, and career rituals as you grow XP.</Text>

      <NeonCard>
        <Text style={[styles.progressLabel, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>Total XP synced</Text>
        <Text style={[styles.progressValue, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>{xp} XP</Text>
        <View style={[styles.progressTrack, { backgroundColor: accentColor + '25' }]}>
          <Animated.View style={[styles.progressFill, { backgroundColor: accentColor }, progressStyle]} />
        </View>
        <Text style={[styles.progressDetail, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>Lessons earning {lessonProgress.earnedXp} / {lessonProgress.totalXp} XP</Text>
      </NeonCard>

      {grouped.map((section, sectionIndex) => {
        const totalCategoryXp = section.lessons.reduce((acc, lesson) => acc + lesson.xp, 0);
        const earnedCategoryXp = section.lessons.reduce(
          (acc, lesson) => acc + Math.round((LESSON_STATUS_MULTIPLIERS[lesson.status] || 0) * lesson.xp),
          0
        );
        const ratio = totalCategoryXp === 0 ? 0 : earnedCategoryXp / totalCategoryXp;
        return (
          <Animated.View key={section.category} entering={FadeInDown.delay(sectionIndex * 70)}>
            <NeonCard accent={accentColor}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>
                  {section.category}
                </Text>
                <View style={styles.sectionStats}>
                  <Ionicons name="flash" size={16} color={accentColor} style={styles.sectionIcon} />
                  <Text style={[styles.sectionXp, { color: themePalette.textPrimary, fontSize: 13 * fontScale }]}>
                    {earnedCategoryXp} / {totalCategoryXp} XP
                  </Text>
                </View>
              </View>
              <View style={[styles.sectionProgressTrack, { backgroundColor: accentColor + '22' }]}>
                <View style={[styles.sectionProgressFill, { backgroundColor: accentColor, width: `${Math.max(8, ratio * 100)}%` }]} />
              </View>
              {section.lessons.map((lesson) => {
                const status = statusLabels[lesson.status];
                return (
                  <View key={lesson.id} style={styles.lessonRow}>
                    <View style={styles.lessonCopy}>
                      <Text style={[styles.lessonTitle, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>
                        {lesson.title}
                      </Text>
                      <Text style={[styles.lessonDescription, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>
                        {lesson.description}
                      </Text>
                      <View style={styles.lessonStatusRow}>
                        <Ionicons name="ellipse" size={12} color={accentColor} style={styles.lessonStatusIcon} />
                        <Text style={[styles.lessonStatus, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>
                          {status}
                        </Text>
                      </View>
                    </View>
                    <NeonButton
                      label={nextActionLabel[lesson.status]}
                      onPress={() => toggleLessonStatus(lesson.id)}
                      active={lesson.status === 'completed'}
                      icon={<Ionicons name="sparkles" size={18} color={themePalette.textPrimary} />}
                      style={styles.lessonButton}
                    />
                  </View>
                );
              })}
            </NeonCard>
          </Animated.View>
        );
      })}
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
  progressValue: {
    fontWeight: '700',
    marginTop: 6,
  },
  progressTrack: {
    height: 14,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 16,
  },
  progressDetail: {
    letterSpacing: 0.4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  sectionStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionXp: {
    fontWeight: '600',
  },
  sectionProgressTrack: {
    height: 6,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sectionProgressFill: {
    height: '100%',
    borderRadius: 10,
  },
  lessonRow: {
    marginBottom: 18,
  },
  lessonCopy: {
    marginBottom: 12,
  },
  lessonTitle: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  lessonDescription: {
    marginTop: 6,
    lineHeight: 20,
  },
  lessonStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  lessonStatusIcon: {
    marginRight: 6,
  },
  lessonStatus: {
    letterSpacing: 0.5,
  },
  lessonButton: {
    alignSelf: 'flex-start',
  },
});

export default LyfeScreen;

