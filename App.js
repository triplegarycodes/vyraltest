import 'react-native-gesture-handler';
import React, { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { NeonThemeProvider, useNeonTheme } from './context/NeonThemeContext';
import CoreScreen from './screens/CoreScreen';
import LyfeScreen from './screens/LyfeScreen';
import StrykeScreen from './screens/StrykeScreen';
import TreeScreen from './screens/TreeScreen';
import ZoneScreen from './screens/ZoneScreen';
import SkrybeScreen from './screens/SkrybeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const iconMap = {
  Core: 'chatbubbles',
  Lyfe: 'stats-chart',
  Stryke: 'game-controller',
  Tree: 'git-branch',
  Zone: 'people',
  Skrybe: 'document-text',
  Settings: 'options',
};

const DrawerNavigator = () => {
  const { themeMode, themePalette, accentColor } = useNeonTheme();

  const navigationTheme = useMemo(() => {
    const base = themeMode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: themePalette.background,
        card: themePalette.surface,
        text: themePalette.textPrimary,
        primary: accentColor,
        border: themePalette.border,
      },
    };
  }, [themeMode, themePalette, accentColor]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          drawerActiveTintColor: accentColor,
          drawerInactiveTintColor: themePalette.textSecondary,
          drawerStyle: { backgroundColor: themePalette.overlay },
          drawerLabelStyle: { fontSize: 15, fontWeight: '600' },
          sceneContainerStyle: { backgroundColor: themePalette.background },
          drawerIcon: ({ color, size }) => (
            <Ionicons name={iconMap[route.name] || 'ellipse'} color={color} size={size} />
          ),
        })}
      >
        <Drawer.Screen name="Core" component={CoreScreen} />
        <Drawer.Screen name="Lyfe" component={LyfeScreen} />
        <Drawer.Screen name="Stryke" component={StrykeScreen} />
        <Drawer.Screen name="Tree" component={TreeScreen} />
        <Drawer.Screen name="Zone" component={ZoneScreen} />
        <Drawer.Screen name="Skrybe" component={SkrybeScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const ThemedStatusBar = () => {
  const { themeMode } = useNeonTheme();
  return <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NeonThemeProvider>
          <ThemedStatusBar />
          <DrawerNavigator />
        </NeonThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
