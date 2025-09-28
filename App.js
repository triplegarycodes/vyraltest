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
import { NeoMascotProvider } from './context/NeoMascotContext';
import modules from './constants/modules';
import { gradients, palette } from './theme/colors';

const Drawer = createDrawerNavigator();

const App = () => {
  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
        card: '#070A15',
        text: palette.textPrimary,
        border: 'rgba(64, 89, 129, 0.4)',
        primary: palette.neonAqua,
      },
    }),
    [],
  );

  return (
    <NeoMascotProvider>
      <GestureHandlerRootView style={styles.root}>
        <LinearGradient colors={gradients.appShell} style={styles.gradientSurface}>
          <SafeAreaProvider>
            <NavigationContainer theme={navigationTheme}>
              <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
              <Drawer.Navigator
                initialRouteName="Home"
                drawerContent={(props) => <NeonDrawerContent {...props} modules={modules} />}
                screenOptions={{
                  headerTintColor: palette.textPrimary,
                  headerTitleStyle: {
                    letterSpacing: 2,
                    fontWeight: '700',
                  },
                  headerStyle: {
                    backgroundColor: 'rgba(5, 8, 17, 0.92)',
                    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: 'rgba(90, 134, 255, 0.3)',
                    shadowColor: 'transparent',
                    elevation: 0,
                  },
                  drawerType: 'slide',
                  overlayColor: 'rgba(31, 242, 210, 0.08)',
                  drawerActiveTintColor: palette.neonAqua,
                  drawerInactiveTintColor: 'rgba(190, 215, 255, 0.6)',
                  drawerLabelStyle: {
                    letterSpacing: 1,
                    fontWeight: '600',
                  },
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
                {modules.map((module) => (
                  <Drawer.Screen
                    key={module.key}
                    name={module.name}
                    component={ModuleScreen}
                    initialParams={{ module }}
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
    </NeoMascotProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradientSurface: {
    flex: 1,
  },
});
