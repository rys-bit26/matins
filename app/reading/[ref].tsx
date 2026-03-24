import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, typeStyles, spacing, getReadingFont } from '../../src/theme';
import { useBiblePassage } from '../../src/hooks/useBiblePassage';
import { useSettingsStore, BibleTranslation } from '../../src/stores/settingsStore';
import { parseReference, formatReference } from '../../src/lib/bible';
import { useTypeStyles } from '../../src/hooks/useTypeStyles';

const TRANSLATION_LABELS: Record<BibleTranslation, string> = {
  bsb: 'BSB',
  web: 'WEB',
  kjv: 'KJV',
};

export default function ReadingScreen() {
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const decodedRef = decodeURIComponent(ref);
  const { translation, setTranslation, fontStyle } = useSettingsStore();
  const ts = useTypeStyles();
  const readingFont = getReadingFont(fontStyle);
  const parsedRef = parseReference(decodedRef);
  const displayRef = parsedRef ? formatReference(parsedRef) : decodedRef;

  const { data: passage, isLoading, error } = useBiblePassage(decodedRef, translation);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={[styles.reference, ts.sectionHeading]}>{displayRef}</Text>

      {/* Translation picker */}
      <View style={styles.translationRow}>
        {(['bsb', 'web', 'kjv'] as BibleTranslation[]).map((t) => (
          <Pressable
            key={t}
            style={[
              styles.translationChip,
              translation === t && styles.translationChipActive,
            ]}
            onPress={() => setTranslation(t)}
          >
            <Text
              style={[
                styles.translationChipText,
                translation === t && styles.translationChipTextActive,
              ]}
            >
              {TRANSLATION_LABELS[t]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accent.gold} size="small" />
          <Text style={styles.loadingText}>Loading scripture...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Unable to load this passage. Check your connection and try again.
          </Text>
        </View>
      )}

      {passage && passage.verses.length > 0 && (
        <View style={styles.passageContainer}>
          {passage.verses.map((verse, i) => (
            <Text key={`${verse.chapter}-${verse.verse}`} style={[styles.verseText, { fontFamily: readingFont }]}>
              <Text style={styles.verseNumber}>{verse.verse} </Text>
              {verse.text}{' '}
            </Text>
          ))}
        </View>
      )}

      {passage && passage.verses.length === 0 && !isLoading && (
        <Text style={styles.emptyText}>
          No text available for this reference in {TRANSLATION_LABELS[translation]}.
        </Text>
      )}
    </ScrollView>
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
  reference: {
    ...typeStyles.sectionHeading,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  translationRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  translationChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background.secondary,
  },
  translationChipActive: {
    borderColor: colors.accent.gold,
    backgroundColor: colors.accent.gold + '20',
  },
  translationChipText: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  translationChipTextActive: {
    color: colors.accent.gold,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    ...typeStyles.body,
    color: colors.text.secondary,
  },
  errorContainer: {
    paddingVertical: spacing.xxl,
  },
  errorText: {
    ...typeStyles.body,
    color: colors.error,
  },
  passageContainer: {
    paddingTop: spacing.sm,
  },
  verseText: {
    // fontFamily applied dynamically via getReadingFont
    fontSize: 20,
    lineHeight: 32,
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  verseNumber: {
    fontSize: 13,
    color: colors.text.tertiary,
    lineHeight: 32,
  },
  emptyText: {
    ...typeStyles.body,
    color: colors.text.secondary,
    paddingVertical: spacing.xxl,
    textAlign: 'center',
  },
});
