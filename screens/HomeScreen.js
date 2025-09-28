import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VyralLogo from '../components/VyralLogo';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';
import modules from '../constants/modules';
import { gradients, palette } from '../theme/colors';
import { useNeoMascot } from '../context/NeoMascotContext';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { triggerReaction } = useNeoMascot();
  const entry = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry]);

  const heroStyle = useMemo(
    () => ({
      opacity: entry,
      transform: [
        {
          translateY: entry.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
          }),
        },
      ],
    }),
    [entry],
  );

  const handleLaunch = useCallback(
    (module) => {
      triggerReaction('module-launch');
      navigation.navigate(module.name);
    },
    [navigation, triggerReaction],
  );

  return (
    <LinearGradient colors={gradients.homeBackdrop} style={styles.background}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40 }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Animated.View style={heroStyle}>
          <VyralLogo />
          <Text style={styles.tagline}>Plug into the neon network. Power every mission.</Text>
        </Animated.View>
        <View style={styles.modulesWrap}>
          {modules.map((module, index) => {
            const animatedStyles = {
              opacity: entry,
              transform: [
                {
                  translateY: entry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40 + index * 6, 0],
                  }),
                },
              ],
            };

            return (
              <Animated.View key={module.key} style={animatedStyles}>
                <ModuleCard
                  title={module.title}
                  description={module.summary}
                  icon={<Ionicons name={module.icon} size={32} color={palette.neonAqua} />}
                  accentGradient={module.accentGradient}
                >
                  <NeonButton
                    label={module.actionLabel}
                    onPress={() => handleLaunch(module)}
                    icon={<Ionicons name="navigate" size={18} color="#08101A" />}
                  />
                </ModuleCard>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  tagline: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: palette.textSecondary,
    letterSpacing: 1,
  },
  modulesWrap: {
    marginTop: 16,
  },
});

export default HomeScreen;
