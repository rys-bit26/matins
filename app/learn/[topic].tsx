import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing, getReadingFont } from '../../src/theme';
import { useSettingsStore } from '../../src/stores/settingsStore';
import contentData from '../../data/learn/content.json';

const content = contentData as Record<string, { title: string; body: string }>;

export default function LearnTopicScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const fontStyle = useSettingsStore((s) => s.fontStyle);
  const entry = content[topic];

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>This topic is coming soon.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
          {entry.title}
        </Text>
        <View style={styles.divider} />
        {entry.body.split('\n\n').map((paragraph, i) => (
          <Text key={i} style={[styles.paragraph, { fontFamily: getReadingFont(fontStyle) }]}>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  title: {
    fontSize: 26,
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: 34,
  },
  divider: {
    height: 2,
    backgroundColor: colors.accent.gold + '30',
    marginBottom: spacing.xl,
  },
  paragraph: {
    fontSize: 18,
    color: colors.text.primary,
    lineHeight: 30,
    marginBottom: spacing.xl,
    letterSpacing: 0.1,
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
