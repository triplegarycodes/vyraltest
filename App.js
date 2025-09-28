import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState, createContext, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import Animated, { FadeIn, FadeInUp, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const accentOptions = ['#7fffd4', '#9f7fff', '#2dd4bf'];

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('dark');
  const [accentColor, setAccentColor] = useState(accentOptions[0]);
  const [fontScale, setFontScale] = useState(1);

  const palette = useMemo(() => {
    const isDark = themeMode === 'dark';
    return {
      background: isDark ? '#050712' : '#f5f8ff',
      surface: isDark ? 'rgba(12,18,38,0.92)' : 'rgba(255,255,255,0.88)',
      overlay: isDark ? 'rgba(14,22,44,0.6)' : 'rgba(200,213,255,0.4)',
      textPrimary: isDark ? '#f6f9ff' : '#0b1025',
      textSecondary: isDark ? '#99a3c4' : '#5d6a8f',
      border: isDark ? 'rgba(127,255,212,0.35)' : 'rgba(80,95,140,0.35)',
      shadow: isDark ? 'rgba(0, 255, 200, 0.35)' : 'rgba(79, 70, 229, 0.35)',
    };
  }, [themeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      accentColor,
      fontScale,
      palette,
      setThemeMode,
      setAccentColor,
      setFontScale,
    }),
    [themeMode, accentColor, fontScale, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const NeonScreen = ({ children }) => {
  const { palette, accentColor } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[palette.background, '#090c1c']}
      style={[styles.screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
    >
      <View style={[styles.screenOverlay, { borderColor: accentColor, backgroundColor: palette.overlay }]}>
        {children}
      </View>
    </LinearGradient>
  );
};

const NeonCard = ({ children, style }) => {
  const { palette, accentColor } = useTheme();
  return (
    <LinearGradient
      colors={[`${accentColor}22`, palette.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderColor: accentColor, shadowColor: accentColor }, style]}
    >
      {children}
    </LinearGradient>
  );
};

const NeonButton = ({ title, icon, onPress, active }) => {
  const { palette, accentColor, fontScale } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.button,
        {
          borderColor: accentColor,
          backgroundColor: active ? `${accentColor}33` : palette.surface,
          shadowColor: accentColor,
        },
      ]}
    >
      <LinearGradient
        colors={[`${accentColor}55`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonGradient}
      >
        <View style={styles.buttonContent}>
          {icon ? <Ionicons name={icon} size={18 * fontScale} color={accentColor} style={styles.buttonIcon} /> : null}
          <Text style={[styles.buttonText, { color: palette.textPrimary, fontSize: 16 * fontScale }]}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const CoreScreen = () => {
  const { palette, accentColor, fontScale } = useTheme();
  const [activeChat, setActiveChat] = useState('Ops Team');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', chat: 'Ops Team', sender: 'Vex', text: 'Status sweep complete. All safe protocols green.' },
    { id: '2', chat: 'Ops Team', sender: 'Nova', text: 'Pushing nightly encryption update now.' },
    { id: '3', chat: 'Ops Team', sender: 'You', text: 'Copy. Monitoring network pings.' },
    { id: '4', chat: 'Pulse Lab', sender: 'Orion', text: 'New empathy script available for review.' },
  ]);

  const chats = useMemo(
    () => [
      { name: 'Ops Team', last: 'Encryption update complete' },
      { name: 'Pulse Lab', last: 'Empathy script ready' },
      { name: 'Wellness', last: 'Breath session logs synced' },
      { name: 'Strategy', last: 'Stryke path recalculated' },
    ],
    []
  );

  const filteredMessages = useMemo(
    () => messages.filter((msg) => msg.chat === activeChat),
    [messages, activeChat]
  );

  const handleSend = () => {
    if (!messageText.trim()) return;
    const payload = {
      id: Date.now().toString(),
      chat: activeChat,
      sender: 'You',
      text: messageText.trim(),
    };
    setMessages((prev) => [...prev, payload]);
    setMessageText('');
  };

  return (
    <NeonScreen>
      <Animated.View entering={FadeIn.duration(500)} style={{ gap: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          {chats.map((chat) => (
            <TouchableOpacity
              key={chat.name}
              onPress={() => setActiveChat(chat.name)}
              style={[
                styles.chatChip,
                {
                  borderColor: accentColor,
                  backgroundColor: activeChat === chat.name ? `${accentColor}33` : palette.surface,
                  shadowColor: accentColor,
                },
              ]}
            >
              <Text style={[styles.chatChipTitle, { color: palette.textPrimary, fontSize: 14 * fontScale }]}>{chat.name}</Text>
              <Text style={[styles.chatChipSubtitle, { color: palette.textSecondary, fontSize: 12 * fontScale }]}>{chat.last}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <NeonCard style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: accentColor, fontSize: 18 * fontScale }]}>Secure Thread</Text>
          <FlatList
            data={filteredMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
            renderItem={({ item, index }) => {
              const isSelf = item.sender === 'You';
              return (
                <Animated.View
                  entering={(index % 2 === 0 ? FadeInUp : FadeInDown).duration(450)}
                  style={{
                    alignSelf: isSelf ? 'flex-end' : 'flex-start',
                    maxWidth: '78%',
                  }}
                >
                  <LinearGradient
                    colors={isSelf ? [accentColor, `${accentColor}66`] : ['#1f233b', '#121630']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.messageBubble, { borderColor: accentColor, borderWidth: isSelf ? 0 : 1 }]}
                  >
                    <Text style={[styles.messageSender, { color: isSelf ? '#05111a' : palette.textSecondary, fontSize: 11 * fontScale }]}>{item.sender}</Text>
                    <Text style={[styles.messageText, { color: isSelf ? '#03161f' : palette.textPrimary, fontSize: 15 * fontScale }]}>{item.text}</Text>
                  </LinearGradient>
                </Animated.View>
              );
            }}
          />
          <View style={[styles.chatComposer, { borderColor: accentColor }]}> 
            <TextInput
              placeholder="Transmit a safe update..."
              placeholderTextColor={`${palette.textSecondary}aa`}
              value={messageText}
              onChangeText={setMessageText}
              style={[styles.chatInput, { color: palette.textPrimary, fontSize: 15 * fontScale }]}
            />
            <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: accentColor }]}> 
              <Ionicons name="send" size={18 * fontScale} color="#02101a" />
            </TouchableOpacity>
          </View>
        </NeonCard>
      </Animated.View>
    </NeonScreen>
  );
};

