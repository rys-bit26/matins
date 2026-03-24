import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useMemo } from 'react';
import { colors, seasonColors, spacing } from '../../theme';
import { getLiturgicalDay } from '../../lib/calendar';
import { LiturgicalDay } from '../../lib/calendar/types';

interface CalendarGridProps {
  month: number; // 0-11
  year: number;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

const WEEKDAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarGrid({ month, year, selectedDate, onSelectDate }: CalendarGridProps) {
  const { days, startPadding } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startPadding = firstDay.getDay(); // 0=Sunday

    const days: { date: Date; litDay: LiturgicalDay; dateKey: string }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const litDay = getLiturgicalDay(date);
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date, litDay, dateKey });
    }

    return { days, startPadding };
  }, [month, year]);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      {/* Weekday headers */}
      <View style={styles.weekRow}>
        {WEEKDAY_HEADERS.map((h, i) => (
          <View key={i} style={styles.dayCell}>
            <Text style={styles.weekdayHeader}>{h}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {/* Empty cells for padding */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <View key={`pad-${i}`} style={styles.dayCell} />
        ))}

        {/* Day cells */}
        {days.map(({ date, litDay, dateKey }) => {
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === todayKey;
          const seasonColor = seasonColors[litDay.color];
          const hasHolyDay = litDay.holyDays.length > 0;

          return (
            <Pressable
              key={dateKey}
              style={styles.dayCell}
              onPress={() => onSelectDate(dateKey)}
            >
              <View style={[
                styles.dayCircle,
                isSelected && styles.dayCircleSelected,
                isToday && !isSelected && styles.dayCircleToday,
              ]}>
                <Text style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberSelected,
                  isToday && !isSelected && styles.dayNumberToday,
                ]}>
                  {date.getDate()}
                </Text>
              </View>
              <View style={[styles.seasonDot, { backgroundColor: seasonColor }]} />
              {hasHolyDay && <View style={styles.holyDayMarker} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    minHeight: 52,
  },
  weekdayHeader: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.accent.gold,
  },
  dayCircleToday: {
    borderWidth: 1,
    borderColor: colors.accent.gold,
  },
  dayNumber: {
    fontSize: 15,
    color: colors.text.primary,
  },
  dayNumberSelected: {
    color: colors.background.primary,
    fontWeight: '700',
  },
  dayNumberToday: {
    color: colors.accent.gold,
    fontWeight: '600',
  },
  seasonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  holyDayMarker: {
    position: 'absolute',
    top: 6,
    right: 12,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent.gold,
  },
});
