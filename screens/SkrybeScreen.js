import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import { useNeonTheme } from '../context/NeonThemeContext';
import { deleteNote, fetchNotes, initNotesTable, insertNote } from '../lib/skrybeDb';

const skrybeApiKey = process.env.EXPO_PUBLIC_SKRYBE_API_KEY || '';

const SkrybeScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      const rows = await fetchNotes();
      setNotes(rows);
    } catch (error) {
      console.warn('Failed to fetch notes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initNotesTable().then(loadNotes).catch((error) => console.warn('Init error', error));
  }, []);

  const handleAdd = async () => {
    if (!draft.trim()) return;
    try {
      setNotes(await insertNote(draft.trim()));
      setDraft('');
    } catch (error) {
      Alert.alert('Save failed', 'Could not save note.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setNotes(await deleteNote(id));
    } catch (error) {
      Alert.alert('Delete failed', 'Could not delete note.');
    }
  };

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="document-text" size={26} color={accentColor} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Skrybe Notes</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Encrypted reflections persist across sessions.</Text>
      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>Create a note</Text>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Capture the insight..."
          placeholderTextColor={themePalette.textSecondary}
          multiline
          style={[styles.input, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}
        />
        <NeonButton
          label="Add to vault"
          onPress={handleAdd}
          icon={<Ionicons name="add-circle" size={20} color={themePalette.textPrimary} />}
          active
        />
      </NeonCard>
      <NeonCard>
        <Text style={[styles.cardTitle, { color: themePalette.textPrimary, fontSize: 16 * fontScale }]}>API status</Text>
        <Text style={[styles.cardDescription, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>Key {skrybeApiKey ? 'linked' : 'not set'} (configure EXPO_PUBLIC_SKRYBE_API_KEY).</Text>
      </NeonCard>
      {loading ? (
        <Text style={{ color: themePalette.textSecondary, fontSize: 14 * fontScale }}>Loading notes...</Text>
      ) : notes.length === 0 ? (
        <Text style={{ color: themePalette.textSecondary, fontSize: 14 * fontScale }}>No notes yet. Start your archive.</Text>
      ) : (
        notes.map((note) => (
          <Animated.View key={note.id} entering={FadeInDown.duration(220)}>
            <NeonCard accent={accentColor}>
              <Text style={[styles.noteText, { color: themePalette.textPrimary, fontSize: 15 * fontScale }]}>{note.text}</Text>
              <View style={styles.noteActions}>
                <NeonButton
                  label="Delete"
                  onPress={() => handleDelete(note.id)}
                  icon={<Ionicons name="trash" size={18} color={themePalette.textPrimary} />}
                />
              </View>
            </NeonCard>
          </Animated.View>
        ))
      )}
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
  cardTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  cardDescription: {
    lineHeight: 18,
    marginTop: 6,
  },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  noteText: {
    lineHeight: 22,
  },
  noteActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default SkrybeScreen;