const LyfeScreen = () => {
  const { accentColor, palette, fontScale } = useTheme();
  const [lessons, setLessons] = useState([
    { id: 'pulse', title: 'Pulse Breathing', description: 'Prime your nervous system with synced breathing sets.', completed: true },
    { id: 'vision', title: 'Vision Mapping', description: 'Visualize three micro-goals for the next 24 hours.', completed: false },
    { id: 'connect', title: 'Connection Drill', description: 'Check in with a teammate using empathetic prompts.', completed: false },
    { id: 'reflect', title: 'Nightly Reflect', description: 'Log the strongest move and the lesson to adapt.', completed: false },
  ]);

  const xp = useMemo(() => lessons.filter((l) => l.completed).length * 120, [lessons]);
  const progress = useSharedValue(lessons.filter((l) => l.completed).length / lessons.length);

  useEffect(() => {
    progress.value = withTiming(lessons.filter((l) => l.completed).length / lessons.length, { duration: 400 });
  }, [lessons, progress]);

  const progressStyle = useAnimatedStyle(() => ({ width: `${Math.max(progress.value * 100, 8)}%` }));

  const toggleLesson = (id) => {
    LayoutAnimation.easeInEaseOut();
    setLessons((prev) => prev.map((lesson) => (lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson)));
  };

  return (
    <NeonScreen>
      <ScrollView contentContainerStyle={{ gap: 18 }} showsVerticalScrollIndicator={false}>
        <NeonCard>
          <Text style={[styles.sectionTitle, { color: accentColor, fontSize: 18 * fontScale }]}>Progress Pulse</Text>
          <Text style={[styles.mutedText, { color: palette.textSecondary, fontSize: 14 * fontScale }]}>XP secured</Text>
          <Text style={[styles.xpText, { color: palette.textPrimary, fontSize: 28 * fontScale }]}>{xp} XP</Text>
          <View style={[styles.progressTrack, { backgroundColor: `${accentColor}22` }]}
          >
            <Animated.View style={[styles.progressFill, { backgroundColor: accentColor }, progressStyle]} />
          </View>
        </NeonCard>

        {lessons.map((lesson, index) => (
          <Animated.View key={lesson.id} entering={FadeInUp.delay(index * 80).springify()}>
            <NeonCard style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.lessonTitle, { color: palette.textPrimary, fontSize: 18 * fontScale }]}>{lesson.title}</Text>
                <TouchableOpacity
                  onPress={() => toggleLesson(lesson.id)}
                  style={[styles.lessonToggle, { borderColor: accentColor, backgroundColor: lesson.completed ? `${accentColor}55` : 'transparent' }]}
                >
                  <Text style={[styles.lessonToggleText, { color: lesson.completed ? '#04151e' : accentColor, fontSize: 12 * fontScale }]}>
                    {lesson.completed ? 'Complete' : 'Start'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.lessonDescription, { color: palette.textSecondary, fontSize: 14 * fontScale }]}>{lesson.description}</Text>
            </NeonCard>
          </Animated.View>
        ))}
      </ScrollView>
    </NeonScreen>
  );
};

