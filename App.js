import 'react-native-gesture-handler';
import React, { useMemo, useState, useCallback, createContext, useContext } from 'react';
import {
  StatusBar,
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  SlideInUp,
  SlideInLeft,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();
const ThemeContext = createContext(null);

const accentChoices = ['#7FFFD4', '#9F7FFF', '#40E0D0'];
const SLIDER_KNOB_SIZE = 28;
const SLIDER_TRACK_WIDTH = 240;

const useThemeValues = () => useContext(ThemeContext);

const NeonBackground = ({ children }) => {
  const { themeMode } = useThemeValues();
  const gradientColors =
    themeMode === 'dark'
      ? ['#02040C', '#050A1D', '#071433']
      : ['#EAF5FF', '#F2EDFF'];

  return (
    <LinearGradient colors={gradientColors} style={styles.gradientBackground}>
      {children}
    </LinearGradient>
  );
};

const NeonCard = ({ children, accentOverride, style }) => {
  const { themePalette, accentColor } = useThemeValues();
  return (
    <LinearGradient
      colors={[themePalette.surface, themePalette.overlay]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.neonCard, { borderColor: accentOverride || `${accentColor}55` }, style]}
    >
      {children}
    </LinearGradient>
  );
};

const ScreenShell = ({ children, scrollable = true }) => {
  const insets = useSafeAreaInsets();
  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.screenContent, { paddingBottom: insets.bottom + 32 }]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screenContent, { flex: 1, paddingBottom: insets.bottom + 32 }]}>{children}</View>
  );

  return (
    <NeonBackground>
      <View style={styles.screenWrapper}>{content}</View>
    </NeonBackground>
  );
};

