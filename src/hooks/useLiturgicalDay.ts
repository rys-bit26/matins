import { useMemo } from 'react';
import { getLiturgicalDay, LiturgicalDay } from '../lib/calendar';

/**
 * Returns the LiturgicalDay for a given date (defaults to today).
 */
export function useLiturgicalDay(date?: Date): LiturgicalDay {
  const d = date ?? new Date();
  const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  return useMemo(() => getLiturgicalDay(d), [dateKey]);
}
