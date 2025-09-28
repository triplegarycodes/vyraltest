import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';
import supabase from '../lib/supabaseClient';
import { getModuleAsset } from '../lib/moduleAssets';

const ModuleScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const moduleKey = route?.params?.moduleKey || route?.name;
  const resolvedModuleKey = useMemo(() => (moduleKey ? String(moduleKey).trim() : ''), [moduleKey]);
  const fallbackTitle = route?.params?.fallbackTitle || resolvedModuleKey || moduleKey;
  const fallbackDescription = route?.params?.fallbackDescription;
  const fallbackIcon = route?.params?.fallbackIcon || 'sparkles-outline';
  const fallbackAssetKey = route?.params?.fallbackAssetKey;
  const fallbackActionLabel = route?.params?.fallbackActionLabel;
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);

  useEffect(() => {
    setActionStatus(null);
  }, [resolvedModuleKey]);

  useEffect(() => {
    let isMounted = true;

    const fetchModule = async () => {
      if (!resolvedModuleKey) {
        if (isMounted) {
          setError('No module key was provided to load data from Supabase.');
          setLoading(false);
        }
        return;
      }

      if (!supabase) {
        if (isMounted) {
          setError('Supabase is not configured. Showing fallback content.');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const moduleSelect =
        'name, title, description, long_description, icon, asset_key, action_label, action_copy, route, slug';
      const columnsToTry = ['name', 'slug', 'key', 'title'];
      let moduleRecord = null;
      let queryError = null;

      for (const column of columnsToTry) {
        const { data, error: columnError } = await supabase
          .from('modules')
          .select(moduleSelect)
          .eq(column, resolvedModuleKey)
          .maybeSingle();

        if (columnError) {
          queryError = columnError;
          const errorMessage = columnError.message?.toLowerCase?.() ?? '';
          const columnMissing =
            errorMessage.includes('column') || errorMessage.includes('does not exist');

          if (columnMissing) {
            queryError = null;
            continue;
          }

          break;
        }

        if (data) {
          moduleRecord = data;
          queryError = null;
          break;
        }
      }

      if (!isMounted) {
        return;
      }

      if (moduleRecord) {
        setModuleData(moduleRecord);
        setError(null);
      } else if (queryError && queryError.message) {
        setModuleData(null);
        setError(queryError.message);
      } else {
        setModuleData(null);
        setError('Module data was not found in Supabase.');
      }
      setLoading(false);
    };

    fetchModule();

    return () => {
      isMounted = false;
    };
  }, [resolvedModuleKey, supabase]);

  const title = moduleData?.title || moduleData?.name || fallbackTitle || 'Module';
  const description = moduleData?.description || fallbackDescription || '';
  const bodyCopy = useMemo(() => {
    if (moduleData?.long_description) {
      return moduleData.long_description;
    }

    if (moduleData?.action_copy) {
      return moduleData.action_copy;
    }

    return `The ${title} module is charging up its neon systems. Tap below to simulate an action while the team crafts the full feature set.`;
  }, [moduleData, title]);

  const resolvedAssetKey =
    moduleData?.asset_key || moduleData?.icon || moduleData?.slug || moduleData?.name || fallbackAssetKey;
  const AssetComponent = getModuleAsset(resolvedAssetKey || resolvedModuleKey);
  const iconName = AssetComponent ? null : moduleData?.icon || fallbackIcon || 'sparkles-outline';
  const actionLabel = moduleData?.action_label || fallbackActionLabel || `Engage ${title}`;

  const handleEngageModule = useCallback(async () => {
    if (actionStatus === 'loading') {
      return;
    }

    if (!resolvedModuleKey || !supabase) {
      setError('Supabase configuration is missing, unable to log actions.');
      return;
    }

    setActionStatus('loading');
    const { error: actionError } = await supabase.from('module_actions').insert({
      module_name: resolvedModuleKey,
      triggered_at: new Date().toISOString(),
    });

    if (actionError) {
      setActionStatus('error');
      setError(actionError.message);
      return;
    }

    setActionStatus('success');
    setError(null);
  }, [actionStatus, resolvedModuleKey, supabase]);

  useEffect(() => {
    if (navigation && title) {
      navigation.setOptions({ title });
    }
  }, [navigation, title]);

  return (
    <LinearGradient colors={['#04060F', '#070B1B']} style={styles.background}>
      <View style={[styles.overlay, { paddingTop: insets.top + 40 }]}>
        <ModuleCard
          title={title}
          description={description}
          icon={
            AssetComponent ? (
              <AssetComponent width={56} height={56} style={styles.moduleIcon} />
            ) : (
              <Ionicons name={iconName} size={34} color="#66F7FF" />
            )
          }
        >
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#66F7FF" />
              <Text style={styles.loadingText}>Loading module intelligence...</Text>
            </View>
          ) : (
            <>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Text style={styles.bodyText}>{bodyCopy}</Text>
              <View style={styles.buttonWrap}>
                <NeonButton label={actionLabel} onPress={handleEngageModule} />
              </View>
              {actionStatus === 'loading' ? (
                <Text style={styles.statusText}>Logging action in Supabase...</Text>
              ) : null}
              {actionStatus === 'success' ? (
                <Text style={styles.successText}>Action logged successfully in Supabase.</Text>
              ) : null}
              {actionStatus === 'error' && !error ? (
                <Text style={styles.errorText}>Unable to log the action. Please try again.</Text>
              ) : null}
            </>
          )}
        </ModuleCard>
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
    color: 'rgba(183, 214, 255, 0.8)',
  },
  buttonWrap: {
    marginTop: 24,
    alignItems: 'flex-start',
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
    width: 56,
    height: 56,
  },
  errorText: {
    marginBottom: 12,
    color: '#FF7E89',
    letterSpacing: 0.6,
  },
  successText: {
    marginTop: 16,
    color: '#5FFFE3',
    letterSpacing: 0.6,
  },
  statusText: {
    marginTop: 12,
    color: 'rgba(166, 210, 255, 0.75)',
    letterSpacing: 0.6,
  },
});

export default ModuleScreen;
