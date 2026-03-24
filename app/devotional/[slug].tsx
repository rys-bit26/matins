import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing, getReadingFont } from '../../src/theme';
import { useSettingsStore } from '../../src/stores/settingsStore';
import indexData from '../../data/devotionals/index.json';
import contentData from '../../data/devotionals/content.json';

const index = indexData as { slug: string; title: string; author: string; source: string; circa: string }[];
const content = contentData as Record<string, { text: string }>;

export default function DevotionalScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const fontStyle = useSettingsStore((s) => s.fontStyle);
  const readingFont = getReadingFont(fontStyle);

  const meta = index.find((d) => d.slug === slug);
  const entry = content[slug];

  if (!meta || !entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>This devotional is coming soon.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.symbol}>✦</Text>
        <Text style={[styles.title, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
          {meta.title}
        </Text>
        <Text style={styles.author}>{meta.author}</Text>
        <Text style={styles.source}>{meta.source}, c. {meta.circa}</Text>

        <View style={styles.divider} />

        {/* Content */}
        {entry.text.split('\n\n').map((paragraph, i) => (
          <Text key={i} style={[styles.paragraph, { fontFamily: readingFont }]}>
            {paragraph}
          </Text>
        ))}
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  symbol: {
    fontSize: 28,
    color: colors.accent.gold,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 36,
  },
  author: {
    ...typeStyles.body,
    color: colors.accent.gold,
    marginBottom: spacing.xs,
  },
  source: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  divider: {
    height: 2,
    backgroundColor: colors.accent.gold + '25',
    marginVertical: spacing.xl,
  },
  paragraph: {
    fontSize: 19,
    color: colors.text.primary,
    lineHeight: 31,
    marginBottom: spacing.xl,
    letterSpacing: 0.15,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyText: {
    ...typeStyles.body,
    color: colors.text.secondary,
  },
});
