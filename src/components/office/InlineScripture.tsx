import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../theme';
import { useBiblePassage } from '../../hooks/useBiblePassage';
import { useSettingsStore } from '../../stores/settingsStore';

interface InlineScriptureProps {
  reference: string;
  readingFont: string;
}

/**
 * Fetches and displays scripture text inline within the office view.
 */
export function InlineScripture({ reference, readingFont }: InlineScriptureProps) {
  const translation = useSettingsStore((s) => s.translation);
  const { data: passage, isLoading, error } = useBiblePassage(reference, translation);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent.gold} size="small" />
        <Text style={styles.loadingText}>Loading {reference}...</Text>
      </View>
    );
  }

  if (error || !passage || passage.verses.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.referenceText, { fontFamily: readingFont }]}>
          {reference}
        </Text>
        <Text style={styles.errorText}>
          Unable to load — check your connection
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {passage.verses.map((verse) => (
        <Text
          key={`${verse.chapter}-${verse.verse}`}
          style={[styles.verseText, { fontFamily: readingFont }]}
        >
          <Text style={styles.verseNumber}>{verse.verse} </Text>
          {verse.text}{' '}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  errorContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.error + '60',
  },
  referenceText: {
    fontSize: 17,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  verseText: {
    fontSize: 19,
    color: colors.text.primary,
    lineHeight: 30,
    letterSpacing: 0.15,
  },
  verseNumber: {
    fontSize: 12,
    color: colors.text.tertiary,
    lineHeight: 30,
  },
});
