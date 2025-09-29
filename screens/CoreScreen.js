import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';
import { useVyralData } from '../context/VyralDataContext';

const replyMatrix = {
  nova: [
    'Routing the holo whiteboard to you now.',
    'Pushing latest encryption patch—can you review?',
    'Just logged a new milestone on the OS roadmap.',
  ],
  cipher: [
    'Blacklist is pristine. Keep the threads kind.',
    'Scrubbing metadata from the community uploads.',
    'Prepping anomaly report for tomorrow\'s standup.',
  ],
  flux: [
    'Crowdsourcing ideas for the next mutual aid drop.',
    'Publishing a highlight reel from the weekend build.',
  ],
  zen: [
    'Remember to stretch between commits.',
    'Breath cadence protocol uploaded to the calm vault.',
  ],
  lyric: [
    'Investing office hours open for the crew—book a slot.',
    'Grant application template ready for review.',
  ],
};

const getReply = (userId) => {
  const options = replyMatrix[userId] || [
    'Appreciate the ping—logging it in the Core board.',
    'Looping in the rest of the crew on this thread.',
  ];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
};

const CoreScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const {
    users,
    chats,
    collaborationThreads,
    toggleFriend,
    toggleBlacklist,
    sendDirectMessage,
    recordProjectUpdate,
    createProjectThread,
  } = useVyralData();

  const [searchTerm, setSearchTerm] = useState('');
  const [composer, setComposer] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(() => users.find((user) => !user.isBlacklisted)?.id ?? users[0]?.id);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [projectUpdate, setProjectUpdate] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadSummary, setNewThreadSummary] = useState('');

  const replyTimeout = useRef(null);
  const pendingThreadTitle = useRef('');

  useEffect(() => {
    return () => {
      if (replyTimeout.current) {
        clearTimeout(replyTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      const fallback = users.find((user) => !user.isBlacklisted) ?? users[0];
      setSelectedUserId(fallback?.id ?? null);
      return;
    }
    const current = users.find((user) => user.id === selectedUserId);
    if (current && !current.isBlacklisted) {
      return;
    }
    const fallback = users.find((user) => !user.isBlacklisted && user.id !== selectedUserId);
    if (fallback) {
      setSelectedUserId(fallback.id);
    }
  }, [users, selectedUserId]);

  useEffect(() => {
    if (collaborationThreads.length === 0) {
      setActiveThreadId(null);
      return;
    }
    if (pendingThreadTitle.current) {
      const created = collaborationThreads.find((thread) => thread.title === pendingThreadTitle.current);
      if (created) {
        setActiveThreadId(created.id);
        pendingThreadTitle.current = '';
        return;
      }
    }
    if (!activeThreadId) {
      setActiveThreadId(collaborationThreads[0].id);
    }
  }, [collaborationThreads, activeThreadId]);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      if (user.name.toLowerCase().includes(query) || user.role.toLowerCase().includes(query)) {
        return true;
      }
      return user.tags.some((tag) => tag.toLowerCase().includes(query));
    });
  }, [users, searchTerm]);

  const messages = chats[selectedUserId] ?? [];
  const activeThread = collaborationThreads.find((thread) => thread.id === activeThreadId) ?? null;

  const handleSend = () => {
    if (!selectedUserId || !composer.trim()) return;
    if (selectedUser?.isBlacklisted) {
      Alert.alert('Blacklisted contact', 'Unblock this contact before sending a message.');
      return;
    }
    if (replyTimeout.current) {
      clearTimeout(replyTimeout.current);
    }
    sendDirectMessage(selectedUserId, composer.trim(), 'You');
    setComposer('');
    const reply = getReply(selectedUserId);
    replyTimeout.current = setTimeout(() => {
      sendDirectMessage(selectedUserId, reply, selectedUser?.name ?? 'Crew Member');
    }, 620);
  };

  const handleProjectUpdate = () => {
    if (!activeThreadId || !projectUpdate.trim()) return;
    recordProjectUpdate(activeThreadId, projectUpdate.trim());
    setProjectUpdate('');
  };

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newThreadSummary.trim()) return;
    pendingThreadTitle.current = newThreadTitle.trim();
    createProjectThread(newThreadTitle.trim(), newThreadSummary.trim(), 'Project initiated inside Core.');
    setNewThreadTitle('');
    setNewThreadSummary('');
  };

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="chatbubbles" size={26} color={accentColor} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Core Collaboration</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Coordinate projects, cultivate friendships, and keep chats safe.</Text>

      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Find collaborators</Text>
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search crew by name, skill, or focus"
          placeholderTextColor={themePalette.textSecondary}
          style={[styles.searchInput, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}
        />
        <View style={styles.userChipWrap}>
          {filteredUsers.map((user) => {
            const blocked = user.isBlacklisted;
            const active = user.id === selectedUserId;
            return (
              <Pressable
                key={user.id}
                onPress={() => (!blocked ? setSelectedUserId(user.id) : null)}
                style={[styles.userChip, {
                  borderColor: blocked ? themePalette.textSecondary + '40' : accentColor,
                  backgroundColor: active ? accentColor + '22' : 'transparent',
                  opacity: blocked ? 0.45 : 1,
                }]}
              >
                <Text style={[styles.userChipText, { color: themePalette.textPrimary, fontSize: 12.5 * fontScale }]}>
                  {user.name.split(' ')[0]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </NeonCard>

      {selectedUser ? (
        <Animated.View entering={FadeInDown.duration(220)}>
          <NeonCard accent={accentColor}>
            <View style={styles.profileHeader}>
              <View>
                <Text style={[styles.profileName, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>
                  {selectedUser.name}
                </Text>
                <Text style={[styles.profileRole, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
                  {selectedUser.role}
                </Text>
              </View>
              <View style={styles.profileActions}>
                <NeonButton
                  label={selectedUser.isFriend ? 'Unfriend' : 'Add friend'}
                  onPress={() => toggleFriend(selectedUser.id)}
                  icon={
                    <Ionicons
                      name={selectedUser.isFriend ? 'person-remove' : 'person-add'}
                      size={18}
                      color={themePalette.textPrimary}
                    />
                  }
                  style={styles.profileButton}
                />
                <NeonButton
                  label={selectedUser.isBlacklisted ? 'Remove blacklist' : 'Blacklist'}
                  onPress={() => toggleBlacklist(selectedUser.id)}
                  active={selectedUser.isBlacklisted}
                  icon={<Ionicons name="shield" size={18} color={themePalette.textPrimary} />}
                />
              </View>
            </View>
            <Text style={[styles.profileFocus, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
              {selectedUser.focus}
            </Text>
            <View style={styles.tagRow}>
              {selectedUser.tags.map((tag) => (
                <View key={tag} style={[styles.tagPill, { borderColor: accentColor }]}>
                  <Text style={[styles.tagText, { color: themePalette.textPrimary, fontSize: 11.5 * fontScale }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </NeonCard>
        </Animated.View>
      ) : null}

      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Secure chat</Text>
        <View style={styles.messagesWrap}>
          {messages.map((message) => {
            const alignRight = message.author === 'You';
            return (
              <Animated.View
                key={message.id}
                entering={FadeInUp.delay(40)}
                style={[styles.messageRow, alignRight ? styles.alignRight : styles.alignLeft]}
              >
                <View
                  style={[styles.messageBubble, {
                    borderColor: alignRight ? accentColor : accentColor + '40',
                    backgroundColor: alignRight ? accentColor + '1F' : themePalette.overlay,
                    alignSelf: alignRight ? 'flex-end' : 'flex-start',
                  }]}
                >
                  <Text
                    style={[styles.messageAuthor, {
                      color: alignRight ? themePalette.textSecondary : accentColor,
                      textAlign: alignRight ? 'right' : 'left',
                      fontSize: 12 * fontScale,
                    }]}
                  >
                    {message.author}
                  </Text>
                  <Text
                    style={[styles.messageText, {
                      color: themePalette.textPrimary,
                      textAlign: alignRight ? 'right' : 'left',
                      fontSize: 15 * fontScale,
                    }]}
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={[styles.messageTimestamp, {
                      color: themePalette.textSecondary,
                      textAlign: alignRight ? 'right' : 'left',
                      fontSize: 10 * fontScale,
                    }]}
                  >
                    {message.displayTime}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
        <View style={styles.composerRow}>
          <Ionicons name="create" color={accentColor} size={20} style={styles.composerIcon} />
          <TextInput
            value={composer}
            onChangeText={setComposer}
            placeholder={selectedUser?.isBlacklisted ? 'Unblock to chat safely' : 'Type a secured message'}
            editable={!selectedUser?.isBlacklisted}
            placeholderTextColor={themePalette.textSecondary}
            style={[styles.input, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}
          />
          <NeonButton
            label="Send"
            onPress={handleSend}
            icon={<Ionicons name="arrow-up" size={18} color={themePalette.textPrimary} />}
            style={styles.sendButton}
          />
        </View>
      </NeonCard>

      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Project threads</Text>
        <View style={styles.threadTabs}>
          {collaborationThreads.map((thread) => {
            const active = thread.id === activeThreadId;
            return (
              <Pressable
                key={thread.id}
                onPress={() => setActiveThreadId(thread.id)}
                style={[styles.threadTab, {
                  borderColor: active ? accentColor : accentColor + '33',
                  backgroundColor: active ? accentColor + '1A' : 'transparent',
                }]}
              >
                <Text style={[styles.threadTabText, { color: themePalette.textPrimary, fontSize: 12 * fontScale }]}>
                  {thread.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {activeThread ? (
          <View style={styles.threadDetail}>
            <Text style={[styles.threadSummary, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
              {activeThread.summary}
            </Text>
            <View style={styles.threadContributors}>
              <Ionicons name="people" size={16} color={accentColor} style={styles.contributorIcon} />
              <Text style={[styles.threadSummary, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>
                {activeThread.contributors.join(' • ')}
              </Text>
            </View>
            {activeThread.updates.map((update) => (
              <View key={update.id} style={[styles.updateCard, { borderColor: accentColor + '33' }]}> 
                <View style={styles.updateHeader}>
                  <Text style={[styles.updateAuthor, { color: accentColor, fontSize: 12 * fontScale }]}>{update.author}</Text>
                  <Text style={[styles.updateTimestamp, { color: themePalette.textSecondary, fontSize: 11 * fontScale }]}>
                    {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={[styles.updateText, { color: themePalette.textPrimary, fontSize: 14 * fontScale }]}>{update.text}</Text>
              </View>
            ))}
            <TextInput
              value={projectUpdate}
              onChangeText={setProjectUpdate}
              placeholder="Log a new milestone"
              placeholderTextColor={themePalette.textSecondary}
              style={[styles.projectInput, { color: themePalette.textPrimary, fontSize: 14 * fontScale }]}
            />
            <NeonButton
              label="Post update"
              onPress={handleProjectUpdate}
              icon={<Ionicons name="cloud-upload" size={18} color={themePalette.textPrimary} />}
              style={styles.projectButton}
            />
          </View>
        ) : (
          <Text style={{ color: themePalette.textSecondary, fontSize: 13 * fontScale }}>No projects yet. Seed one below.</Text>
        )}
      </NeonCard>

      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Launch a new initiative</Text>
        <TextInput
          value={newThreadTitle}
          onChangeText={setNewThreadTitle}
          placeholder="Project title"
          placeholderTextColor={themePalette.textSecondary}
          style={[styles.projectInput, { color: themePalette.textPrimary, fontSize: 14 * fontScale }]}
        />
        <TextInput
          value={newThreadSummary}
          onChangeText={setNewThreadSummary}
          placeholder="What are we building together?"
          placeholderTextColor={themePalette.textSecondary}
          multiline
          style={[styles.projectInput, styles.summaryInput, { color: themePalette.textPrimary, fontSize: 14 * fontScale }]}
        />
        <NeonButton
          label="Create project"
          onPress={handleCreateThread}
          active
          icon={<Ionicons name="rocket" size={18} color={themePalette.textPrimary} />}
        />
      </NeonCard>
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
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  searchInput: {
    borderWidth: 1.5,
    borderRadius: 18,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  userChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    marginRight: 12,
    marginBottom: 12,
  },
  userChipText: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileName: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  profileRole: {
    marginTop: 4,
  },
  profileFocus: {
    marginBottom: 12,
    lineHeight: 20,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    marginRight: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontWeight: '600',
  },
  messagesWrap: {
    marginBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    maxWidth: '80%',
  },
  messageAuthor: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  messageText: {
    marginTop: 6,
    lineHeight: 22,
  },
  messageTimestamp: {
    marginTop: 6,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  composerIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
  },
  sendButton: {
    marginLeft: 12,
  },
  threadTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  threadTab: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  threadTabText: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  threadDetail: {
    marginTop: 4,
  },
  threadSummary: {
    lineHeight: 20,
  },
  threadContributors: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  contributorIcon: {
    marginRight: 6,
  },
  updateCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  updateAuthor: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  updateTimestamp: {
    letterSpacing: 0.4,
  },
  updateText: {
    lineHeight: 20,
  },
  projectInput: {
    borderWidth: 1.5,
    borderRadius: 16,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
  },
  summaryInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  projectButton: {
    marginTop: 12,
  },
});

export default CoreScreen;

