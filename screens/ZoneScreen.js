import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';

const initialPosts = [
  {
    id: 1,
    author: 'Flux',
    message: 'Shared the new hotline flowchart. Grab it in the resource vault!',
    timestamp: '19:25',
  },
  {
    id: 2,
    author: 'Nova',
    message: 'Meetup in the calm zone at 21:00. Bring decompress playlists.',
    timestamp: '19:58',
  },
];

const ZoneScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const [posts, setPosts] = useState(initialPosts);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState('');

  const handlePublish = () => {
    if (!composerText.trim()) return;
    setPosts((prev) => [
      {
        id: prev.length + 1,
        author: 'You',
        message: composerText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
    setComposerText('');
    setComposerOpen(false);
  };

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="people" size={26} color={accentColor} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Zone Feed</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Broadcast boosts to the whole squad.</Text>
      {posts.map((post) => (
        <Animated.View key={post.id} entering={FadeInDown.delay(post.id * 30)}>
          <NeonCard>
            <View style={styles.postHeader}>
              <Text style={[styles.postAuthor, { color: accentColor, fontSize: 13 * fontScale }]}>{post.author}</Text>
              <Text style={[styles.postTimestamp, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>{post.timestamp}</Text>
            </View>
            <Text style={[styles.postMessage, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}>{post.message}</Text>
          </NeonCard>
        </Animated.View>
      ))}
      {composerOpen ? (
        <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })}>
          <Animated.View entering={FadeIn.duration(180)}>
            <NeonCard accent={accentColor}>
              <Text style={[styles.composerTitle, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>Share a pulse</Text>
              <TextInput
                value={composerText}
                onChangeText={setComposerText}
                placeholder="Drop a supportive ping..."
                placeholderTextColor={themePalette.textSecondary}
                multiline
                style={[styles.composerInput, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}
              />
              <View style={styles.composerActions}>
                <NeonButton
                  label="Cancel"
                  onPress={() => {
                    setComposerOpen(false);
                    setComposerText('');
                  }}
                  icon={<Ionicons name="close" size={18} color={themePalette.textPrimary} />}
                />
                <NeonButton
                  label="Publish"
                  onPress={handlePublish}
                  active
                  icon={<Ionicons name="send" size={18} color={themePalette.textPrimary} />}
                />
              </View>
            </NeonCard>
          </Animated.View>
        </KeyboardAvoidingView>
      ) : null}
      <Animated.View entering={FadeIn.delay(150)} style={[styles.fabWrapper, { shadowColor: accentColor }]}>        
        <NeonButton
          label={composerOpen ? 'Close composer' : 'New broadcast'}
          onPress={() => setComposerOpen((prev) => !prev)}
          icon={<Ionicons name={composerOpen ? 'remove' : 'add'} size={20} color={themePalette.textPrimary} />}
          active={composerOpen}
        />
      </Animated.View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    lineHeight: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthor: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  postTimestamp: {
    letterSpacing: 0.5,
  },
  postMessage: {
    lineHeight: 22,
  },
  composerTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  composerInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  fabWrapper: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
});

export default ZoneScreen;
