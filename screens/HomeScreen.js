import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import VyralLogo from '../components/VyralLogo';
import ModuleCard from '../components/ModuleCard';
import NeonButton from '../components/NeonButton';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const modules = [
    { key: 'Core', icon: 'flash', description: 'Mission control and operational intelligence.' },
    { key: 'Zone', icon: 'aperture', description: 'Spatial analytics and live command zones.' },
    { key: 'Tree', icon: 'git-network', description: 'Organizational mapping and lineage tracking.' },
    { key: 'Board', icon: 'grid', description: 'Strategic dashboards and visualization.' },
    { key: 'Stryke', icon: 'rocket', description: 'Revenue acceleration and sales orchestration.' },
  ];

  return (
    <LinearGradient colors={['#050712', '#060B1A', '#020408']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.content}>
        <VyralLogo />
        <Text style={styles.tagline}>Plug into the neon network. Power every mission.</Text>
        <View style={styles.modulesWrap}>
          {modules.map((module) => (
            <ModuleCard
              key={module.key}
              title={module.key}
              description={module.description}
              icon={<Icon name={module.icon} size={32} color="#6DF7FF" />}
            >
              <NeonButton label={`Launch ${module.key}`} onPress={() => navigation.navigate(module.key)} />
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
    paddingTop: 64,
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
});

export default HomeScreen;
