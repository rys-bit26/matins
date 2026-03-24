import { useMemo } from 'react';
import { TextStyle } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';
import { getTypeStyles } from '../theme/typography';

/**
 * Returns type styles based on the user's font style preference.
 * Components that render reading content (prayer, scripture, headings)
 * should use this hook instead of importing typeStyles directly.
 */
export function useTypeStyles(): Record<string, TextStyle> {
  const fontStyle = useSettingsStore((s) => s.fontStyle);
  return useMemo(() => getTypeStyles(fontStyle), [fontStyle]);
}
