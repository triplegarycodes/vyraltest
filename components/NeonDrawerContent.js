import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const NeonDrawerContent = (props) => (
  <LinearGradient colors={['#05070D', '#0A1120']} style={styles.container}>
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80' }}
      resizeMode="cover"
      style={styles.headerBackground}
      imageStyle={styles.headerImage}
    >
      <LinearGradient colors={['rgba(5,8,16,0.8)', 'rgba(13,18,35,0.4)']} style={styles.headerOverlay}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandLetter}>V</Text>
        </View>
        <View>
          <Text style={styles.brandName}>Vyral Suite</Text>
          <Text style={styles.brandSubtitle}>Cybernetic Ops</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollArea}>
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
    gap: 16,
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
  },
  brandLetter: {
    color: '#5DCCFF',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 6,
  },
  brandName: {
    color: '#E9FBFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: 'rgba(180, 212, 255, 0.65)',
    marginTop: 6,
    letterSpacing: 1,
  },
  scrollArea: {
    paddingTop: 8,
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
