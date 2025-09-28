import 'react-native-gesture-handler';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';
import { StatusBar, View, Text, TextInput, ScrollView, Pressable, Switch, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  FadeInRight,
  SlideInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const Drawer = createDrawerNavigator();
const ThemeContext = createContext(null);
const accentChoices = ['#7FFFD4', '#9F7FFF', '#40E0D0'];
const FONT_SCALE_RANGE = { min: 0.85, max: 1.25 };
const SLIDER_TRACK_WIDTH = 240;
const SLIDER_KNOB = 28;
const db = SQLite.openDatabase('vyral.db');

const themePalettes = {
  dark: {
    background: '#02040C',
    surface: '#061128',
    overlay: '#0B1B3C',
    textPrimary: '#F5FAFF',
    textSecondary: '#A9C2FF',
    border: 'rgba(126, 255, 244, 0.35)',
    shadow: {
      shadowColor: '#7FFFD4',
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 18 },
      shadowRadius: 32,
      elevation: 12,
    },
  },
  light: {
    background: '#EBF4FF',
    surface: '#F6F9FF',
    overlay: '#FFFFFF',
    textPrimary: '#06102A',
    textSecondary: '#415480',
    border: 'rgba(64, 224, 208, 0.45)',
    shadow: {
      shadowColor: '#9F7FFF',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 24,
      elevation: 8,
    },
  },
};

const useThemeValues = () => useContext(ThemeContext);

const NeonBackground = ({ children }) => {
  const { themeMode } = useThemeValues();
  const colors =
    themeMode === 'dark'
      ? ['#02040C', '#050A1F', '#0A193A']
      : ['#EEF6FF', '#E9F2FF', '#F5EDFF'];

  return (
    <LinearGradient colors={colors} style={styles.gradientBackground}>
      {children}
    </LinearGradient>
  );
};

const NeonCard = ({ children, accent, style }) => {
  const { accentColor, themePalette } = useThemeValues();
  return (
    <LinearGradient
      colors={[themePalette.surface, themePalette.overlay]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.neonCard,
        themePalette.shadow,
        {
          borderColor: accent || `${accentColor}66`,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
};

const NeonButton = ({ label, onPress, icon, active }) => {
  const { accentColor, themePalette } = useThemeValues();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.neonButton,
        {
          borderColor: active ? accentColor : `${accentColor}55`,
          backgroundColor: active ? `${accentColor}22` : 'transparent',
          opacity: pressed ? 0.8 : 1,
        },
        themePalette.shadow,
      ]}
    >
      <LinearGradient
        colors={[`${accentColor}33`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.neonButtonGradient}
      />
      <View style={styles.neonButtonContent}>
        {icon}
        <Text style={[styles.neonButtonText, { color: themePalette.textPrimary }]}>{label}</Text>
      </View>
    </Pressable>
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

const FontSlider = () => {
  const { fontScale, setFontScale, accentColor, themePalette } = useThemeValues();
  const ratio = useSharedValue(
    (fontScale - FONT_SCALE_RANGE.min) / (FONT_SCALE_RANGE.max - FONT_SCALE_RANGE.min)
  );
  const startRatio = useSharedValue(ratio.value);
  const sliderRange = SLIDER_TRACK_WIDTH - SLIDER_KNOB;

  useEffect(() => {
    ratio.value = withTiming(
      (fontScale - FONT_SCALE_RANGE.min) / (FONT_SCALE_RANGE.max - FONT_SCALE_RANGE.min),
      { duration: 180 }
    );
  }, [fontScale, ratio]);

  const updateScale = useCallback(
    (nextRatio) => {
      const clamped = Math.max(0, Math.min(1, nextRatio));
      const scaled = FONT_SCALE_RANGE.min + clamped * (FONT_SCALE_RANGE.max - FONT_SCALE_RANGE.min);
      setFontScale(Number(scaled.toFixed(2)));
    },
    [setFontScale]
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startRatio.value = ratio.value;
        })
        .onUpdate((event) => {
          const delta = event.translationX / sliderRange;
          const next = Math.max(0, Math.min(1, startRatio.value + delta));
          ratio.value = next;
          runOnJS(updateScale)(next);
        }),
    [ratio, sliderRange, startRatio, updateScale]
  );

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ratio.value * sliderRange }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: ratio.value * SLIDER_TRACK_WIDTH,
  }));

  return (
    <View style={styles.sliderWrapper}>
      <Text style={[styles.sliderLabel, { color: themePalette.textSecondary }]}>Font Scale</Text>
      <GestureDetector gesture={pan}>
        <View
          style={[
            styles.sliderTrack,
            {
              backgroundColor: `${accentColor}22`,
              borderColor: `${accentColor}55`,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.sliderFill,
              { backgroundColor: `${accentColor}66` },
              fillStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.sliderKnob,
              {
                backgroundColor: accentColor,
                shadowColor: accentColor,
              },
              knobStyle,
            ]}
          >
            <Ionicons name="color-wand" size={16} color="#02040C" />
          </Animated.View>
        </View>
      </GestureDetector>
      <Text style={[styles.sliderValue, { color: themePalette.textPrimary }]}>{fontScale.toFixed(2)}x</Text>
    </View>
  );
};

