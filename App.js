import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import ModuleScreen from './screens/ModuleScreen';
import CoreScreen from './CoreScreen';
import LyfeScreen from './LyfeScreen';
import NeonDrawerContent from './components/NeonDrawerContent';
import { NeoMascotProvider } from './context/NeoMascotContext';
import { getAllModules } from './lib/localModuleData';

const Drawer = createDrawerNavigator();

const dedicatedModuleComponents = {
  Core: CoreScreen,
  Lyfe: LyfeScreen,
};

const fallbackModules = getAllModules();

const neonNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#04060F',
    card: '#050A1C',
    primary: '#6DF7FF',
    text: '#E6F7FF',
    border: 'rgba(77, 115, 160, 0.4)',
    notification: '#7FFFD4',
  },
};

const baseDrawerEntries = [
  {
    key: 'Home',
    title: 'Mission Hub',
    description: 'Return to the neon network command console.',
    icon: 'home-outline',
    component: HomeScreen,
  },
];

const normalizeModule = (module) => {
  if (!module) {
    return null;
  }

  const routeName = module.routeName || module.moduleKey || module.key || module.title || module.name;

  if (!routeName) {
    return null;
  }

  const normalizedRoute = String(routeName).trim();
  const title = module.title || module.name || normalizedRoute;
  const description = module.description || module.subtitle || '';
  const icon = module.icon || 'sparkles-outline';
  const moduleKey = module.moduleKey || module.key || normalizedRoute;

  return {
    key: normalizedRoute,
    title,
    description,
    icon,
    moduleKey,
    actionLabel: module.actionLabel,
  };
};

const buildModuleConfigs = (remoteModules = []) => {
  const moduleMap = new Map();

  const addModule = (module) => {
    const normalized = normalizeModule(module);

    if (!normalized) {
      return;
    }

    const component = dedicatedModuleComponents[normalized.key] || ModuleScreen;

    moduleMap.set(normalized.key, {
      ...normalized,
      component,
      initialParams: {
        moduleKey: normalized.moduleKey,
        fallbackTitle: normalized.title,
        fallbackDescription: normalized.description,
        fallbackIcon: normalized.icon,
        fallbackActionLabel: normalized.actionLabel,
      },
    });
  };

  fallbackModules.forEach(addModule);
  remoteModules.forEach(addModule);

  const orderedKeys = [
    'Core',
    'Zone',
    'Tree',
    'Board',
    'Stryke',
    'Skrybe',
    'Lyfe',
    'Vshop',
  ];

  const orderedConfigs = orderedKeys
    .map((key) => moduleMap.get(key))
    .filter(Boolean);

  const remainingConfigs = Array.from(moduleMap.entries())
    .filter(([key]) => !orderedKeys.includes(key))
    .map(([, config]) => config)
    .sort((a, b) => a.title.localeCompare(b.title));

  return [...orderedConfigs, ...remainingConfigs];
};

const DrawerLabel = ({ title, description, color }) => (
  <View style={styles.drawerLabelContainer}>
    <Text style={[styles.drawerLabelTitle, { color }]}>{title}</Text>
    {description ? (
      <Text style={styles.drawerLabelDescription}>{description}</Text>
    ) : null}
  </View>
);

const AppNavigator = ({ moduleConfigs }) => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => <NeonDrawerContent {...props} />}
    screenOptions={{
      headerTintColor: '#E6F7FF',
      headerTitleStyle: { fontWeight: '700', letterSpacing: 1 },
      headerStyle: { backgroundColor: '#050A1C', borderBottomWidth: 0 },
      drawerType: 'front',
      drawerStyle: { backgroundColor: '#05070F', width: 300 },
      drawerActiveTintColor: '#6DF7FF',
      drawerInactiveTintColor: 'rgba(169, 194, 255, 0.85)',
      drawerItemStyle: { borderRadius: 14, marginVertical: 4 },
    }}
  >
    {baseDrawerEntries.map((entry) => (
      <Drawer.Screen
        key={entry.key}
        name={entry.key}
        component={entry.component}
        options={{
          title: entry.title,
          drawerLabel: ({ color }) => (
            <DrawerLabel title={entry.title} description={entry.description} color={color} />
          ),
          drawerIcon: ({ color, size }) => (
            <Ionicons name={entry.icon} size={size} color={color} />
          ),
        }}
      />
    ))}
    {moduleConfigs.map((moduleConfig) => (
      <Drawer.Screen
        key={moduleConfig.key}
        name={moduleConfig.key}
        component={moduleConfig.component}
        initialParams={moduleConfig.initialParams}
        options={{
          title: moduleConfig.title,
          drawerLabel: ({ color }) => (
            <DrawerLabel
              title={moduleConfig.title}
              description={moduleConfig.description}
              color={color}
            />
          ),
          drawerIcon: ({ color, size }) => (
            <Ionicons name={moduleConfig.icon} size={size} color={color} />
          ),
        }}
      />
    ))}
  </Drawer.Navigator>
);

const App = () => {
  const [remoteModules] = useState([]);

  const moduleConfigs = useMemo(
    () => buildModuleConfigs(remoteModules),
    [remoteModules],
  );

  return (
    <SafeAreaProvider>
      <NeoMascotProvider>
        <NavigationContainer theme={neonNavTheme}>
          <AppNavigator moduleConfigs={moduleConfigs} />
        </NavigationContainer>
      </NeoMascotProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  drawerLabelContainer: {
    flexDirection: 'column',
  },
  drawerLabelTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  drawerLabelDescription: {
    fontSize: 11,
    color: 'rgba(173, 204, 255, 0.75)',
    marginTop: 2,
  },
});

export default App;
