import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';
import { getModuleByKey } from '../lib/localModuleData';

const ModuleScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const moduleKey = route?.params?.moduleKey || route?.name;
  const resolvedModuleKey = useMemo(() => (moduleKey ? String(moduleKey).trim() : ''), [moduleKey]);
  const fallbackTitle = route?.params?.fallbackTitle || resolvedModuleKey || moduleKey;
  const fallbackDescription = route?.params?.fallbackDescription;
  const fallbackIcon = route?.params?.fallbackIcon || 'sparkles-outline';
  const fallbackActionLabel = route?.params?.fallbackActionLabel;
  const [actionStatus, setActionStatus] = useState(null);
  const moduleData = useMemo(() => getModuleByKey(resolvedModuleKey), [resolvedModuleKey]);

  useEffect(() => {
    setActionStatus(null);
  }, [resolvedModuleKey]);

  const title = moduleData?.title || moduleData?.name || fallbackTitle || 'Module';
  const description = moduleData?.description || fallbackDescription || '';
  const bodyCopy = useMemo(() => {
    if (moduleData?.longDescription) {
      return moduleData.longDescription;
    }

    if (moduleData?.actionCopy) {
      return moduleData.actionCopy;
    }

    if (fallbackDescription) {
      return fallbackDescription;
    }

    return `The ${title} module is charging up its neon systems. Tap below to simulate an action while the team crafts the full feature set.`;
  }, [fallbackDescription, moduleData, title]);

  const iconName = moduleData?.icon || fallbackIcon || 'sparkles-outline';
  const actionLabel = moduleData?.actionLabel || fallbackActionLabel || `Engage ${title}`;

  const handleEngageModule = useCallback(() => {
    setActionStatus('success');
  }, []);

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
          icon={<Ionicons name={iconName} size={34} color="#66F7FF" />}
        >
          <Text style={styles.bodyText}>{bodyCopy}</Text>
          <View style={styles.buttonWrap}>
            <NeonButton label={actionLabel} onPress={handleEngageModule} />
          </View>
          {actionStatus === 'success' ? (
            <Text style={styles.successText}>Action simulated successfully.</Text>
          ) : null}
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
  successText: {
    marginTop: 16,
    color: '#5FFFE3',
    letterSpacing: 0.6,
  },
});

export default ModuleScreen;