const StrykeScreen = () => {
  const { accentColor, palette, fontScale } = useTheme();
  const [outcome, setOutcome] = useState(null);
  const scenario = {
    prompt: 'A rival crew proposes a joint strike tonight. You have intel of a security sweep in that zone.',
    choices: [
      {
        id: 'sync',
        label: 'Sync up & adjust the plan',
        result: 'You reroute the mission, preserving alliances and gaining 45 intel credits.',
      },
      {
        id: 'decline',
        label: 'Decline & fortify your own op',
        result: 'The rival respects the call. Your crew gains 12 resilience momentum.',
      },
    ],
  };

  return (
    <NeonScreen>
      <NeonCard style={{ gap: 18 }}>
        <Text style={[styles.sectionTitle, { color: accentColor, fontSize: 20 * fontScale }]}>Stryke Scenario</Text>
        <Text style={[styles.mutedText, { color: palette.textSecondary, fontSize: 15 * fontScale }]}>{scenario.prompt}</Text>
        <View style={{ gap: 12 }}>
          {scenario.choices.map((choice) => (
            <NeonButton
              key={choice.id}
              title={choice.label}
              icon="flash"
              onPress={() => setOutcome(choice.result)}
              active={outcome === choice.result}
            />
          ))}
        </View>
        {outcome ? (
          <Animated.View entering={FadeInUp.duration(400)}>
            <NeonCard style={{ backgroundColor: 'transparent', borderStyle: 'dashed' }}>
              <Text style={[styles.outcomeText, { color: palette.textPrimary, fontSize: 16 * fontScale }]}>{outcome}</Text>
            </NeonCard>
          </Animated.View>
        ) : null}
      </NeonCard>
    </NeonScreen>
  );
};

