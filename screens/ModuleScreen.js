import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';
import { palette, gradients } from '../theme/colors';
import { moduleMap } from '../constants/modules';
import { useNeoMascot } from '../context/NeoMascotContext';

const ModuleScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const { triggerReaction } = useNeoMascot();
  const entry = useRef(new Animated.Value(0)).current;
  const activeModule = useMemo(
    () => route?.params?.module ?? moduleMap.Core,
    [route?.params?.module],
  );

  useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry]);

  const placeholderCopy = [
    `The ${activeModule.title} module is calibrating advanced systems. Neo logs this rehearsal while engineering`,
    'finalizes the live experience.',
  ].join(' ');

  const handleEngage = useCallback(() => {
    triggerReaction('module-engage');
  }, [triggerReaction]);

  const animatedCard = useMemo(
    () => ({
      opacity: entry,
      transform: [
        {
          translateY: entry.interpolate({
            inputRange: [0, 1],
            outputRange: [36, 0],
          }),
        },
      ],
    }),
    [entry],
  );

  return (
    <LinearGradient colors={gradients.moduleBackdrop} style={styles.background}>
      <View style={[styles.overlay, { paddingTop: insets.top + 40 }]}>
        <Animated.View style={animatedCard}>
          <ModuleCard
            title={activeModule.title}
            description={activeModule.description}
            icon={<Ionicons name={activeModule.icon} size={36} color={palette.neonAqua} />}
            accentGradient={activeModule.accentGradient}
          >
            <Text style={styles.bodyText}>{placeholderCopy}</Text>
            <View style={styles.buttonWrap}>
              <NeonButton
                label={activeModule.actionLabel}
                onPress={handleEngage}
                icon={<Ionicons name="flash" size={18} color="#08101A" />}
              />
            </View>
          </ModuleCard>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: palette.textSecondary,
  },
  buttonWrap: {
    marginTop: 24,
    alignItems: 'flex-start',
  },
});

export default ModuleScreen;
