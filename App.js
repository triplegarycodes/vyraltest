import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import ModuleScreen from './screens/ModuleScreen';
import NeonDrawerContent from './components/NeonDrawerContent';

const Drawer = createDrawerNavigator();

const moduleConfigs = [
  {
    name: 'Core',
    description: 'Mission control for synchronized intelligence.',
    icon: 'flash',
  },
  {
    name: 'Zone',
    description: 'Command the battlefield with spatial awareness.',
    icon: 'planet',
  },
  {
    name: 'Tree',
    description: 'Visualize growth across the neon collective.',
    icon: 'git-branch',
  },
  {
    name: 'Board',
    description: 'Panels of insight with adaptive metrics.',
    icon: 'grid',
  },
  {
    name: 'Stryke',
    description: 'Accelerate momentum and strike the market.',
    icon: 'trending-up',
  },
];

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

const createModuleScreen = (module) => () => (
  <ModuleScreen
    title={module.name}
    description={module.description}
    icon={<Icon name={module.icon} size={34} color="#66F7FF" />}
    onAction={() => {}}
  />
);

const App = () => (
  <LinearGradient colors={['#03050B', '#020309']} style={{ flex: 1 }}>
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
            drawerIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          }}
        />
        {moduleConfigs.map((module) => (
          <Drawer.Screen
            key={module.name}
            name={module.name}
            component={createModuleScreen(module)}
            options={{
              title: module.name,
              drawerIcon: ({ color, size }) => <Icon name={module.icon} color={color} size={size} />,
            }}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  </LinearGradient>
);

export default App;
