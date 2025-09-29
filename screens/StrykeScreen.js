import React, { useMemo, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';

const scenario = {
  id: 'trust-signal',
  prompt: 'You intercept a rumor that could damage a friend. Do you amplify it or trace the source?',
  choices: [
    {
      id: 'amplify',
      label: 'Amplify the signal',
      impact: 'The network destabilizes. Trust metrics drop 14%.',
      outcome: 'Amplifying spreads harm. Lyfe XP -40.',
    },
    {
      id: 'trace',
      label: 'Trace the source',
      impact: 'You discover the rumor is seeded. Trust metrics rise 18%.',
      outcome: 'Tracing the source restores safety. Lyfe XP +60.',
    },
  ],
};

const StrykeScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const [selectedChoice, setSelectedChoice] = useState(null);

  const choiceDetails = useMemo(
    () => scenario.choices.find((choice) => choice.id === selectedChoice) || null,
    [selectedChoice]
  );

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="game-controller" size={26} color={accentColor} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Stryke Missions</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Shape the story. Every choice ripples across the grid.</Text>
      <NeonCard>
        <Text style={[styles.promptLabel, { color: accentColor, fontSize: 12 * fontScale }]}>Scenario #{scenario.id}</Text>
        <Text style={[styles.promptText, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{scenario.prompt}</Text>
        <View style={styles.choiceRow}>
          {scenario.choices.map((choice, index) => (
            <NeonButton
              key={choice.id}
              label={choice.label}
              active={choice.id === selectedChoice}
              onPress={() => setSelectedChoice(choice.id)}
              icon={<Ionicons name="sparkles" size={18} color={themePalette.textPrimary} />}
              style={index === scenario.choices.length - 1 ? null : styles.choiceButton}
            />
          ))}
        </View>
      </NeonCard>
      {choiceDetails ? (
        <Animated.View entering={FadeInUp.duration(240)}>
          <NeonCard accent={accentColor}>
            <Text style={[styles.impact, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>
              {choiceDetails.impact}
            </Text>
            <Text style={[styles.outcome, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
              {choiceDetails.outcome}
            </Text>
          </NeonCard>
        </Animated.View>
      ) : null}
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
  promptLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  promptText: {
    lineHeight: 26,
    marginBottom: 20,
    fontWeight: '600',
  },
  choiceRow: {
    flexDirection: 'column',
    marginTop: 12,
  },
  choiceButton: {
    marginBottom: 12,
  },
  impact: {
    fontWeight: '600',
    marginBottom: 10,
  },
  outcome: {
    lineHeight: 20,
  },
});

export default StrykeScreen;