const TreeNode = ({ node, depth = 0 }) => {
  const { accentColor, palette, fontScale } = useTheme();
  const [expanded, setExpanded] = useState(depth === 0);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={{ marginLeft: depth * 18, marginBottom: 16 }}>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.85}
        style={[
          styles.node,
          {
            borderColor: accentColor,
            shadowColor: accentColor,
            backgroundColor: expanded ? `${accentColor}22` : palette.surface,
          },
        ]}
      >
        <Text style={[styles.nodeTitle, { color: palette.textPrimary, fontSize: 16 * fontScale }]}>{node.title}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16 * fontScale}
          color={accentColor}
        />
      </TouchableOpacity>
      {expanded && node.children ? (
        <Animated.View entering={FadeIn.duration(250)}>
          {node.children.map((child) => (
            <TreeNode key={child.title} node={child} depth={depth + 1} />
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
};

const TreeScreen = () => {
  const goalTree = {
    title: 'Launch Week',
    children: [
      {
        title: 'Stabilize Core Ops',
        children: [
          { title: 'Daily Safe Chat Pulse' },
          { title: 'Encryption Rotation Update' },
        ],
      },
      {
        title: 'Elevate Community',
        children: [
          { title: 'Zone AMA Session' },
          { title: 'Drop Lyfe Lesson Pack' },
        ],
      },
      {
        title: 'Amplify Reach',
        children: [
          { title: 'Deploy Vyral Beacon' },
          { title: 'Secure 3 Creator Collabs' },
        ],
      },
    ],
  };

  return (
    <NeonScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <TreeNode node={goalTree} />
      </ScrollView>
    </NeonScreen>
  );
};

const ZoneScreen = () => {
  const { palette, accentColor, fontScale } = useTheme();
  const [posts, setPosts] = useState([
    { id: '1', author: 'Nova', text: 'Unlocked a new synthwave focus mix. Dropping it in Core now.' },
    { id: '2', author: 'Jett', text: 'Tonight’s flow session: 3 wins, 1 lesson. Tag yours below.' },
    { id: '3', author: 'Sable', text: 'Lyfe streak at 12 days. Progress bar humming neon.' },
  ]);
  const [composer, setComposer] = useState('');

  const addPost = () => {
    if (!composer.trim()) return;
    setPosts((prev) => [
      { id: Date.now().toString(), author: 'You', text: composer.trim() },
      ...prev,
    ]);
    setComposer('');
  };

  return (
    <NeonScreen>
      <View style={{ flex: 1 }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120, gap: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.delay(index * 70)}>
              <NeonCard>
                <Text style={[styles.postAuthor, { color: accentColor, fontSize: 13 * fontScale }]}>{item.author}</Text>
                <Text style={[styles.postText, { color: palette.textPrimary, fontSize: 16 * fontScale }]}>{item.text}</Text>
              </NeonCard>
            </Animated.View>
          )}
        />
        <LinearGradient
          colors={['#00000000', palette.background]}
          style={styles.zoneComposerWrap}
        >
          <View style={[styles.chatComposer, { borderColor: accentColor }]}>
            <TextInput
              placeholder="Broadcast to the Zone..."
              placeholderTextColor={`${palette.textSecondary}aa`}
              value={composer}
              onChangeText={setComposer}
              style={[styles.chatInput, { color: palette.textPrimary, fontSize: 15 * fontScale }]}
            />
            <TouchableOpacity onPress={addPost} style={[styles.sendButton, { backgroundColor: accentColor }]}>
              <Ionicons name="add" size={20 * fontScale} color="#02101a" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </NeonScreen>
  );
};

const db = SQLite.openDatabase('skrybe.db');

const SkrybeScreen = () => {
  const { palette, accentColor, fontScale } = useTheme();
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT);');
    });
    loadNotes();
  }, []);

  const loadNotes = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM notes ORDER BY id DESC;',
        [],
        (_, { rows }) => {
          const items = [];
          for (let i = 0; i < rows.length; i += 1) {
            items.push(rows.item(i));
          }
          setNotes(items);
        }
      );
    });
  };

  const addNote = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO notes (text) values (?);', [text], () => {
        setDraft('');
        loadNotes();
        if (listRef.current) {
          listRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      });
    });
  };

  const deleteNote = (id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM notes WHERE id = ?;', [id], loadNotes);
    });
  };

  return (
    <NeonScreen>
      <View style={{ flex: 1 }}>
        <NeonCard style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { color: accentColor, fontSize: 20 * fontScale }]}>Skrybe Notes</Text>
          <Text style={[styles.mutedText, { color: palette.textSecondary, fontSize: 14 * fontScale }]}>
            Capture encrypted briefs, tactics, or reflections. Stored locally with SQLite.
          </Text>
          <View style={[styles.chatComposer, { borderColor: accentColor, marginTop: 16 }]}>
            <TextInput
              placeholder="Log a neon insight..."
              placeholderTextColor={`${palette.textSecondary}aa`}
              value={draft}
              onChangeText={setDraft}
              style={[styles.chatInput, { color: palette.textPrimary, fontSize: 15 * fontScale }]}
              multiline
            />
            <TouchableOpacity onPress={addNote} style={[styles.sendButton, { backgroundColor: accentColor, height: 40 }]}>
              <Ionicons name="save" size={20 * fontScale} color="#02101a" />
            </TouchableOpacity>
          </View>
        </NeonCard>

        <FlatList
          ref={listRef}
          data={notes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 40, gap: 14 }}
          ListEmptyComponent={() => (
            <Text style={[styles.emptyState, { color: palette.textSecondary, fontSize: 14 * fontScale }]}>
              No notes stored yet. Your next insight is one tap away.
            </Text>
          )}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.delay(index * 70)}>
              <NeonCard>
                <Text style={[styles.noteText, { color: palette.textPrimary, fontSize: 15 * fontScale }]}>{item.text}</Text>
                <TouchableOpacity
                  onPress={() => deleteNote(item.id)}
                  style={[styles.deleteButton, { borderColor: accentColor }]}
                >
                  <Ionicons name="trash" size={16 * fontScale} color={accentColor} />
                </TouchableOpacity>
              </NeonCard>
            </Animated.View>
          )}
        />
      </View>
    </NeonScreen>
  );
};

