import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNeonTheme } from '../context/NeonThemeContext';

const ScreenShell = ({ children, scrollable = true }) => {
  const { themePalette } = useNeonTheme();
  const insets = useSafeAreaInsets();

  const container = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 48 }]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, { paddingBottom: insets.bottom + 32 }]}>{children}</View>
  );

  return (
    <LinearGradient colors={[themePalette.background, themePalette.overlay]} style={styles.background}>
      <View style={[styles.wrapper, { paddingTop: insets.top + 24 }]}>{container}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingTop: 24,
  },
  flex: {
    flex: 1,
  },
});

export default ScreenShell;
