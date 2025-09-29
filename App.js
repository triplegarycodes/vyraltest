import 'react-native-gesture-handler';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StatusBar,
} from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const ThemeContext = createContext(null);

const ACCENT_OPTIONS = ['#7fffd4', '#9f7fff', '#2dd4bf'];

const createPalette = (mode, accent) =>
  mode === 'dark'
    ? {
        mode,
        backgroundGradient: ['#05070d', '#0b1220'],
        surface: 'rgba(13, 18, 30, 0.92)',
        elevated: 'rgba(22, 32, 50, 0.92)',
        overlay: 'rgba(11, 17, 27, 0.8)',
        border: `${accent}55`,
        glow: accent,
        textPrimary: '#f5f7ff',
        textSecondary: '#94a3b8',
        subtle: '#1d283a',
      }
    : {
        mode,
        backgroundGradient: ['#ecf5ff', '#f7fbff'],
        surface: 'rgba(255, 255, 255, 0.94)',
        elevated: 'rgba(240, 245, 255, 0.94)',
        overlay: 'rgba(220, 230, 250, 0.8)',
        border: `${accent}55`,
        glow: accent,
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        subtle: '#dbeafe',
      };

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');
  const [accent, setAccent] = useState(ACCENT_OPTIONS[0]);
  const [fontScale, setFontScale] = useState(1);

  const palette = useMemo(() => createPalette(mode, accent), [mode, accent]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      toggleMode,
      accent,
      setAccent,
      fontScale,
      setFontScale,
      palette,
      accentOptions: ACCENT_OPTIONS,
    }),
    [mode, toggleMode, accent, fontScale, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const useNeonTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useNeonTheme must be used within ThemeProvider');
  }
  return ctx;
};

const Drawer = createDrawerNavigator();

