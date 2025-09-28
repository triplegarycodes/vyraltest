import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { gradients, palette } from '../theme/colors';

const NeonDrawerContent = ({ modules = [], ...props }) => (
  <LinearGradient colors={gradients.drawer} style={styles.container}>
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80' }}
      resizeMode="cover"
      style={styles.headerBackground}
      imageStyle={styles.headerImage}
    >
      <LinearGradient colors={['rgba(5,8,16,0.88)', 'rgba(13,18,35,0.55)']} style={styles.headerOverlay}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandLetter}>V</Text>
        </View>
        <View>
          <Text style={styles.brandName}>Vyral Suite</Text>
          <Text style={styles.brandSubtitle}>Cybernetic Ops Network</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollArea}>
      <View style={styles.moduleMeta}>
        <Text style={styles.moduleMetaTitle}>Active Modules</Text>
        {modules.map((module) => (
          <View key={module.key} style={styles.moduleRow}>
            <Ionicons name={module.icon} size={18} color={palette.neonAqua} style={styles.moduleIcon} />
            <View style={styles.moduleTextWrap}>
              <Text style={styles.moduleName}>{module.title}</Text>
              <Text style={styles.moduleSummary}>{module.summary}</Text>
            </View>
          </View>
        ))}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
    <View style={styles.footer}>
      <Text style={styles.footerText}>© {new Date().getFullYear()} Vyral Labs</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBackground: {
    padding: 24,
    paddingTop: 48,
  },
  headerImage: {
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    opacity: 0.45,
  },
  headerOverlay: {
    backgroundColor: 'rgba(5, 10, 18, 0.72)',
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(65, 242, 222, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(146, 107, 255, 0.6)',
    marginRight: 16,
  },
  brandLetter: {
    color: '#5DCCFF',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 6,
  },
  brandName: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: palette.textSecondary,
    marginTop: 6,
    letterSpacing: 0.8,
  },
  scrollArea: {
    paddingTop: 8,
  },
  moduleMeta: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  moduleMetaTitle: {
    color: 'rgba(172, 209, 255, 0.75)',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  moduleIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  moduleTextWrap: {
    flex: 1,
  },
  moduleName: {
    color: palette.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  moduleSummary: {
    marginTop: 4,
    color: palette.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(47, 79, 124, 0.4)',
  },
  footerText: {
    color: 'rgba(155, 200, 255, 0.5)',
    letterSpacing: 0.5,
  },
});

export default NeonDrawerContent;
