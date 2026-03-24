import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing, getReadingFont } from '../../src/theme';
import { useSettingsStore } from '../../src/stores/settingsStore';
import topicsData from '../../data/learn/topics.json';

const topics = topicsData as { slug: string; title: string; category: string; summary: string }[];

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'seasons', label: 'Liturgical Seasons' },
  { id: 'prayer', label: 'Elements of Prayer' },
];

export default function LearnIndexScreen() {
  const router = useRouter();
  const fontStyle = useSettingsStore((s) => s.fontStyle);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
          Understanding the Tradition
        </Text>
        <Text style={styles.subtitle}>
          New to liturgical prayer? These guides explain the what and why behind each element of the Daily Office.
        </Text>

        {CATEGORIES.map((cat) => {
          const catTopics = topics.filter((t) => t.category === cat.id);
          if (catTopics.length === 0) return null;
          return (
            <View key={cat.id} style={styles.categorySection}>
              <Text style={styles.categoryLabel}>{cat.label.toUpperCase()}</Text>
              {catTopics.map((topic) => (
                <Pressable
                  key={topic.slug}
                  style={styles.topicCard}
                  onPress={() => router.push(`/learn/${topic.slug}`)}
                >
                  <Text style={[styles.topicTitle, { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined }]}>
                    {topic.title}
                  </Text>
                  <Text style={styles.topicSummary}>{topic.summary}</Text>
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  title: {
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typeStyles.body,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  categorySection: {
    marginBottom: spacing.xxl,
  },
  categoryLabel: {
    ...typeStyles.label,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  topicCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topicTitle: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  topicSummary: {
    ...typeStyles.bodySmall,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
