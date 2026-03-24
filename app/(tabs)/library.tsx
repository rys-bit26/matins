import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing, getReadingFont } from '../../src/theme';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useLiturgicalDay } from '../../src/hooks/useLiturgicalDay';
import { selectDevotional, getAuthors, getByAuthor } from '../../src/lib/devotionals';

export default function LibraryScreen() {
  const router = useRouter();
  const fontStyle = useSettingsStore((s) => s.fontStyle);
  const litDay = useLiturgicalDay();

  const todaysReading = selectDevotional(new Date(), litDay.season);
  const authors = getAuthors();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
          The Library
        </Text>

        {/* Today's Featured */}
        <Text style={styles.sectionLabel}>TODAY'S READING</Text>
        <Pressable
          style={styles.featuredCard}
          onPress={() => router.push(`/devotional/${todaysReading.slug}`)}
        >
          <Text style={styles.featuredQuote}>✦</Text>
          <Text style={[styles.featuredTitle, { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined }]}>
            {todaysReading.title}
          </Text>
          <Text style={styles.featuredAuthor}>
            {todaysReading.author}
          </Text>
          <Text style={styles.featuredSource}>
            {todaysReading.source}, c. {todaysReading.circa}
          </Text>
        </Pressable>

        {/* By Author */}
        {authors.map((author) => {
          const works = getByAuthor(author);
          return (
            <View key={author} style={styles.authorSection}>
              <Text style={styles.sectionLabel}>{author.toUpperCase()}</Text>
              {works.map((work) => (
                <Pressable
                  key={work.slug}
                  style={styles.workCard}
                  onPress={() => router.push(`/devotional/${work.slug}`)}
                >
                  <Text style={[styles.workTitle, { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined }]}>
                    {work.title}
                  </Text>
                  <Text style={styles.workSource}>{work.source}, c. {work.circa}</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xxxl,
  },
  title: {
    fontSize: 28,
    color: colors.text.primary,
    paddingTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typeStyles.label,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  featuredCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.accent.gold + '40',
  },
  featuredQuote: {
    fontSize: 24,
    color: colors.accent.gold,
    marginBottom: spacing.md,
  },
  featuredTitle: {
    fontSize: 22,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  featuredAuthor: {
    ...typeStyles.body,
    color: colors.accent.gold,
    marginBottom: spacing.xs,
  },
  featuredSource: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  authorSection: {
    marginTop: spacing.md,
  },
  workCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workTitle: {
    fontSize: 17,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  workSource: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
});
