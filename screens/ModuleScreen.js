import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';

const ModuleScreen = ({ title, description, icon, onAction }) => (
  <LinearGradient colors={['#04060F', '#070B1B']} style={styles.background}>
    <View style={styles.overlay}>
      <ModuleCard title={title} description={description} icon={icon}>
        <Text style={styles.bodyText}>
          {`The ${title} module is charging up its neon systems. Tap below to simulate an action while the team crafts the full feature set.`}
        </Text>
        <View style={styles.buttonWrap}>
          <NeonButton label={`Engage ${title}`} onPress={onAction} />
        </View>
      </ModuleCard>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
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
});

export default ModuleScreen;