const CoreScreen = () => {
  const { accentColor, scaleFont, themePalette, themeMode } = useThemeValues();
  const isDark = themeMode === 'dark';
  const composerColors = isDark ? ['#0B172D', '#081326'] : ['#F5F8FF', '#E6ECFF'];
  const tabInactiveColors = isDark ? ['#10182A', '#0A1124'] : ['#F2F6FF', '#E6ECFF'];
  const messageContainerStyle = isDark
    ? { backgroundColor: 'rgba(9, 19, 40, 0.65)', borderColor: 'rgba(150, 255, 240, 0.25)' }
    : { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: `${accentColor}44` };
  const placeholderColor = isDark ? 'rgba(186, 215, 255, 0.6)' : 'rgba(30, 58, 102, 0.4)';
  const inputTextColor = isDark ? '#F0FCFF' : '#082240';

  const initialChats = useMemo(
    () => ({
      'Neon Core': {
        id: 'neon-core',
        description: 'Rapid sync with synth mentors.',
        messages: [
          { id: '1', author: 'Nova', text: 'Ready to deploy the safe-text patch?', time: '22:12' },
          { id: '2', author: 'You', text: 'Patch is green. Pushing to swarm now.', time: '22:13' },
          { id: '3', author: 'Nova', text: 'Copy. I will monitor for rogue spikes.', time: '22:14' },
          { id: '4', author: 'You', text: 'Vibe shields up. Stay luminous.', time: '22:15' },
        ],
      },
      'Synthwave Alliance': {
        id: 'alliance',
        description: 'Culture keepers & consent guardians.',
        messages: [
          { id: '5', author: 'Echo', text: 'Reminder: Co-create boundaries doc tonight.', time: '20:44' },
          { id: '6', author: 'You', text: 'On it. Drafting sections for emotional protocols.', time: '20:47' },
          { id: '7', author: 'Echo', text: 'Spectacular. Share when ready.', time: '20:48' },
        ],
      },
      'Pulse Guardians': {
        id: 'guardians',
        description: 'Vibe moderators on call.',
        messages: [
          { id: '8', author: 'Ryn', text: 'Incoming new member needing safety orientation.', time: '19:20' },
          { id: '9', author: 'You', text: 'Queue me the welcome script & signal check.', time: '19:23' },
        ],
      },
    }),
    []
  );

  const [chats, setChats] = useState(initialChats);
  const [activeChatKey, setActiveChatKey] = useState(Object.keys(initialChats)[0]);
  const [composer, setComposer] = useState('');

  const activeChat = chats[activeChatKey];

  const sendMessage = useCallback(() => {
    const trimmed = composer.trim();
    if (!trimmed || !activeChat) return;

    setChats((prev) => {
      const updated = { ...prev };
      const baseChat = updated[activeChatKey];
      if (!baseChat) {
        return prev;
      }
      const now = Date.now().toString();
      const newMessage = {
        id: `${baseChat.id}-${now}`,
        author: 'You',
        text: trimmed,
        time: 'Now',
      };
      const response = {
        id: `${baseChat.id}-${now}-bot`,
        author: 'Nova',
        text: 'Signal received. Logging and reflecting back empathy.',
        time: 'Now',
      };
      updated[activeChatKey] = {
        ...baseChat,
        messages: [...baseChat.messages, newMessage, response],
      };
      return updated;
    });
    setComposer('');
  }, [composer, activeChat, activeChatKey]);

  const renderMessage = ({ item, index }) => {
    const isSelf = item.author === 'You';
    return (
      <View style={[styles.messageRow, isSelf ? styles.alignEnd : styles.alignStart]}>
        <Animated.View
          entering={FadeIn.delay(index * 60)}
          style={{ maxWidth: '80%', alignSelf: isSelf ? 'flex-end' : 'flex-start' }}
        >
          <LinearGradient
            colors={
              isSelf
                ? [accentColor, `${accentColor}90`]
                : [themePalette.surfaceAlt, themePalette.overlay]
            }
            style={[styles.messageBubble, isSelf && { borderColor: accentColor }]}
          >
            <Text
              style={[
                styles.messageAuthor,
                { color: isSelf ? '#04131B' : accentColor, fontSize: scaleFont(11) },
              ]}
            >
              {item.author}
            </Text>
            <Text
              style={[
                styles.messageText,
                { fontSize: scaleFont(14), color: isSelf ? '#021116' : themePalette.text },
              ]}
            >
              {item.text}
            </Text>
            <Text style={[styles.messageTime, { fontSize: scaleFont(10), color: themePalette.muted }]}>
              {item.time}
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  return (
    <ScreenShell scrollable={false}>
      <View style={styles.chatContainer}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chatTabs}>
            {Object.keys(chats).map((key) => {
              const chat = chats[key];
              const isActive = key === activeChatKey;
              return (
                <Pressable key={chat.id} onPress={() => setActiveChatKey(key)} style={{ marginRight: 16 }}>
                  <LinearGradient
                    colors={isActive ? [accentColor, `${accentColor}88`] : tabInactiveColors}
                    style={[
                      styles.chatTab,
                      isActive && { shadowColor: accentColor },
                      !isActive && !isDark && { shadowColor: 'rgba(64, 90, 150, 0.25)' },
                    ]}
                  >
                    <Text
                      style={{
                        color: isActive ? '#02101A' : themePalette.muted,
                        fontWeight: '700',
                        fontSize: scaleFont(13),
                        textTransform: 'uppercase',
                      }}
                    >
                      {key}
                    </Text>
                    <Text
                      style={{
                        marginTop: 6,
                        letterSpacing: 0.4,
                        color: themePalette.muted,
                        fontSize: scaleFont(11),
                      }}
                    >
                      {chat.description}
                    </Text>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
        <Animated.View
          entering={SlideInUp.springify().damping(18)}
          style={[styles.messageListWrapper, messageContainerStyle]}
        >
          <FlatList
            data={activeChat?.messages ?? []}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 4 }}
          />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 0}
        >
          <Animated.View entering={FadeInUp.delay(200)} style={styles.composerWrapper}>
            <LinearGradient colors={composerColors} style={styles.composerField}>
              <TextInput
                style={[styles.composerInput, { fontSize: scaleFont(14), color: inputTextColor }]}
                placeholder="Transmit a luminous reply..."
                placeholderTextColor={placeholderColor}
                value={composer}
                onChangeText={setComposer}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <Pressable
                accessibilityRole="button"
                onPress={sendMessage}
                style={[styles.sendButton, { backgroundColor: accentColor }]}
              >
                <Ionicons name="send" size={18} color="#02111C" />
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </ScreenShell>
  );
};

const LyfeScreen = () => {
  const { accentColor, themePalette, themeMode, scaleFont } = useThemeValues();
  const isDark = themeMode === 'dark';
  const [lessons, setLessons] = useState([
    { id: 'lesson-1', title: 'Consent Calibration', summary: 'Tune boundaries & expectations.', xp: 120, completed: true },
    { id: 'lesson-2', title: 'Signal Boost', summary: 'Daily practice to amplify empathy.', xp: 90, completed: false },
    { id: 'lesson-3', title: 'Rest Ritual', summary: 'Design a regenerative cooldown.', xp: 150, completed: false },
    { id: 'lesson-4', title: 'Goal Sync', summary: 'Align personal quests with tribe vision.', xp: 110, completed: false },
  ]);

  const completedCount = lessons.filter((lesson) => lesson.completed).length;
  const totalCount = lessons.length;
  const earnedXP = lessons.reduce((acc, lesson) => (lesson.completed ? acc + lesson.xp : acc), 0);
  const progressRatio = totalCount === 0 ? 0 : completedCount / totalCount;

  const progressShared = useSharedValue(progressRatio);

  React.useEffect(() => {
    progressShared.value = withSpring(progressRatio, { damping: 18, stiffness: 120 });
  }, [progressRatio, progressShared]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.max(progressShared.value * 100, 6)}%`,
  }));

  const toggleLesson = (id) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
      )
    );
  };

  return (
    <ScreenShell>
      <Animated.View entering={FadeInDown.duration(600)}>
        <NeonCard style={styles.lyfeHero}>
          <Text style={[styles.sectionLabel, { fontSize: scaleFont(12), color: themePalette.muted }]}>Lyfe Stream</Text>
          <Text style={[styles.heroTitle, { fontSize: scaleFont(24), color: themePalette.text }]}>Grow your luminous XP</Text>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: isDark ? 'rgba(87, 127, 255, 0.2)' : 'rgba(62, 90, 150, 0.2)' },
            ]}
          >
            <Animated.View style={[styles.progressFill, progressStyle, { backgroundColor: accentColor }]} />
          </View>
          <Text style={[styles.progressText, { fontSize: scaleFont(12), color: themePalette.muted }]}>
            {completedCount}/{totalCount} lessons complete • {earnedXP} XP earned
          </Text>
        </NeonCard>
      </Animated.View>

      {lessons.map((lesson, index) => (
        <Animated.View
          key={lesson.id}
          entering={FadeIn.delay(index * 80)}
          style={{ width: '100%' }}
        >
          <NeonCard style={styles.lessonCard}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.lessonTitle, { fontSize: scaleFont(18), color: themePalette.text }]}>
                {lesson.title}
              </Text>
              <Text style={[styles.lessonSummary, { fontSize: scaleFont(13), color: themePalette.muted }]}>
                {lesson.summary}
              </Text>
              <Text style={[styles.lessonXP, { color: accentColor, fontSize: scaleFont(12) }]}>+{lesson.xp} XP</Text>
            </View>
            <Pressable
              onPress={() => toggleLesson(lesson.id)}
              style={[styles.lessonButton, { borderColor: `${accentColor}80` }, lesson.completed && { backgroundColor: accentColor }]}
            >
              <Text
                style={{
                  color: lesson.completed ? '#01161E' : accentColor,
                  fontWeight: '700',
                  fontSize: scaleFont(12),
                }}
              >
                {lesson.completed ? 'Completed' : 'Start'}
              </Text>
            </Pressable>
          </NeonCard>
        </Animated.View>
      ))}
    </ScreenShell>
  );
};

const StrykeScreen = () => {
  const { accentColor, themePalette, scaleFont } = useThemeValues();
  const [choice, setChoice] = useState(null);

  const scenario = {
    id: 'scenario-1',
    title: 'Pulse Divergence',
    narrative:
      'A new ally requests access to the private core logs to help diagnose a safety breach. Granting access could accelerate repairs, but the logs contain sensitive trust rituals.',
    options: [
      { id: 'share', label: 'Share curated log excerpt', effect: 'Transparency with guardrails. Ally gains +25 trust.' },
      { id: 'shield', label: 'Shield logs & offer guided review', effect: 'Breach isolated. Team feels protected, +15 resilience.' },
    ],
  };

  return (
    <ScreenShell>
      <Animated.View entering={SlideInLeft.duration(700)}>
        <NeonCard style={styles.scenarioCard}>
          <Text style={[styles.sectionLabel, { fontSize: scaleFont(12), color: themePalette.muted }]}>Mission: STRYKE</Text>
          <Text style={[styles.heroTitle, { fontSize: scaleFont(22), color: themePalette.text }]}>{scenario.title}</Text>
          <Text style={[styles.scenarioText, { fontSize: scaleFont(14), color: themePalette.muted }]}>{scenario.narrative}</Text>
          {scenario.options.map((option) => {
            const selected = choice === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setChoice(option.id)}
                style={[styles.choiceButton, { borderColor: `${accentColor}70` }, selected && { backgroundColor: accentColor }]}
              >
                <Text
                  style={{
                    color: selected ? '#01141C' : accentColor,
                    fontWeight: '700',
                    fontSize: scaleFont(14),
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
          {choice && (
            <Animated.View entering={FadeInUp.duration(400)}>
              <Text style={[styles.choiceResult, { fontSize: scaleFont(13), color: themePalette.text }]}>
                {scenario.options.find((opt) => opt.id === choice)?.effect}
              </Text>
            </Animated.View>
          )}
        </NeonCard>
      </Animated.View>
    </ScreenShell>
  );
};

const TreeScreen = () => {
  const { accentColor, themePalette, themeMode, scaleFont } = useThemeValues();
  const isDark = themeMode === 'dark';
  const [expandedNodes, setExpandedNodes] = useState(['root']);

  const goals = [
    {
      id: 'root',
      title: 'Vyral Vision',
      xp: 500,
      subGoals: [
        {
          id: 'safe-text',
          title: 'Safe Text Protocol',
          summary: 'Automate consent guardrails.',
          subGoals: [
            { id: 'audit', title: 'Live Audit Grid' },
            { id: 'mentor', title: 'Mentor Escalation Loop' },
          ],
        },
        {
          id: 'lyfe-rituals',
          title: 'Lyfe Rituals',
          summary: 'Weekly reflective quests.',
          subGoals: [
            { id: 'calendar', title: 'Sync Calendar' },
            { id: 'archive', title: 'Archive Story Seeds' },
          ],
        },
        {
          id: 'zone-signal',
          title: 'Zone Signal Boost',
          summary: 'Empower community stream.',
          subGoals: [
            { id: 'moderators', title: 'Train moderators' },
            { id: 'toolkit', title: 'Release kit' },
          ],
        },
      ],
    },
  ];

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const renderSubGoals = (subGoals, depth = 1) =>
    subGoals.map((node, index) => {
      const isExpanded = expandedNodes.includes(node.id);
      const hasChildren = Array.isArray(node.subGoals) && node.subGoals.length > 0;
      const nodeGradient = isDark ? ['#0E1B36', '#091224'] : ['#FFFFFF', '#E9F1FF'];
      const textColor = isDark ? '#E9F6FF' : '#1E2A44';
      const hintColor = isDark ? accentColor : `${accentColor}CC`;
      return (
        <View key={node.id} style={{ marginLeft: depth * 24, marginTop: 18 }}>
          <Pressable onPress={() => (hasChildren ? toggleNode(node.id) : null)}>
            <Animated.View entering={FadeIn.delay(index * 100)} style={[styles.treeNode, { borderColor: `${accentColor}55` }]}
            >
              <LinearGradient colors={nodeGradient} style={styles.treeNodeInner}>
                <Text style={[styles.treeNodeTitle, { fontSize: scaleFont(14), color: textColor }]}>
                  {node.title}
                </Text>
                {hasChildren && (
                  <Text style={[styles.treeNodeHint, { fontSize: scaleFont(10), color: hintColor }]}>
                    {isExpanded ? 'Hide branches' : 'Expand branches'}
                  </Text>
                )}
              </LinearGradient>
            </Animated.View>
          </Pressable>
          {hasChildren && isExpanded && (
            <Animated.View entering={FadeInDown.duration(500)}>
              {renderSubGoals(node.subGoals, depth + 1)}
            </Animated.View>
          )}
        </View>
      );
    });

  return (
    <ScreenShell>
      {goals.map((goal) => {
        const isExpanded = expandedNodes.includes(goal.id);
        const branchColor = isDark ? 'rgba(127, 255, 212, 0.4)' : `${accentColor}66`;
        return (
          <Animated.View key={goal.id} entering={SlideInRight.duration(600)}>
            <Pressable onPress={() => toggleNode(goal.id)}>
              <LinearGradient colors={[accentColor, `${accentColor}66`]} style={styles.treeRoot}>
                <Text style={[styles.treeRootTitle, { fontSize: scaleFont(20), color: isDark ? '#041119' : '#042033' }]}>
                  {goal.title}
                </Text>
                <Text style={[styles.treeRootXP, { fontSize: scaleFont(12), color: isDark ? '#021321' : '#083048' }]}>
                  {goal.xp} Vision XP
                </Text>
                <Text style={[styles.treeRootHint, { fontSize: scaleFont(11), color: isDark ? '#041623' : '#083048' }]}>
                  {isExpanded ? 'Collapse canopy' : 'Tap to open canopy'}
                </Text>
              </LinearGradient>
            </Pressable>
            {isExpanded && <View style={[styles.treeBranch, { backgroundColor: branchColor }]} />}
            {isExpanded && renderSubGoals(goal.subGoals)}
          </Animated.View>
        );
      })}
    </ScreenShell>
  );
};

const ZoneScreen = () => {
  const { accentColor, themePalette, scaleFont } = useThemeValues();
  const initialPosts = [
    {
      id: 'post-1',
      author: 'Nova',
      mood: 'Sharing fresh mantra for safe texting nights ✨',
      reactions: 42,
      time: '2m ago',
    },
    {
      id: 'post-2',
      author: 'Echo',
      mood: 'Lyfe crew unlocked level 3 ritual. Drop your reflections below.',
      reactions: 58,
      time: '8m ago',
    },
    {
      id: 'post-3',
      author: 'Pulse',
      mood: 'Community check-in complete. Zero breaches detected.',
      reactions: 33,
      time: '21m ago',
    },
  ];

  const [feed, setFeed] = useState(initialPosts);

  const addPost = () => {
    const timestamp = Date.now();
    const newPost = {
      id: `post-${timestamp}`,
      author: 'You',
      mood: 'Dropped a new vibe-check prompt for the crew. Tap in ✨',
      reactions: 1,
      time: 'just now',
    };
    setFeed((prev) => [newPost, ...prev]);
  };

  return (
    <ScreenShell scrollable={false}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={feed}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 4 }}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.delay(index * 90)}>
              <NeonCard style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={[styles.postAvatar, { borderColor: `${accentColor}80`, backgroundColor: `${accentColor}22` }]}>
                    <Text style={[styles.postAvatarText, { fontSize: scaleFont(14), color: accentColor }]}>
                      {item.author[0]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.postAuthor, { fontSize: scaleFont(16), color: themePalette.text }]}>
                      {item.author}
                    </Text>
                    <Text style={[styles.postTime, { fontSize: scaleFont(11), color: themePalette.muted }]}>
                      {item.time}
                    </Text>
                  </View>
                  <Ionicons name="sparkles" size={18} color={accentColor} />
                </View>
                <Text style={[styles.postMood, { fontSize: scaleFont(14), color: themePalette.text }]}>
                  {item.mood}
                </Text>
                <View style={styles.postFooter}>
                  <Ionicons name="flame" size={16} color={accentColor} />
                  <Text style={[styles.postReactions, { fontSize: scaleFont(12), color: themePalette.muted }]}>
                    {item.reactions} vibes
                  </Text>
                </View>
              </NeonCard>
            </Animated.View>
          )}
        />
        <Pressable
          style={[styles.floatingButton, { shadowColor: accentColor, backgroundColor: accentColor }]}
          onPress={addPost}
        >
          <Ionicons name="add" size={26} color="#041019" />
        </Pressable>
      </View>
    </ScreenShell>
  );
};

const SettingsScreen = () => {
  const {
    themeMode,
    setThemeMode,
    accentColor,
    setAccentColor,
    fontScale,
    setFontScale,
    scaleFont,
    themePalette,
  } = useThemeValues();

  const isDark = themeMode === 'dark';
  const minScale = 0.8;
  const maxScale = 1.4;
  const trackWidth = SLIDER_TRACK_WIDTH;

  const knobX = useSharedValue(((fontScale - minScale) / (maxScale - minScale)) * trackWidth);

  React.useEffect(() => {
    knobX.value = withSpring(((fontScale - minScale) / (maxScale - minScale)) * trackWidth, {
      damping: 18,
    });
  }, [fontScale, knobX, maxScale, minScale, trackWidth]);

  const updateFont = useCallback(
    (position) => {
      const ratio = position / trackWidth;
      const computed = Math.min(
        maxScale,
        Math.max(minScale, parseFloat((minScale + ratio * (maxScale - minScale)).toFixed(2)))
      );
      setFontScale(computed);
    },
    [maxScale, minScale, setFontScale, trackWidth]
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange((event) => {
          const next = Math.min(Math.max(knobX.value + event.changeX, 0), trackWidth);
          knobX.value = next;
          runOnJS(updateFont)(next);
        })
        .onEnd(() => {
          knobX.value = withSpring(knobX.value, { damping: 20, stiffness: 160 });
        }),
    [knobX, trackWidth, updateFont]
  );

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: knobX.value + SLIDER_KNOB_SIZE,
  }));

  const trackBaseColor = isDark ? 'rgba(122, 173, 255, 0.18)' : 'rgba(64, 92, 150, 0.18)';

  return (
    <ScreenShell>
      <Animated.View entering={FadeInDown.duration(600)}>
        <NeonCard style={styles.settingsCard}>
          <Text style={[styles.heroTitle, { fontSize: scaleFont(22), color: themePalette.text }]}>Personalize</Text>
          <View style={styles.settingsRow}>
            <Text style={[styles.settingsLabel, { fontSize: scaleFont(14), color: themePalette.text }]}>Neon Mode</Text>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
              thumbColor={themeMode === 'dark' ? accentColor : '#CFE5FF'}
              trackColor={{ false: '#A9B9D9', true: `${accentColor}80` }}
            />
          </View>
          <View style={styles.settingsRowColumn}>
            <Text style={[styles.settingsLabel, { fontSize: scaleFont(14), color: themePalette.text }]}>Font Size</Text>
            <View style={styles.sliderWrapper}>
              <View style={[styles.sliderTrack, { width: SLIDER_TRACK_WIDTH, backgroundColor: trackBaseColor }]}>
                <Animated.View style={[styles.sliderFill, fillStyle, { backgroundColor: accentColor }]} />
                <GestureDetector gesture={panGesture}>
                  <Animated.View style={[styles.sliderKnob, knobStyle, { backgroundColor: accentColor }]} />
                </GestureDetector>
              </View>
              <Text style={[styles.sliderValue, { fontSize: scaleFont(12), color: themePalette.muted }]}>
                {fontScale.toFixed(2)}x
              </Text>
            </View>
          </View>
          <View style={styles.settingsRowColumn}>
            <Text style={[styles.settingsLabel, { fontSize: scaleFont(14), color: themePalette.text }]}>Accent Color</Text>
            <View style={styles.swatchRow}>
              {accentChoices.map((color) => {
                const active = accentColor === color;
                return (
                  <Pressable key={color} onPress={() => setAccentColor(color)}>
                    <LinearGradient
                      colors={[color, `${color}AA`]}
                      style={[
                        styles.colorSwatch,
                        active && { transform: [{ scale: 1.08 }], shadowColor: color },
                      ]}
                    >
                      {active && <Ionicons name="checkmark" size={18} color="#011017" />}
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </NeonCard>
      </Animated.View>
    </ScreenShell>
  );
};

const App = () => {
  const [themeMode, setThemeMode] = useState('dark');
  const [accentColor, setAccentColor] = useState(accentChoices[0]);
  const [fontScale, setFontScale] = useState(1);

  const themePalette = useMemo(
    () =>
      themeMode === 'dark'
        ? {
            background: '#02040C',
            surface: '#0B1224',
            surfaceAlt: '#101B33',
            overlay: '#09142B',
            text: '#E4F5FF',
            muted: 'rgba(189, 215, 255, 0.75)',
          }
        : {
            background: '#EFF5FF',
            surface: '#F6F7FF',
            surfaceAlt: '#FFFFFF',
            overlay: '#EAEFFF',
            text: '#1A2335',
            muted: 'rgba(30, 44, 72, 0.6)',
          },
    [themeMode]
  );

  const scaleFont = useCallback((size) => size * fontScale, [fontScale]);

  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: themeMode === 'dark',
      colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
        card: themePalette.surface,
        text: themePalette.text,
        border: `${accentColor}40`,
        primary: accentColor,
      },
    }),
    [themeMode, themePalette, accentColor]
  );

  const contextValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      accentColor,
      setAccentColor,
      fontScale,
      setFontScale,
      themePalette,
      scaleFont,
    }),
    [themeMode, accentColor, fontScale, themePalette, scaleFont]
  );

  const drawerBackground = themeMode === 'dark' ? 'rgba(7, 12, 26, 0.88)' : 'rgba(241, 246, 255, 0.95)';
  const activeTint = themeMode === 'dark' ? '#041119' : '#041426';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={['#02040C', '#07132D']} style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeContext.Provider value={contextValue}>
            <NavigationContainer theme={navigationTheme}>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
              />
              <Drawer.Navigator
                initialRouteName="Core"
                screenOptions={{
                  headerTintColor: themePalette.text,
                  headerTransparent: true,
                  headerTitleStyle: {
                    fontWeight: '800',
                    letterSpacing: 2,
                    fontSize: 18,
                  },
                  headerBackground: () => (
                    <LinearGradient
                      colors={[`${accentColor}40`, 'transparent']}
                      style={{ flex: 1 }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  ),
                  sceneContainerStyle: { backgroundColor: 'transparent' },
                  drawerType: 'slide',
                  drawerActiveTintColor: activeTint,
                  drawerActiveBackgroundColor: `${accentColor}AA`,
                  drawerInactiveTintColor: themePalette.muted,
                  drawerLabelStyle: { fontWeight: '600', letterSpacing: 1 },
                  drawerStyle: { backgroundColor: drawerBackground, width: 280 },
                }}
              >
                <Drawer.Screen
                  name="Core"
                  component={CoreScreen}
                  options={{
                    title: 'Core — Chat Grid',
                    drawerIcon: ({ color, size }) => (
                      <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Lyfe"
                  component={LyfeScreen}
                  options={{
                    title: 'Lyfe — Lessons',
                    drawerIcon: ({ color, size }) => (
                      <Ionicons name="sparkles-outline" size={size} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Stryke"
                  component={StrykeScreen}
                  options={{
                    title: 'Stryke — RPG Decisions',
                    drawerIcon: ({ color, size }) => (
                      <Ionicons name="game-controller-outline" size={size} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Tree"
                  component={TreeScreen}
                  options={{
                    title: 'Tree — Goal Nodes',
                    drawerIcon: ({ color, size }) => (
                      <Ionicons name="git-branch-outline" size={size} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Zone"
                  component={ZoneScreen}
                  options={{
                    title: 'Zone — Community',
                    drawerIcon: ({ color, size }) => <Ionicons name="radio-outline" size={size} color={color} />,
                  }}
                />
                <Drawer.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    title: 'Settings — Tune Vyral',
                    drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
                  }}
                />
              </Drawer.Navigator>
            </NavigationContainer>
          </ThemeContext.Provider>
        </SafeAreaProvider>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  screenContent: {
    flexGrow: 1,
    gap: 20,
  },
  neonCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    shadowColor: '#7FFFD4',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  chatContainer: {
    flex: 1,
    gap: 16,
  },
  chatTabs: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  chatTab: {
    width: 220,
    borderRadius: 18,
    padding: 16,
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  messageListWrapper: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  alignStart: {
    justifyContent: 'flex-start',
  },
  alignEnd: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    borderWidth: 1,
    borderColor: 'rgba(127, 255, 212, 0.4)',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#7FFFD4',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  messageAuthor: {
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.8,
  },
  messageText: {
    lineHeight: 20,
    marginBottom: 6,
  },
  messageTime: {
    alignSelf: 'flex-end',
    letterSpacing: 0.6,
  },
  composerWrapper: {
    marginTop: 12,
  },
  composerField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(138, 199, 255, 0.3)',
  },
  composerInput: {
    flex: 1,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7FFFD4',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  lyfeHero: {
    gap: 14,
  },
  sectionLabel: {
    fontWeight: '700',
    letterSpacing: 2,
  },
  heroTitle: {
    fontWeight: '800',
  },
  progressBar: {
    height: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 20,
  },
  progressText: {
    letterSpacing: 1,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  lessonTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
  lessonSummary: {
    marginBottom: 10,
  },
  lessonXP: {
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  lessonButton: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: '#7FFFD4',
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  scenarioCard: {
    gap: 18,
  },
  scenarioText: {
    lineHeight: 20,
  },
  choiceButton: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 6,
  },
  choiceResult: {
    marginTop: 12,
  },
  treeRoot: {
    borderRadius: 24,
    padding: 22,
    shadowColor: '#7FFFD4',
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  treeRootTitle: {
    fontWeight: '800',
  },
  treeRootXP: {
    marginTop: 8,
    fontWeight: '700',
  },
  treeRootHint: {
    marginTop: 10,
    letterSpacing: 1,
  },
  treeBranch: {
    height: 20,
    width: 2,
    marginLeft: 18,
  },
  treeNode: {
    borderWidth: 1,
    borderRadius: 999,
    padding: 4,
    alignSelf: 'flex-start',
    shadowColor: '#7FFFD4',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  treeNodeInner: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  treeNodeTitle: {
    fontWeight: '700',
  },
  treeNodeHint: {
    marginTop: 4,
    letterSpacing: 0.8,
  },
  postCard: {
    marginBottom: 18,
    gap: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  postAvatarText: {
    fontWeight: '700',
  },
  postAuthor: {
    fontWeight: '700',
  },
  postTime: {},
  postMood: {
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postReactions: {
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
  },
  settingsCard: {
    gap: 20,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsRowColumn: {
    gap: 12,
  },
  settingsLabel: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  sliderWrapper: {
    gap: 12,
  },
  sliderTrack: {
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    overflow: 'visible',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    borderRadius: 20,
  },
  sliderKnob: {
    position: 'absolute',
    width: SLIDER_KNOB_SIZE,
    height: SLIDER_KNOB_SIZE,
    borderRadius: SLIDER_KNOB_SIZE / 2,
    shadowColor: '#7FFFD4',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  sliderValue: {},
  swatchRow: {
    flexDirection: 'row',
    gap: 16,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
});

export default App;
