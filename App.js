import 'react-native-gesture-handler';
import React, { useMemo } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import ModuleScreen from './screens/ModuleScreen';
import NeonDrawerContent from './components/NeonDrawerContent';
import { getAllModules } from './lib/localModuleData';

const Drawer = createDrawerNavigator();

const normalizeModuleConfig = (module) => {
  if (!module) {
    return null;
  }

  const routeName = module.routeName || module.moduleKey || module.key || module.title;

  if (!routeName) {
    return null;
  }

  const normalizedKey = module.moduleKey || module.key || routeName;
  const title = module.title || module.name || routeName;

  return {
    routeName,
    moduleKey: normalizedKey,
    title,
    description: module.description || module.summary || '',
    icon: module.icon || 'sparkles-outline',
    actionLabel: module.actionLabel || `Engage ${title}`,
  };
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: '#070A15',
    text: '#E8F6FF',
    border: 'rgba(64, 89, 129, 0.4)',
    primary: '#5FFFE3',
  },
};

const App = () => {
  const moduleConfigs = useMemo(() => {
    const modules = getAllModules();
    const normalizedModules = modules
      .map((module) => normalizeModuleConfig(module))
      .filter((module) => module !== null);

    const uniqueModules = [];
    const seenRoutes = new Set();

    normalizedModules.forEach((module) => {
      if (!seenRoutes.has(module.routeName)) {
        seenRoutes.add(module.routeName);
        uniqueModules.push(module);
      }
    });

    return uniqueModules;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={['#03050B', '#020309']} style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <Drawer.Navigator
              initialRouteName="Home"
              drawerContent={(props) => <NeonDrawerContent {...props} />}
              screenOptions={{
                headerTintColor: '#D7F8FF',
                headerTitleStyle: {
                  letterSpacing: 2,
                  fontWeight: '700',
                },
                headerStyle: {
                  backgroundColor: '#050811',
                  borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
                  borderBottomColor: 'rgba(90, 134, 255, 0.3)',
                  shadowColor: 'transparent',
                  elevation: 0,
                },
                drawerType: 'slide',
                overlayColor: 'rgba(31, 242, 210, 0.08)',
                drawerActiveTintColor: '#57FFE7',
                drawerInactiveTintColor: 'rgba(190, 215, 255, 0.6)',
                drawerStyle: {
                  backgroundColor: 'transparent',
                  width: 280,
                },
                sceneContainerStyle: {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: 'Vyral Home',
                  drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
                }}
              />
              {moduleConfigs.map((module) => (
                <Drawer.Screen
                  key={module.routeName}
                  name={module.routeName}
                  component={ModuleScreen}
                  initialParams={{
                    moduleKey: module.moduleKey,
                    fallbackTitle: module.title,
                    fallbackDescription: module.description,
                    fallbackIcon: module.icon,
                    fallbackActionLabel: module.actionLabel,
                  }}
                  options={{
                    title: module.title,
                    drawerIcon: ({ color, size }) => <Ionicons name={module.icon} color={color} size={size} />,
                  }}
                />
              ))}
            </Drawer.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default App;
