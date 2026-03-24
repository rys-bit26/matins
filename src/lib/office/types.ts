import { LiturgicalDay } from '../calendar/types';

// ─── Lectionary types ───────────────────────────────────────────────────────

export interface LectionaryEntry {
  year?: 'Year One' | 'Year Two';
  season: string;
  week: string;
  day: string;
  title?: string;
  psalms: {
    morning: string[];
    evening: string[];
  };
  lessons: {
    first: string;
    second: string;
    gospel: string;
    altFirst?: string;
    altSecond?: string;
    altGospel?: string;
  };
  notes?: string[];
}

export interface HolyDayLectionaryEntry {
  day: string;        // "Nov 10", "Dec 21", etc.
  title: string;
  psalms: {
    morning: string[];
    evening: string[];
  };
  lessons: {
    morning: { first: string; second: string };
    evening: { first: string; second: string };
  };
}

// ─── Psalter types ──────────────────────────────────────────────────────────

export interface PsalterDay {
  day: number;
  morning: string[];
  evening: string[];
}

// ─── Resolved readings for a specific date ──────────────────────────────────

export interface DailyReadings {
  date: Date;
  liturgicalDay: LiturgicalDay;
  psalms: {
    morning: string[];
    evening: string[];
  };
  lessons: {
    first: string;
    second: string;
    gospel: string;
  };
  title?: string;
}

// ─── Office assembly types ──────────────────────────────────────────────────

export type OfficeType = 'morning' | 'evening' | 'compline';

export interface AssembledOffice {
  type: OfficeType;
  date: Date;
  liturgicalDay: LiturgicalDay;
  sections: AssembledSection[];
}

export interface AssembledSection {
  id: string;
  title: string;
  elements: AssembledElement[];
}

export type ElementType =
  | 'heading'
  | 'rubric'
  | 'text'
  | 'response'
  | 'psalm'
  | 'scripture'
  | 'canticle'
  | 'collect'
  | 'prayer';

export interface AssembledElement {
  type: ElementType;
  content: string;
  speaker?: 'officiant' | 'people' | 'all';
  reference?: string;
  whyTopic?: string;
  translation?: string;
}
