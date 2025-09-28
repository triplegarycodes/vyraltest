import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, palette, shadows } from '../theme/colors';

const ModuleCard = ({ title, description, children, icon, accentGradient = gradients.cardSurface }) => (
  <LinearGradient colors={accentGradient} style={styles.card}>
    <View style={styles.headerRow}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.subtitle}>{description}</Text> : null}
      </View>
    </View>
    <View style={styles.divider} />
    <View style={styles.content}>{children}</View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(110, 255, 233, 0.16)',
    ...shadows.medium,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(30, 40, 60, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(111, 255, 224, 0.3)',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: palette.textSecondary,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(91, 140, 255, 0.2)',
    marginTop: 16,
    marginBottom: 20,
  },
  content: {
    marginTop: 8,
  },
});

export default React.memo(ModuleCard);
