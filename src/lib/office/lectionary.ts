import { getLiturgicalDay, getLectionaryYear } from '../calendar/seasons';
import { LiturgicalDay, Season } from '../calendar/types';
import { LectionaryEntry, HolyDayLectionaryEntry, DailyReadings } from './types';

// Import lectionary data
import year1Data from '../../../data/lectionary/year-1.json';
import year2Data from '../../../data/lectionary/year-2.json';
import holyDaysData from '../../../data/lectionary/holy-days.json';

const year1 = year1Data as LectionaryEntry[];
const year2 = year2Data as LectionaryEntry[];
const holyDays = holyDaysData as HolyDayLectionaryEntry[];

// ─── Season name mapping ────────────────────────────────────────────────────
// Map our Season type to the lectionary data's season strings
const SEASON_TO_LECTIONARY: Record<Season, string> = {
  'advent': 'Advent',
  'christmas': 'Christmas',
  'epiphany': 'Epiphany',
  'lent': 'Lent',
  'holy-week': 'Lent',  // Holy Week is part of Lent in the lectionary data
  'easter': 'Easter',
  'pentecost': 'Easter', // Pentecost day is in Easter section
  'ordinary-time': 'The Season after Pentecost',
};

// ─── Day name mapping ───────────────────────────────────────────────────────
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Resolve the Daily Office Lectionary readings for a given date.
 */
export function resolveLectionary(date: Date): DailyReadings {
  const liturgicalDay = getLiturgicalDay(date);
  const lectionaryYear = liturgicalDay.lectionaryYear;

  // 1. Look up regular lectionary entry first
  const entries = lectionaryYear === 'Year One' ? year1 : year2;
  const entry = findLectionaryEntry(entries, liturgicalDay);

  // 2. Check holy days — they may override or supplement regular readings
  const holyDayEntry = findHolyDayEntry(date);
  if (holyDayEntry) {
    const morningLessons = holyDayEntry.lessons?.morning;
    const eveningLessons = holyDayEntry.lessons?.evening;
    const hasMorning = morningLessons?.first || morningLessons?.second;
    const hasEvening = eveningLessons?.first || eveningLessons?.second;

    // Only use holy day as primary if it has substantial readings (morning + evening)
    // Otherwise, use regular lectionary and note the holy day
    if (hasMorning && hasEvening) {
      return {
        date,
        liturgicalDay,
        psalms: {
          morning: holyDayEntry.psalms?.morning ?? entry?.psalms?.morning ?? [],
          evening: holyDayEntry.psalms?.evening ?? entry?.psalms?.evening ?? [],
        },
        lessons: {
          first: morningLessons?.first ?? '',
          second: morningLessons?.second ?? '',
          gospel: eveningLessons?.second ?? eveningLessons?.first ?? '',
        },
        title: holyDayEntry.title,
      };
    }
    // Partial holy day (e.g., "Eve of..." with only evening) — fall through to regular
  }

  if (entry) {
    // Some entries (Easter Week, etc.) use morning/evening lesson structure
    // instead of first/second/gospel. Normalize to our DailyReadings format.
    const lessons = normalizeEntryLessons(entry.lessons);
    return {
      date,
      liturgicalDay,
      psalms: entry.psalms,
      lessons,
      title: entry.title,
    };
  }

  // 3. Fallback — return empty readings
  return {
    date,
    liturgicalDay,
    psalms: { morning: [], evening: [] },
    lessons: { first: '', second: '', gospel: '' },
  };
}

/**
 * Find a holy day lectionary entry for a specific date.
 */
function findHolyDayEntry(date: Date): HolyDayLectionaryEntry | null {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${monthNames[month]} ${day}`;

  return holyDays.find((hd) => hd.day === dateStr) ?? null;
}

/**
 * Find the lectionary entry matching a liturgical day.
 * This is the core matching algorithm.
 */
function findLectionaryEntry(
  entries: LectionaryEntry[],
  litDay: LiturgicalDay
): LectionaryEntry | null {
  const seasonStr = SEASON_TO_LECTIONARY[litDay.season];
  const dayStr = litDay.dayOfWeek;
  const date = litDay.date;

  // Build a calendar date string for date-keyed entries (e.g., "Dec 25")
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const calDateStr = `${monthNames[date.getMonth()]} ${date.getDate()}`;

  // 1. Try matching by calendar date first (Christmas, specific dates)
  let match = entries.find(
    (e) => e.day === calDateStr
  );
  if (match) return match;

  // Build the week string
  const weekStr = buildWeekString(litDay);

  // 2. Try exact match on season + week + day
  match = entries.find(
    (e) => e.season === seasonStr && e.week === weekStr && e.day === dayStr
  );
  if (match) return match;

  // 3. Easter Week: week 1 of Easter uses "Easter Week" as the week string
  if (litDay.season === 'easter' && litDay.week === 1) {
    match = entries.find(
      (e) => e.season === 'Easter' && e.week === 'Easter Week' && e.day === dayStr
    );
    if (match) return match;
  }

  // 4. Try fuzzy matching on the week string
  match = entries.find((e) => {
    if (e.season !== seasonStr || e.day !== dayStr) return false;
    const weekNum = litDay.week.toString();
    return e.week.includes(weekNum);
  });
  if (match) return match;

  // 5. For Holy Week, try matching by specific day names
  if (litDay.season === 'holy-week') {
    match = entries.find((e) => {
      if (e.day !== dayStr) return false;
      return e.week === 'Holy Week' || e.week.includes('6 Lent');
    });
    if (match) return match;
  }

  return null;
}

/**
 * Build the week identifier string to match against lectionary data.
 */
function buildWeekString(litDay: LiturgicalDay): string {
  switch (litDay.season) {
    case 'advent':
      return `Week of ${litDay.week} Advent`;
    case 'christmas':
      return `Christmas Day and Following`; // Simplified
    case 'epiphany':
      return `Week of ${litDay.week} Epiphany`;
    case 'lent':
      return `Week of ${litDay.week} Lent`;
    case 'holy-week':
      return `Week of 6 Lent`; // Holy Week = 6th week of Lent in BCP
    case 'easter':
      return `Week of ${litDay.week} Easter`;
    case 'pentecost':
      return `Week of 7 Easter`; // Pentecost week
    case 'ordinary-time':
      return `Proper ${litDay.week}`;
    default:
      return `Week of ${litDay.week}`;
  }
}

/**
 * Normalize the lessons from a lectionary entry.
 * Handles two data formats:
 *   - Standard: { first, second, gospel }
 *   - Morning/Evening split: { morning: { first, gospel }, evening: { first, gospel } }
 */
function normalizeEntryLessons(
  lessons: any
): { first: string; second: string; gospel: string } {
  // Standard format
  if (lessons.first || lessons.second || lessons.gospel) {
    return {
      first: lessons.first ?? '',
      second: lessons.second ?? '',
      gospel: lessons.gospel ?? '',
    };
  }

  // Morning/Evening split format (Easter Week, some special days)
  const morning = lessons.morning;
  const evening = lessons.evening;
  return {
    first: morning?.first ?? evening?.first ?? '',
    second: morning?.second ?? evening?.second ?? '',
    gospel: morning?.gospel ?? evening?.gospel ?? '',
  };
}
