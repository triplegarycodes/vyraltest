import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import NeonCard from '../components/NeonCard';
import { useNeonTheme } from '../context/NeonThemeContext';

const goalTree = [
  {
    id: 'root-safety',
    title: 'Build Safe Connections',
    description: 'Anchor confidence and care across every zone.',
    children: [
      {
        id: 'branch-talk',
        title: 'Talk Clarity',
        description: 'Craft statements that map consent in seconds.',
        children: [
          { id: 'leaf-checkin', title: 'Daily check-in ping', description: 'Schedule reflective messages at sundown.' },
          { id: 'leaf-handbook', title: 'Boundary handbook', description: 'Co-design response scripts for the crew.' },
        ],
      },
      {
        id: 'branch-community',
        title: 'Community Armor',
        description: 'Design pods that step in when signals feel off.',
        children: [
          { id: 'leaf-hotline', title: 'Hotline map', description: 'Publish cross-city hotline access map.' },
        ],
      },
    ],
  },
];

const TreeScreen = () => {
  const { themePalette, accentColor, fontScale } = useNeonTheme();
  const [expanded, setExpanded] = useState(new Set(['root-safety']));

  const toggleNode = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderNode = (node, depth = 0) => {
    const isExpanded = expanded.has(node.id);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;

    return (
      <Animated.View
        key={node.id}
        entering={FadeInDown.delay(depth * 60)}
        style={[styles.nodeContainer, { marginLeft: depth * 16 }]}
      >
        <Pressable onPress={() => (hasChildren ? toggleNode(node.id) : null)} style={styles.nodePressable}>
          <View style={[styles.nodeBadge, { borderColor: accentColor }]}>            
            <Ionicons name={hasChildren ? (isExpanded ? 'chevron-down' : 'chevron-forward') : 'ellipse'} size={18} color={accentColor} />
          </View>
          <View style={styles.nodeTextWrap}>
            <Text style={[styles.nodeTitle, { color: themePalette.textPrimary, fontSize: 17 * fontScale }]}>{node.title}</Text>
            <Text style={[styles.nodeDescription, { color: themePalette.textSecondary, fontSize: 12.5 * fontScale }]}>
              {node.description}
            </Text>
          </View>
        </Pressable>
        {hasChildren && isExpanded ? (
          <View style={styles.childrenWrap}>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </View>
        ) : null}
      </Animated.View>
    );
  };

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Ionicons name="git-branch" size={26} color={accentColor} style={styles.headerIcon} />
        <Text style={[styles.title, { color: themePalette.textPrimary, fontSize: 22 * fontScale }]}>Tree Goals</Text>
      </View>
      <Text style={[styles.subtitle, { color: themePalette.textSecondary, fontSize: 14 * fontScale }]}>Tap nodes to expand and track nested missions.</Text>
      <NeonCard>
        <View style={styles.treeWrap}>{goalTree.map((node) => renderNode(node))}</View>
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
    marginBottom: 18,
  },
  treeWrap: {
    marginTop: 4,
  },
  nodeContainer: {
    marginBottom: 12,
  },
  nodePressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeBadge: {
    width: 34,
    height: 34,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    marginRight: 12,
  },
  nodeTextWrap: {
    flex: 1,
  },
  nodeTitle: {
    fontWeight: '600',
  },
  nodeDescription: {
    marginTop: 4,
    lineHeight: 18,
  },
  childrenWrap: {
    marginTop: 12,
  },
});

export default TreeScreen;
