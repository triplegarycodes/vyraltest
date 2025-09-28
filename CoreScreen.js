import React, { useMemo, useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const NeonCard = ({ children, style }) => (
  <LinearGradient
    colors={['#061128', '#0B1B3C']}
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    style={[styles.card, style]}
  >
    {children}
  </LinearGradient>
);

const ChannelTab = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [
    styles.tab,
    { borderColor: active ? '#7FFFD4' : '#7FFFD455', backgroundColor: active ? '#7FFFD422' : 'transparent', opacity: pressed ? 0.85 : 1 }
  ]}>
    <Text style={[styles.tabText, { color: active ? '#03121A' : '#A9C2FF' }]} numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

const MessageBubble = ({ m }) => {
  const isYou = m.from === 'You';
  return (
    <View style={[styles.msgWrap, { alignItems: isYou ? 'flex-end' : 'flex-start' }]}>
      <View style={[
        styles.msg,
        { borderColor: isYou ? '#7FFFD4' : '#7FFFD455', backgroundColor: isYou ? '#7FFFD422' : '#0B1B3C' }
      ]}>
        <Text style={[styles.msgMeta, { textAlign: isYou ? 'right' : 'left' }]}>
          {m.from} · {m.time}
        </Text>
        <Text style={styles.msgText}>{m.body}</Text>
      </View>
    </View>
  );
};

