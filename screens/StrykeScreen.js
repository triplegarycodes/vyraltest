import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';
import { useVyralData } from '../context/VyralDataContext';

const statIcons = {
  trust: 'shield-checkmark',
  influence: 'radio',
  stealth: 'moon',
};

const statOrder = [
  { key: 'trust', label: 'Trust' },
  { key: 'influence', label: 'Influence' },
  { key: 'stealth', label: 'Stealth' },
];

const StrykeScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const { strykeScenarios, stryke, chooseStrykeOption, resetStryke } = useVyralData();

  const currentScenario = strykeScenarios.find((scenario) => scenario.id === stryke.currentScenarioId) ?? null;

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="game-controller" size={26} color={accentColor} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Stryke Life Challenge</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Every decision ripples through trust, influence, and stealth. Play deliberate.</Text>

      <NeonCard>
        <Text style={[styles.metricTitle, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>Live metrics</Text>
        <View style={styles.metricRow}>
          {statOrder.map((stat) => (
            <View key={stat.key} style={[styles.metricCell, { borderColor: accentColor + '40' }]}>
              <Ionicons name={statIcons[stat.key]} size={18} color={accentColor} style={styles.metricIcon} />
              <Text style={[styles.metricLabel, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>{stat.label}</Text>
              <Text style={[styles.metricValue, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>
                {stryke.stats[stat.key]}
              </Text>
            </View>
          ))}
        </View>
        {stryke.lastOutcome ? (
          <Animated.View entering={FadeInUp.duration(220)}>
            <View style={[styles.outcomeBanner, { borderColor: accentColor + '55' }]}> 
              <Text style={[styles.outcomeTitle, { color: accentColor, fontSize: 12 * fontScale }]}>Last move</Text>
              <Text style={[styles.outcomeScenario, { color: themePalette.textPrimary, fontSize: 14.5 * fontScale }]}>
                {stryke.lastOutcome.scenarioTitle} · {stryke.lastOutcome.choiceLabel}
              </Text>
              <Text style={[styles.outcomeText, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>
                {stryke.lastOutcome.result}
              </Text>
              <Text style={[styles.outcomeXp, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>+{stryke.lastOutcome.xpAwarded} XP logged</Text>
            </View>
          </Animated.View>
        ) : null}
      </NeonCard>

      {currentScenario ? (
        <Animated.View entering={FadeInDown.duration(220)}>
          <NeonCard accent={accentColor}>
            <Text style={[styles.scenarioLabel, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>Scenario</Text>
            <Text style={[styles.scenarioTitle, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>{currentScenario.title}</Text>
            <Text style={[styles.scenarioNarrative, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
              {currentScenario.narrative}
            </Text>
            <Text style={[styles.scenarioPrompt, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>
              {currentScenario.prompt}
            </Text>
            <View style={styles.choicesWrap}>
              {currentScenario.choices.map((choice) => (
                <NeonButton
                  key={choice.id}
                  label={choice.label}
                  onPress={() => chooseStrykeOption(currentScenario.id, choice.id)}
                  icon={<Ionicons name="flash" size={18} color={themePalette.textPrimary} />}
                  style={styles.choiceButton}
                />
              ))}
            </View>
          </NeonCard>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.duration(220)}>
          <NeonCard accent={accentColor}>
            <Text style={[styles.completeTitle, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>Arc complete</Text>
            <Text style={[styles.completeCopy, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
              You navigated every branch of this Stryke arc. Replay to chase alternate outcomes and stack more XP.
            </Text>
            <NeonButton
              label="Restart challenge"
              onPress={resetStryke}
              active
              icon={<Ionicons name="refresh" size={18} color={themePalette.textPrimary} />}
            />
          </NeonCard>
        </Animated.View>
      )}

      {stryke.history.length > 0 ? (
        <NeonCard>
          <Text style={[styles.historyTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Decision history</Text>
          {stryke.history.map((entry) => (
            <View key={entry.resolvedAt} style={styles.historyRow}>
              <View style={styles.historyHeader}>
                <Text style={[styles.historyScenario, { color: accentColor, fontSize: 13 * fontScale }]}>{entry.scenarioTitle}</Text>
                <Text style={[styles.historyTime, { color: themePalette.textSecondary, fontSize: 11.5 * fontScale }]}>
                  {new Date(entry.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={[styles.historyChoice, { color: themePalette.textPrimary, fontSize: 14 * fontScale }]}>
                {entry.choiceLabel} · +{entry.xpAwarded} XP
              </Text>
              <Text style={[styles.historyResult, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>
                {entry.result}
              </Text>
            </View>
          ))}
        </NeonCard>
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
  metricTitle: {
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricIcon: {
    marginBottom: 6,
  },
  metricLabel: {
    letterSpacing: 0.5,
  },
  metricValue: {
    fontWeight: '700',
  },
  outcomeBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  outcomeTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  outcomeScenario: {
    fontWeight: '600',
    marginTop: 6,
  },
  outcomeText: {
    marginTop: 8,
    lineHeight: 18,
  },
  outcomeXp: {
    marginTop: 10,
  },
  scenarioLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  scenarioTitle: {
    fontWeight: '700',
  },
  scenarioNarrative: {
    marginTop: 8,
    lineHeight: 20,
  },
  scenarioPrompt: {
    marginTop: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  choicesWrap: {
    marginTop: 18,
  },
  choiceButton: {
    marginBottom: 12,
  },
  completeTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  completeCopy: {
    lineHeight: 20,
    marginBottom: 16,
  },
  historyTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  historyRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyScenario: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  historyTime: {
    letterSpacing: 0.4,
  },
  historyChoice: {
    fontWeight: '600',
  },
  historyResult: {
    marginTop: 6,
    lineHeight: 18,
  },
});

export default StrykeScreen;