const ScreenContainer = ({ children }) => {
  const { palette } = useNeonTheme();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={palette.backgroundGradient} style={styles.screenGradient}>
      <View
        style={[
          styles.screenPadding,
          {
            paddingTop: insets.top + 12,
            paddingBottom: Math.max(insets.bottom + 12, 24),
          },
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
};

const NeonCard = ({ children, style }) => {
  const { palette } = useNeonTheme();
  return (
    <Animated.View
      entering={FadeInUp.duration(420)}
      layout={Layout.springify()}
      style={[styles.cardShadow, { shadowColor: palette.glow }]}
    >
      <LinearGradient
        colors={[palette.surface, palette.elevated]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: palette.border }, style]}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
};

const PrimaryButton = ({ title, onPress, icon, style }) => {
  const { palette, accent } = useNeonTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: pressed ? `${accent}33` : `${accent}22`,
          borderColor: `${accent}80`,
          shadowColor: palette.glow,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[`${accent}55`, `${accent}22`]}
        style={styles.primaryButtonGradient}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={palette.textPrimary}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[styles.primaryButtonText, { color: palette.textPrimary }]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const useFontSize = () => {
  const { fontScale } = useNeonTheme();
  return useCallback((size) => Math.round(size * fontScale * 10) / 10, [fontScale]);
};

const CoreScreen = () => {
  const { palette } = useNeonTheme();
  const fontSize = useFontSize();
  const [conversations, setConversations] = useState([
    {
      id: 'squad',
      title: 'Innovation Squad',
      subtitle: 'Ideas flowing neon-fast',
      messages: [
        { id: 'm1', from: 'Nova', text: 'Prototype ships tonight?', type: 'in' },
        { id: 'm2', from: 'You', text: 'Final QA happening now.', type: 'out' },
        { id: 'm3', from: 'Nova', text: 'Pushing copy updates in 5.', type: 'in' },
      ],
    },
    {
      id: 'campus',
      title: 'Campus Collective',
      subtitle: 'Study sprint at midnight',
      messages: [
        { id: 'm4', from: 'Quinn', text: 'Need help with calc proofs.', type: 'in' },
        { id: 'm5', from: 'You', text: 'Jumping into a call in 10.', type: 'out' },
      ],
    },
    {
      id: 'labs',
      title: 'Nova Labs',
      subtitle: 'Rewriting OS kernel modules',
      messages: [
        { id: 'm6', from: 'Mira', text: 'Scheduler bug squashed.', type: 'in' },
        { id: 'm7', from: 'You', text: 'Allocations stable?', type: 'out' },
        { id: 'm8', from: 'Mira', text: 'Stable and glowing.', type: 'in' },
      ],
    },
  ]);
  const [activeConversationId, setActiveConversationId] = useState('squad');
  const [composer, setComposer] = useState('');

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) || conversations[0],
    [conversations, activeConversationId]
  );

  const handleSend = useCallback(() => {
    const trimmed = composer.trim();
    if (!trimmed) return;
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                {
                  id: `msg-${Date.now()}`,
                  from: 'You',
                  text: trimmed,
                  type: 'out',
                },
              ],
            }
          : conversation
      )
    );
    setComposer('');
  }, [composer, activeConversation]);

  return (
    <ScreenContainer>
      <Animated.Text
        entering={FadeInDown.delay(60)}
        style={[styles.screenTitle, { color: palette.textPrimary, fontSize: fontSize(28) }]}
      >
        Core Collaborations
      </Animated.Text>
      <Text
        style={[styles.screenSubtitle, { color: palette.textSecondary, fontSize: fontSize(15) }]}
      >
        Coordinate projects, troubleshoot assignments, and keep every squad synced.
      </Text>

      <Animated.View entering={FadeIn.delay(80)} style={styles.conversationRow}>
        <FlatList
          data={conversations}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveConversationId(item.id)}
              style={({ pressed }) => [
                styles.conversationChip,
                {
                  backgroundColor:
                    item.id === activeConversation.id ? `${palette.glow}33` : palette.overlay,
                  borderColor: item.id === activeConversation.id ? palette.glow : palette.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[styles.conversationTitle, { color: palette.textPrimary, fontSize: fontSize(16) }]}
              >
                {item.title}
              </Text>
              <Text
                style={[styles.conversationSubtitle, { color: palette.textSecondary, fontSize: fontSize(13) }]}
                numberOfLines={1}
              >
                {item.subtitle}
              </Text>
            </Pressable>
          )}
        />
      </Animated.View>

      <NeonCard style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {activeConversation.messages.map((message, index) => {
            const isOutgoing = message.type === 'out';
            return (
              <Animated.View
                key={message.id}
                entering={FadeInUp.delay(index * 60)}
                style={{
                  alignSelf: isOutgoing ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  marginBottom: 12,
                }}
              >
                <LinearGradient
                  colors={
                    isOutgoing
                      ? [palette.glow, `${palette.glow}99`]
                      : [palette.overlay, palette.surface]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.messageBubble, { borderColor: isOutgoing ? palette.glow : palette.border }]}
                >
                  <Text
                    style={{
                      color: isOutgoing ? '#0b1220' : palette.textPrimary,
                      fontSize: fontSize(15),
                      fontWeight: '600',
                      marginBottom: 4,
                    }}
                  >
                    {message.from}
                  </Text>
                  <Text
                    style={{
                      color: isOutgoing ? '#06101c' : palette.textSecondary,
                      fontSize: fontSize(14),
                      lineHeight: fontSize(20),
                    }}
                  >
                    {message.text}
                  </Text>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </ScrollView>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            style={[
              styles.composer,
              { borderColor: palette.border, backgroundColor: palette.overlay },
            ]}
          >
            <TextInput
              placeholder="Send a neon-safe reply"
              placeholderTextColor={palette.textSecondary}
              value={composer}
              onChangeText={setComposer}
              style={[styles.composerInput, { color: palette.textPrimary, fontSize: fontSize(15) }]}
            />
            <PrimaryButton
              title="Send"
              icon="paper-plane"
              onPress={handleSend}
              style={{ paddingHorizontal: 18, marginLeft: 12 }}
            />
          </View>
        </KeyboardAvoidingView>
      </NeonCard>
    </ScreenContainer>
  );
};

const LyfeScreen = () => {
  const { palette, accent } = useNeonTheme();
  const fontSize = useFontSize();
  const [lessons, setLessons] = useState([
    { id: 'mindful-finance', title: 'Mindful Finance Habits', xp: 120, status: 'complete' },
    { id: 'personal-rhythm', title: 'Personal Rhythm Mapping', xp: 90, status: 'active' },
    { id: 'wellbeing', title: 'Wellbeing Pulse Checks', xp: 70, status: 'pending' },
    { id: 'leadership', title: 'Leadership Pulse Labs', xp: 110, status: 'pending' },
  ]);

  const trackWidth = useSharedValue(1);
  const progress = useSharedValue(0);

  const completed = useMemo(
    () => lessons.filter((lesson) => lesson.status === 'complete').length,
    [lessons]
  );
  const totalXp = useMemo(
    () =>
      lessons
        .filter((lesson) => lesson.status === 'complete')
        .reduce((sum, lesson) => sum + lesson.xp, 0),
    [lessons]
  );

  useEffect(() => {
    const ratio = lessons.length === 0 ? 0 : completed / lessons.length;
    progress.value = withTiming(ratio, { duration: 520 });
  }, [completed, lessons.length, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: trackWidth.value * Math.max(progress.value, 0.02),
  }));

  const toggleLesson = useCallback((lessonId) => {
    setLessons((prev) =>
      prev.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        const nextStatus =
          lesson.status === 'complete'
            ? 'active'
            : lesson.status === 'active'
            ? 'complete'
            : 'active';
        return { ...lesson, status: nextStatus };
      })
    );
  }, []);

  return (
    <ScreenContainer>
      <Animated.Text
        entering={FadeInDown.delay(60)}
        style={[styles.screenTitle, { color: palette.textPrimary, fontSize: fontSize(28) }]}
      >
        Lyfe Modules
      </Animated.Text>
      <Text
        style={[styles.screenSubtitle, { color: palette.textSecondary, fontSize: fontSize(15) }]}
      >
        Track growth across finance, personal rhythm, and wellbeing with live XP.
      </Text>

      <NeonCard>
        <Text
          style={[styles.metricLabel, { color: palette.textSecondary, fontSize: fontSize(13) }]}
        >
          Total XP
        </Text>
        <Text
          style={[styles.metricValue, { color: palette.textPrimary, fontSize: fontSize(30) }]}
        >
          {totalXp}
        </Text>
        <View
          style={[styles.progressTrack, { backgroundColor: palette.subtle }]}
          onLayout={(event) => {
            trackWidth.value = event.nativeEvent.layout.width;
          }}
        >
          <Animated.View
            style={[styles.progressFill, progressStyle, { backgroundColor: accent }]}
          />
        </View>
        <Text
          style={[styles.progressCaption, { color: palette.textSecondary, fontSize: fontSize(13) }]}
        >
          {completed} of {lessons.length} lessons complete
        </Text>
      </NeonCard>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 12 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {lessons.map((lesson, index) => (
          <NeonCard key={lesson.id} style={{ marginBottom: 14 }}>
            <Animated.View entering={FadeIn.delay(index * 70)}>
              <Text
                style={[styles.lessonTitle, { color: palette.textPrimary, fontSize: fontSize(18) }]}
              >
                {lesson.title}
              </Text>
              <Text
                style={[styles.lessonSubtitle, { color: palette.textSecondary, fontSize: fontSize(13) }]}
              >
                Earn {lesson.xp} XP • Status: {lesson.status.toUpperCase()}
              </Text>
              <PrimaryButton
                title={lesson.status === 'complete' ? 'Mark Active' : 'Complete Lesson'}
                icon={lesson.status === 'complete' ? 'refresh' : 'checkmark-circle'}
                onPress={() => toggleLesson(lesson.id)}
                style={{ marginTop: 16 }}
              />
            </Animated.View>
          </NeonCard>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const StrykeScreen = () => {
  const { palette } = useNeonTheme();
  const fontSize = useFontSize();
  const scenario = useMemo(
    () => ({
      id: 'launch-protocol',
      title: 'Stryke Life Challenge',
      description:
        'You are directing the Stryke life challenge—choose how the squad spends its final prep cycle.',
      choices: [
        {
          id: 'focus-simulation',
          label: 'Run final neural simulations',
          impact: 'Increases clarity, reveals hidden risk patterns, XP +80',
        },
        {
          id: 'team-wellness',
          label: 'Host a wellness sync and decompress',
          impact: 'Boosts morale, unlocks bonus synergy, XP +60',
        },
      ],
    }),
    []
  );
  const [selectedChoice, setSelectedChoice] = useState(null);

  return (
    <ScreenContainer>
      <Animated.Text
        entering={FadeInDown.delay(60)}
        style={[styles.screenTitle, { color: palette.textPrimary, fontSize: fontSize(28) }]}
      >
        Stryke Scenario
      </Animated.Text>
      <Text
        style={[styles.screenSubtitle, { color: palette.textSecondary, fontSize: fontSize(15) }]}
      >
        Branch the mission and feel the neon ripple of each decision.
      </Text>

      <NeonCard style={{ marginTop: 8 }}>
        <Text
          style={[styles.scenarioTitle, { color: palette.textPrimary, fontSize: fontSize(22) }]}
        >
          {scenario.title}
        </Text>
        <Text
          style={[styles.scenarioDescription, { color: palette.textSecondary, fontSize: fontSize(15) }]}
        >
          {scenario.description}
        </Text>
        {scenario.choices.map((choice) => (
          <PrimaryButton
            key={choice.id}
            title={choice.label}
            icon={selectedChoice === choice.id ? 'sparkles' : 'flash'}
            onPress={() => setSelectedChoice(choice.id)}
            style={{ marginTop: 16 }}
          />
        ))}
        {selectedChoice && (
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={[styles.choiceResult, { borderColor: palette.glow }]}
          >
            <Ionicons name="pulse" size={20} color={palette.glow} style={{ marginRight: 8 }} />
            <Text style={{ color: palette.textPrimary, fontSize: fontSize(14), flex: 1 }}>
              {scenario.choices.find((choice) => choice.id === selectedChoice)?.impact}
            </Text>
          </Animated.View>
        )}
      </NeonCard>
    </ScreenContainer>
  );
};

const GoalNode = ({ node, level, expandedNodes, toggleNode }) => {
  const { palette } = useNeonTheme();
  const fontSize = useFontSize();
  const isExpanded = expandedNodes.includes(node.id);
  return (
    <Animated.View
      entering={FadeInDown.delay(level * 80)}
      layout={Layout.springify()}
      style={{ marginLeft: level * 18, marginBottom: 16 }}
    >
      <Pressable
        onPress={() => toggleNode(node.id)}
        style={({ pressed }) => [
          styles.goalNode,
          {
            borderColor: palette.glow,
            backgroundColor: pressed || isExpanded ? `${palette.glow}33` : palette.overlay,
          },
        ]}
      >
        <Text
          style={{ color: palette.textPrimary, fontSize: fontSize(16), fontWeight: '600' }}
        >
          {node.label}
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={palette.textSecondary}
        />
      </Pressable>
      {isExpanded && node.children && (
        <View
          style={{
            paddingLeft: 12,
            borderLeftWidth: 1,
            borderColor: `${palette.glow}55`,
            marginTop: 12,
          }}
        >
          {node.children.map((child) => (
            <GoalNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const TreeScreen = () => {
  const { palette } = useNeonTheme();
  const [expandedNodes, setExpandedNodes] = useState(['root', 'xp-expansion']);
  const fontSize = useFontSize();

  const treeData = useMemo(
    () => ({
      id: 'root',
      label: 'Vyral Growth Canopy',
      children: [
        {
          id: 'xp-expansion',
          label: 'XP Expansion Milestones',
          children: [
            { id: 'branches', label: 'Branches Formed: Projects completed' },
            { id: 'fruits', label: 'Fruits Earned: Lesson completions' },
            { id: 'acorns', label: 'Acorns Secured: Collaboration invites' },
          ],
        },
        {
          id: 'wellbeing-root',
          label: 'Wellbeing Roots',
          children: [
            { id: 'breath', label: 'Breathwork streak 14 days' },
            { id: 'sleep', label: 'Sleep sync 7.5h avg' },
          ],
        },
        {
          id: 'expedition',
          label: 'Stryke Expedition Unlocks',
          children: [
            { id: 'mentor', label: 'Mentor Summits reached' },
            { id: 'cohorts', label: 'Cohorts activated' },
          ],
        },
      ],
    }),
    []
  );

  const toggleNode = useCallback((nodeId) => {
    setExpandedNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  }, []);

  return (
    <ScreenContainer>
      <Animated.Text
        entering={FadeInDown.delay(60)}
        style={[styles.screenTitle, { color: palette.textPrimary, fontSize: fontSize(28) }]}
      >
        Tree Progress
      </Animated.Text>
      <Text
        style={[styles.screenSubtitle, { color: palette.textSecondary, fontSize: fontSize(15) }]}
      >
        Every branch, fruit, and acorn tracks micro-achievements in your journey.
      </Text>

      <NeonCard style={{ marginTop: 12 }}>
        <GoalNode
          node={treeData}
          level={0}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
        />
      </NeonCard>
    </ScreenContainer>
  );
};

const ZoneScreen = () => {
  const { palette } = useNeonTheme();
  const fontSize = useFontSize();
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      author: 'Nova',
      content: 'Shipping neon UI animations for the new mission control.',
      time: '2m ago',
    },
    {
      id: 'p2',
      author: 'Quinn',
      content: 'Looking for collaborators on a decentralized campus map.',
      time: '12m ago',
    },
    {
      id: 'p3',
      author: 'Ari',
      content: 'Shared finance models for the Lyfe labs—feedback welcome.',
      time: '25m ago',
    },
  ]);
  const [composerVisible, setComposerVisible] = useState(false);
  const [draft, setDraft] = useState('');

  const handlePublish = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setPosts((prev) => [
      {
        id: `post-${Date.now()}`,
        author: 'You',
        content: trimmed,
        time: 'Just now',
      },
      ...prev,
    ]);
    setDraft('');
    setComposerVisible(false);
  }, [draft]);

  return (
    <ScreenContainer>
      <Animated.Text
        entering={FadeInDown.delay(60)}
        style={[styles.screenTitle, { color: palette.textPrimary, fontSize: fontSize(28) }]}
      >
        Zone Community
      </Animated.Text>
      <Text
        style={[styles.screenSubtitle, { color: palette.textSecondary, fontSize: fontSize(15) }]}
      >
        Broadcast updates, find collaborators, and pulse-check the network.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}
      >
        {posts.map((post, index) => (
          <NeonCard key={post.id} style={{ marginBottom: 16 }}>
            <Animated.View entering={FadeIn.delay(index * 70)}>
              <Text
                style={{ color: palette.textPrimary, fontSize: fontSize(17), fontWeight: '600' }}
              >
                {post.author}
              </Text>
              <Text
                style={{ color: palette.textSecondary, fontSize: fontSize(13), marginTop: 4 }}
              >
                {post.time}
              </Text>
              <Text
                style={{
                  color: palette.textPrimary,
                  fontSize: fontSize(15),
                  marginTop: 12,
                  lineHeight: fontSize(21),
                }}
              >
                {post.content}
              </Text>
            </Animated.View>
          </NeonCard>
        ))}
      </ScrollView>

      {composerVisible && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={[styles.composerCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
        >
          <TextInput
            placeholder="Share a neon insight"
            placeholderTextColor={palette.textSecondary}
            multiline
            value={draft}
            onChangeText={setDraft}
            style={{
              color: palette.textPrimary,
              fontSize: fontSize(15),
              minHeight: 80,
              marginBottom: 12,
            }}
          />
          <PrimaryButton title="Publish" icon="send" onPress={handlePublish} />
        </Animated.View>
      )}

      <Pressable
        onPress={() => setComposerVisible((prev) => !prev)}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: pressed ? `${palette.glow}aa` : palette.glow,
            shadowColor: palette.glow,
          },
        ]}
      >
        <Ionicons
          name={composerVisible ? 'close' : 'add'}
          size={26}
          color={palette.mode === 'dark' ? '#041221' : '#f8fbff'}
        />
      </Pressable>
    </ScreenContainer>
  );
};

const FontScaleSlider = () => {
  const { palette, accent, setFontScale, fontScale } = useNeonTheme();
  const trackWidth = 220;
  const min = 0.85;
  const max = 1.25;
  const knobX = useSharedValue(((fontScale - min) / (max - min)) * trackWidth);

  const updateScale = useCallback(
    (position) => {
      const clamped = Math.max(0, Math.min(position, trackWidth));
      const nextScale = +(min + (clamped / trackWidth) * (max - min)).toFixed(2);
      setFontScale(nextScale);
    },
    [max, min, setFontScale, trackWidth]
  );

  useEffect(() => {
    knobX.value = withTiming(((fontScale - min) / (max - min)) * trackWidth, { duration: 240 });
  }, [fontScale, knobX, max, min, trackWidth]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = knobX.value;
    },
    onActive: (event, ctx) => {
      const next = ctx.startX + event.translationX;
      const clamped = Math.max(0, Math.min(next, trackWidth));
      knobX.value = clamped;
      runOnJS(updateScale)(clamped);
    },
  });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobX.value }],
  }));

  return (
    <View style={{ marginTop: 18 }}>
      <Text style={{ color: palette.textSecondary, marginBottom: 8 }}>Font scale</Text>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <View
          style={[styles.sliderTrack, { backgroundColor: palette.overlay, borderColor: palette.border }]}
        >
          <Animated.View
            style={[styles.sliderKnob, { backgroundColor: accent, shadowColor: accent }, knobStyle]}
          />
        </View>
      </PanGestureHandler>
      <Text style={{ color: palette.textPrimary, marginTop: 8, fontWeight: '600' }}>
        {fontScale.toFixed(2)}x
      </Text>
    </View>
  );
};

