import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// NeonCard wrapper
const NeonCard = ({ children, style }) => (
  <LinearGradient
    colors={['#061128', '#0B1B3C']}
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    style={[styles.card, style]}
  >
    {children}
  </LinearGradient>
);

const sampleLessons = [
  { id: 'lesson-1', title: 'Budget Basics', desc: 'Track spending & save effectively', xp: 20 },
  { id: 'lesson-2', title: 'Time Mastery', desc: 'Block time & prioritize tasks', xp: 15 },
  { id: 'lesson-3', title: 'Healthy Fuel', desc: 'Nutrition & sleep alignment', xp: 25 },
];

export default function LyfeScreen() {
  const [goals, setGoals] = useState([
    { id: 'g1', title: 'Run 5k under 20m', kind: 'personal', progress: 60 },
    { id: 'g2', title: 'Save $500', kind: 'financial', progress: 30 },
  ]);
  const [lessons, setLessons] = useState(sampleLessons);
  const [completed, setCompleted] = useState([]);
  const totalXP = completed.reduce((sum, id) => sum + (lessons.find(l => l.id === id)?.xp || 0), 0);

  const toggleGoal = (id, delta) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: Math.max(0, Math.min(100, g.progress + delta)) } : g));
  };

  const completeLesson = (id) => {
    if (!completed.includes(id)) setCompleted([...completed, id]);
  };

  return (
    <LinearGradient colors={['#02040C', '#050A1F', '#0A193A']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.h1}>Lyfe</Text>
        <Text style={styles.sub}>Track goals & earn XP through life lessons.</Text>

        {/* Goals Section */}
        <Text style={styles.section}>Goals</Text>
        {goals.map(g => (
          <NeonCard key={g.id}>
            <Text style={styles.goalTitle}>{g.title} ({g.kind})</Text>
            <Text style={styles.goalProg}>{g.progress}% complete</Text>
            <View style={styles.row}>
              <Pressable onPress={() => toggleGoal(g.id, -10)} style={styles.btnGhost}>
                <Text style={styles.btnGhostText}>-10%</Text>
              </Pressable>
              <Pressable onPress={() => toggleGoal(g.id, +10)} style={styles.btn}>
                <Text style={styles.btnText}>+10%</Text>
              </Pressable>
            </View>
          </NeonCard>
        ))}

        {/* Lessons Section */}
        <Text style={styles.section}>Lessons</Text>
        {lessons.map(l => {
          const done = completed.includes(l.id);
          return (
            <NeonCard key={l.id}>
              <Text style={styles.lessonTitle}>{l.title}</Text>
              <Text style={styles.lessonDesc}>{l.desc}</Text>
              <Text style={styles.lessonXP}>{l.xp} XP</Text>
              <Pressable
                disabled={done}
                onPress={() => completeLesson(l.id)}
                style={done ? styles.btnGhost : styles.btn}
              >
                <Text style={done ? styles.btnGhostText : styles.btnText}>
                  {done ? 'Completed' : 'Mark Complete'}
                </Text>
              </Pressable>
            </NeonCard>
          );
        })}

        {/* Progress Summary */}
        <NeonCard>
          <Text style={styles.summaryTitle}>Total XP</Text>
          <Text style={styles.summaryText}>{totalXP} XP earned</Text>
        </NeonCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 24, fontWeight: '800', color: '#F5FAFF', letterSpacing: 0.6 },
  sub:{ fontSize: 13, color:'#A9C2FF', marginTop: 6 },
  section:{ fontSize:18, fontWeight:'700', color:'#7FFFD4', marginTop:20, marginBottom:10 },
  card:{ borderRadius:16, padding:16, marginBottom:16, borderWidth:1, borderColor:'#7FFFD4' },
  row:{ flexDirection:'row', justifyContent:'space-between', marginTop:12 },
  goalTitle:{ color:'#F5FAFF', fontSize:16, fontWeight:'700' },
  goalProg:{ color:'#A9C2FF', marginTop:4 },
  btn:{ backgroundColor:'#7FFFD4', paddingVertical:8, paddingHorizontal:14, borderRadius:12 },
  btnText:{ color:'#03121A', fontWeight:'800' },
  btnGhost:{ paddingVertical:8, paddingHorizontal:14, borderRadius:12, borderWidth:1, borderColor:'#7FFFD455' },
  btnGhostText:{ color:'#A9C2FF', fontWeight:'700' },
  lessonTitle:{ color:'#F5FAFF', fontSize:16, fontWeight:'700' },
  lessonDesc:{ color:'#CDE7FF', marginVertical:6 },
  lessonXP:{ color:'#7FFFD4', marginBottom:10 },
  summaryTitle:{ color:'#F5FAFF', fontSize:16, fontWeight:'700', marginBottom:6 },
  summaryText:{ color:'#A9C2FF' },
});
