import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VyralLogo from '../components/VyralLogo';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';
import supabase from '../lib/supabaseClient';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const fallbackModules = useMemo(
    () => [
      {
        key: 'Core',
        icon: 'flash-outline',
        description: 'Mission control and operational intelligence.',
        actionLabel: 'Launch Core',
        routeName: 'Core',
        moduleKey: 'Core',
      },
      {
        key: 'Zone',
        icon: 'planet-outline',
        description: 'Spatial analytics and live command zones.',
        actionLabel: 'Launch Zone',
        routeName: 'Zone',
        moduleKey: 'Zone',
      },
      {
        key: 'Tree',
        icon: 'git-branch-outline',
        description: 'Organizational mapping and lineage tracking.',
        actionLabel: 'Launch Tree',
        routeName: 'Tree',
        moduleKey: 'Tree',
      },
      {
        key: 'Board',
        icon: 'grid-outline',
        description: 'Strategic dashboards and visualization.',
        actionLabel: 'Launch Board',
        routeName: 'Board',
        moduleKey: 'Board',
      },
      {
        key: 'Stryke',
        icon: 'rocket-outline',
        description: 'Revenue acceleration and sales orchestration.',
        actionLabel: 'Launch Stryke',
        routeName: 'Stryke',
        moduleKey: 'Stryke',
      },
    ],
    [],
  );
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchModules = async () => {
      if (!supabase) {
        if (isMounted) {
          setError('Supabase is not configured. Using local module definitions.');
          setModules(fallbackModules.map((module) => ({ ...module })));
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const { data, error: queryError } = await supabase
        .from('modules')
        .select('id, key, name, title, description, icon, route, slug, action_label, sort_order');

      if (!isMounted) {
        return;
      }

      if (queryError) {
        setError(queryError.message);
        setModules(fallbackModules.map((module) => ({ ...module })));
      } else if (data && data.length > 0) {
        const sortedData = [...data].sort((a, b) => {
          const orderA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
          const orderB = b.sort_order ?? Number.MAX_SAFE_INTEGER;

          if (orderA !== orderB) {
            return orderA - orderB;
          }

          const nameA = (a.title || a.name || a.key || '').toLowerCase();
          const nameB = (b.title || b.name || b.key || '').toLowerCase();

          return nameA.localeCompare(nameB);
        });

        const normalized = sortedData.map((module) => {
          const routeName = module.route || module.name || module.title || module.key;
          const moduleKey = module.slug || module.key || module.name || routeName;

          return {
            id: module.id ?? moduleKey ?? routeName,
            title: module.title || module.name || module.key || 'Module',
            description: module.description || '',
            icon: module.icon || 'sparkles-outline',
            routeName,
            moduleKey,
            actionLabel: module.action_label,
          };
        });

        setModules(normalized);
        setError(null);
      } else {
        setModules(fallbackModules.map((module) => ({ ...module })));
        setError('No modules were returned from Supabase. Showing defaults.');
      }
      setLoading(false);
    };

    fetchModules();

    return () => {
      isMounted = false;
    };
  }, [fallbackModules, supabase]);

  const handleLaunch = (module) => {
    const routeName = module.routeName || module.title || module.key;

    if (!routeName) {
      setError('Unable to determine the navigation route for this module.');
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

  const modulesToRender = modules.length > 0 ? modules : !loading ? fallbackModules : [];

  return (
    <LinearGradient colors={['#050712', '#060B1A', '#020408']} style={styles.background}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40 }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <VyralLogo />
        <Text style={styles.tagline}>Plug into the neon network. Power every mission.</Text>
        <View style={styles.modulesWrap}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#6DF7FF" />
              <Text style={styles.loadingText}>Loading modules from Supabase...</Text>
            </View>
          ) : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {!loading && modulesToRender.length === 0 ? (
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
  loadingWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    color: 'rgba(166, 210, 255, 0.75)',
    letterSpacing: 0.6,
  },
  errorText: {
    marginBottom: 12,
    color: '#FF7E89',
    letterSpacing: 0.6,
  },
  emptyText: {
    marginTop: 16,
    color: 'rgba(183, 214, 255, 0.8)',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default HomeScreen;