const SettingsScreen = () => {
  const { palette, toggleMode, mode, accent, setAccent, accentOptions } = useNeonTheme();
  const fontSize = useFontSize();

  return (
    <ScreenContainer>
      <Animated.Text
        entering={FadeInDown.delay(60)}
        style={[styles.screenTitle, { color: palette.textPrimary, fontSize: fontSize(28) }]}
      >
        Settings
      </Animated.Text>
      <Text
        style={[styles.screenSubtitle, { color: palette.textSecondary, fontSize: fontSize(15) }]}
      >
        Customize your neon experience across every module.
      </Text>

      <NeonCard>
        <Animated.View entering={FadeIn.delay(100)}>
          <View style={styles.settingRow}>
            <Text style={{ color: palette.textPrimary, fontSize: fontSize(16), fontWeight: '600' }}>
              Theme
            </Text>
            <PrimaryButton
              title={mode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              icon={mode === 'dark' ? 'sunny' : 'moon'}
              onPress={toggleMode}
            />
          </View>
          <View style={[styles.settingRow, { marginTop: 18 }]}> 
            <Text style={{ color: palette.textPrimary, fontSize: fontSize(16), fontWeight: '600' }}>
              Accent
            </Text>
            <View style={styles.accentRow}>
              {accentOptions.map((option, index) => (
                <Pressable
                  key={option}
                  onPress={() => setAccent(option)}
                  style={({ pressed }) => [
                    styles.accentSwatch,
                    {
                      marginLeft: index === 0 ? 0 : 12,
                      backgroundColor: option,
                      transform: [
                        { scale: accent === option ? 1.12 : pressed ? 0.95 : 1 },
                      ],
                      borderColor: accent === option ? palette.textPrimary : 'transparent',
                    },
                  ]}
                />
              ))}
            </View>
          </View>
          <FontScaleSlider />
        </Animated.View>
      </NeonCard>
    </ScreenContainer>
  );
};

const openNotesDb = () => {
  const db = SQLite.openDatabase('vyral-notes.db');
  return db;
};

const SkrybeScreen = () => {
  const { palette } = useNeonTheme();
  const fontSize = useFontSize();
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const dbRef = useMemo(() => openNotesDb(), []);

  const loadNotes = useCallback(() => {
    dbRef.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT);',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM notes ORDER BY id DESC;',
            [],
            (_, { rows }) => setNotes(rows._array || []),
            (errorTx, error) => {
              console.log('Select error', error);
              return false;
            }
          );
        }
      );
    });
  }, [dbRef]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const addNote = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    dbRef.transaction((tx) => {
      tx.executeSql('INSERT INTO notes (text) VALUES (?);', [trimmed], () => {
        setDraft('');
        loadNotes();
      });
    });
  }, [dbRef, draft, loadNotes]);

  const deleteNote = useCallback(
    (id) => {
      dbRef.transaction((tx) => {
        tx.executeSql('DELETE FROM notes WHERE id = ?;', [id], () => loadNotes());
      });
    },
    [dbRef, loadNotes]
  );

  return (
    <ScreenContainer>
      <Animated.Text
        entering={FadeInDown.delay(60)}
        style={[styles.screenTitle, { color: palette.textPrimary, fontSize: fontSize(28) }]}
      >
        Skrybe Notes
      </Animated.Text>
      <Text
        style={[styles.screenSubtitle, { color: palette.textSecondary, fontSize: fontSize(15) }]}
      >
        Encrypted thoughts and strategies synced with SQLite.
      </Text>

      <NeonCard>
        <TextInput
          placeholder="Capture a secure insight"
          placeholderTextColor={palette.textSecondary}
          multiline
          value={draft}
          onChangeText={setDraft}
          style={{
            color: palette.textPrimary,
            fontSize: fontSize(15),
            minHeight: 90,
            marginBottom: 12,
          }}
        />
        <PrimaryButton title="Add Note" icon="save" onPress={addNote} />
      </NeonCard>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {notes.map((note) => (
          <NeonCard key={note.id} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: palette.textPrimary,
                    fontSize: fontSize(16),
                    fontWeight: '600',
                  }}
                >
                  Entry #{note.id}
                </Text>
                <Text
                  style={{
                    color: palette.textSecondary,
                    fontSize: fontSize(14),
                    marginTop: 8,
                    lineHeight: fontSize(20),
                  }}
                >
                  {note.text}
                </Text>
              </View>
              <Pressable
                onPress={() => deleteNote(note.id)}
                style={({ pressed }) => [
                  styles.deleteButton,
                  {
                    borderColor: palette.border,
                    backgroundColor: pressed ? `${palette.glow}33` : palette.overlay,
                  },
                ]}
              >
                <Ionicons name="trash" size={18} color={palette.textSecondary} />
              </Pressable>
            </View>
          </NeonCard>
        ))}
        {notes.length === 0 && (
          <Animated.Text
            entering={FadeIn.delay(200)}
            style={{ color: palette.textSecondary, textAlign: 'center', marginTop: 32 }}
          >
            Your neon notebook is waiting for its first encrypted pulse.
          </Animated.Text>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const DrawerRoutes = () => {
  const { mode, palette, accent } = useNeonTheme();

  const navigationTheme = useMemo(() => {
    const base = mode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: palette.backgroundGradient[0],
        card: palette.surface,
        text: palette.textPrimary,
        border: palette.border,
        primary: accent,
      },
    };
  }, [mode, palette, accent]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          drawerActiveTintColor: accent,
          drawerInactiveTintColor: palette.textSecondary,
          drawerStyle: { backgroundColor: palette.surface, borderRightColor: palette.border },
          drawerLabelStyle: { fontWeight: '600' },
          sceneContainerStyle: { backgroundColor: palette.backgroundGradient[0] },
          drawerIcon: ({ color, size }) => {
            const iconMap = {
              Core: 'chatbubbles',
              Lyfe: 'stats-chart',
              Stryke: 'game-controller',
              Tree: 'git-branch',
              Zone: 'people',
              Settings: 'options',
              Skrybe: 'document-text',
            };
            return <Ionicons name={iconMap[route.name] || 'ellipse'} size={size} color={color} />;
          },
        })}
      >
        <Drawer.Screen name="Core" component={CoreScreen} />
        <Drawer.Screen name="Lyfe" component={LyfeScreen} />
        <Drawer.Screen name="Stryke" component={StrykeScreen} />
        <Drawer.Screen name="Tree" component={TreeScreen} />
        <Drawer.Screen name="Zone" component={ZoneScreen} />
        <Drawer.Screen name="Skrybe" component={SkrybeScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const StatusManager = () => {
    const { mode } = useNeonTheme();
    return <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusManager />
          <DrawerRoutes />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screenGradient: {
    flex: 1,
  },
  screenPadding: {
    flex: 1,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
  screenSubtitle: {
    lineHeight: 20,
    marginBottom: 16,
  },
  cardShadow: {
    borderRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  primaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  primaryButtonText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  conversationRow: {
    marginBottom: 16,
  },
  conversationChip: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    width: 200,
  },
  conversationTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  conversationSubtitle: {
    opacity: 0.9,
  },
  messageBubble: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },
  composerInput: {
    flex: 1,
  },
  metricLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  metricValue: {
    fontWeight: '700',
    marginTop: 4,
  },
  progressTrack: {
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressCaption: {
    marginTop: 10,
  },
  lessonTitle: {
    fontWeight: '700',
  },
  lessonSubtitle: {
    marginTop: 8,
  },
  scenarioTitle: {
    fontWeight: '700',
  },
  scenarioDescription: {
    marginTop: 10,
    lineHeight: 20,
  },
  choiceResult: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalNode: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  composerCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 110,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accentSwatch: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
  },
  sliderTrack: {
    width: 220,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
  },
  sliderKnob: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    top: 0,
    left: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