const CoreScreen = () => {
  const { accentColor, fontScale, themePalette, themeMode } = useThemeValues();
  const [activeChatId, setActiveChatId] = useState('neon-core');
  const [messageDraft, setMessageDraft] = useState('');
  const chats = useMemo(
    () => [
      {
        id: 'neon-core',
        title: 'Neon Core',
        description: 'Collaborative response hub',
        messages: [
          { id: 'm1', from: 'Nova', body: 'Ready to deploy the safe-text patch?', time: '22:12' },
          { id: 'm2', from: 'You', body: 'Patch is green. Pushing to swarm now.', time: '22:13' },
          { id: 'm3', from: 'Nova', body: 'Copy. Monitoring for rogue spikes.', time: '22:14' },
        ],
      },
      {
        id: 'alliance',
        title: 'Synthwave Alliance',
        description: 'Consent guardians & vibe mentors',
        messages: [
          { id: 'm4', from: 'Echo', body: 'Reminder: share the boundary doc tonight.', time: '20:44' },
          { id: 'm5', from: 'You', body: 'Draft almost ready—uploading soon.', time: '20:46' },
        ],
      },
      {
        id: 'pulse',
        title: 'Pulse Guardians',
        description: 'Moderation command stream',
        messages: [
          { id: 'm6', from: 'Ryn', body: 'New member requesting orientation.', time: '19:20' },
          { id: 'm7', from: 'You', body: 'Routing them through safe-text welcome.', time: '19:23' },
        ],
      },
    ],
    []
  );

  const [chatData, setChatData] = useState(chats);

  const activeChat = chatData.find((room) => room.id === activeChatId) || chatData[0];

  const sendMessage = useCallback(() => {
    const trimmed = messageDraft.trim();
    if (!trimmed || !activeChat) return;

    setChatData((prev) =>
      prev.map((room) =>
        room.id === activeChat.id
          ? {
              ...room,
              messages: [
                ...room.messages,
                {
                  id: `${room.id}-${Date.now()}`,
                  from: 'You',
                  body: trimmed,
                  time: 'Now',
                },
                {
                  id: `${room.id}-${Date.now()}-bot`,
                  from: 'Nova',
                  body: 'Affirmative. Logging the update.',
                  time: 'Now',
                },
              ],
            }
          : room
      )
    );
    setMessageDraft('');
  }, [messageDraft, activeChat]);

  const isDark = themeMode === 'dark';
  const composerGradient = isDark ? ['#08142C', '#050A1F'] : ['#FFFFFF', '#E8EEFF'];

  return (
    <ScreenShell>
      <Text style={[styles.screenHeading, { color: themePalette.textPrimary, fontSize: 26 * fontScale }]}>Core</Text>
      <Text style={[styles.sectionDescription, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
        Collaborative chat streams with neon-quiet message lanes.
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chatTabs}>
        {chatData.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInRight.delay(index * 60)}>
            <NeonButton
              label={item.title}
              active={activeChatId === item.id}
              onPress={() => setActiveChatId(item.id)}
              icon={<Ionicons name="chatbubble-ellipses-outline" size={18} color={themePalette.textPrimary} />}
            />
          </Animated.View>
        ))}
      </ScrollView>
      <NeonCard style={styles.chatCard}>
        <LinearGradient
          colors={[`${accentColor}11`, 'transparent']}
          style={styles.chatGradient}
        />
        <Text style={[styles.chatTitle, { color: themePalette.textPrimary, fontSize: 20 * fontScale }]}>
          {activeChat.title}
        </Text>
        <Text style={[styles.chatSubtitle, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
          {activeChat.description}
        </Text>
        <View style={styles.messageList}>
          {activeChat.messages.map((message, index) => {
            const isUser = message.from === 'You';
            return (
              <Animated.View
                key={message.id}
                entering={FadeInUp.delay(index * 70)}
                style={[
                  styles.messageBubble,
                  {
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    borderColor: isUser ? accentColor : `${accentColor}55`,
                    backgroundColor: isUser ? `${accentColor}20` : `${accentColor}15`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.messageSender,
                    { color: themePalette.textSecondary, textAlign: isUser ? 'right' : 'left', fontSize: 12 * fontScale },
                  ]}
                >
                  {message.from} • {message.time}
                </Text>
                <Text
                  style={[
                    styles.messageBody,
                    { color: themePalette.textPrimary, textAlign: isUser ? 'right' : 'left', fontSize: 15 * fontScale },
                  ]}
                >
                  {message.body}
                </Text>
              </Animated.View>
            );
          })}
        </View>
        <LinearGradient colors={composerGradient} style={styles.composerShell}>
          <TextInput
            placeholder="Transmit a luminous update"
            placeholderTextColor={isDark ? 'rgba(200,230,255,0.6)' : 'rgba(30,40,80,0.45)'}
            style={[styles.composerInput, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}
            value={messageDraft}
            onChangeText={setMessageDraft}
          />
          <Pressable
            onPress={sendMessage}
            style={({ pressed }) => [styles.sendButton, { opacity: pressed ? 0.75 : 1, backgroundColor: accentColor }]}
          >
            <Ionicons name="arrow-up" size={18} color={isDark ? '#02040C' : '#02040C'} />
          </Pressable>
        </LinearGradient>
      </NeonCard>
    </ScreenShell>
  );
};

const LyfeScreen = () => {
  const { accentColor, fontScale, themePalette } = useThemeValues();
  const [lessons, setLessons] = useState([
    { id: 'resonance', title: 'Resonant Listening', xp: 120, completed: true },
    { id: 'boundaries', title: 'Boundary Crafting', xp: 90, completed: false },
    { id: 'reflect', title: 'Reflective Feedback Loop', xp: 150, completed: false },
    { id: 'calibrate', title: 'Calibrate Emotional Signals', xp: 200, completed: false },
  ]);

  const totalXP = lessons.reduce((sum, lesson) => sum + (lesson.completed ? lesson.xp : 0), 0);
  const potentialXP = lessons.reduce((sum, lesson) => sum + lesson.xp, 0);
  const progress = potentialXP === 0 ? 0 : totalXP / potentialXP;
  const progressWidth = useSharedValue(progress);

  useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 400 });
  }, [progress, progressWidth]);

  const toggleLesson = useCallback(
    (id) => {
      setLessons((prev) => prev.map((lesson) => (lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson)));
    },
    []
  );

  const animatedBar = useAnimatedStyle(() => ({ width: `${Math.max(0.08, progressWidth.value * 100)}%` }));

  return (
    <ScreenShell>
      <Text style={[styles.screenHeading, { color: themePalette.textPrimary, fontSize: 26 * fontScale }]}>Lyfe</Text>
      <Text style={[styles.sectionDescription, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
        Lock in life lessons, earn XP, and evolve your neon habits.
      </Text>
      <NeonCard>
        <Text style={[styles.sectionTitle, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>Momentum</Text>
        <View style={styles.progressBarShell}>
          <Animated.View
            entering={FadeInDown}
            style={[styles.progressBarFill, { backgroundColor: accentColor }, animatedBar]}
          />
        </View>
        <Text style={[styles.xpLabel, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
          {totalXP} XP earned of {potentialXP} XP
        </Text>
      </NeonCard>
      <View style={styles.lessonList}>
        {lessons.map((lesson, index) => (
          <Animated.View key={lesson.id} entering={FadeInUp.delay(index * 70)}>
            <NeonCard style={styles.lessonCard}>
              <View style={styles.lessonHeader}>
                <Text style={[styles.lessonTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>
                  {lesson.title}
                </Text>
                <Pressable
                  onPress={() => toggleLesson(lesson.id)}
                  style={({ pressed }) => [
                    styles.lessonToggle,
                    {
                      backgroundColor: lesson.completed ? accentColor : 'transparent',
                      borderColor: accentColor,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.lessonToggleText,
                      { color: lesson.completed ? '#02040C' : themePalette.textSecondary, fontSize: 12 * fontScale },
                    ]}
                  >
                    {lesson.completed ? 'Complete' : 'Start'}
                  </Text>
                </Pressable>
              </View>
              <Text style={[styles.lessonXP, { color: themePalette.textSecondary, fontSize: 13 * fontScale }]}>
                {lesson.xp} XP
              </Text>
            </NeonCard>
          </Animated.View>
        ))}
      </View>
    </ScreenShell>
  );
};

const StrykeScreen = () => {
  const { accentColor, fontScale, themePalette } = useThemeValues();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choiceResult, setChoiceResult] = useState(null);
  const scenarios = useMemo(
    () => [
      {
        id: 'distortion',
        title: 'Distortion at the Neon Gate',
        prompt: 'A contact broadcasts a destabilized rumor. Do you confront them publicly or route a private pulse?',
        options: [
          {
            id: 'public',
            label: 'Public Call-Out',
            effect: 'The feed erupts. Trust dips. Gain intel but lose 40 reputation.',
          },
          {
            id: 'private',
            label: 'Private Resonance',
            effect: 'They recalibrate quietly. Cohesion rises. Gain 25 empathy XP.',
          },
        ],
      },
      {
        id: 'echoes',
        title: 'Echoes in the Safe Room',
        prompt: 'A teammate ghosts mid-mission. Do you pause the mission or reroute without them?',
        options: [
          {
            id: 'pause',
            label: 'Pause & Reflect',
            effect: 'Momentum slows but loyalty solidifies. Crew morale +18.',
          },
          {
            id: 'reroute',
            label: 'Reroute Solo',
            effect: 'Mission completes swiftly but you lose shared XP opportunities.',
          },
        ],
      },
    ],
    []
  );

  const scenario = scenarios[scenarioIndex];

  const chooseOption = (option) => {
    setChoiceResult({
      ...option,
      scenarioId: scenario.id,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const nextScenario = () => {
    setChoiceResult(null);
    setScenarioIndex((prev) => (prev + 1) % scenarios.length);
  };

  return (
    <ScreenShell scrollable={false}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.screenHeading, { color: themePalette.textPrimary, fontSize: 26 * fontScale }]}>Stryke</Text>
        <Text style={[styles.sectionDescription, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
          Make neon decisions and watch the ripple effect.
        </Text>
        <Animated.View style={{ flex: 1 }} entering={FadeIn} layout={Layout.springify()}>
          <NeonCard style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: themePalette.textPrimary, fontSize: 20 * fontScale }]}>
              {scenario.title}
            </Text>
            <Text style={[styles.sectionDescription, { color: themePalette.textSecondary, fontSize: 15 * fontScale }]}>
              {scenario.prompt}
            </Text>
            <View style={styles.optionsList}>
              {scenario.options.map((option, index) => (
                <Animated.View key={option.id} entering={FadeInUp.delay(index * 90)} layout={Layout}>
                  <Pressable
                    onPress={() => chooseOption(option)}
                    style={({ pressed }) => [
                      styles.optionButton,
                      {
                        borderColor: accentColor,
                        backgroundColor:
                          choiceResult && choiceResult.id === option.id ? `${accentColor}22` : `${accentColor}11`,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.optionText, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>
                      {option.label}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
            {choiceResult ? (
              <Animated.View entering={SlideInUp.duration(220)} style={styles.choiceResult}>
                <Ionicons name="pulse" size={20} color={accentColor} />
                <Text style={[styles.choiceResultText, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}>
                  {choiceResult.effect}
                </Text>
                <Text style={[styles.choiceTimestamp, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>
                  Logged {choiceResult.timestamp}
                </Text>
                <Pressable
                  onPress={nextScenario}
                  style={({ pressed }) => [styles.nextScenarioButton, { opacity: pressed ? 0.85 : 1, borderColor: accentColor }]}
                >
                  <Text style={[styles.nextScenarioLabel, { color: accentColor, fontSize: 13 * fontScale }]}>Next Decision</Text>
                </Pressable>
              </Animated.View>
            ) : (
              <Text style={[styles.choiceHint, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
                Select a trajectory to reveal impact data.
              </Text>
            )}
          </NeonCard>
        </Animated.View>
      </View>
    </ScreenShell>
  );
};

const goalTree = [
  {
    id: 'root-safety',
    label: 'Safety Protocol',
    children: [
      { id: 'sub-trust', label: 'Trust Calibration', children: [{ id: 'node-review', label: 'Review Consent Scripts' }] },
      {
        id: 'sub-tech',
        label: 'Tech Shield',
        children: [
          { id: 'node-audit', label: 'Run Weekly Audit' },
          { id: 'node-encrypt', label: 'Upgrade Encryption' },
        ],
      },
    ],
  },
  {
    id: 'root-growth',
    label: 'Growth Protocol',
    children: [
      { id: 'sub-community', label: 'Community Ritual', children: [{ id: 'node-sync', label: 'Host Sync Night' }] },
      {
        id: 'sub-expansion',
        label: 'Expansion Roadmap',
        children: [
          { id: 'node-partner', label: 'Curate Partners' },
          { id: 'node-content', label: 'Deploy Learning Vault' },
        ],
      },
    ],
  },
];

const TreeNode = ({ node, depth, expandedNodes, onToggle }) => {
  const { accentColor, fontScale, themePalette } = useThemeValues();
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const expanded = !!expandedNodes[node.id];

  return (
    <View style={{ marginLeft: depth * 20 }}>
      <Pressable
        onPress={() => {
          if (hasChildren) {
            onToggle(node.id);
          }
        }}
        style={({ pressed }) => [
          styles.treeNode,
          {
            borderColor: `${accentColor}66`,
            backgroundColor: `${accentColor}11`,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <LinearGradient colors={[`${accentColor}33`, 'transparent']} style={StyleSheet.absoluteFill} />
        <Text style={[styles.treeLabel, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}>{node.label}</Text>
        {hasChildren && (
          <Ionicons
            name={expanded ? 'chevron-up-circle' : 'chevron-down-circle'}
            size={20}
            color={accentColor}
            style={styles.treeIcon}
          />
        )}
      </Pressable>
      {hasChildren && expanded && (
        <Animated.View entering={FadeInDown} layout={Layout.springify()} style={styles.treeChildren}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const TreeScreen = () => {
  const { fontScale, themePalette } = useThemeValues();
  const [expandedNodes, setExpandedNodes] = useState({});

  const toggleNode = (id) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (nodes, depth = 0) =>
    nodes.map((node) => (
      <TreeNode
        key={node.id}
        node={node}
        depth={depth}
        expandedNodes={expandedNodes}
        onToggle={toggleNode}
      />
    ));

  return (
    <ScreenShell>
      <Text style={[styles.screenHeading, { color: themePalette.textPrimary, fontSize: 26 * fontScale }]}>Tree</Text>
      <Text style={[styles.sectionDescription, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
        Tap nodes to expand nested goals and visualize your neon roadmap.
      </Text>
      <View style={styles.treeContainer}>{renderTree(goalTree)}</View>
    </ScreenShell>
  );
};

const ZoneScreen = () => {
  const { accentColor, fontScale, themePalette } = useThemeValues();
  const [posts, setPosts] = useState([
    { id: 'p1', author: 'Nova', body: 'Synth meet tonight—bring your favourite resonance track.', time: '20:11' },
    { id: 'p2', author: 'Echo', body: 'Consent protocols updated in the vault. Review + sign.', time: '19:42' },
  ]);
  const [composer, setComposer] = useState('');

  const addPost = () => {
    const trimmed = composer.trim();
    if (!trimmed) return;
    const now = new Date();
    setPosts((prev) => [
      {
        id: `post-${now.getTime()}`,
        author: 'You',
        body: trimmed,
        time: `${now.getHours()}:${`${now.getMinutes()}`.padStart(2, '0')}`,
      },
      ...prev,
    ]);
    setComposer('');
  };

  return (
    <ScreenShell scrollable={false}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.screenHeading, { color: themePalette.textPrimary, fontSize: 26 * fontScale }]}>Zone</Text>
        <Text style={[styles.sectionDescription, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
          Community feed for luminous updates. Drop your pulse.
        </Text>
        <NeonCard style={styles.feedComposer}>
          <Text style={[styles.sectionTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Broadcast</Text>
          <TextInput
            value={composer}
            onChangeText={setComposer}
            placeholder="Share a neon signal"
            placeholderTextColor={themePalette.textSecondary + '66'}
            style={[styles.feedInput, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}
            multiline
          />
          <Pressable
            onPress={addPost}
            style={({ pressed }) => [
              styles.postButton,
              { backgroundColor: accentColor, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={[styles.postButtonText, { fontSize: 14 * fontScale }]}>Transmit</Text>
          </Pressable>
        </NeonCard>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContent}
        >
          {posts.map((post, index) => (
            <Animated.View key={post.id} entering={FadeInUp.delay(index * 70)}>
              <NeonCard style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Text style={[styles.postAuthor, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}>
                    {post.author}
                  </Text>
                  <Text style={[styles.postTime, { color: themePalette.textSecondary, fontSize: 12 * fontScale }]}>
                    {post.time}
                  </Text>
                </View>
                <Text style={[styles.postBody, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}>
                  {post.body}
                </Text>
              </NeonCard>
            </Animated.View>
          ))}
        </ScrollView>
        <Pressable
          onPress={addPost}
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: accentColor,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          <Ionicons name="add" size={26} color="#02040C" />
        </Pressable>
      </View>
    </ScreenShell>
  );
};

const useNotes = () => {
  const [notes, setNotes] = useState([]);

  const loadNotes = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)'
      );
      tx.executeSql('SELECT * FROM notes ORDER BY id DESC', [], (_, result) => {
        setNotes(result.rows._array || []);
      });
    });
  }, []);

  const addNote = useCallback((text) => {
    if (!text.trim()) return;
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO notes (text) VALUES (?)', [text.trim()], () => {
        loadNotes();
      });
    });
  }, [loadNotes]);

  const deleteNote = useCallback((id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM notes WHERE id = ?', [id], () => {
        loadNotes();
      });
    });
  }, [loadNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return { notes, addNote, deleteNote };
};

const SkrybeScreen = () => {
  const { accentColor, fontScale, themePalette } = useThemeValues();
  const { notes, addNote, deleteNote } = useNotes();
  const [draft, setDraft] = useState('');

  const submitNote = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    addNote(trimmed);
    setDraft('');
  };

  return (
    <ScreenShell>
      <Text style={[styles.screenHeading, { color: themePalette.textPrimary, fontSize: 26 * fontScale }]}>Skrybe</Text>
      <Text style={[styles.sectionDescription, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
        Persistent neon notes. SQLite-backed, always synced.
      </Text>
      <NeonCard>
        <Text style={[styles.sectionTitle, { color: themePalette.textPrimary, fontSize: 18 * fontScale }]}>New Note</Text>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Encode a luminous insight"
          placeholderTextColor={themePalette.textSecondary + '66'}
          style={[styles.noteInput, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}
          multiline
        />
        <Pressable
          onPress={submitNote}
          style={({ pressed }) => [styles.noteButton, { backgroundColor: accentColor, opacity: pressed ? 0.82 : 1 }]}
        >
          <Text style={[styles.noteButtonText, { fontSize: 14 * fontScale }]}>Archive</Text>
        </Pressable>
      </NeonCard>
      <View style={styles.notesList}>
        {notes.map((note) => (
          <Animated.View key={note.id} entering={FadeInUp}>
            <NeonCard style={styles.noteCard}>
              <Text style={[styles.noteText, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}>
                {note.text}
              </Text>
              <Pressable
                onPress={() => deleteNote(note.id)}
                style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Ionicons name="trash" size={18} color={accentColor} />
              </Pressable>
            </NeonCard>
          </Animated.View>
        ))}
        {notes.length === 0 && (
          <Text style={[styles.emptyState, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
            No notes yet—archive your first insight above.
          </Text>
        )}
      </View>
    </ScreenShell>
  );
};

const SettingsScreen = () => {
  const { themeMode, setThemeMode, accentColor, setAccentColor, themePalette, fontScale } = useThemeValues();
  const isDark = themeMode === 'dark';

  return (
    <ScreenShell>
      <Text style={[styles.screenHeading, { color: themePalette.textPrimary, fontSize: 26 * fontScale }]}>Settings</Text>
      <Text style={[styles.sectionDescription, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
        Tailor the neon vibe to your senses.
      </Text>
      <NeonCard>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>Dark Mode</Text>
          <Switch value={isDark} onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')} trackColor={{ true: accentColor }} />
        </View>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>Accent</Text>
          <View style={styles.swatchRow}>
            {accentChoices.map((color) => (
              <Pressable
                key={color}
                onPress={() => setAccentColor(color)}
                style={({ pressed }) => [
                  styles.colorSwatch,
                  {
                    backgroundColor: color,
                    transform: [{ scale: accentColor === color ? 1.1 : pressed ? 0.95 : 1 }],
                    borderColor: accentColor === color ? themePalette.textPrimary : 'transparent',
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <FontSlider />
      </NeonCard>
    </ScreenShell>
  );
};

const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('dark');
  const [accentColor, setAccentColor] = useState(accentChoices[0]);
  const [fontScale, setFontScale] = useState(1);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      accentColor,
      setAccentColor,
      fontScale,
      setFontScale,
      themePalette: themePalettes[themeMode],
    }),
    [themeMode, accentColor, fontScale]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const AppContainer = () => {
  const { themeMode, themePalette, accentColor } = useThemeValues();
  const barStyle = themeMode === 'dark' ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar barStyle={barStyle} translucent backgroundColor="transparent" />
      <NavigationContainer
      theme={
        themeMode === 'dark'
          ? {
              ...DarkTheme,
              colors: { ...DarkTheme.colors, background: themePalette.background, card: themePalette.surface },
            }
          : {
              ...DefaultTheme,
              colors: { ...DefaultTheme.colors, background: themePalette.background, card: themePalette.surface },
            }
      }
      >
        <Drawer.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            drawerActiveTintColor: accentColor,
            drawerInactiveTintColor: themePalette.textSecondary,
          drawerStyle: { backgroundColor: themePalette.surface },
          drawerLabelStyle: { fontSize: 15 },
          sceneContainerStyle: { backgroundColor: 'transparent' },
          drawerIcon: ({ color, size }) => {
            const iconMap = {
              Core: 'chatbubbles-outline',
              Lyfe: 'flash-outline',
              Stryke: 'game-controller-outline',
              Tree: 'git-branch-outline',
              Zone: 'planet-outline',
              Settings: 'options-outline',
              Skrybe: 'document-text-outline',
            };
            return <Ionicons name={iconMap[route.name] || 'radio-outline'} size={size} color={color} />;
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
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContainer />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  screenContent: {
    paddingBottom: 40,
    gap: 18,
  },
  neonCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  neonButton: {
    marginRight: 12,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  neonButtonGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  neonButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  neonButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  screenHeading: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  sectionDescription: {
    fontSize: 15,
    opacity: 0.88,
    lineHeight: 21,
  },
  chatTabs: {
    paddingVertical: 10,
  },
  chatCard: {
    paddingBottom: 20,
  },
  chatGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  chatSubtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  messageList: {
    gap: 12,
    marginBottom: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: '82%',
  },
  messageSender: {
    fontSize: 12,
    marginBottom: 6,
  },
  messageBody: {
    fontSize: 15,
    lineHeight: 20,
  },
  composerShell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  composerInput: {
    flex: 1,
    marginRight: 12,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarShell: {
    height: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  xpLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  lessonList: {
    gap: 12,
  },
  lessonCard: {
    marginBottom: 0,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  lessonToggle: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  lessonToggleText: {
    fontWeight: '600',
  },
  lessonXP: {
    fontSize: 13,
  },
  optionsList: {
    marginTop: 20,
    gap: 14,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  choiceResult: {
    marginTop: 22,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  choiceResultText: {
    lineHeight: 20,
  },
  choiceTimestamp: {
    fontSize: 12,
  },
  choiceHint: {
    marginTop: 28,
    textAlign: 'center',
  },
  nextScenarioButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  nextScenarioLabel: {
    fontWeight: '600',
  },
  treeContainer: {
    marginTop: 12,
    gap: 14,
  },
  treeNode: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  treeLabel: {
    fontWeight: '600',
  },
  treeIcon: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  treeChildren: {
    marginTop: 6,
    marginLeft: 12,
  },
  feedComposer: {
    marginBottom: 12,
  },
  feedInput: {
    minHeight: 60,
    marginBottom: 12,
  },
  postButton: {
    alignSelf: 'flex-end',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  postButtonText: {
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#02040C',
  },
  feedContent: {
    paddingBottom: 100,
    gap: 12,
  },
  postCard: {
    marginBottom: 0,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAuthor: {
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
  },
  postBody: {
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  sliderWrapper: {
    marginTop: 20,
    gap: 12,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  sliderTrack: {
    width: SLIDER_TRACK_WIDTH,
    height: 18,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  sliderKnob: {
    position: 'absolute',
    top: -5,
    width: SLIDER_KNOB,
    height: SLIDER_KNOB,
    borderRadius: SLIDER_KNOB / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  settingLabel: {
    fontWeight: '600',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
  noteInput: {
    minHeight: 80,
    marginBottom: 12,
  },
  noteButton: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  noteButtonText: {
    fontWeight: '700',
    color: '#02040C',
    letterSpacing: 0.4,
  },
  notesList: {
    gap: 12,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  noteText: {
    flex: 1,
    marginRight: 12,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 12,
  },
  emptyState: {
    textAlign: 'center',
    marginTop: 12,
  },
});
