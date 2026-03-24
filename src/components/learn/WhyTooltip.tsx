import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';
import topicsData from '../../../data/learn/topics.json';

const topics = topicsData as { slug: string; title: string; summary: string }[];

interface WhyTooltipProps {
  topic: string; // slug from learn topics
}

/**
 * Inline expandable "?" tooltip that explains a liturgical element.
 * Shows a brief summary inline; tapping "Learn more" navigates to the full article.
 */
export function WhyTooltip({ topic }: WhyTooltipProps) {
  const router = useRouter();
  const showWhyTooltips = useSettingsStore((s) => s.showWhyTooltips);
  const [expanded, setExpanded] = useState(false);

  if (!showWhyTooltips) return null;

  const topicData = topics.find((t) => t.slug === topic);
  if (!topicData) return null;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.trigger}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.triggerIcon}>?</Text>
        <Text style={styles.triggerText}>
          {expanded ? 'Hide' : 'Why this?'}
        </Text>
      </Pressable>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.summary}>{topicData.summary}</Text>
          <Pressable
            style={styles.learnMore}
            onPress={() => router.push(`/learn/${topic}`)}
          >
            <Text style={styles.learnMoreText}>Learn more →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  triggerIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent.gold + '25',
    color: colors.accent.gold,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
  triggerText: {
    fontSize: 12,
    color: colors.accent.gold,
    letterSpacing: 0.3,
  },
  expandedContent: {
    marginTop: spacing.sm,
    paddingLeft: spacing.lg,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent.gold + '30',
  },
  summary: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  learnMore: {
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 13,
    color: colors.accent.gold,
    fontWeight: '600',
  },
});
