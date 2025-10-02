import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const NeonCard = ({ children, style }) => (
  <LinearGradient
    colors={['#061128', '#0B1B3C']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.card, style]}
  >
    {children}
  </LinearGradient>
);

const NeonNotice = ({ children }) => (
  <LinearGradient
    colors={['#240542', '#3C0A62']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.notice}
  >
    <Ionicons name="cloud-offline" size={22} color="#FF7BDA" style={styles.noticeIcon} />
    <Text style={styles.noticeText}>{children}</Text>
  </LinearGradient>
);

const SkrybeScreen = ({ openNotesDb = async () => null }) => {
  const dbRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('checking'); // 'checking' | 'ready' | 'unavailable'

  const runTransaction = useCallback((callback) => {
    const dbInstance = dbRef.current;
    if (!dbInstance) {
      setStatus('unavailable');
      setNotes([]);
      return false;
    }

    try {
      dbInstance.transaction((tx) => {
        callback(tx);
      });
      return true;
    } catch (error) {
      console.warn('[Skrybe] Failed to run transaction', error);
      setStatus('unavailable');
      setNotes([]);
      return false;
    }
  }, []);

  const syncNotes = useCallback(() => {
    runTransaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)',
        [],
      );
      tx.executeSql(
        'SELECT id, text FROM notes ORDER BY id DESC',
        [],
        (_, result) => {
          setNotes(result?.rows?._array ?? []);
        },
      );
    });
  }, [runTransaction]);

  useEffect(() => {
    let mounted = true;

    const initDb = async () => {
      try {
        const database = await openNotesDb();
        if (!mounted) {
          return;
        }

        if (database) {
          dbRef.current = database;
          setStatus('ready');
          syncNotes();
        } else {
          setStatus('unavailable');
          setNotes([]);
        }
      } catch (error) {
        if (mounted) {
          console.warn('[Skrybe] Unable to open notes database', error);
          setStatus('unavailable');
          setNotes([]);
        }
      }
    };

    initDb();

    return () => {
      mounted = false;
    };
  }, [openNotesDb, syncNotes]);

  const handleArchiveNote = useCallback(() => {
    const value = draft.trim();
    if (!value) {
      return;
    }

    const executed = runTransaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)',
        [],
      );
      tx.executeSql(
        'INSERT INTO notes (text) VALUES (?)',
        [value],
        () => {
          tx.executeSql(
            'SELECT id, text FROM notes ORDER BY id DESC',
            [],
            (_, result) => {
              setNotes(result?.rows?._array ?? []);
            },
          );
        },
      );
    });

    if (executed) {
      setDraft('');
    }
  }, [draft, runTransaction]);

  const handleDeleteNote = useCallback((noteId) => {
    runTransaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)',
        [],
      );
      tx.executeSql(
        'DELETE FROM notes WHERE id = ?',
        [noteId],
        () => {
          tx.executeSql(
            'SELECT id, text FROM notes ORDER BY id DESC',
            [],
            (_, result) => {
              setNotes(result?.rows?._array ?? []);
            },
          );
        },
      );
    });
  }, [runTransaction]);

  const isUnavailable = status === 'unavailable';
  const isChecking = status === 'checking';

  return (
    <LinearGradient colors={['#02040C', '#050A1F', '#0A193A']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Skrybe</Text>
        <Text style={styles.subheading}>
          {isUnavailable
            ? 'Neon notes persist only on native devices for now.'
            : 'Archive neon insights that stay synced on your device.'}
        </Text>

        {isUnavailable ? (
          <NeonNotice>
            Neon persistence is available on iOS and Android builds. On the web, notes stay ephemeral.
          </NeonNotice>
        ) : null}

        {isChecking ? (
          <Text style={styles.loading}>Checking for your local neon vault…</Text>
        ) : null}

        <NeonCard>
          <Text style={styles.sectionTitle}>Compose</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Encode a luminous insight"
            placeholderTextColor="#A9C2FF88"
            style={styles.input}
            multiline
          />
          <Pressable
            disabled={isUnavailable}
            onPress={handleArchiveNote}
            style={({ pressed }) => [
              styles.actionButton,
              isUnavailable ? styles.actionButtonDisabled : null,
              { opacity: pressed && !isUnavailable ? 0.85 : 1 },
            ]}
          >
            <Text style={isUnavailable ? styles.actionButtonDisabledText : styles.actionButtonText}>
              {isUnavailable ? 'Native Only' : 'Archive'}
            </Text>
          </Pressable>
        </NeonCard>

        <View style={styles.notesSection}>
          {notes.map((note) => (
            <NeonCard key={note.id} style={styles.noteCard}>
              <Text style={styles.noteText}>{note.text}</Text>
              <Pressable
                onPress={() => handleDeleteNote(note.id)}
                style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons name="trash" size={18} color="#6DF7FF" />
              </Pressable>
            </NeonCard>
          ))}
          {!isChecking && notes.length === 0 && !isUnavailable ? (
            <Text style={styles.emptyState}>No notes yet—archive your first insight above.</Text>
          ) : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F5FAFF',
    letterSpacing: 0.6,
  },
  subheading: {
    fontSize: 13,
    color: '#A9C2FF',
    marginTop: 6,
  },
  loading: {
    marginTop: 12,
    color: '#7FFFD4',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#7FFFD4',
  },
  sectionTitle: {
    color: '#F5FAFF',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    minHeight: 80,
    color: '#F5FAFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#7FFFD4',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#03121A',
    fontWeight: '800',
    fontSize: 15,
  },
  actionButtonDisabled: {
    backgroundColor: 'rgba(127, 255, 212, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(127, 255, 212, 0.4)',
  },
  actionButtonDisabledText: {
    color: '#7FFFD4',
    fontWeight: '700',
    fontSize: 15,
  },
  notesSection: {
    marginTop: 12,
    gap: 14,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  noteText: {
    flex: 1,
    color: '#EAFBFF',
    fontSize: 15,
    lineHeight: 22,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(109, 247, 255, 0.4)',
  },
  emptyState: {
    color: '#A9C2FF',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
  notice: {
    marginTop: 18,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 123, 218, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeIcon: {
    marginRight: 12,
  },
  noticeText: {
    flex: 1,
    color: '#FEE7FF',
    fontSize: 13,
    lineHeight: 20,
  },
});

export default SkrybeScreen;
