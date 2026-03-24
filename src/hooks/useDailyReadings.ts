import { useMemo } from 'react';
import { resolveLectionary } from '../lib/office/lectionary';
import { DailyReadings } from '../lib/office/types';

/**
 * Returns the resolved Daily Office Lectionary readings for a date.
 */
export function useDailyReadings(date?: Date): DailyReadings {
  const d = date ?? new Date();
  const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  return useMemo(() => resolveLectionary(d), [dateKey]);
}
