import { computeEaster } from './easter';
import {
  LiturgicalYear,
  LiturgicalDay,
  Season,
  LiturgicalColor,
  HolyDay,
  SEASON_COLORS,
  DAY_NAMES,
} from './types';
import { getHolyDaysForDate } from './holyDays';

// ─── Date helpers ───────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  return Math.round((toMidnight(b).getTime() - toMidnight(a).getTime()) / msPerDay);
}

/**
 * Find the Sunday nearest to a given date.
 * Used to calculate the start of Advent (Sunday nearest Nov 30).
 */
function sundayNearestTo(date: Date): Date {
  const day = date.getDay(); // 0=Sun, 6=Sat
  if (day <= 3) {
    // Sun-Wed: go back to previous Sunday
    return addDays(date, -day);
  } else {
    // Thu-Sat: go forward to next Sunday
    return addDays(date, 7 - day);
  }
}

/**
 * Find the previous Sunday on or before a given date.
 */
function previousSunday(date: Date): Date {
  const day = date.getDay();
  return day === 0 ? date : addDays(date, -day);
}

// ─── Liturgical Year computation ────────────────────────────────────────────

/**
 * Compute all the key dates for a liturgical year.
 * A liturgical year starts on the First Sunday of Advent and ends the
 * Saturday before the next Advent.
 *
 * @param year The calendar year in which Advent begins (the church year
 *   that spans year/year+1).
 */
export function computeLiturgicalYear(year: number): LiturgicalYear {
  const easter = computeEaster(year + 1); // Easter is always in the next calendar year relative to Advent start

  // Actually, this is tricky. If we're computing for Advent 2025, Easter 2026 is relevant.
  // But if called with the calendar year of the date we're looking at, we need the right Easter.
  // Let's redefine: this function takes the civil year and computes boundaries for dates in that year.

  // We need two Easters: one for the current year, one for the next year
  const easterThisYear = computeEaster(year);
  const easterNextYear = computeEaster(year + 1);

  // Advent: Sunday nearest November 30
  const nov30 = new Date(year, 10, 30); // Nov 30
  const adventStart = sundayNearestTo(nov30);

  // Also need last year's Advent to bound the start of the year
  const nov30LastYear = new Date(year - 1, 10, 30);
  const lastAdventStart = sundayNearestTo(nov30LastYear);

  return {
    year,
    adventStart,
    christmasDay: new Date(year, 11, 25),
    epiphany: new Date(year, 0, 6),
    ashWednesday: addDays(easterThisYear, -46),
    palmSunday: addDays(easterThisYear, -7),
    maundyThursday: addDays(easterThisYear, -3),
    goodFriday: addDays(easterThisYear, -2),
    holySaturday: addDays(easterThisYear, -1),
    easterSunday: easterThisYear,
    ascension: addDays(easterThisYear, 39),
    pentecost: addDays(easterThisYear, 49),
    trinitySunday: addDays(easterThisYear, 56),
    nextAdventStart: adventStart,
  };
}

// ─── Season determination ───────────────────────────────────────────────────

interface SeasonInfo {
  season: Season;
  week: number;
  color: LiturgicalColor;
  title: string;
  shortTitle: string;
}

/**
 * Determine the liturgical season, week, and color for any date.
 */
