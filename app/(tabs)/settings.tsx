import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing } from '../../src/theme';
import { useSettingsStore, BibleTranslation, FontStyle } from '../../src/stores/settingsStore';

const FONT_OPTIONS: { id: FontStyle; name: string; description: string; preview: string }[] = [
  { id: 'serif', name: 'Serif', description: 'Cormorant — traditional, liturgical feel', preview: 'Cormorant_400Regular' },
  { id: 'sans-serif', name: 'Sans-serif', description: 'System font — clean, modern readability', preview: 'System' },
];

const TRANSLATIONS: { id: BibleTranslation; name: string; description: string }[] = [
  { id: 'bsb', name: 'BSB', description: 'Berean Standard Bible — modern, clear, public domain' },
  { id: 'web', name: 'WEB', description: 'World English Bible — updated ASV, public domain' },
  { id: 'kjv', name: 'KJV', description: 'King James Version — traditional, public domain' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { translation, setTranslation, fontStyle, setFontStyle, showRubrics, setShowRubrics, showWhyTooltips, setShowWhyTooltips, sacredSpaceSetupComplete } =
    useSettingsStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Bible Translation */}
        <Text style={styles.sectionTitle}>BIBLE TRANSLATION</Text>
        {TRANSLATIONS.map((t) => (
          <Pressable
            key={t.id}
            style={[
              styles.optionRow,
              translation === t.id && styles.optionRowSelected,
            ]}
            onPress={() => setTranslation(t.id)}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionName}>{t.name}</Text>
              <Text style={styles.optionDescription}>{t.description}</Text>
            </View>
            {translation === t.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </Pressable>
        ))}

        {/* Reading Font */}
        <Text style={styles.sectionTitle}>READING FONT</Text>
        {FONT_OPTIONS.map((f) => (
          <Pressable
            key={f.id}
            style={[
              styles.optionRow,
              fontStyle === f.id && styles.optionRowSelected,
            ]}
            onPress={() => setFontStyle(f.id)}
          >
            <View style={styles.optionContent}>
              <Text style={[styles.optionName, { fontFamily: f.preview }]}>{f.name}</Text>
              <Text style={styles.optionDescription}>{f.description}</Text>
              <Text style={[styles.fontPreview, { fontFamily: f.preview }]}>
                The Lord is my shepherd; I shall not want.
              </Text>
            </View>
            {fontStyle === f.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </Pressable>
        ))}

        {/* Display */}
        <Text style={styles.sectionTitle}>DISPLAY</Text>
        <Pressable
          style={styles.toggleRow}
          onPress={() => setShowRubrics(!showRubrics)}
        >
          <Text style={styles.toggleLabel}>Show rubrics</Text>
          <Text style={styles.toggleValue}>
            {showRubrics ? 'On' : 'Off'}
          </Text>
        </Pressable>
        <Pressable
          style={styles.toggleRow}
          onPress={() => setShowWhyTooltips(!showWhyTooltips)}
        >
          <Text style={styles.toggleLabel}>Show "why" explanations</Text>
          <Text style={styles.toggleValue}>
            {showWhyTooltips ? 'On' : 'Off'}
          </Text>
        </Pressable>

        {/* Sacred Space */}
        <Text style={styles.sectionTitle}>SACRED SPACE</Text>
        <Pressable
          style={styles.toggleRow}
          onPress={() => router.push('/sacred-space')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>Notification silencing</Text>
            <Text style={styles.toggleSubtext}>
              {sacredSpaceSetupComplete ? 'Configured' : 'Set up Focus / DND'}
            </Text>
          </View>
          <Text style={styles.navArrow}>›</Text>
        </Pressable>

        {/* Learn */}
        <Text style={styles.sectionTitle}>LEARN</Text>
        <Pressable
          style={styles.toggleRow}
          onPress={() => router.push('/learn')}
        >
          <Text style={styles.toggleLabel}>Understanding the Tradition</Text>
          <Text style={styles.navArrow}>›</Text>
        </Pressable>

        {/* About */}
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.appName}>Matins</Text>
          <Text style={styles.aboutText}>
            A daily prayer companion rooted in the Book of Common Prayer and the
            historic Christian tradition.
          </Text>
          <Text style={styles.aboutText}>
            Scripture from the Berean Standard Bible (public domain), World
            English Bible, and King James Version. Lectionary from the 1979
            Book of Common Prayer.
          </Text>
        </View>
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
    ...typeStyles.screenTitle,
    color: colors.text.primary,
    paddingTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typeStyles.label,
    color: colors.text.tertiary,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionRowSelected: {
    borderColor: colors.accent.gold,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    ...typeStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    ...typeStyles.bodySmall,
    color: colors.text.secondary,
  },
  checkmark: {
    color: colors.accent.gold,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: spacing.md,
  },
  fontPreview: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLabel: {
    ...typeStyles.body,
    color: colors.text.primary,
  },
  toggleValue: {
    ...typeStyles.body,
    color: colors.accent.gold,
  },
  toggleSubtext: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  navArrow: {
    fontSize: 20,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  aboutCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appName: {
    fontFamily: 'Cormorant_700Bold',
    fontSize: 24,
    color: colors.accent.gold,
    marginBottom: spacing.sm,
  },
  aboutText: {
    ...typeStyles.bodySmall,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
});