const SettingsScreen = () => {
  const { themeMode, setThemeMode, fontScale, setFontScale, accentColor, setAccentColor, palette } = useTheme();

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  return (
    <NeonScreen>
      <View style={{ gap: 20 }}>
        <NeonCard>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: palette.textPrimary, fontSize: 16 * fontScale }]}>Dark Mode</Text>
            <Switch value={themeMode === 'dark'} onValueChange={toggleTheme} thumbColor={accentColor} />
          </View>
          <Text style={[styles.mutedText, { color: palette.textSecondary, fontSize: 13 * fontScale }]}>
            Instantly shift between luminescent night ops and clean daylight mode.
          </Text>
        </NeonCard>

        <NeonCard>
          <Text style={[styles.settingLabel, { color: palette.textPrimary, fontSize: 16 * fontScale }]}>Font scale</Text>
          <View style={styles.sliderRow}>
            {[0.9, 1, 1.1, 1.2].map((scale) => (
              <TouchableOpacity
                key={scale}
                onPress={() => setFontScale(scale)}
                style={[
                  styles.fontChip,
                  { borderColor: accentColor, backgroundColor: fontScale === scale ? `${accentColor}33` : 'transparent' },
                ]}
              >
                <Text style={[styles.fontChipText, { color: palette.textPrimary, fontSize: 14 * scale }]}>{`${Math.round(scale * 100)}%`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </NeonCard>

        <NeonCard>
          <Text style={[styles.settingLabel, { color: palette.textPrimary, fontSize: 16 * fontScale }]}>Accent color</Text>
          <View style={styles.swatchRow}>
            {accentOptions.map((hex) => (
              <TouchableOpacity
                key={hex}
                onPress={() => setAccentColor(hex)}
                style={[
                  styles.colorSwatch,
                  {
                    backgroundColor: hex,
                    borderColor: accentColor,
                    transform: [{ scale: accentColor === hex ? 1.08 : 1 }],
                    shadowColor: hex,
                    opacity: accentColor === hex ? 1 : 0.7,
                  },
                ]}
              />
            ))}
          </View>
        </NeonCard>
      </View>
    </NeonScreen>
  );
};

const Drawer = createDrawerNavigator();

const DrawerRoutes = () => {
  const { themeMode, palette, accentColor } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = themeMode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: palette.background,
        card: palette.surface,
        text: palette.textPrimary,
        primary: accentColor,
        border: palette.border,
      },
    };
  }, [themeMode, palette, accentColor]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          drawerType: 'front',
          drawerStyle: { backgroundColor: palette.overlay },
          drawerActiveTintColor: accentColor,
          drawerInactiveTintColor: palette.textSecondary,
          drawerLabelStyle: { fontSize: 15 },
          drawerIcon: ({ color, size }) => {
            const map = {
              Core: 'chatbubbles',
              Lyfe: 'bar-chart',
              Stryke: 'game-controller',
              Tree: 'git-branch',
              Zone: 'people',
              Skrybe: 'document-text',
              Settings: 'options',
            };
            return <Ionicons name={map[route.name] || 'ellipse'} color={color} size={size} />;
          },
          sceneContainerStyle: { backgroundColor: palette.background },
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

const VyralNavigator = () => {
  const { themeMode } = useTheme();
  return (
    <>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <DrawerRoutes />
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <VyralNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenOverlay: {
    flex: 1,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 26,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    elevation: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    elevation: 10,
  },
  button: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonIcon: {
    marginTop: 1,
  },
  buttonText: {
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  mutedText: {
    letterSpacing: 0.4,
  },
  xpText: {
    fontWeight: '700',
    marginTop: 4,
  },
  progressTrack: {
    height: 12,
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 12,
  },
  lessonTitle: {
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  lessonDescription: {
    lineHeight: 20,
  },
  lessonToggle: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  lessonToggleText: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  chatChip: {
    width: 150,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    elevation: 6,
  },
  chatChipTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  chatChipSubtitle: {
    letterSpacing: 0.4,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  messageSender: {
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.8,
  },
  messageText: {
    lineHeight: 20,
  },
  chatComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 12,
  },
  chatInput: {
    flex: 1,
    minHeight: 40,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outcomeText: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  node: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    elevation: 6,
  },
  nodeTitle: {
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  postAuthor: {
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  postText: {
    marginTop: 6,
    lineHeight: 20,
  },
  zoneComposerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  noteText: {
    lineHeight: 20,
    marginBottom: 12,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  emptyState: {
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  fontChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  fontChipText: {
    fontWeight: '600',
  },
  swatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  colorSwatch: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    elevation: 8,
  },
});
