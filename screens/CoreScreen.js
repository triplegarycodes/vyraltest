import React, { useMemo, useState } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';

const CoreScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const [composer, setComposer] = useState('');
  const [messages, setMessages] = useState(() => initialMessages);

  const latestId = useMemo(() => messages[messages.length - 1]?.id ?? 0, [messages]);

  const handleSend = () => {
    if (!composer.trim()) return;
    const nextMessage = {
      id: latestId + 1,
      author: 'You',
      text: composer.trim(),
      alignment: 'right',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, nextMessage]);
    setComposer('');
  };

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="chatbubble-ellipses" size={26} color={accentColor} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Core Channel</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>
        Keep the crew aligned with encrypted neon threads.
      </Text>
      <View style={styles.messagesWrap}>
        {messages.map((message) => (
          <Animated.View
            key={message.id}
            entering={FadeInUp.delay(message.id * 20)}
            style={[styles.messageRow, message.alignment === 'right' ? styles.alignRight : styles.alignLeft]}
          >
            <NeonCard style={[styles.messageCard, message.alignment === 'right' ? styles.rightCard : styles.leftCard]}>
              <Text
                style={[
                  styles.messageAuthor,
                  {
                    color: themePalette.textSecondary,
                    textAlign: message.alignment === 'right' ? 'right' : 'left',
                    fontSize: 12 * fontScale,
                  },
                ]}
              >
                {message.author}
              </Text>
              <Text
                style={[
                  styles.messageText,
                  {
                    color: themePalette.textPrimary,
                    textAlign: message.alignment === 'right' ? 'right' : 'left',
                    fontSize: 16 * fontScale,
                  },
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.messageTimestamp,
                  {
                    color: themePalette.textSecondary,
                    textAlign: message.alignment === 'right' ? 'right' : 'left',
                    fontSize: 10 * fontScale,
                  },
                ]}
              >
                {message.timestamp}
              </Text>
            </NeonCard>
          </Animated.View>
        ))}
      </View>
      <NeonCard style={styles.composerCard}>
        <View style={styles.composerRow}>
          <Ionicons name="create" color={accentColor} size={20} style={styles.composerIcon} />
          <TextInput
            value={composer}
            onChangeText={setComposer}
            placeholder="Type a secured ping..."
            placeholderTextColor={themePalette.textSecondary}
            style={[styles.input, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}
          />
          <NeonButton
            label="Send"
            onPress={handleSend}
            icon={<Ionicons name="arrow-up" size={18} color={themePalette.textPrimary} />}
            style={styles.sendButton}
          />
        </View>
      </NeonCard>
    </ScreenShell>
  );
};

const initialMessages = [
  {
    id: 1,
    author: 'Nova',
    text: 'Pulse check complete. Core links stable across cities.',
    alignment: 'left',
    timestamp: '20:17',
  },
  {
    id: 2,
    author: 'Cipher',
    text: 'Deploying the empathy pack to safe texting mentors.',
    alignment: 'left',
    timestamp: '20:18',
  },
  {
    id: 3,
    author: 'You',
    text: 'Syncing the new crew to the trust protocol. Give me 2 minutes.',
    alignment: 'right',
    timestamp: '20:19',
  },
];

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
  messagesWrap: {
    marginTop: 12,
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
  messageCard: {
    width: '78%',
    marginBottom: 0,
  },
  rightCard: {
    alignSelf: 'flex-end',
  },
  leftCard: {
    alignSelf: 'flex-start',
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
  composerCard: {
    marginTop: 8,
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
});

export default CoreScreen;
