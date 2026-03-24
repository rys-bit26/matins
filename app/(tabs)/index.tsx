import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, seasonColors, typeStyles, spacing, getReadingFont } from '../../src/theme';
import { OfficeType, useOfficeStore } from '../../src/stores/officeStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useLiturgicalDay } from '../../src/hooks/useLiturgicalDay';
import { useDailyReadings } from '../../src/hooks/useDailyReadings';
import { SEASON_NAMES } from '../../src/lib/calendar';
import { selectDevotional } from '../../src/lib/devotionals';

const OFFICES: { type: OfficeType; name: string; time: string; description: string }[] = [
  {
    type: 'morning',
    name: 'Morning Prayer',
    time: 'Early morning',
    description: 'Begin the day in God\'s presence with psalms, scripture, and prayer.',
  },
  {
    type: 'evening',
    name: 'Evening Prayer',
    time: 'Late afternoon',
    description: 'As the day draws to a close, offer thanksgiving and intercession.',
  },
  {
    type: 'compline',
    name: 'Compline',
    time: 'Before sleep',
    description: 'The ancient night prayer — commend yourself to God\'s care.',
  },
];

function getRecommendedOffice(): OfficeType {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'evening';
  return 'compline';
}

export default function TodayScreen() {
  const router = useRouter();
  const recommended = getRecommendedOffice();
  const liturgicalDay = useLiturgicalDay();
  const readings = useDailyReadings();
  const fontStyle = useSettingsStore((s) => s.fontStyle);
  const readingFont = getReadingFont(fontStyle);
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];
  const completedOffices = useOfficeStore((s) => s.completedOffices);
  const todayCompleted = completedOffices[todayKey] ?? [];
  const todaysDevotional = selectDevotional(today, liturgicalDay.season);
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const seasonColor = seasonColors[liturgicalDay.color];
  const seasonName = SEASON_NAMES[liturgicalDay.season].toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Liturgical Day Header */}
        <View style={styles.header}>
          <View style={[styles.seasonBar, { backgroundColor: seasonColor }]} />
          <Text style={styles.seasonLabel}>{seasonName}</Text>
          <Text style={styles.dateText}>{dateString}</Text>
          <Text style={[styles.liturgicalTitle, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
            {liturgicalDay.title}
          </Text>
          {liturgicalDay.holyDays.length > 0 && liturgicalDay.holyDays[0].name !== liturgicalDay.title && (
            <Text style={[styles.holyDayText, { color: seasonColor }]}>
              {liturgicalDay.holyDays[0].name}
            </Text>
          )}
        </View>

        {/* Office Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The Daily Office</Text>
          {OFFICES.map((office) => {
            const isRecommended = office.type === recommended;
            const isCompleted = todayCompleted.includes(office.type);
            return (
              <Pressable
                key={office.type}
                style={[
                  styles.officeCard,
                  isRecommended && !isCompleted && styles.officeCardRecommended,
                  isCompleted && styles.officeCardCompleted,
                ]}
                onPress={() => router.push(`/office/${office.type}`)}
              >
                <View style={styles.officeCardHeader}>
                  <Text
                    style={[
                      styles.officeName,
                      { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined },
                      isRecommended && !isCompleted && styles.officeNameRecommended,
                      isCompleted && styles.officeNameCompleted,
                    ]}
                  >
                    {isCompleted ? '✓ ' : ''}{office.name}
                  </Text>
                  <Text style={styles.officeTime}>{office.time}</Text>
                </View>
                <Text style={styles.officeDescription}>
                  {office.description}
                </Text>
                {isRecommended && !isCompleted && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Suggested now</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Today's Readings Quick View */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Readings</Text>
          <View style={styles.readingsCard}>
            {readings.psalms.morning.length > 0 && (
              <>
                <Text style={styles.readingLabel}>Psalms</Text>
                <Text style={[styles.readingRef, { fontFamily: readingFont }]}>
                  Morning: Ps {readings.psalms.morning.join(', ')}
                  {readings.psalms.evening.length > 0 &&
                    ` — Evening: Ps ${readings.psalms.evening.join(', ')}`}
                </Text>
                <View style={styles.readingDivider} />
              </>
            )}
            {readings.lessons.first ? (
              <>
                <Text style={styles.readingLabel}>First Lesson</Text>
                <Pressable onPress={() => router.push(`/reading/${encodeURIComponent(readings.lessons.first)}`)}>
                  <Text style={[styles.readingRef, { fontFamily: readingFont }, styles.readingLink]}>{readings.lessons.first}</Text>
                </Pressable>
                <View style={styles.readingDivider} />
              </>
            ) : null}
            {readings.lessons.second ? (
              <>
                <Text style={styles.readingLabel}>Second Lesson</Text>
                <Pressable onPress={() => router.push(`/reading/${encodeURIComponent(readings.lessons.second)}`)}>
                  <Text style={[styles.readingRef, { fontFamily: readingFont }, styles.readingLink]}>{readings.lessons.second}</Text>
                </Pressable>
                <View style={styles.readingDivider} />
              </>
            ) : null}
            {readings.lessons.gospel ? (
              <>
                <Text style={styles.readingLabel}>Gospel</Text>
                <Pressable onPress={() => router.push(`/reading/${encodeURIComponent(readings.lessons.gospel)}`)}>
                  <Text style={[styles.readingRef, { fontFamily: readingFont }, styles.readingLink]}>{readings.lessons.gospel}</Text>
                </Pressable>
              </>
            ) : null}
            {!readings.lessons.first && !readings.lessons.second && !readings.lessons.gospel && (
              <Text style={[styles.readingRef, { fontFamily: readingFont }]}>No readings resolved for today</Text>
            )}
          </View>
        </View>

        {/* Daily Devotional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Devotional</Text>
          <Pressable
            style={styles.devotionalCard}
            onPress={() => router.push(`/devotional/${todaysDevotional.slug}`)}
          >
            <Text style={styles.devotionalSymbol}>✦</Text>
            <Text style={[styles.devotionalTitle, { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined }]}>
              {todaysDevotional.title}
            </Text>
            <Text style={styles.devotionalAuthor}>{todaysDevotional.author}</Text>
            <Text style={styles.devotionalSource}>{todaysDevotional.source}</Text>
          </Pressable>
        </View>

        {/* Learn link */}
        <View style={styles.section}>
          <Pressable
            style={styles.learnLink}
            onPress={() => router.push('/learn')}
          >
            <Text style={styles.learnLinkText}>New to liturgical prayer?</Text>
            <Text style={styles.learnLinkCta}>Understanding the Tradition →</Text>
          </Pressable>
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
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  seasonBar: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  holyDayText: {
    fontFamily: 'Cormorant_400Regular_Italic',
    fontSize: 18,
    marginTop: spacing.sm,
  },
  seasonLabel: {
    ...typeStyles.label,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typeStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  liturgicalTitle: {
    ...typeStyles.screenTitle,
    color: colors.text.primary,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    ...typeStyles.label,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
  officeCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  officeCardRecommended: {
    borderColor: colors.accent.gold,
    borderWidth: 1,
  },
  officeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  officeName: {
    ...typeStyles.sectionHeading,
    color: colors.text.primary,
    fontSize: 20,
  },
  officeNameRecommended: {
    color: colors.accent.gold,
  },
  officeTime: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
  },
  officeDescription: {
    ...typeStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  recommendedBadge: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent.gold + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  recommendedText: {
    ...typeStyles.caption,
    color: colors.accent.gold,
  },
  officeCardCompleted: {
    borderColor: colors.accent.sage + '60',
    opacity: 0.7,
  },
  officeNameCompleted: {
    color: colors.accent.sage,
  },
  devotionalCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent.gold + '30',
  },
  devotionalSymbol: {
    fontSize: 18,
    color: colors.accent.gold,
    marginBottom: spacing.sm,
  },
  devotionalTitle: {
    fontSize: 19,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  devotionalAuthor: {
    ...typeStyles.bodySmall,
    color: colors.accent.gold,
    marginBottom: 2,
  },
  devotionalSource: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  learnLink: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  learnLinkText: {
    ...typeStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  learnLinkCta: {
    ...typeStyles.bodySmall,
    color: colors.accent.gold,
    fontWeight: '600',
  },
  readingsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.lg,
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
    // fontFamily applied dynamically via getReadingFont
  },
  readingLink: {
    color: colors.accent.gold,
    textDecorationLine: 'underline',
  },
  readingDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
