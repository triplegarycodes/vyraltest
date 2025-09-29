import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';
import { useVyralData } from '../context/VyralDataContext';

const TAGS = ['Build', 'Support', 'Ask', 'Alert'];

const ZoneScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const { zonePosts, addZonePost } = useVyralData();

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [composerTag, setComposerTag] = useState(TAGS[0]);
  const [filterTag, setFilterTag] = useState('All');

  const filteredPosts = useMemo(() => {
    if (filterTag === 'All') return zonePosts;
    return zonePosts.filter((post) => post.tag === filterTag);
  }, [zonePosts, filterTag]);

  const handlePublish = () => {
    if (!composerText.trim()) return;
    addZonePost(composerText.trim(), composerTag);
    setComposerText('');
    setComposerTag(TAGS[0]);
    setComposerOpen(false);
  };

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="people" size={26} color={accentColor} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Zone Community</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Broadcast boosts, share wins, and keep the community grounded.</Text>

      <NeonCard>
        <Text style={[styles.filterLabel, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>Filter posts</Text>
        <View style={styles.filterRow}>
          {['All', ...TAGS].map((tag) => {
            const active = filterTag === tag;
            return (
              <Pressable
                key={tag}
                onPress={() => setFilterTag(tag)}
                style={[styles.filterChip, {
                  borderColor: active ? accentColor : accentColor + '33',
                  backgroundColor: active ? accentColor + '1F' : 'transparent',
                }]}
              >
                <Text style={[styles.filterText, { color: themePalette.textPrimary, fontSize: 12 * fontScale }]}>{tag}</Text>
              </Pressable>
            );
          })}
        </View>
      </NeonCard>

      {filteredPosts.length === 0 ? (
        <Text style={[styles.emptyState, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>No broadcasts for this filter yet. Be the first to light up the feed.</Text>
      ) : (
        filteredPosts.map((post, index) => (
          <Animated.View key={post.id} entering={FadeInDown.delay(index * 40)}>
            <NeonCard>
              <View style={styles.postHeader}>
                <View style={styles.postAuthorWrap}>
                  <Text style={[styles.postAuthor, { color: accentColor, fontSize: 13 * fontScale }]}>{post.author}</Text>
                  <View style={[styles.tagBadge, { borderColor: accentColor }]}>
                    <Text style={[styles.tagBadgeText, { color: themePalette.textPrimary, fontSize: 11.5 * fontScale }]}>{post.tag}</Text>
                  </View>
                </View>
                <Text style={[styles.postTimestamp, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>
                  {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={[styles.postMessage, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}>{post.message}</Text>
            </NeonCard>
          </Animated.View>
        ))
      )}

      {composerOpen ? (
        <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })}>
          <Animated.View entering={FadeIn.duration(180)}>
            <NeonCard accent={accentColor}>
              <Text style={[styles.composerTitle, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>Share an update</Text>
              <View style={styles.filterRow}>
                {TAGS.map((tag) => {
                  const active = composerTag === tag;
                  return (
                    <Pressable
                      key={tag}
                      onPress={() => setComposerTag(tag)}
                      style={[styles.filterChip, {
                        borderColor: active ? accentColor : accentColor + '33',
                        backgroundColor: active ? accentColor + '26' : 'transparent',
                      }]}
                    >
                      <Text style={[styles.filterText, { color: themePalette.textPrimary, fontSize: 12 * fontScale }]}>{tag}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                value={composerText}
                onChangeText={setComposerText}
                placeholder="Drop a neon signal..."
                placeholderTextColor={themePalette.textSecondary}
                multiline
                style={[styles.composerInput, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}
              />
              <View style={styles.composerActions}>
                <NeonButton
                  label="Cancel"
                  onPress={() => {
                    setComposerText('');
                    setComposerOpen(false);
                  }}
                  icon={<Ionicons name="close" size={18} color={themePalette.textPrimary} />}
                  style={styles.composerAction}
                />
                <NeonButton
                  label="Publish"
                  onPress={handlePublish}
                  active
                  icon={<Ionicons name="send" size={18} color={themePalette.textPrimary} />}
                  style={[styles.composerAction, styles.composerPublish]}
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
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 12,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    lineHeight: 20,
    marginBottom: 18,
  },
  filterLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  filterText: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthor: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginRight: 12,
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagBadgeText: {
    fontWeight: '600',
  },
  postTimestamp: {
    letterSpacing: 0.4,
  },
  postMessage: {
    lineHeight: 22,
  },
  emptyState: {
    marginBottom: 18,
  },
  composerTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  composerInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  composerAction: {
    flex: 1,
    marginRight: 12,
  },
  composerPublish: {
    marginRight: 0,
  },
  fabWrapper: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
});

export default ZoneScreen;

