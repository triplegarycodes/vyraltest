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
import SettingsScreen from './screens/SettingsScreen';
import SkrybeScreen from './screens/SkrybeScreen';

const Drawer = createDrawerNavigator();

const iconMap = {
  Core: 'chatbubbles',
  Lyfe: 'bar-chart',
  Stryke: 'game-controller',
  Tree: 'git-branch',
  Zone: 'people',
  Settings: 'options',
  Skrybe: 'document-text',
};

const DrawerNavigator = () => {
  const { themePalette, accentColor, themeMode } = useNeonTheme();

  const navigationTheme = useMemo(() => {
    const base = themeMode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: themePalette.background,
        card: themePalette.surface,
        primary: accentColor,
        text: themePalette.textPrimary,
        border: themePalette.border,
      },
    };
  }, [accentColor, themeMode, themePalette]);

  return (
    <>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={navigationTheme}>
        <Drawer.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            drawerType: 'front',
            drawerStyle: {
              backgroundColor: themePalette.overlay,
            },
            drawerActiveTintColor: accentColor,
            drawerInactiveTintColor: themePalette.textSecondary,
            drawerLabelStyle: {
              fontSize: 15,
              letterSpacing: 0.6,
            },
            drawerIcon: ({ color, size }) => (
              <Ionicons name={iconMap[route.name] ?? 'ellipse'} size={size} color={color} />
            ),
            sceneContainerStyle: {
              backgroundColor: themePalette.background,
            },
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
    </>
  );
};

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <NeonThemeProvider>
        <DrawerNavigator />
      </NeonThemeProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

export default App;