export default function CoreScreen() {
  // Channels
  const channels = useMemo(() => ([
    { id: 'neon-core', name: 'Neon Core', about: 'Collaborative response hub' },
    { id: 'alliance',  name: 'Synthwave Alliance', about: 'Consent guardians & mentors' },
    { id: 'pulse',     name: 'Pulse Guardians', about: 'Moderation stream' }
  ]), []);
  const [activeId, setActiveId] = useState(channels[0].id);

  // Messages by channel
  const initialMap = useMemo(() => ({
    'neon-core': [
      { id: 'm1', from: 'Nova', body: 'Welcome to Core — safe chat is live.', time: '22:12' },
      { id: 'm2', from: 'You',  body: 'Copy that. Running a small sync.', time: '22:13' },
    ],
    'alliance': [
      { id: 'm3', from: 'Echo', body: 'Boundary doc refresh tonight.', time: '20:44' },
    ],
    'pulse': [
      { id: 'm4', from: 'Ryn', body: 'New member needs orientation.', time: '19:20' },
    ],
  }), []);
  const [byChan, setByChan] = useState(initialMap);

  // Pinned, search, draft
  const [pinned, setPinned] = useState({}); // { channelId: [messageIds] }
  const [query, setQuery]   = useState('');
  const [draft, setDraft]   = useState('');

  const listRef = useRef(null);

  const activeMsgs = (byChan[activeId] || []).filter(m =>
    query.trim() ? (m.body.toLowerCase().includes(query.toLowerCase()) || m.from.toLowerCase().includes(query.toLowerCase())) : true
  );

  const nowHHMM = () => {
    const d = new Date(); const h = `${d.getHours()}`.padStart(2, '0'); const m = `${d.getMinutes()}`.padStart(2, '0');
    return `${h}:${m}`;
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const newMsg = { id: `${activeId}-${Date.now()}`, from: 'You', body: text, time: nowHHMM() };
    setByChan(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), newMsg] }));
    setDraft('');

    // Auto “Neo/Nova” acknowledgement after a short delay (stubbed moderation hook)
    setTimeout(() => {
      setByChan(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), {
          id: `${activeId}-${Date.now()}-neo`,
          from: 'Nova',
          body: 'Signal received. Logged with soft-safety filters.',
          time: nowHHMM()
        }]
      }));
      listRef.current?.scrollToEnd?.({ animated: true });
    }, 500);

    // Scroll down
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
  };

  const togglePin = (messageId) => {
    setPinned(prev => {
      const arr = new Set(prev[activeId] || []);
      arr.has(messageId) ? arr.delete(messageId) : arr.add(messageId);
      return { ...prev, [activeId]: Array.from(arr) };
    });
  };

  // Simple “attachment” stub (extensible later)
  const attach = () => {
    const newMsg = { id: `${activeId}-att-${Date.now()}`, from: 'You', body: '[attachment: link]', time: nowHHMM() };
    setByChan(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), newMsg] }));
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 30);
  };

  const renderItem = ({ item }) => (
    <Pressable onLongPress={() => togglePin(item.id)} delayLongPress={220}>
      <MessageBubble m={item} />
      { (pinned[activeId] || []).includes(item.id) && (
        <Text style={styles.pinnedTag}>Pinned</Text>
      )}
    </Pressable>
  );

  return (
    <LinearGradient colors={['#02040C', '#050A1F', '#0A193A']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Core</Text>
        <Text style={styles.sub}>Collaborative chat streams with neon-quiet lanes.</Text>

        {/* Channel strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
          {channels.map(ch => (
            <ChannelTab
              key={ch.id}
              label={ch.name}
              active={activeId === ch.id}
              onPress={() => setActiveId(ch.id)}
            />
          ))}
        </ScrollView>

        {/* About + Search */}
        <NeonCard>
          <Text style={styles.aboutTitle}>{channels.find(c => c.id === activeId)?.name}</Text>
          <Text style={styles.aboutText}>{channels.find(c => c.id === activeId)?.about}</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search messages or authors…"
            placeholderTextColor="#A9C2FF99"
            style={styles.search}
          />
        </NeonCard>

        {/* Messages */}
        <NeonCard style={{ padding: 0 }}>
          <FlatList
            ref={listRef}
            data={activeMsgs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, gap: 8 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: true })}
          />
        </NeonCard>

        {/* Composer */}
        <NeonCard>
          <View style={styles.row}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Transmit a luminous update…"
              placeholderTextColor="#A9C2FF99"
              style={styles.input}
              multiline
            />
          </View>
          <View style={styles.actions}>
            <Pressable onPress={attach} style={({ pressed }) => [styles.btnGhost, { opacity: pressed ? 0.85 : 1 }]}>
              <Text style={styles.btnGhostText}>Attach</Text>
            </Pressable>
            <Pressable onPress={send} style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.9 : 1 }]}>
              <Text style={styles.btnText}>Send</Text>
            </Pressable>
          </View>
        </NeonCard>

        {/* Pinned drawer */}
        <NeonCard>
          <Text style={styles.pinnedTitle}>Pinned in {channels.find(c => c.id === activeId)?.name}</Text>
          {(pinned[activeId] || []).length === 0 ? (
            <Text style={styles.pinnedEmpty}>Long-press a message to pin it here.</Text>
          ) : (
            (byChan[activeId] || [])
              .filter(m => (pinned[activeId] || []).includes(m.id))
              .map(m => <Text key={`pin-${m.id}`} style={styles.pinRow}>• {m.body}</Text>)
          )}
        </NeonCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 24, fontWeight: '800', color: '#F5FAFF', letterSpacing: 0.6 },
  sub:{ fontSize: 13, color:'#A9C2FF', marginTop: 6 },
  card:{ borderRadius:16, padding:16, marginBottom:16, borderWidth:1, borderColor:'#7FFFD4' },
  tab:{ paddingVertical:10, paddingHorizontal:14, borderRadius:16, borderWidth:1, marginRight:10 },
  tabText:{ fontWeight:'700', letterSpacing:0.5 },
  aboutTitle:{ color:'#F5FAFF', fontSize:16, fontWeight:'700', marginBottom:4 },
  aboutText:{ color:'#A9C2FF', fontSize:13, marginBottom:12 },
  search:{ borderWidth:1, borderColor:'#7FFFD4', borderRadius:10, padding:10, color:'#F5FAFF' },
  msgWrap:{ width:'100%' },
  msg:{ maxWidth:'86%', padding:12, borderRadius:14, borderWidth:1 },
  msgMeta:{ color:'#A9C2FF', fontSize:11, marginBottom:6 },
  msgText:{ color:'#E4F5FF', fontSize:15, lineHeight:20 },
  row:{ flexDirection:'row', alignItems:'center', gap:10 },
  input:{ flex:1, minHeight:44, color:'#F5FAFF', borderWidth:1, borderColor:'#7FFFD4', borderRadius:10, padding:10 },
  actions:{ flexDirection:'row', justifyContent:'space-between', marginTop:12 },
  btn:{ backgroundColor:'#7FFFD4', paddingVertical:10, paddingHorizontal:16, borderRadius:12 },
  btnText:{ color:'#03121A', fontWeight:'800' },
  btnGhost:{ paddingVertical:10, paddingHorizontal:14, borderRadius:12, borderWidth:1, borderColor:'#7FFFD455' },
  btnGhostText:{ color:'#A9C2FF', fontWeight:'700' },
  pinnedTag:{ color:'#7FFFD4', fontSize:10, marginTop:4, opacity:0.9 },
  pinnedTitle:{ color:'#F5FAFF', fontWeight:'700', marginBottom:8 },
  pinnedEmpty:{ color:'#A9C2FF' },
  pinRow:{ color:'#CDE7FF', marginTop:4 }
});

