import { PsalterDay } from './types';
import psalterData from '../../../data/psalter/thirty-day-cycle.json';

const psalter = psalterData as PsalterDay[];

/**
 * Get the 30-day psalter readings for a given date.
 * Day of month determines which psalms are read.
 * Day 31 uses Day 30's psalms.
 */
export function getPsalterForDate(date: Date): { morning: string[]; evening: string[] } {
  let dayOfMonth = date.getDate();

  // Day 31 uses Day 30
  if (dayOfMonth > 30) dayOfMonth = 30;

  const entry = psalter.find((p) => p.day === dayOfMonth);
  if (!entry) {
    return { morning: [], evening: [] };
  }

  return {
    morning: entry.morning,
    evening: entry.evening,
  };
}
