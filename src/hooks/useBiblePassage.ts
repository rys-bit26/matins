import { useQuery } from '@tanstack/react-query';
import { parseReference, fetchPassage } from '../lib/bible';
import { BiblePassage, Translation } from '../lib/bible/types';

/**
 * Fetch a Bible passage by reference string and translation.
 * Uses React Query for caching (survives navigation, deduplicates requests).
 */
export function useBiblePassage(
  referenceStr: string,
  translation: Translation = 'web'
) {
  const ref = parseReference(referenceStr);

  return useQuery<BiblePassage | null>({
    queryKey: ['bible', referenceStr, translation],
    queryFn: async () => {
      if (!ref) return null;

      // BSB: will be bundled locally in Phase 3b — for now fall back to WEB
      const apiTranslation = translation === 'bsb' ? 'web' : translation;
      return fetchPassage(ref, apiTranslation);
    },
    enabled: !!ref && !!referenceStr,
    staleTime: Infinity, // Bible text never changes
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache 24 hours
  });
}
