import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VyralLogo from '../components/VyralLogo';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';
import supabase from '../lib/supabaseClient';
import { getModuleAsset } from '../lib/moduleAssets';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const fallbackModules = useMemo(
    () => [
      {
        key: 'Stryke',
        title: 'Stryke',
        assetKey: 'stryke',
        description: 'Revenue acceleration and sales orchestration.',
        actionLabel: 'Launch Stryke',
        routeName: 'Stryke',
        moduleKey: 'Stryke',
      },
      {
        key: 'Core',
        title: 'Core',
        assetKey: 'core',
        description: 'Mission control and operational intelligence.',
        actionLabel: 'Launch Core',
        routeName: 'Core',
        moduleKey: 'Core',
      },
      {
        key: 'Zone',
        title: 'Zone',
        assetKey: 'zone',
        description: 'Spatial analytics and live command zones.',
        actionLabel: 'Launch Zone',
        routeName: 'Zone',
        moduleKey: 'Zone',
      },
      {
        key: 'Skrybe',
        title: 'Skrybe',
        assetKey: 'skrybe',
        description: 'Intelligent documentation and narrative systems.',
        actionLabel: 'Launch Skrybe',
        routeName: 'Skrybe',
        moduleKey: 'Skrybe',
      },
      {
        key: 'Lyfe',
        title: 'Lyfe',
        assetKey: 'lyfe',
        description: 'Growth analytics and momentum tracking.',
        actionLabel: 'Launch Lyfe',
        routeName: 'Lyfe',
        moduleKey: 'Lyfe',
      },
      {
        key: 'Tree',
        title: 'Tree',
        assetKey: 'tree',
        description: 'Organizational mapping and lineage tracking.',
        actionLabel: 'Launch Tree',
        routeName: 'Tree',
        moduleKey: 'Tree',
      },
      {
        key: 'Board',
        title: 'Board',
        assetKey: 'board',
        description: 'Strategic dashboards and visualization.',
        actionLabel: 'Launch Board',
        routeName: 'Board',
        moduleKey: 'Board',
      },
      {
        key: 'Vshop',
        title: 'Vshop',
        assetKey: 'vshop',
        description: 'Commerce acceleration and monetization.',
        actionLabel: 'Launch Vshop',
        routeName: 'Vshop',
        moduleKey: 'Vshop',
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
        .select('id, key, name, title, description, icon, asset_key, route, slug, action_label, sort_order');

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
          const assetKey =
            module.asset_key || module.icon || module.slug || module.key || module.name || routeName;

          return {
            id: module.id ?? moduleKey ?? routeName,
            title: module.title || module.name || module.key || 'Module',
            description: module.description || '',
            assetKey,
            routeName,
            moduleKey,
            actionLabel: module.action_label,
            icon: module.icon,
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
      fallbackAssetKey: module.assetKey || module.icon || module.key,
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
          {modulesToRender.map((module) => {
            const AssetComponent = getModuleAsset(module.assetKey || module.icon || module.key);
            const iconElement = AssetComponent ? (
              <AssetComponent width={52} height={52} style={styles.moduleIcon} />
            ) : (
              <Ionicons name={module.icon || 'sparkles-outline'} size={32} color="#6DF7FF" />
            );

            return (
              <ModuleCard
                key={module.id || module.key}
                title={module.title || module.key}
                description={module.description}
                icon={iconElement}
              >
                <NeonButton
                  label={module.actionLabel || `Launch ${module.title || module.key}`}
                  onPress={() => handleLaunch(module)}
                />
              </ModuleCard>
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
  moduleIcon: {
    width: 52,
    height: 52,
  },
  errorText: {
    marginBottom: 12,
    color: '#FF7E89',
    letterSpacing: 0.6,
  },
  emptyText: {
    color: 'rgba(166, 210, 255, 0.75)',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default HomeScreen;