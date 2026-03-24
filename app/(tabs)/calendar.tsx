import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing, seasonColors, getReadingFont } from '../../src/theme';
import { useCalendarStore } from '../../src/stores/calendarStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useLiturgicalDay } from '../../src/hooks/useLiturgicalDay';
import { getLiturgicalDay, SEASON_NAMES } from '../../src/lib/calendar';
import { CalendarGrid } from '../../src/components/calendar/CalendarGrid';
import { SeasonBar } from '../../src/components/calendar/SeasonBar';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarScreen() {
  const router = useRouter();
  const { selectedDate, setSelectedDate, viewMonth, viewYear, setViewMonth } = useCalendarStore();
  const fontStyle = useSettingsStore((s) => s.fontStyle);

  // Get liturgical info for the selected date
  const [selYear, selMonth, selDay] = selectedDate.split('-').map(Number);
  const selDate = new Date(selYear, selMonth - 1, selDay);
  const selLitDay = getLiturgicalDay(selDate);
  const seasonColor = seasonColors[selLitDay.color];

  // Get liturgical info for the first day of the viewed month
  const viewFirstDay = getLiturgicalDay(new Date(viewYear, viewMonth, 1));

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11, viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1, viewYear);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0, viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1, viewYear);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
            The Church Year
          </Text>
        </View>

        {/* Season indicator */}
        <View style={styles.seasonSection}>
          <SeasonBar season={viewFirstDay.season} color={viewFirstDay.color} />
        </View>

        {/* Month navigation */}
        <View style={styles.monthNav}>
          <Pressable onPress={goToPrevMonth} style={styles.navButton}>
            <Text style={styles.navArrow}>‹</Text>
          </Pressable>
          <Text style={styles.monthLabel}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <Pressable onPress={goToNextMonth} style={styles.navButton}>
            <Text style={styles.navArrow}>›</Text>
          </Pressable>
        </View>

        {/* Calendar grid */}
        <View style={styles.gridContainer}>
          <CalendarGrid
            month={viewMonth}
            year={viewYear}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </View>

        {/* Selected day detail */}
        <View style={styles.detailSection}>
          <View style={[styles.detailBar, { backgroundColor: seasonColor + '40' }]} />
          <Text style={[styles.detailTitle, { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined }]}>
            {selLitDay.title}
          </Text>
          <Text style={styles.detailDate}>
            {selDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
          <View style={styles.detailMeta}>
            <View style={[styles.colorChip, { backgroundColor: seasonColor }]}>
              <Text style={styles.colorChipText}>{SEASON_NAMES[selLitDay.season]}</Text>
            </View>
            <Text style={styles.detailYear}>{selLitDay.lectionaryYear}</Text>
          </View>
          {selLitDay.holyDays.length > 0 && (
            <View style={styles.holyDaysList}>
              {selLitDay.holyDays.map((hd, i) => (
                <View key={i} style={styles.holyDayRow}>
                  <View style={[styles.holyDayDot, { backgroundColor: seasonColors[hd.color] }]} />
                  <Text style={styles.holyDayName}>{hd.name}</Text>
                  <Text style={styles.holyDayType}>{hd.type.replace('-', ' ')}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={[styles.viewDayButton, { borderColor: seasonColor }]}
            onPress={() => router.push(`/calendar/${selectedDate}`)}
          >
            <Text style={[styles.viewDayText, { color: seasonColor }]}>View Readings</Text>
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
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  seasonSection: {
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.md,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.lg,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    fontSize: 28,
    color: colors.text.secondary,
  },
  monthLabel: {
    ...typeStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 17,
  },
  gridContainer: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xxl,
  },
  detailSection: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xxxl,
  },
  detailBar: {
    height: 2,
    borderRadius: 1,
    marginBottom: spacing.lg,
  },
  detailTitle: {
    fontSize: 22,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  detailDate: {
    ...typeStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  colorChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  colorChipText: {
    fontSize: 12,
    color: colors.background.primary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  detailYear: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
  },
  holyDaysList: {
    marginBottom: spacing.lg,
  },
  holyDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  holyDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  holyDayName: {
    ...typeStyles.body,
    color: colors.text.primary,
    flex: 1,
  },
  holyDayType: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  viewDayButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
  },
  viewDayText: {
    ...typeStyles.bodySmall,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
