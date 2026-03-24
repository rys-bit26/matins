export type LiturgicalColor = 'purple' | 'white' | 'green' | 'red' | 'blue' | 'rose' | 'black';

export type Season =
  | 'advent'
  | 'christmas'
  | 'epiphany'
  | 'lent'
  | 'holy-week'
  | 'easter'
  | 'pentecost'       // The day itself
  | 'ordinary-time';  // Season after Pentecost

export type HolyDayType =
  | 'principal-feast'
  | 'major-feast'
  | 'minor-feast'
  | 'fast'
  | 'commemoration';

export interface HolyDay {
  name: string;
  type: HolyDayType;
  color: LiturgicalColor;
  description?: string;
  learnTopic?: string;
}

export interface LiturgicalYear {
  year: number;
  adventStart: Date;
  christmasDay: Date;
  epiphany: Date;
  ashWednesday: Date;
  palmSunday: Date;
  maundyThursday: Date;
  goodFriday: Date;
  holySaturday: Date;
  easterSunday: Date;
  ascension: Date;
  pentecost: Date;
  trinitySunday: Date;
  // Advent of the NEXT church year (marks end of ordinary time)
  nextAdventStart: Date;
}

export interface LiturgicalDay {
  date: Date;
  season: Season;
  week: number;           // Week within the season (1-based)
  dayOfWeek: string;      // 'Sunday' | 'Monday' | ... | 'Saturday'
  color: LiturgicalColor;
  title: string;          // e.g. "The Third Sunday of Lent"
  shortTitle: string;     // e.g. "Lent 3"
  holyDays: HolyDay[];
  lectionaryYear: 'Year One' | 'Year Two';
}

// Season display metadata
export const SEASON_NAMES: Record<Season, string> = {
  'advent': 'Advent',
  'christmas': 'Christmas',
  'epiphany': 'Epiphany',
  'lent': 'Lent',
  'holy-week': 'Holy Week',
  'easter': 'Easter',
  'pentecost': 'The Day of Pentecost',
  'ordinary-time': 'Ordinary Time',
};

export const SEASON_COLORS: Record<Season, LiturgicalColor> = {
  'advent': 'purple',
  'christmas': 'white',
  'epiphany': 'green',
  'lent': 'purple',
  'holy-week': 'red',
  'easter': 'white',
  'pentecost': 'red',
  'ordinary-time': 'green',
};

export const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
] as const;
