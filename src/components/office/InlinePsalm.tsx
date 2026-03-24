import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../theme';
import { useBiblePassage } from '../../hooks/useBiblePassage';
import { useSettingsStore } from '../../stores/settingsStore';

interface InlinePsalmProps {
  psalmRef: string; // e.g., "Ps 120" or "Ps 119:1-24"
  readingFont: string;
}

/**
 * Fetches and displays psalm text inline within the office view.
 */
export function InlinePsalm({ psalmRef, readingFont }: InlinePsalmProps) {
  const translation = useSettingsStore((s) => s.translation);
  // Normalize: "Ps 120" -> bible-api format
  const normalizedRef = psalmRef.startsWith('Ps ') ? `Psalm ${psalmRef.slice(3)}` : psalmRef;
  const { data: passage, isLoading, error } = useBiblePassage(normalizedRef, translation);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent.gold} size="small" />
      </View>
    );
  }

  if (error || !passage || passage.verses.length === 0) {
    return null; // Silently fail for psalms — still show the reference
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
    marginTop: spacing.sm,
  },
  loadingContainer: {
    paddingVertical: spacing.sm,
    alignItems: 'flex-start',
  },
  verseText: {
    fontSize: 18,
    color: colors.text.primary,
    lineHeight: 28,
    letterSpacing: 0.1,
  },
  verseNumber: {
    fontSize: 11,
    color: colors.text.tertiary,
    lineHeight: 28,
  },
});
