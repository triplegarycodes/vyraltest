import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ModuleCard = ({ title, description, children, icon }) => (
  <LinearGradient colors={['rgba(26, 30, 44, 0.95)', 'rgba(16, 20, 34, 0.85)']} style={styles.card}>
    <View style={styles.headerRow}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.subtitle}>{description}</Text> : null}
      </View>
    </View>
    <View style={styles.content}>{children}</View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(110, 255, 233, 0.2)',
    shadowColor: '#5B8AFF',
    shadowOpacity: 0.3,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 14 },
    elevation: 14,
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
    color: '#E8F6FF',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(157, 187, 255, 0.7)',
    letterSpacing: 0.5,
  },
  content: {
    marginTop: 8,
  },
});

export default ModuleCard;