export function getSeasonForDate(date: Date): SeasonInfo {
  const d = toMidnight(date);
  const year = d.getFullYear();
  const easter = computeEaster(year);

  // Key dates for this calendar year
  const epiphany = new Date(year, 0, 6);
  const ashWednesday = addDays(easter, -46);
  const palmSunday = addDays(easter, -7);
  const easterSunday = easter;
  const pentecostDay = addDays(easter, 49);
  const trinitySunday = addDays(easter, 56);

  // Advent start this year
  const nov30 = new Date(year, 10, 30);
  const adventStart = sundayNearestTo(nov30);

  // Advent start last year (for Jan dates that might still be Christmas season)
  const christmasDay = new Date(year, 11, 25);
  const lastChristmas = new Date(year - 1, 11, 25);

  // ─── Check seasons in chronological order for the calendar year ───

  // Jan 1 - Jan 5: Christmas season (from last year's Christmas)
  if (d.getMonth() === 0 && d.getDate() < 6) {
    const daysSinceChristmas = daysBetween(lastChristmas, d);
    const week = Math.floor(daysSinceChristmas / 7) + 1;
    return {
      season: 'christmas',
      week,
      color: 'white',
      title: `Christmas Season`,
      shortTitle: 'Christmas',
    };
  }

  // Jan 6: Epiphany
  if (d.getMonth() === 0 && d.getDate() === 6) {
    return {
      season: 'epiphany',
      week: 1,
      color: 'white',
      title: 'The Epiphany',
      shortTitle: 'Epiphany',
    };
  }

  // Epiphany season: Jan 7 through day before Ash Wednesday
  if (d >= addDays(epiphany, 1) && d < ashWednesday) {
    const firstSundayAfterEpiphany = addDays(epiphany, 7 - epiphany.getDay() || 7);
    const sundayRef = previousSunday(d);
    const weekNum = Math.floor(daysBetween(firstSundayAfterEpiphany, sundayRef) / 7) + 1;
    const week = Math.max(1, weekNum);
    const dayName = DAY_NAMES[d.getDay()];
    return {
      season: 'epiphany',
      week,
      color: 'green',
      title: dayName === 'Sunday'
        ? `The ${ordinal(week)} Sunday after the Epiphany`
        : `${dayName} in the ${ordinal(week)} Week of Epiphany`,
      shortTitle: `Epiphany ${week}`,
    };
  }

  // Ash Wednesday
  if (isSameDay(d, ashWednesday)) {
    return {
      season: 'lent',
      week: 0,
      color: 'purple',
      title: 'Ash Wednesday',
      shortTitle: 'Ash Wed',
    };
  }

  // Lent: day after Ash Wednesday through day before Palm Sunday
  if (d > ashWednesday && d < palmSunday) {
    const firstSundayOfLent = addDays(ashWednesday, 7 - ashWednesday.getDay() || 7);
    const sundayRef = previousSunday(d);
    const weekNum = Math.floor(daysBetween(firstSundayOfLent, sundayRef) / 7) + 1;
    const week = Math.max(1, weekNum);
    const dayName = DAY_NAMES[d.getDay()];

    // Laetare Sunday (4th Sunday of Lent) uses rose
    const color: LiturgicalColor =
      dayName === 'Sunday' && week === 4 ? 'rose' : 'purple';

    return {
      season: 'lent',
      week,
      color,
      title: dayName === 'Sunday'
        ? `The ${ordinal(week)} Sunday in Lent`
        : `${dayName} in the ${ordinal(week)} Week of Lent`,
      shortTitle: `Lent ${week}`,
    };
  }

  // Holy Week: Palm Sunday through Holy Saturday
  if (d >= palmSunday && d < easterSunday) {
    const daysIntoHolyWeek = daysBetween(palmSunday, d);
    const dayName = DAY_NAMES[d.getDay()];

    if (isSameDay(d, palmSunday)) {
      return { season: 'holy-week', week: 1, color: 'red', title: 'Palm Sunday', shortTitle: 'Palm Sun' };
    }
    if (isSameDay(d, addDays(easter, -3))) {
      return { season: 'holy-week', week: 1, color: 'white', title: 'Maundy Thursday', shortTitle: 'Maundy Thu' };
    }
    if (isSameDay(d, addDays(easter, -2))) {
      return { season: 'holy-week', week: 1, color: 'black', title: 'Good Friday', shortTitle: 'Good Fri' };
    }
    if (isSameDay(d, addDays(easter, -1))) {
      return { season: 'holy-week', week: 1, color: 'white', title: 'Holy Saturday', shortTitle: 'Holy Sat' };
    }

    return {
      season: 'holy-week',
      week: 1,
      color: 'purple',
      title: `${dayName} in Holy Week`,
      shortTitle: 'Holy Week',
    };
  }

  // Easter Day
  if (isSameDay(d, easterSunday)) {
    return {
      season: 'easter',
      week: 1,
      color: 'white',
      title: 'Easter Day',
      shortTitle: 'Easter',
    };
  }

  // Easter season: day after Easter through Pentecost Eve
  if (d > easterSunday && d < pentecostDay) {
    const sundayRef = previousSunday(d);
    const weekNum = Math.floor(daysBetween(easterSunday, sundayRef) / 7) + 1;
    const week = Math.max(1, weekNum);
    const dayName = DAY_NAMES[d.getDay()];

    // Ascension Day
    const ascension = addDays(easter, 39);
    if (isSameDay(d, ascension)) {
      return { season: 'easter', week, color: 'white', title: 'Ascension Day', shortTitle: 'Ascension' };
    }

    return {
      season: 'easter',
      week,
      color: 'white',
      title: dayName === 'Sunday'
        ? `The ${ordinal(week)} Sunday of Easter`
        : `${dayName} in the ${ordinal(week)} Week of Easter`,
      shortTitle: `Easter ${week}`,
    };
  }

  // Day of Pentecost
  if (isSameDay(d, pentecostDay)) {
    return {
      season: 'pentecost',
      week: 1,
      color: 'red',
      title: 'The Day of Pentecost',
      shortTitle: 'Pentecost',
    };
  }

  // Trinity Sunday
  if (isSameDay(d, trinitySunday)) {
    return {
      season: 'ordinary-time',
      week: 1,
      color: 'white',
      title: 'Trinity Sunday',
      shortTitle: 'Trinity',
    };
  }

  // Ordinary Time (Season after Pentecost): day after Pentecost through Saturday before Advent
  if (d > pentecostDay && d < adventStart) {
    const dayAfterPentecost = addDays(pentecostDay, 1);
    const sundayRef = previousSunday(d);
    // Week 1 = Trinity Sunday week. Proper numbering starts at Proper 1.
    const weekNum = Math.floor(daysBetween(trinitySunday, sundayRef) / 7) + 1;
    const week = Math.max(1, weekNum);
    const dayName = DAY_NAMES[d.getDay()];

    return {
      season: 'ordinary-time',
      week,
      color: 'green',
      title: dayName === 'Sunday'
        ? `The ${ordinal(week)} Sunday after Pentecost`
        : `${dayName} in the ${ordinal(week)} Week after Pentecost`,
      shortTitle: `Proper ${week}`,
    };
  }

  // Advent: first Sunday of Advent through Dec 24
  if (d >= adventStart && d.getMonth() === 11 && d.getDate() < 25) {
    const sundayRef = previousSunday(d);
    const weekNum = Math.floor(daysBetween(adventStart, sundayRef) / 7) + 1;
    const week = Math.max(1, weekNum);
    const dayName = DAY_NAMES[d.getDay()];

    // Gaudete Sunday (3rd Sunday of Advent) uses rose
    const color: LiturgicalColor =
      dayName === 'Sunday' && week === 3 ? 'rose' : 'purple';

    return {
      season: 'advent',
      week,
      color,
      title: dayName === 'Sunday'
        ? `The ${ordinal(week)} Sunday of Advent`
        : `${dayName} in the ${ordinal(week)} Week of Advent`,
      shortTitle: `Advent ${week}`,
    };
  }

  // Christmas Day
  if (d.getMonth() === 11 && d.getDate() === 25) {
    return {
      season: 'christmas',
      week: 1,
      color: 'white',
      title: 'The Nativity of Our Lord: Christmas Day',
      shortTitle: 'Christmas',
    };
  }

  // Christmas season: Dec 26-31
  if (d.getMonth() === 11 && d.getDate() > 25) {
    const daysAfterChristmas = d.getDate() - 25;
    return {
      season: 'christmas',
      week: 1,
      color: 'white',
      title: 'Christmas Season',
      shortTitle: 'Christmas',
    };
  }

  // Fallback (should not reach here)
  return {
    season: 'ordinary-time',
    week: 1,
    color: 'green',
    title: DAY_NAMES[d.getDay()],
    shortTitle: 'Ordinary',
  };
}

