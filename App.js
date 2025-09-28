import 'react-native-gesture-handler';
import React, { useState, useMemo, createContext, useContext } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();
const ThemeContext = createContext(null);

const useThemeValues = () => useContext(ThemeContext);

// Background Wrapper
const NeonBackground = ({ children }) => {
  return (
    <LinearGradient colors={['#02040C', '#050A1F', '#0A193A']} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
};

// Card Wrapper
const NeonCard = ({ children }) => (
  <LinearGradient
    colors={['#061128', '#0B1B3C']}
    style={{ borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#7FFFD4' }}
  >
    {children}
  </LinearGradient>
);

// Screen Shell
const ScreenShell = ({ children }) => (
  <NeonBackground>
    <ScrollView contentContainerStyle={{ padding: 20 }}>{children}</ScrollView>
  </NeonBackground>
);

// Core Screen
const CoreScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', from: 'Nova', body: 'Welcome to Core, safe chat is live.' },
  ]);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), from: 'You', body: draft }]);
    setDraft('');
  };

  return (
    <ScreenShell>
      <Text style={styles.heading}>Core</Text>
      {messages.map((m) => (
        <NeonCard key={m.id}><Text style={{ color: '#7FFFD4' }}>{m.from}: {m.body}</Text></NeonCard>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Type..."
        placeholderTextColor="#A9C2FF"
        value={draft}
        onChangeText={setDraft}
      />
      <Pressable onPress={sendMessage}><Text style={styles.button}>Send</Text></Pressable>
    </ScreenShell>
  );
};

// Lyfe Screen
const LyfeScreen = () => (
  <ScreenShell>
    <Text style={styles.heading}>Lyfe</Text>
    <NeonCard><Text style={styles.text}>Track personal & financial goals.</Text></NeonCard>
  </ScreenShell>
);

// Stryke Screen
const StrykeScreen = () => (
  <ScreenShell>
    <Text style={styles.heading}>Stryke</Text>
    <NeonCard><Text style={styles.text}>RPG-style decision lessons live here.</Text></NeonCard>
  </ScreenShell>
);

// Tree Screen
const TreeScreen = () => (
  <ScreenShell>
    <Text style={styles.heading}>Tree</Text>
    <NeonCard><Text style={styles.text}>Grow your VybeTree with habits and connections.</Text></NeonCard>
  </ScreenShell>
);

// Zone Screen
const ZoneScreen = () => (
  <ScreenShell>
    <Text style={styles.heading}>Zone</Text>
    <NeonCard><Text style={styles.text}>Communities & active feeds are here.</Text></NeonCard>
  </ScreenShell>
);

// Skrybe Screen
const SkrybeScreen = () => (
  <ScreenShell>
    <Text style={styles.heading}>Skrybe</Text>
    <NeonCard><Text style={styles.text}>Take notes, track thoughts, word counts.</Text></NeonCard>
  </ScreenShell>
);

// Settings Screen
const SettingsScreen = () => (
  <ScreenShell>
    <Text style={styles.heading}>Settings</Text>
    <NeonCard><Text style={styles.text}>Customize themes, fonts, and Neo reactions.</Text></NeonCard>
  </ScreenShell>
);

// App Wrapper
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{}}>
        <NavigationContainer theme={DarkTheme}>
          <Drawer.Navigator screenOptions={{ headerShown: false, drawerActiveTintColor: '#7FFFD4', drawerStyle: { backgroundColor: '#061128' } }}>
            <Drawer.Screen name="Core" component={CoreScreen} />
            <Drawer.Screen name="Lyfe" component={LyfeScreen} />
            <Drawer.Screen name="Stryke" component={StrykeScreen} />
            <Drawer.Screen name="Tree" component={TreeScreen} />
            <Drawer.Screen name="Zone" component={ZoneScreen} />
            <Drawer.Screen name="Skrybe" component={SkrybeScreen} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: '700', color: '#F5FAFF', marginBottom: 12 },
  text: { fontSize: 16, color: '#A9C2FF' },
  input: { borderWidth: 1, borderColor: '#7FFFD4', borderRadius: 8, padding: 8, marginVertical: 12, color: '#F5FAFF' },
  button: { color: '#7FFFD4', fontWeight: '600', marginTop: 8 ,},
});
