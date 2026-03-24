import { computeEaster } from './easter';
import { HolyDay, LiturgicalColor } from './types';

// ─── Fixed Holy Days (month/day) ────────────────────────────────────────────

interface FixedHolyDay extends HolyDay {
  month: number; // 1-12
  day: number;
}

const FIXED_HOLY_DAYS: FixedHolyDay[] = [
  // Principal Feasts
  { month: 1, day: 6, name: 'The Epiphany', type: 'principal-feast', color: 'white', learnTopic: 'what-is-epiphany' },
  { month: 12, day: 25, name: 'Christmas Day', type: 'principal-feast', color: 'white' },
  { month: 11, day: 1, name: 'All Saints\' Day', type: 'principal-feast', color: 'white' },

  // Major Feasts (Holy Days)
  { month: 1, day: 1, name: 'Holy Name of Our Lord', type: 'major-feast', color: 'white' },
  { month: 1, day: 18, name: 'The Confession of Saint Peter', type: 'major-feast', color: 'white' },
  { month: 1, day: 25, name: 'The Conversion of Saint Paul', type: 'major-feast', color: 'white' },
  { month: 2, day: 2, name: 'The Presentation of Our Lord', type: 'major-feast', color: 'white' },
  { month: 2, day: 24, name: 'Saint Matthias the Apostle', type: 'major-feast', color: 'red' },
  { month: 3, day: 19, name: 'Saint Joseph', type: 'major-feast', color: 'white' },
  { month: 3, day: 25, name: 'The Annunciation', type: 'major-feast', color: 'white' },
  { month: 4, day: 25, name: 'Saint Mark the Evangelist', type: 'major-feast', color: 'red' },
  { month: 5, day: 1, name: 'Saints Philip and James, Apostles', type: 'major-feast', color: 'red' },
  { month: 5, day: 31, name: 'The Visitation of the Blessed Virgin Mary', type: 'major-feast', color: 'white' },
  { month: 6, day: 11, name: 'Saint Barnabas the Apostle', type: 'major-feast', color: 'red' },
  { month: 6, day: 24, name: 'The Nativity of Saint John the Baptist', type: 'major-feast', color: 'white' },
  { month: 6, day: 29, name: 'Saints Peter and Paul, Apostles', type: 'major-feast', color: 'red' },
  { month: 7, day: 4, name: 'Independence Day', type: 'major-feast', color: 'white' },
  { month: 7, day: 22, name: 'Saint Mary Magdalene', type: 'major-feast', color: 'white' },
  { month: 7, day: 25, name: 'Saint James the Apostle', type: 'major-feast', color: 'red' },
  { month: 8, day: 6, name: 'The Transfiguration', type: 'major-feast', color: 'white' },
  { month: 8, day: 15, name: 'Saint Mary the Virgin', type: 'major-feast', color: 'white' },
  { month: 8, day: 24, name: 'Saint Bartholomew the Apostle', type: 'major-feast', color: 'red' },
  { month: 9, day: 14, name: 'Holy Cross Day', type: 'major-feast', color: 'red' },
  { month: 9, day: 21, name: 'Saint Matthew, Apostle and Evangelist', type: 'major-feast', color: 'red' },
  { month: 9, day: 29, name: 'Saint Michael and All Angels', type: 'major-feast', color: 'white' },
  { month: 10, day: 18, name: 'Saint Luke the Evangelist', type: 'major-feast', color: 'red' },
  { month: 10, day: 23, name: 'Saint James of Jerusalem', type: 'major-feast', color: 'red' },
  { month: 10, day: 28, name: 'Saints Simon and Jude, Apostles', type: 'major-feast', color: 'red' },
  { month: 11, day: 30, name: 'Saint Andrew the Apostle', type: 'major-feast', color: 'red' },
  { month: 12, day: 21, name: 'Saint Thomas the Apostle', type: 'major-feast', color: 'red' },
  { month: 12, day: 26, name: 'Saint Stephen, Deacon and Martyr', type: 'major-feast', color: 'red' },
  { month: 12, day: 27, name: 'Saint John, Apostle and Evangelist', type: 'major-feast', color: 'white' },
  { month: 12, day: 28, name: 'The Holy Innocents', type: 'major-feast', color: 'red' },

  // Fasts (Ember Days, Rogation Days are computed; these are fixed)
];

// ─── Moveable Holy Days (relative to Easter) ────────────────────────────────

function getMovableHolyDays(year: number): { date: Date; holyDay: HolyDay }[] {
  const easter = computeEaster(year);
  const addDays = (base: Date, days: number): Date => {
    const result = new Date(base);
    result.setDate(result.getDate() + days);
    return result;
  };

  return [
    // Principal Feasts
    {
      date: easter,
      holyDay: { name: 'Easter Day', type: 'principal-feast', color: 'white' },
    },
    {
      date: addDays(easter, 39),
      holyDay: { name: 'Ascension Day', type: 'principal-feast', color: 'white' },
    },
    {
      date: addDays(easter, 49),
      holyDay: { name: 'The Day of Pentecost', type: 'principal-feast', color: 'red', learnTopic: 'what-is-pentecost' },
    },
    {
      date: addDays(easter, 56),
      holyDay: { name: 'Trinity Sunday', type: 'principal-feast', color: 'white' },
    },

    // Major observances
    {
      date: addDays(easter, -46),
      holyDay: { name: 'Ash Wednesday', type: 'fast', color: 'purple', learnTopic: 'what-is-lent' },
    },
    {
      date: addDays(easter, -7),
      holyDay: { name: 'Palm Sunday', type: 'major-feast', color: 'red' },
    },
    {
      date: addDays(easter, -3),
      holyDay: { name: 'Maundy Thursday', type: 'major-feast', color: 'white' },
    },
    {
      date: addDays(easter, -2),
      holyDay: { name: 'Good Friday', type: 'fast', color: 'black' },
    },
    {
      date: addDays(easter, -1),
      holyDay: { name: 'Holy Saturday', type: 'major-feast', color: 'white' },
    },
  ];
}

// ─── Public API ─────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Get all holy days for a given date.
 * Returns an array sorted by precedence (principal feasts first).
 */
export function getHolyDaysForDate(date: Date): HolyDay[] {
  const results: HolyDay[] = [];
  const month = date.getMonth() + 1; // 1-indexed
  const day = date.getDate();

  // Check fixed holy days
  for (const fixed of FIXED_HOLY_DAYS) {
    if (fixed.month === month && fixed.day === day) {
      const { month: _m, day: _d, ...holyDay } = fixed;
      results.push(holyDay);
    }
  }

  // Check moveable holy days
  const year = date.getFullYear();
  const movable = getMovableHolyDays(year);
  for (const { date: holyDate, holyDay } of movable) {
    if (isSameDay(date, holyDate)) {
      results.push(holyDay);
    }
  }

  // Sort by precedence
  const precedence: Record<string, number> = {
    'principal-feast': 0,
    'major-feast': 1,
    'fast': 2,
    'minor-feast': 3,
    'commemoration': 4,
  };

  results.sort((a, b) => (precedence[a.type] ?? 5) - (precedence[b.type] ?? 5));

  return results;
}