// ─── Lectionary Year ────────────────────────────────────────────────────────

/**
 * Determine the Daily Office Lectionary year.
 * Year One begins on the First Sunday of Advent preceding odd-numbered years.
 * Year Two begins on the First Sunday of Advent preceding even-numbered years.
 */
export function getLectionaryYear(date: Date): 'Year One' | 'Year Two' {
  const d = toMidnight(date);
  const year = d.getFullYear();

  // Find which Advent we're in
  const nov30 = new Date(year, 10, 30);
  const adventStart = sundayNearestTo(nov30);

  // If we're before this year's Advent, we're in the church year that started last Advent
  const churchYear = d < adventStart ? year : year + 1;

  // Odd church years = Year One, Even = Year Two
  return churchYear % 2 === 1 ? 'Year One' : 'Year Two';
}

// ─── Composite function ─────────────────────────────────────────────────────

/**
 * Get the complete liturgical day information for any date.
 */
export function getLiturgicalDay(date: Date): LiturgicalDay {
  const d = toMidnight(date);
  const seasonInfo = getSeasonForDate(d);
  const holyDays = getHolyDaysForDate(d);
  const lectionaryYear = getLectionaryYear(d);

  // Holy days may override the color
  let color = seasonInfo.color;
  let title = seasonInfo.title;
  if (holyDays.length > 0) {
    const primary = holyDays[0];
    if (primary.type === 'principal-feast' || primary.type === 'major-feast') {
      color = primary.color;
      title = primary.name;
    }
  }

  return {
    date: d,
    season: seasonInfo.season,
    week: seasonInfo.week,
    dayOfWeek: DAY_NAMES[d.getDay()],
    color,
    title,
    shortTitle: seasonInfo.shortTitle,
    holyDays,
    lectionaryYear,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
