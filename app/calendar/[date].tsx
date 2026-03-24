import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing, seasonColors, getReadingFont } from '../../src/theme';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { getLiturgicalDay, SEASON_NAMES } from '../../src/lib/calendar';
import { resolveLectionary } from '../../src/lib/office/lectionary';

export default function CalendarDayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const fontStyle = useSettingsStore((s) => s.fontStyle);

  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const litDay = getLiturgicalDay(dateObj);
  const readings = resolveLectionary(dateObj);
  const seasonColor = seasonColors[litDay.color];
  const readingFont = getReadingFont(fontStyle);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.seasonBar, { backgroundColor: seasonColor }]} />
        <Text style={[styles.title, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
          {litDay.title}
        </Text>
        <Text style={styles.dateText}>
          {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.chip, { backgroundColor: seasonColor }]}>
            <Text style={styles.chipText}>{SEASON_NAMES[litDay.season]}</Text>
          </View>
          <Text style={styles.yearText}>{litDay.lectionaryYear}</Text>
        </View>

        {/* Holy Days */}
        {litDay.holyDays.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>OBSERVANCES</Text>
            {litDay.holyDays.map((hd, i) => (
              <View key={i} style={styles.holyDayCard}>
                <View style={[styles.holyDayDot, { backgroundColor: seasonColors[hd.color] }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.holyDayName}>{hd.name}</Text>
                  <Text style={styles.holyDayType}>{hd.type.replace('-', ' ')}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Readings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DAILY OFFICE READINGS</Text>

          {readings.psalms.morning.length > 0 && (
            <View style={styles.readingCard}>
              <Text style={styles.readingLabel}>Morning Psalms</Text>
              <Text style={[styles.readingRef, { fontFamily: readingFont }]}>
                Ps {readings.psalms.morning.join(', ')}
              </Text>
            </View>
          )}

          {readings.psalms.evening.length > 0 && (
            <View style={styles.readingCard}>
              <Text style={styles.readingLabel}>Evening Psalms</Text>
              <Text style={[styles.readingRef, { fontFamily: readingFont }]}>
                Ps {readings.psalms.evening.join(', ')}
              </Text>
            </View>
          )}

          {readings.lessons.first ? (
            <Pressable
              style={styles.readingCard}
              onPress={() => router.push(`/reading/${encodeURIComponent(readings.lessons.first)}`)}
            >
              <Text style={styles.readingLabel}>First Lesson</Text>
              <Text style={[styles.readingRef, styles.readingLink, { fontFamily: readingFont }]}>
                {readings.lessons.first}
              </Text>
            </Pressable>
          ) : null}

          {readings.lessons.second ? (
            <Pressable
              style={styles.readingCard}
              onPress={() => router.push(`/reading/${encodeURIComponent(readings.lessons.second)}`)}
            >
              <Text style={styles.readingLabel}>Second Lesson</Text>
              <Text style={[styles.readingRef, styles.readingLink, { fontFamily: readingFont }]}>
                {readings.lessons.second}
              </Text>
            </Pressable>
          ) : null}

          {readings.lessons.gospel ? (
            <Pressable
              style={styles.readingCard}
              onPress={() => router.push(`/reading/${encodeURIComponent(readings.lessons.gospel)}`)}
            >
              <Text style={styles.readingLabel}>Gospel</Text>
              <Text style={[styles.readingRef, styles.readingLink, { fontFamily: readingFont }]}>
                {readings.lessons.gospel}
              </Text>
            </Pressable>
          ) : null}
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
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  seasonBar: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 26,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  dateText: {
    ...typeStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 12,
    color: colors.background.primary,
    fontWeight: '700',
  },
  yearText: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typeStyles.label,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  holyDayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  holyDayDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  holyDayName: {
    ...typeStyles.body,
    color: colors.text.primary,
  },
  holyDayType: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  readingCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  readingLabel: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  readingRef: {
    fontSize: 17,
    color: colors.text.primary,
    lineHeight: 24,
  },
  readingLink: {
    color: colors.accent.gold,
    textDecorationLine: 'underline',
  },
});
