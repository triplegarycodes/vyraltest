import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VyralLogo from '../components/VyralLogo';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';
import { getAllModules } from '../lib/localModuleData';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const modules = useMemo(() => getAllModules(), []);

  const handleLaunch = (module) => {
    const routeName = module.routeName || module.title || module.key;

    if (!routeName) {
      return;
    }

    navigation.navigate(routeName, {
      moduleKey: module.moduleKey || module.key || routeName,
      fallbackTitle: module.title || module.name || module.key,
      fallbackDescription: module.description,
      fallbackIcon: module.icon,
      fallbackActionLabel: module.actionLabel,
    });
  };

  const modulesToRender = modules.length > 0 ? modules : [];

  return (
    <LinearGradient colors={['#050712', '#060B1A', '#020408']} style={styles.background}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40 }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <VyralLogo />
        <Text style={styles.tagline}>Plug into the neon network. Power every mission.</Text>
        <View style={styles.modulesWrap}>
          {modulesToRender.length === 0 ? (
            <Text style={styles.emptyText}>No modules available at the moment.</Text>
          ) : null}
          {modulesToRender.map((module) => (
            <ModuleCard
              key={module.id || module.key}
              title={module.title || module.key}
              description={module.description}
              icon={<Ionicons name={module.icon} size={32} color="#6DF7FF" />}
            >
              <NeonButton
                label={module.actionLabel || `Launch ${module.title || module.key}`}
                onPress={() => handleLaunch(module)}
              />
            </ModuleCard>
          ))}
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
    color: 'rgba(166, 210, 255, 0.75)',
    letterSpacing: 1,
  },
  modulesWrap: {
    marginTop: 16,
  },
  emptyText: {
    marginTop: 16,
    color: 'rgba(183, 214, 255, 0.8)',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default HomeScreen;