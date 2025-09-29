import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import { useNeonTheme } from '../context/NeonThemeContext';
import { useVyralData } from '../context/VyralDataContext';

const milestoneLabel = (xp) => {
  if (xp >= 1800) return 'Neon Forest Architect';
  if (xp >= 1200) return 'Luminary Growth Keeper';
  if (xp >= 800) return 'Branch Weaver';
  if (xp >= 400) return 'Seedling in Bloom';
  return 'Sprouting Roots';
};

const TreeScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const { xp, lessons, stryke, zonePosts, collaborationThreads } = useVyralData();

  const analytics = useMemo(() => {
    const completedLessons = lessons.filter((lesson) => lesson.status === 'completed');
    const activeLessons = lessons.filter((lesson) => lesson.status === 'in_progress');
    const branchScore = completedLessons.length * 2 + stryke.history.length + collaborationThreads.length;
    const fruitScore = Math.max(1, completedLessons.length + Math.floor(zonePosts.length / 2));
    const acornScore = Math.max(0, activeLessons.length + Math.floor(xp / 250));
    const treeCount = Math.max(1, Math.floor(xp / 600) + 1);
    return {
      completedLessons,
      activeLessons,
      branchScore,
      fruitScore,
      acornScore,
      treeCount,
    };
  }, [lessons, stryke, zonePosts, collaborationThreads, xp]);

  const blueprints = useMemo(() => {
    return Array.from({ length: analytics.treeCount }).map((_, index) => {
      const branchBase = Math.max(3, Math.round(analytics.branchScore / analytics.treeCount) + index);
      const fruitBase = Math.max(2, Math.round(analytics.fruitScore / analytics.treeCount) + (index % 2));
      const acornBase = Math.max(1, Math.round(analytics.acornScore / analytics.treeCount) || 0) + (index === analytics.treeCount - 1 ? 1 : 0);
      return {
        id: `tree-${index}`,
        branches: branchBase,
        fruits: fruitBase,
        acorns: acornBase,
      };
    });
  }, [analytics]);

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="git-branch" size={26} color={accentColor} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Growth Tree</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Every completed ritual grows branches, fruits, and acorns across the Vyral forest.</Text>

      <NeonCard>
        <Text style={[styles.summaryLabel, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>Growth summary</Text>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryMetric, { borderColor: accentColor + '44' }]}>
            <Ionicons name="flash" size={18} color={accentColor} style={styles.summaryIcon} />
            <Text style={[styles.summaryTitle, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>XP</Text>
            <Text style={[styles.summaryValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{xp}</Text>
          </View>
          <View style={[styles.summaryMetric, { borderColor: accentColor + '44' }]}>
            <Ionicons name="leaf" size={18} color={accentColor} style={styles.summaryIcon} />
            <Text style={[styles.summaryTitle, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>Branches</Text>
            <Text style={[styles.summaryValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{analytics.branchScore}</Text>
          </View>
          <View style={[styles.summaryMetric, { borderColor: accentColor + '44' }]}>
            <Ionicons name="planet" size={18} color={accentColor} style={styles.summaryIcon} />
            <Text style={[styles.summaryTitle, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>Fruits</Text>
            <Text style={[styles.summaryValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{analytics.fruitScore}</Text>
          </View>
        </View>
        <Text style={[styles.milestone, { color: accentColor, fontSize: 14 * fontScale }]}>{milestoneLabel(xp)}</Text>
        <Text style={[styles.summaryCopy, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>
          {analytics.completedLessons.length} lessons completed · {analytics.activeLessons.length} tending · {zonePosts.length} community pulses · {collaborationThreads.length} projects.
        </Text>
      </NeonCard>

      {blueprints.map((blueprint, index) => (
        <Animated.View key={blueprint.id} entering={FadeInDown.delay(index * 90)}>
          <NeonCard accent={accentColor}>
            <Text style={[styles.treeTitle, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>Tree #{index + 1}</Text>
            <Text style={[styles.treeSubtitle, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>Branches {blueprint.branches} · Fruits {blueprint.fruits} · Acorns {blueprint.acorns}</Text>
            <View style={styles.treeCanvas}>
              <View style={[styles.trunk, { backgroundColor: accentColor + '33' }]} />
              <View style={styles.branchContainer}>
                {Array.from({ length: blueprint.branches }).map((_, branchIndex) => {
                  const angle = -38 + (branchIndex / Math.max(1, blueprint.branches - 1)) * 76;
                  const width = 100 - branchIndex * 4;
                  return (
                    <View
                      key={`branch-${branchIndex}`}
                      style={[
                        styles.branch,
                        {
                          width,
                          backgroundColor: accentColor + '4A',
                          transform: [
                            { translateY: -(branchIndex * 16 + 20) },
                            { rotate: `${angle}deg` },
                          ],
                        },
                      ]}
                    />
                  );
                })}
              </View>
              {Array.from({ length: blueprint.fruits }).map((_, fruitIndex) => {
                const radius = 48;
                const angle = (Math.PI * fruitIndex) / Math.max(1, blueprint.fruits - 1) - Math.PI / 2;
                const centerX = 110;
                const baseY = 90;
                const left = centerX + Math.cos(angle) * radius;
                const top = baseY + Math.sin(angle) * radius;
                return (
                  <View
                    key={`fruit-${fruitIndex}`}
                    style={[
                      styles.fruit,
                      {
                        left,
                        top,
                        borderColor: accentColor,
                        backgroundColor: accentColor + '40',
                      },
                    ]}
                  />
                );
              })}
              {Array.from({ length: blueprint.acorns }).map((_, acornIndex) => {
                const spread = 90;
                const segments = Math.max(1, blueprint.acorns - 1);
                const ratio = blueprint.acorns === 1 ? 0.5 : acornIndex / segments;
                const left = 110 - spread / 2 + spread * ratio;
                return (
                  <View
                    key={`acorn-${acornIndex}`}
                    style={[
                      styles.acorn,
                      {
                        left,
                        borderBottomColor: accentColor,
                      },
                    ]}
                  />
                );
              })}
            </View>
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
  summaryLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
  },
  summaryMetric: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryIcon: {
    marginBottom: 6,
  },
  summaryTitle: {
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontWeight: '700',
  },
  milestone: {
    fontWeight: '700',
    marginTop: 8,
  },
  summaryCopy: {
    marginTop: 10,
    lineHeight: 20,
  },
  treeTitle: {
    fontWeight: '600',
  },
  treeSubtitle: {
    marginTop: 4,
    lineHeight: 18,
  },
  treeCanvas: {
    height: 220,
    width: 220,
    alignSelf: 'center',
    marginTop: 18,
    position: 'relative',
  },
  trunk: {
    position: 'absolute',
    bottom: 30,
    left: 102,
    width: 16,
    height: 130,
    borderRadius: 10,
  },
  branchContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  branch: {
    height: 4,
    borderRadius: 4,
    alignSelf: 'center',
  },
  fruit: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
  },
  acorn: {
    position: 'absolute',
    bottom: 18,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default TreeScreen;

